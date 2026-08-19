"use client";

import React from "react";

export const SidebarSkeleton = () => {
  return (
    <aside className="w-[280px] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full flex-shrink-0 z-20 animate-pulse font-sans">
      
      {/* Logo Area Skeleton */}
      <div className="px-8 pt-8 pb-6">
        <div className="h-8 w-32 bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
      </div>

      {/* User Profile Card Skeleton */}
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3 p-2 -mx-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
          <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <div className="h-3.5 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
            <div className="h-2.5 w-16 bg-zinc-200/70 dark:bg-zinc-700/60 rounded-md" />
          </div>
        </div>
      </div>

      {/* Navigation Links Skeleton */}
      <div className="flex-1 px-4 flex flex-col gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100/80 dark:border-zinc-800/40"
          >
            <div className="w-5 h-5 rounded-md bg-zinc-200 dark:bg-zinc-700 shrink-0" />
            <div
              className="h-3.5 bg-zinc-200 dark:bg-zinc-700 rounded-md"
              style={{ width: `${60 + (i % 3) * 18}%` }}
            />
          </div>
        ))}
      </div>

      {/* Middle Divider */}
      <div className="px-4">
        <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-4" />
      </div>

      {/* Bottom Actions Skeleton */}
      <div className="px-4 pb-6 flex flex-col gap-2">
        <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/50" />
        <div className="h-10 w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/50" />
      </div>
      
    </aside>
  );
};

export default SidebarSkeleton;