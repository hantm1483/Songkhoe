"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const supabase = createBrowserClient(
    typeof window !== "undefined"
      ? (window as unknown as { __SUPABASE_URL__: string; __SUPABASE_ANON_KEY__: string }).__SUPABASE_URL__ ||
          process.env.NEXT_PUBLIC_SUPABASE_URL!
      : process.env.NEXT_PUBLIC_SUPABASE_URL!,
    typeof window !== "undefined"
      ? (window as unknown as { __SUPABASE_ANON_KEY__: string }).__SUPABASE_ANON_KEY__ ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

      // Successful login - redirect to dashboard
      window.location.href = "/trangchu";
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
          Đăng nhập
        </h2>

        {error && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-error text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            ref={emailInputRef}
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
              ref={passwordInputRef}
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
              tabIndex={-1}
            >
              <Icon name={showPassword ? "visibility_off" : "visibility"} className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              className="w-5 h-5 rounded border-outline text-primary focus:ring-primary/20"
            />
            <label htmlFor="remember" className="text-body-md text-on-surface">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <Link
            href="/forgot-password"
            className="block text-sm text-primary hover:underline"
          >
            Quên mật khẩu?
          </Link>
          <p className="text-body-md text-on-surface-variant">
            Bạn đã có tài khoản?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}