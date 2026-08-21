// components/Navbar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { authClient } from '@/lib/auth-client';
import { 
  ChevronDown, 
  Menu, 
  X, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { 
  Dropdown, 
  Button,
  Avatar, 
  Spinner 
} from '@heroui/react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isPremiumUser = user?.role === 'admin' || user?.plan === 'premium' || user?.isPremium;

  const dashboardLink = user?.role === 'admin' ? '/dashboard/admin/overview' : '/dashboard/user/overview';
  const settingsLink = user?.role === 'admin' ? '/dashboard/admin/settings' : '/dashboard/user/settings';

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

  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  // Removed the 'user &&' check so logged-out users can see Pricing
  const navLinks = [
    { label: 'Lessons', href: '/lessons' },
    { label: 'About', href: '/about' },
    ...(!isPremiumUser ? [{ label: 'Pricing', href: '/pricing' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80 transition-all duration-300 font-sans">
      <div className="max-w-[1200px] mx-auto h-full px-4 sm:px-6 lg:px-12 flex items-center justify-between">
        
        {/* === Logo Section === */}
        <Link 
          href="/" 
          className="flex items-center gap-3 group shrink-0"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="relative flex items-center justify-center p-1 rounded-xl group-hover:scale-[1.02] transition-transform">
            <Image 
              src="/logo.png" 
              alt="Digital Life Lessons Logo" 
              width={120} 
              height={48} 
              className="object-contain w-auto h-10 sm:h-12 dark:brightness-110"
              priority
            />
          </div>
        </Link>

        {/* === Desktop Navigation === */}
        <div className="hidden lg:flex items-center gap-8 h-full">
          <div className="flex items-center gap-2 h-full">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative h-full flex items-center px-4 text-[15px] font-medium transition-colors ${
                    active
                      ? 'text-[#0f766e] dark:text-[#16A696]'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-[#0f766e] dark:bg-[#16A696] rounded-t-full shadow-[0_-2px_6px_rgba(15,118,110,0.4)]" />
                  )}
                </Link>
              );
            })}

            {/* Premium Badge */}
            {user && isPremiumUser && (
              <div className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200/50 dark:border-teal-500/20 text-[#0f766e] dark:text-[#16A696] text-[12px] font-bold tracking-wide shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pro Member</span>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />

          {/* === Desktop Auth Controls === */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isPending ? (
              <div className="w-10 h-10 flex items-center justify-center">
                <Spinner size="sm" color="current" className="text-[#0f766e]" />
              </div>
            ) : user ? (
              <div className="flex items-center gap-3">
                <Link 
                  href={dashboardLink} 
                  className="text-[14px] font-bold text-white px-5 py-2.5 rounded-xl transition-all duration-200 bg-[#0f766e] hover:bg-[#0d6e63] shadow-sm hover:shadow-md hover:shadow-teal-500/20 active:scale-[0.98]"
                >
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <Dropdown>
                  <Button 
                    aria-label="Profile Menu" 
                    variant="light" 
                    className="group h-12 px-2 min-w-0 flex items-center gap-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-all cursor-pointer border border-transparent dark:hover:border-zinc-700"
                  >
                    <Avatar className="w-8 h-8 ring-2 ring-transparent group-hover:ring-[#0f766e]/30 transition-all text-xs font-bold">
                      <Avatar.Image src={user.image || ''} alt={user.name || 'User'} />
                      <Avatar.Fallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        {getUserInitial(user.name)}
                      </Avatar.Fallback>
                    </Avatar>
                    <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-transform group-data-[open=true]:rotate-180" />
                  </Button>

                  <Dropdown.Popover placement="bottom end" className="dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-2xl p-1 min-w-[220px]">
                    <Dropdown.Menu 
                      aria-label="User Actions"
                      onAction={(key) => {
                        if (key === 'dashboard') router.push(dashboardLink);
                        if (key === 'profile') router.push(settingsLink);
                        if (key === 'logout') handleSignOut();
                      }}
                    >
                      <Dropdown.Item id="user-info" textValue="Signed in user" className="h-16 opacity-100 cursor-default hover:bg-transparent data-[hover=true]:bg-transparent pb-3 mb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                        <div className="flex flex-col items-start w-full gap-0.5">
                          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Signed in as</span>
                          <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 truncate w-full">{user.email}</span>
                        </div>
                      </Dropdown.Item>

                      <Dropdown.Item id="dashboard" textValue="Dashboard" className="rounded-xl text-[14px] font-medium text-zinc-700 dark:text-zinc-300 py-2.5">
                        <div className="flex items-center gap-2">
                           <LayoutDashboard className="w-4 h-4 text-zinc-500" /> Dashboard
                        </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Item id="profile" textValue="Profile" className="rounded-xl text-[14px] font-medium text-zinc-700 dark:text-zinc-300 py-2.5">
                        <div className="flex items-center gap-2">
                           <Settings className="w-4 h-4 text-zinc-500" /> Profile & Settings
                        </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Item id="logout" textValue="Log Out" variant="danger" className="text-red-600 dark:text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/10 rounded-xl py-2.5 mt-1 font-medium">
                        <div className="flex items-center gap-2">
                           <LogOut className="w-4 h-4" /> Log Out
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/signin" 
                  className="text-[14px] font-bold text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white px-4 py-2.5 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="text-[14px] font-bold text-white px-5 py-2.5 rounded-xl transition-all duration-200 bg-[#0f766e] hover:bg-[#0d6e63] shadow-sm hover:shadow-md hover:shadow-teal-500/20 active:scale-[0.98]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* === Mobile Hamburger Toggle === */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* === Mobile Drawer Menu === */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-6 py-6 flex flex-col gap-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3.5 px-4 rounded-xl text-[15px] transition-all ${
                    active 
                      ? 'bg-[#e6f4f2] text-[#0f766e] dark:bg-[#0f766e]/10 dark:text-[#16A696] font-bold border border-[#b2dfdb] dark:border-[#0f766e]/30' 
                      : 'text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  {link.label}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#0f766e] dark:bg-[#16A696]" />}
                </Link>
              );
            })}

            {user && isPremiumUser && (
              <div className="mt-2 flex items-center gap-2 px-4 py-3 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-[#0f766e] dark:text-[#16A696] text-[13px] font-bold border border-teal-200/50 dark:border-teal-500/20">
                <Sparkles className="w-4 h-4" />
                <span>Active Pro Subscription</span>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />

          {/* Mobile User Section */}
          <div className="flex flex-col gap-3">
            {isPending ? (
              <div className="flex justify-center py-4">
                <Spinner size="md" color="current" className="text-[#0f766e]" />
              </div>
            ) : user ? (
              <>
                <div className="flex items-center gap-3 p-3.5 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                  <Avatar className="w-10 h-10 text-sm font-bold shrink-0">
                    <Avatar.Image src={user.image || ''} alt={user.name || 'User'} />
                    <Avatar.Fallback className="bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {getUserInitial(user.name)}
                    </Avatar.Fallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden text-left">
                    <span className="text-[14px] font-bold text-zinc-900 dark:text-zinc-100 truncate leading-tight">
                      {user.name}
                    </span>
                    <span className="text-[12px] font-medium text-zinc-500 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Link 
                    href={dashboardLink} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 text-[14px] font-bold text-white rounded-xl bg-[#0f766e] hover:bg-[#0d6e63] transition-colors shadow-xs"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                  <Link 
                    href={settingsLink} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 text-[14px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                </div>

                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 py-3 text-[14px] font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl border border-red-200 dark:border-red-900/50 transition-colors mt-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link 
                  href="/signin" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-[14px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center py-3 text-[14px] font-bold text-white rounded-xl bg-[#0f766e] hover:bg-[#0d6e63] transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}