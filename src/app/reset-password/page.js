// app/reset-password/page.js
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNotification } from '@/contexts/NotificationContext';
import { authService } from '@/services/authService';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess, showInfo } = useNotification();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidToken, setIsValidToken] = useState(null);
  const [tokenValidating, setTokenValidating] = useState(true);

  const token = searchParams.get('token');

  // Validate token on page load
  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      setIsValidToken(false);
      setTokenValidating(false);
      return;
    }

    validateResetToken();
  }, [token]);

  const validateResetToken = async () => {
    try {
      setTokenValidating(true);
      const result = await authService.validateResetToken({ token });
      
      if (result.data && result.data.valid) {
        setIsValidToken(true);
        showInfo('Please enter your new password below.');
      } else {
        setIsValidToken(false);
        setError('This reset link has expired or is invalid. Please request a new password reset.');
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setIsValidToken(false);
      setError('This reset link has expired or is invalid. Please request a new password reset.');
    } finally {
      setTokenValidating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.resetPassword({
        token,
        password: formData.password
      });
      
      if (result.data) {
        showSuccess('Password reset successfully! You can now log in with your new password.');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while validating token
  if (tokenValidating) {
    return (
      <div className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Validating reset link...</p>
        </div>
      </div>
    );
  }

  return (
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
            {isValidToken ? 'Reset Password' : 'Invalid Link'}
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold mb-2 text-gray-200">
            {isValidToken ? '🔐' : '❌'}
          </h3>
          <p className="text-gray-400">
            {isValidToken ? 'Enter your new password below' : 'Please request a new password reset'}
          </p>
        </div>

        <div className="bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
          {isValidToken ? (
            /* Reset Password Form */
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your new password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Requirements */}
              <div className="text-sm text-gray-400 bg-blue-500/10 border border-blue-500/30 rounded-xl p-3">
                <p className="font-medium text-blue-300 mb-2">Password Requirements:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li className={formData.password.length >= 8 ? 'text-green-400' : 'text-gray-400'}>
                    At least 8 characters
                  </li>
                  <li className={formData.password === formData.confirmPassword && formData.password ? 'text-green-400' : 'text-gray-400'}>
                    Passwords match
                  </li>
                </ul>
              </div>

              {/* Reset Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl text-lg transition-all duration-300 transform ${
                  !isLoading ? 'hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50' : ''
                } ${
                  isLoading 
                    ? 'opacity-50 cursor-not-allowed transform-none' 
                    : 'opacity-100 cursor-pointer'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Resetting Password...
                  </div>
                ) : (
                  '🔐 Reset Password'
                )}
              </button>
            </form>
          ) : (
            /* Invalid Token Message */
            <div className="text-center space-y-4">
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
                {error}
              </div>
              
              <Link
                href="/login"
                className="inline-block w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 text-center"
              >
                🎸 Back to Login
              </Link>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-400">
              Remember your password?{" "}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-semibold hover:underline transition-colors duration-300">
                Back to Login
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="text-center mt-6">
          <div className="flex justify-center items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Secure Reset</span>
            </div>
            <div className="w-px h-4 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span>1-Hour Expiry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
