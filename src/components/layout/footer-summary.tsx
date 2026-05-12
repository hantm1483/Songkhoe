"use client";

import React from "react";
import { Activity } from "lucide-react";

interface FooterSummaryProps {
  nextScreening?: string;
  caloriesToday?: number;
  caloriesGoal?: number;
  activity?: string;
}

export function FooterSummary({
  nextScreening = "25/10/2026",
  caloriesToday = 1450,
  caloriesGoal = 1800,
  activity = "45 Phút Yoga"
}: FooterSummaryProps) {
  return (
    <footer className="mx-6 mb-10 mt-6 rounded-[32px] px-6 py-4 bg-natural-border bg-opacity-30 border border-natural-border flex flex-col sm:flex-row justify-around items-center text-[11px] text-natural-primary-dark font-bold uppercase tracking-widest gap-4">
      <div className="flex items-center gap-2">
        <span>Tầm soát tiếp theo:</span>
        <span className="text-natural-accent">{nextScreening}</span>
      </div>
      <div className="flex items-center gap-2 px-4 border-x border-natural-border/30">
        <span>Calo hôm nay:</span>
        <span>{caloriesToday.toLocaleString()} / {caloriesGoal.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-2 text-natural-primary">
        <Activity className="w-3 h-3" />
        <span>{activity}</span>
      </div>
    </footer>
  );
}