"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Password strength requirements
  const passwordRequirements = [
    { label: "Tối thiểu 12 ký tự", met: password.length >= 12 },
    { label: "Có chữ cái viết hoa", met: /[A-Z]/.test(password) },
    { label: "Có chữ cái viết thường", met: /[a-z]/.test(password) },
    { label: "Có số", met: /[0-9]/.test(password) },
    { label: "Có ký tự đặc biệt", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  // Create Supabase client for browser
  const supabase = typeof window !== "undefined"
    ? createBrowserClient(
        (window as unknown as { __SUPABASE_URL__: string }).__SUPABASE_URL__ ||
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
        (window as unknown as { __SUPABASE_ANON_KEY__: string }).__SUPABASE_ANON_KEY__ ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate password
    if (!allRequirementsMet) {
      setError("Mật khẩu phải đáp ứng tất cả yêu cầu bên dưới");
      return;
    }

    // Validate passwords match
    if (!passwordsMatch) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    // Validate full name
    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên");
      return;
    }

    if (!supabase) {
      setError("Lỗi khởi tạo. Vui lòng tải lại trang.");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError("Email này đã được đăng ký");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      // Show success message
      alert(
        "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
      );
      window.location.href = "/login";
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-2xl shadow-soft-teal p-6">
        <h2 className="text-xl font-bold text-on-surface text-center mb-6">
          Đăng ký tài khoản
        </h2>

        {error && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-error text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            type="text"
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />

          <Input
            type="email"
            label="Email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
          />

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Mật khẩu"
              placeholder="Tối thiểu 12 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-on-surface-variant hover:text-primary transition-colors"
              tabIndex={-1}
            >
              <Icon name={showPassword ? "visibility_off" : "visibility"} className="w-5 h-5" />
            </button>
          </div>

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
                    <Icon name="check" className={`w-3 h-3 ${req.met ? "opacity-100" : "opacity-30"}`} />
                    {req.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Input
            type={showPassword ? "text" : "password"}
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            error={confirmPassword.length > 0 && !passwordsMatch ? "Mật khẩu không khớp" : undefined}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading || !allRequirementsMet || !passwordsMatch}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-body-md text-on-surface-variant">
            Chưa có tài khoản?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}