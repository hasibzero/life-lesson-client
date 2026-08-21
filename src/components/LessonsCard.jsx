"use client";
import ImageWithSpinner from "@/components/ImageWithSpinner";

import React, { useState, useEffect } from "react";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const LockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9c5236"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export default function LessonsCard() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isPremiumUser = user?.role === "admin" || user?.plan === "premium";

  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // 👈 Added a safe fallback URL so it never evaluates to undefined
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const response = await fetch(`${backendUrl}/api/lessons/featured`);

        if (response.ok) {
          const data = await response.json();
          setLessons(data);
        } else {
          console.error("Backend returned non-OK status:", response.status);
          toast.error("Failed to load featured lessons.");
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        toast.error("Server connection error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Only display lessons that have been approved/reviewed
  const reviewedLessons = lessons?.filter(
    (lesson) => lesson?.isReviewed === true,
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-[40vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#149788]" />
      </div>
    );
  }

  if (!reviewedLessons || reviewedLessons.length === 0) {
    return (
      <div className="w-full min-h-[30vh] flex flex-col items-center justify-center text-zinc-500 py-12">
        <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
          No featured lessons available right now.
        </p>
      </div>
    );
  }

  return (
    <section className="w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reviewedLessons.map((lesson) => {
          const isLocked = lesson?.accessLevel === "Premium" && !isPremiumUser;

          return (
            <Card
              key={lesson?._id}
              className="relative h-full w-full shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col justify-between"
            >
              {/* Premium Lock Overlay */}
              {isLocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm rounded-xl">
                  <div className="w-14 h-14 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm border border-zinc-200 dark:border-zinc-800 mb-4">
                    <LockIcon />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                    Premium Lesson
                  </h3>
                  <p className="text-[14px] font-medium text-zinc-600 dark:text-zinc-400 mb-6 text-center">
                    {user
                      ? "Upgrade to view this content"
                      : "Sign in & upgrade to view"}
                  </p>
                  <Link href={user ? "/pricing" : "/signin"} className="w-full">
                    <Button
                      radius="sm"
                      className="w-full font-semibold text-white shadow-md cursor-pointer"
                      style={{ backgroundColor: "#9c5236" }}
                    >
                      {user ? "Upgrade Now" : "Sign In"}
                    </Button>
                  </Link>
                </div>
              )}

              {/* Header */}
              <div className="flex justify-between items-start pt-5 px-5">
                <div className="flex flex-wrap gap-2">
                  <Chip
                    size="sm"
                    radius="sm"
                    className="bg-[#f0f4fa] text-[#4b5563] dark:bg-zinc-800 dark:text-zinc-300 border-none font-medium"
                  >
                    {lesson?.category || "General"}
                  </Chip>
                  <Chip
                    size="sm"
                    radius="sm"
                    className="bg-[#6366f1] text-white border-none font-medium"
                  >
                    {lesson?.emotionalTone || "Motivational"}
                  </Chip>
                </div>
                <Chip
                  size="sm"
                  radius="sm"
                  className="bg-[#f0f4fa] text-[#4b5563] dark:bg-zinc-800 dark:text-zinc-400 font-medium"
                >
                  {lesson?.accessLevel || "Free"}
                </Chip>
              </div>

              {/* Body */}
              <div className="px-5 py-3 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-[18px] font-bold text-[#1a202c] dark:text-white mb-2 leading-tight line-clamp-2">
                    {lesson?.title}
                  </h4>
                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6">
                    {lesson?.description}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-3">
                  {lesson?.creatorAvatar ? (
                    <ImageWithSpinner
                      width={500}
                      height={500}
                      src={lesson.creatorAvatar}
                      alt="Creator"
                      className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#149788] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-zinc-200 dark:border-zinc-700">
                      {(lesson?.creatorName || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-[#1a202c] dark:text-white leading-none mb-1 truncate">
                      {lesson?.creatorName || "Anonymous"}
                    </span>
                    <span className="text-[12px] text-zinc-500 font-medium leading-none">
                      {formatDate(lesson?.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 pb-5 pt-3">
                <Link href={`/lessons/${lesson?._id}`} className="w-full">
                  <Button
                    radius="sm"
                    variant="bordered"
                    className="w-full font-semibold border-2 transition-colors hover:bg-[#149788] hover:text-white border-[#149788] text-[#149788] cursor-pointer"
                  >
                    See Details
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
