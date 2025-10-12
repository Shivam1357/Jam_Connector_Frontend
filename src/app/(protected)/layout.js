// app/(protected)/layout.js
'use client'
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import Link from 'next/link';
import ProfilePictureImage from '@/components/ProfilePictureImage';
import Header from '@/components/Header';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const { showError } = useNotification();
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Use ref to track if we've already shown the notification
  const hasRedirected = useRef(false);

  // Redirect to login if not authenticated
   useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Get current URL including query parameters
      hasRedirected.current = true;

      const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
      
      // Show redirect message
      showError('Please log in to access this page. You will be redirected back after login.');
      
      // Redirect to login with return URL
      router.replace(`/login?returnUrl=${encodeURIComponent(currentUrl)}&redirected=true`);
    }
  }, [isAuthenticated, loading, router, pathname, searchParams, showError]);

  useEffect(() => {
    if (isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.push('/login')
  }


  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] flex items-center justify-center">
        <div className="text-center text-white">
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // Optional: Add common UI for all protected pages
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white">
      <Header 
        user={user}
        isLoggingOut={isLoggingOut}
        handleLogout={handleLogout}
        />
      {children}
      </div>
  );
}
