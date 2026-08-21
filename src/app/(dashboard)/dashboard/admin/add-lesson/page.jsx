'use client';
import ImageWithSpinner from "@/components/ImageWithSpinner";

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { 
  UploadCloud, 
  Save, 
  ArrowUpFromLine, 
  Star, 
  ShieldCheck, 
  Lock, 
  Globe
} from 'lucide-react';
import { Spinner } from '@heroui/react';

export default function AdminAddLesson() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const [accessLevel, setAccessLevel] = useState('Free');
  const [isFeatured, setIsFeatured] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState(null); 

  const actionRef = useRef('publish');

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitType(actionRef.current);
    const toastId = toast.loading(
      actionRef.current === 'draft' 
        ? 'Saving draft...' 
        : 'Publishing official lesson...'
    );

    let uploadedImageUrl = "";

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

    const lessonPayload = {
      title: data.title,
      description: data.description,
      category: data.category,
      emotionalTone: data.emotionalTone || "Motivational", 
      visibility: actionRef.current === 'draft' ? 'Draft' : (data.visibility || 'Public'),
      accessLevel: accessLevel,
      creatorId: user?.id || null, 
      coverImage: uploadedImageUrl, 
      isFeatured: isFeatured,
      // Auto-reviewed flag for admin creation
      isReviewed: true,
    };
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'; 

    try {
      const response = await fetch(`${backendUrl}/api/add-lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonPayload),
      });

      if (response.ok) {
        const successMessage = actionRef.current === 'draft' 
          ? "Lesson saved as draft!" 
          : "Lesson published & automatically approved!";
        
        toast.success(successMessage, { id: toastId });
        
        reset();
        setImagePreview(null);
        setAccessLevel('Free');
        setIsFeatured(false);
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
    <div className="max-w-5xl mx-auto w-full font-sans pb-16">
      
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Direct Publishing
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
            Create Official Lesson
          </h1>
          <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
            Official lessons published here bypass the review queue and are immediately live.
          </p>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Left Column: Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Title Card */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <label className="block text-[14px] font-bold text-zinc-900 dark:text-zinc-100 mb-3">
              Lesson Title
            </label>
            <input 
              type="text" 
              placeholder="e.g., The Architecture of Deep Focus"
              className={`w-full bg-transparent border ${errors.title ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-xl px-4 py-3 text-[15px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] dark:focus:border-[#16A696] transition-colors`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title.message}</span>}
          </div>

          {/* Description Card */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
            <div className="mb-3">
              <label className="block text-[14px] font-bold text-zinc-900 dark:text-zinc-100">
                Lesson Content & Analysis
              </label>
              <p className="text-[12px] text-zinc-500 mt-0.5">
                Provide comprehensive, actionable insight for community readers.
              </p>
            </div>
            <textarea 
              placeholder="Draft comprehensive lesson wisdom here..."
              rows={9}
              className={`w-full bg-transparent border ${errors.description ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-xl px-4 py-3 text-[15px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] dark:focus:border-[#16A696] transition-colors resize-none`}
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description.message}</span>}
          </div>

          {/* Cover Image Upload Card */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
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
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#0f766e] dark:hover:border-[#16A696] rounded-2xl bg-zinc-50 dark:bg-[#121214] transition-colors overflow-hidden group cursor-pointer"
              >
                {imagePreview ? (
                  <ImageWithSpinner width={500} height={500} src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <UploadCloud className="w-8 h-8 text-zinc-400 mb-3" />
                    <p className="text-[14px] text-zinc-600 dark:text-zinc-300">
                      <span className="text-[#0f766e] dark:text-[#16A696] font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-[12px] text-zinc-500 mt-2">
                      SVG, PNG, JPG or GIF (max. 1200x600px)
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Admin Configurations */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Publishing Configurations */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <h2 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              Admin Configuration
            </h2>
            
            {/* Category */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Category
              </label>
              <div className="relative">
                <select 
                  className={`w-full appearance-none bg-transparent border ${errors.category ? 'border-red-500' : 'border-zinc-300 dark:border-zinc-700'} rounded-xl px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors cursor-pointer`}
                  {...register("category", { required: "Category is required" })}
                  defaultValue=""
                >
                  <option value="" disabled className="dark:bg-zinc-900">Select category...</option>
                  <option value="Personal Growth" className="dark:bg-zinc-900">Personal Growth</option>
                  <option value="Career" className="dark:bg-zinc-900">Career</option>
                  <option value="Philosophy" className="dark:bg-zinc-900">Philosophy</option>
                  <option value="Productivity" className="dark:bg-zinc-900">Productivity</option>
                  <option value="Wealth" className="dark:bg-zinc-900">Wealth</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
              {errors.category && <span className="text-red-500 text-xs mt-1 block">{errors.category.message}</span>}
            </div>

            {/* Emotional Tone */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Emotional Tone
              </label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors cursor-pointer"
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

            {/* Visibility Mode */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Visibility Mode
              </label>
              <div className="relative">
                <select 
                  className="w-full appearance-none bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors cursor-pointer"
                  {...register("visibility")}
                  defaultValue="Public"
                >
                  <option value="Public" className="dark:bg-zinc-900">Public (Visible to everyone)</option>
                  <option value="Private" className="dark:bg-zinc-900">Private (Admin only)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Access Level Selector */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Access Tier
              </label>
              <div className="flex bg-zinc-100 dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <button 
                  type="button" 
                  onClick={() => setAccessLevel('Free')} 
                  className={`flex-1 py-2 rounded-lg text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    accessLevel === 'Free' 
                      ? 'text-zinc-900 dark:text-white bg-white dark:bg-zinc-800 shadow-xs' 
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" /> Free
                </button>
                <button 
                  type="button" 
                  onClick={() => setAccessLevel('Premium')} 
                  className={`flex-1 py-2 rounded-lg text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    accessLevel === 'Premium' 
                      ? 'text-amber-600 dark:text-amber-400 bg-white dark:bg-zinc-800 shadow-xs' 
                      : 'text-zinc-500 hover:text-zinc-700'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" /> Premium
                </button>
              </div>
            </div>

            {/* Feature on Homepage Toggle */}
            <div className="p-4 rounded-xl border border-amber-200/60 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Star className={`w-4 h-4 ${isFeatured ? 'fill-amber-500 text-amber-500' : 'text-zinc-400'}`} /> Feature on Homepage
                </span>
                <span className="text-[11px] text-zinc-500 mt-0.5">
                  Showcases in the top featured section
                </span>
              </div>
              <input 
                type="checkbox" 
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-5 h-5 accent-[#0f766e] rounded cursor-pointer"
              />
            </div>

          </div>

          {/* Admin Publish Controls */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-200/50 dark:border-emerald-500/20 mb-1">
              <p className="text-[12px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                Auto-moderated & marked as Reviewed
              </p>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              onClick={() => actionRef.current = 'draft'}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-[14px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting && submitType === 'draft' ? (
                <Spinner size="sm" color="current" />
              ) : (
                <><Save className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Save as Draft</>
              )}
            </button>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              onClick={() => actionRef.current = 'publish'}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold text-[14px] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {isSubmitting && submitType === 'publish' ? (
                <Spinner size="sm" color="white" />
              ) : (
                <><ArrowUpFromLine className="w-4 h-4" /> Publish Lesson Live</>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}