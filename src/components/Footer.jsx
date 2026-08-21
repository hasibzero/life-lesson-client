// components/Footer.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-12">
        
        {/* === Top Section: Multi-Column Grid === */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4 hover:opacity-90 transition-opacity">
              <Image 
                src="/logo.png" 
                alt="Digital Life Lessons Logo" 
                width={350} 
                height={400} 
                className="rounded-lg object-contain"
              />
              
            </Link>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 max-w-sm leading-relaxed">
              A platform to create, store, and share meaningful life lessons, personal growth insights, and wisdom gathered over time.
            </p>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
              <p><strong>Email:</strong> contact@digitallifelessons.com</p>
              <p><strong>Phone:</strong> +880 1234 567890</p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#149788] dark:hover:text-[#149788] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/lessons" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#149788] dark:hover:text-[#149788] transition-colors">
                  Public Lessons
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#149788] dark:hover:text-[#149788] transition-colors">
                  Pricing & Upgrade
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Socials */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Legal
            </h3>
            <ul className="space-y-3 mb-6">
              <li>
                <Link href="/terms" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#149788] dark:hover:text-[#149788] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-[#149788] dark:hover:text-[#149788] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>

            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex items-center gap-4">
              {/* X (Twitter) Icon */}
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-[#149788] transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* GitHub Icon */}
              <a 
                href="https://github.com/hasibzero" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-[#149788] transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              {/* LinkedIn Icon */}
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-[#149788] transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* === Bottom Section: Copyright === */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} Digital Life Lessons. All rights reserved.
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            Developed by Hasib S.
          </span>
        </div>

      </div>
    </footer>
  );
}