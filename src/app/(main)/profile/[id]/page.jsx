"use client";
import ImageWithSpinner from "@/components/ImageWithSpinner";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  Clock,
  Lock,
  ArrowRight,
  Heart,
  Bookmark,
  ShieldCheck,
} from "lucide-react";
import { Spinner, Button } from "@heroui/react";
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

export default function AuthorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { data: session } = authClient.useSession();
  const currentUser = session?.user;
  const isPremiumUser =
    currentUser?.role === "admin" ||
    currentUser?.plan === "premium" ||
    currentUser?.isPremium;

  const [author, setAuthor] = useState(null);
  const [authorLessons, setAuthorLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchAuthorProfile = async () => {
      if (!id || id === "undefined") {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backendUrl}/api/author-profile/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAuthor(data.author);
          setAuthorLessons(data.lessons || []);
        } else {
          // Fallback to legacy endpoint if available
          const legacyRes = await fetch(`${backendUrl}/api/my-lessons/${id}`);
          if (legacyRes.ok) {
            const lessonsData = await legacyRes.json();
            const publicLessons = lessonsData.filter(
              (l) => l.visibility === "Public",
            );
            setAuthorLessons(publicLessons);
            setAuthor({
              name: publicLessons[0]?.creatorName || "Anonymous Creator",
              image: publicLessons[0]?.creatorAvatar || "",
              id: id,
            });
          } else {
            toast.error("Failed to load author profile.");
          }
        }
      } catch (error) {
        console.error("Error fetching author profile:", error);
        toast.error("Server connection error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorProfile();
  }, [id, backendUrl]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f9fafb] dark:bg-[#0c0c0e]">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  const authorName = author?.name || "Author";
  const hasAvatar = !!author?.image;
  const avatarInitials = authorName.charAt(0).toUpperCase();

  return (
    <div className="w-full min-h-screen bg-[#f9fafb] dark:bg-[#0c0c0e] py-12 px-4 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[14px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>

        {/* Author Header Banner */}
        <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {hasAvatar ? (
              <ImageWithSpinner width={500} height={500}
                src={author?.image}
                alt={authorName}
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#0f766e] text-white flex items-center justify-center font-bold text-4xl border-4 border-white dark:border-zinc-800 shadow-md">
                {avatarInitials}
              </div>
            )}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
                  {authorName}
                </h1>
                {author?.role === "admin" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Admin
                  </span>
                )}
              </div>

              <p className="text-[14px] text-zinc-500 dark:text-zinc-400">
                Platform Educator & Creator
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <span className="inline-flex items-center gap-1 text-[12px] font-bold px-3 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200/60 dark:border-teal-500/20">
                  <BookOpen className="w-3.5 h-3.5" /> {authorLessons.length}{" "}
                  {authorLessons.length === 1
                    ? "Lesson Published"
                    : "Lessons Published"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons by Author Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Published Lessons by {authorName}
            </h2>
            <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Explore wisdom modules, guides, and stories shared by this author.
            </p>
          </div>

          {authorLessons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {authorLessons.map((lesson) => {
                const isLocked =
                  lesson.accessLevel === "Premium" && !isPremiumUser;

                return (
                  <div
                    key={lesson._id}
                    className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    {/* === Premium Lock Overlay with Blur === */}
                    {isLocked && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm rounded-2xl">
                        <div className="w-12 h-12 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center shadow-sm border border-zinc-200 dark:border-zinc-800 mb-3">
                          <LockIcon />
                        </div>
                        <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-1 text-center">
                          Premium Lesson
                        </h4>
                        <p className="text-[13px] font-medium text-zinc-600 dark:text-zinc-400 mb-4 text-center">
                          {currentUser
                            ? "Upgrade to view this content"
                            : "Sign in & upgrade to view"}
                        </p>
                        <Link
                          href={currentUser ? "/pricing" : "/signin"}
                          className="w-full"
                        >
                          <Button
                            size="sm"
                            radius="sm"
                            className="w-full font-semibold text-white shadow-md cursor-pointer"
                            style={{ backgroundColor: "#9c5236" }}
                          >
                            {currentUser ? "Upgrade Now" : "Sign In"}
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* === Card Top Content === */}
                    <div>
                      {/* Card Cover */}
                      <div className="relative w-full h-44 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        {lesson.coverImage ? (
                          <ImageWithSpinner width={500} height={500}
                            src={lesson.coverImage}
                            alt={lesson.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500/10 to-[#0f766e]/20 text-[#0f766e]">
                            <BookOpen className="w-10 h-10 opacity-70" />
                          </div>
                        )}

                        {lesson.accessLevel === "Premium" && (
                          <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                            <Lock className="w-3 h-3" /> Premium
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                            {lesson.category || "General"}
                          </span>
                          <span className="text-[12px] text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />{" "}
                            {formatDate(lesson.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-[17px] font-bold text-zinc-900 dark:text-white line-clamp-2 group-hover:text-[#0f766e] dark:group-hover:text-[#16A696] transition-colors">
                          {lesson.title}
                        </h3>

                        <p className="text-[13px] text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                          {lesson.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* === Card Footer === */}
                    <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[12px] font-semibold text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-red-500" />{" "}
                          {lesson.likesCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bookmark className="w-3.5 h-3.5 text-[#0f766e]" />{" "}
                          {lesson.savedBy?.length || 0}
                        </span>
                      </div>

                      <Link
                        href={`/lessons/${lesson._id}`}
                        className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold rounded-xl text-[12px] px-3.5 py-1.5 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        Read <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
              <BookOpen className="w-12 h-12 text-zinc-400 mb-3" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                No public lessons yet
              </h3>
              <p className="text-[14px] text-zinc-500 max-w-sm mt-1">
                {authorName} has not published any public modules to the
                platform yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
