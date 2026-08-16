import { authClient } from '@/lib/auth-client'
import { Avatar, Button } from '@heroui/react'
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
  Flag
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const DashboardSidebar = () => {
  const pathname = usePathname();

  // Helper to check active links
  const isActive = (path) => pathname === path;
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  
  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const rolePath = user?.role === 'admin' ? 'admin' : 'user';
  const basePath = `/dashboard/${rolePath}`;
  
  // Navigation Links mapping
  const navLinks = {
    overview: `${basePath}/overview`,
    addLesson: `${basePath}/add-lesson`, 
    lessons: `${basePath}/lessons`,
    saved: `${basePath}/saved`,
    settings: `${basePath}/settings`,
    // Admin specific links
    manageLessons: `${basePath}/manage-lessons`,
    manageUsers: `${basePath}/manage-users`,
    reportedContent: `${basePath}/reported-content`,
  };

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/signin');
        },
      },
    });
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="w-[280px] bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full flex-shrink-0 z-20">
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
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold border border-zinc-300 dark:border-zinc-600">
            <Avatar.Image src={user?.image || ""} alt={user?.name || "Profile"} />
            <Avatar.Fallback>
              {getUserInitial(user?.name)}
            </Avatar.Fallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-zinc-900 dark:text-white leading-tight">
              {user?.name || "User Name"}
            </span>
            <span className="text-[12px] font-medium text-zinc-500 capitalize">
              {user?.role || "User Role"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto no-scrollbar">
        {user?.role === 'admin' ? (
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
              {/* Notification Badge */}
              <div className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[20px] h-[20px] ${
                isActive(navLinks.reportedContent) 
                  ? "bg-white text-[#16A696]" 
                  : "bg-[#b91c1c] text-white"
              }`}>
                5
              </div>
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

      {/* Upgrade Section - ONLY VISIBLE FOR NON-ADMINS */}
      {user?.role !== 'admin' && (
        <div className="px-4">
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-4" />
          <Button className="w-full bg-[#0d6e63] hover:bg-[#0a574e] text-white font-semibold text-[14px] py-6 rounded-xl transition-all shadow-sm">
            Upgrade to Pro
          </Button>
          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-4" />
        </div>
      )}
      
      {/* If Admin, just add a simple divider to match layout spacing */}
      {user?.role === 'admin' && (
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
          {mounted && theme === "dark" ? (
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
  )
}

export default DashboardSidebar