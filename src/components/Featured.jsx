import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";
import LessonsCard from "./LessonsCard";

export const Featured = () => {
  return (
    <div>
      <section className="w-full py-10 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
        <div className="min-h-screen mx-auto px-6 lg:px-12">
          
          {/* Section Header */}
          <div className="flex justify-between items-end mb-8">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a202c] dark:text-white mb-2">
                Featured Lessons{" "}
              </h2>
              <p className="text-[17px] text-zinc-600 dark:text-zinc-400">
                Top-tier content for immediate impact.{" "}
              </p>
            </div>
            <div>
              <Button className="bg-[#16A696] hover:bg-[#077467] text-white border-0 rounded-none">
                <Link href="/">View All</Link>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <LessonsCard/>
          
        </div>
      </section>
    </div>
  );
};