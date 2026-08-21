"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Spinner } from "@heroui/react";

export default function ImageWithSpinner({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className || ""}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100/30 dark:bg-zinc-800/30 z-10">
          <Spinner size="sm" color="current" className="text-[#0f766e]" />
        </div>
      )}
      <Image
        {...props}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
