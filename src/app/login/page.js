// src/app/login/page.js
'use client';
export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNotification } from '@/contexts/NotificationContext';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, googleLoginBackend, forgotPassword, isAuthenticated, loading } = useAuth();
   const { showInfo, showError } = useNotification();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sendingPasswordReset, setSendingPasswordReset] = useState(false);

  // Get return URL and redirect info from query parameters
  const returnUrl = searchParams.get('returnUrl');
  const wasRedirected = searchParams.get('redirected');

  useEffect(() => {
  if (wasRedirected && returnUrl) {
    const decodedUrl = decodeURIComponent(returnUrl);
    // showInfo(`You were redirected from: ${decodedUrl}. Please log in to continue.`);
  }
  }, [wasRedirected, returnUrl, showInfo]);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const redirectTo = returnUrl ? decodeURIComponent(returnUrl) : '/dashboard';
      
      // if (returnUrl) {
      //   showInfo(`Welcome back! Redirecting you to your requested page...`);
      // }
      
      router.replace(redirectTo);
    }
  }, [isAuthenticated, loading, router, returnUrl, showInfo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Call login from AuthContext
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect will happen automatically via useEffect
        // console.log('Login successful');
      } else {
        setError(result.error);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

   // Handle Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await googleLoginBackend(credentialResponse.credential);
      
      if (result.success) {
        // console.log('Google login successful');
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
   // Handle Google login error
  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };


  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setSendingPasswordReset(true);
      setError('');
      
      const result = await forgotPassword({ email: formData.email });
      
      // if (result.data) {
        showInfo(`Password reset email sent to ${formData.email}. Please check your inbox.`);
      // }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setSendingPasswordReset(false);
    }
  };

  // Show loading while checking auth status
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <div className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white min-h-screen flex flex-col justify-center items-center px-5 font-sans relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              Welcome Back!
            </h2>
            <h3 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-200">
              Champ 🎵
            </h3>
            <p className="text-gray-400">Ready to jam with your tribe?</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                />

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                />
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className={[
                    'text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors duration-300 bg-transparent border-none',
                    !sendingPasswordReset ? 'cursor-pointer hover:underline text-orange-200' : ''
                  ].join(' ')}>
                  {!sendingPasswordReset ? "Forgot Password?" : "Sending reset email!"}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading || sendingPasswordReset}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading && (!sendingPasswordReset) ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Logging in...
                  </div>
                ) : (
                  '🎸 Let\'s Jam!'
                )}
              </button>
            </form>

            {/* Social Login Options */}
            <div className="mt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
                <span className="text-gray-400 text-sm">or continue with</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
              </div>

              <div className="grid gap-3">
                {/* Updated Google Login Button */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="filled_blue"
                    size="large"
                    shape="rectangular"
                    logo_alignment="left"
                    width="100%"
                  />
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-gray-400">
                New here?{" "}
                <Link href="/signup" className="text-orange-400 hover:text-orange-300 font-semibold hover:underline transition-colors duration-300">
                  Join the Tribe
                </Link>
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="text-center mt-6">
            <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span>24/7 Jam Sessions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}