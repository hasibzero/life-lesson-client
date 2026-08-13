"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Ensure the component is mounted on the client before rendering 
  // to avoid Next.js hydration mismatch errors
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render an empty placeholder of the exact same size (24px) to prevent layout shift
    return <div className="w-6 h-6"></div> 
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-500 transition-colors flex items-center justify-center focus:outline-none"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-6 h-6" strokeWidth={2} />
      ) : (
        <Moon className="w-6 h-6" strokeWidth={2} />
      )}
    </button>
  )
}