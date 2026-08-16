"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, Button } from "@heroui/react";
import {
  LayoutDashboard,
  GraduationCap,
  Bookmark,
  Settings,
  Moon,
  LogOut,
  Sun,
  PlusIcon,
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import DashboardSidebar from "@/components/DashboardSidebar";


export default function DashboardLayout({ children }) {
  


  return (
    // Changed to horizontal flex to put sidebar on the left
    <div className="h-screen flex bg-[#f8fafc] dark:bg-zinc-950 overflow-hidden">
      {/* === Sidebar === */}
     <DashboardSidebar/>

      {/* === Main Content Area === */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
