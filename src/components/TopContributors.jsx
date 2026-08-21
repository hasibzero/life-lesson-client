'use client';
import ImageWithSpinner from "@/components/ImageWithSpinner";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Spinner } from '@heroui/react';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

export const TopContributors = () => {
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchTopContributorsWithRetry = async (retries = 3) => {
      try {
        const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const backendUrl = rawBackendUrl.replace(/\/$/, "");

        let response;

        // 👈 Auto-Retry Loop for Backend Cold Starts
        for (let i = 0; i < retries; i++) {
          try {
            response = await fetch(`${backendUrl}/api/top-contributors`);
            if (response.ok) break; // If successful, exit the retry loop
          } catch (err) {
            if (i === retries - 1) throw err; // If last attempt, throw error
            await new Promise((res) => setTimeout(res, 2000)); // Wait 2 seconds
          }
        }

        if (response && response.ok) {
          const data = await response.json();
          if (isMounted) {
            // Filter out any null/undefined items
            setContributors(Array.isArray(data) ? data.filter((c) => c && (c.name || c.userId)) : []);
          }
        } else {
          console.error("Backend returned non-OK status:", response?.status);
        }
      } catch (error) {
        console.error("Error fetching top contributors:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTopContributorsWithRetry();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full py-16 bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1a202c] dark:text-white tracking-tight mb-2">
              Top Contributors
            </h2>
            <p className="text-[16px] text-zinc-600 dark:text-zinc-400">
              Learn from industry experts and the most active wisdom leaders of the week.
            </p>
          </div>

          <Link 
            href="/lessons" 
            className="text-[14px] font-bold text-[#149788] hover:underline flex items-center gap-1.5 w-fit group"
          >
            <span>Explore all lessons</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Dynamic Contributors Grid */}
        {isLoading ? (
          <div className="w-full min-h-[220px] flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" color="current" className="text-[#149788]" />
            <p className="text-sm text-zinc-500 animate-pulse">Connecting to server...</p>
          </div>
        ) : contributors.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full py-12 text-center text-zinc-500 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl"
          >
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
            <p className="text-[15px] font-semibold text-zinc-700 dark:text-zinc-300">No contributors yet</p>
            <p className="text-[13px] text-zinc-400 mt-1">Publish lessons to become the first top contributor!</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {contributors.map((contributor, index) => {
              const profileHref = contributor.userId 
                ? `/profile/${contributor.userId}` 
                : `/lessons?search=${encodeURIComponent(contributor.name || '')}`;

              const hasAvatar = !!contributor.image;
              const avatarInitials = (contributor.name || 'U').charAt(0).toUpperCase();

              return (
                <motion.div
                  key={`${contributor.userId || 'contributor'}-${index}`}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="h-full"
                >
                  <Link
                    href={profileHref}
                    className="h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-xs hover:shadow-md hover:border-[#149788] dark:hover:border-[#149788] transition-colors group cursor-pointer"
                  >
                    {/* Avatar */}
                    <div className="relative mb-5">
                      {hasAvatar ? (
                        <ImageWithSpinner width={500} height={500}
                          src={contributor.image}
                          alt={contributor.name || 'Contributor'}
                          className="w-20 h-20 rounded-full object-cover border-2 border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[#149788] text-white flex items-center justify-center font-bold text-3xl border-2 border-zinc-100 dark:border-zinc-800 shadow-sm group-hover:scale-105 transition-transform duration-300">
                          {avatarInitials}
                        </div>
                      )}
                      {index === 0 && (
                        <span 
                          className="absolute -bottom-1 -right-1 bg-amber-400 text-zinc-950 p-1 rounded-full shadow-xs" 
                          title="Top Leader"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="text-[18px] font-bold text-[#1a202c] dark:text-white group-hover:text-[#149788] transition-colors line-clamp-1 mb-1">
                      {contributor.name || 'Anonymous Creator'}
                    </h3>

                    {/* Headline / Role */}
                    <p className="text-[13px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mb-4">
                      {contributor.headline || "Wisdom Contributor"}
                    </p>

                    {/* Contribution Metric */}
                    <span className="mt-auto text-[12px] font-bold text-[#149788] bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full border border-teal-200/50 dark:border-teal-500/20">
                      {contributor.lessonsCount || 0} {(contributor.lessonsCount || 0) === 1 ? 'Lesson' : 'Lessons'} Published
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </div>
    </section>
  );
};