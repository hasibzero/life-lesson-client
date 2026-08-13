// components/Features.jsx
import Link from 'next/link';

export default function WhySection() {
  return (
    <section className="w-full py-10 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a202c] dark:text-white mb-2">
            Why Learning Matters
          </h2>
          <p className="text-[17px] text-zinc-600 dark:text-zinc-400">
            Why top professionals rely on curated wisdom.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* === Left Side: Large Card === */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 md:p-10 flex flex-col h-full shadow-sm">
            
            {/* Icon Box */}
            <div className="w-12 h-12 rounded-xl bg-[#e6f4f2] dark:bg-[#149788]/20 flex items-center justify-center text-[#149788] dark:text-[#2dd4bf] mb-8">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-[#1a202c] dark:text-white mb-4">
              Curated Excellence
            </h3>
            
            <p className="text-[15px] text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10">
              We filter the noise. Access only the highest-signal insights from industry leaders, structured for maximum retention and immediate application in high-stakes environments.
            </p>
            
            {/* Learn More Link pinned to bottom */}
            <Link 
              href="/about" 
              className="mt-auto inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#149788] hover:text-[#0f766a] dark:text-[#2dd4bf] dark:hover:text-[#5eead4] transition-colors"
            >
              Learn more
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* === Right Side: Nested Grid === */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-col">
            
            {/* Top Left Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 flex flex-col shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#e6f4f2] dark:bg-[#149788]/20 flex items-center justify-center text-[#149788] dark:text-[#2dd4bf] flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold text-[#1a202c] dark:text-white">
                  Time Efficiency
                </h3>
              </div>
              <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Distilled knowledge meant to be consumed in 15-minute high-impact sessions.
              </p>
            </div>

            {/* Top Right Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 flex flex-col shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#e6f4f2] dark:bg-[#149788]/20 flex items-center justify-center text-[#149788] dark:text-[#2dd4bf] flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold text-[#1a202c] dark:text-white">
                  Measurable Growth
                </h3>
              </div>
              <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Track your progress and ROI.
              </p>
            </div>

            {/* Bottom Wide Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 flex flex-col sm:col-span-2 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#e6f4f2] dark:bg-[#149788]/20 flex items-center justify-center text-[#149788] dark:text-[#2dd4bf] flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-[17px] font-bold text-[#1a202c] dark:text-white">
                  Community
                </h3>
              </div>
              <p className="text-[14px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Learn alongside top peers and build your professional network.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}