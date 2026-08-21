'use client';
import ImageWithSpinner from "@/components/ImageWithSpinner";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, BookOpen } from 'lucide-react';
import { Spinner } from '@heroui/react';

const formatSaveCount = (num) => {
  if (!num && num !== 0) return '0';
  if (num >= 1000) {
    const formatted = (num / 1000).toFixed(1);
    return formatted.endsWith('.0') ? `${Math.floor(num / 1000)}k` : `${formatted}k`;
  }
  return num.toString();
};

export const MostSavedLessons = () => {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMostSavedWithRetry = async (retries = 3) => {
      try {
        const rawBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const backendUrl = rawBackendUrl.replace(/\/$/, "");

        let response;

        // 👈 Auto-Retry Loop for Backend Cold Starts
        for (let i = 0; i < retries; i++) {
          try {
            response = await fetch(`${backendUrl}/api/lessons/most-saved`);
            if (response.ok) break; // If successful, exit the retry loop
          } catch (err) {
            if (i === retries - 1) throw err; // If last attempt, throw error
            await new Promise((res) => setTimeout(res, 2000)); // Wait 2 seconds
          }
        }

        if (response && response.ok) {
          const data = await response.json();
          if (isMounted) {
            setLessons(Array.isArray(data) ? data : []);
          }
        } else {
          console.error("Backend returned non-OK status:", response?.status);
        }
      } catch (error) {
        console.error('Error fetching most saved lessons:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMostSavedWithRetry();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full py-12 bg-white dark:bg-zinc-950 transition-colors duration-300 font-sans">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
            Most Saved Lessons
          </h2>
          <p className="text-[15px] text-zinc-500 dark:text-zinc-400 mt-1">
            Trending topics across the platform.
          </p>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="w-full min-h-[200px] flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" color="current" className="text-[#149788]" />
            <p className="text-sm text-zinc-500 animate-pulse">Connecting to server...</p>
          </div>
        ) : lessons.length === 0 ? (
          <div className="w-full py-10 text-center text-zinc-500 bg-slate-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
            <p className="text-[14px] font-semibold text-zinc-700 dark:text-zinc-300">No saved lessons found</p>
          </div>
        ) : (
          /* 2-Column Horizontal Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {lessons.map((lesson) => {
              const savesCount = lesson?.savedBy?.length || lesson?.savesCount || 0;
              const authorDisplayName = lesson?.creatorName || lesson?.author?.name || 'Community Creator';

              return (
                <Link
                  key={lesson._id}
                  href={`/lessons/${lesson._id}`}
                  className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-[#149788] dark:hover:border-[#149788] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-xs hover:shadow-md group cursor-pointer"
                >
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-800">
                      {lesson.coverImage ? (
                        <ImageWithSpinner width={500} height={500}
                          src={lesson.coverImage}
                          alt={lesson.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-teal-50 dark:bg-teal-950/30 text-[#149788]">
                          <BookOpen className="w-8 h-8" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col min-w-0">
                      <h3 className="text-[16px] sm:text-[17px] font-bold text-zinc-900 dark:text-white group-hover:text-[#149788] transition-colors truncate">
                        {lesson.title}
                      </h3>
                      <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                        By {authorDisplayName}
                      </p>
                      <span className="mt-2.5 inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-semibold bg-[#e6f4f2] dark:bg-teal-950/50 text-[#0d9488] dark:text-teal-300 w-fit">
                        {lesson.category || 'General'}
                      </span>
                    </div>
                  </div>

                  {/* Right: Bookmark Icon & Count */}
                  <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-2 text-[#0d9488] dark:text-teal-400">
                    <Bookmark className="w-5 h-5 stroke-[2]" />
                    <span className="text-[13px] font-bold text-zinc-600 dark:text-zinc-300">
                      {formatSaveCount(savesCount)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};