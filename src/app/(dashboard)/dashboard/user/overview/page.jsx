"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button, Spinner } from "@heroui/react";
import {
  Bookmark,
  Send,
  Archive,
  PlusCircle,
  Compass,
  Edit3,
  Award,
  CheckCircle2,
  BarChart3,
  Clock,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function OverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isPremiumUser = user?.role === "admin" || user?.plan === "premium";

  const [stats, setStats] = useState({
    savedLessons: 0,
    mySubmissions: 0,
    totalSavesReceived: 0,
  });
  const [recentLessons, setRecentLessons] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([
    { day: "Mon", count: 0 },
    { day: "Tue", count: 0 },
    { day: "Wed", count: 0 },
    { day: "Thu", count: 0 },
    { day: "Fri", count: 0 },
    { day: "Sat", count: 0 },
    { day: "Sun", count: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;

      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        // Fetch user's created lessons and saved lessons in parallel
        const [lessonsRes, savedRes] = await Promise.all([
          fetch(`${backendUrl}/api/my-lessons/${user.id}`),
          fetch(`${backendUrl}/api/saved-lessons/${user.id}`),
        ]);

        const lessonsData = lessonsRes.ok ? await lessonsRes.json() : [];
        const savedData = savedRes.ok ? await savedRes.json() : [];

        // Set Dynamic Stats
        setStats({
          savedLessons: savedData.length || 0,
          mySubmissions: lessonsData.length || 0,
          totalSavesReceived: lessonsData.reduce(
            (acc, curr) => acc + (curr.savedBy?.length || 0),
            0,
          ),
        });

        // Set top 4 recent lessons
        setRecentLessons(lessonsData.slice(0, 4));

        // Group weekly activity from lesson creation dates
        const daysMap = { 0: 6, 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5 }; // Sun -> 6, Mon -> 0
        const activityCounts = [0, 0, 0, 0, 0, 0, 0];

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        lessonsData.forEach((lesson) => {
          const lessonDate = new Date(lesson.createdAt);
          if (lessonDate >= oneWeekAgo) {
            const dayIndex = daysMap[lessonDate.getDay()];
            activityCounts[dayIndex] += 1;
          }
        });

        const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        setWeeklyActivity(
          dayNames.map((day, idx) => ({
            day,
            count: activityCounts[idx],
          })),
        );
      } catch (error) {
        console.error("Error fetching overview stats:", error);
        toast.error("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  const firstName = user?.name ? user.name.split(" ")[0] : "Executive";

  const maxFreeSubmissions = 3;
  const maxFreeSaves = 5;
  const submissionsPercent = Math.min(
    (stats.mySubmissions / maxFreeSubmissions) * 100,
    100,
  );
  const savesPercent = Math.min((stats.savedLessons / maxFreeSaves) * 100, 100);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const maxActivity = Math.max(...weeklyActivity.map((d) => d.count), 1);

  return (
    <div className="w-full flex flex-col gap-10 font-sans pb-12">
      {/* === Header Row === */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] md:text-3xl font-bold text-[#1a202c] dark:text-white tracking-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            Here is an overview of your lessons, contributions, and community
            impact.
          </p>
        </div>

        <Link
          href="/dashboard/user/add-lesson"
          className="bg-[#147062] hover:bg-[#0f594e] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 w-fit cursor-pointer text-[14px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Lesson</span>
        </Link>
      </div>

      {/* === Stats Cards Grid === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Lessons Created */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-400">
              Total Lessons Created
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#eaddff] text-[#5b32a8] dark:bg-[#5b32a8]/20 dark:text-[#c4a6ff] flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-[32px] font-bold text-[#1a202c] dark:text-white leading-tight">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                stats.mySubmissions
              )}
            </h2>
            <p className="text-[13px] text-zinc-500 mt-1">
              Published & Draft Modules
            </p>
          </div>
        </div>

        {/* Total Saved Lessons */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-400">
              Saved Favorites
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#16A696]/15 text-[#16A696] flex items-center justify-center">
              <Bookmark className="w-5 h-5" fill="currentColor" />
            </div>
          </div>
          <div>
            <h2 className="text-[32px] font-bold text-[#1a202c] dark:text-white leading-tight">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                stats.savedLessons
              )}
            </h2>
            <p className="text-[13px] text-zinc-500 mt-1">
              Saved for later reading
            </p>
          </div>
        </div>

        {/* Total Times Saved By Others */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-400">
              Community Saves
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#c97b53]/15 text-[#c97b53] flex items-center justify-center">
              <Archive className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-[32px] font-bold text-[#1a202c] dark:text-white leading-tight">
              {isLoading ? (
                <Spinner size="sm" color="current" />
              ) : (
                stats.totalSavesReceived
              )}
            </h2>
            <p className="text-[13px] text-zinc-500 mt-1">
              Times peers bookmarked your work
            </p>
          </div>
        </div>
      </div>

      {/* === Row 2: Analytics Chart & Shortcuts === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity & Contributions Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-[#16A696] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-[#1a202c] dark:text-white">
                Weekly Contribution Activity
              </h3>
            </div>
            <span className="text-[13px] font-semibold text-zinc-500">
              Past 7 Days
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-zinc-100 dark:border-zinc-800">
            {weeklyActivity.map((item) => {
              const barHeightPercent = Math.max(
                (item.count / maxActivity) * 100,
                10,
              );
              return (
                <div
                  key={item.day}
                  className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
                >
                  <div className="text-[11px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </div>
                  <div
                    className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${
                      item.count > 0
                        ? "bg-[#16A696]"
                        : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                    style={{ height: `${barHeightPercent}%` }}
                  />
                  <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 mt-2">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[13px] text-zinc-500 dark:text-zinc-400 pt-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A696]"></span>
              <span>Active submissions</span>
            </div>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {stats.mySubmissions} total modules
            </span>
          </div>
        </div>

        {/* Quick Shortcuts (1 Col) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1a202c] dark:text-white mb-4">
              Quick Shortcuts
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/user/add-lesson"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-[#0f7a6f] dark:text-[#16A696] flex items-center justify-center shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                    Add Lesson
                  </span>
                  <span className="text-[12px] text-zinc-500">
                    Draft a new post
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/lessons"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                    Explore Lessons
                  </span>
                  <span className="text-[12px] text-zinc-500">
                    Browse peer library
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard/user/lessons"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                    Manage My Work
                  </span>
                  <span className="text-[12px] text-zinc-500">
                    Edit or publish drafts
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* === Recently Added Lessons Section === */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden p-6">
  {/* Card Header */}
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-[#16A696] flex items-center justify-center">
        <Clock className="w-4 h-4" />
      </div>
      <h3 className="text-lg font-bold text-[#1a202c] dark:text-white">
        Recently Added Lessons
      </h3>
    </div>
    <Link
      href="/dashboard/user/lessons"
      className="text-[13px] font-semibold text-[#16A696] hover:underline flex items-center gap-1"
    >
      View all ({stats?.mySubmissions || 0}){" "}
      <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  </div>

  {/* Card Body with Loader / Content / Empty States */}
  {isLoading ? (
    <div className="w-full flex items-center justify-center">
      <Spinner size="lg" color="current" className="text-[#0f766e]" />
    </div>
  ) : recentLessons.length > 0 ? (
    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {recentLessons.map((lesson) => (
        <div
          key={lesson._id}
          className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 rounded-xl px-2 transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-zinc-900 dark:text-white">
              {lesson.title}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[12px] font-medium text-zinc-500">
                {formatDate(lesson.createdAt)}
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-[12px] font-medium text-zinc-500">
                {lesson.category || "General"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                lesson.visibility === "Draft"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                  : "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400"
              }`}
            >
              {lesson.visibility || "Public"}
            </span>

            <Link
              href={`/lessons/${lesson._id}`}
              className="px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              View
            </Link>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="py-8 text-center text-zinc-500">
      <p className="text-[14px]">
        You haven&apos;t published any lessons yet.
      </p>
      <Link
        href="/dashboard/user/add-lesson"
        className="inline-block mt-3 px-4 py-2 bg-[#16A696] hover:bg-[#0d6e63] text-white font-semibold text-xs rounded-xl transition-colors"
      >
        Create your first lesson
      </Link>
    </div>
  )}
</div>

      {/* === Upgrade / Account Tier Section === */}
      <div
        className={`w-full border rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-8 shadow-sm transition-colors ${
          isPremiumUser
            ? "bg-[#f0fdf4] border-[#bbf7d0] dark:bg-[#064e3b]/20 dark:border-[#065f46]"
            : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
        }`}
      >
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3">
            {isPremiumUser ? (
              <CheckCircle2 className="w-6 h-6 text-[#16A696]" />
            ) : (
              <Award className="w-6 h-6 text-[#147062] dark:text-[#16A696]" />
            )}
            <h2 className="text-xl font-bold text-[#0d233a] dark:text-white tracking-tight">
              {isPremiumUser ? "Pro Plan Active" : "Upgrade to Pro"}
            </h2>
          </div>

          <p className="text-[14px] text-zinc-600 dark:text-zinc-400">
            {isPremiumUser
              ? "You have unrestricted access to publish lessons, save unlimited modules, and view all premium content."
              : "Free accounts have a limit of 3 lesson posts and 5 saved modules. Upgrade to unlock full access."}
          </p>

          {!isPremiumUser && (
            <div className="flex flex-col sm:flex-row gap-6 mt-3">
              <div className="w-full sm:w-[220px] flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[12px] font-bold text-[#0d233a] dark:text-zinc-200">
                  <span>Lessons Added</span>
                  <span className="text-zinc-500">
                    {stats.mySubmissions}/{maxFreeSubmissions}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      stats.mySubmissions >= maxFreeSubmissions
                        ? "bg-red-500"
                        : "bg-[#16A696]"
                    }`}
                    style={{ width: `${submissionsPercent}%` }}
                  />
                </div>
              </div>

              <div className="w-full sm:w-[220px] flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[12px] font-bold text-[#0d233a] dark:text-zinc-200">
                  <span>Lessons Saved</span>
                  <span className="text-zinc-500">
                    {stats.savedLessons}/{maxFreeSaves}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      stats.savedLessons >= maxFreeSaves
                        ? "bg-red-500"
                        : "bg-[#16A696]"
                    }`}
                    style={{ width: `${savesPercent}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {!isPremiumUser && (
          <div className="flex items-center">
            <Button className="bg-[#147062] hover:bg-[#10594e] text-white font-semibold px-6 py-5 rounded-xl transition-colors cursor-pointer">
              <Link href="/pricing">Upgrade to Pro</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
