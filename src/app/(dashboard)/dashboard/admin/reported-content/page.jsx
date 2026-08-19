"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Eye, 
  X, 
  ShieldCheck, 
  User, 
  Clock, 
  FileText,
  AlertTriangle,
  Mail
} from "lucide-react";
import { Spinner, Button } from "@heroui/react";
import toast from "react-hot-toast";

export default function ReportedContentPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected Lesson for Details Modal
  const [selectedLessonGroup, setSelectedLessonGroup] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // Fetch Reports
  const fetchReports = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/reports`);
      if (response.ok) {
        const data = await response.json();
        setReports(Array.isArray(data) ? data : []);
      } else {
        toast.error("Failed to load reports.");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Server connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [backendUrl]);

  // Case-insensitive status grouping
  const openReports = reports.filter((r) => r.status?.toLowerCase() !== "resolved");
  const resolvedReportsCount = reports.filter((r) => r.status?.toLowerCase() === "resolved").length;

  const groupedMap = {};
  openReports.forEach((report) => {
    const key = report.lessonId?.toString() || "unknown";
    const detectedAuthor = 
      report.authorName || 
      report.creatorName || 
      report.lessonAuthor || 
      "Community Creator";

    if (!groupedMap[key]) {
      groupedMap[key] = {
        lessonId: report.lessonId,
        lessonTitle: report.lessonTitle || "Untitled Lesson",
        authorName: detectedAuthor,
        reports: [],
      };
    } else if (groupedMap[key].authorName === "Community Creator" && detectedAuthor !== "Community Creator") {
      groupedMap[key].authorName = detectedAuthor;
    }

    groupedMap[key].reports.push(report);
  });

  const groupedReportedLessons = Object.values(groupedMap);

  // Pagination Logic
  const totalPages = Math.ceil(groupedReportedLessons.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLessons = groupedReportedLessons.slice(indexOfFirstItem, indexOfLastItem);

  // Handle Ignore / Dismiss Reports
  const handleIgnoreReports = async (lessonId) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/reports/lesson/${lessonId}/resolve`, {
        method: "PATCH",
      });

      if (response.ok) {
        toast.success("Reports cleared. Lesson remains active.");
        setReports((prev) =>
          prev.map((r) => (r.lessonId === lessonId ? { ...r, status: "resolved" } : r))
        );
        setIsModalOpen(false);
      } else {
        toast.error("Failed to clear reports.");
      }
    } catch (error) {
      console.error("Error ignoring reports:", error);
      toast.error("Failed to clear reports.");
    }
  };

  // Handle Delete Lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Are you sure you want to permanently delete this lesson? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/lessons/${lessonId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Lesson permanently deleted.");
        setReports((prev) =>
          prev.map((r) => (r.lessonId === lessonId ? { ...r, status: "resolved" } : r))
        );
        setIsModalOpen(false);
      } else {
        toast.error("Failed to delete lesson.");
      }
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast.error("Server error while deleting.");
    }
  };

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
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 font-sans pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
          Reported Content
        </h1>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
          Review flagged lessons, inspect moderation reasons, and take administrative action.
        </p>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Flagged Lessons */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Flagged Lessons
            </span>
            <span className="text-3xl font-extrabold text-red-600 dark:text-red-400">
              {groupedReportedLessons.length}
            </span>
            <span className="text-[12px] text-zinc-400 mt-1">Requiring decision</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Total Report Tickets */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Total Reports Logged
            </span>
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {openReports.length}
            </span>
            <span className="text-[12px] text-zinc-400 mt-1">Open complaints</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved Reports */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
              Resolved Reports
            </span>
            <span className="text-3xl font-extrabold text-[#0f766e] dark:text-[#16A696]">
              {resolvedReportsCount}
            </span>
            <span className="text-[12px] text-zinc-400 mt-1">Moderated / Cleared</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Reported Lessons Table */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="py-4 px-6">Lesson Title</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6 text-center">Report Count</th>
                <th className="py-4 px-6">Reasons & Reports</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[14px]">
              {currentLessons.map((group) => (
                <tr key={group.lessonId} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  
                  {/* Lesson Title & Link */}
                  <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">
                    <Link
                      href={`/lessons/${group.lessonId}`}
                      target="_blank"
                      className="hover:text-[#0f766e] dark:hover:text-[#16A696] transition-colors line-clamp-1"
                    >
                      {group.lessonTitle}
                    </Link>
                  </td>

                  {/* Author */}
                  <td className="py-4 px-6 text-zinc-700 dark:text-zinc-200 font-semibold whitespace-nowrap">
                    {group.authorName}
                  </td>

                  {/* Report Count */}
                  <td className="py-4 px-6 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-extrabold bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-900/50">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      {group.reports.length} {group.reports.length === 1 ? "Report" : "Reports"}
                    </span>
                  </td>

                  {/* View Details Modal Trigger */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <button
                      onClick={() => {
                        setSelectedLessonGroup(group);
                        setIsModalOpen(true);
                      }}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 font-semibold text-[12px] px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-500" /> View Reasons
                    </button>
                  </td>

                  {/* Actions: Ignore / Delete Lesson */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      
                      {/* Ignore Action */}
                      <button
                        onClick={() => handleIgnoreReports(group.lessonId)}
                        title="Ignore and dismiss all reports for this lesson"
                        className="px-3.5 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-[13px] transition-colors cursor-pointer inline-flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Ignore
                      </button>

                      {/* Delete Action */}
                      <button
                        onClick={() => handleDeleteLesson(group.lessonId)}
                        title="Permanently delete this lesson"
                        className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 font-semibold text-[13px] transition-colors cursor-pointer inline-flex items-center gap-1.5 border border-red-200 dark:border-red-900/50"
                      >
                        <Trash2 className="w-4 h-4" /> Delete Lesson
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {groupedReportedLessons.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-zinc-800 dark:text-zinc-200 text-base">
                        No open reports found
                      </p>
                      <p className="text-[13px] text-zinc-500 max-w-sm">
                        All flagged content has been reviewed and resolved.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[14px] text-zinc-500">
            Showing {groupedReportedLessons.length > 0 ? indexOfFirstItem + 1 : 0} to{" "}
            {Math.min(indexOfLastItem, groupedReportedLessons.length)} of {groupedReportedLessons.length} flagged lessons
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

      {/* REPORT DETAILS MODAL */}
      {isModalOpen && selectedLessonGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
          <div className="w-full max-w-xl bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col gap-6 max-h-[85vh] overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col pr-4">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <h2>Report Details</h2>
                </div>
                <span className="text-[15px] font-bold text-zinc-900 dark:text-white mt-1 line-clamp-1">
                  {selectedLessonGroup.lessonTitle}
                </span>
                <span className="text-[12px] text-zinc-500">
                  Author: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedLessonGroup.authorName}</span> • {selectedLessonGroup.reports.length} total reports
                </span>
              </div>
              
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List of Report Reasons */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
              {selectedLessonGroup.reports.map((report, idx) => (
                <div
                  key={report._id || idx}
                  className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-4 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between text-[13px]">
                    <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200">
                      <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center text-[11px]">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate max-w-[220px]">
                        {report.reporterEmail || report.userName || report.reporterName || "Anonymous User"}
                      </span>
                    </div>

                    <span className="text-[12px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {formatDate(report.createdAt)}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200/70 dark:border-zinc-800/60 text-[13px] text-zinc-700 dark:text-zinc-300 leading-relaxed flex flex-col gap-1.5">
                    <div>
                      <span className="font-semibold text-red-600 dark:text-red-400 text-[11px] uppercase tracking-wider block mb-0.5">
                        Selected Reason:
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {report.reason}
                      </span>
                    </div>

                    {report.details && (
                      <div className="pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60">
                        <span className="font-semibold text-zinc-400 text-[11px] uppercase tracking-wider block mb-0.5">
                          Additional Details:
                        </span>
                        <p className="text-zinc-600 dark:text-zinc-400 italic">
                          &ldquo;{report.details}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                href={`/lessons/${selectedLessonGroup.lessonId}`}
                target="_blank"
                className="text-[13px] font-semibold text-[#0f766e] dark:text-[#16A696] hover:underline flex items-center gap-1"
              >
                <FileText className="w-4 h-4" /> Open Full Lesson
              </Link>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => handleIgnoreReports(selectedLessonGroup.lessonId)}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 font-semibold text-[13px] px-4 py-2 rounded-xl cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Ignore All
                </button>
                <button
                  onClick={() => handleDeleteLesson(selectedLessonGroup.lessonId)}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold text-[13px] px-4 py-2 rounded-xl cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete Lesson
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}