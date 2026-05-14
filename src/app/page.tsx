"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Droplets, Utensils, Activity, Calendar, ClipboardList, BookOpen, ArrowRight } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

function getGuestDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sk_demo_uid");
}

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if user should be redirected
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        // Has Supabase session → go to /trangchu
        router.replace("/trangchu");
      } else {
        const guestId = getGuestDeviceId();
        if (guestId) {
          // Has guest session → go to /trangchu
          router.replace("/trangchu");
        }
        // else: show landing page
      }
    });
  }, [router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="px-6 py-16 text-center">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
          <Activity className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-black text-emerald-900 mb-3">Sổ Tay Tiểu Đường</h1>
        <p className="text-lg text-emerald-700 max-w-md mx-auto mb-8">
          Người bạn đồng hành đáng tin cậy trong hành trình kiểm soát bệnh tiểu đường
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
        >
          Bắt đầu ngay <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Features Grid */}
      <div className="px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <FeatureCard
            icon={Droplets}
            title="Theo dõi đường huyết"
            description="Ghi nhận và theo dõi chỉ số đường huyết hàng ngày"
            href="/blood-sugar"
          />
          <FeatureCard
            icon={Utensils}
            title="Dinh dưỡng"
            description="Lên kế hoạch ăn uống cân bằng cho chỉ số ổn định"
            href="/nutrition"
          />
          <FeatureCard
            icon={Activity}
            title="Chế độ sinh hoạt"
            description="Quản lý lịch trình vận động và nghỉ ngơi"
            href="/lifestyle"
          />
          <FeatureCard
            icon={Calendar}
            title="Lịch tầm soát"
            description="Nhắc nhở các cuộc hẹn kiểm tra sức khỏe định kỳ"
            href="/screening"
          />
          <FeatureCard
            icon={ClipboardList}
            title="Nhật ký sức khỏe"
            description="Theo dõi tổng quan tình trạng sức khỏe"
            href="/health-diary"
          />
          <FeatureCard
            icon={BookOpen}
            title="Kiến thức"
            description="Cập nhật thông tin hữu ích về bệnh tiểu đường"
            href="/knowledge"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pb-8 text-sm text-emerald-600">
        <p>© 2024 Sổ Tay Tiểu Đường - Sống Khỏe Mỗi Ngày</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, href }: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group p-6 bg-white rounded-3xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all"
    >
      <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 group-hover:bg-emerald-500 transition-colors">
        <Icon className="h-6 w-6 text-emerald-600 group-hover:text-white transition-colors" />
      </div>
      <h3 className="text-lg font-bold text-emerald-900 mb-2">{title}</h3>
      <p className="text-sm text-emerald-700">{description}</p>
    </Link>
  );
}