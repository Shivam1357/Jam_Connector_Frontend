'use client'

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinMusician = () => {
    router.push('/signup?type=musician');
  };

  const handleJoinListener = () => {
    router.push('/signup?type=listener');
  };

  const features = [
    {
      icon: "🎵",
      title: "Discover Musicians",
      description: "Find talented artists by genre, instrument, and location",
      gradient: "from-orange-500 to-red-600"
    },
    {
      icon: "🎸",
      title: "Create Jam Sessions",
      description: "Host or join live music sessions in your area",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      icon: "👥",
      title: "Build Your Network",
      description: "Connect with musicians and grow your community",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      icon: "📍",
      title: "Location-Based",
      description: "Find sessions and musicians near you",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      icon: "🎤",
      title: "Showcase Your Talent",
      description: "Create a profile and share your musical journey",
      gradient: "from-yellow-500 to-orange-600"
    },
    // {
    //   icon: "🔔",
    //   title: "Real-Time Updates",
    //   description: "Get notified about new sessions and invitations",
    //   gradient: "from-indigo-500 to-purple-600"
    // }
  ];


  return (
    <div className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🎵</div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
                JamConnect
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How it Works</a>
              <a href="#stats" className="text-gray-300 hover:text-white transition-colors">Community</a>
              <button 
                onClick={() => router.push('/login')}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors border border-white/20"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          {/* Live indicator */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8 animate-pulse">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-300">Live jam sessions happening now</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent block mb-2">
              FIND YOUR VIBE.
            </span>
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent block">
              JAM YOUR TRIBE.
            </span>
          </h1>

          <div className="flex justify-center mb-6">
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full"></div>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-300 leading-relaxed">
            The ultimate platform where musicians 
            <span className="text-orange-400 font-semibold"> connect</span>, 
            <span className="text-purple-400 font-semibold"> collaborate</span>, and 
            <span className="text-pink-400 font-semibold"> create magic</span> together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={handleJoinMusician}
              className="group relative bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50 border-2 border-orange-400/30"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                🎸 Join as MUSICIAN
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
            
            <button 
              onClick={handleJoinListener}
              className="group relative bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 border-2 border-purple-400/30"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                🎧 Join as LISTENER
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          {/* Hero Image */}
          {/* <div className="relative group max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <Image
                src="/jam.png"
                alt="Musicians jamming together"
                width={800}
                height={500}
                className="rounded-3xl shadow-2xl border-2 border-white/20 transform group-hover:scale-[1.02] transition duration-500 w-full h-auto"
              />
            </div>
          </div> */}

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20">
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      
      {/* Features Section */}
      <section id="features" className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful features designed to help musicians connect, collaborate, and create together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-gray-400 text-lg">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Profile", desc: "Sign up and showcase your musical talents", icon: "📝" },
              { step: "02", title: "Find Sessions", desc: "Discover jam sessions in your area", icon: "🔍" },
              { step: "03", title: "Start Jamming", desc: "Connect and create music together", icon: "🎸" }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <div className="text-5xl font-bold text-white/20 mb-2">{item.step}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
            <div className="flex justify-center mb-6">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-12 h-12 bg-gradient-to-br from-orange-400 to-purple-600 rounded-full border-4 border-[#0a0a1a]"></div>
                ))}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Join Thousands of Musicians Worldwide</h3>
            <p className="text-gray-300 text-lg mb-8">
              Our community is growing every day. Connect with talented artists and create amazing music together.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Active Community</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>24/7 Support</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Free to Join</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-400 via-purple-500 to-pink-600 bg-clip-text text-transparent">
              Ready to Start Your Musical Journey?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Join JamConnect today and connect with musicians who share your passion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleJoinMusician}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50"
            >
              Get Started - It's Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 JamConnect. All rights reserved. Made with ❤️ for musicians.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
