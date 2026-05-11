"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

// Types
interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule_time: "morning" | "evening";
  taken: boolean;
}

interface ScheduleItem {
  time: string;
  label: string;
  completed: boolean;
}

interface MealSuggestion {
  name: string;
  gi: "low" | "medium" | "high";
  icon: string;
}

// Generate mock medications
function generateMockMedications(): Medication[] {
  return [
    { id: "1", name: "Metformin", dosage: "500mg", schedule_time: "morning", taken: false },
    { id: "2", name: "Gliclazide", dosage: "80mg", schedule_time: "morning", taken: false },
    { id: "3", name: "Metformin", dosage: "500mg", schedule_time: "evening", taken: false },
  ];
}

// Schedule timeline data
const SCHEDULE_ITEMS: ScheduleItem[] = [
  { time: "06:00", label: "Thức dậy & Kiểm tra", completed: true },
  { time: "07:00", label: "Uống thuốc sáng", completed: true },
  { time: "11:30", label: "Bữa trưa dinh dưỡng", completed: false },
  { time: "19:00", label: "Uống thuốc tối", completed: false },
  { time: "22:00", label: "Ngủ nghỉ", completed: false },
];

// Meal suggestions (Low GI)
const MEAL_SUGGESTIONS: MealSuggestion[] = [
  { name: "Salad Quinoa", gi: "low", icon: "eco" },
  { name: "Yến mạch", gi: "low", icon: "breakfast_dining" },
  { name: "Gạo lứt", gi: "medium", icon: "rice_bowl" },
];

// Welcome Card with gradient
function WelcomeCard() {
  const today = new Date();
  const dateStr = today.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" });

  const completedCount = SCHEDULE_ITEMS.filter(s => s.completed).length;
  const completionPercent = Math.round((completedCount / SCHEDULE_ITEMS.length) * 100);

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-primary-container to-secondary-container p-6 overflow-hidden">
      <div className="absolute right-0 bottom-0 w-40 h-40 opacity-20">
        <Icon name="set_meal" className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <h2 className="text-headline-md text-on-primary-container mb-1">
          Chào buổi sáng!
        </h2>
        <p className="text-body-md text-on-primary-container/80 mb-4">
          Kế hoạch hôm nay
        </p>
        <div className="flex items-center gap-4 text-body-md text-on-primary-container">
          <span className="flex items-center gap-1">
            <Icon name="calendar_today" className="w-5 h-5" />
            {dateStr}
          </span>
          <span className="flex items-center gap-1">
            <Icon name="check_circle" className="w-5 h-5" />
            {completionPercent}% Hoàn tất
          </span>
        </div>
      </div>
    </div>
  );
}

// Schedule Timeline with border-l-2
function ScheduleTimeline() {
  return (
    <Card variant="elevated" className="w-full rounded-2xl">
      <CardContent className="pt-4">
        <h3 className="text-body-lg font-semibold text-on-surface mb-4">Lịch trình hôm nay</h3>
        <div className="space-y-0">
          {SCHEDULE_ITEMS.map((item, index) => (
            <div
              key={index}
              className={cn(
                "relative pl-6 pb-4 border-l-2 border-primary",
                index === SCHEDULE_ITEMS.length - 1 && "border-l-2 border-transparent"
              )}
            >
              <div className={cn(
                "absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-primary bg-surface",
                item.completed && "bg-primary"
              )}>
                {item.completed && (
                  <Icon name="check" className="w-3 h-3 text-on-primary" />
                )}
              </div>
              <span className="text-label-lg text-on-surface-variant">{item.time}</span>
              <span className="text-body-lg text-on-surface ml-2">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Medication Item - rounded-xl
function MedicationItem({
  medication,
  onToggle,
}: {
  medication: Medication;
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(medication.id)}
      className={cn(
        "w-full flex items-center justify-between p-4 rounded-xl",
        "bg-surface-container-lowest border border-outline-variant",
        medication.taken && "bg-primary-container/30 border-primary"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
            medication.taken
              ? "bg-primary border-primary"
              : "border-outline"
          )}
        >
          {medication.taken && (
            <Icon name="check" className="w-4 h-4 text-on-primary" />
          )}
        </div>
        <div className="text-left">
          <div className={cn(
            "text-body-lg",
            medication.taken && "line-through text-on-surface-variant"
          )}>
            {medication.name}
          </div>
          <div className="text-label-lg text-on-surface-variant">
            {medication.dosage}
          </div>
        </div>
      </div>
      <span className="text-label-lg text-on-surface-variant">
        {medication.schedule_time === "morning" ? "Sáng" : "Tối"}
      </span>
    </button>
  );
}

// Meal Suggestion Card - rounded-2xl
function MealSuggestionCard({ suggestion }: { suggestion: MealSuggestion }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant">
      <Icon name={suggestion.icon} className="w-8 h-8 text-primary" />
      <span className="text-body-md text-on-surface font-medium">{suggestion.name}</span>
      <span className={cn(
        "px-2 py-0.5 rounded-full text-label-lg",
        suggestion.gi === "low" && "bg-primary/10 text-primary",
        suggestion.gi === "medium" && "bg-warning/10 text-warning",
        suggestion.gi === "high" && "bg-error/10 text-error"
      )}>
        GI {suggestion.gi === "low" ? "Thấp" : suggestion.gi === "medium" ? "TB" : "Cao"}
      </span>
    </div>
  );
}

// Main Page Component
export default function ThuocPage() {
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    setMedications(generateMockMedications());
  }, []);

  const handleToggleTaken = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  return (
    <Page title="Chế độ chăm sóc">
      <div className="p-6 space-y-4">
        {/* Welcome Card */}
        <WelcomeCard />

        {/* Schedule Timeline */}
        <ScheduleTimeline />

        {/* Medication Checklist */}
        <div>
          <h2 className="text-headline-md text-on-surface mb-3">Thuốc hôm nay</h2>
          <div className="space-y-2">
            {medications.map((med) => (
              <MedicationItem
                key={med.id}
                medication={med}
                onToggle={handleToggleTaken}
              />
            ))}
          </div>
        </div>

        {/* Meal Suggestions */}
        <div>
          <h2 className="text-headline-md text-on-surface mb-3">Gợi ý bữa ăn</h2>
          <div className="grid grid-cols-3 gap-2">
            {MEAL_SUGGESTIONS.map((meal, index) => (
              <MealSuggestionCard key={index} suggestion={meal} />
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}