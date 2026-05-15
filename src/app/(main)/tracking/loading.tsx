"use client";

import { Page } from "@/components/layout/page";

export default function Loading() {
  return (
    <Page>
      <div className="space-y-8 animate-pulse">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-natural-light rounded-2xl" />
            <div className="h-4 w-72 bg-natural-light rounded-xl" />
          </div>
          <div className="h-12 w-40 bg-natural-light rounded-2xl" />
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-natural-light rounded-3xl" />
          ))}
        </div>

        {/* Chart skeleton */}
        <div className="rounded-[40px] bg-white p-8 shadow-sm border border-natural-border">
          <div className="h-80 bg-natural-light rounded-3xl" />
        </div>

        {/* List skeleton */}
        <div className="rounded-[40px] bg-white p-8 shadow-sm border border-natural-border">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-natural-light rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}