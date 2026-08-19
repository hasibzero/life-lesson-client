"use client";

import React, { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ArrowRight, CreditCard, AlertCircle } from "lucide-react";
import { Button, Spinner } from "@heroui/react";

function SuccessReceipt() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  // 1. Guard: If someone visits /success manually without session_id
  if (!sessionId) {
    return (
      <div className="max-w-[420px] w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center shadow-sm flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-200/60 dark:border-amber-500/20">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          No Active Transaction Found
        </h2>
        
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
          This receipt page is only accessible directly after completing a checkout session.
        </p>

        <Link
  href="/pricing"
  className="w-full bg-[#0f766e] hover:bg-[#0d6e63] text-white font-bold py-3 rounded-xl transition-all shadow-xs cursor-pointer text-sm text-center block"
>
  Go to Pricing Page
</Link>
      </div>
    );
  }

  // 2. Format Real Transaction Data
  const orderNumber = `#DLL-${sessionId.slice(-8).toUpperCase()}`;

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-[460px] w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col items-center text-center">
      {/* Top Check Icon Badge */}
      <div className="w-14 h-14 rounded-full bg-emerald-100/70 dark:bg-emerald-500/10 flex items-center justify-center mb-6">
        <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center text-white shadow-xs">
          <Check className="w-5 h-5 stroke-[3]" />
        </div>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
        Payment Successful
      </h1>
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 px-2">
        Thank you for your purchase. Your access to Digital Life Lessons is now active.
      </p>

      {/* Transaction Summary Card */}
      <div className="w-full bg-[#f1f5f9]/70 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 mb-6 text-left">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-3">
          Transaction Summary
        </span>

        <div className="flex flex-col gap-2.5 text-[14px]">
          <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 font-medium">
            <span>Premium Subscription (Lifetime)</span>
            <span className="font-bold text-zinc-900 dark:text-white">৳1,500</span>
          </div>

          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-[13px]">
            <span>Tax</span>
            <span>৳0.00</span>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800/80 my-1"></div>

          <div className="flex items-center justify-between font-extrabold text-[16px] text-zinc-900 dark:text-white pt-1">
            <span>Total</span>
            <span className="text-[#0f766e] dark:text-teal-400">৳1,500</span>
          </div>
        </div>
      </div>

      {/* 3-Column Metadata Strip */}
      <div className="w-full grid grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800 text-center mb-8 py-1">
        <div className="flex flex-col gap-1 px-2">
          <span className="text-[11px] font-medium text-zinc-400 uppercase">
            Order Number
          </span>
          <span className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200 truncate">
            {orderNumber}
          </span>
        </div>

        <div className="flex flex-col gap-1 px-2">
          <span className="text-[11px] font-medium text-zinc-400 uppercase">
            Date
          </span>
          <span className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200 truncate">
            {formattedDate}
          </span>
        </div>

        <div className="flex flex-col gap-1 px-2">
          <span className="text-[11px] font-medium text-zinc-400 uppercase">
            Payment Method
          </span>
          <span className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-zinc-500" />
            <span>•••• 4242</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3">
        <Link
          href="/lessons"
          className="w-full py-3.5 px-4 bg-[#208b7d] hover:bg-[#1a7469] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-[14px] shadow-xs cursor-pointer"
        >
          Start Learning <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/dashboard/user/overview"
          className="w-full py-3 px-4 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors text-[14px] shadow-2xs text-center block cursor-pointer"
        >
          View Dashboard
        </Link>
      </div>

      {/* Footer Text */}
      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-6 text-center">
        A confirmation email has been sent to your registered address.
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="w-full min-h-screen bg-[#f8fafc] dark:bg-black py-12 px-4 flex items-center justify-center font-sans">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[40vh]">
            <Spinner size="lg" color="current" className="text-[#208b7d]" />
          </div>
        }
      >
        <SuccessReceipt />
      </Suspense>
    </div>
  );
}