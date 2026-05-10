"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Plus, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface MealLog {
  id: string;
  name: string;
  gi_level: "low" | "medium" | "high";
  time: string;
  notes?: string;
  created_at: string;
}

const GI_OPTIONS = [
  { value: "low", label: "Thấp (GI < 55)" },
  { value: "medium", label: "Trung bình (GI 55-70)" },
  { value: "high", label: "Cao (GI > 70)" },
];

const TIME_OPTIONS = [
  { value: "06:00", label: "06:00" },
  { value: "07:00", label: "07:00" },
  { value: "08:00", label: "08:00" },
  { value: "09:00", label: "09:00" },
  { value: "10:00", label: "10:00" },
  { value: "11:00", label: "11:00" },
  { value: "12:00", label: "12:00" },
  { value: "13:00", label: "13:00" },
  { value: "14:00", label: "14:00" },
  { value: "15:00", label: "15:00" },
  { value: "16:00", label: "16:00" },
  { value: "17:00", label: "17:00" },
  { value: "18:00", label: "18:00" },
  { value: "19:00", label: "19:00" },
  { value: "20:00", label: "20:00" },
  { value: "21:00", label: "21:00" },
];

// Generate mock meals
function generateMockMeals(): MealLog[] {
  const meals: MealLog[] = [
    {
      id: "1",
      name: "Bữa sáng",
      gi_level: "medium",
      time: "07:00",
      notes: "Phở bò",
      created_at: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      name: "Bữa trưa",
      gi_level: "low",
      time: "12:00",
      notes: "Cơm + cá hồi + rau cải",
      created_at: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      name: "Bữa xế",
      gi_level: "medium",
      time: "15:00",
      notes: "Chuối",
      created_at: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "4",
      name: "Bữa tối",
      gi_level: "low",
      time: "19:00",
      notes: "Xúp + thịt gà + cơm",
      created_at: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "5",
      name: "Bữa sáng",
      gi_level: "medium",
      time: "07:30",
      notes: "Bánh mì trứng",
      created_at: new Date(-1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "6",
      name: "Bữa trưa",
      gi_level: "low",
      time: "12:00",
      notes: "Cơm + thịt bò + rau muống",
      created_at: new Date(-1 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return meals.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

// GI Indicator Component
function GIIndicator({ level }: { level: "low" | "medium" | "high" }) {
  const config = {
    low: {
      label: "GI Thấp",
      color: "bg-primary/10 text-primary border-primary/20",
      description: "Tăng đường huyết chậm",
    },
    medium: {
      label: "GI Trung bình",
      color: "bg-amber-100 text-amber-700 border-amber-200",
      description: "Tăng đường huyết vừa",
    },
    high: {
      label: "GI Cao",
      color: "bg-error/10 text-error border-error/20",
      description: "Tăng đường huyết nhanh",
    },
  };

  const { label, color, description } = config[level];

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center px-3 py-1.5 rounded-full border",
        color
      )}
    >
      <span className="text-label-lg font-semibold">{label}</span>
      <span className="text-xs opacity-75">{description}</span>
    </div>
  );
}

// Meal Log Form
function MealLogForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { name: string; gi_level: string; time: string; notes?: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [giLevel, setGiLevel] = useState("low");
  const [time, setTime] = useState("12:00");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      gi_level: giLevel,
      time,
      notes: notes || undefined,
    });
  };

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle>Thêm bữa ăn</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Tên bữa ăn"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: Bữa sáng, Bữa trưa..."
        />

        <Select
          label="Chỉ số GI"
          options={GI_OPTIONS}
          value={giLevel}
          onChange={(e) => setGiLevel(e.target.value)}
        />

        <Select
          label="Giờ ăn"
          options={TIME_OPTIONS}
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />

        <Input
          label="Ghi chú món ăn"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="VD: Cơm + cá + rau..."
        />

        <div className="flex gap-3 pt-2">
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            <Plus className="w-5 h-5" />
            Lưu
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Huỷ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Meal History List
function MealHistoryList({ meals }: { meals: MealLog[] }) {
  // Group by date
  const grouped: Record<string, MealLog[]> = {};
  meals.forEach((meal) => {
    const dateKey = new Date(meal.created_at).toLocaleDateString("vi-VN", {
      weekday: "long",
      day: "numeric",
      month: "numeric",
    });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(meal);
  });

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          <h3 className="text-label-lg font-semibold text-on-surface-variant mb-2">
            {date}
          </h3>
          <div className="space-y-2">
            {items.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-surface-container-high p-2 rounded-lg">
                    <UtensilsCrossed className="w-5 h-5 text-on-surface-variant" />
                  </div>
                  <div>
                    <div className="text-body-lg text-on-surface">{meal.name}</div>
                    <div className="text-label-lg text-on-surface-variant flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meal.time}
                      {meal.notes && ` - ${meal.notes}`}
                    </div>
                  </div>
                </div>
                <GIIndicator level={meal.gi_level} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Page Component
export default function BuaAnPage() {
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMeals(generateMockMeals());
      setLoading(false);
    }, 300);
  }, []);

  const handleSubmit = (data: {
    name: string;
    gi_level: string;
    time: string;
    notes?: string;
  }) => {
    const newMeal: MealLog = {
      id: Date.now().toString(),
      name: data.name,
      gi_level: data.gi_level as "low" | "medium" | "high",
      time: data.time,
      notes: data.notes,
      created_at: new Date().toISOString(),
    };

    setMeals((prev) => [newMeal, ...prev]);
    setShowForm(false);
  };

  // Calculate today's stats
  const todayMeals = meals.filter((m) => {
    const today = new Date().toDateString();
    return new Date(m.created_at).toDateString() === today;
  });

  const giCounts = {
    low: todayMeals.filter((m) => m.gi_level === "low").length,
    medium: todayMeals.filter((m) => m.gi_level === "medium").length,
    high: todayMeals.filter((m) => m.gi_level === "high").length,
  };

  return (
    <Page title="Bữa ăn">
      <div className="space-y-4 p-6">
        {/* Today's Summary */}
        <Card variant="elevated" className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-primary" />
              Hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-primary/10">
                <div className="text-headline-md text-primary">{giCounts.low}</div>
                <div className="text-label-lg text-on-surface-variant">GI Thấp</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-100">
                <div className="text-headline-md text-amber-700">{giCounts.medium}</div>
                <div className="text-label-lg text-on-surface-variant">GI TB</div>
              </div>
              <div className="p-3 rounded-lg bg-error/10">
                <div className="text-headline-md text-error">{giCounts.high}</div>
                <div className="text-label-lg text-on-surface-variant">GI Cao</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GI Legend */}
        <Card variant="default" className="w-full">
          <CardContent className="pt-4">
            <div className="grid grid-cols-3 gap-2">
              <GIIndicator level="low" />
              <GIIndicator level="medium" />
              <GIIndicator level="high" />
            </div>
          </CardContent>
        </Card>

        {/* Add Form */}
        {showForm ? (
          <MealLogForm
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={() => setShowForm(true)}
            className="w-full"
          >
            <Plus className="w-5 h-5" />
            Thêm bữa ăn
          </Button>
        )}

        {/* History */}
        <div>
          <h2 className="text-headline-md text-on-surface mb-3">Lịch sử</h2>
          {!loading && meals.length > 0 ? (
            <MealHistoryList meals={meals.slice(0, 15)} />
          ) : loading ? (
            <div className="text-center py-8 text-on-surface-variant">Đang tải...</div>
          ) : (
            <div className="text-center py-8 text-on-surface-variant">
              Chưa có bữa ăn nào
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}