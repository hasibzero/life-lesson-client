// components/Navbar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from './ThemeToggle';

const THEME_TEAL = '#149788';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full h-20 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 relative z-50">
      <div className="max-w-[1920px] mx-auto h-full px-6 lg:px-12 flex items-center justify-between">
        
        {/* === Logo Section (Left) === */}
        <Link 
          href="/" 
          className="flex items-center gap-3 text-[#2D3748] dark:text-zinc-50 hover:opacity-90 transition-opacity z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image 
            src="/logo.png" 
            alt="Digital Life Lessons Logo" 
            width={120} 
            height={120} 
            className="rounded-lg object-contain w-auto h-auto max-h-12"
            priority
          />
        </Link>

        {/* === Desktop Navigation Section (Right) === */}
        <div className="hidden lg:flex items-center gap-10">
          
          {/* Main Links */}
          <div className="flex items-center gap-10">
            <Link href="/lessons" className="text-xl font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900 transition-colors">
              Lessons
            </Link>
            <Link href="/about" className="text-xl font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900 transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-xl font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900 transition-colors">
              Pricing
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <ThemeToggle />

          {/* Divider */}
          <div className="h-12 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* Action Buttons */}
          <div className="flex items-center gap-8">
            <Link href="/signin" className="text-xl font-semibold text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900 transition-colors">
              Sign In
            </Link>
            
            <Link 
              href="/signup" 
              className="text-xl font-semibold text-white px-8 py-3 rounded-xl transition-all hover:brightness-110"
              style={{ backgroundColor: THEME_TEAL }}
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* === Mobile Controls (Right) === */}
        <div className="flex lg:hidden items-center gap-4 z-50">
          <ThemeToggle />
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              // Close Icon
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger Icon
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* === Mobile Menu Dropdown === */}
      {/* Conditionally rendered based on state, sliding down gracefully below the header */}
      {isMobileMenuOpen && (
        <div className="absolute top-24 left-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-8 flex flex-col gap-6 lg:hidden shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
          
          <div className="flex flex-col gap-6 text-center">
            <Link 
              href="/lessons" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900"
            >
              Lessons
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900"
            >
              About
            </Link>
            <Link 
              href="/pricing" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900"
            >
              Pricing
            </Link>
          </div>

          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2" />

          <div className="flex flex-col gap-4">
            <Link 
              href="/signin" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-3 text-lg font-semibold text-[#2D3748] dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-colors border border-zinc-200 dark:border-zinc-800"
            >
              Sign In
            </Link>
            
            <Link 
              href="/signup" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center text-lg font-semibold text-white py-3 rounded-xl transition-all hover:brightness-110"
              style={{ backgroundColor: THEME_TEAL }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}