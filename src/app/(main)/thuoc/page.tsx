"use client";

import { useState, useEffect } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pill, Bell, Sun, Moon, Plus, Utensils, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Medication {
  id: string;
  name: string;
  dosage: string;
  schedule_time: "morning" | "evening";
  notification_enabled: boolean;
  taken: boolean;
}

interface MealLog {
  id: string;
  name: string;
  gi_level: "low" | "medium" | "high";
  time: string;
  notes?: string;
}

// Generate mock medications
function generateMockMedications(): Medication[] {
  return [
    {
      id: "1",
      name: "Metformin",
      dosage: "500mg",
      schedule_time: "morning",
      notification_enabled: true,
      taken: false,
    },
    {
      id: "2",
      name: "Gliclazide",
      dosage: "80mg",
      schedule_time: "morning",
      notification_enabled: true,
      taken: false,
    },
    {
      id: "3",
      name: "Metformin",
      dosage: "500mg",
      schedule_time: "evening",
      notification_enabled: false,
      taken: false,
    },
    {
      id: "4",
      name: "Atorvastatin",
      dosage: "20mg",
      schedule_time: "evening",
      notification_enabled: true,
      taken: false,
    },
  ];
}

// Generate mock meals
function generateMockMeals(): MealLog[] {
  const today = new Date();
  return [
    {
      id: "1",
      name: "Bữa sáng",
      gi_level: "medium",
      time: "07:00",
      notes: "Phở bò",
    },
    {
      id: "2",
      name: "Bữa trưa",
      gi_level: "low",
      time: "12:00",
      notes: "Cơm + cá + rau",
    },
    {
      id: "3",
      name: "Bữa xế",
      gi_level: "medium",
      time: "15:00",
      notes: "Trái cây",
    },
    {
      id: "4",
      name: "Bữa tối",
      gi_level: "low",
      time: "19:00",
      notes: "Xúp + cơm + thịt",
    },
  ];
}

// Medication Tabs
function MedicationTabs({
  activeTab,
  onChange,
}: {
  activeTab: "morning" | "evening";
  onChange: (tab: "morning" | "evening") => void;
}) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => onChange("morning")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg min-h-touch-target",
          "transition-colors duration-200",
          activeTab === "morning"
            ? "bg-primary text-on-primary"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
        )}
      >
        <Sun className="w-5 h-5" />
        Buổi sáng
      </button>
      <button
        onClick={() => onChange("evening")}
        className={cn(
          "flex-1 flex items-center justify-center gap-2 py-3 rounded-lg min-h-touch-target",
          "transition-colors duration-200",
          activeTab === "evening"
            ? "bg-primary text-on-primary"
            : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
        )}
      >
        <Moon className="w-5 h-5" />
        Buổi tối
      </button>
    </div>
  );
}

// Medication Item
function MedicationItem({
  medication,
  onToggle,
  onDelete,
}: {
  medication: Medication;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg",
        "bg-surface-container-low"
      )}
    >
      <button
        onClick={() => onToggle(medication.id)}
        className="flex items-center gap-3 flex-1"
      >
        <div
          className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center",
            medication.taken
              ? "bg-primary border-primary"
              : "border-outline"
          )}
        >
          {medication.taken && (
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
          <div
            className={cn(
              "text-body-lg",
              medication.taken && "line-through text-on-surface-variant"
            )}
          >
            {medication.name}
          </div>
          <div className="text-label-lg text-on-surface-variant">
            {medication.dosage}
          </div>
        </div>
      </button>
      <button
        onClick={() => onDelete(medication.id)}
        className="p-2 hover:bg-error/10 rounded-lg"
      >
        <Trash2 className="w-5 h-5 text-on-surface-variant hover:text-error" />
      </button>
    </div>
  );
}

// Notification Toggle
function NotificationToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        "w-12 h-6 rounded-full transition-colors duration-200",
        enabled ? "bg-primary" : "bg-surface-container"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full bg-white shadow transition-transform duration-200",
          enabled ? "translate-x-6" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

// Meal Diary Section
function MealDiarySection({
  meals,
  giLabel,
}: {
  meals: MealLog[];
  giLabel: string;
}) {
  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-primary" />
          Nhật ký ăn uống - {giLabel}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {meals.map((meal) => {
            const giVariant =
              meal.gi_level === "low"
                ? "success"
                : meal.gi_level === "medium"
                ? "warning"
                : "error";

            return (
              <div
                key={meal.id}
                className="flex items-center justify-between py-2 border-b border-outline-variant last:border-0"
              >
                <div>
                  <div className="text-body-lg text-on-surface">{meal.name}</div>
                  <div className="text-label-lg text-on-surface-variant">
                    {meal.time} {meal.notes && `- ${meal.notes}`}
                  </div>
                </div>
                <Badge variant={giVariant}>
                  GI {meal.gi_level === "low" ? "Thấp" : meal.gi_level === "medium" ? "TB" : "Cao"}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Add Medication Form
function MedicationForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { name: string; dosage: string; schedule_time: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [scheduleTime, setScheduleTime] = useState<"morning" | "evening">("morning");

  const handleSubmit = () => {
    if (!name.trim() || !dosage.trim()) return;
    onSubmit({ name: name.trim(), dosage: dosage.trim(), schedule_time: scheduleTime });
  };

  return (
    <Card variant="elevated" className="w-full">
      <CardHeader>
        <CardTitle>Thêm thuốc mới</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Tên thuốc"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="VD: Metformin"
        />
        <Input
          label="Liều lượng"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder="VD: 500mg"
        />
        <div>
          <label className="text-label-lg text-on-surface-variant mb-2 block">
            Thời điểm
          </label>
          <MedicationTabs
            activeTab={scheduleTime}
            onChange={setScheduleTime}
          />
        </div>
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

// Main Page Component
export default function ThuocPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [activeTab, setActiveTab] = useState<"morning" | "evening">("morning");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMedications(generateMockMedications());
      setMeals(generateMockMeals());
      setLoading(false);
    }, 300);
  }, []);

  const filteredMedications = medications.filter(
    (m) => m.schedule_time === activeTab
  );

  const handleToggleTaken = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const handleDeleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  const handleNotificationToggle = (id: string, enabled: boolean) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, notification_enabled: enabled } : m))
    );
  };

  const handleAddMedication = (
    data: { name: string; dosage: string; schedule_time: string },
    enableNotification: boolean = false
  ) => {
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: data.name,
      dosage: data.dosage,
      schedule_time: data.schedule_time as "morning" | "evening",
      notification_enabled: enableNotification,
      taken: false,
    };

    setMedications((prev) => [...prev, newMedication]);
    setShowForm(false);
  };

  const giLabel = activeTab === "morning" ? "Sáng" : "Tối";
  const todayMeals = meals.filter((m) => {
    const hour = parseInt(m.time.split(":")[0]);
    return activeTab === "morning" ? hour < 12 : hour >= 12;
  });

  return (
    <Page title="Thuốc">
      <div className="space-y-4 p-6">
        {/* Medication Tabs */}
        <MedicationTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Medication List */}
        <Card variant="elevated" className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              Danh sách thuốc - {giLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-on-surface-variant">
                Đang tải...
              </div>
            ) : filteredMedications.length > 0 ? (
              <div className="space-y-2">
                {filteredMedications.map((med) => (
                  <MedicationItem
                    key={med.id}
                    medication={med}
                    onToggle={handleToggleTaken}
                    onDelete={handleDeleteMedication}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-on-surface-variant">
                Chưa có thuốc trong khung giờ này
              </div>
            )}

            {/* Notification settings for each medication */}
            <div className="mt-4 pt-4 border-t border-outline-variant">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-on-surface-variant" />
                  <span className="text-body-md text-on-surface">
                    Nhắc nhở uống thuốc
                  </span>
                </div>
              </div>
              <div className="space-y-2 mt-2">
                {filteredMedications
                  .filter((m) => m.notification_enabled)
                  .map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="text-body-md text-on-surface-variant">
                        {med.name} ({med.dosage})
                      </span>
                      <NotificationToggle
                        enabled={med.notification_enabled}
                        onChange={(enabled) =>
                          handleNotificationToggle(med.id, enabled)
                        }
                      />
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Medication */}
        {showForm ? (
          <MedicationForm
            onSubmit={handleAddMedication}
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
            Thêm thuốc
          </Button>
        )}

        {/* Meal Diary */}
        <MealDiarySection meals={todayMeals} giLabel={giLabel} />
      </div>
    </Page>
  );
}