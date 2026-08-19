"use client";

import React from "react";

import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import LessonsCard from "./LessonsCard";
import Link from "next/link";

export const Featured = () => {
  return (
    <section className="w-full py-12 sm:py-16 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Responsive Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a202c] dark:text-white tracking-tight mb-2">
              Featured Lessons
            </h2>
            <p className="text-sm sm:text-base md:text-[17px] text-zinc-600 dark:text-zinc-400">
              Top-tier content for immediate impact.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-[#16A696] hover:bg-[#077467] text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
              <Link href="/lessons">
                <span>View All</span>
              </Link>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dynamic Card Container */}
        <div className="w-full">
          <LessonsCard />
        </div>
      </div>
    </section>
  );
};

export default Featured;
