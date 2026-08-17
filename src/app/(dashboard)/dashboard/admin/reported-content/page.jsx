"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Spinner, Button } from "@heroui/react";
import toast from "react-hot-toast";

export default function ReportedContentPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const fetchReports = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/reports`);
      if (response.ok) {
        const data = await response.json();
        setReports(data);
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

  const handleResolveReport = async (reportId) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' })
      });

      if (response.ok) {
        toast.success("Report marked as resolved.");
        setReports(reports.map(r => r._id === reportId ? { ...r, status: 'Resolved' } : r));
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  const handleDeleteLesson = async (lessonId, reportId) => {
    if (!window.confirm("Are you sure you want to delete this reported lesson?")) return;

    try {
      const response = await fetch(`${backendUrl}/api/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Lesson deleted successfully.");
        setReports(reports.map(r => r._id === reportId ? { ...r, status: 'Resolved' } : r));
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

  const openReports = reports.filter(r => r.status !== 'Resolved');
  const resolvedReportsCount = reports.filter(r => r.status === 'Resolved').length;

  const totalPages = Math.ceil(openReports.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReports = openReports.slice(indexOfFirstItem, indexOfLastItem);

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 font-sans">
      
      <div>
        <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
          Reported Content
        </h1>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
          Review and manage reported lessons to maintain community standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Open Reports
            </span>
            <span className="text-4xl font-extrabold text-red-600 dark:text-red-400">
              {openReports.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Resolved Today
            </span>
            <span className="text-4xl font-extrabold text-[#0f766e] dark:text-[#16A696]">
              {resolvedReportsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 text-[13px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50/50 dark:bg-zinc-900/50">
                <th className="py-4 px-6">Reported Lesson</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Reported By</th>
                <th className="py-4 px-6">Reason</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-[14px]">
              {currentReports.map((report) => (
                <tr key={report._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  
                  <td className="py-4 px-6 font-bold text-zinc-900 dark:text-white">
                    {report.lessonTitle || "Untitled Lesson"}
                  </td>

                  <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300 font-medium">
                    {report.authorName || "Anonymous"}
                  </td>

                  {/* Fully Dynamic Reporter Name */}
                  <td className="py-4 px-6 text-zinc-600 dark:text-zinc-300 font-medium">
                    {report.userName || "Anonymous"}
                  </td>

                  <td className="py-4 px-6">
                    <span className="inline-flex px-3 py-1 rounded-full text-[12px] font-semibold bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-900">
                      {report.reason || "Inappropriate"}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-zinc-500 dark:text-zinc-400 font-medium">
                    {formatDate(report.createdAt)}
                  </td>

                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Pending
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => handleResolveReport(report._id)}
                        className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold text-[13px] px-4 py-1.5 rounded-xl h-auto transition-colors cursor-pointer"
                      >
                        Review
                      </Button>
                      <button
                        onClick={() => handleDeleteLesson(report.lessonId, report._id)}
                        title="Delete Lesson"
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}

              {currentReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No open reports found. Everything looks clean!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[14px] text-zinc-500">
            Showing {openReports.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, openReports.length)} of {openReports.length} reports
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