"use client";

import React from "react";
import { Button, Input } from "@heroui/react";
import {
  Search,
  Bookmark,
  Send,
  Archive,
  PlusCircle,
  Compass,
  Edit3,
  Award,
} from "lucide-react";

export default function OverviewPage() {
  return (
    <div className="w-full flex flex-col gap-10">
      {/* === Header Row === */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-[28px] md:text-3xl font-bold text-[#1a202c] dark:text-white tracking-tight">
            Welcome back, Executive.
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            Here is your learning progress for the week.
          </p>
        </div>

        {/* Search Input using HeroUI */}
      </div>

      {/* === Stats Cards Grid === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Saved Lessons */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#16A696] text-white flex items-center justify-center mb-8">
            <Bookmark className="w-5 h-5" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-[28px] font-bold text-[#1a202c] dark:text-white leading-tight">
              12
            </h2>
            <p className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
              Saved Lessons
            </p>
          </div>
        </div>

        {/* Card 2: My Submissions */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#eaddff] text-[#5b32a8] dark:bg-[#5b32a8]/20 dark:text-[#c4a6ff] flex items-center justify-center mb-8">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[28px] font-bold text-[#1a202c] dark:text-white leading-tight">
              5
            </h2>
            <p className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
              My Submissions
            </p>
          </div>
        </div>

        {/* Card 3: Total Saved Count */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#c97b53] text-white dark:bg-[#c97b53]/80 flex items-center justify-center mb-8">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[28px] font-bold text-[#1a202c] dark:text-white leading-tight">
              42
            </h2>
            <p className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
              Total Saved count
            </p>
          </div>
        </div>
      </div>

      <div className="w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl p-6 flex flex-col md:flex-row justify-between gap-8 shadow-sm">
        {/* Content Side */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-[#147062] dark:text-[#16A696]" />
            <h2 className="text-2xl font-bold text-[#0d233a] dark:text-white tracking-tight">
              Upgrade to Premium
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-[14px] text-zinc-600 dark:text-zinc-400">
            Free accounts have limited functionality. Upgrade to remove
            restrictions.
          </p>

          {/* Bullet Points */}
          <ul className="list-disc pl-5 text-[14px] text-zinc-600 dark:text-zinc-400 flex flex-col gap-2 marker:text-zinc-400 mt-1">
            <li>Maximum 3 lesson posts</li>
            <li>Maximum 5 saved lessons</li>
            <li>No access to premium content</li>
          </ul>

          {/* Progress Bars */}
          <div className="flex flex-col sm:flex-row gap-8 mt-4">
            {/* Lessons Added */}
            <div className="w-full sm:w-[220px] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[13px] font-bold text-[#0d233a] dark:text-zinc-200">
                <span>Lessons Added</span>
                <span className="text-zinc-600 dark:text-zinc-400">0/3</span>
              </div>
              <div className="w-full h-1.5 bg-[#e0e7ff] dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A696] w-0"></div>
              </div>
            </div>

            {/* Lessons Saved */}
            <div className="w-full sm:w-[220px] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[13px] font-bold text-[#0d233a] dark:text-zinc-200">
                <span>Lessons Saved</span>
                <span className="text-zinc-600 dark:text-zinc-400">0/5</span>
              </div>
              <div className="w-full h-1.5 bg-[#e0e7ff] dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A696] w-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Button Side */}
        <div className="flex md:items-center justify-start md:justify-end mt-2 md:mt-0">
          <Button className="bg-[#147062] hover:bg-[#10594e] text-white font-semibold px-6 py-5 rounded-lg transition-colors">
            Upgrade to Pro
          </Button>
        </div>
      </div>

      {/* === Quick Actions Section === */}
      <div>
        <h2 className="text-xl font-bold text-[#1a202c] dark:text-white mb-5">
          Quick Actions
        </h2>

        <div className="flex flex-col gap-4 w-full md:w-[400px]">
          {/* Action 1 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#16A696] dark:hover:border-[#16A696] transition-colors shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-[#e6f2f1] text-[#0f7a6f] dark:bg-[#16A696]/10 dark:text-[#16A696] flex items-center justify-center shrink-0 transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#1a202c] dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                Add Lesson
              </span>
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Create a new learning module
              </span>
            </div>
          </div>

          {/* Action 2 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#16A696] dark:hover:border-[#16A696] transition-colors shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-[#e6f2f1] text-[#0f7a6f] dark:bg-[#16A696]/10 dark:text-[#16A696] flex items-center justify-center shrink-0 transition-colors">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#1a202c] dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                Explore Lessons
              </span>
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Discover curated content paths
              </span>
            </div>
          </div>

          {/* Action 3 */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#16A696] dark:hover:border-[#16A696] transition-colors shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-[#e6f2f1] text-[#0f7a6f] dark:bg-[#16A696]/10 dark:text-[#16A696] flex items-center justify-center shrink-0 transition-colors">
              <Edit3 className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#1a202c] dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                Edit Lesson
              </span>
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Modify existing course content
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
