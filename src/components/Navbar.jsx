// components/Navbar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { authClient } from '@/lib/auth-client';
import { ChevronDown } from 'lucide-react';
import { 
  Dropdown, 
  Button,
  Avatar, 
  Spinner 
} from '@heroui/react';

const THEME_TEAL = '#149788';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Determine the correct dashboard link based on role
  const dashboardLink = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/user';

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsMobileMenuOpen(false);
          router.push('/signin');
        },
      },
    });
  };

  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="w-full h-20 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300 relative z-50">
      <div className="max-w-[1920px] mx-auto h-full px-6 lg:px-12 flex items-center justify-between">
        
        {/* === Logo Section === */}
        <Link 
          href="/" 
          className="flex items-center gap-3 text-[#2D3748] dark:text-zinc-50 hover:opacity-90 transition-opacity z-50 shrink-0"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image 
            src="/logo.png" 
            alt="Digital Life Lessons Logo" 
            width={120} 
            height={120} 
            className="rounded-lg object-contain w-auto h-auto max-h-12"
            priority
          />
        </Link>

        {/* === Desktop Navigation Section === */}
        <div className="hidden lg:flex items-center gap-8">
          <div className="flex items-center gap-8">
            <Link href="/lessons" className="text-xl font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900 transition-colors">
              Lessons
            </Link>
            <Link href="/about" className="text-xl font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900 transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-xl font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900 transition-colors">
              Pricing
            </Link>
          </div>

          <div className="ml-2 flex items-center">
            <ThemeToggle />
          </div>

          <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

          {/* === Desktop Auth Controls === */}
          <div className="flex items-center justify-end min-w-[220px]">
            {isPending ? (
              <div className="flex w-full justify-end pr-4">
                <Spinner size="sm" color="default" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-4">
                {/* Standalone Dashboard Button with dynamic link */}
                <Link 
                  href={dashboardLink} 
                  className="text-lg font-semibold text-white px-6 py-2 rounded-xl transition-all hover:brightness-110 whitespace-nowrap shadow-sm"
                  style={{ backgroundColor: THEME_TEAL }}
                >
                  Dashboard
                </Link>
                
                {/* Clean Dropdown Structure */}
                <Dropdown>
                  <Button 
                    aria-label="Profile Menu" 
                    variant="light" 
                    className="h-12 px-2 min-w-0 flex items-center gap-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                  >
                    <Avatar className="w-9 h-9 bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold border border-zinc-300 dark:border-zinc-600">
                      <Avatar.Image src={user.image || ""} alt={user.name || "Profile"} />
                      <Avatar.Fallback>
                        {getUserInitial(user.name)}
                      </Avatar.Fallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                  </Button>

                  <Dropdown.Popover placement="bottom end">
                    <Dropdown.Menu 
                      aria-label="User Actions"
                      onAction={(key) => {
                        if (key === 'dashboard') router.push(dashboardLink);
                        if (key === 'profile') router.push('/profile');
                        if (key === 'logout') handleSignOut();
                      }}
                    >
                      <Dropdown.Item id="user-info" textValue="Signed in user" className="h-14 opacity-100 cursor-default">
                        <div className="flex flex-col items-start w-full">
                          <span className="text-xs font-semibold text-zinc-500">Signed in as</span>
                          <span className="text-sm font-bold text-zinc-900 dark:text-white truncate max-w-[200px]">{user.email}</span>
                        </div>
                      </Dropdown.Item>

                      <Dropdown.Item id="dashboard" textValue="Dashboard">
                        Dashboard
                      </Dropdown.Item>
                      
                      <Dropdown.Item id="profile" textValue="Profile">
                        Profile
                      </Dropdown.Item>
                      
                      <Dropdown.Item id="logout" textValue="Log Out" variant="danger" className="text-danger">
                        Log Out
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>

              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/signin" className="text-xl font-semibold text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900 transition-colors whitespace-nowrap">
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="text-xl font-semibold text-white px-7 py-2.5 rounded-xl transition-all hover:brightness-110 whitespace-nowrap"
                  style={{ backgroundColor: THEME_TEAL }}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* === Mobile Controls === */}
        <div className="flex lg:hidden items-center gap-4 z-50">
          <ThemeToggle />
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* === Mobile Menu Dropdown === */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 px-6 py-8 flex flex-col gap-6 lg:hidden shadow-xl animate-in slide-in-from-top-2 fade-in duration-200">
          
          <div className="flex flex-col gap-6 text-center">
            <Link 
              href="/lessons" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900"
            >
              Lessons
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900"
            >
              About
            </Link>
            <Link 
              href="/pricing" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-[#2D3748] dark:text-zinc-50 hover:text-zinc-900"
            >
              Pricing
            </Link>
          </div>

          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-2" />

          <div className="flex flex-col gap-4">
            {isPending ? (
              <div className="flex justify-center py-4">
                <Spinner size="md" color="default" />
              </div>
            ) : user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <Avatar className="w-12 h-12 min-w-[48px] bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold text-lg border border-zinc-300 dark:border-zinc-600">
                    <Avatar.Image src={user.image || ""} alt={user.name || "Profile"} />
                    <Avatar.Fallback>
                      {getUserInitial(user.name)}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col text-left overflow-hidden">
                    <span className="text-sm font-bold text-zinc-900 dark:text-white leading-tight truncate w-full">
                      {user.name}
                    </span>
                    <span className="text-xs text-zinc-500 truncate w-full">
                      {user.email}
                    </span>
                  </div>
                </div>

                {/* Mobile dashboard button with dynamic link */}
                <Link 
                  href={dashboardLink} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-lg font-semibold text-white rounded-xl transition-all shadow-sm hover:brightness-110"
                  style={{ backgroundColor: THEME_TEAL }}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/profile" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-lg font-semibold text-[#2D3748] dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-colors border border-zinc-200 dark:border-zinc-800"
                >
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="w-full text-center py-3 text-lg font-semibold text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors border border-red-200 dark:border-red-900"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/signin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-lg font-semibold text-[#2D3748] dark:text-zinc-50 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-xl transition-colors border border-zinc-200 dark:border-zinc-800"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center text-lg font-semibold text-white py-3 rounded-xl transition-all hover:brightness-110 shadow-sm"
                  style={{ backgroundColor: THEME_TEAL }}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

        </div>
      )}
    </nav>
  );
}