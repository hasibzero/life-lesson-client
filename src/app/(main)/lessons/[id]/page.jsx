"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Eye,
  Flag,
  Globe,
  Heart,
  Link as LinkIcon,
  MessageSquare,
  RefreshCw,
  Send,
  X,
  Lock,
  Check,
} from "lucide-react";
import { Spinner, Button, Chip } from "@heroui/react";
import toast from "react-hot-toast";

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.max(1, Math.floor(seconds)) + " seconds ago";
};

const formatNumber = (num) => {
  if (!num) return "0";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export default function LessonDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isPremiumUser =
    user?.role === "admin" || user?.plan === "premium" || user?.isPremium;

  const [lesson, setLesson] = useState(null);
  const [authorStats, setAuthorStats] = useState({ totalLessons: 0 });
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Engagement States
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);

  // Comment States
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Report Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Inappropriate content");
  const [reportDetails, setReportDetails] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Share state
  const [copiedLink, setCopiedLink] = useState(false);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchLessonAndData = async () => {
      if (!id) return;

      try {
        const lessonRes = await fetch(`${backendUrl}/api/lessons/${id}`);
        if (lessonRes.ok) {
          const lessonData = await lessonRes.json();
          setLesson(lessonData);
          setLikesCount(lessonData.likesCount || lessonData.likes?.length || 0);
          setBookmarksCount(lessonData.savedBy?.length || 0);
          setViewsCount(
            lessonData.views || Math.floor(Math.random() * 4500) + 520,
          );

          if (user?.id) {
            if (lessonData.likes?.includes(user.id)) setIsLiked(true);
            if (lessonData.savedBy?.includes(user.id)) setIsBookmarked(true);
          }

          const resolvedCreatorId =
            lessonData.creatorId || lessonData.userId || lessonData.authorId;

          if (resolvedCreatorId) {
            const authorRes = await fetch(
              `${backendUrl}/api/my-lessons/${resolvedCreatorId}`,
            );
            if (authorRes.ok) {
              const authorLessons = await authorRes.json();
              setAuthorStats({ totalLessons: authorLessons.length || 1 });
            }
          }
        } else {
          toast.error("Failed to load lesson.");
          setIsLoading(false);
          return;
        }

        const commentsRes = await fetch(`${backendUrl}/api/comments/${id}`);
        if (commentsRes.ok) {
          const commentsData = await commentsRes.json();
          setComments(commentsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Server connection error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonAndData();
  }, [id, backendUrl, user?.id]);

  const authorId = lesson?.creatorId || lesson?.userId || lesson?.authorId;
  const authorProfileHref = authorId
    ? `/profile/${authorId}`
    : `/lessons?search=${encodeURIComponent(lesson?.creatorName || "")}`;

  const isLocked = lesson?.accessLevel === "Premium" && !isPremiumUser;

  const readingTimeMinutes = useMemo(() => {
    if (!lesson?.description) return 1;
    const words = lesson.description.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [lesson?.description]);

  const handleLikeToggle = async () => {
    if (isLocked) {
      toast.error("Upgrade to Premium to like and interact with this lesson.");
      return;
    }

    if (!user) {
      toast.error("Please log in to like this lesson.");
      router.push("/signin");
      return;
    }

    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    setIsLiked(!previousIsLiked);
    setLikesCount(
      previousIsLiked
        ? Math.max(0, previousLikesCount - 1)
        : previousLikesCount + 1,
    );

    try {
      const response = await fetch(`${backendUrl}/api/lessons/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      } else {
        setIsLiked(previousIsLiked);
        setLikesCount(previousLikesCount);
        toast.error("Failed to update like status.");
      }
    } catch (error) {
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);
      toast.error("An error occurred while liking.");
    }
  };

  const handleBookmarkToggle = async () => {
    if (isLocked) {
      toast.error("Upgrade to Premium to save this lesson to your favorites.");
      return;
    }

    if (!user) {
      toast.error("Please log in to save lessons to your favorites.");
      router.push("/signin");
      return;
    }

    const previousIsBookmarked = isBookmarked;
    const previousBookmarksCount = bookmarksCount;

    setIsBookmarked(!previousIsBookmarked);
    setBookmarksCount(
      previousIsBookmarked
        ? Math.max(0, previousBookmarksCount - 1)
        : previousBookmarksCount + 1,
    );

    try {
      const response = await fetch(`${backendUrl}/api/lessons/${id}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
        toast.success(
          data.message ||
            (data.isBookmarked
              ? "Saved to favorites!"
              : "Removed from favorites."),
        );
      } else {
        setIsBookmarked(previousIsBookmarked);
        setBookmarksCount(previousBookmarksCount);
        toast.error("Failed to update favorite.");
      }
    } catch (error) {
      setIsBookmarked(previousIsBookmarked);
      setBookmarksCount(previousBookmarksCount);
      toast.error("An error occurred.");
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to report a lesson.");
      return;
    }

    setIsSubmittingReport(true);
    try {
      const response = await fetch(`${backendUrl}/api/lessons/${id}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: id,
          reporterUserId: user.id,
          reportedUserEmail: user.email,
          reason: reportReason,
          details: reportDetails,
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        toast.success(
          data.message ||
            "Report submitted. Our moderation team will inspect this lesson.",
        );
        setIsReportModalOpen(false);
        setReportReason("Inappropriate content");
        setReportDetails("");
      } else {
        toast.error(data.message || "Failed to submit report.");
      }
    } catch (error) {
      console.error("Report submission error:", error);
      toast.error("An error occurred while connecting to the server.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.error("Discussions are restricted to Premium members.");
      return;
    }

    if (!commentText.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch(`${backendUrl}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonId: id,
          userId: user.id,
          text: commentText.trim(),
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([
          {
            ...newComment,
            creatorName: user.name,
            creatorAvatar: user.image,
            createdAt: new Date().toISOString(),
          },
          ...comments,
        ]);

        setCommentText("");
        toast.success("Response posted!");
      } else {
        toast.error("Failed to post comment.");
      }
    } catch (error) {
      toast.error("An error occurred while posting comment.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f9fafb] dark:bg-[#0c0c0e]">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] dark:bg-[#0c0c0e] gap-4">
        <p className="text-xl font-bold text-zinc-700 dark:text-zinc-300">
          Lesson not found.
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-[#0f766e] text-white rounded-xl font-semibold"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f9fafb] dark:bg-[#0c0c0e] py-10 px-4 sm:px-6 lg:px-8 flex justify-center font-sans">
      <article className="w-full max-w-[820px] flex flex-col gap-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/lessons"
            className="flex items-center gap-2 text-[14px] font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Lessons
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmarkToggle}
              title={isBookmarked ? "Remove Bookmark" : "Save Lesson"}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-teal-50 border-teal-200 text-[#0f766e] dark:bg-teal-500/10 dark:border-teal-500/30"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={() => setIsReportModalOpen(true)}
              title="Report Lesson"
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 1. Featured Cover Image (Blurred and Locked for Non-Premium) */}
        {lesson.coverImage && (
          <div className="w-full h-[280px] sm:h-[400px] rounded-3xl overflow-hidden shadow-sm border border-zinc-200 dark:border-zinc-800 relative bg-zinc-100 dark:bg-zinc-900">
            <img
              src={lesson.coverImage}
              alt={lesson.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isLocked
                  ? "filter blur-xl scale-110 select-none pointer-events-none opacity-40"
                  : ""
              }`}
            />
            {isLocked && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 shadow-lg">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-white font-bold text-base tracking-wide drop-shadow-md">
                  Premium Cover Image Locked
                </span>
                <span className="text-zinc-300 text-xs mt-0.5">
                  Upgrade to view high-resolution lesson media
                </span>
              </div>
            )}
          </div>
        )}

        {/* 2. Lesson Title, Category & Tone Badges */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Chip
              size="sm"
              className="bg-[#eef2ff] text-[#4f46e5] dark:bg-indigo-500/10 dark:text-indigo-400 font-bold border-none"
            >
              {lesson.category || "General"}
            </Chip>

            <Chip
              size="sm"
              className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold border-none"
            >
              {lesson.emotionalTone || "Motivational"}
            </Chip>

            {lesson.accessLevel === "Premium" ? (
              <Chip
                size="sm"
                className="bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 font-bold border border-amber-200/60 dark:border-amber-500/20 flex items-center gap-1"
              >
                <Lock className="w-3 h-3 inline mr-1" /> Premium Module
              </Chip>
            ) : (
              <Chip
                size="sm"
                className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 font-semibold border-none"
              >
                Free Access
              </Chip>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-zinc-900 dark:text-white leading-[1.15] tracking-tight">
            {lesson.title}
          </h1>
        </div>

        {/* 3. Lesson Metadata Block */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-[13px] shadow-xs">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Calendar className="w-4 h-4 text-[#0f766e]" />
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-zinc-400">
                Created
              </span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {formatDate(lesson.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <RefreshCw className="w-4 h-4 text-[#0f766e]" />
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-zinc-400">
                Updated
              </span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {formatDate(lesson.updatedAt || lesson.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Globe className="w-4 h-4 text-[#0f766e]" />
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-zinc-400">
                Visibility
              </span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {lesson.visibility || "Public"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Clock className="w-4 h-4 text-[#0f766e]" />
            <div className="flex flex-col">
              <span className="text-[11px] uppercase font-bold text-zinc-400">
                Read Time
              </span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {readingTimeMinutes} min read
              </span>
            </div>
          </div>
        </div>

        {/* 4. Lesson Content Body or Locked State */}
        {isLocked ? (
          <div className="relative py-14 px-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 shadow-sm text-center">
            <div className="absolute inset-0 opacity-15 pointer-events-none blur-md px-8 py-6 select-none overflow-hidden">
              <p className="w-full h-4 bg-zinc-800 mb-4 rounded"></p>
              <p className="w-5/6 h-4 bg-zinc-800 mb-4 rounded"></p>
              <p className="w-full h-4 bg-zinc-800 mb-4 rounded"></p>
              <p className="w-3/4 h-4 bg-zinc-800 mb-8 rounded"></p>
              <p className="w-full h-4 bg-zinc-800 mb-4 rounded"></p>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center max-w-md mx-auto">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Lock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2">
                Premium Lesson Locked
              </h2>
              <p className="text-[14px] text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                This wisdom module contains specialized strategies and full
                insights reserved exclusively for Premium members.
              </p>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#0f766e] hover:bg-[#0d6e63] text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md cursor-pointer">
                  Upgrade to Lifetime Premium
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="prose prose-zinc dark:prose-invert max-w-none text-[16px] leading-[1.85] text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
              {lesson.description}
            </div>
          </div>
        )}

        {/* 5. Stats & Engagement Metrics Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
          <div className="flex items-center gap-6 text-[14px] font-bold text-zinc-600 dark:text-zinc-300">
            <div className="flex items-center gap-2">
              <Heart
                className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-zinc-400"}`}
              />
              <span>
                {formatNumber(likesCount)}{" "}
                <span className="font-medium text-zinc-400">Likes</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-[#0f766e] text-[#0f766e]" : "text-zinc-400"}`}
              />
              <span>
                {formatNumber(bookmarksCount)}{" "}
                <span className="font-medium text-zinc-400">Favorites</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-zinc-400" />
              <span>
                {formatNumber(viewsCount)}{" "}
                <span className="font-medium text-zinc-400">Views</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              title="Copy Link"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[13px] font-semibold transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 6. Interaction Action Buttons */}
        {isLocked ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-amber-50/60 dark:bg-amber-500/5 border border-amber-200/60 dark:border-amber-500/20 rounded-2xl">
            <div className="flex items-center gap-2 text-[14px] text-amber-800 dark:text-amber-300 font-semibold">
              <Lock className="w-4 h-4 shrink-0" />
              <span>
                Interactions, liking, and saving are reserved for Premium
                members.
              </span>
            </div>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                size="sm"
                className="w-full sm:w-auto bg-[#0f766e] text-white font-bold px-4 py-2 rounded-xl shadow-xs"
              >
                Unlock
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-[#e6f4f2] dark:bg-[#0f766e]/10 border border-[#b2dfdb] dark:border-[#0f766e]/30 rounded-2xl">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleLikeToggle}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all cursor-pointer shadow-xs ${
                  isLiked
                    ? "bg-red-500 text-white shadow-red-500/20"
                    : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? "fill-white" : "text-red-500"}`}
                />
                <span>{isLiked ? "Liked" : "Like"}</span>
              </button>

              <button
                onClick={handleBookmarkToggle}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[14px] transition-all cursor-pointer shadow-xs ${
                  isBookmarked
                    ? "bg-[#0f766e] text-white"
                    : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isBookmarked ? "fill-white" : "text-[#0f766e]"}`}
                />
                <span>{isBookmarked ? "Saved" : "Save to Favorites"}</span>
              </button>
            </div>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 text-[13px] font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" /> Report Issue
            </button>
          </div>
        )}

        {/* 7. Dedicated Author / Creator Section */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link
            href={authorProfileHref}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <img
              src={
                lesson.creatorAvatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(lesson.creatorName || "Author")}&background=0f766e&color=fff`
              }
              alt={lesson.creatorName || "Author"}
              className="w-16 h-16 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 shrink-0 group-hover:ring-2 group-hover:ring-[#0f766e] transition-all"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-[#0f766e] dark:group-hover:text-[#16A696] transition-colors">
                  {lesson.creatorName || "Anonymous Creator"}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                  Author
                </span>
              </div>
              <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mt-1">
                {authorStats.totalLessons}{" "}
                {authorStats.totalLessons === 1 ? "lesson" : "lessons"}{" "}
                published to the community library
              </p>
            </div>
          </Link>

          <Button
            variant="bordered"
            className="border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl text-[13px] hover:border-[#0f766e] hover:text-[#0f766e] transition-colors cursor-pointer"
          >
            <Link href={authorProfileHref}>
              View all lessons by this author
            </Link>
          </Button>
        </div>

        {/* 8. Comment & Discussion Section (Locked if Lesson is Premium) */}
        <section className="flex flex-col gap-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#0f766e]" />
              Responses ({isLocked ? 0 : comments.length})
            </h3>
          </div>

          {isLocked ? (
            <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl text-center flex flex-col items-center justify-center gap-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-zinc-900 dark:text-white">
                Responses & Discussion Locked
              </h4>
              <p className="text-[14px] text-zinc-500 dark:text-zinc-400 max-w-md">
                Discussions and author takeaways for premium modules are
                reserved for Premium subscribers.
              </p>
              <Link href="/pricing" className="mt-2">
                <Button className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-bold px-6 py-2 rounded-xl shadow-xs">
                  Unlock Access
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {user ? (
                <form
                  onSubmit={handlePostComment}
                  className="flex gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0f766e] text-white flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      userInitial
                    )}
                  </div>

                  <div className="flex flex-col flex-1 gap-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Share your reflection or key takeaway..."
                      rows={3}
                      className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!commentText.trim() || isSubmittingComment}
                        className="bg-[#0f766e] hover:bg-[#0d6e63] disabled:opacity-50 text-white font-semibold text-[13px] px-5 py-2 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        {isSubmittingComment ? (
                          <Spinner size="sm" color="white" />
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" /> Post Comment
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center">
                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400 mb-3">
                    Log in to join the conversation and leave a reflection.
                  </p>
                  <Link href="/signin">
                    <Button className="bg-[#0f766e] text-white font-semibold px-6 rounded-xl">
                      Sign In to Comment
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {comments.map((comment) => (
                  <div
                    key={comment._id || Math.random()}
                    className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex gap-3.5 shadow-xs"
                  >
                    <img
                      src={
                        comment.creatorAvatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.creatorName || "User")}&background=random`
                      }
                      alt={comment.creatorName}
                      className="w-9 h-9 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700 mt-0.5"
                    />
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-bold text-zinc-900 dark:text-white">
                          {comment.creatorName || "Anonymous"}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-medium">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-[14px] text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <div className="py-8 text-center text-zinc-400 text-[14px]">
                    No comments yet. Be the first to share your takeaways!
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </article>

      {/* REPORT CONFIRMATION MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 font-bold text-lg">
                <Flag className="w-5 h-5" />
                <h2>Report Lesson</h2>
              </div>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-zinc-700 dark:text-zinc-300">
                  Select Reason
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] cursor-pointer"
                >
                  <option value="Inappropriate content">
                    Inappropriate or offensive content
                  </option>
                  <option value="Spam or promotional">
                    Spam or advertising
                  </option>
                  <option value="Misinformation">
                    Misleading or false information
                  </option>
                  <option value="Harassment or hate speech">
                    Harassment or hate speech
                  </option>
                  <option value="Copyright violation">
                    Copyright or intellectual property theft
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-zinc-700 dark:text-zinc-300">
                  Additional Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain why this content violates community guidelines..."
                  className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] resize-none transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport}
                  className="px-5 py-2.5 rounded-xl text-[14px] font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-[120px]"
                >
                  {isSubmittingReport ? (
                    <Spinner size="sm" color="white" />
                  ) : (
                    "Submit Report"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
