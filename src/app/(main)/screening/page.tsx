"use client";

import { useState } from "react";
import { ShieldCheck, CalendarPlus, CheckCircle2, X, Edit2, Trash2 } from "lucide-react";
import { clsx } from "clsx";
import { Page } from "@/components/layout/page";
import { ScreeningList, ScreeningLog } from "@/components/screening/screening-list";

type Tab = 'list' | 'log';

export default function ScreeningPage() {
  const [activeTab, setActiveTab] = useState<Tab>('list');

  const subMenu = [
    { name: 'Mục tầm soát', tab: 'list' as Tab, icon: ShieldCheck },
    { name: 'Nhật ký tầm soát', tab: 'log' as Tab, icon: CalendarPlus },
  ];

  return (
    <Page>
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-black text-natural-primary-dark tracking-tight uppercase">Lịch tầm soát định kỳ</h1>
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

        <div className="rounded-[40px] bg-white p-10 shadow-sm border border-natural-border">
          {activeTab === 'list' && <ScreeningList />}
          {activeTab === 'log' && <ScreeningLog />}
        </div>
      </div>
    </Page>
  );
}