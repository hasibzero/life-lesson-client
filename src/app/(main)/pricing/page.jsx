'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';

// === Reusable SVGs ===
const CheckIcon = ({ className }) => (
  <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.5 12L11 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DashIcon = ({ className }) => (
  <svg className={`w-5 h-5 ${className}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function Pricing() {
  // Pricing Features Data
  const features = [
    { name: 'Access to all lessons', free: true, premium: true },
    { name: 'Expert-curated pathways', free: false, premium: true },
    { name: 'Downloadable resources', free: false, premium: true },
    { name: 'Direct author Q&A', free: false, premium: true },
    { name: 'Ad-free experience', free: false, premium: true },
    { name: 'Exclusive webinars', free: false, premium: true },
    { name: 'Priority support', free: false, premium: true },
    { name: 'Certification', free: false, premium: true },
  ];

  return (
    <section className="w-full bg-slate-50 dark:bg-[#000000] py-20 px-4 md:px-8 transition-colors duration-300">
      {/* Optimized Background for Light and Dark Mode */}
      
      {/* Header Area */}
      <div className="max-w-[800px] mx-auto text-center mb-16">
        {/* Optimized Text Colors */}
        <h2 className="text-3xl md:text-[40px] font-bold text-[#1e293b] dark:text-slate-200 mb-4 transition-colors">
          Choose Your Path to Wisdom
        </h2>
        <p className="text-[15px] text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[600px] mx-auto transition-colors">
          Unlock expert-curated pathways, direct author Q&As, and exclusive certification to accelerate your professional growth.
        </p>
      </div>

      {/* Pricing Grid Layout */}
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        
        {/* === Left Column: Feature Names (Desktop Only) === */}
        <div className="hidden lg:flex flex-col">
          {/* Header Spacer to perfectly align with Card Headers */}
          <div className="h-[140px] flex items-end pb-6 px-2">
            <h3 className="text-xl font-bold text-[#1e293b] dark:text-slate-300 transition-colors">Features</h3>
          </div>
          
          {/* Mapped Feature Names */}
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              // Optimized Border and Text Colors
              className="h-[60px] flex items-center border-b border-zinc-200 dark:border-zinc-800 px-2 transition-colors"
            >
              <span className="text-[14px] text-zinc-500 dark:text-zinc-400 transition-colors">{feature.name}</span>
            </div>
          ))}
          
          {/* Footer Spacer to perfectly align with Card Buttons */}
          <div className="h-[100px]"></div>
        </div>

        {/* === Middle Column: Free Plan === */}
        {/* Card remains white even in dark mode to match design intent */}
        <div className="bg-gray-400 rounded-xl flex flex-col pt-8 pb-8 px-6 shadow-lg relative">
          
          {/* Free Header */}
          <div className="h-[108px] flex flex-col items-center justify-start text-center">
            <h3 className="text-3xl font-bold text-[#0f172a] mb-2">Free</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] font-bold text-[#0b8a78]">$0</span>
              <span className="text-[14px] text-zinc-500">/mo</span>
            </div>
          </div>

          {/* Free Features */}
          <div className="flex flex-col w-full">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="h-[60px] flex items-center justify-between lg:justify-center border-b border-zinc-100"
              >
                {/* Visible only on mobile inside the card */}
                <span className="lg:hidden text-[14px] text-zinc-600">{feature.name}</span>
                
                {feature.free ? (
                  <CheckIcon className="text-[#0b8a78]" />
                ) : (
                  <DashIcon className="text-zinc-300" />
                )}
              </div>
            ))}
          </div>

          {/* Free Action Button */}
          <div className="h-[100px] flex flex-col justify-end mt-4">
            <Button 
              variant="bordered"
              radius="sm"
              className="w-full border-zinc-300 text-[#4f46e5] font-semibold hover:bg-zinc-50 p-0 bg-white"
            >
              <Link href="/signup" className="flex items-center justify-center w-full h-full py-4 text-[14px]">
                Current Plan
              </Link>
            </Button>
          </div>
        </div>

        {/* === Right Column: Premium Plan === */}
        {/* Card remains teal in both modes */}
        <div className="bg-[#0b8a78] rounded-xl flex flex-col pt-8 pb-8 px-6 shadow-xl relative">
          
          {/* Most Popular Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#065046] text-white text-[11px] font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-sm">
            Most Popular
          </div>

          {/* Premium Header */}
          <div className="h-[108px] flex flex-col items-center justify-start text-center">
            <h3 className="text-3xl font-bold text-white mb-2">Premium</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-[18px] font-bold text-white">$29</span>
              <span className="text-[14px] text-[#86d9ce]">/mo</span>
            </div>
          </div>

          {/* Premium Features */}
          <div className="flex flex-col w-full">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="h-[60px] flex items-center justify-between lg:justify-center border-b border-[#129f8c]"
              >
                {/* Visible only on mobile inside the card */}
                <span className="lg:hidden text-[14px] text-white">{feature.name}</span>
                
                {feature.premium ? (
                  <CheckIcon className="text-white" />
                ) : (
                  <DashIcon className="text-[#109b86]" />
                )}
              </div>
            ))}
          </div>

          {/* Premium Action Button */}
          <div className="h-[100px] flex flex-col justify-end mt-4">
            <Button 
              radius="sm"
              className="w-full bg-[#086b5e] hover:bg-[#065046] text-white font-semibold shadow-md p-0"
            >
              <Link href="/checkout" className="flex items-center justify-center w-full h-full py-4 text-[14px]">
                Join Premium
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}