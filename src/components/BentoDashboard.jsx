"use client";

import React from "react";

export const BentoDashboardSkeleton = () => {
  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 pb-20 grid grid-cols-1 md:grid-cols-12 gap-6 animate-pulse">
      
      {/* 1. Header Bar Placeholder (12 Cols) */}
      <div className="col-span-12 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex flex-col gap-2.5">
          <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          <div className="h-8 w-64 sm:w-80 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          <div className="h-3.5 w-48 sm:w-60 bg-zinc-200/70 dark:bg-zinc-800/60 rounded-md" />
        </div>
        <div className="h-11 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-2xl shrink-0" />
      </div>

      {/* 2. Top Metric Cards (4 x 3 Cols = 12 Cols) */}
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="col-span-12 sm:col-span-6 lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between h-[150px]"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
            <div className="w-10 h-10 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
            <div className="h-3 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
          </div>
        </div>
      ))}

      {/* 3. Middle Large Bento: Chart (7 Cols) */}
      <div className="col-span-12 lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-[340px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-40 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              <div className="h-3 w-28 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
            </div>
          </div>
          <div className="h-4 w-12 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </div>

        {/* Shimmer Bar Columns */}
        <div className="h-40 flex items-end justify-between gap-3 px-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
          {[40, 70, 30, 95, 55, 80, 45].map((heightPct, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div
                className="w-full max-w-[36px] bg-zinc-200 dark:bg-zinc-800 rounded-t-xl"
                style={{ height: `${heightPct}%` }}
              />
              <div className="h-3 w-6 bg-zinc-100 dark:bg-zinc-800/60 rounded-sm" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="h-3 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </div>
      </div>

      {/* 4. Middle Large Bento: Activity / Moderation List (5 Cols) */}
      <div className="col-span-12 lg:col-span-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between h-[340px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex flex-col gap-1.5">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
            </div>
          </div>
          <div className="h-3.5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </div>

        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3"
            >
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="h-3.5 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                <div className="h-2.5 w-1/2 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
              </div>
              <div className="flex gap-1.5 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="h-3 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </div>
      </div>

      {/* 5. Bottom Bento: Leaderboard List (4 Cols) */}
      <div className="col-span-12 lg:col-span-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
          </div>
          <div className="h-3 w-10 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
        </div>

        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-zinc-100 dark:border-zinc-800/60 last:border-none">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
                  <div className="h-2.5 w-32 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
                </div>
              </div>
              <div className="h-5 w-14 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Bottom Bento: Action Cards Grid (8 Cols) */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 flex flex-col justify-between h-[160px]"
          >
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-md" />
              <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-800/60 rounded-md" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default BentoDashboardSkeleton;