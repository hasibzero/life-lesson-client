'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { 
  UploadCloud, 
  Save, 
  ArrowUpFromLine, 
  Lock
} from 'lucide-react';
import { Spinner } from '@heroui/react';

export default function AddLesson() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [accessLevel, setAccessLevel] = useState('Free');
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState(null); // 'draft' or 'publish'
  
  // Track which button was clicked
  const actionRef = useRef('publish');

  // Fetch current user for the creatorId
  const { data: session } = authClient.useSession();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitType(actionRef.current);
    const toastId = toast.loading(`${actionRef.current === 'draft' ? 'Saving draft' : 'Publishing lesson'}...`);

    let uploadedImageUrl = "";

    // 1. Upload Cover Image to ImgBB (if selected)
    if (data.coverImage && data.coverImage.length > 0) {
      const formData = new FormData();
      formData.append("image", data.coverImage[0]);

      try {
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });
        
        const imgData = await res.json();
        if (imgData.success) {
          uploadedImageUrl = imgData.data.url; 
        } else {
          toast.error("Image upload failed.", { id: toastId });
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.error("Image upload error:", error);
        toast.error("Failed to upload image.", { id: toastId });
        setIsSubmitting(false);
        return;
      }
    }

    // 2. Construct the payload matching your MongoDB Schema
    const lessonPayload = {
      title: data.title,
      description: data.description,
      category: data.category,
      emotionalTone: data.emotionalTone || "Neutral", // Default or you can add to UI later
      visibility: actionRef.current === 'draft' ? 'Private' : 'Public',
      accessLevel: accessLevel,
      creatorId: session?.user?.id || null, // Reference to users._id
      coverImage: uploadedImageUrl, // Added for UI completeness
      likes: [],
      likesCount: 0,
      isFeatured: false,
      isReviewed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL; // Default to localhost if not set

    // 3. Send to your Express Backend
    try {
      const response = await fetch(`${backendUrl}/api/add-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonPayload),
      });

      if (response.ok) {
        toast.success(`Lesson successfully ${actionRef.current === 'draft' ? 'saved as draft' : 'published'}!`, { id: toastId });
        // Optional: Reset form or redirect here
      } else {
        toast.error("Failed to save lesson.", { id: toastId });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Server error occurred.", { id: toastId });
    } finally {
      setIsSubmitting(false);
      setSubmitType(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a202c] dark:text-white tracking-tight mb-2">
          Add New Lesson
        </h1>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-400">
          Create and publish new curated wisdom for the platform.
        </p>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Title Card */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <label className="block text-[14px] font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Lesson Title
            </label>
            <input 
              type="text" 
              placeholder="e.g., The Stoic Approach to Leadership"
              className={`w-full bg-transparent border ${errors.title ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-lg px-4 py-3 text-[15px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] dark:focus:border-[#16A696] transition-colors`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
          </div>

          {/* Description Card */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="mb-3">
              <label className="block text-[14px] font-bold text-zinc-900 dark:text-zinc-100">
                Description
              </label>
              <p className="text-[12px] text-zinc-500 mt-0.5">
                Provide a comprehensive overview of the lesson content.
              </p>
            </div>
            <textarea 
              placeholder="Start writing the lesson content here..."
              rows={8}
              className={`w-full bg-transparent border ${errors.description ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-lg px-4 py-3 text-[15px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] dark:focus:border-[#16A696] transition-colors resize-none`}
              {...register("description", { required: "Description is required" })}
            ></textarea>
            {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
          </div>

          {/* Cover Image Card */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <label className="block text-[14px] font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Cover Image
            </label>
            <div className="relative">
              <input 
                type="file" 
                id="coverUpload"
                accept="image/*"
                className="hidden"
                {...register("coverImage", { onChange: handleImageChange })}
              />
              <label 
                htmlFor="coverUpload" 
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#16A696] dark:hover:border-[#16A696] rounded-xl bg-zinc-50 dark:bg-[#121214] cursor-pointer transition-colors overflow-hidden group"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <UploadCloud className="w-8 h-8 text-zinc-400 mb-3" />
                    <p className="text-[14px] text-zinc-600 dark:text-zinc-300">
                      <span className="text-[#16A696] font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[12px] text-zinc-500 mt-2">
                      SVG, PNG, JPG or GIF (max. 800x400px)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Settings & Actions */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Settings Card */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              Lesson Settings
            </h2>
            
            {/* Category */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Category
              </label>
              <div className="relative">
                <select 
                  className={`cursor-pointer w-full appearance-none bg-transparent border ${errors.category ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] transition-colors`}
                  {...register("category", { required: "Category is required" })}
                  defaultValue=""
                >
                  <option value="" disabled className="dark:bg-zinc-900">Select a category...</option>
                  <option value="Personal Growth" className="dark:bg-zinc-900">Personal Growth</option>
                  <option value="Career" className="dark:bg-zinc-900">Career</option>
                  <option value="Philosophy" className="dark:bg-zinc-900">Philosophy</option>
                  <option value="Productivity" className="dark:bg-zinc-900">Productivity</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              {errors.category && <span className="text-red-500 text-xs mt-1 block">{errors.category.message}</span>}
            </div>

            {/* Emotional Tone (Hidden in UI design, but added for schema matching) */}
            <div>
              <label className=" block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Emotional Tone
              </label>
              <div className="relative cursor-pointer">
                <select 
                  className={`cursor-pointer w-full appearance-none bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] transition-colors`}
                  {...register("emotionalTone")}
                  defaultValue="Motivational"
                >
                  <option value="Motivational" className="dark:bg-zinc-900">Motivational</option>
                  <option value="Realization" className="dark:bg-zinc-900">Realization</option>
                  <option value="Calm" className="dark:bg-zinc-900">Calm</option>
                  <option value="Energetic" className="dark:bg-zinc-900">Energetic</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Access Level Custom Toggle */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Access Level
              </label>
              <div className="flex bg-zinc-100 dark:bg-[#18181b] p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 relative">
                <button 
                  type="button" 
                  onClick={() => setAccessLevel('Free')} 
                  className={`cursor-pointer flex-1 py-2 rounded-md text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-200 z-10 ${accessLevel === 'Free' ? 'text-zinc-900 bg-white dark:bg-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  Free
                </button>
                <button 
                  type="button" 
                  onClick={() => setAccessLevel('Premium')} 
                  className={`cursor-pointer flex-1 py-2 rounded-md text-[13px] font-bold flex items-center justify-center gap-2 transition-all duration-200 z-10 ${accessLevel === 'Premium' ? 'text-zinc-900 dark:text-zinc-900 bg-white dark:bg-zinc-100 shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  Premium
                </button>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-3 leading-tight">
                Premium lessons are restricted to paid subscribers.
              </p>
            </div>
          </div>

          {/* Action Buttons Card */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-3">
            <button 
              type="submit"
              disabled={isSubmitting}
              onClick={() => actionRef.current = 'draft'}
              className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-[14px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting && submitType === 'draft' ? (
                <Spinner size="sm" color="current" />
              ) : (
                <><Save className="w-4 h-4 text-[#5b32a8] dark:text-[#8b5cf6]" /> Save Draft</>
              )}
            </button>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              onClick={() => actionRef.current = 'publish'}
              className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#0d6e63] hover:bg-[#0a574e] text-white font-semibold text-[14px] transition-colors disabled:opacity-50"
            >
              {isSubmitting && submitType === 'publish' ? (
                <Spinner size="sm" color="white" />
              ) : (
                <><ArrowUpFromLine className="w-4 h-4" /> Publish Lesson</>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}