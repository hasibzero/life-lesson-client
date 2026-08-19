"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  X,
  ArrowRight,
  RefreshCw,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";
import { Button, Spinner } from "@heroui/react";

function CancelReceipt() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // 1. Guard: Block direct manual visits to /cancel without a session ID
  if (!sessionId) {
    return (
      <div className="max-w-[420px] w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center shadow-sm flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-200/60 dark:border-amber-500/20">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
          No Canceled Session Found
        </h2>

        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
          This cancellation page is only accessible when redirected from an
          interrupted Stripe checkout session.
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

  // 2. Render only when arriving from a real checkout cancelation
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-[460px] w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col items-center text-center">
      {/* Top Cross Icon Badge */}
      <div className="w-14 h-14 rounded-full bg-rose-100/70 dark:bg-rose-500/10 flex items-center justify-center mb-6">
        <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-xs">
          <X className="w-5 h-5 stroke-[3]" />
        </div>
      </div>

      {/* Header */}
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight mb-2">
        Payment Incomplete
      </h1>
      <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 px-2">
        The checkout process was canceled or interrupted. No charges have been
        made to your payment method.
      </p>

      {/* Transaction Summary Card */}
      <div className="w-full bg-[#f1f5f9]/70 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-5 mb-6 text-left">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-3">
          Checkout Status
        </span>

        <div className="flex flex-col gap-2.5 text-[14px]">
          <div className="flex items-center justify-between text-zinc-700 dark:text-zinc-300 font-medium">
            <span>Intended Plan</span>
            <span className="font-bold text-zinc-900 dark:text-white">
              Lifetime Premium
            </span>
          </div>

          <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400 text-[13px]">
            <span>Payment Status</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              Canceled / Not Charged
            </span>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800/80 my-1"></div>

          <div className="flex items-center justify-between font-extrabold text-[16px] text-zinc-900 dark:text-white pt-1">
            <span>Total Charged</span>
            <span className="text-zinc-900 dark:text-white">৳0.00</span>
          </div>
        </div>
      </div>

      {/* 3-Column Metadata Strip */}
      <div className="w-full grid grid-cols-3 divide-x divide-zinc-200 dark:divide-zinc-800 text-center mb-8 py-1">
        <div className="flex flex-col gap-1 px-2">
          <span className="text-[11px] font-medium text-zinc-400 uppercase">
            Order Status
          </span>
          <span className="text-[12px] font-bold text-rose-600 dark:text-rose-400 truncate">
            Unfinished
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
            Security
          </span>
          <span className="text-[12px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-zinc-400" />
            <span>Encrypted</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col gap-3">
        <Link
          href="/pricing"
          className="w-full py-3.5 px-4 bg-[#208b7d] hover:bg-[#1a7469] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-[14px] shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Try Upgrading Again
        </Link>

        <Link
          href="/lessons"
          className="w-full py-3 px-4 bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-200 font-semibold rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors text-[14px] shadow-2xs text-center block cursor-pointer"
        >
          Back to Free Lessons
        </Link>
      </div>

      {/* Footer Text */}
      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-6 text-center">
        Encountering payment issues? Feel free to contact our support team.
      </p>
    </div>
  );
}

export default function CancelPage() {
  return (
    <div className="w-full min-h-screen bg-[#f8fafc] dark:bg-black py-12 px-4 flex items-center justify-center font-sans">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[40vh]">
            <Spinner size="lg" color="current" className="text-[#208b7d]" />
          </div>
        }
      >
        <CancelReceipt />
      </Suspense>
    </div>
  );
}
