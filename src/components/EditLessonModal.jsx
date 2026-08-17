'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@heroui/react'; // Button is safe to keep!
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditLessonModal({ isOpen, onClose, lesson, onUpdateSuccess }) {
  const { register, handleSubmit, reset } = useForm();
  const [isUpdating, setIsUpdating] = useState(false);

  // Pre-fill the form whenever the lesson prop changes
  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title,
        description: lesson.description,
        category: lesson.category,
        visibility: lesson.visibility,
        accessLevel: lesson.accessLevel,
      });
    }
  }, [lesson, reset]);

  const onSubmitUpdate = async (data) => {
    setIsUpdating(true);
    const toastId = toast.loading('Updating lesson...');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${backendUrl}/api/update-lesson/${lesson._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast.success("Lesson updated successfully!", { id: toastId });
        onUpdateSuccess(data); // Pass updated data back to parent component
        onClose(); // Close the modal
      } else {
        const errData = await response.json();
        toast.error(errData.message || "Failed to update lesson.", { id: toastId });
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Server error occurred.", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  // If the modal isn't open, don't render anything
  if (!isOpen) return null;

  return (
    // 1. Native Tailwind Backdrop Overlay
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose} // Clicking the dark background closes the modal
    >
      
      {/* 2. Modal Content Box */}
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()} // Clicking inside the white box DOES NOT close it
      >
        <form onSubmit={handleSubmit(onSubmitUpdate)}>
          
          {/* Custom Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-[#0d233a] dark:text-white">
              Edit Lesson
            </h2>
            <button 
              type="button" 
              onClick={onClose}
              className="p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Custom Body */}
          <div className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">Lesson Title</label>
              <input 
                type="text" 
                className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] transition-colors"
                {...register("title", { required: true })}
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">Description</label>
              <textarea 
                rows={5}
                className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] transition-colors resize-none"
                {...register("description", { required: true })}
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">Category</label>
                <select 
                  className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] cursor-pointer"
                  {...register("category")}
                >
                  <option value="Personal Growth" className="dark:bg-zinc-900">Personal Growth</option>
                  <option value="Career" className="dark:bg-zinc-900">Career</option>
                  <option value="Philosophy" className="dark:bg-zinc-900">Philosophy</option>
                  <option value="Productivity" className="dark:bg-zinc-900">Productivity</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">Visibility</label>
                <select 
                  className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] cursor-pointer"
                  {...register("visibility")}
                >
                  <option value="Private" className="dark:bg-zinc-900">Draft (Private)</option>
                  <option value="Public" className="dark:bg-zinc-900">Published (Public)</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">Access Level</label>
                <select 
                  className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] cursor-pointer"
                  {...register("accessLevel")}
                >
                  <option value="Free" className="dark:bg-zinc-900">Free</option>
                  <option value="Premium" className="dark:bg-zinc-900">Premium</option>
                </select>
              </div>
            </div>
          </div>

          {/* Custom Footer */}
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-900/20">
            <Button 
              color="danger" 
              variant="light" 
              onPress={onClose}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#16A696] text-white font-semibold"
              isLoading={isUpdating}
            >
              Save Changes
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
}