"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Search,
  Filter,
  Trash2,
  Eye,
  Compass,
  Bookmark,
  Lock,
  ChevronLeft,
  ChevronRight,
  Smile,
} from "lucide-react";
import { Spinner, Button } from "@heroui/react";
import toast from "react-hot-toast";

export default function SavedLessonsTablePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [savedLessons, setSavedLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTone, setSelectedTone] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch Saved Lessons
  const fetchSavedLessons = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/saved-lessons/${user.id}`,
      );
      if (response.ok) {
        const data = await response.json();
        setSavedLessons(data);
      } else {
        toast.error("Failed to load your saved favorites.");
      }
    } catch (error) {
      console.error("Error fetching saved lessons:", error);
      toast.error("Server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedLessons();
  }, [user?.id, backendUrl]);

  // Remove from Favorites Action
  const handleRemoveBookmark = async (lessonId) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/lessons/${lessonId}/bookmark`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id }),
        },
      );

      if (response.ok) {
        toast.success("Removed from saved favorites.");
        setSavedLessons((prev) =>
          prev.filter((lesson) => lesson._id !== lessonId),
        );
      } else {
        toast.error("Failed to remove bookmark.");
      }
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error("Server error occurred.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Filter Logic
  const filteredLessons = savedLessons.filter((lesson) => {
    const matchesSearch =
      lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.creatorName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || lesson.category === selectedCategory;

    const matchesTone =
      selectedTone === "All" || lesson.emotionalTone === selectedTone;

    return matchesSearch && matchesCategory && matchesTone;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLessons = filteredLessons.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
            Saved Favorites
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            Review and organize all your bookmarked modules and insights.
          </p>
        </div>

        <Link
          href="/lessons"
          className="bg-[#147062] hover:bg-[#0f594e] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 w-fit cursor-pointer text-[14px]"
        >
          <Compass className="w-4 h-4" />
          <span>Explore More Lessons</span>
        </Link>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-center gap-4">
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
            placeholder="Search favorites by title or author..."
            className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full lg:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full lg:w-[190px] cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Personal Growth">Personal Growth</option>
            <option value="Career">Career</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Productivity">Productivity</option>
            <option value="Wealth">Wealth</option>
          </select>
        </div>

        {/* Emotional Tone Filter */}
        <div className="w-full lg:w-auto">
          <select
            value={selectedTone}
            onChange={(e) => {
              setSelectedTone(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full lg:w-[180px] cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          >
            <option value="All">All Tones</option>
            <option value="Motivational">Motivational</option>
            <option value="Realization">Realization</option>
            <option value="Calm">Calm</option>
            <option value="Energetic">Energetic</option>
          </select>
        </div>

        {/* Reset Button */}
        {(searchQuery ||
          selectedCategory !== "All" ||
          selectedTone !== "All") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedTone("All");
              setCurrentPage(1);
            }}
            className="w-full lg:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-[#eef2f6] dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 rounded-xl font-semibold text-[13px] transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
          >
            <Filter className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* Tabular List Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="py-4 px-6">Lesson Title</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Emotional Tone</th>
                <th className="py-4 px-6">Date Added</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[14px]">
              {currentLessons.map((lesson) => (
                <tr
                  key={lesson._id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  {/* Title & Premium Indicator */}
                  <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">
                    <div className="flex flex-col">
                      <span className="line-clamp-1">{lesson.title}</span>
                      {lesson.accessLevel === "Premium" && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 mt-0.5">
                          <Lock className="w-3 h-3" /> Premium Content
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Creator */}
                  <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300 font-medium whitespace-nowrap">
                    {lesson.creatorName || "Anonymous"}
                  </td>

                  {/* Category Badge */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 rounded-full text-[12px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200/50 dark:border-teal-500/20">
                      {lesson.category || "General"}
                    </span>
                  </td>

                  {/* Emotional Tone Badge */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
                      <Smile className="w-3.5 h-3.5" />
                      {lesson.emotionalTone || "Neutral"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                    {formatDate(lesson.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      {/* Lesson Details Button wrapped in Next.js Link */}
                      <Link href={`/lessons/${lesson._id}`}>
                        <Button
                          size="sm"
                          className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold text-[13px] px-3.5 py-1.5 rounded-xl h-auto transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </Button>
                      </Link>

                      {/* Remove from Favorites Button */}
                      <button
                        onClick={() => handleRemoveBookmark(lesson._id)}
                        title="Remove from favorites"
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {currentLessons.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Bookmark className="w-8 h-8 text-zinc-400" />
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                        No saved favorites found
                      </p>
                      <p className="text-[13px] text-zinc-500">
                        {searchQuery ||
                        selectedCategory !== "All" ||
                        selectedTone !== "All"
                          ? "Try clearing filters to find what you are looking for."
                          : "Explore lessons to save insightful modules to your favorites."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[14px] text-zinc-500">
            Showing {filteredLessons.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, filteredLessons.length)} of{" "}
            {filteredLessons.length} results
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-lg font-semibold text-[14px] flex items-center justify-center transition-colors cursor-pointer ${
                      currentPage === page
                        ? "bg-[#0f766e] text-white shadow-sm"
                        : "border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
