// components/Footer.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className="max-w-[1200px] mx-auto w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      {/* 
        Using md:flex-row to stack vertically on mobile 
        and spread out evenly on desktop 
      */}
      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
        
        {/* === Left: Logo === */}
        <Link href="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
          <Image 
            src="/logo.png" 
            alt="Digital Life Lessons Logo" 
            width={120} 
            height={120} 
            className="rounded-lg object-contain w-auto h-auto max-h-10"
          />
        </Link>

        {/* === Center: Links === */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <Link href="/privacy-policy" className="text-[15px] font-semibold text-[#2D3748] dark:text-zinc-50 hover:text-[#149788] dark:hover:text-[#149788] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-[15px] font-semibold text-[#2D3748] dark:text-zinc-50 hover:text-[#149788] dark:hover:text-[#149788] transition-colors">
            Terms of Service
          </Link>
          <Link href="/contact" className="text-[15px] font-semibold text-[#2D3748] dark:text-zinc-50 hover:text-[#149788] dark:hover:text-[#149788] transition-colors">
            Contact
          </Link>
        </div>

        {/* === Right: Socials & Copyright === */}
        <div className="flex items-center gap-4">
          
          {/* X (Twitter) Icon */}
          <a 
            href="https://x.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#2D3748] dark:text-zinc-300 hover:text-[#149788] dark:hover:text-[#149788] transition-colors"
            aria-label="X (formerly Twitter)"
          >
            <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Vertical Divider */}
          <div className="hidden md:block w-px h-6 bg-zinc-300 dark:bg-zinc-700" />

          {/* Copyright Text */}
          <span className="text-[15px] text-[#2D3748] dark:text-zinc-400">
            © 2024 Digital Life Lessons. All rights reserved.
          </span>
          
        </div>
      </div>
    </div>
  );
}