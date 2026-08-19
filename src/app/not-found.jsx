'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@heroui/react';

// Reusable SVG for the Book Icon
const BookIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

// Reusable SVG for the Home Icon
const HomeIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-zinc-950 px-6 py-16 text-center transition-colors duration-300">


      {/* Main 404 Heading */}
      <h1 className="text-5xl md:text-[56px] font-bold text-[#0c6b5e] dark:text-[#16A696] mb-4 tracking-tight">
        404
      </h1>
      
      {/* Subheading */}
      <h2 className="text-2xl md:text-3xl font-bold text-[#1a202c] dark:text-white mb-4">
        Page Not Found
      </h2>
      
      {/* Descriptive Text */}
      <p className="max-w-[500px] text-[15px] text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed font-medium">
        It seems this lesson has been misplaced in our archives. The path you are
        seeking doesn't exist, but there is still much to learn.
      </p>

      {/* Action Buttons Container */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        
        {/* Primary Button: Back to Lessons */}
        <Button 
          radius="sm"
          className="w-full sm:w-auto bg-[#0c6b5e] hover:bg-[#095449] text-white font-semibold px-6 py-5 shadow-sm transition-colors p-0"
        >
          <Link href="/lessons" className="flex items-center justify-center w-full h-full px-6">
            <BookIcon />
            Back to Lessons
          </Link>
        </Button>

        {/* Secondary Button: Return Home */}
        <Button 
          
          radius="sm"
          className="w-full sm:w-auto border-[#0c6b5e] text-[#0c6b5e] dark:border-[#16A696] dark:text-[#16A696] hover:bg-[#0c6b5e]/10 dark:hover:bg-[#16A696]/10 font-semibold px-6 py-5 transition-colors bg-white dark:bg-transparent p-0"
        >
          <Link href="/" className="flex items-center justify-center w-full h-full px-6">
            <HomeIcon />
            Return Home
          </Link>
        </Button>

      </div>
    </main>
  );
}