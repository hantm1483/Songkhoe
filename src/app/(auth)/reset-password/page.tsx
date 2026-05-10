"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(false);

  const supabase = typeof window !== "undefined"
    ? createBrowserClient(
        (window as unknown as { __SUPABASE_URL__: string }).__SUPABASE_URL__ ||
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
        (window as unknown as { __SUPABASE_ANON_KEY__: string }).__SUPABASE_ANON_KEY__ ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

  useEffect(() => {
    // Check if user has a valid session from password reset link
    const checkSession = async () => {
      if (!supabase) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setValidToken(true);
      } else {
        // Try to get session from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          setValidToken(true);
        }
      }
    };

    checkSession();
  }, [supabase]);

  const passwordRequirements = [
    { label: "Tối thiểu 12 ký tự", met: password.length >= 12 },
    { label: "Có chữ cái viết hoa", met: /[A-Z]/.test(password) },
    { label: "Có chữ cái viết thường", met: /[a-z]/.test(password) },
    { label: "Có số", met: /[0-9]/.test(password) },
    { label: "Có ký tự đặc biệt", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validToken) {
      setError("Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn");
      return;
    }

    if (!allRequirementsMet) {
      setError("Mật khẩu phải đáp ứng tất cả yêu cầu bên dưới");
      return;
    }

    if (!passwordsMatch) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!supabase) {
      setError("Lỗi khởi tạo. Vui lòng tải lại trang.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (!validToken) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl shadow-soft-teal p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">!</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface mb-2">
              Liên kết không hợp lệ
            </h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu
              cầu đặt lại mật khẩu mới.
            </p>
            <Button
              onClick={() => router.push("/forgot-password")}
              variant="secondary"
              className="w-full"
            >
              Yêu cầu đặt lại mật khẩu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl shadow-soft-teal p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface mb-2">
              Đặt lại mật khẩu thành công
            </h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Mật khẩu của bạn đã được cập nhật. Đang chuyển đến trang đăng
              nhập...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-2xl shadow-soft-teal p-6">
        <h2 className="text-xl font-bold text-on-surface text-center mb-6">
          Đặt lại mật khẩu
        </h2>

        {error && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-error text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Mật khẩu mới"
            placeholder="Tối thiểu 12 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="space-y-2 p-3 bg-surface-container-low rounded-lg">
              <p className="text-xs text-on-surface-variant mb-1">
                Yêu cầu mật khẩu:
              </p>
              <div className="grid grid-cols-2 gap-1">
                {passwordRequirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1 text-xs ${
                      req.met ? "text-success" : "text-on-surface-variant"
                    }`}
                  >
                    <span className={req.met ? "opacity-100" : "opacity-30"}>✓</span>
                    {req.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Input
            type="password"
            label="Xác nhận mật khẩu mới"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={
              confirmPassword.length > 0 && !passwordsMatch
                ? "Mật khẩu không khớp"
                : undefined
            }
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading || !allRequirementsMet || !passwordsMatch}
          >
            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </Button>
        </form>
      </div>
    </div>
  );
}