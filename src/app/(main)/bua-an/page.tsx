"use client";

import { useState, useEffect, useCallback } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

// Types
interface MealLog {
  id: string;
  name: string;
  gi_level: "low" | "medium" | "high";
  time: string;
  notes?: string;
  created_at: string;
}

// GI Legend
function GILegend() {
  return (
    <div className="space-y-2 p-4 rounded-2xl bg-surface-container-lowest">
      <div className="flex items-center gap-2 text-body-md">
        <span className="w-3 h-3 rounded-full bg-primary" />
        <span className="text-on-surface">Thấp:</span>
        <span className="text-on-surface-variant">Rau xanh, đậu, cá</span>
      </div>
      <div className="flex items-center gap-2 text-body-md">
        <span className="w-3 h-3 rounded-full bg-warning" />
        <span className="text-on-surface">Trung bình:</span>
        <span className="text-on-surface-variant">Gạo, bánh mì</span>
      </div>
      <div className="flex items-center gap-2 text-body-md">
        <span className="w-3 h-3 rounded-full bg-error" />
        <span className="text-on-surface">Cao:</span>
        <span className="text-on-surface-variant">Bánh ngọt, nước ngọt</span>
      </div>
    </div>
  );
}

// GI Badge
function GIBadge({ level }: { level: "low" | "medium" | "high" }) {
  return (
    <span className={cn(
      "px-2 py-1 rounded-full text-label-lg font-medium",
      level === "low" && "bg-primary/10 text-primary",
      level === "medium" && "bg-warning/10 text-warning",
      level === "high" && "bg-error/10 text-error"
    )}>
      {level === "low" ? "GI Thấp" : level === "medium" ? "GI TB" : "GI Cao"}
    </span>
  );
}

// Meal History Item
function MealHistoryItem({ meal }: { meal: MealLog }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant">
      <div className="flex items-center gap-3">
        <Icon name="restaurant" className="w-5 h-5 text-on-surface-variant" />
        <div>
          <div className="text-body-lg text-on-surface">{meal.name}</div>
          <div className="text-label-lg text-on-surface-variant flex items-center gap-1">
            {meal.time}
            {meal.notes && ` - ${meal.notes}`}
          </div>
        </div>
      </div>
      <GIBadge level={meal.gi_level} />
    </div>
  );
}

// Featured Meal Plan Hero
function MealPlanFeatured() {
  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-primary-container to-secondary-container p-6 overflow-hidden">
      <div className="absolute right-0 top-0 w-32 h-32 opacity-10">
        <Icon name="set_meal" className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <h2 className="text-headline-md text-on-primary-container mb-2">
          Nổi bật: Thực đơn Low GI
        </h2>
        <p className="text-body-md text-on-primary-container/80 mb-4">
          Trong 7 ngày
        </p>
        <Button variant="primary" size="lg" className="shadow-lg active:scale-95">
          Bắt đầu ngay
        </Button>
      </div>
    </div>
  );
}

// Main Page Component
export default function BuaAnPage() {
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("meals")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      setMeals(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    <Page title="Dinh dưỡng">
      <div className="p-6 space-y-4">
        {/* Featured Meal Plan Hero */}
        <MealPlanFeatured />

        {/* Today's GI Summary */}
        <Card variant="elevated" className="w-full rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="calendar_today" className="w-5 h-5 text-primary" />
              Hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-primary/10">
                <div className="text-headline-md text-primary">{giCounts.low}</div>
                <div className="text-label-lg text-on-surface-variant">GI Thấp</div>
              </div>
              <div className="p-3 rounded-xl bg-warning/10">
                <div className="text-headline-md text-warning">{giCounts.medium}</div>
                <div className="text-label-lg text-on-surface-variant">GI TB</div>
              </div>
              <div className="p-3 rounded-xl bg-error/10">
                <div className="text-headline-md text-error">{giCounts.high}</div>
                <div className="text-label-lg text-on-surface-variant">GI Cao</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GI Legend */}
        <GILegend />

        {/* History */}
        <div>
          <h2 className="text-headline-md text-on-surface mb-3">Lịch sử</h2>
          {!loading && meals.length > 0 ? (
            <div className="space-y-2">
              {meals.slice(0, 10).map((meal) => (
                <MealHistoryItem key={meal.id} meal={meal} />
              ))}
            </div>
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
