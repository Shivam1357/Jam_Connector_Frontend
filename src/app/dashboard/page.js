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
        </div>

        {/* Main Action Section */}
        {/* {user?.role == 'MUSICIAN' && */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Create/Join Session */}
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span>🎵</span>
                Create Jam Session
              </h3>
              
                <div className="space-y-4">
                  <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg">
                    🚀 Start New Jam Session
                  </button>
                </div>
            </div>
          </div>
        {/* } */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <span>🎵</span>
                Join a Session
              </h3>
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

          
        </div>
      </main>
    </div>
  )
}