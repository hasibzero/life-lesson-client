"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  Plus,
  Edit2,
  Trash2,
  Heart,
  Bookmark,
  BookOpen,
  Eye,
  Lock,
  Globe,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  Clock,
  PlusCircle,
} from "lucide-react";
import { Spinner, Button, Tooltip } from "@heroui/react";
import toast from "react-hot-toast";
import EditLessonModal from "@/components/EditLessonModal";

export default function MyLessons() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isPremiumUser = user?.role === "admin" || user?.plan === "premium";

  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchMyLessons = async () => {
      const tokenRes = await authClient.token();
    const token = tokenRes?.data?.token;
    
      if (!user?.id) return;

      try {
        const response = await fetch(`${backendUrl}/api/my-lessons/${user.id}`,{
          headers: {
            'Authorization': `Bearer ${token}`,
          },

        });
        if (response.ok) {
          const data = await response.json();
          setLessons(data);
        } else {
          toast.error("Failed to fetch lessons.");
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
        toast.error("Server error while fetching lessons.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyLessons();
  }, [user?.id, backendUrl]);

  // 1. Handle Quick Visibility Change (Public / Private)
  const handleVisibilityChange = async (lessonId, newVisibility) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/update-lesson/${lessonId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visibility: newVisibility }),
        },
      );

      if (response.ok) {
        toast.success(`Visibility updated to ${newVisibility}.`);
        setLessons((prev) =>
          prev.map((l) =>
            l._id === lessonId ? { ...l, visibility: newVisibility } : l,
          ),
        );
      } else {
        toast.error("Failed to update visibility.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  // 2. Handle Quick Access Level Change (Free / Premium)
  const handleAccessLevelChange = async (lessonId, newAccessLevel) => {
    if (!isPremiumUser && newAccessLevel === "Premium") {
      toast.error("Upgrade to Pro to create Premium lessons.");
      return;
    }

    try {
      const response = await fetch(
        `${backendUrl}/api/update-lesson/${lessonId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessLevel: newAccessLevel }),
        },
      );

      if (response.ok) {
        toast.success(`Access level updated to ${newAccessLevel}.`);
        setLessons((prev) =>
          prev.map((l) =>
            l._id === lessonId ? { ...l, accessLevel: newAccessLevel } : l,
          ),
        );
      } else {
        toast.error("Failed to update access level.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  // 3. Handle Permanent Delete
  const handleDeleteLesson = async (lessonId) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this lesson? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Lesson deleted permanently.");
        setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      } else {
        toast.error("Failed to delete lesson.");
      }
    } catch (error) {
      toast.error("Server error while deleting.");
    }
  };

  // Modal Handlers
  const handleEditClick = (lesson) => {
    setEditingLesson(lesson);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setTimeout(() => setEditingLesson(null), 300);
  };

  const handleUpdateSuccess = (updatedData) => {
    setLessons((prevLessons) =>
      prevLessons.map((lesson) =>
        lesson._id === editingLesson._id
          ? { ...lesson, ...updatedData }
          : lesson,
      ),
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  // Filter & Pagination Logic
  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLessons = filteredLessons.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
            My Lessons
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            Manage, configure access settings, and track performance of your
            contributions.
          </p>
        </div>

        <Link
          href="/dashboard/user/add-lesson"
          className="bg-[#147062] hover:bg-[#0f594e] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 w-fit cursor-pointer text-[14px]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Lesson</span>
        </Link>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search your lessons by title or category..."
            className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-11 pr-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
          />
        </div>
      </div>

      {/* Lessons Table Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="py-4 px-6">Lesson Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Visibility</th>
                <th className="py-4 px-6">Access Level</th>
                <th className="py-4 px-6">Date Created</th>
                <th className="py-4 px-6">Stats (Likes / Saves)</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[14px]">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <Spinner
                      size="lg"
                      color="current"
                      className="text-[#0f766e]"
                    />
                  </td>
                </tr>
              ) : currentLessons.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <BookOpen className="w-8 h-8 text-zinc-400" />
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                        No lessons created yet
                      </p>
                      <p className="text-[13px] text-zinc-400">
                        {searchQuery
                          ? "No lessons match your search keyword."
                          : "Draft your first module to share knowledge."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLessons.map((lesson) => {
                  return (
                    <tr
                      key={lesson._id}
                      className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      {/* Title & Moderation Indicator */}
                      <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="line-clamp-1">{lesson.title}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {lesson.isReviewed ? (
                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" /> Reviewed
                                </span>
                              ) : (
                                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> In Review
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 rounded-full text-[12px] font-semibold bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 border border-teal-200/50 dark:border-teal-500/20">
                          {lesson.category || "General"}
                        </span>
                      </td>

                      {/* Visibility Quick Select */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <select
                          value={lesson.visibility || "Public"}
                          onChange={(e) =>
                            handleVisibilityChange(lesson._id, e.target.value)
                          }
                          className="bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 outline-none focus:border-[#0f766e] transition-colors cursor-pointer"
                        >
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                          <option value="Draft">Draft</option>
                        </select>
                      </td>

                      {/* Access Level Quick Select */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <Tooltip
                          content="Upgrade to Pro to publish Premium lessons."
                          isDisabled={isPremiumUser}
                          placement="top"
                          className="text-xs bg-zinc-900 text-white dark:bg-zinc-800 px-3 py-1 rounded-lg"
                        >
                          <div className="inline-block">
                            <select
                              value={lesson.accessLevel || "Free"}
                              disabled={!isPremiumUser}
                              onChange={(e) =>
                                handleAccessLevelChange(
                                  lesson._id,
                                  e.target.value,
                                )
                              }
                              className={`bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-[13px] font-semibold outline-none transition-colors ${
                                !isPremiumUser
                                  ? "cursor-not-allowed opacity-60 text-zinc-500"
                                  : "cursor-pointer text-zinc-800 dark:text-zinc-200 focus:border-[#0f766e]"
                              }`}
                            >
                              <option value="Free">Free</option>
                              <option value="Premium" disabled={!isPremiumUser}>
                                Premium {!isPremiumUser ? "(Locked)" : ""}
                              </option>
                            </select>
                          </div>
                        </Tooltip>
                      </td>

                      {/* Date Created */}
                      <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400 font-medium whitespace-nowrap">
                        {formatDate(lesson.createdAt)}
                      </td>

                      {/* Stats */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-4 text-[13px] font-semibold text-zinc-600 dark:text-zinc-400">
                          <span className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                            {lesson.likesCount || lesson.likes?.length || 0}
                          </span>
                          <span className="flex items-center gap-1.5 hover:text-[#0f766e] transition-colors">
                            <Bookmark className="w-4 h-4 text-[#0f766e] fill-[#0f766e]/20" />
                            {lesson.savedBy?.length || 0}
                          </span>
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Lesson Details Button */}
                          <Link href={`/lessons/${lesson._id}`}>
                            <button
                              title="View Lesson"
                              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </Link>

                          {/* Update / Edit Modal Button */}
                          <button
                            onClick={() => handleEditClick(lesson)}
                            title="Edit Lesson"
                            className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-500/10 dark:hover:bg-teal-500/20 text-[#0f766e] dark:text-[#16A696] transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Lesson Button */}
                          <button
                            onClick={() => handleDeleteLesson(lesson._id)}
                            title="Delete Lesson"
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[14px] text-zinc-500">
            Showing {filteredLessons.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, filteredLessons.length)} of{" "}
            {filteredLessons.length} lessons
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

      {/* Edit Modal */}
      {editingLesson && (
        <EditLessonModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          lesson={editingLesson}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
