"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Trash2, ChevronLeft, ChevronRight, Plus, EyeOff, Eye, Star } from "lucide-react";
import { Spinner, Button } from "@heroui/react";
import toast from "react-hot-toast";

export default function ManageLessonsPage() {
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch all lessons (Admin view)
  const fetchLessons = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/lessons/admin-all`);
      if (response.ok) {
        const data = await response.json();
        setLessons(data);
      } else {
        const fallbackRes = await fetch(`${backendUrl}/api/lessons`);
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setLessons(fallbackData);
        } else {
          toast.error("Failed to load lessons.");
        }
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast.error("Server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [backendUrl]);

  // Handle Toggle Featured Status
  const handleToggleFeatured = async (lessonId, currentFeatured) => {
    const newFeatured = !currentFeatured;
    
    try {
      const response = await fetch(`${backendUrl}/api/update-lesson/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured: newFeatured })
      });

      if (response.ok) {
        toast.success(newFeatured ? "Lesson marked as Featured!" : "Lesson removed from Featured");
        setLessons(lessons.map(l => l._id === lessonId ? { ...l, isFeatured: newFeatured } : l));
      } else {
        toast.error("Failed to update featured status.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  // Handle Draft / Visibility Toggle
  const handleToggleDraft = async (lessonId, currentVisibility) => {
    const newVisibility = currentVisibility === "Draft" ? "Public" : "Draft";
    
    try {
      const response = await fetch(`${backendUrl}/api/update-lesson/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: newVisibility })
      });

      if (response.ok) {
        toast.success(`Lesson set to ${newVisibility}`);
        setLessons(lessons.map(l => l._id === lessonId ? { ...l, visibility: newVisibility } : l));
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  // Handle Delete Lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;

    try {
      const response = await fetch(`${backendUrl}/api/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Lesson deleted successfully.");
        setLessons(lessons.filter(l => l._id !== lessonId));
      } else {
        toast.error("Failed to delete lesson.");
      }
    } catch (error) {
      toast.error("Server error while deleting.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Filter Logic
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSearch = 
      lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.creatorName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "All" || lesson.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || lesson.visibility === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
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
    <div className="w-full flex flex-col gap-8 font-sans">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
          Manage Lessons
        </h1>
        <Button 
          as={Link} 
          href="/dashboard/admin/add-lesson"
          className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm flex items-center gap-2 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create New Lesson
        </Button>
      </div>

      {/* Filter & Search Bar Box */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex flex-col lg:flex-row items-center gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full lg:w-auto">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full lg:w-[200px] cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          >
            <option value="All">All Categories</option>
            <option value="Professional">Professional</option>
            <option value="Personal">Personal</option>
            <option value="Wealth">Wealth</option>
            <option value="Productivity">Productivity</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="w-full lg:w-auto">
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full lg:w-[180px] cursor-pointer bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button 
          onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setSelectedStatus("All"); }}
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#eef2f6] dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 rounded-xl font-semibold text-[14px] transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
        >
          <Filter className="w-4 h-4" /> Clear Filters
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="py-4 px-6">Title</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Created Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[14px]">
              {currentLessons.map((lesson) => (
                <tr key={lesson._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  
                  {/* Title & Subtitle Note */}
                  <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span>{lesson.title}</span>
                        {lesson.isFeatured && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Featured
                          </span>
                        )}
                      </div>
                      {lesson.accessLevel === 'Premium' && (
                        <span className="text-[12px] font-normal text-amber-600 dark:text-amber-400 mt-0.5">
                          🔒 Premium content
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Author */}
                  <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300 font-medium">
                    {lesson.creatorName || "Anonymous"}
                  </td>

                  {/* Category Badge */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-semibold text-white ${
                      lesson.category === 'Wealth' ? 'bg-[#b45309]' :
                      lesson.category === 'Personal' ? 'bg-[#7c3aed]' : 'bg-[#0f766e]'
                    }`}>
                      {lesson.category || 'General'}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-semibold ${
                      lesson.visibility === 'Public' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400' :
                      lesson.visibility === 'Draft' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                      'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}>
                      {lesson.visibility || 'Public'}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400 font-medium">
                    {formatDate(lesson.createdAt)}
                  </td>

                  {/* Actions (Feature, Draft Toggle & Delete) */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      
                      {/* Toggle Featured Button */}
                      <button
                        onClick={() => handleToggleFeatured(lesson._id, lesson.isFeatured)}
                        title={lesson.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          lesson.isFeatured
                            ? 'bg-amber-50 text-amber-500 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'bg-zinc-100 text-zinc-400 hover:text-amber-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${lesson.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                      </button>

                      {/* Draft Toggle Button */}
                      <button
                        onClick={() => handleToggleDraft(lesson._id, lesson.visibility)}
                        title={lesson.visibility === 'Draft' ? "Publish / Make Public" : "Move to Draft"}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          lesson.visibility === 'Draft'
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {lesson.visibility === 'Draft' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteLesson(lesson._id)}
                        title="Delete Lesson"
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
                    No lessons found matching the criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[14px] text-zinc-500">
            Showing {filteredLessons.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredLessons.length)} of {filteredLessons.length} results
          </span>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                      ? 'bg-[#0f766e] text-white shadow-sm' 
                      : 'border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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