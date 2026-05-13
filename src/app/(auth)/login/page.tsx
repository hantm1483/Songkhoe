"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ChevronRight, User, UserCircle, ArrowLeft, Eye, EyeOff, Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearDemoUid } from "@/lib/demo-user";

type AuthMode = "choice" | "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("choice");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Password strength requirements
  const passwordRequirements = [
    { label: "Tối thiểu 12 ký tự", met: password.length >= 12 },
    { label: "Có chữ hoa (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Có chữ thường (a-z)", met: /[a-z]/.test(password) },
    { label: "Có số (0-9)", met: /[0-9]/.test(password) },
    { label: "Có ký tự đặc biệt", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
  const allRequirementsMet = passwordRequirements.every((req) => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // Generate or get device ID
      let deviceId = localStorage.getItem("sk_demo_uid");
      if (!deviceId) {
        deviceId = crypto.randomUUID();
        localStorage.setItem("sk_demo_uid", deviceId);
      }

      // Set guest session cookie (expires in 30 days)
      document.cookie = `sk_guest_session=${deviceId}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=strict`;

      // Clear any old demo UID to start fresh
      clearDemoUid();
      window.location.href = "/trangchu";
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.includes("Invalid login")) {
          setError("Email hoặc mật khẩu không đúng");
        } else {
          setError(signInError.message);
        }
        return;
      }

      window.location.href = "/trangchu";
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allRequirementsMet) {
      setError("Mật khẩu phải đáp ứng tất cả yêu cầu bên dưới");
      return;
    }

    if (!passwordsMatch) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (!fullName.trim()) {
      setError("Vui lòng nhập họ và tên");
      return;
    }

    setLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName.trim() },
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

      // Auto login after successful registration
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Registration succeeded but login failed - redirect to login page
        setMode("login");
        setError("Đăng ký thành công! Vui lòng đăng nhập.");
        setPassword("");
        return;
      }

      window.location.href = "/trangchu";
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setError("");
    setShowPassword(false);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Choice Screen */}
      {mode === "choice" && (
        <div className="bg-surface rounded-[32px] shadow-soft-teal p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-on-surface uppercase tracking-tight">
              Chào mừng bạn
            </h2>
            <p className="text-sm text-on-surface-variant">
              Chọn cách để bắt đầu với Sổ Tay Tiểu Đường
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full p-6 rounded-[24px] bg-natural-light border-2 border-natural-border hover:border-natural-primary hover:bg-natural-light/80 transition-all text-left group disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-natural-primary flex items-center justify-center shadow-lg shadow-natural-primary/20">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-black text-on-surface uppercase tracking-wide">
                    Tiếp tục với Guest
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Dữ liệu được lưu theo thiết bị của bạn
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-natural-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-4 text-on-surface-variant">Hoặc</span>
              </div>
            </div>

            <button
              onClick={() => { setMode("login"); resetForm(); }}
              className="w-full p-6 rounded-[24px] bg-primary/10 border-2 border-primary/20 hover:border-primary hover:bg-primary/20 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                  <UserCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-black text-on-surface uppercase tracking-wide">
                    Đăng ký / Đăng nhập
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    Tạo tài khoản để đồng bộ dữ liệu
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Login Form */}
      {mode === "login" && (
        <div className="bg-surface rounded-[32px] shadow-soft-teal p-8 space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setMode("choice"); resetForm(); }}
              className="p-2 rounded-xl hover:bg-surface-container-low transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </button>
            <h2 className="text-xl font-black text-on-surface uppercase tracking-tight">
              Đăng nhập
            </h2>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/30 rounded-xl p-4">
              <p className="text-sm text-error text-center font-bold">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-on-surface-variant hover:text-primary transition-colors"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <button
              onClick={() => setMode("register")}
              className="text-sm text-primary hover:underline font-semibold"
            >
              Chưa có tài khoản? Đăng ký ngay
            </button>
          </div>
        </div>
      )}

      {/* Register Form */}
      {mode === "register" && (
        <div className="bg-surface rounded-[32px] shadow-soft-teal p-8 space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setMode("choice"); resetForm(); }}
              className="p-2 rounded-xl hover:bg-surface-container-low transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-on-surface-variant" />
            </button>
            <h2 className="text-xl font-black text-on-surface uppercase tracking-tight">
              Tạo tài khoản mới
            </h2>
          </div>

          {error && (
            <div className="bg-error/10 border border-error/30 rounded-xl p-4">
              <p className="text-sm text-error text-center font-bold">{error}</p>
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
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>

            {/* Password strength */}
            {password.length > 0 && (
              <div className="space-y-2 p-4 rounded-xl bg-surface-container-low">
                <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                  Yêu cầu mật khẩu:
                </p>
                <div className="space-y-1">
                  {passwordRequirements.map((req, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                        req.met ? "text-success" : "text-on-surface-variant"
                      }`}
                    >
                      <Check className={`w-4 h-4 ${req.met ? "text-success" : "text-outline"}`} />
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative">
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
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading || !allRequirementsMet || !passwordsMatch}
            >
              {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setMode("login")}
              className="text-sm text-primary hover:underline font-semibold"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          </div>
        </div>
      )}
    </div>
  );
}