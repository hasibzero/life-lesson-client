"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Chip, Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import {
  Check,
  X as CrossIcon,
  Star,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export default function PricingPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isPremiumUser =
    user?.role === "admin" || user?.plan === "premium" || user?.isPremium;

  const [isProcessing, setIsProcessing] = useState(false);

  const comparisonRows = [
    {
      feature: "Number of lessons created",
      free: "Up to 3 lessons",
      premium: "Unlimited lessons",
      highlight: true,
    },
    {
      feature: "Premium lesson creation",
      free: false,
      premium: true,
    },
    {
      feature: "Access to premium user content",
      free: false,
      premium: true,
    },
    {
      feature: "Priority listing on browse page",
      free: false,
      premium: true,
    },
    {
      feature: "100% Ad-free experience",
      free: false,
      premium: true,
    },
    {
      feature: "Community badge / verified status",
      free: false,
      premium: "Premium ⭐",
    },
    {
      feature: "Direct author Q&A & comments",
      free: true,
      premium: true,
    },
    {
      feature: "Downloadable resources & exports",
      free: false,
      premium: true,
    },
  ];

  const handleStripeCheckout = async () => {
    if (!user) {
      toast.error("Please log in to upgrade.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Redirecting to Stripe checkout...");

    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.email,
          userId: user?.id,
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        toast.dismiss(toastId);
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Unable to start checkout.", { id: toastId });
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Network error connecting to payment gateway.", {
        id: toastId,
      });
      setIsProcessing(false);
    }
  };

  if (isPending) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center bg-[#f9fafb] dark:bg-[#0c0c0e]">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  // Active Premium State View
  if (isPremiumUser) {
    return (
      <div className="relative w-full min-h-[80vh] flex items-center justify-center px-4 py-16 font-sans bg-[#f9fafb] dark:bg-[#0c0c0e] overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[300px] bg-amber-500/10 dark:bg-amber-500/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-xl w-full bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 sm:p-14 text-center shadow-xl flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/5 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 border border-amber-200/60 dark:border-amber-500/20 shadow-inner">
            <Star className="w-10 h-10 fill-amber-500 text-amber-500" />
          </div>

          <Chip className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 font-extrabold px-4 py-1.5 mb-5 border border-amber-200/50 dark:border-amber-500/20">
            Premium ⭐ Active
          </Chip>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
            You Have Lifetime Access
          </h1>
          <p className="text-[16px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10 max-w-md">
            Your account is already unlocked with full creator tools, unlimited
            publishing, and complete access to all premium wisdom modules.
          </p>

          <Link
            href={
              user?.role === "admin"
                ? "/dashboard/admin/overview"
                : "/dashboard/user/overview"
            }
            className="w-full sm:w-auto"
          >
            <Button className="w-full sm:w-auto bg-[#0f766e] hover:bg-[#0d6e63] text-white font-bold px-10 py-3.5 rounded-xl transition-all shadow-md hover:shadow-teal-500/20 active:scale-[0.98]">
              Go to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Standard Upgrade View
  return (
    <div className="relative w-full min-h-screen bg-[#f9fafb] dark:bg-[#0c0c0e] py-20 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[400px] bg-[#0f766e]/10 dark:bg-[#0f766e]/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col gap-14">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-4">
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-[1.15]">
            Invest in your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0f766e] to-teal-400 dark:from-[#16A696] dark:to-teal-300">
              Personal Growth
            </span>
          </h1>
          <p className="text-[16px] text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
            One single payment. Unlimited publishing, exclusive community perks,
            and full access to every premium lesson forever.
          </p>
        </div>

        {/* Pricing Tier Highlights Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-4xl mx-auto w-full">
          
          {/* Free Standard Tier */}
          <div className="bg-white dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 sm:p-10 flex flex-col justify-between shadow-sm transition-all hover:shadow-md">
            <div>
              <span className="text-[13px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Current Plan
              </span>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-2">
                Free Tier
              </h2>
              <div className="flex items-baseline gap-1 my-5">
                <span className="text-5xl font-extrabold text-zinc-900 dark:text-white">
                  ৳0
                </span>
                <span className="text-zinc-500 font-medium text-[15px]">/ lifetime</span>
              </div>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Basic access to browse community modules with limited lesson
                contributions.
              </p>
            </div>

            <div className="pt-8">
              <Button
                disabled
                variant="bordered"
                className="w-full border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 font-bold rounded-xl py-6 cursor-not-allowed opacity-70"
              >
                Your Current Tier
              </Button>
            </div>
          </div>

          {/* Premium Lifetime Tier */}
          <div className="bg-gradient-to-br from-[#0f766e] to-[#0d5c56] dark:from-[#116e67] dark:to-[#0a3f3a] text-white rounded-[2rem] p-8 sm:p-10 flex flex-col justify-between shadow-2xl shadow-teal-900/20 relative overflow-hidden ring-1 ring-white/20">
            <div className="absolute top-5 right-5 bg-amber-400 text-zinc-950 text-[11px] font-extrabold px-3.5 py-1.5 rounded-full shadow-sm">
              ONE-TIME PAYMENT
            </div>

            <div className="relative z-10">
              <span className="text-[13px] font-extrabold uppercase tracking-wider text-teal-200">
                Lifetime Access
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-2 flex items-center gap-2">
                Premium Member <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </h2>
              <div className="flex items-baseline gap-1.5 my-5">
                <span className="text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  ৳1,500
                </span>
                <span className="text-teal-100 text-[15px] font-medium">
                  / one-time
                </span>
              </div>
              <p className="text-[15px] text-teal-50/90 leading-relaxed">
                Unlock unrestricted creation, verified badge, ad-free reading,
                and full premium catalog access.
              </p>
            </div>

            <div className="pt-8 relative z-10">
              <Button
                onClick={handleStripeCheckout}
                disabled={isProcessing}
                className="w-full bg-white hover:bg-zinc-50 text-[#0f766e] font-extrabold text-[16px] rounded-xl py-6 transition-all shadow-lg active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <>
                    Upgrade to Premium <ArrowRight className="w-5 h-5 ml-1" />
                  </>
                )}
              </Button>
            </div>
            
            {/* Abstract Background shapes for Premium Card */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>

        {/* Free vs Premium Comparison Table */}
        <div className="bg-white dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden flex flex-col mx-auto w-full max-w-4xl">
          <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white">
              Feature Breakdown & Comparison
            </h2>
            <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mt-2">
              Detailed breakdown of features included across both tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider bg-zinc-50/80 dark:bg-zinc-900/80">
                  <th className="py-5 px-8 w-1/2">Features</th>
                  <th className="py-5 px-6 text-center w-1/4">Free</th>
                  <th className="py-5 px-6 text-center w-1/4 text-[#0f766e] dark:text-[#16A696]">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-[15px]">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-5 px-8 font-semibold text-zinc-800 dark:text-zinc-200">
                      {row.feature}
                    </td>

                    <td className="py-5 px-6 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : (
                          <CrossIcon className="w-5 h-5 text-zinc-300 dark:text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold text-zinc-500 dark:text-zinc-400">
                          {row.free}
                        </span>
                      )}
                    </td>

                    <td className="py-5 px-6 text-center bg-teal-50/40 dark:bg-teal-900/10">
                      {typeof row.premium === "boolean" ? (
                        row.premium ? (
                          <Check className="w-5 h-5 text-[#0f766e] dark:text-[#16A696] font-bold mx-auto" />
                        ) : (
                          <CrossIcon className="w-5 h-5 text-zinc-300 dark:text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span className="font-bold text-[#0f766e] dark:text-[#16A696]">
                          {row.premium}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Guarantee Note */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-[14px] font-medium text-zinc-500 dark:text-zinc-400 text-center pb-8">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0f766e] dark:text-[#16A696]" /> 256-bit Encrypted Stripe Checkout
          </span>
          <span className="hidden sm:inline">•</span>
          <span>Instant Account Upgrade</span>
          <span className="hidden sm:inline">•</span>
          <span>Lifetime Access (No Recurring Fees)</span>
        </div>
        
      </div>
    </div>
  );
}