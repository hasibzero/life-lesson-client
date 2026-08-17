'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Heart, 
  Bookmark, 
  BookOpen
} from 'lucide-react';
import { Spinner } from '@heroui/react';
import toast from 'react-hot-toast';
import EditLessonModal from '@/components/EditLessonModal';

export default function MyLessons() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    const fetchMyLessons = async () => {
      if (!user?.id) return;
      
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/my-lessons/${user.id}`);
        
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
  }, [user?.id]);

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
        lesson._id === editingLesson._id ? { ...lesson, ...updatedData } : lesson
      )
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-[#0d233a] dark:text-white tracking-tight">
            My Lessons
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            Manage and track the performance of your published content.
          </p>
        </div>
        <Link 
          href="/dashboard/user/add-lesson" 
          className="inline-flex items-center gap-2 bg-[#16A696] hover:bg-[#138f81] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create New Lesson
        </Link>
      </div>

      <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <th className="py-4 px-6 text-[14px] font-semibold text-zinc-600 dark:text-zinc-400">Lesson Title</th>
                <th className="py-4 px-6 text-[14px] font-semibold text-zinc-600 dark:text-zinc-400">Date Published</th>
                <th className="py-4 px-6 text-[14px] font-semibold text-zinc-600 dark:text-zinc-400">Category</th>
                <th className="py-4 px-6 text-[14px] font-semibold text-zinc-600 dark:text-zinc-400">Visibility</th>
                <th className="py-4 px-6 text-[14px] font-semibold text-zinc-600 dark:text-zinc-400">Access Level</th>
                <th className="py-4 px-6 text-[14px] font-semibold text-zinc-600 dark:text-zinc-400">Stats (Reactions/Saves)</th>
                <th className="py-4 px-6 text-[14px] font-semibold text-zinc-600 dark:text-zinc-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {isLoading ? (
                <tr><td colSpan="7" className="py-12 text-center">
                  <Spinner size="md" color="current" className="text-[#16A696]" />
                </td></tr>
              ) : lessons.length === 0 ? (
                <tr><td colSpan="7" className="py-12 text-center text-zinc-500 dark:text-zinc-400">
                  You haven't created any lessons yet.
                </td></tr>
              ) : (
                lessons.map((lesson, index) => {
                  const colorClasses = [
                    "bg-[#7b61ff] text-white", 
                    "bg-[#c97b53] text-white", 
                    "bg-[#16A696] text-white"  
                  ];
                  const iconBg = colorClasses[index % colorClasses.length];

                  return (
                    <tr key={lesson._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors"><td className="py-4 px-6 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
                          <BookOpen className="w-5 h-5" /> 
                        </div>
                        <span className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100">
                          {lesson.title}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[14px] text-zinc-600 dark:text-zinc-300">
                        {formatDate(lesson.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#eef2ff] text-[#4f46e5] dark:bg-indigo-500/10 dark:text-indigo-400">
                          {lesson.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {lesson.visibility === 'Public' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-[#ecfdf5] text-[#059669] dark:bg-emerald-500/10 dark:text-emerald-400">
                            Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {lesson.accessLevel === 'Premium' ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                            Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4 text-[14px] text-zinc-600 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-4 h-4" />
                            <span>{lesson.likesCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Bookmark className="w-4 h-4" />
                            <span>0</span> 
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-3 text-zinc-500">
                          <button 
                            onClick={() => handleEditClick(lesson)}
                            className="cursor-pointer p-1.5 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors" 
                            aria-label="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="cursor-pointer p-1.5 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md transition-colors" aria-label="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td></tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <p className="text-[14px] text-zinc-600 dark:text-zinc-400">
          Showing {lessons.length > 0 ? 1 : 0} to {lessons.length} of {lessons.length} lessons
        </p>
        <div className="flex items-center gap-2">
          <button disabled className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[14px] font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed">
            Previous
          </button>
          <button disabled className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[14px] font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed">
            Next
          </button>
        </div>
      </div>

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