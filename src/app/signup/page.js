// src/app/signup/page.js
'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, isAuthenticated, loading } = useAuth();
  const [userType, setUserType] = useState('MUSICIAN');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'MUSICIAN'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  // Get user type from URL parameter
  useEffect(() => {
    const type = searchParams.get('type');
    const selectedType = type === 'listener' ? 'LISTENER' : 'MUSICIAN';
    setUserType(selectedType);
    setFormData(prev => ({ ...prev, role: selectedType }));
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleUserTypeToggle = (type) => {
    setUserType(type);
    setFormData(prev => ({ ...prev, role: type }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Frontend validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (formData.phoneNumber && !formData.phoneNumber.match(/^\+?[\d\s\-\(\)]+$/)) {
      setError('Please enter a valid phone number');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for backend (remove confirmPassword)
      const registerData = {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role: formData.role
      };

      // Call register from AuthContext
      const result = await register(registerData);
      
      if (result.success) {
        // Registration successful, redirect will happen automatically via useEffect
        console.log('Registration successful');
      } else {
        setError(result.error);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
          <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
            Join the Tribe
          </h2>
          <p className="text-gray-400">Create your account and start jamming</p>
        </div>

        {/* User Type Toggle */}
        <div className="mb-6">
          <p className="text-center text-gray-300 mb-3">I want to join as:</p>
          <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/20">
            <button
              type="button"
              onClick={() => handleUserTypeToggle('MUSICIAN')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                userType === 'MUSICIAN'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎸 Musician
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeToggle('LISTENER')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                userType === 'LISTENER'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              🎧 Listener
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <input
              type="text"
              name="name"
              placeholder="Full Name *"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
            />

            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (Optional)"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
            />

            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters) *"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength={6}
              className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password *"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full p-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                userType === 'MUSICIAN'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-orange-500/50'
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:shadow-purple-500/50'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                userType === 'MUSICIAN' ? '🎸 Join as Musician' : '🎧 Join as Listener'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-semibold hover:underline transition-colors duration-300">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
