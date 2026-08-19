"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import DashboardSidebar from "@/components/DashboardSidebar";
import { Spinner } from "@heroui/react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Redirect to /signin if user is not authenticated
  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/signin");
    }
  }, [isPending, user, router]);

  // Loading screen while verifying session
  if (isPending) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-zinc-950">
        <Spinner size="lg" color="current" className="text-[#16A696]" />
      </div>
    );
  }

  // Prevent flash of protected content while redirecting
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex bg-[#f8fafc] dark:bg-zinc-950 overflow-hidden font-sans">
      {/* === Sidebar === */}
      <DashboardSidebar />

      {/* === Main Content Area === */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}