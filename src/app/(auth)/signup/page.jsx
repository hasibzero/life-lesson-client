"use client";
import ImageWithSpinner from "@/components/ImageWithSpinner";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, TextField, Label, InputGroup, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";

// === Reusable SVGs ===

const GoogleIcon = () => (
  <svg
    className="w-5 h-5 min-w-[20px] min-h-[20px] flex-shrink-0"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const EyeFilledIcon = () => (
  <svg
    className="w-5 h-5 text-zinc-500 hover:text-zinc-700 transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeSlashFilledIcon = () => (
  <svg
    className="w-5 h-5 text-zinc-500 hover:text-zinc-700 transition-colors"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-8 h-8 text-zinc-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const CameraIcon = () => (
  <svg
    className="w-3.5 h-3.5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    className="w-4 h-4 ml-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const password = watch("password");

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating your account...");
    let uploadedImageUrl = "";

    // 1. Upload image if selected
    if (data.avatar && data.avatar.length > 0) {
      const formData = new FormData();
      formData.append("image", data.avatar[0]);

      try {
        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
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
          toast.error("Image upload failed.", { id: toastId });
          return;
        }
      } catch (error) {
        console.error("Image upload failed", error);
        toast.error("An error occurred during image upload.", { id: toastId });
        return;
      }
    }

    // 2. Format sanitized payload
    const { avatar, confirmPassword, terms, ...cleanData } = data;

    // 3. Register user with authClient
    const { error } = await authClient.signUp.email({
      ...cleanData,
      image: uploadedImageUrl,
    });

    if (error) {
      toast.error(
        error.message || "Failed to create account. Please try again.",
        {
          id: toastId,
        },
      );
      console.log("Sign up error:", error);
    } else {
      toast.success("Account created successfully!", { id: toastId });
      router.push("/");
    }
  };

  const handleGoogleSignIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-zinc-950 px-4 py-12 transition-colors duration-300">
      <Link href="/" className="mb-6">
        <Image
          src="/logo.png"
          alt="Digital Life Lessons"
          width={160}
          height={48}
          className="h-10 w-auto object-contain"
          priority
        />
      </Link>

      <div className="w-full max-w-[440px] bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="pt-8 pb-6 px-8 text-center border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-[#1a202c] dark:text-white mb-2">
            Create an Account
          </h1>
          <p className="text-[14px] text-zinc-600 dark:text-zinc-400">
            Start your journey of digital life lessons.
          </p>
        </div>

        <div className="p-8">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Avatar Upload */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="relative cursor-pointer group">
                <input
                  type="file"
                  className="hidden"
                  id="avatarUpload"
                  accept="image/*"
                  {...register("avatar", {
                    onChange: (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    },
                  })}
                />
                <label htmlFor="avatarUpload" className="cursor-pointer">
                  <div className="w-[72px] h-[72px] rounded-full border-[1.5px] border-dashed border-zinc-300 flex items-center justify-center bg-[#f8fafc] dark:bg-zinc-800 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 transition-colors overflow-hidden">
                    {avatarPreview ? (
                      <ImageWithSpinner width={500} height={500}
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 bg-[#16A696] rounded-full p-1 border-2 border-white dark:border-zinc-900">
                    <CameraIcon />
                  </div>
                </label>
              </div>
              <span className="text-[13px] font-bold text-[#1a202c] dark:text-white mt-3 mb-0.5">
                Profile Photo
              </span>
              <span className="text-[11px] text-zinc-500">
                Click to upload (optional)
              </span>
            </div>

            {/* Name Input */}
            <TextField className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-bold text-[#1a202c] dark:text-zinc-100">
                Full Name
              </Label>
              <Input
                type="text"
                placeholder="John Doe"
                className={`border ${errors.name ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} hover:border-[#16A696] focus-within:!border-[#16A696] rounded-md bg-transparent px-3 py-2 outline-none transition-colors text-[14px]`}
                {...register("name", { required: "Full name is required" })}
              />
              {errors.name && (
                <span className="text-red-500 text-[12px]">
                  {errors.name.message}
                </span>
              )}
            </TextField>

            {/* Email Input */}
            <TextField className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-bold text-[#1a202c] dark:text-zinc-100">
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className={`border ${errors.email ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} hover:border-[#16A696] focus-within:!border-[#16A696] rounded-md bg-transparent px-3 py-2 outline-none transition-colors text-[14px]`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <span className="text-red-500 text-[12px]">
                  {errors.email.message}
                </span>
              )}
            </TextField>

            {/* Password Input with Strict Validation */}
            <TextField className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-bold text-[#1a202c] dark:text-zinc-100">
                Password
              </Label>
              <InputGroup
                className={`border ${errors.password ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} hover:border-[#16A696] focus-within:!border-[#16A696] rounded-md bg-transparent px-3 py-2 transition-colors`}
              >
                <InputGroup.Input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none w-full text-[14px]"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    validate: {
                      hasUppercase: (value) =>
                        /[A-Z]/.test(value) ||
                        "Password must contain at least one uppercase letter",
                      hasLowercase: (value) =>
                        /[a-z]/.test(value) ||
                        "Password must contain at least one lowercase letter",
                    },
                  })}
                />
                <InputGroup.Suffix>
                  <div
                    className="cursor-pointer p-1 flex items-center justify-center"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  >
                    {isPasswordVisible ? (
                      <EyeSlashFilledIcon />
                    ) : (
                      <EyeFilledIcon />
                    )}
                  </div>
                </InputGroup.Suffix>
              </InputGroup>
              {errors.password && (
                <span className="text-red-500 text-[12px]">
                  {errors.password.message}
                </span>
              )}
            </TextField>

            {/* Confirm Password Input */}
            <TextField className="flex flex-col gap-1.5">
              <Label className="text-[13px] font-bold text-[#1a202c] dark:text-zinc-100">
                Confirm Password
              </Label>
              <InputGroup
                className={`border ${errors.confirmPassword ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} hover:border-[#16A696] focus-within:!border-[#16A696] rounded-md bg-transparent px-3 py-2 transition-colors`}
              >
                <InputGroup.Input
                  type={isConfirmVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none w-full text-[14px]"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <InputGroup.Suffix>
                  <div
                    className="cursor-pointer p-1 flex items-center justify-center"
                    onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                  >
                    {isConfirmVisible ? (
                      <EyeSlashFilledIcon />
                    ) : (
                      <EyeFilledIcon />
                    )}
                  </div>
                </InputGroup.Suffix>
              </InputGroup>
              {errors.confirmPassword && (
                <span className="text-red-500 text-[12px]">
                  {errors.confirmPassword.message}
                </span>
              )}
            </TextField>

            {/* Terms & Conditions Checkbox */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className={`mt-0.5 w-4 h-4 rounded ${errors.terms ? "border-red-500" : "border-zinc-300"} text-[#16A696] focus:ring-[#16A696]`}
                  {...register("terms", {
                    required: "You must accept the terms and conditions",
                  })}
                />
                <label
                  htmlFor="terms"
                  className="text-[12px] text-zinc-600 dark:text-zinc-400 leading-tight"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#16A696] hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#16A696] hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {errors.terms && (
                <span className="text-red-500 text-[12px]">
                  {errors.terms.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              className="w-full flex items-center justify-center bg-[#16A696] hover:bg-[#0f8c7e] text-white font-semibold text-[14px] py-2.5 mt-2 rounded-md transition-colors cursor-pointer"
            >
              Sign Up <ArrowRightIcon />
            </Button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-[11px] text-zinc-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <Button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-zinc-300 dark:border-zinc-700 text-[#1a202c] dark:text-white font-semibold text-[14px] py-2.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <GoogleIcon />
            Continue with Google
          </Button>
        </div>

        <div className="bg-[#f0f4f8] dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 p-6 text-center">
          <p className="text-[14px] text-zinc-600 dark:text-zinc-400 font-medium">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-[#16A696] hover:text-[#0f8c7e] font-semibold transition-colors"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
