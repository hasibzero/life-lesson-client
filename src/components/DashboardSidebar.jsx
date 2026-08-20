"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { Avatar } from "@heroui/react";
import {
  Bookmark,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Moon,
  PlusIcon,
  Settings,
  Sun,
  BookOpen,
  Users,
  Flag,
  Star,
} from "lucide-react";
import { SidebarSkeleton } from "./SidebarSkeleton";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [reportedCount, setReportedCount] = useState(0);

  // Destructure refetch to keep user permissions in sync with MongoDB
  const { data: session, isPending, refetch } = authClient.useSession();
  const user = session?.user;

  const isPremium =
    user?.role === "admin" || user?.plan === "premium" || user?.isPremium;

  useEffect(() => {
    setMounted(true);
    // Background sync user session with database on mount
    if (typeof refetch === "function") {
      refetch();
    }
  }, [refetch]);

  // Fetch dynamic report count for badge
  useEffect(() => {
    const fetchReportedCount = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/admin/stats`);
        if (res.ok) {
          const data = await res.json();
          setReportedCount(data.reportedLessons || 0);
        }
      } catch (error) {
        console.error("Error fetching badge count:", error);
      }
    };

    fetchReportedCount();
  }, []);

  // Render standalone skeleton during loading / hydration
  if (!mounted || isPending) {
    return <SidebarSkeleton />;
  }

  const isActive = (path) => pathname === path;

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const rolePath = user?.role === "admin" ? "admin" : "user";
  const basePath = `/dashboard/${rolePath}`;

  const navLinks = {
    overview: `${basePath}/overview`,
    addLesson: `${basePath}/add-lesson`,
    lessons: `${basePath}/lessons`,
    saved: `${basePath}/saved`,
    settings: `${basePath}/settings`,
    manageLessons: `${basePath}/manage-lessons`,
    manageUsers: `${basePath}/manage-users`,
    reportedContent: `${basePath}/reported-content`,
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
        },
      },
    });
  };

  return (
    <aside className="w-[280px] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full flex-shrink-0 z-20 font-sans">
      {/* Logo */}
      <div className="px-8 pt-8 pb-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Digital Life Lessons"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* User Profile Area */}
      <div className="px-6 mb-6">
        <Link
          href={navLinks.settings}
          className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors group cursor-pointer"
        >
          <Avatar className="w-9 h-9 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold border border-zinc-300 dark:border-zinc-600 shrink-0">
            <Avatar.Image
              src={user?.image || null}
              alt={user?.name || "Profile"}
            />
            <Avatar.Fallback>{getUserInitial(user?.name)}</Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] font-bold text-zinc-900 dark:text-white leading-tight truncate group-hover:text-[#16A696] transition-colors flex items-center gap-1">
              {user?.name || "User Name"}
              {user?.plan === "premium" && (
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
              )}
            </span>
            <span className="text-[12px] font-medium text-zinc-500 capitalize">
              {user?.role === "admin"
                ? "Admin"
                : user?.plan === "premium"
                ? "Premium Creator"
                : "Free Plan"}
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {user?.role === "admin" ? (
          /* === ADMIN NAVIGATION === */
          <>
            <Link
              href={navLinks.overview}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.overview)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </Link>

            <Link
              href={navLinks.manageLessons}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.manageLessons)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Manage Lessons
            </Link>

            <Link
              href={navLinks.manageUsers}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.manageUsers)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Users className="w-5 h-5" />
              Manage Users
            </Link>

            <Link
              href={navLinks.reportedContent}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.reportedContent)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5" />
                Reported Content
              </div>
              {reportedCount > 0 && (
                <div
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[20px] h-[20px] ${
                    isActive(navLinks.reportedContent)
                      ? "bg-white text-[#16A696]"
                      : "bg-[#b91c1c] text-white"
                  }`}
                >
                  {reportedCount}
                </div>
              )}
            </Link>

            <Link
              href={navLinks.settings}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.settings)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings & Profile
            </Link>
          </>
        ) : (
          /* === USER NAVIGATION === */
          <>
            <Link
              href={navLinks.overview}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.overview)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </Link>

            <Link
              href={navLinks.addLesson}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.addLesson)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <PlusIcon className="w-5 h-5" />
              Add Lessons
            </Link>

            <Link
              href={navLinks.lessons}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.lessons)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
              My Lessons
            </Link>

            <Link
              href={navLinks.saved}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.saved)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Bookmark className="w-5 h-5" />
              Saved Lessons
            </Link>

            <Link
              href={navLinks.settings}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold transition-colors ${
                isActive(navLinks.settings)
                  ? "bg-[#16A696] text-white shadow-sm"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </>
        )}
      </nav>

      {/* Upgrade Section (Only for free non-admin users) */}
      {!isPremium && (
        <div className="px-4">
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-4" />
          <Link
            href="/pricing"
            className="w-full bg-[#0d6e63] hover:bg-[#0a574e] text-white font-semibold text-[14px] py-3 rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer"
          >
            Upgrade to Pro
          </Link>
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-4" />
        </div>
      )}

      {isPremium && (
        <div className="px-4">
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-4" />
        </div>
      )}

      {/* Bottom Actions */}
      <div className="px-4 pb-6 flex flex-col gap-1">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors w-full text-left"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          Toggle Theme
        </button>

        <button
          onClick={handleSignOut}
          className="cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-500 transition-colors w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;