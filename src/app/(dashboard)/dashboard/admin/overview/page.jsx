"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button, Spinner } from "@heroui/react";
import {
  Users,
  BookOpen,
  CreditCard,
  AlertTriangle,
  UserCog,
  FolderCog,
  ShieldAlert,
  TrendingUp,
  Download
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Dynamic Admin Stats State
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessons: 0,
    activeSubscriptions: 0,
    reportedLessons: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        
        // Fetch real analytics data from the backend
        const res = await fetch(`${backendUrl}/api/admin/stats`);
        if (res.ok) {
          const data = await res.json();
          setStats({
            totalUsers: data.totalUsers || 0,
            totalLessons: data.totalLessons || 0,
            activeSubscriptions: data.activeSubscriptions || 0,
            reportedLessons: data.reportedLessons || 0,
          });
        } else {
          toast.error("Failed to load platform analytics.");
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        toast.error("Server connection error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const firstName = user?.name ? user.name.split(" ")[0] : "Admin";

  return (
    <div className="w-full flex flex-col gap-10 font-sans">
      
      {/* === Header Row === */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[28px] md:text-3xl font-bold text-[#1a202c] dark:text-white tracking-tight">
            Platform Overview
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            High-level metrics and recent activity for {firstName}.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-[14px] font-semibold text-zinc-700 dark:text-zinc-300 shadow-sm cursor-pointer">
            <span>Last 30 Days</span>
          </div>
          <Button className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold px-4 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* === Stats Cards Grid === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Users */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-semibold text-zinc-700 dark:text-zinc-300">
              Total Users
            </span>
            <Users className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1a202c] dark:text-white leading-tight">
              {isLoading ? <Spinner size="sm" color="current" /> : stats.totalUsers.toLocaleString()}
            </h2>
            <div className="flex items-center gap-1 text-[13px] font-semibold text-[#16A696] mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>Live count</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Lessons */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-semibold text-zinc-700 dark:text-zinc-300">
              Total Lessons
            </span>
            <BookOpen className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1a202c] dark:text-white leading-tight">
              {isLoading ? <Spinner size="sm" color="current" /> : stats.totalLessons.toLocaleString()}
            </h2>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-2">
              Active 
            </p>
          </div>
        </div>

        {/* Card 3: Pro Subscriptions (Only Premium Users) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-semibold text-zinc-700 dark:text-zinc-300">
              Pro Subscriptions
            </span>
            <CreditCard className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-[32px] font-extrabold text-[#1a202c] dark:text-white leading-tight">
              {isLoading ? <Spinner size="sm" color="current" /> : stats.activeSubscriptions.toLocaleString()}
            </h2>
            <div className="flex items-center gap-1 text-[13px] font-semibold text-[#16A696] mt-2">
              <TrendingUp className="w-4 h-4" />
              <span>Premium tier</span>
            </div>
          </div>
        </div>

        {/* Card 4: Reported Lessons */}
        <div className="bg-white dark:bg-zinc-900 border border-red-500 dark:border-red-500/50 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-semibold text-red-600 dark:text-red-400">
              Reported Lessons
            </span>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-[32px] font-extrabold text-red-600 dark:text-red-400 leading-tight">
              {isLoading ? <Spinner size="sm" color="current" /> : stats.reportedLessons.toLocaleString()}
            </h2>
            <p className="text-[13px] font-semibold text-red-600 dark:text-red-400 mt-2">
              Requires attention
            </p>
          </div>
        </div>

      </div>

      {/* === Quick Actions Section === */}
      <div>
        <h2 className="text-xl font-bold text-[#1a202c] dark:text-white mb-5">
          Quick Actions
        </h2>

        <div className="flex flex-col gap-4 w-full md:w-[420px]">
          
          {/* Action 1: User Management */}
          <Link href="/dashboard/admin/manage-users" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#16A696] dark:hover:border-[#16A696] transition-colors shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-[#e6f2f1] text-[#0f7a6f] dark:bg-[#16A696]/10 dark:text-[#16A696] flex items-center justify-center shrink-0 transition-colors">
              <UserCog className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#1a202c] dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                User Management
              </span>
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Manage user roles, accounts, and permissions
              </span>
            </div>
          </Link>

          {/* Action 2: Lesson Management */}
          <Link href="/dashboard/admin/manage-lessons" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#16A696] dark:hover:border-[#16A696] transition-colors shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-[#e6f2f1] text-[#0f7a6f] dark:bg-[#16A696]/10 dark:text-[#16A696] flex items-center justify-center shrink-0 transition-colors">
              <FolderCog className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#1a202c] dark:text-zinc-100 group-hover:text-[#16A696] transition-colors">
                Lesson Management
              </span>
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Review, feature, or remove platform lessons
              </span>
            </div>
          </Link>

          {/* Action 3: Reported Content */}
          <Link href="/dashboard/admin/reported-content" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-red-500 dark:hover:border-red-500 transition-colors shadow-sm group">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 flex items-center justify-center shrink-0 transition-colors">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-[#1a202c] dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                Reported Content
              </span>
              <span className="text-[13px] text-zinc-500 dark:text-zinc-400">
                Inspect flag requests and moderate reports
              </span>
            </div>
          </Link>

        </div>
      </div>

    </div>
  );
}