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
} from "lucide-react";
import toast from "react-hot-toast";

export default function PricingPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isPremiumUser =
    user?.role === "admin" || user?.plan === "premium" || user?.isPremium;

  // Unified loading state
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
        // Navigates directly to Stripe Checkout
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
      <div className="w-full min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  // Active Premium State View
  if (isPremiumUser) {
    return (
      <div className="w-full min-h-[75vh] flex items-center justify-center px-4 py-16 font-sans">
        <div className="max-w-xl w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 sm:p-12 text-center shadow-lg flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 border border-amber-200/60 dark:border-amber-500/20">
            <Star className="w-8 h-8 fill-amber-500 text-amber-500" />
          </div>

          <Chip className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 font-bold px-3 py-1 mb-4 border border-amber-200/50">
            Premium ⭐ Active
          </Chip>

          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-3">
            You Have Lifetime Access
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 max-w-md">
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
            <Button className="w-full sm:w-auto bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm">
              Go to Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-black py-16 px-4 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Upgrade to Lifetime Premium
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
            One single payment. Unlimited publishing, exclusive community perks,
            and full access to every premium lesson forever.
          </p>
        </div>

        {/* Pricing Tier Highlights Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Free Standard Tier */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-[13px] font-bold uppercase tracking-wider text-zinc-400">
                Current Plan
              </span>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                Free Tier
              </h2>
              <div className="flex items-baseline gap-1 my-4">
                <span className="text-4xl font-extrabold text-zinc-900 dark:text-white">
                  ৳0
                </span>
                <span className="text-zinc-500 text-[14px]">/ lifetime</span>
              </div>
              <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Basic access to browse community modules with limited lesson
                contributions.
              </p>
            </div>

            <div className="pt-8">
              <Button
                disabled
                variant="bordered"
                className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-400 font-semibold rounded-xl py-6 cursor-not-allowed"
              >
                Your Current Tier
              </Button>
            </div>
          </div>

          {/* Premium Lifetime Tier */}
          <div className="bg-gradient-to-br from-[#0f766e] to-[#115e59] text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl relative overflow-hidden ring-2 ring-[#0f766e]">
            <div className="absolute top-4 right-4 bg-amber-400 text-zinc-950 text-[11px] font-extrabold px-3 py-1 rounded-full shadow-sm">
              ONE-TIME PAYMENT
            </div>

            <div>
              <span className="text-[13px] font-bold uppercase tracking-wider text-teal-200">
                Lifetime Access
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                Premium Member
              </h2>
              <div className="flex items-baseline gap-1.5 my-4">
                <span className="text-5xl font-extrabold tracking-tight">
                  ৳1,500
                </span>
                <span className="text-teal-100 text-[15px] font-medium">
                  / one-time
                </span>
              </div>
              <p className="text-[14px] text-teal-50 leading-relaxed">
                Unlock unrestricted creation, verified badge, ad-free reading,
                and full premium catalog access.
              </p>
            </div>

            <div className="pt-8">
              <Button
                onClick={handleStripeCheckout}
                disabled={isProcessing}
                className="w-full bg-white hover:bg-zinc-100 text-[#0f766e] font-extrabold text-[15px] rounded-xl py-6 transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <>
                    Upgrade to Premium <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Free vs Premium Comparison Table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Feature Breakdown & Comparison
            </h2>
            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
              Detailed breakdown of features included across both tiers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50">
                  <th className="py-4 px-6 w-1/2">Features</th>
                  <th className="py-4 px-6 text-center w-1/4">Free</th>
                  <th className="py-4 px-6 text-center w-1/4 text-[#0f766e] dark:text-[#16A696]">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-[14px]">
                {comparisonRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-zinc-800 dark:text-zinc-200">
                      {row.feature}
                    </td>

                    <td className="py-4 px-6 text-center">
                      {typeof row.free === "boolean" ? (
                        row.free ? (
                          <Check className="w-5 h-5 text-emerald-600 mx-auto" />
                        ) : (
                          <CrossIcon className="w-5 h-5 text-zinc-300 dark:text-zinc-600 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold text-zinc-500">
                          {row.free}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-center bg-teal-50/30 dark:bg-teal-950/10">
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[13px] text-zinc-500 dark:text-zinc-400 text-center pb-8">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0f766e]" /> 256-bit Encrypted
            Stripe Checkout
          </span>
          <span>•</span>
          <span>Instant Account Upgrade</span>
          <span>•</span>
          <span>Lifetime Access (No Recurring Fees)</span>
        </div>
      </div>
    </div>
  );
}
