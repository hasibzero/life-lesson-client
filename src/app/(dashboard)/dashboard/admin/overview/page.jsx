"use client";
import ImageWithSpinner from "@/components/ImageWithSpinner";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button, Spinner } from "@heroui/react";
import {
  Users,
  BookOpen,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  BarChart3,
  UserCog,
  FolderCog,
  ShieldAlert,
  ArrowRight,
  Crown,
  CalendarCheck
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalPublicLessons: 0,
    reportedLessons: 0,
    todayLessons: 0,
    lessonGrowth: [],
    userGrowth: [],
    activeContributors: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      const tokenRes = await authClient.token();
      const token = tokenRes?.data?.token;
          
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const [statsRes, reportsRes, allLessonsRes] = await Promise.all([
          fetch(`${backendUrl}/api/admin/stats`,{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${backendUrl}/api/admin/reports`,{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${backendUrl}/api/lessons`,{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        let statsData = {};
        if (statsRes.ok) {
          statsData = await statsRes.json();
        }

        // Calculate fallback for open reports if not directly returned
        let openReportsCount = statsData.reportedLessons;
        if (openReportsCount === undefined && reportsRes.ok) {
          const reportsData = await reportsRes.json();
          if (Array.isArray(reportsData)) {
            const pending = reportsData.filter(r => r.status?.toLowerCase() !== "resolved");
            const unique = new Set(pending.map(r => r.lessonId?.toString()).filter(Boolean));
            openReportsCount = unique.size || pending.length;
          }
        }

        // Calculate fallback for public lessons count
        let publicCount = statsData.totalPublicLessons ?? statsData.totalLessons;
        if (!publicCount && allLessonsRes.ok) {
          const lessonsData = await allLessonsRes.json();
          if (Array.isArray(lessonsData)) {
            publicCount = lessonsData.filter(l => l.visibility === "Public" || l.isReviewed).length || lessonsData.length;
          }
        }

        setAnalytics({
          totalUsers: statsData.totalUsers || 0,
          totalPublicLessons: publicCount || 0,
          reportedLessons: openReportsCount || 0,
          todayLessons: statsData.todayLessons || 0,
          lessonGrowth: Array.isArray(statsData.lessonGrowth) ? statsData.lessonGrowth : [],
          userGrowth: Array.isArray(statsData.userGrowth) ? statsData.userGrowth : [],
          activeContributors: Array.isArray(statsData.activeContributors) ? statsData.activeContributors : [],
        });
      } catch (error) {
        console.error("Error fetching admin analytics:", error);
        toast.error("Server connection error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminOverview();
  }, []);

  const firstName = user?.name ? user.name.split(" ")[0] : "Admin";

  const maxLessonGrowth = Math.max(...(analytics.lessonGrowth.map((d) => d.count) || [1]), 1);
  const maxUserGrowth = Math.max(...(analytics.userGrowth.map((d) => d.count) || [1]), 1);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-10 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] md:text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
            Platform Analytics & Overview
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            Real-time platform vitals, user adoption trends, and moderation metrics for {firstName}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/admin/add-lesson"
            className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer inline-flex items-center text-sm"
          >
            + New Lesson
          </Link>
        </div>
      </div>

      {/* Primary Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Users */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
              Total Users
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1a202c] dark:text-white leading-tight">
              {analytics.totalUsers.toLocaleString()}
            </h2>
            <div className="flex items-center gap-1 text-[13px] font-semibold text-[#16A696] mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>Registered accounts</span>
            </div>
          </div>
        </div>

        {/* Total Public Lessons */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
              Public Lessons
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1a202c] dark:text-white leading-tight">
              {analytics.totalPublicLessons.toLocaleString()}
            </h2>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-2">
              Active in community
            </p>
          </div>
        </div>

        {/* Flagged / Reported Content */}
        <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/40 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Flagged Lessons
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-[32px] font-extrabold text-red-600 dark:text-red-400 leading-tight">
              {analytics.reportedLessons.toLocaleString()}
            </h2>
            <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mt-2">
              {analytics.reportedLessons > 0 ? "Requires moderation" : "All clean"}
            </p>
          </div>
        </div>

        {/* Today's New Lessons */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
              Today's New Lessons
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1a202c] dark:text-white leading-tight">
              {analytics.todayLessons.toLocaleString()}
            </h2>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-2 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Published in last 24h
            </p>
          </div>
        </div>

      </div>

      {/* Analytics Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Graph 1: Lesson Creation Growth */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1a202c] dark:text-white">
                  Lesson Publishing Trend
                </h3>
                <span className="text-[12px] text-zinc-400">Past 7 days creation rate</span>
              </div>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-zinc-100 dark:border-zinc-800">
            {analytics.lessonGrowth.map((item, idx) => {
              const barHeight = Math.max((item.count / maxLessonGrowth) * 100, 8);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[11px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${
                      item.count > 0 ? "bg-[#0f766e] dark:bg-[#16A696]" : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 mt-2">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[13px] text-zinc-500 dark:text-zinc-400 pt-4">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0f766e] dark:bg-[#16A696]"></span>
              Daily Lessons Added
            </span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {analytics.lessonGrowth.reduce((acc, c) => acc + c.count, 0)} total this week
            </span>
          </div>
        </div>

        {/* Graph 2: User Signups Growth */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1a202c] dark:text-white">
                  User Registration Trend
                </h3>
                <span className="text-[12px] text-zinc-400">Past 7 days member growth</span>
              </div>
            </div>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-zinc-100 dark:border-zinc-800">
            {analytics.userGrowth.map((item, idx) => {
              const barHeight = Math.max((item.count / maxUserGrowth) * 100, 8);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[11px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div
                    className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 ${
                      item.count > 0 ? "bg-indigo-600 dark:bg-indigo-500" : "bg-zinc-100 dark:bg-zinc-800"
                    }`}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-[12px] font-semibold text-zinc-500 dark:text-zinc-400 mt-2">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[13px] text-zinc-500 dark:text-zinc-400 pt-4">
            <span className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              New User Signups
            </span>
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
              {analytics.userGrowth.reduce((acc, c) => acc + c.count, 0)} users this week
            </span>
          </div>
        </div>

      </div>

      {/* Row 3: Most Active Contributors & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Most Active Contributors */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a202c] dark:text-white">
                    Top Active Contributors
                  </h3>
                  <p className="text-[12px] text-zinc-400">Authors with the highest lesson contributions</p>
                </div>
              </div>
              <Link
                href="/dashboard/admin/manage-users"
                className="text-[13px] font-semibold text-[#0f766e] dark:text-[#16A696] hover:underline flex items-center gap-1"
              >
                All Users <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {analytics.activeContributors.length > 0 ? (
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {analytics.activeContributors.map((author, index) => (
                  <div
                    key={`${author.userId || 'author'}-${index}`}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 rounded-xl px-2 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 text-center font-bold text-[13px] text-zinc-400">
                        #{index + 1}
                      </div>

                      <ImageWithSpinner width={500} height={500}
                        src={
                          author.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name || "User")}&background=random`
                        }
                        alt={author.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                      />

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-zinc-900 dark:text-white truncate">
                            {author.name}
                          </span>
                          {author.role === "admin" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-zinc-500 truncate">
                          {author.email || "No email available"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="px-3 py-1 rounded-full text-[12px] font-extrabold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200/50 dark:border-teal-500/20">
                        {author.lessonsCount} {author.lessonsCount === 1 ? "Lesson" : "Lessons"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-500">
                <p className="text-[14px]">No author submissions recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Shortcuts */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1a202c] dark:text-white mb-4">
              Quick Shortcuts
            </h3>
            
            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/admin/manage-lessons"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center shrink-0">
                  <FolderCog className="w-5 h-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                    Manage Lessons
                  </span>
                  <span className="text-[12px] text-zinc-500">Feature, review, or delete</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard/admin/manage-users"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <UserCog className="w-5 h-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                    User Management
                  </span>
                  <span className="text-[12px] text-zinc-500">Roles and account statuses</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard/admin/reported-content"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[14px] font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    Reported Content
                  </span>
                  <span className="text-[12px] text-zinc-500">Moderate open flags</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}