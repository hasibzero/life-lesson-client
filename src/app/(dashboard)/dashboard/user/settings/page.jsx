"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Spinner, Button } from "@heroui/react";
import toast from "react-hot-toast";
import {
  Star,
  Mail,
  User as UserIcon,
  BookOpen,
  Bookmark,
  Lock,
  Clock,
  ArrowRight,
  Camera,
  Trash2,
  Sparkles,
  PlusCircle,
  LoaderIcon,
} from "lucide-react";

export default function ProfileSettings() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const isPremiumUser = user?.role === "admin" || user?.plan === "premium";

  const [fullName, setFullName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Stats & Lessons state
  const [allMyLessons, setAllMyLessons] = useState([]);
  const [savedLessonsCount, setSavedLessonsCount] = useState(0);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);

  const fileInputRef = useRef(null);

  // Sync user profile name on session load
  useEffect(() => {
    if (user?.name) {
      setFullName(user.name);
    }
  }, [user?.name]);

  // Fetch User's Created Lessons and Saved Lessons
  useEffect(() => {
    const fetchUserData = async () => {

      
      if (!user?.id) return;
      const tokenRes = await authClient.token();
    const token = tokenRes?.data?.token;
    
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

        const [myLessonsRes, savedLessonsRes] = await Promise.all([
          fetch(`${backendUrl}/api/my-lessons/${user.id}`,{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch(`${backendUrl}/api/saved-lessons/${user.id}`,{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
        ]);

        if (myLessonsRes.ok) {
          const lessonsData = await myLessonsRes.json();
          setAllMyLessons(lessonsData);
        }

        if (savedLessonsRes.ok) {
          const savedData = await savedLessonsRes.json();
          setSavedLessonsCount(savedData.length || 0);
        }
      } catch (error) {
        console.error("Error fetching user profile stats:", error);
      } finally {
        setIsLoadingLessons(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const initial = fullName
    ? fullName.charAt(0).toUpperCase()
    : user?.name?.charAt(0).toUpperCase() || "?";
  const currentImage = avatarPreview !== null ? avatarPreview : user?.image;

  // Filter only public lessons created by this user, sorted newest first
  const publicLessons = allMyLessons
    .filter((lesson) => lesson.visibility === "Public")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
          image: uploadedImageUrl,
        });

        if (error) {
          toast.error(error.message || "Failed to save picture to database.", {
            id: toastId,
          });
        } else {
          toast.success("Profile picture updated successfully!", {
            id: toastId,
          });
        }
      } else {
        toast.error("Image upload to ImgBB failed.", { id: toastId });
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
        image: "",
      });

      if (error) {
        toast.error(error.message || "Failed to remove picture.", {
          id: toastId,
        });
      } else {
        setAvatarPreview("");
        toast.success("Profile picture removed.", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred.", { id: toastId });
    }
  };

  // 3. Handle Saving Text Details (Full Name)
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
        name: fullName,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile details.", {
          id: toastId,
        });
      } else {
        toast.success("Display name updated successfully!", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred while saving.", { id: toastId });
    } finally {
      setIsSaving(false);
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

  if (isLoadingLessons) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Spinner size="lg" color="current" className="text-[#0f766e]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 font-sans pb-16">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-extrabold text-[#1a202c] dark:text-white tracking-tight">
          Profile Settings
        </h1>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-400 mt-1">
          Manage your personal details, view account credentials, and inspect
          your published contributions.
        </p>
      </div>

      {/* Main Profile & Settings Card */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col gap-8">
        {/* Top Profile Strip & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800 gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
              Public Profile
            </h2>
            {isPremiumUser ? (
              <span className="inline-flex items-center gap-1.5 text-[12px] font-extrabold px-3.5 py-1.5 rounded-full bg-[#d9fffb] text-[#149788]  border border-amber-200/60 dark:border-amber-500/20 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-[#149788] text-[#149788]" />{" "}
                Premium
              </span>
            ) : (
              <span className="inline-flex items-center text-[12px] font-semibold px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                Free Tier
              </span>
            )}
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200/50 dark:border-teal-500/20 text-[#0f766e] dark:text-[#16A696] text-[13px] font-bold">
              <BookOpen className="w-4 h-4" />
              <span>{allMyLessons.length} Lessons Created</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-[13px] font-bold">
              <Bookmark className="w-4 h-4" />
              <span>{savedLessonsCount} Saved</span>
            </div>
          </div>
        </div>

        {/* Avatar Upload Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            {currentImage ? (
              <img
                src={currentImage}
                alt="Profile Avatar"
                className={`w-24 h-24 rounded-full object-cover border-2 border-zinc-200 dark:border-zinc-700 shadow-sm transition-opacity ${isUploadingImage ? "opacity-40" : "opacity-100"}`}
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
              JPG, PNG or GIF. Max dimensions 800x800px.
            </span>
          </div>
        </div>

        {/* Profile Inputs Form */}
        <form onSubmit={handleSaveDetails} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Display Name (Editable) */}
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-zinc-400" /> Display Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[#f9fafb] dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#0f766e] transition-colors"
                required
              />
            </div>

            {/* Email Address (Read-only / No editing allowed) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-zinc-700 dark:text-zinc-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-zinc-400" /> Email Address
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

          {/* Submit Button */}
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

      {/* Published Public Lessons Section */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              My Published Lessons
            </h2>
            <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Public modules contributed by you ({publicLessons.length})
            </p>
          </div>

          <Link
            href="/dashboard/user/add-lesson"
            className="bg-[#147062] hover:bg-[#0f594e] text-white font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 w-fit cursor-pointer text-[14px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Lesson</span>
          </Link>
        </div>

        {/* Public Lessons Grid */}
        {isLoadingLessons ? (
          <div className="w-full py-16 flex items-center justify-center">
            <Spinner size="lg" color="current" className="text-[#0f766e]" />
          </div>
        ) : publicLessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div className="relative w-full h-44 bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    {lesson.coverImage ? (
                      <img
                        src={lesson.coverImage}
                        alt={lesson.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-teal-500/10 to-[#0f766e]/20 text-[#0f766e]">
                        <BookOpen className="w-10 h-10 opacity-70" />
                      </div>
                    )}

                    {/* Access Level Badge */}
                    {lesson.accessLevel === "Premium" ? (
                      <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                        <Lock className="w-3 h-3" /> Premium
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-md text-zinc-200 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                        Free
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400">
                        {lesson.category || "General"}
                      </span>
                      <span className="text-[12px] text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />{" "}
                        {formatDate(lesson.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-[17px] font-bold text-zinc-900 dark:text-white line-clamp-1 group-hover:text-[#0f766e] dark:group-hover:text-[#16A696] transition-colors">
                      {lesson.title}
                    </h3>

                    <p className="text-[13px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {lesson.description || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[12px] font-medium text-zinc-500">
                    {lesson.likesCount || 0} Likes •{" "}
                    {lesson.savedBy?.length || 0} Saves
                  </span>

                  <Link
                    className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold rounded-xl text-[12px] flex items-center gap-1 cursor-pointer px-3 py-1.5 transition-colors"
                    href={`/lessons/${lesson._id}`}
                  >
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
              No Public Lessons Yet
            </h3>
            <p className="text-[14px] text-zinc-500 dark:text-zinc-400 max-w-sm mb-6">
              You haven't published any public modules yet. Create a lesson to
              share your knowledge with the platform.
            </p>
            <Link href="/dashboard/user/add-lesson">
              <Button className="bg-[#0f766e] hover:bg-[#0d6e63] text-white font-semibold px-5 py-2 rounded-xl transition-colors shadow-sm cursor-pointer">
                Create First Lesson
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
