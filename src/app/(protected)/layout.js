// app/(protected)/layout.js
'use client'
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import Link from 'next/link';
import ProfilePictureImage from '@/components/ProfilePictureImage';

export default function ProtectedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, loading } = useAuth();
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
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
                JamConnect
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Link
                  href="/profile"
                  className="group relative cursor-pointer"
                >
                  {/* <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-sm font-bold group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300 group-hover:scale-105">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div> */}
                  <ProfilePictureImage
                    publicId={user.profilePictureId}
                    name={user.name}
                    size="sm"
                    alt="Profile Picture"
                  />
                </Link>
                <span className="text-sm text-gray-300">
                  {user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </header>
      {children}
      </div>
  );
}
