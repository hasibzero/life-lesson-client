'use client';
import ImageWithSpinner from "@/components/ImageWithSpinner";

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import { Button, Tooltip, Spinner } from '@heroui/react';
import { 
  X, 
  UploadCloud, 
  Lock, 
  User as UserIcon, 
  Mail, 
  Image as ImageIcon 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditLessonModal({ isOpen, onClose, lesson, onUpdateSuccess }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const isPremiumUser = user?.role === 'admin' || user?.plan === 'premium';

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Pre-fill form and preview whenever the lesson prop changes
  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title || '',
        description: lesson.description || '',
        category: lesson.category || 'Personal Growth',
        emotionalTone: lesson.emotionalTone || 'Motivational',
        visibility: lesson.visibility || 'Public',
        accessLevel: lesson.accessLevel || 'Free',
      });
      setImagePreview(lesson.coverImage || null);
      setSelectedFile(null);
    }
  }, [lesson, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmitUpdate = async (data) => {
    setIsUpdating(true);
    const toastId = toast.loading('Saving updates...');
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    const tokenRes = await authClient.token();
    const token = tokenRes?.data?.token;
    
    try {
      let finalImageUrl = lesson?.coverImage || '';

      // 1. Upload new image if the user selected a new file
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: 'POST',
          body: formData,
        });

        const imgData = await res.json();
        if (imgData.success) {
          finalImageUrl = imgData.data.url;
        } else {
          toast.error('Image upload failed. Keeping current image.', { id: toastId });
        }
      }

      // 2. Build sanitized update payload
      const updatePayload = {
        title: data.title,
        description: data.description,
        category: data.category,
        emotionalTone: data.emotionalTone,
        visibility: data.visibility,
        accessLevel: isPremiumUser ? data.accessLevel : 'Free',
        coverImage: finalImageUrl,
        updatedAt: new Date(),
      };
      

      // 3. Patch to MongoDB
      const response = await fetch(`${backendUrl}/api/update-lesson/${lesson._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify(updatePayload),
      });

      if (response.ok) {
        toast.success('Lesson updated successfully!', { id: toastId });
        onUpdateSuccess(updatePayload);
        onClose();
      } else {
        const errData = await response.json();
        toast.error(errData.message || 'Failed to update lesson.', { id: toastId });
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Server error occurred while updating.', { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmitUpdate)}>
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Edit Lesson
              </h2>
              <p className="text-[13px] text-zinc-500 mt-0.5">
                Update module content, metadata, and audience visibility.
              </p>
            </div>
            <button 
              type="button" 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Body */}
          <div className="p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
            
            {/* Read-Only Creator Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-[13px] text-zinc-500">
                <UserIcon className="w-4 h-4 text-zinc-400" />
                <span>Author:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {lesson?.creatorName || user?.name || 'Anonymous'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[13px] text-zinc-500">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span>Email:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                  {user?.email || 'N/A'}
                </span>
              </div>
            </div>

            {/* Lesson Title */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Lesson Title
              </label>
              <input 
                type="text" 
                className={`w-full bg-transparent border ${errors.title ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-xl px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors`}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Description / Content
              </label>
              <textarea 
                rows={5}
                className={`w-full bg-transparent border ${errors.description ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-xl px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors resize-none`}
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
            </div>

            {/* Cover Image Re-upload (Optional) */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Cover Image (Optional)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                  {imagePreview ? (
                    <ImageWithSpinner width={500} height={500} src={imagePreview} alt="Cover Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-zinc-400" />
                  )}
                </div>

                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden" 
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-[13px] font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" /> Replace Image
                </button>
              </div>
            </div>

            {/* Select Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
              
              {/* Category */}
              <div>
                <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Category
                </label>
                <select 
                  className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-[13px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] cursor-pointer"
                  {...register("category")}
                >
                  <option value="Personal Growth" className="dark:bg-zinc-900">Personal Growth</option>
                  <option value="Career" className="dark:bg-zinc-900">Career</option>
                  <option value="Philosophy" className="dark:bg-zinc-900">Philosophy</option>
                  <option value="Productivity" className="dark:bg-zinc-900">Productivity</option>
                  <option value="Wealth" className="dark:bg-zinc-900">Wealth</option>
                </select>
              </div>

              {/* Emotional Tone */}
              <div>
                <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Emotional Tone
                </label>
                <select 
                  className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-[13px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] cursor-pointer"
                  {...register("emotionalTone")}
                >
                  <option value="Motivational" className="dark:bg-zinc-900">Motivational</option>
                  <option value="Realization" className="dark:bg-zinc-900">Realization</option>
                  <option value="Calm" className="dark:bg-zinc-900">Calm</option>
                  <option value="Energetic" className="dark:bg-zinc-900">Energetic</option>
                </select>
              </div>

              {/* Visibility */}
              <div>
                <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Visibility
                </label>
                <select 
                  className="w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-[13px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] cursor-pointer"
                  {...register("visibility")}
                >
                  <option value="Public" className="dark:bg-zinc-900">Public</option>
                  <option value="Private" className="dark:bg-zinc-900">Private</option>
                  <option value="Draft" className="dark:bg-zinc-900">Draft</option>
                </select>
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  Access Level
                </label>
                <Tooltip 
                  content="Upgrade to Pro to publish Premium lessons." 
                  isDisabled={isPremiumUser}
                  placement="top"
                  className="text-xs bg-zinc-900 text-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg"
                >
                  <div className="relative">
                    <select 
                      disabled={!isPremiumUser}
                      className={`w-full bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-3 py-2 text-[13px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] ${
                        !isPremiumUser ? 'cursor-not-allowed opacity-60 bg-zinc-100/50 dark:bg-zinc-900/50' : 'cursor-pointer'
                      }`}
                      {...register("accessLevel")}
                    >
                      <option value="Free" className="dark:bg-zinc-900">Free</option>
                      <option value="Premium" disabled={!isPremiumUser} className="dark:bg-zinc-900">
                        Premium {!isPremiumUser ? '(Locked)' : ''}
                      </option>
                    </select>
                  </div>
                </Tooltip>
              </div>

            </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 bg-zinc-50/50 dark:bg-zinc-900/20">
            <Button 
              variant="flat" 
              onPress={onClose}
              disabled={isUpdating}
              className="text-zinc-700 dark:text-zinc-300 font-semibold rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isUpdating}
              className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold rounded-xl cursor-pointer"
            >
              {isUpdating ? <Spinner size="sm" color="white" /> : 'Save Changes'}
            </Button>
          </div>
          
        </form>
      </div>
    </div>
  );
}