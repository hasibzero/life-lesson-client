"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, Button, Chip, Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import { usePathname, useSearchParams } from "next/navigation";

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

export default function BrowseLessonsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isPremiumUser =
    user?.role === "admin" || user?.plan === "premium" || user?.isPremium;

  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize state directly from URL query params (if any)
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || "",
  );
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All",
  );
  const [selectedTone, setSelectedTone] = useState(
    searchParams.get("emotionalTone") || "All",
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10),
  );
  const [totalPages, setTotalPages] = useState(1);
  const limitPerPage = 8;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Debounce search query input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync to Address Bar without page reload
  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch.trim()) params.set("search", debouncedSearch.trim());
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (selectedTone !== "All") params.set("emotionalTone", selectedTone);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    window.history.replaceState(null, "", newUrl);
  }, [debouncedSearch, selectedCategory, selectedTone, currentPage, pathname]);

  // Query-based fetch calling your backend
  useEffect(() => {
    const fetchLessons = async () => {
      setIsLoading(true);
      const tokenRes = await authClient.token();
          const token = tokenRes?.data?.token;
          
      try {
        const queryParams = new URLSearchParams({
          search: debouncedSearch.trim(),
          category: selectedCategory,
          emotionalTone: selectedTone,
          visibility: "Public",
          sortBy: "newest",
          page: currentPage.toString(),
          limit: limitPerPage.toString(),
        });

        const response = await fetch(
          `${backendUrl}/api/lessons?${queryParams.toString()}`,{
            headers:{
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.ok) {
          const result = await response.json();

          if (result && Array.isArray(result.data)) {
            setLessons(result.data);
            setTotalPages(result.totalPages || 1);
          } else if (Array.isArray(result)) {
            setLessons(result);
            setTotalPages(Math.ceil(result.length / limitPerPage) || 1);
          } else {
            setLessons([]);
            setTotalPages(1);
          }
        } else {
          toast.error("Failed to fetch lessons.");
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        toast.error("Server connection error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [
    backendUrl,
    debouncedSearch,
    selectedCategory,
    selectedTone,
    currentPage,
    limitPerPage,
  ]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  return (
    <div className="w-full min-h-screen text-black dark:text-white py-12 px-4 sm:px-8 lg:px-16 font-sans">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-black dark:text-white">
          Browse Lessons
        </h1>
        <p className="text-[15px] text-zinc-500 dark:text-zinc-400">
          Curated wisdom for professional growth and digital life mastery.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 mb-12 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by keyword, author, or topic..."
            className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#149788] transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#149788] transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Productivity">Productivity</option>
            <option value="Career">Career</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Wealth">Wealth</option>
            <option value="Personal Growth">Personal Growth</option>
          </select>

          {/* Emotional Tone Dropdown */}
          <select
            value={selectedTone}
            onChange={(e) => {
              setSelectedTone(e.target.value);
              setCurrentPage(1);
            }}
            className="cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#149788] transition-colors"
          >
            <option value="All">All Tones</option>
            <option value="Motivational">Motivational</option>
            <option value="Realization">Realization</option>
            <option value="Calm">Calm</option>
            <option value="Energetic">Energetic</option>
          </select>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="max-w-7xl mx-auto mb-12">
        {isLoading ? (
          <div className="w-full min-h-[350px] flex items-center justify-center">
            <Spinner size="lg" color="current" className="text-[#149788]" />
          </div>
        ) : lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {lessons.map((lesson) => {
              const isLocked =
                lesson?.accessLevel === "Premium" && !isPremiumUser;

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
                      <Link
                        href={user ? "/pricing" : "/signin"}
                        className="w-full py-2.5 px-4 text-center font-semibold text-white rounded-sm shadow-md transition-opacity hover:opacity-90 block cursor-pointer text-sm"
                        style={{ backgroundColor: "#9c5236" }}
                      >
                        {user ? "Upgrade Now" : "Sign In"}
                      </Link>
                    </div>
                  )}

                  {/* Card Header */}
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

                  {/* Card Body */}
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
                      <img
                        src={
                          lesson?.creatorAvatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(lesson?.creatorName || "User")}&background=random`
                        }
                        alt="Creator"
                        className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                      />
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

                  {/* Card Footer */}
                  <div className="px-5 pb-5 pt-3">
                    <Link
                      href={`/lessons/${lesson?._id}`}
                      className="w-full py-2 text-center font-semibold rounded-sm border-2 border-[#149788] text-[#149788] hover:bg-[#149788] hover:text-white transition-colors block text-sm cursor-pointer"
                    >
                      See Details
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500">
            <p className="text-lg font-medium">
              No lessons found matching your filters.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 pb-12">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 rounded-xl font-semibold text-[14px] flex items-center justify-center transition-colors cursor-pointer ${
                currentPage === page
                  ? "bg-[#149788] text-white shadow-sm"
                  : "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
