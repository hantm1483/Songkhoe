"use client";

import { useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const supabase = typeof window !== "undefined"
    ? createBrowserClient(
        (window as unknown as { __SUPABASE_URL__: string }).__SUPABASE_URL__ ||
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
        (window as unknown as { __SUPABASE_ANON_KEY__: string }).__SUPABASE_ANON_KEY__ ||
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!supabase) {
      setError("Lỗi khởi tạo. Vui lòng tải lại trang.");
      setLoading(false);
      return;
    }

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Đã xảy ra lỗi. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl shadow-soft-teal p-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-on-surface mb-2">
              Đã gửi liên kết đặt lại mật khẩu
            </h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn. Vui
              lòng kiểm tra hộp thư và nhấp vào liên kết để đặt lại mật khẩu.
            </p>
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-2xl shadow-soft-teal p-6">
        <h2 className="text-xl font-bold text-on-surface text-center mb-2">
          Quên mật khẩu?
        </h2>
        <p className="text-body-md text-on-surface-variant text-center mb-6">
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu
        </p>

        {error && (
          <div className="bg-error/10 border border-error/30 rounded-lg p-3 mb-4">
            <p className="text-sm text-error text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-body-md text-on-surface-variant">
            Nhớ mật khẩu?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}