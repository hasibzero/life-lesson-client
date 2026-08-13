import { Button } from "@heroui/react";
import Link from "next/link";
import React from "react";

export const TopContributors = () => {
  return (
    <div>
      <section className="w-full py-10 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 ">
        <div
          className="max-w-[1200px] mx-auto px-6 lg:px-12 flex
          justify-between"
        >
          {/* Section Header */}
          <div className="text-left mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a202c] dark:text-white mb-2">
              Top Contributors{" "}
            </h2>
            <p className="text-[17px] text-zinc-600 dark:text-zinc-400">
              Learn from the industry expert.{" "}
            </p>
          </div>
        </div>
        {/* Bento Grid Layout */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className=" inline-block border-2 py-[24px] px-[90px] rounded-sm">
            <h2>jane doe</h2>
            <p>Leadership coach</p>
            <p>likes count 10000</p>
          </div>
        </div>
      </section>
    </div>
  );
};
