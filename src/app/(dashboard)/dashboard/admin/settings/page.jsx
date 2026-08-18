'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { Spinner, Button } from '@heroui/react';
import toast from 'react-hot-toast';
import { 
  Shield, 
  Mail, 
  User as UserIcon, 
  CheckCircle2, 
  BookOpen, 
  Users, 
  Flag, 
  Camera, 
  Trash2,
  TrendingUp,
  Activity
} from 'lucide-react';

export default function AdminProfileSettings() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [fullName, setFullName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // Admin Activity Metrics State
  const [adminStats, setAdminStats] = useState({
    resolvedReports: 0,
    totalLessons: 0,
    totalUsers: 0,
    myLessons: 0
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  const fileInputRef = useRef(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Sync user name on session load
  useEffect(() => {
    if (user?.name) {
      setFullName(user.name);
    }
  }, [user?.name]);

  // Fetch Admin Activity & Moderation Data
  useEffect(() => {
    const fetchAdminActivity = async () => {
      try {
        const [statsRes, reportsRes, myLessonsRes] = await Promise.all([
          fetch(`${backendUrl}/api/admin/stats`),
          fetch(`${backendUrl}/api/admin/reports`),
          user?.id ? fetch(`${backendUrl}/api/my-lessons/${user.id}`) : Promise.resolve(null)
        ]);

        let totalUsers = 0;
        let totalLessons = 0;
        let resolvedReports = 0;
        let myLessons = 0;

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          totalUsers = statsData.totalUsers || 0;
          totalLessons = statsData.totalLessons || 0;
        }

        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          resolvedReports = reportsData.filter(r => r.status === 'Resolved').length;
        }

        if (myLessonsRes && myLessonsRes.ok) {
          const myLessonsData = await myLessonsRes.json();
          myLessons = myLessonsData.length || 0;
        }

        setAdminStats({
          resolvedReports,
          totalLessons,
          totalUsers,
          myLessons
        });
      } catch (error) {
        console.error("Error fetching admin activity:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchAdminActivity();
  }, [user?.id, backendUrl]);

  const initial = fullName ? fullName.charAt(0).toUpperCase() : (user?.name?.charAt(0).toUpperCase() || 'A');
  const currentImage = avatarPreview !== null ? avatarPreview : user?.image;

  // 1. Handle Automatic Picture Upload to ImgBB and Database
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setIsUploadingImage(true);
    const toastId = toast.loading("Uploading profile picture...");

    try {
      const formData = new FormData();
      formData.append("image", file);
      
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY; 
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      
      const imgData = await res.json();
      
      if (imgData.success) {
        const uploadedImageUrl = imgData.data.url; 
        
        const { error } = await authClient.updateUser({
          image: uploadedImageUrl
        });

        if (error) {
          toast.error(error.message || "Failed to save picture to database.", { id: toastId });
        } else {
          toast.success("Profile picture updated successfully!", { id: toastId });
        }
      } else {
        toast.error("Image upload failed.", { id: toastId });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("An error occurred during upload.", { id: toastId });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 2. Handle Removing the Picture
  const handleRemovePicture = async () => {
    const toastId = toast.loading("Removing profile picture...");
    try {
      const { error } = await authClient.updateUser({
        image: ""
      });

      if (error) {
        toast.error(error.message || "Failed to remove picture.", { id: toastId });
      } else {
        setAvatarPreview("");
        toast.success("Profile picture removed.", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred.", { id: toastId });
    }
  };

  // 3. Handle Saving Display Name
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Display name cannot be empty.");
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");
    
    try {
      const { error } = await authClient.updateUser({
        name: fullName
      });

      if (error) {
        toast.error(error.message || "Failed to update profile details.", { id: toastId });
      } else {
        toast.success("Display name updated successfully!", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred while saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 font-sans pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
          Admin Profile & Settings
        </h1>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
          Manage your administrator identity, credentials, and review platform moderation activity.
        </p>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-8">
        
        {/* Profile Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Admin Credentials
            </h2>
            <span className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-500/20 shadow-xs">
              <Shield className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500" /> System Administrator
            </span>
          </div>

          <div className="flex items-center gap-2 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-200/50 dark:border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" /> Full Root Privileges
          </div>
        </div>

        {/* Avatar Upload Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            {currentImage ? (
              <img 
                src={currentImage} 
                alt="Profile Avatar" 
                className={`w-24 h-24 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 shadow-sm transition-opacity ${isUploadingImage ? 'opacity-40' : 'opacity-100'}`}
              />
            ) : (
              <div className="w-24 h-24 rounded-full flex items-center justify-center bg-[#0f766e] text-white text-3xl font-extrabold border-2 border-zinc-200 dark:border-zinc-700 shadow-sm">
                {initial}
              </div>
            )}
            
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="md" color="current" className="text-[#0f766e]" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-zinc-700 dark:text-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4" /> Change Photo
              </button>

              {currentImage && (
                <button 
                  type="button"
                  onClick={handleRemovePicture}
                  disabled={isUploadingImage}
                  className="flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-red-600 hover:text-red-700 dark:text-red-400 bg-red-50 hover:bg-red-100/80 dark:bg-red-500/10 dark:hover:bg-red-500/20 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>
            <span className="text-[12px] text-zinc-500 dark:text-zinc-400">
              Upload custom administrator avatar (JPG, PNG or GIF).
            </span>
          </div>
        </div>

        {/* Details Form */}
        <form onSubmit={handleSaveDetails} className="flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Display Name (Editable) */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-zinc-400" /> Admin Display Name
              </label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter admin name"
                className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
                required
              />
            </div>

            {/* Email Address (Read-only) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-400" /> Admin Email Address
                </label>
                <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500">
                  Read-only
                </span>
              </div>
              <input 
                type="email" 
                value={user?.email || ""}
                disabled
                className="w-full bg-zinc-100/70 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl px-4 py-3 text-[14px] text-zinc-500 dark:text-zinc-400 outline-none cursor-not-allowed select-none"
              />
            </div>

          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="submit"
              disabled={isSaving || fullName === user?.name}
              className="cursor-pointer px-6 py-2.5 bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold rounded-xl text-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {isSaving ? <Spinner size="sm" color="white" /> : "Save Changes"}
            </button>
          </div>

        </form>

      </div>

      {/* Admin Activity & Moderation Summary */}
      <div className="flex flex-col gap-6">
        
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Platform & Moderation Activity
            </h2>
            <p className="text-[14px] text-zinc-500 dark:text-zinc-400">
              Overview of management impact and administrative responsibilities
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Moderated / Resolved Reports */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
                Reports Resolved
              </span>
              <Flag className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                {isLoadingStats ? <Spinner size="sm" color="current" /> : adminStats.resolvedReports}
              </h3>
              <p className="text-[12px] font-medium text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Moderated reports
              </p>
            </div>
          </div>

          {/* Card 2: Registered Users Under Oversight */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
                Users Managed
              </span>
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                {isLoadingStats ? <Spinner size="sm" color="current" /> : adminStats.totalUsers}
              </h3>
              <p className="text-[12px] font-medium text-zinc-500 mt-2">
                Active community members
              </p>
            </div>
          </div>

          {/* Card 3: Total Curriculum Modules */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
                Total Lessons
              </span>
              <BookOpen className="w-5 h-5 text-[#0f766e]" />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                {isLoadingStats ? <Spinner size="sm" color="current" /> : adminStats.totalLessons}
              </h3>
              <p className="text-[12px] font-medium text-[#0f766e] dark:text-[#16A696] mt-2 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Platform curriculum
              </p>
            </div>
          </div>

          {/* Card 4: Official Lessons Created by Admin */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider">
                Admin Lessons
              </span>
              <Shield className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                {isLoadingStats ? <Spinner size="sm" color="current" /> : adminStats.myLessons}
              </h3>
              <p className="text-[12px] font-medium text-zinc-500 mt-2">
                Created by this account
              </p>
            </div>
          </div>

        </div>

        {/* Navigation Shortcuts for Admin Control */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link href="/dashboard/admin/reported-content">
            <Button className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 font-semibold text-[13px] rounded-xl cursor-pointer">
              Moderate Flagged Content
            </Button>
          </Link>
          <Link href="/dashboard/admin/manage-users">
            <Button className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 font-semibold text-[13px] rounded-xl cursor-pointer">
              User Permissions & Roles
            </Button>
          </Link>
          <Link href="/dashboard/admin/manage-lessons">
            <Button className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 font-semibold text-[13px] rounded-xl cursor-pointer">
              Curate Featured Lessons
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
}