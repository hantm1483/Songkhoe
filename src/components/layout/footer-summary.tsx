"use client";

import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";

interface FooterSummaryData {
  nextScreening: string;
  caloriesToday: number;
  caloriesGoal: number;
  activity: string;
}

function parseCalories(notes: string | null): number {
  if (!notes) return 0;
  const match = notes.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
}

export function FooterSummary() {
  const [data, setData] = useState<FooterSummaryData>({
    nextScreening: "---",
    caloriesToday: 0,
    caloriesGoal: 2100,
    activity: "Chưa có sự kiện"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        // Fetch meals for today's calories
        const mealsRes = await fetch("/api/meals?limit=500");
        let caloriesToday = 0;
        if (mealsRes.ok) {
          const mealsData = await mealsRes.json();
          const meals = mealsData.data?.meals || [];
          const todayMeals = meals.filter((m: { time: string }) => m.time && m.time.startsWith(today));
          caloriesToday = todayMeals.reduce((sum: number, m: { notes: string | null }) => sum + parseCalories(m.notes), 0);
        }

        // Fetch activity schedules
        const activityRes = await fetch("/api/activity-schedules?limit=50");
        let activityName = "Chưa có sự kiện";
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          const activities = activityData.data?.schedules || [];

          // Find nearest unchecked activity that has a checked one before it
          // Sort by date desc, time desc
          const sorted = [...activities].sort((a, b) => {
            const dateCompare = b.scheduled_date.localeCompare(a.scheduled_date);
            if (dateCompare !== 0) return dateCompare;
            const timeA = a.scheduled_time || '';
            const timeB = b.scheduled_time || '';
            return timeB.localeCompare(timeA);
          });

          // Find first unchecked item
          const uncheckedIdx = sorted.findIndex(a => !a.completed);
          if (uncheckedIdx !== -1) {
            activityName = sorted[uncheckedIdx].activity_name;
          } else if (sorted.length > 0) {
            activityName = sorted[0].activity_name;
          }
        }

        // Fetch health events for screening schedules
        const healthRes = await fetch("/api/health-events?limit=50");
        let nextScreening = "---";
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          const events = healthData.data?.events || [];

          // Find nearest upcoming uncompleted screening event
          const todayISO = new Date().toISOString();
          const screeningEvents = events
            .filter((e: { event_type: string; event_date: string; title: string }) =>
              e.event_type === "Tầm soát" && e.event_date >= todayISO.split('T')[0]
            )
            .sort((a: { event_date: string }, b: { event_date: string }) =>
              a.event_date.localeCompare(b.event_date)
            );

          if (screeningEvents.length > 0) {
            nextScreening = formatDate(screeningEvents[0].event_date);
          }
        }

        setData({
          nextScreening,
          caloriesToday,
          caloriesGoal: 2100,
          activity: activityName
        });
      } catch (err) {
        console.error("FooterSummary fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <footer className="mx-6 mb-10 mt-6 rounded-[32px] px-6 py-4 bg-natural-border bg-opacity-30 border border-natural-border flex flex-col sm:flex-row justify-around items-center text-[11px] text-natural-primary-dark font-bold uppercase tracking-widest gap-4 opacity-50">
        <div className="flex items-center gap-2">
          <span>Tầm soát tiếp theo:</span>
          <span className="text-natural-accent">...</span>
        </div>
        <div className="flex items-center gap-2 px-4 border-x border-natural-border/30">
          <span>Calo hôm nay:</span>
          <span>... / 2,100</span>
        </div>
        <div className="flex items-center gap-2 text-natural-primary">
          <Activity className="w-3 h-3" />
          <span>...</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="mx-6 mb-10 mt-6 rounded-[32px] px-6 py-4 bg-natural-border bg-opacity-30 border border-natural-border flex flex-col sm:flex-row justify-around items-center text-[11px] text-natural-primary-dark font-bold uppercase tracking-widest gap-4">
      <div className="flex items-center gap-2">
        <span>Tầm soát tiếp theo:</span>
        <span className="text-natural-accent">{data.nextScreening}</span>
      </div>
      <div className="flex items-center gap-2 px-4 border-x border-natural-border/30">
        <span>Calo hôm nay:</span>
        <span>{data.caloriesToday.toLocaleString()} / {data.caloriesGoal.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2 text-natural-primary">
        <Activity className="w-3 h-3" />
        <span>{data.activity}</span>
      </div>
    </footer>
  );
}