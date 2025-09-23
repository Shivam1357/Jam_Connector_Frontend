// src/app/sessions/[id]/page.js
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { sessionService } from '@/services/sessionService'
import JamSessionImage from '@/components/JamSessionImage'
import SocialMediaLinks from '@/components/SocialMediaLinks'

export default function SessionPage({ params }) {
  const { id } = params;
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);


	const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  const openHostModal = () => {
    setIsHostModalOpen(true);
  };

  const closeHostModal = () => {
    setIsHostModalOpen(false);
  };

  // Close modal when clicking outside or pressing Escape
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeHostModal();
    }
  };

 	useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeHostModal();
      }
    };

    if (isHostModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isHostModalOpen]);



  useEffect(() => {
    if (!id) return
    
    const fetchSession = async () => {
      try {
        setLoading(true)
        setError(null)
        const sessionData = await sessionService.getById(id)
        console.log(sessionData);
        setSession(sessionData)
      } catch (err) {
        console.error('Failed to fetch session:', err)
        setError('Failed to load session. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [id])

  const handleJoinSession = () => {
    // TODO: Implement join session functionality
    alert(`Joining session: ${session.title}`)
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md">
            <h2 className="text-xl font-bold text-red-400 mb-2">Error</h2>
            <p className="text-gray-300 mb-4">{error}</p>
            <div className="flex gap-3">
              <button 
                onClick={() => window.location.reload()} 
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Try Again
              </button>
              <button 
                onClick={handleBackToDashboard}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="bg-gray-500/10 border border-gray-500/30 rounded-xl p-6 max-w-md">
            <h2 className="text-xl font-bold text-gray-400 mb-2">Session Not Found</h2>
            <p className="text-gray-300 mb-4">The session you're looking for doesn&apos;t exist.</p>
            <button 
              onClick={handleBackToDashboard}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Go Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isUpcoming = session.status === 'UPCOMING'
  const sessionDate = new Date(session.dateTime)
  const isLive = sessionDate <= new Date() && isUpcoming

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button 
              onClick={handleBackToDashboard}
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-purple-600 bg-clip-text text-transparent">
              JamConnect
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          {/* Session Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{session.title}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1">
                  🎵 {session.genre?.name}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isLive 
                    ? 'bg-green-500/20 text-green-300' 
                    : session.status === 'UPCOMING'
                    ? 'bg-blue-500/20 text-blue-300'
                    : 'bg-gray-500/20 text-gray-300'
                }`}>
                  {isLive ? 'Live Now' : session.status}
                </span>
              </div>
            </div>
            
           
          </div>

           {session.coverImagePublicId && (
            <div className='flex flex-1 justify-center'>
              <div className="w-auto h-auto  max-w-md  max-h-md rounded-xl overflow-hidden border border-white/20 mb-5 ">
                {/* TODO: Display cover image from Cloudinary */}
                <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                  <JamSessionImage publicId={session.coverImagePublicId}/>
                </div>
              </div>
            </div>
            )}

          {/* Session Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-orange-400 mb-2">📝 Description</h3>
                <p className="text-gray-300 leading-relaxed">
                  {session.description || 'No description provided.'}
                </p>
              </div>

							<div>
								<h3 className="text-lg font-semibold text-purple-400 mb-2">👤 Host</h3>
								<div 
								className="flex items-center gap-3 cursor-pointer hover:bg-gray-700 rounded-lg p-2 transition-colors"
								onClick={openHostModal}
								>
								<div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-sm font-bold">
										{session.host?.name?.charAt(0).toUpperCase()}
								</div>
								<div>
										<p className="font-medium">{session.host?.name}</p>
										<p className="text-sm text-gray-400">Session Host</p>
								</div>
								{/* Info icon to show it's clickable */}
								<div className="ml-auto text-gray-400">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
								</div>
								</div>
							</div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">📍 Location</h3>
                <div className="text-gray-300">
                  {session.address?.label && (
                    <p className="font-medium">{session.address.label}</p>
                  )}
                  <p>{session.address?.street}</p>
                  <p>{session.address?.city}, {session.address?.state}</p>
                  <p>{session.address?.country} {session.address?.postalCode}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-green-400 mb-2">📅 When</h3>
                <div className="text-gray-300">
                  <p className="text-lg font-medium">
                    {sessionDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {sessionDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">👥 Participants</h3>
                <div className="text-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-white">
                      {session.currentParticipants || 0}
                    </span>
                    <span>/</span>
                    <span className="text-xl">{session.maxParticipants}</span>
                    <span className="text-sm">musicians</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300" 
                      style={{
                        width: `${Math.min(((session.currentParticipants || 0) / session.maxParticipants) * 100, 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-sm mt-2">
                    {session.isOnlyMusicians ? 'Musicians only' : 'Open to all'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎤 Session Type</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                    {session.genre?.name}
                  </span>
                  {session.isPublic && (
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                      Public Session
                    </span>
                  )}
                  {session.isOnlyMusicians && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                      Musicians Only
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-white/10">
            <button
              onClick={handleJoinSession}
              disabled={!isUpcoming}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                isUpcoming
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                  : 'bg-gray-500/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLive ? '🔴 Join Live Session' : isUpcoming ? '🚀 Join Session' : 'Session Ended'}
            </button>
            
            <button
              onClick={() => navigator.share ? navigator.share({
                title: session.title,
                text: `Join me at ${session.title} - ${session.genre?.name} session`,
                url: window.location.href
              }) : navigator.clipboard.writeText(window.location.href).then(() => alert('Link copied!'))}
              className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 px-6 py-3 rounded-xl font-medium transition-colors"
            >
              📤 Share
            </button>
          </div>
        </div>
      </main>


			 {isHostModalOpen && session.host && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleBackdropClick}
        >
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
            {/* Close button */}
            <button
              onClick={closeHostModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>
            
            {/* Modal content */}
            <div className="text-center">
              {/* Profile picture or initial */}
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {session.host.profilePictureUrl ? (
                  <img 
                    src={session.host.profilePictureUrl} 
                    alt={session.host.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  session.host.name?.charAt(0).toUpperCase()
                )}
              </div>
              
              {/* Host details */}
              <h2 className="text-xl font-bold text-white mb-2">{session.host.name}</h2>
              <p className="text-purple-400 mb-4 capitalize">{session.host.role?.toLowerCase()}</p>
              
              {session.host.bio && (
                <div className="mb-4 text-left">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Bio</h3>
                  <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded-lg">{session.host.bio}</p>
                </div>
              )}
              
              {session.host.phoneNumber && (
                <div className="mb-4 text-left">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Contact</h3>
                  <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded-lg">{session.host.phoneNumber}</p>
                </div>
              )}

              {/* Social Media Icons Horizontal */}
              {(session.host.instagramUrl || session.host.spotifyUrl || session.host.youtubeUrl 
              || session.host.twitterUrl || session.host.tiktokUrl) && 
              
                <div className="mb-4 text-left">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Social Media</h3>
                  <div className="flex items-center gap-5 justify-center">
                    <SocialMediaLinks
                      instagramUrl={session.host.instagramUrl}
                      spotifyUrl={session.host.spotifyUrl}
                      youtubeUrl={session.host.youtubeUrl}
                      twitterUrl={session.host.twitterUrl}
                      tiktokUrl={session.host.tiktokUrl}
                    />
                  </div>
                </div>
              }

              {session.host.yearsOfExperience != null && (
                <div className="mb-4 text-left">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Years of Experience</h3>
                  <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded-lg">{session.host.yearsOfExperience}</p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>

		
  )
}
