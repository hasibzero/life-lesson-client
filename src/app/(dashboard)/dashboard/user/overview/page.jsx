"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button, Spinner } from "@heroui/react";
import {
  Search,
  Bookmark,
  Send,
  Archive,
  PlusCircle,
  Compass,
  Edit3,
  Award,
  CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";

export default function OverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Determine if user has premium access
  const isPremiumUser = user?.role === 'admin' || user?.plan === 'premium';

  // Dynamic State for Stats
  const [stats, setStats] = useState({
    savedLessons: 0,
    mySubmissions: 0,
    totalSavesReceived: 0, // How many times others saved this user's lessons
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Dashboard Stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user?.id) return;

      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        
        // Fetch the user's submitted lessons to get the count
        const lessonsRes = await fetch(`${backendUrl}/api/my-lessons/${user.id}`);
        const lessonsData = lessonsRes.ok ? await lessonsRes.json() : [];
        
        // NOTE: Replace these with your actual endpoints for saved lessons if you have them!
        // For now, we calculate submissions and simulate the others.
        setStats({
          savedLessons: user?.savedLessons?.length || 0, // Example if stored on user object
          mySubmissions: lessonsData.length || 0,
          totalSavesReceived: lessonsData.reduce((acc, curr) => acc + (curr.savesCount || 0), 0),
        });

      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  // Extract first name for greeting
  const firstName = user?.name ? user.name.split(" ")[0] : "Executive";

  // Calculate Progress Bar Widths (Cap at 100%)
  const maxFreeSubmissions = 3;
  const maxFreeSaves = 5;
  
  const submissionsPercent = Math.min((stats.mySubmissions / maxFreeSubmissions) * 100, 100);
  const savesPercent = Math.min((stats.savedLessons / maxFreeSaves) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-10">
      
      {/* === Header Row === */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-[28px] md:text-3xl font-bold text-[#1a202c] dark:text-white tracking-tight">
            Welcome back, {firstName}.
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            Here is your learning progress for the week.
          </p>
        </div>
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
              {isLoading ? <Spinner size="sm" color="current" /> : stats.savedLessons}
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
              {isLoading ? <Spinner size="sm" color="current" /> : stats.mySubmissions}
            </h2>
            <p className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
              My Submissions
            </p>
          </div>
        </div>

        {/* Card 3: Total Saved Count (Impact) */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#c97b53] text-white dark:bg-[#c97b53]/80 flex items-center justify-center mb-8">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[28px] font-bold text-[#1a202c] dark:text-white leading-tight">
              {isLoading ? <Spinner size="sm" color="current" /> : stats.totalSavesReceived}
            </h2>
            <p className="text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 mt-1">
              Times Others Saved Your Work
            </p>
          </div>
        </div>
      </div>

      {/* === Upgrade / Premium Status Section === */}
      <div className={`w-full border rounded-xl p-6 flex flex-col md:flex-row justify-between gap-8 shadow-sm transition-colors ${isPremiumUser ? 'bg-[#f0fdf4] border-[#bbf7d0] dark:bg-[#064e3b]/20 dark:border-[#065f46]' : 'bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800'}`}>
        
        {/* Content Side */}
        <div className="flex flex-col gap-4 flex-1">
          {/* Header */}
          <div className="flex items-center gap-3">
            {isPremiumUser ? (
              <CheckCircle2 className="w-6 h-6 text-[#16A696]" />
            ) : (
              <Award className="w-6 h-6 text-[#147062] dark:text-[#16A696]" />
            )}
            <h2 className="text-2xl font-bold text-[#0d233a] dark:text-white tracking-tight">
              {isPremiumUser ? "Premium Active" : "Upgrade to Premium"}
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-[14px] text-zinc-600 dark:text-zinc-400">
            {isPremiumUser 
              ? "You have full access to all platform features with no restrictions." 
              : "Free accounts have limited functionality. Upgrade to remove restrictions."}
          </p>

          {/* Bullet Points (Only show limits if free) */}
          {!isPremiumUser && (
            <>
              <ul className="list-disc pl-5 text-[14px] text-zinc-600 dark:text-zinc-400 flex flex-col gap-2 marker:text-zinc-400 mt-1">
                <li>Maximum {maxFreeSubmissions} lesson posts</li>
                <li>Maximum {maxFreeSaves} saved lessons</li>
                <li>No access to premium content</li>
              </ul>

              {/* Progress Bars */}
              <div className="flex flex-col sm:flex-row gap-8 mt-4">
                {/* Lessons Added */}
                <div className="w-full sm:w-[220px] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[13px] font-bold text-[#0d233a] dark:text-zinc-200">
                    <span>Lessons Added</span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {stats.mySubmissions}/{maxFreeSubmissions}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e0e7ff] dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${stats.mySubmissions >= maxFreeSubmissions ? 'bg-red-500' : 'bg-[#16A696]'}`} 
                      style={{ width: `${submissionsPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Lessons Saved */}
                <div className="w-full sm:w-[220px] flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[13px] font-bold text-[#0d233a] dark:text-zinc-200">
                    <span>Lessons Saved</span>
                    <span className="text-zinc-600 dark:text-zinc-400">
                      {stats.savedLessons}/{maxFreeSaves}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#e0e7ff] dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${stats.savedLessons >= maxFreeSaves ? 'bg-red-500' : 'bg-[#16A696]'}`} 
                      style={{ width: `${savesPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Button Side */}
        {!isPremiumUser && (
          <div className="flex md:items-center justify-start md:justify-end mt-2 md:mt-0">
            <Button 
              as={Link} 
              href="/pricing" 
              className="bg-[#147062] hover:bg-[#10594e] text-white font-semibold px-6 py-5 rounded-lg transition-colors"
            >
              Upgrade to Pro
            </Button>
          </div>
        )}
      </div>

      {/* === Quick Actions Section === */}
      <div>
        <h2 className="text-xl font-bold text-[#1a202c] dark:text-white mb-5">
          Quick Actions
        </h2>

        <div className="flex flex-col gap-4 w-full md:w-[400px]">
          {/* Action 1 */}
          <Link href="/dashboard/user/add-lesson" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#16A696] dark:hover:border-[#16A696] transition-colors shadow-sm group">
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
          </Link>

          {/* Action 2 */}
          <Link href="/lessons" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#16A696] dark:hover:border-[#16A696] transition-colors shadow-sm group">
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
          </Link>

          {/* Action 3 */}
          <Link href="/dashboard/user/my-lessons" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-[#16A696] dark:hover:border-[#16A696] transition-colors shadow-sm group">
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
          </Link>
        </div>
      </div>
      
    </div>
  );
}