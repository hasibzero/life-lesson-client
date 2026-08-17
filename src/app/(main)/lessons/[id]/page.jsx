'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { 
  Heart, 
  Bookmark, 
  Flag, 
  FileText, 
  Share2, 
  Link as LinkIcon, 
  CornerDownRight,
  ArrowLeft,
  Lock,
  X 
} from 'lucide-react';
import { Spinner, Button } from '@heroui/react';
import toast from 'react-hot-toast';

const XIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
  return Math.floor(seconds) + " seconds ago";
};

export default function LessonDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isPremiumUser = user?.role === 'admin' || user?.plan === 'premium';

  const [lesson, setLesson] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Report Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchLessonAndComments = async () => {
      if (!id) return;
      
      try {
        const lessonRes = await fetch(`${backendUrl}/api/lessons/${id}`);
        if (lessonRes.ok) {
          const lessonData = await lessonRes.json();
          setLesson(lessonData);
          setLikesCount(lessonData.likesCount || 0);

          if (user) {
            if (lessonData.likes?.includes(user.id)) setIsLiked(true);
            if (lessonData.savedBy?.includes(user.id)) setIsBookmarked(true);
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

    fetchLessonAndComments();
  }, [id, backendUrl, user?.id]);

  const handleLikeToggle = async () => {
    if (!user) {
      toast.error("You must be logged in to like lessons.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/lessons/${id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikesCount(data.likesCount);
      } else {
        toast.error("Failed to update like.");
      }
    } catch (error) {
      toast.error("An error occurred while liking.");
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error("You must be logged in to bookmark lessons.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/lessons/${id}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (response.ok) {
        const data = await response.json();
        setIsBookmarked(data.isBookmarked);
        toast.success(data.message);
      } else {
        toast.error("Failed to update bookmark.");
      }
    } catch (error) {
      toast.error("An error occurred while bookmarking.");
    }
  };

  // Submit Report Modal Form
  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!reportReason.trim() || !user) return;

    setIsSubmittingReport(true);
    try {
      const response = await fetch(`${backendUrl}/api/lessons/${id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, reason: reportReason })
      });

      if (response.ok) {
        toast.success("Lesson reported successfully. Thank you for your feedback.");
        setIsReportModalOpen(false);
        setReportReason("");
      } else {
        toast.error("Failed to report lesson.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || !user) return;
    
    setIsSubmittingComment(true);
    
    try {
      const response = await fetch(`${backendUrl}/api/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: id,
          userId: user.id,
          text: commentText
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([{
          ...newComment,
          creatorName: user.name,
          creatorAvatar: user.image
        }, ...comments]);
        
        setCommentText("");
        toast.success("Comment posted!");
      } else {
        toast.error("Failed to post comment.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#f9fafb] dark:bg-[#0c0c0e]">
        <Spinner size="lg" color="current" className="text-[#16A696]" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#f9fafb] dark:bg-[#0c0c0e] gap-4">
        <p className="text-xl font-bold text-zinc-700 dark:text-zinc-300">Lesson not found.</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-[#16A696] text-white rounded-lg font-semibold cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isLocked = lesson.accessLevel === 'Premium' && !isPremiumUser;

  return (
    <div className="w-full min-h-screen bg-[#f9fafb] dark:bg-[#0c0c0e] py-10 px-4 sm:px-6 flex justify-center font-sans relative">
      
      <article className="w-full max-w-[720px] flex flex-col">
        
        {/* Go Back Button */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-[14px] font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white mb-6 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>

        {/* 1. Hero Image */}
        <div className="w-full h-[250px] sm:h-[360px] rounded-2xl overflow-hidden mb-8 shadow-sm border border-zinc-200 dark:border-zinc-800">
          <img 
            src={lesson.coverImage || "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2000&auto=format&fit=crop"} 
            alt={lesson.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2. Title & Category Tags */}
        <div className="flex gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-md text-[12px] font-semibold bg-[#eef2ff] text-[#4f46e5] dark:bg-indigo-500/10 dark:text-indigo-400">
            {lesson.category}
          </span>
          {lesson.accessLevel === 'Premium' ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[12px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
              <Lock className="w-3 h-3" /> Premium
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-[12px] font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              Free
            </span>
          )}
        </div>

        <h1 className="text-[32px] sm:text-[40px] font-extrabold text-[#111827] dark:text-white leading-[1.1] tracking-tight mb-8">
          {lesson.title}
        </h1>

        {/* 3. Author Meta Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-y border-zinc-200 dark:border-zinc-800 mb-10 gap-4">
          <div className="flex items-center gap-3">
            <img 
              src={lesson.creatorAvatar || `https://ui-avatars.com/api/?name=${lesson.creatorName || 'User'}&background=random`} 
              alt={lesson.creatorName || "Anonymous"} 
              className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
            />
            <div className="flex flex-col">
              <span className="text-[14px] font-bold text-[#111827] dark:text-zinc-100 leading-tight">
                {lesson.creatorName || "Anonymous"}
              </span>
              <span className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Published {formatDate(lesson.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-zinc-500 dark:text-zinc-400">
            {/* Functional Like */}
            <button 
              onClick={handleLikeToggle}
              className="flex items-center gap-1.5 hover:text-red-500 transition-colors group cursor-pointer"
            >
              <Heart className={`w-[18px] h-[18px] ${isLiked ? 'fill-red-500 text-red-500' : 'group-hover:fill-red-100'}`} />
              <span className="text-[13px] font-medium">{likesCount}</span>
            </button>

            {/* Functional Bookmark */}
            <button 
              onClick={handleBookmarkToggle}
              className="hover:text-[#16A696] transition-colors cursor-pointer"
              title={isBookmarked ? "Remove Bookmark" : "Bookmark Lesson"}
            >
              <Bookmark className={`w-[18px] h-[18px] ${isBookmarked ? 'fill-[#16A696] text-[#16A696]' : ''}`} />
            </button>

            {/* Open Report Modal Button */}
            <button 
              onClick={() => {
                if (!user) {
                  toast.error("You must be logged in to report a lesson.");
                  return;
                }
                setIsReportModalOpen(true);
              }}
              className="hover:text-red-500 transition-colors cursor-pointer"
              title="Report Lesson"
            >
              <Flag className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {/* 4. Article Content Body or Locked State */}
        {isLocked ? (
          <div className="relative mb-12 py-10 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-[#121214] shadow-sm">
            <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none blur-sm px-8 py-6 select-none overflow-hidden">
               <p className="w-full h-4 bg-zinc-800 mb-4 rounded"></p>
               <p className="w-5/6 h-4 bg-zinc-800 mb-4 rounded"></p>
               <p className="w-full h-4 bg-zinc-800 mb-4 rounded"></p>
               <p className="w-3/4 h-4 bg-zinc-800 mb-10 rounded"></p>
               <p className="w-full h-4 bg-zinc-800 mb-4 rounded"></p>
               <p className="w-5/6 h-4 bg-zinc-800 mb-4 rounded"></p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-full flex items-center justify-center mb-5">
                <Lock className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#111827] dark:text-white mb-2">
                Premium Content Locked
              </h2>
              <p className="text-[15px] text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
                This lesson contains exclusive insights reserved for Premium members. Upgrade your account to unlock this lesson and full access to our platform.
              </p>
              <Button as={Link} href="/pricing" className="bg-[#147062] hover:bg-[#10594e] text-white font-semibold px-8 py-3 rounded-lg transition-colors cursor-pointer shadow-sm">
                Upgrade to Pro
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="prose prose-zinc dark:prose-invert max-w-none w-full mb-10">
              <p className="text-[16px] leading-[1.8] text-[#1f2937] dark:text-zinc-300 whitespace-pre-wrap">
                {lesson.description}
              </p>
            </div>

            {/* 5. Share & Export Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 border-y border-zinc-200 dark:border-zinc-800 mb-12 gap-4">
              <button className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[13px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm w-fit">
                <FileText className="w-4 h-4" />
                Export as PDF
              </button>

              <div className="flex items-center gap-3 text-[13px] text-zinc-500 font-medium">
                <span>Share:</span>
                <div className="flex items-center gap-2">
                  <button className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-[#111827] dark:hover:text-white hover:bg-zinc-50 transition-colors shadow-sm">
                    <XIcon />
                  </button>
                  <button className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-[#111827] dark:hover:text-white hover:bg-zinc-50 transition-colors shadow-sm">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="cursor-pointer w-8 h-8 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md text-zinc-600 dark:text-zinc-400 hover:text-[#111827] dark:hover:text-white hover:bg-zinc-50 transition-colors shadow-sm">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 6. Dynamic Responses Section */}
            <section>
              <h3 className="text-[20px] font-bold text-[#111827] dark:text-white mb-6">
                Responses ({comments.length})
              </h3>

              {user ? (
                <div className="flex gap-4 mb-10">
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0 mt-1"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#e2e8f0] dark:bg-zinc-800 flex items-center justify-center text-[12px] font-bold text-zinc-600 dark:text-zinc-400 shrink-0 mt-1 border border-zinc-200 dark:border-zinc-700">
                      {userInitial}
                    </div>
                  )}

                  <div className="flex flex-col flex-1 gap-3">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Join the conversation..."
                      rows={3}
                      className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-[14px] text-[#111827] dark:text-white outline-none focus:border-[#147062] dark:focus:border-[#16A696] transition-colors resize-none shadow-sm"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handlePostComment}
                        disabled={!commentText.trim() || isSubmittingComment}
                        className="cursor-pointer bg-[#0d6e63] hover:bg-[#0a574e] disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold text-[13px] px-6 py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center"
                      >
                        {isSubmittingComment ? <Spinner size="sm" color="white" /> : "Respond"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 text-center mb-10">
                  <p className="text-[14px] text-zinc-600 dark:text-zinc-400 mb-3">You must be logged in to leave a response.</p>
                  <Button as={Link} href="/signin" className="bg-[#16A696] hover:bg-[#138f81] text-white font-semibold px-6 rounded-lg transition-colors shadow-sm">
                    Log in
                  </Button>
                </div>
              )}

              <div className="flex flex-col gap-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex gap-4">
                    <img 
                      src={comment.creatorAvatar || `https://ui-avatars.com/api/?name=${comment.creatorName || 'User'}&background=random`} 
                      alt={comment.creatorName} 
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-zinc-200 dark:border-zinc-700 mt-1"
                    />
                    <div className="flex flex-col flex-1">
                      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm mb-2">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[13px] font-bold text-[#111827] dark:text-white">
                            {comment.creatorName || "Anonymous"}
                          </span>
                          <span className="text-[12px] text-zinc-500">
                            {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#374151] dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {comments.length === 0 && (
                  <p className="text-[14px] text-zinc-500 text-center py-4">
                    No responses yet. Be the first to share your thoughts!
                  </p>
                )}
              </div>

            </section>
          </>
        )}
      </article>

      {/* REPORT REASON MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
          <div className="w-full max-w-md bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5 text-red-600 dark:text-red-400 font-bold text-lg">
                <Flag className="w-5 h-5" />
                <h2>Report Lesson</h2>
              </div>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-zinc-700 dark:text-zinc-300">
                  Please specify your reason for reporting:
                </label>
                <textarea 
                  rows={4}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="e.g., Inappropriate content, spam, inaccurate information..."
                  className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] resize-none transition-colors"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-[14px] font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReport || !reportReason.trim()}
                  className="px-5 py-2 rounded-lg text-[14px] font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center min-w-[100px]"
                >
                  {isSubmittingReport ? <Spinner size="sm" color="white" /> : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}