'use client';

import React, { useState, useRef } from 'react';
import { authClient } from '@/lib/auth-client';
import { Spinner } from '@heroui/react';
import toast from 'react-hot-toast';

export default function ProfileSettings() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [fullName, setFullName] = useState(user?.name || "");
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const fileInputRef = useRef(null);

  // Extract the first letter for the fallback avatar
  const initial = fullName ? fullName.charAt(0).toUpperCase() : '?';
  // Determine which image to show: Preview first, then DB image, then fallback
  const currentImage = avatarPreview !== null ? avatarPreview : user?.image;

  // 1. Handle Automatic Picture Upload to ImgBB and Database
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optimistically update the UI
    setAvatarPreview(URL.createObjectURL(file));
    setIsUploadingImage(true);
    const toastId = toast.loading("Uploading profile picture...");

    try {
      // Step A: Upload to ImgBB
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
        
        // Step B: Update user profile in database via better-auth
        const { error } = await authClient.updateUser({
          image: uploadedImageUrl
        });

        if (error) {
          toast.error(error.message || "Failed to save picture to database.", { id: toastId });
        } else {
          toast.success("Profile picture updated successfully!", { id: toastId });
        }
      } else {
        toast.error("Image upload to ImgBB failed.", { id: toastId });
      }
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("An error occurred during upload.", { id: toastId });
    } finally {
      setIsUploadingImage(false);
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 2. Handle Removing the Picture
  const handleRemovePicture = async () => {
    const toastId = toast.loading("Removing profile picture...");
    try {
      const { error } = await authClient.updateUser({
        image: "" // Clear the image in better-auth
      });

      if (error) {
        toast.error(error.message || "Failed to remove picture.", { id: toastId });
      } else {
        setAvatarPreview(""); // Clear local preview
        toast.success("Profile picture removed.", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred.", { id: toastId });
    }
  };

  // 3. Handle Saving Text Details (Full Name)
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Saving changes...");
    
    try {
      const { error } = await authClient.updateUser({
        name: fullName
      });

      if (error) {
        toast.error(error.message || "Failed to update profile details.", { id: toastId });
      } else {
        toast.success("Profile details updated successfully!", { id: toastId });
      }
    } catch (error) {
      toast.error("An error occurred while saving.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-4">
      
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#0d233a] dark:text-white tracking-tight mb-2">
          Profile Settings
        </h1>
        <p className="text-[15px] text-zinc-600 dark:text-zinc-400">
          Manage your public profile, account details, and security preferences.
        </p>
      </div>

      {/* Settings Card */}
      <form 
        onSubmit={handleSaveDetails}
        className="bg-white dark:bg-[#0c0c0e] border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm flex flex-col gap-8"
      >
        
        <h2 className="text-xl font-bold text-[#0d233a] dark:text-white">
          Public Profile
        </h2>

        {/* Avatar Upload Section */}
        <div className="flex items-center gap-6">
          
          <div className="relative">
            {currentImage ? (
              <img 
                src={currentImage} 
                alt="Profile Avatar" 
                className={`w-20 h-20 rounded-full object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm transition-opacity ${isUploadingImage ? 'opacity-50' : 'opacity-100'}`}
              />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#16A696] text-white text-3xl font-bold border border-zinc-200 dark:border-zinc-800 shadow-sm">
                {initial}
              </div>
            )}
            
            {/* Show a mini spinner overlay if the image is currently uploading */}
            {isUploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner size="sm" color="white" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/*"
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="px-4 py-2 text-[14px] font-semibold text-[#0d233a] dark:text-zinc-300 bg-white dark:bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Picture
            </button>
            <button 
              type="button"
              onClick={handleRemovePicture}
              disabled={!currentImage || isUploadingImage}
              className="text-[14px] font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-[#0d233a] dark:text-zinc-100">
            Full Name
          </label>
          <input 
            type="text" 
            defaultValue={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full max-w-md bg-transparent border border-zinc-300 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-[14px] text-zinc-900 dark:text-white outline-none focus:border-[#16A696] dark:focus:border-[#16A696] transition-colors"
            required
          />
        </div>

        {/* Save Button Section */}
        <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-800/50 flex justify-start">
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer px-6 py-2.5 bg-[#16A696] hover:bg-[#138f81] text-white font-semibold rounded-lg text-[14px] transition-colors disabled:opacity-70 flex items-center justify-center gap-2 min-w-[140px]"
          >
            {isSaving ? <Spinner size="sm" color="white" /> : "Save Changes"}
          </button>
        </div>

      </form>
    </div>
  );
}