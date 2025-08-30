'use client'

import Image from "next/image";
import { useRouter } from "next/navigation"; // Changed from "next/router"

export default function Home() {
  const router = useRouter();

  const handleJoinMusician = () => {
    router.push('/signup?type=musician');
  };

  const handleJoinListener = () => {
    router.push('/signup?type=listener');
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center font-sans px-5 min-h-screen">
        {/* Navigation hint */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Live jam sessions happening now</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="mb-8 space-y-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
              FIND YOUR VIBE.
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent">
              JAM YOUR TRIBE.
            </span>
          </h1>
          
          <div className="flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl mb-12 max-w-2xl text-gray-300 leading-relaxed">
          The ultimate platform where musicians 
          <span className="text-orange-400 font-semibold"> connect</span>, 
          <span className="text-purple-400 font-semibold"> collaborate</span>, and 
          <span className="text-pink-400 font-semibold"> create magic</span> together.
        </p>

        {/* Featured Image with enhanced styling */}
        <div className="mb-12 relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative">
            <Image
              src="/jam.png"
              alt="Musicians jamming together"
              width={500}
              height={350}
              className="rounded-3xl shadow-2xl border-2 border-white/20 transform group-hover:scale-105 transition duration-500"
            />
            {/* Overlay with stats */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-400">50K+</div>
                  <div className="text-xs text-gray-300">Musicians</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">1M+</div>
                  <div className="text-xs text-gray-300">Jam Sessions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-400">24/7</div>
                  <div className="text-xs text-gray-300">Live Music</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons with Navigation */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <button 
            onClick={handleJoinMusician}
            className="group relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-orange-500/50 border-2 border-orange-400/30"
          >
            <span className="relative z-10 flex items-center gap-3">
              🎸 Join as MUSICIAN
              <div className="w-2 h-2 bg-white rounded-full group-hover:animate-bounce"></div>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          
          <button 
            onClick={handleJoinListener}
            className="group relative bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50 border-2 border-purple-400/30"
          >
            <span className="relative z-10 flex items-center gap-3">
              🎧 Join as LISTENER
              <div className="w-2 h-2 bg-white rounded-full group-hover:animate-bounce delay-100"></div>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Social Proof */}
        <div className="flex items-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-8 h-8 bg-gradient-to-br from-orange-400 to-purple-600 rounded-full border-2 border-[#0a0a1a]"></div>
              ))}
            </div>
            <span>Join thousands of musicians worldwide</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-gray-600"></div>
          <div className="hidden md:flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Active community • 24/7 support</span>
          </div>
        </div>

        {/* Bottom floating action */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
