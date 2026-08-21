"use client";
import ImageWithSpinner from "@/components/ImageWithSpinner";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { UploadCloud, Save, ArrowUpFromLine, AlertCircle } from "lucide-react";
import { Spinner, Tooltip } from "@heroui/react";
import Link from "next/link";

export default function AddLesson() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [accessLevel, setAccessLevel] = useState("Free");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitType, setSubmitType] = useState(null);

  const [userLessonCount, setUserLessonCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  const actionRef = useRef("publish");

  const { data: session } = authClient.useSession();
  const user = session?.user;

  // 👈 CHANGED: Case-insensitive check for user role / plan
  const userRole = user?.role?.toLowerCase();
  const userPlan = user?.plan?.toLowerCase();
  const isPremiumUser =
    userRole === "admin" || userPlan === "premium" || Boolean(user?.isPremium);
  const hasReachedLimit = !isPremiumUser && userLessonCount >= 3;

  useEffect(() => {
    const fetchLessonCount = async () => {
      if (!user?.id) return;
      try {
        const rawBackendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        // 👈 CHANGED: Stripped trailing slash from backend URL
        const backendUrl = rawBackendUrl.replace(/\/$/, "");
        const response = await fetch(`${backendUrl}/api/my-lessons/${user.id}`);

        if (response.ok) {
          const data = await response.json();
          setUserLessonCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error("Error fetching lesson count:", error);
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchLessonCount();
  }, [user?.id]);

  // Ensure non-premium users are always defaulted to Free
  useEffect(() => {
    if (!isPremiumUser) {
      setAccessLevel("Free");
    }
  }, [isPremiumUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    if (hasReachedLimit) {
      toast.error(
        "Free tier limit reached. Please upgrade to Pro to add more lessons.",
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitType(actionRef.current);
    const toastId = toast.loading(
      actionRef.current === "draft"
        ? "Saving draft..."
        : "Submitting lesson for review...",
    );

    const tokenRes = await authClient.token();
    const token = tokenRes?.data?.token;
    let uploadedImageUrl = "";

    // 👈 CHANGED: Robust ImgBB upload with explicit API key verification and error details
    if (data.coverImage && data.coverImage.length > 0) {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

      // Check if API key exists before attempting upload
      if (!apiKey) {
        console.error(
          "Missing NEXT_PUBLIC_IMGBB_API_KEY environment variable.",
        );
        toast.error("ImgBB API key is missing. Check your .env file.", {
          id: toastId,
        });
        setIsSubmitting(false);
        setSubmitType(null);
        return;
      }

      const formData = new FormData();
      formData.append("image", data.coverImage[0]);

      try {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${apiKey}`,
          {
            method: "POST",
            body: formData,
          },
        );

        const imgData = await res.json();

        if (imgData.success) {
          uploadedImageUrl = imgData.data.url;
        } else {
          // 👈 CHANGED: Shows the actual reason from ImgBB (e.g. invalid key, unsupported file)
          console.error("ImgBB upload error response:", imgData);
          const detailedMsg = imgData?.error?.message || "Image upload failed.";
          toast.error(`Upload error: ${detailedMsg}`, { id: toastId });
          setIsSubmitting(false);
          setSubmitType(null);
          return;
        }
      } catch (error) {
        console.error("Image upload network error:", error);
        toast.error("Failed to connect to ImgBB upload server.", {
          id: toastId,
        });
        setIsSubmitting(false);
        setSubmitType(null);
        return;
      }
    }

    const lessonPayload = {
      title: data.title?.trim(),
      description: data.description?.trim(),
      category: data.category,
      emotionalTone: data.emotionalTone || "Motivational",
      visibility: actionRef.current === "draft" ? "Draft" : "Public",
      accessLevel: isPremiumUser ? accessLevel : "Free",
      creatorId: user?.id || null,
      coverImage: uploadedImageUrl,
      likes: [],
      likesCount: 0,
      isFeatured: false,
      isReviewed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const rawBackendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const backendUrl = rawBackendUrl.replace(/\/$/, "");

    try {
      const headers = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${backendUrl}/api/add-lesson`, {
        method: "POST",
        headers,
        body: JSON.stringify(lessonPayload),
      });

      if (response.ok) {
        const successMessage =
          actionRef.current === "draft"
            ? "Lesson successfully saved as draft!"
            : "Lesson submitted for review!";

        toast.success(successMessage, { id: toastId });
        setUserLessonCount((prev) => prev + 1);

        reset();
        setImagePreview(null);
        setAccessLevel("Free");
      } else {
        // 👈 CHANGED: Captures and displays exact error message returned by backend
        const errData = await response.json().catch(() => ({}));
        toast.error(errData.message || "Failed to save lesson.", {
          id: toastId,
        });
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
    <div className="max-w-5xl mx-auto w-full font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1a202c] dark:text-white tracking-tight mb-2">
          Add New Lesson
        </h1>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-400">
          Create and publish new curated wisdom for the platform.
        </p>
      </div>

      <form
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
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
              disabled={hasReachedLimit}
              className={`w-full bg-transparent border ${errors.title ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} rounded-lg px-4 py-3 text-[15px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] dark:focus:border-[#16A696] transition-colors disabled:opacity-50`}
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.title.message}
              </span>
            )}
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
              disabled={hasReachedLimit}
              className={`w-full bg-transparent border ${errors.description ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} rounded-lg px-4 py-3 text-[15px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] dark:focus:border-[#16A696] transition-colors resize-none disabled:opacity-50`}
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
            {errors.description && (
              <span className="text-red-500 text-xs mt-1 block">
                {errors.description.message}
              </span>
            )}
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
                disabled={hasReachedLimit}
                {...register("coverImage", { onChange: handleImageChange })}
              />
              <label
                htmlFor="coverUpload"
                className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-[#16A696] dark:hover:border-[#16A696] rounded-xl bg-zinc-50 dark:bg-[#121214] transition-colors overflow-hidden group ${hasReachedLimit ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
              >
                {imagePreview ? (
                  <ImageWithSpinner
                    width={500}
                    height={500}
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <UploadCloud className="w-8 h-8 text-zinc-400 mb-3" />
                    <p className="text-[14px] text-zinc-600 dark:text-zinc-300">
                      <span className="text-[#16A696] font-semibold">
                        Click to upload
                      </span>{" "}
                      or drag and drop
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
                  disabled={hasReachedLimit}
                  className={`w-full appearance-none bg-transparent border ${errors.category ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] transition-colors disabled:opacity-50 ${hasReachedLimit ? "cursor-not-allowed" : "cursor-pointer"}`}
                  {...register("category", {
                    required: "Category is required",
                  })}
                  defaultValue=""
                >
                  <option value="" disabled className="dark:bg-zinc-900">
                    Select a category...
                  </option>
                  <option value="Personal Growth" className="dark:bg-zinc-900">
                    Personal Growth
                  </option>
                  <option value="Career" className="dark:bg-zinc-900">
                    Career
                  </option>
                  <option value="Philosophy" className="dark:bg-zinc-900">
                    Philosophy
                  </option>
                  <option value="Productivity" className="dark:bg-zinc-900">
                    Productivity
                  </option>
                  <option value="Wealth" className="dark:bg-zinc-900">
                    Wealth
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.category && (
                <span className="text-red-500 text-xs mt-1 block">
                  {errors.category.message}
                </span>
              )}
            </div>

            {/* Emotional Tone */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Emotional Tone
              </label>
              <div className="relative">
                <select
                  disabled={hasReachedLimit}
                  className={`w-full appearance-none bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] transition-colors disabled:opacity-50 ${hasReachedLimit ? "cursor-not-allowed" : "cursor-pointer"}`}
                  {...register("emotionalTone")}
                  defaultValue="Motivational"
                >
                  <option value="Motivational" className="dark:bg-zinc-900">
                    Motivational
                  </option>
                  <option value="Realization" className="dark:bg-zinc-900">
                    Realization
                  </option>
                  <option value="Calm" className="dark:bg-zinc-900">
                    Calm
                  </option>
                  <option value="Energetic" className="dark:bg-zinc-900">
                    Energetic
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Access Level Dropdown with Tooltip for Free Users */}
            <div>
              <label className="block text-[13px] font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Access Level
              </label>
              <Tooltip
                content="Upgrade to Premium to create paid lessons."
                isDisabled={isPremiumUser}
                placement="top"
                className="text-xs bg-zinc-900 text-white dark:bg-zinc-800 px-3 py-1.5 rounded-lg shadow-lg border border-zinc-700"
              >
                <div className="relative">
                  <select
                    value={accessLevel}
                    onChange={(e) => setAccessLevel(e.target.value)}
                    disabled={hasReachedLimit || !isPremiumUser}
                    className={`w-full appearance-none bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] transition-colors ${
                      !isPremiumUser || hasReachedLimit
                        ? "cursor-not-allowed opacity-60 bg-zinc-100/50 dark:bg-zinc-900/50"
                        : "cursor-pointer"
                    }`}
                  >
                    <option value="Free" className="dark:bg-zinc-900">
                      Free
                    </option>
                    <option
                      value="Premium"
                      disabled={!isPremiumUser}
                      className="dark:bg-zinc-900"
                    >
                      Premium {!isPremiumUser ? "(Locked)" : ""}
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-zinc-500">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </Tooltip>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-2 leading-tight">
                {isPremiumUser
                  ? "Premium lessons are restricted to paid platform subscribers."
                  : "Upgrade to Premium to create paid lessons."}
              </p>
            </div>
          </div>

          {/* Action Buttons Card */}
          <div className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-3">
            {/* Limit Warning UI */}
            {!isLoadingCount && !isPremiumUser && (
              <div className="mb-2 p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-1 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
                  <span>Usage Limit</span>
                  <span
                    className={
                      userLessonCount >= 3 ? "text-red-500" : "text-[#16A696]"
                    }
                  >
                    {userLessonCount}/3 Lessons
                  </span>
                </div>
                {hasReachedLimit && (
                  <div className="flex items-start gap-2 mt-2 text-red-600 dark:text-red-400 text-[12px] leading-tight">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>
                      You've reached your free limit.{" "}
                      <Link
                        href="/pricing"
                        className="underline font-bold hover:text-red-700 dark:hover:text-red-300"
                      >
                        Upgrade to Pro
                      </Link>{" "}
                      to add more.
                    </span>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || hasReachedLimit || isLoadingCount}
              onClick={() => (actionRef.current = "draft")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-[14px] hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting && submitType === "draft" ? (
                <Spinner size="sm" color="current" />
              ) : (
                <>
                  <Save className="w-4 h-4 text-[#5b32a8] dark:text-[#8b5cf6]" />{" "}
                  Save Draft
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={isSubmitting || hasReachedLimit || isLoadingCount}
              onClick={() => (actionRef.current = "publish")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#0d6e63] hover:bg-[#0a574e] text-white font-semibold text-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting && submitType === "publish" ? (
                <Spinner size="sm" color="white" />
              ) : (
                <>
                  <ArrowUpFromLine className="w-4 h-4" /> Submit for Review
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
