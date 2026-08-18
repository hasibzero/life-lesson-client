"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, 
  Filter, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Eye, 
  Lock, 
  Globe, 
  AlertTriangle, 
  ShieldCheck,
  Clock,
  Plus
} from "lucide-react";
import { Spinner, Button } from "@heroui/react";
import toast from "react-hot-toast";

export default function AdminManageLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedVisibility, setSelectedVisibility] = useState("All");
  const [selectedFlagFilter, setSelectedFlagFilter] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch Lessons & Reports in Parallel
  const fetchData = async () => {
    try {
      const [lessonsRes, reportsRes] = await Promise.all([
        fetch(`${backendUrl}/api/lessons/admin-all`),
        fetch(`${backendUrl}/api/admin/reports`),
      ]);

      if (lessonsRes.ok) {
        const lessonsData = await lessonsRes.json();
        setLessons(lessonsData);
      } else {
        toast.error("Failed to load platform lessons.");
      }

      if (reportsRes.ok) {
        const reportsData = await reportsRes.json();
        setReports(reportsData);
      }
    } catch (error) {
      console.error("Error fetching lesson management data:", error);
      toast.error("Server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [backendUrl]);

  // Set of lesson IDs that currently have unresolved reports
  const openReportedLessonIds = new Set(
    reports.filter((r) => r.status !== "Resolved").map((r) => String(r.lessonId))
  );

  // 1. Toggle Featured Status (Shows on Home Page Featured Section)
  const handleToggleFeatured = async (lessonId, currentFeatured) => {
    const newFeatured = !currentFeatured;

    try {
      const response = await fetch(`${backendUrl}/api/update-lesson/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: newFeatured }),
      });

      if (response.ok) {
        toast.success(newFeatured ? "Lesson marked as Featured!" : "Removed from Featured.");
        setLessons(lessons.map((l) => (l._id === lessonId ? { ...l, isFeatured: newFeatured } : l)));
      } else {
        toast.error("Failed to update featured status.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  // 2. Mark as Reviewed / Unreviewed
  const handleToggleReviewed = async (lessonId, currentReviewed) => {
    const newReviewed = !currentReviewed;

    try {
      const response = await fetch(`${backendUrl}/api/update-lesson/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isReviewed: newReviewed }),
      });

      if (response.ok) {
        toast.success(newReviewed ? "Marked as Reviewed." : "Marked as Pending Review.");
        setLessons(lessons.map((l) => (l._id === lessonId ? { ...l, isReviewed: newReviewed } : l)));
      } else {
        toast.error("Failed to update review status.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  // 3. Delete Inappropriate Lesson with Confirmation Popup
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to permanently delete this lesson? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Lesson deleted successfully.");
        setLessons(lessons.filter((l) => l._id !== lessonId));
      } else {
        toast.error("Failed to delete lesson.");
      }
    } catch (error) {
      toast.error("Server error while deleting.");
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

  // Stats Calculations
  const publicLessonsCount = lessons.filter((l) => l.visibility === "Public").length;
  const privateLessonsCount = lessons.filter((l) => l.visibility === "Private" || l.visibility === "Draft").length;
  const flaggedLessonsCount = lessons.filter((l) => openReportedLessonIds.has(String(l._id))).length;
  const featuredLessonsCount = lessons.filter((l) => l.isFeatured).length;

  // Filter Logic
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch =
      lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.creatorName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || lesson.category === selectedCategory;

    const matchesVisibility =
      selectedVisibility === "All" || lesson.visibility === selectedVisibility;

    const isFlagged = openReportedLessonIds.has(String(lesson._id));
    const matchesFlag =
      selectedFlagFilter === "All" ||
      (selectedFlagFilter === "Flagged" && isFlagged) ||
      (selectedFlagFilter === "Featured" && lesson.isFeatured) ||
      (selectedFlagFilter === "Reviewed" && lesson.isReviewed) ||
      (selectedFlagFilter === "Unreviewed" && !lesson.isReviewed);

    return matchesSearch && matchesCategory && matchesVisibility && matchesFlag;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLessons = filteredLessons.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 font-sans pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
            Manage All Lessons
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            Oversee all community modules, moderate flagged content, and curate featured wisdom.
          </p>
        </div>

        <Link href="/dashboard/admin/add-lesson">
          <Button className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2 w-fit cursor-pointer">
            <Plus className="w-4 h-4" /> Create Lesson
          </Button>
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Public Lessons Count */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
              Public Lessons
            </span>
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-[#0f766e] dark:text-[#16A696] leading-tight">
              {publicLessonsCount.toLocaleString()}
            </h3>
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-1">Live in community</p>
          </div>
        </div>

        {/* Private / Draft Lessons Count */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
              Private / Drafts
            </span>
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-zinc-800 dark:text-zinc-200 leading-tight">
              {privateLessonsCount.toLocaleString()}
            </h3>
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-1">Unpublished content</p>
          </div>
        </div>

        {/* Flagged / Reported Content Count */}
        <div className="bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/40 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Flagged Content
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-red-600 dark:text-red-400 leading-tight">
              {flaggedLessonsCount.toLocaleString()}
            </h3>
            <p className="text-[12px] text-red-500/80 dark:text-red-400/80 mt-1">Requires moderation</p>
          </div>
        </div>

        {/* Featured Modules Count */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
              Featured Modules
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 leading-tight">
              {featuredLessonsCount.toLocaleString()}
            </h3>
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-1">Homepage showcased</p>
          </div>
        </div>

      </div>

      {/* Search & Multi-filter Bar */}
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
            placeholder="Search lessons by title or author..."
            className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-[170px] cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Personal Growth">Personal Growth</option>
            <option value="Career">Career</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Productivity">Productivity</option>
            <option value="Wealth">Wealth</option>
          </select>
        </div>

        {/* Visibility Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedVisibility}
            onChange={(e) => {
              setSelectedVisibility(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-[160px] cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          >
            <option value="All">All Visibility</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Flag / Moderation Filter */}
        <div className="w-full sm:w-auto">
          <select
            value={selectedFlagFilter}
            onChange={(e) => {
              setSelectedFlagFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-[170px] cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Flagged">⚠️ Flagged Content</option>
            <option value="Featured">⭐ Featured</option>
            <option value="Reviewed">✅ Reviewed</option>
            <option value="Unreviewed">⏳ Pending Review</option>
          </select>
        </div>

        {/* Reset Filters */}
        {(searchQuery || selectedCategory !== "All" || selectedVisibility !== "All" || selectedFlagFilter !== "All") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedVisibility("All");
              setSelectedFlagFilter("All");
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-[#eef2f6] dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 rounded-xl font-semibold text-[13px] transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700 shrink-0"
          >
            <Filter className="w-4 h-4" /> Reset
          </button>
        )}
      </div>

      {/* All Lessons Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="py-4 px-6">Lesson Title</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Visibility</th>
                <th className="py-4 px-6">Moderation</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[14px]">
              {currentLessons.map((lesson) => {
                const isFlagged = openReportedLessonIds.has(String(lesson._id));

                return (
                  <tr key={lesson._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                    
                    {/* Title & Tags */}
                    <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="line-clamp-1">{lesson.title}</span>
                          
                          {/* Featured Tag */}
                          {lesson.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20 shrink-0">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                            </span>
                          )}

                          {/* Flagged Alert Tag */}
                          {isFlagged && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20 shrink-0">
                              <AlertTriangle className="w-3 h-3 text-red-500" /> Flagged
                            </span>
                          )}
                        </div>

                        {lesson.accessLevel === "Premium" && (
                          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Premium Module
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300 font-medium whitespace-nowrap">
                      {lesson.creatorName || "Anonymous"}
                    </td>

                    {/* Category Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-full text-[12px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200/50 dark:border-teal-500/20">
                        {lesson.category || "General"}
                      </span>
                    </td>

                    {/* Visibility */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold ${
                        lesson.visibility === "Public"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${lesson.visibility === "Public" ? "bg-indigo-500" : "bg-zinc-400"}`}></span>
                        {lesson.visibility || "Public"}
                      </span>
                    </td>

                    {/* Moderation / Review Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold ${
                        lesson.isReviewed
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20"
                      }`}>
                        {lesson.isReviewed ? (
                          <><CheckCircle2 className="w-3.5 h-3.5" /> Reviewed</>
                        ) : (
                          <><Clock className="w-3.5 h-3.5" /> Pending</>
                        )}
                      </span>
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                      {formatDate(lesson.createdAt)}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* Make Featured Toggle */}
                        <button
                          onClick={() => handleToggleFeatured(lesson._id, lesson.isFeatured)}
                          title={lesson.isFeatured ? "Remove from Featured" : "Feature on Homepage"}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            lesson.isFeatured
                              ? "bg-amber-50 text-amber-500 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400"
                              : "bg-zinc-100 text-zinc-400 hover:text-amber-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          <Star className={`w-4 h-4 ${lesson.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                        </button>

                        {/* Mark Reviewed Toggle */}
                        <button
                          onClick={() => handleToggleReviewed(lesson._id, lesson.isReviewed)}
                          title={lesson.isReviewed ? "Mark as Pending Review" : "Mark as Reviewed"}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            lesson.isReviewed
                              ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-400 hover:text-emerald-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>

                        {/* View Lesson */}
                        <Link href={`/lessons/${lesson._id}`} target="_blank">
                          <button
                            title="View Public Lesson"
                            className="p-2 rounded-xl bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>

                        {/* Delete Lesson */}
                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          title="Delete Inappropriate Lesson"
                          className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}

              {currentLessons.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-zinc-500">
                    No lessons found matching the selected filters.
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
            {Math.min(indexOfLastItem, filteredLessons.length)} of {filteredLessons.length} lessons
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

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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