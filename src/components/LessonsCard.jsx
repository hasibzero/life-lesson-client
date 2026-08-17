"use client";

import React, { useState, useEffect } from "react";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

// Standard SVG for the Lock Icon used in the Premium overlay
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

  // Determine if user has premium access (Adjust based on your exact role/plan fields)
  const isPremiumUser = user?.role === "admin" || user?.plan === "premium";

  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        // Assuming you have a public endpoint to fetch all 'Public' visibility lessons
        const response = await fetch(`${backendUrl}/api/lessons/featured`);

        if (response.ok) {
          const data = await response.json();
          setLessons(data);
        } else {
          toast.error("Failed to load lessons.");
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

  // Format MongoDB date string to "Oct 12, 2023"
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#149788]" />
      </div>
    );
  }

  if (lessons?.length === 0) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-zinc-500">
        <p className="text-lg font-medium">No lessons available right now.</p>
        <p className="text-sm">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen px- py-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {lessons?.map((lesson) => {
          // Lock the card if it's premium and the user isn't premium
          const isLocked = lesson?.accessLevel === "Premium" && !isPremiumUser;

          return (
            <Card
              key={lesson?._id}
              className="relative h-full w-full shadow-sm border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
            >
              {isLocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm rounded-large">
                  <div className="w-14 h-14 bg-white dark:bg-zinc-100 rounded-full flex items-center justify-center shadow-sm border border-zinc-200 mb-4">
                    <LockIcon />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1">
                    Premium Lesson
                  </h3>
                  <p className="text-[15px] font-medium text-zinc-600 dark:text-zinc-300 mb-6 text-center">
                    {user
                      ? "Upgrade to view this content"
                      : "Sign in & upgrade to view"}
                  </p>
                  <Button
                    as={Link}
                    href={user ? "/pricing" : "/signin"}
                    radius="sm"
                    className="w-full font-semibold text-white shadow-md"
                    style={{ backgroundColor: "#9c5236" }}
                  >
                    {user ? "Upgrade Now" : "Sign In"}
                  </Button>
                </div>
              )}

              <Card.Header className="flex justify-between items-start pt-5 px-5">
                <div className="flex flex-wrap gap-2">
                  <Chip
                    size="sm"
                    radius="sm"
                    className="bg-[#f0f4fa] text-[#4b5563] dark:bg-zinc-800 dark:text-zinc-300 border-none font-medium"
                  >
                    {lesson?.category}
                  </Chip>
                  <Chip
                    size="sm"
                    radius="sm"
                    className="bg-[#6366f1] text-white border-none font-medium"
                  >
                    {lesson?.emotionalTone || "Neutral"}
                  </Chip>
                </div>
                <Chip
                  size="sm"
                  radius="sm"
                  className="bg-[#f0f4fa] text-[#4b5563] dark:bg-zinc-800 dark:text-zinc-400 font-medium"
                >
                  {lesson?.accessLevel}
                </Chip>
              </Card.Header>

              <Card.Content className="px-5 py-3 flex-grow overflow-visible">
                <h4 className="text-[20px] font-bold text-[#1a202c] dark:text-white mb-3 leading-tight line-clamp-2">
                  {lesson?.title}
                </h4>
                <p className="text-[15px] text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-8">
                  {lesson?.description}
                </p>

                <div className="mt-auto flex items-center gap-3">
                  <img
                    // Fallback to a default avatar if creator info isn't populated
                    src={
                      lesson?.creatorAvatar ||
                      `https://ui-avatars.com/api/?name=${lesson.creatorName || "User"}&background=random`
                    }
                    alt="Creator"
                    className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                  />
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#1a202c] dark:text-white leading-none mb-1">
                      {lesson?.creatorName || "Anonymous"}
                    </span>
                    <span className="text-[13px] text-zinc-500 font-medium leading-none">
                      {formatDate(lesson?.createdAt)}
                    </span>
                  </div>
                </div>
              </Card.Content>

              <Card.Footer className="px-5 pb-5 pt-4">
                <Link href={`/lessons/${lesson?._id}`}>
                  <Button
                    radius="sm"
                    variant="bordered"
                    className="w-full font-semibold border-2 transition-colors hover:bg-[#149788] hover:text-white border-[#149788]"
                    
                  >
                    See Details
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
