"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Pill,
  Utensils,
  Plus,
  Bell,
  ChevronRight,
  Droplets,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { glucoseThresholds } from "@/lib/design-system";

// Types
interface GlucoseReading {
  id: string;
  value: number;
  timing: "fasting" | "before_meal" | "after_meal" | "bedtime";
  created_at: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule_time: "morning" | "evening";
  taken: boolean;
}

interface MealLog {
  id: string;
  name: string;
  gi_level: "low" | "medium" | "high";
  time: string;
}

interface HealthTip {
  condition: (g: number, t: string, d: number) => boolean;
  tip: string;
}

// Health tip rules (rule-based personalization)
const glucoseTips: HealthTip[] = [
  {
    condition: (g, t, d) => t === "fasting" && g > 7.0 && d >= 3,
    tip: "Đường huyết lúc đói của bạn đã cao trong 3 ngày liên tiếp. Hãy chú ý đến chế độ ăn và tham khảo ý kiến bác sĩ.",
  },
  {
    condition: (g, t, d) => t === "after_meal" && g > 10.0,
    tip: "Đường huyết sau ăn của bạn cao hơn mức khuyến nghị. Cố gắng đi bộ sau bữa ăn để giảm đường huyết.",
  },
  {
    condition: (g, t, d) => g < 4.0 && t === "fasting",
    tip: "Đường huyết lúc đói của bạn đang ở mức thấp. Hãy ăn nhẹ trước khi lái xe hoặc làm việc cần tập trung.",
  },
  {
    condition: (g, t, d) => t === "bedtime" && g > 8.0,
    tip: "Đường huyết trước khi ngủ cao. Tránh ăn vặt sau 9 giờ tối để có giấc ngủ tốt hơn.",
  },
  {
    condition: (g, t, d) => g > glucoseThresholds.high,
    tip: "Đường huyết của bạn đang cao. Uống nhiều nước và đi bộ nhẹ nhàng sau bữa ăn.",
  },
];

const defaultTips = [
  "Nhớ kiểm tra đường huyết mỗi ngày vào cùng một giờ để theo dõi sức khỏe tốt hơn.",
  "Uống đủ nước mỗi ngày giúp cơ thể loại bỏ độc tố và duy trì cân bằng đường huyết.",
  "Đi bộ 30 phút mỗi ngày giúp cải thiện độ nhạy insulin và sức khỏe tim mạch.",
  "Chia nhỏ bữa ăn trong ngày giúp giữ đường huyết ổn định hơn.",
  "Ngủ đủ 7-8 tiếng mỗi đêm giúp hormone điều hòa đường huyết hoạt động tốt hơn.",
];

// Mock data functions
function getTodayGlucoseReadings(): GlucoseReading[] {
  return [
    { id: "1", value: 5.8, timing: "fasting", created_at: new Date().toISOString() },
  ];
}

function getTodayMedications(): Medication[] {
  return [
    { id: "1", name: "Metformin", dosage: "500mg", schedule_time: "morning", taken: false },
    { id: "2", name: "Gliclazide", dosage: "80mg", schedule_time: "morning", taken: false },
    { id: "3", name: "Metformin", dosage: "500mg", schedule_time: "evening", taken: false },
  ];
}

function getTodayMeals(): MealLog[] {
  return [
    { id: "1", name: "Bữa sáng", gi_level: "medium", time: "07:00" },
    { id: "2", name: "Bữa trưa", gi_level: "low", time: "12:00" },
  ];
}

function getGlucoseStatus(value: number): "normal" | "high" | "low" {
  if (value < glucoseThresholds.low) return "low";
  if (value > glucoseThresholds.high) return "high";
  return "normal";
}

function getHealthTip(glucoseLogs: GlucoseReading[]): string {
  // Check recent glucose readings against rules
  for (const tip of glucoseTips) {
    for (const log of glucoseLogs) {
      if (tip.condition(log.value, log.timing, 1)) {
        return tip.tip;
      }
    }
  }
  // Return random default tip if no rule matches
  return defaultTips[Math.floor(Math.random() * defaultTips.length)];
}

// Glucose Summary Card
function GlucoseSummaryCard({ readings }: { readings: GlucoseReading[] }) {
  const latestReading = readings[0];
  const status = latestReading ? getGlucoseStatus(latestReading.value) : "normal";

  const statusColors = {
    normal: "bg-primary text-on-primary",
    high: "bg-warningHigh text-white",
    low: "bg-warningLow text-amber-900",
  };

  const statusLabels = {
    normal: "Bình thường",
    high: "Cao",
    low: "Thấp",
  };

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-primary" />
          Đường huyết hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent>
        {latestReading ? (
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-display-lg font-bold text-on-surface">
                {latestReading.value}
              </span>
              <span className="text-body-md text-on-surface-variant">mmol/L</span>
            </div>
            <Badge variant={status === "normal" ? "success" : status === "high" ? "error" : "warning"}>
              {statusLabels[status]}
            </Badge>
          </div>
        ) : (
          <div className="text-body-lg text-on-surface-variant">
            Chưa có dữ liệu hôm nay
          </div>
        )}
        <div className="mt-3 text-label-lg text-on-surface-variant">
          {latestReading?.timing === "fasting"
            ? "Lúc đói"
            : latestReading?.timing === "after_meal"
            ? "Sau ăn"
            : latestReading?.timing === "before_meal"
            ? "Trước ăn"
            : latestReading?.timing === "bedtime"
            ? "Trước ngủ"
            : "Chưa đo"}
        </div>
      </CardContent>
    </Card>
  );
}

// Medication Reminder List
function MedicationReminderList({
  medications,
  onToggle,
}: {
  medications: Medication[];
  onToggle: (id: string) => void;
}) {
  const morningMeds = medications.filter((m) => m.schedule_time === "morning");
  const eveningMeds = medications.filter((m) => m.schedule_time === "evening");

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="w-5 h-5 text-primary" />
          Nhắc nhở uống thuốc
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span className="text-label-lg font-semibold text-on-surface">Buổi sáng</span>
            </div>
            <div className="space-y-2">
              {morningMeds.map((med) => (
                <button
                  key={med.id}
                  onClick={() => onToggle(med.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg min-h-touch-target",
                    "bg-surface-container-low transition-colors duration-200",
                    "hover:bg-surface-container"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        med.taken
                          ? "bg-primary border-primary"
                          : "border-outline"
                      )}
                    >
                      {med.taken && (
                        <svg
                          className="w-4 h-4 text-on-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-body-lg text-on-surface">{med.name}</div>
                      <div className="text-label-lg text-on-surface-variant">
                        {med.dosage}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-indigo-500" />
              <span className="text-label-lg font-semibold text-on-surface">Buổi tối</span>
            </div>
            <div className="space-y-2">
              {eveningMeds.map((med) => (
                <button
                  key={med.id}
                  onClick={() => onToggle(med.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg min-h-touch-target",
                    "bg-surface-container-low transition-colors duration-200",
                    "hover:bg-surface-container"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                        med.taken
                          ? "bg-primary border-primary"
                          : "border-outline"
                      )}
                    >
                      {med.taken && (
                        <svg
                          className="w-4 h-4 text-on-primary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-body-lg text-on-surface">{med.name}</div>
                      <div className="text-label-lg text-on-surface-variant">
                        {med.dosage}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Meal Summary Card
function MealSummaryCard({ meals }: { meals: MealLog[] }) {
  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          Bữa ăn hôm nay
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="flex items-center justify-between py-2 border-b border-outline-variant last:border-0"
            >
              <div>
                <div className="text-body-lg text-on-surface">{meal.name}</div>
                <div className="text-label-lg text-on-surface-variant">{meal.time}</div>
              </div>
              <Badge
                variant={
                  meal.gi_level === "low"
                    ? "success"
                    : meal.gi_level === "medium"
                    ? "warning"
                    : "error"
                }
              >
                {meal.gi_level === "low"
                  ? "GI Thấp"
                  : meal.gi_level === "medium"
                  ? "GI TB"
                  : "GI Cao"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Health Tip Card
function HealthTipCard({ tip }: { tip: string }) {
  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Lời khuyên sức khỏe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-body-lg text-on-surface leading-relaxed">{tip}</p>
      </CardContent>
    </Card>
  );
}

// Quick Actions
function QuickActions() {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Link href="/nhatky">
        <Button variant="primary" size="lg" className="w-full h-full flex flex-col gap-1">
          <Droplets className="w-6 h-6" />
          <span className="text-label-lg">Đo đường</span>
        </Button>
      </Link>
      <Link href="/bua-an">
        <Button variant="secondary" size="lg" className="w-full h-full flex flex-col gap-1">
          <Utensils className="w-6 h-6" />
          <span className="text-label-lg"> Ăn</span>
        </Button>
      </Link>
      <Link href="/thuoc">
        <Button variant="ghost" size="lg" className="w-full h-full flex flex-col gap-1 border border-outline">
          <Pill className="w-6 h-6" />
          <span className="text-label-lg">Thuốc</span>
        </Button>
      </Link>
    </div>
  );
}

// Notification Permission Prompt
function NotificationPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if notifications were previously enabled
    const enabled = localStorage.getItem("notifications_enabled");
    if (!enabled) {
      setShowPrompt(true);
    } else {
      setDismissed(true);
    }
  }, []);

  const handleEnable = async () => {
    if (!("Notification" in window)) {
      alert("Trình duyệt này không hỗ trợ thông báo");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      localStorage.setItem("notifications_enabled", "true");
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (dismissed || !showPrompt) return null;

  return (
    <Card variant="elevated" className="w-full border-2 border-primary/30">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-full">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-body-lg font-semibold text-on-surface mb-1">
              Bật thông báo nhắc nhở
            </h3>
            <p className="text-body-md text-on-surface-variant mb-3">
              Nhận thông báo uống thuốc và kiểm tra đường huyết đúng giờ
            </p>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleEnable}>
                Bật ngay
              </Button>
              <Button variant="ghost" onClick={handleDismiss}>
                Để sau
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main Page Component
export default function TrangchuPage() {
  const [glucoseReadings, setGlucoseReadings] = useState<GlucoseReading[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [healthTip, setHealthTip] = useState<string>("");

  useEffect(() => {
    // Load mock data
    setGlucoseReadings(getTodayGlucoseReadings());
    setMedications(getTodayMedications());
    setMeals(getTodayMeals());
    setHealthTip(getHealthTip(getTodayGlucoseReadings()));
  }, []);

  const handleMedicationToggle = (id: string) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med))
    );
  };

  return (
    <Page title="Trang chủ">
      <div className="p-6 space-y-4">
        <GlucoseSummaryCard readings={glucoseReadings} />
        <MedicationReminderList medications={medications} onToggle={handleMedicationToggle} />
        <MealSummaryCard meals={meals} />
        <HealthTipCard tip={healthTip} />
        <NotificationPermissionPrompt />
        <QuickActions />
      </div>
    </Page>
  );
}