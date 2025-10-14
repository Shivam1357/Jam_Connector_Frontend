// src/app/sessions/[id]/page.js
'use client'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { sessionService } from '@/services/sessionService'
import JamSessionImage from '@/components/JamSessionImage'
import SocialMediaLinks from '@/components/SocialMediaLinks'
import { useAuth } from '@/contexts/AuthContext'
import { formatDuration } from '@/hooks/formatDuration'
import HostModal from '@/components/HostModal'
import ProfilePictureImage from '@/components/ProfilePictureImage'
import { useNotification } from '@/contexts/NotificationContext'

export default function SessionPage({ params }) {
  const { id } = use(params);
  // const { id } = params;
  const router = useRouter();
  const { showSuccess, showError } = useNotification();
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const { user } = useAuth();

	const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [isMySession, setIsMySession] = useState(false);

  const [joining, setJoining] = useState(false);

  const [userJoinStatus, setUserJoinStatus] = useState(null);


    // Add these states after your existing state declarations
  const [receivedInvitations, setReceivedInvitations] = useState([])
  const [showInvitationModal, setShowInvitationModal] = useState(false)
  const [selectedInvitation, setSelectedInvitation] = useState(null)




  const openHostModal = () => {
    if (!isMySession){
      setIsHostModalOpen(true);
    }
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
  
  const fetchUserJoinStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Check for join request status
      const joinStatus = await sessionService.getMyJoinRequest(id);
      // console.log(joinStatus);
      setUserJoinStatus(joinStatus);
      
      // Also check for received invitations for this session
      const invitations = await sessionService.getMyReceivedInvitations();
      console.log(invitations);
      const sessionInvitation = invitations.find(inv => 
        inv.sessionId == id && inv.status === 'PENDING'
      );
      
      if (sessionInvitation) {
        setSelectedInvitation(sessionInvitation);
        setShowInvitationModal(true);
      }
      
    } catch (err) {
      console.error('Failed to fetch User Join Status:', err)
    } finally {
      setLoading(false)
    }
  }

  fetchUserJoinStatus();
}, [id]);

  const handleInvitationResponse = async (invitationId, action) => {
    try {
      setJoining(true);
      
      await sessionService.respondToInvitation(invitationId, action);
      
      if (action === 'ACCEPT') {
        showSuccess(`You've joined ${session.title}!`);
        setUserJoinStatus({ participant: true, status: 'ACCEPTED' });
      } else {
        showSuccess('Invitation declined');
      }
      
      setShowInvitationModal(false);
      setSelectedInvitation(null);
      
      // Refresh session data to update participant count
      const sessionData = await sessionService.getById(id);
      setSession(sessionData);
      
    } catch (error) {
      console.error('Error responding to invitation:', error);
      showError('Failed to respond to invitation');
    } finally {
      setJoining(false);
    }
  };


  useEffect(() => {
    if (!id) return
    
    const fetchSession = async () => {
      try {
        setLoading(true)
        setError(null)
        const sessionData = await sessionService.getById(id)
        // console.log(sessionData);
        setSession(sessionData)
      } catch (err) {
        console.error('Failed to fetch session:', err)
        setError('Failed to load session. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [id]);

  // console.log(user);
  useEffect(() => {
      if (session?.host?.id == user.id){
        setIsMySession(true);
      }
      else{
        setIsMySession(false);
      }
      // console.log(isMySession);
  }, [session]);

 
  const handleJoinSession = async () => {
    try {
      setJoining(true)
      
      if (isMySession) {
        // If it's my session, redirect to manage requests page
        router.push(`/sessions/${id}/manage-requests`)
        return
      }

      // Send join request
      const result = await sessionService.sendJoinRequest(id, {
        message: `Hi ${session.host.name}, I would like to join your ${session.genre?.name} session "${session.title}". Looking forward to jamming with you!`
      })
      
      // Show success message
      showSuccess(`Join request sent to ${session.host.name}! You'll be notified when they respond.`);
      setUserJoinStatus({participant : false, status : 'PENDING'});
      // alert()
    } catch (error) {
      console.error('Error sending join request:', error);
      if (error.response?.status === 400) {
        alert(error.response.data.error || 'Unable to send join request')
      } else if (error.response?.status === 409) {
        alert('You have already sent a request for this session')
      } else {
        showError('Failed to send join request. Please try again.');
        // alert('Failed to send join request. Please try again.')
      }
    } finally {
      setJoining(false)
    }
  }


  const handleBackToSessions = () => {
    router.push('/sessions')
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
                onClick={handleBackToSessions}
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
            <p className="text-gray-300 mb-4">The session you&apos;re looking for doesn&apos;t exist.</p>
            <button 
              onClick={handleBackToSessions}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Go Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isUpcoming = session.status === 'UPCOMING';
  const sessionDate = new Date(session.dateTime);

  const startTime = new Date(session.dateTime);
  const endTime = new Date(startTime.getTime() + session.durationInMinutes * 60000);
  const now = new Date();

  let statusText = '';

  if (now < startTime) {
    statusText = 'Soon';
  } else if (now >= startTime && now <= endTime) {
    statusText = 'Live';
  } else {
    statusText = 'Completed';
  }

  // Add this before the return statement
  const InvitationModal = () => {
    if (!showInvitationModal || !selectedInvitation || !session) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
              ✉️
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">Session Invitation</h3>
            <p className="text-gray-300 mb-4">
              <span className="text-purple-400 font-medium">{session.host.name}</span> has invited you to join:
            </p>
            
            {/* Session Info */}
            <div className="bg-white/5 rounded-xl p-4 mb-6 text-left">
              <h4 className="font-semibold text-white mb-2">{session.title}</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p><span className="text-orange-400">Genre:</span> {session.genre?.name}</p>
                <p><span className="text-orange-400">Date:</span> {new Date(session.dateTime).toLocaleDateString()}</p>
                <p><span className="text-orange-400">Time:</span> {new Date(session.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                <p><span className="text-orange-400">Duration:</span> {formatDuration(session.durationInMinutes)}</p>
              </div>
              
              {selectedInvitation.message && (
                <div className="mt-3 p-3 bg-white/5 rounded-lg">
                  <p className="text-gray-300 text-sm italic">&quot;{selectedInvitation.message}&quot;</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleInvitationResponse(selectedInvitation.id, 'DECLINE')}
                disabled={joining}
                className="flex-1 py-3 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                Decline
              </button>
              <button
                onClick={() => handleInvitationResponse(selectedInvitation.id, 'ACCEPT')}
                disabled={joining}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
              >
                {joining ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Accepting...
                  </div>
                ) : (
                  'Accept & Join'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white">
      
      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          {/* Session Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{session.title} | {formatDuration(session.durationInMinutes)}</h1>
              <div className="flex items-center gap-4 text-gray-300">
                <span className="flex items-center gap-1">
                  🎵 {session.genre?.name}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    statusText === 'Live'
                      ? 'bg-green-500/20 text-green-300'
                      : statusText === 'Completed'
                      ? 'bg-gray-500/20 text-gray-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {statusText}
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
                <ProfilePictureImage
                  publicId={session.host?.profilePictureId}
                  name={session.host?.name}
                  size="sm"
                  alt="Profile Picture"
                />
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
          {isMySession ? 
            <div className="flex gap-4 pt-6 border-t border-white/10">
              <button
                onClick={() => {router.push(`/sessions/${id}/manage?tab=requests`)}}
                disabled={!isUpcoming}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                }`}
              >
                Approve Join Requests
              </button>
              
              <button
                onClick={() => {router.push(`/sessions/${id}/manage?tab=invite`)}}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                    'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                }`}              
              >
                Invite
              </button>
            </div>
          :
            <div className="pt-6 border-t border-white/10">
              {/* Status indicator */}
              {userJoinStatus && (
                <div className="flex items-center justify-center mb-4">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    userJoinStatus.participant
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : userJoinStatus.status === 'PENDING'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : userJoinStatus.status === 'DECLINED'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}>
                    {userJoinStatus.participant ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>You&apos;re in this session!</span>
                      </>
                    ) : userJoinStatus.status === 'PENDING' ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Waiting for host approval</span>
                      </>
                    ) : null}
                  </div>
                </div>
              )}

              {/* Action button */}
              <div className="flex gap-4">
                <button
                  disabled={userJoinStatus?.participant || userJoinStatus?.status === 'PENDING' || joining}
                  onClick={handleJoinSession}
                  className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform relative overflow-hidden group ${
                    userJoinStatus?.participant
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white cursor-default opacity-75'
                      : userJoinStatus?.status === 'PENDING'
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white cursor-wait opacity-75'
                      : userJoinStatus?.status === 'DECLINED'
                      ? 'bg-gradient-to-r from-red-500/50 to-red-600/50 hover:from-green-500 hover:to-emerald-600 text-white hover:scale-105 border-2 border-red-500/30 hover:border-green-500/30'
                      : joining
                      ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-wait'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {/* Shimmer effect for active button */}
                  {!userJoinStatus && !joining && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-pulse"></div>
                  )}
                  
                  {/* Loading spinner overlay */}
                  {joining && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  
                  {/* Button content */}
                  <div className="flex items-center justify-center gap-3 relative z-10">
                    {userJoinStatus?.participant ? (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Already Participating</span>
                      </>
                    ) : userJoinStatus?.status === 'PENDING' ? (
                      <>
                        <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>Request Sent</span>
                      </>
                    ) : joining ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        <span>🎵 Request to Join</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          }
        </div>
      </main>

      {/* Replace your old modal with this */}
      <HostModal
        isOpen={isHostModalOpen}
        onClose={closeHostModal}
        host={session.host}
      />

      <InvitationModal />
    </div>

		
  )
}


