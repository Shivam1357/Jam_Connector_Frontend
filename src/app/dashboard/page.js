// src/app/dashboard/page.js
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.push('/login')
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show redirecting state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] flex items-center justify-center">
        <div className="text-center text-white">
          <p>Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white">
      {/* Header */}
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
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-sm font-bold group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-all duration-300 group-hover:scale-105">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">
            Ready to Jam, {user?.name}! 🎵
          </h2>
          <p className="text-gray-400 text-lg">
            {user?.role === 'MUSICIAN' 
              ? 'Create sessions, invite musicians, and make music together!' 
              : 'Join jam sessions and connect with amazing musicians!'
            }
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Sessions</p>
                <p className="text-3xl font-bold text-orange-400">8</p>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                🎸
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">My Sessions</p>
                <p className="text-3xl font-bold text-purple-400">
                  {user?.role === 'MUSICIAN' ? '5' : '12'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                🎼
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Jam Partners</p>
                <p className="text-3xl font-bold text-pink-400">23</p>
              </div>
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                👥
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Hours Jammed</p>
                <p className="text-3xl font-bold text-green-400">47</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                ⏱️
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Create/Join Session */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span>🎵</span>
              {user?.role === 'MUSICIAN' ? 'Create Jam Session' : 'Join a Session'}
            </h3>
            
            {user?.role === 'MUSICIAN' ? (
              <div className="space-y-4">
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg">
                  🚀 Start New Jam Session
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <button className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105">
                    🎤 Vocal Session
                  </button>
                  <button className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/40 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105">
                    🎸 Instrumental Jam
                  </button>
                  <button className="bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105">
                    🎹 Open Session
                  </button>
                  <button className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/40 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 hover:scale-105">
                    📻 Live Stream Jam
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-4">
                    <h4 className="font-semibold mb-2">🎸 Rock Session</h4>
                    <p className="text-sm text-gray-300 mb-3">2/5 musicians • Started 10min ago</p>
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                      Join Now
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                    <h4 className="font-semibold mb-2">🎤 Vocals Practice</h4>
                    <p className="text-sm text-gray-300 mb-3">4/8 members • Live now</p>
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                      Join Now
                    </button>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                  🔍 Browse All Sessions
                </button>
              </div>
            )}
          </div>

          {/* Online Musicians */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>🟢</span>
              Online Musicians
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Alex Guitar', instrument: '🎸', status: 'Available' },
                { name: 'Sarah Vocals', instrument: '🎤', status: 'In Session' },
                { name: 'Mike Drums', instrument: '🥁', status: 'Available' },
                { name: 'Lisa Piano', instrument: '🎹', status: 'Available' },
              ].map((musician, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {musician.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{musician.name}</p>
                      <p className="text-xs text-gray-400">{musician.instrument} {musician.status}</p>
                    </div>
                  </div>
                  <button className="bg-orange-500/20 hover:bg-orange-500/40 text-orange-300 px-3 py-1 rounded text-xs transition-colors">
                    Invite
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Sessions & Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sessions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4">Recent Sessions</h3>
            <div className="space-y-4">
              {[
                { title: 'Evening Jazz Session', time: '2 hours ago', participants: 4, genre: 'Jazz' },
                { title: 'Rock Jam Friday', time: '1 day ago', participants: 6, genre: 'Rock' },
                { title: 'Acoustic Vibes', time: '3 days ago', participants: 3, genre: 'Acoustic' },
              ].map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-gray-400">{session.genre} • {session.participants} musicians • {session.time}</p>
                  </div>
                  <button className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 px-3 py-1 rounded text-sm transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Profile Information</h3>
              <Link 
                href="/profile"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Edit Profile
              </Link>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center md:items-start">
                <Link 
                  href="/profile"
                  className="group relative cursor-pointer"
                >
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl font-bold group-hover:shadow-xl group-hover:shadow-orange-500/30 transition-all duration-300 group-hover:scale-105">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                </Link>
                
                {/* Profile completion indicator */}
                <div className="mt-3 text-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Profile 85% complete</span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Name</p>
                    <p className="font-medium">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Role</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      user?.role === 'MUSICIAN' 
                        ? 'bg-orange-500/20 text-orange-300' 
                        : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {user?.role === 'MUSICIAN' ? '🎸 Musician' : '🎧 Listener'}
                    </span>
                  </div>
                </div>
                
                {/* Quick Profile Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                  <Link 
                    href="/profile"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-105"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
