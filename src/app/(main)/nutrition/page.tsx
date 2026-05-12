"use client";

import { useState } from "react";
import { ChefHat, ClipboardList } from "lucide-react";
import { clsx } from "clsx";
import { Page } from "@/components/layout/page";
import { NutritionPlan } from "@/components/nutrition/nutrition-plan";
import { SuggestedMenu } from "@/components/nutrition/suggested-menu";
import { FoodList } from "@/components/nutrition/food-list";
import { CarbCalculator } from "@/components/nutrition/carb-calculator";

type Tab = 'planning' | 'resources';

export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState<Tab>('planning');

  const subMenu = [
    { name: 'Tạo thực đơn & Nhật ký', tab: 'planning' as Tab, icon: ClipboardList },
    { name: 'Tra cứu & Gợi ý', tab: 'resources' as Tab, icon: ChefHat },
  ];

  return (
    <Page>
      <div className="space-y-8">
        <header>
          <h1 className="text-2xl font-black text-natural-primary-dark tracking-tight uppercase">Chế độ dinh dưỡng</h1>
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
          {activeTab === 'planning' ? (
            <div className="space-y-12">
              <section>
                <NutritionPlan />
              </section>
              <div className="h-px bg-natural-border w-full" />
              <section>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-natural-primary-dark">Tính toán Carbohydrate</h3>
                  <p className="text-sm text-slate-500 font-medium">Ước tính lượng tinh bột trong phần ăn của bạn.</p>
                </div>
                <CarbCalculator />
              </section>
            </div>
          ) : (
            <div className="space-y-12">
              <section>
                <SuggestedMenu />
              </section>
              <div className="h-px bg-natural-border w-full" />
              <section>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-natural-primary-dark">Tra cứu thực phẩm</h3>
                  <p className="text-sm text-slate-500 font-medium">Tìm kiếm chỉ số dinh dưỡng của các thực phẩm phổ biến.</p>
                </div>
                <FoodList />
              </section>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}