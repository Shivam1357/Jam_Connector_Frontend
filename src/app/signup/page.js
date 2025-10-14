// src/app/signup/page.js
'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Signup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, verifyOtp, resendOtp, isAuthenticated, loading } = useAuth();
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

  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [registeredEmail, setRegisteredEmail] = useState('');


  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);



  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.match(/^[0-9]$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setOtpError('');

      // Auto-focus next input
      if (index < 5 && value) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    } else if (value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  // Handle OTP paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (pastedData.match(/^[0-9]{6}$/)) {
      setOtp(pastedData.split(''));
      setOtpError('');
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setOtpError('Please enter complete OTP');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      const result = await verifyOtp(registeredEmail, otpString);
      
      if (result.success) {
        // Success - redirect will happen via useEffect
        setShowOtpModal(false);
      } else {
        setOtpError(result.error);
        setOtp(['', '', '', '', '', '']); // Clear OTP
        document.getElementById('otp-0')?.focus();
      }
    } catch (error) {
      setOtpError('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    setOtpError('');

    try {
      const result = await resendOtp(registeredEmail);
      
      if (result.success) {
        setResendTimer(60);
        setOtp(['', '', '', '', '', '']);
        document.getElementById('otp-0')?.focus();
      } else {
        setOtpError(result.error);
      }
    } catch (error) {
      setOtpError('Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };






  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/dashboard');
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

      const result = await register(registerData);
      
      if (result.success && result.requiresOtp) {
        // Show OTP modal
        setRegisteredEmail(formData.email);
        setShowOtpModal(true);
        setResendTimer(60); // 60 seconds cooldown
      } else if (!result.success) {
        setError(result.error);
      }

      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error);
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



      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Verify Your Email</h3>
              <p className="text-gray-400 text-sm">
                We sent a 6-digit code to<br />
                <span className="text-orange-400 font-semibold">{registeredEmail}</span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white/10 border-2 border-white/30 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {otpError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                {otpError}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={isVerifying}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">
                Didn&apos;t receive the code?
              </p>
              {resendTimer > 0 ? (
                <p className="text-gray-500 text-sm">
                  Resend available in {resendTimer}s
                </p>
              ) : (
                <button
                  onClick={handleResendOtp}
                  disabled={isResending}
                  className="text-orange-400 hover:text-orange-300 font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
