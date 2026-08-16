import React from "react";
import { PanelLeft, ChevronLeft } from "lucide-react";

const Page = () => {
  return (
    <div className="relative flex min-h-[75vh] items-center justify-center overflow-hidden px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-[-120px] top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative flex max-w-lg flex-col items-center text-center">
        {/* Illustration */}
        <div className="relative mb-7">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-base-300 bg-base-100 shadow-sm">
            <PanelLeft className="h-9 w-9 text-primary" />
          </div>

          <div className="absolute -left-8 top-1/2 -translate-y-1/2">
            <ChevronLeft className="h-6 w-6 animate-pulse text-primary/50" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold tracking-tight">
          Nothing selected yet
        </h1>

        <p className="mt-3 max-w-md text-sm leading-6 text-base-content/60">
          Select an item from the left sidebar to open the corresponding
          section and see its content here.
        </p>

        {/* Hint */}
        <div className="mt-7 rounded-xl border border-base-300 bg-base-200/50 px-5 py-3 text-sm">
          <span className="font-medium">Tip:</span>{" "}
          <span className="text-base-content/60">
            Start by choosing an option from the sidebar.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;