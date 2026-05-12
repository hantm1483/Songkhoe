"use client";

import { useState } from "react";
import { CalendarClock, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { Page } from "@/components/layout/page";
import { ActivitySchedule } from "@/components/lifestyle/activity-schedule";
import { WorkoutSuggestions } from "@/components/lifestyle/workout-suggestions";

type Tab = 'schedule' | 'suggestions';

export default function LifestylePage() {
  const [activeTab, setActiveTab] = useState<Tab>('schedule');

  const subMenu = [
    { name: 'Lịch trình sinh hoạt', tab: 'schedule' as Tab, icon: CalendarClock },
    { name: 'Gợi ý bài tập', tab: 'suggestions' as Tab, icon: Sparkles },
  ];

  return (
    <Page>
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-black text-natural-primary-dark tracking-tight uppercase">Chế độ sinh hoạt</h1>
          <nav className="mt-6 flex flex-wrap gap-2">
            {subMenu.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={clsx(
                  'flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all border',
                  activeTab === item.tab
                    ? 'bg-natural-primary text-white border-natural-primary shadow-lg shadow-natural-primary/20'
                    : 'bg-white text-slate-500 hover:bg-natural-light border-natural-border'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </button>
            ))}
          </nav>
        </header>

        <div className="rounded-[32px] bg-white p-8 shadow-sm border border-natural-border">
          {activeTab === 'schedule' && <ActivitySchedule />}
          {activeTab === 'suggestions' && <WorkoutSuggestions />}
        </div>
      </div>
    </Page>
  );
}