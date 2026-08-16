"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, TextField, Label, InputGroup, Input } from "@heroui/react";
import { useForm } from "react-hook-form";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

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

const SpinnerIcon = () => (
  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Signing in...");

    // Send the data to your authClient
    const { data: signInData, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message || "Invalid email or password.", { id: toastId });
      console.error("Sign in error:", error);
    } else {
      toast.success("Signed in successfully!", { id: toastId });
      console.log("Sign in successful:", signInData);
      
      // Redirect the user after successful sign-in
      window.location.href = "/";
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8fafc] dark:bg-zinc-950 px-4 py-12 transition-colors duration-300">
      
      {/* Logo Outside Card */}
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

      {/* Auth Card - Matches SignUp structure perfectly */}
      <div className="w-full max-w-[440px] bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        
        {/* Top Header Area */}
        <div className="pt-8 pb-6 px-8 text-center border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-2xl font-bold text-[#1a202c] dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-[14px] text-zinc-600 dark:text-zinc-400">
            Sign in to continue your journey.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="p-8">
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
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

            {/* Password Input */}
            <TextField className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <Label className="text-[13px] font-bold text-[#1a202c] dark:text-zinc-100">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-[12px] font-semibold text-[#16A696] hover:text-[#0f8c7e] transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              
              <InputGroup
                className={`border ${errors.password ? "border-red-500" : "border-zinc-300 dark:border-zinc-700"} hover:border-[#16A696] focus-within:!border-[#16A696] rounded-md bg-transparent px-3 py-2 transition-colors`}
              >
                <InputGroup.Input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-transparent border-none outline-none w-full text-[14px]"
                  {...register("password", {
                    required: "Password is required",
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

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center bg-[#16A696] hover:bg-[#0f8c7e] text-white font-semibold text-[14px] py-2.5 mt-2 rounded-md transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon /> Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRightIcon />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            <span className="text-[11px] text-zinc-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
          </div>

          {/* Social Login Button */}
          <Button
            className="w-full flex items-center justify-center gap-2 bg-transparent border border-zinc-300 dark:border-zinc-700 text-[#1a202c] dark:text-white font-semibold text-[14px] py-2.5 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </div>

        {/* Footer Area with distinct background */}
        <div className="bg-[#f0f4f8] dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-800 p-6 text-center">
          <p className="text-[14px] text-zinc-600 dark:text-zinc-400 font-medium">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#16A696] hover:text-[#0f8c7e] font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
        
      </div>
    </main>
  );
}