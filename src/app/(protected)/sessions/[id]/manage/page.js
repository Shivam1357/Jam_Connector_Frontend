'use client'
import React, { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { sessionService } from '@/services/sessionService'
import { useAuth } from '@/contexts/AuthContext'
import { useNotification } from '@/contexts/NotificationContext'
import ProfilePictureImage from '@/components/ProfilePictureImage'
import HostModal from '@/components/HostModal'
import InvitationModal from '@/components/InvitationModal'

export default function SessionManagePage({ params }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { showSuccess, showError } = useNotification()

  const [activeTab, setActiveTab] = useState('requests')
  const [session, setSession] = useState(null)
  const [joinRequests, setJoinRequests] = useState([])
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({});


  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  const [selectedMusician, setSelectedMusician] = useState(null)


  // Get tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'invite' || tab === 'requests' || tab === 'participants') {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Fetch session data
  useEffect(() => {
    if (!id) return
    fetchSessionData()
  }, [id])

  // Fetch data based on active tab
  useEffect(() => {
    if (!id) return
    
    if (activeTab === 'requests') {
      fetchJoinRequests()
    } else if (activeTab === 'participants') {
      fetchParticipants()
    }
  }, [id, activeTab])

  const fetchSessionData = async () => {
    try {
      const sessionData = await sessionService.getById(id)
      setSession(sessionData)
    } catch (error) {
      console.error('Failed to fetch session:', error)
      showError('Failed to load session data')
    }
  }

  const fetchJoinRequests = async () => {
    try {
      setLoading(true)
      const requests = await sessionService.getJoinRequests(id)
      setJoinRequests(requests)
    } catch (error) {
      console.error('Failed to fetch join requests:', error)
      showError('Failed to load join requests')
    } finally {
      setLoading(false)
    }
  }

  const fetchParticipants = async () => {
    try {
      setLoading(true)
      const participantsData = await sessionService.getParticipants(id)
      console.log(participantsData);
      setParticipants(participantsData)
    } catch (error) {
      console.error('Failed to fetch participants:', error)
      showError('Failed to load participants')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestResponse = async (requestId, action) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: true }))
      
      await sessionService.respondToJoinRequest(requestId, action)
      
      showSuccess(`Request ${action.toLowerCase()}ed successfully!`)
      
      // Refresh the requests list
      fetchJoinRequests()
      
      // Also refresh session data to update participant count
      fetchSessionData()
      
    } catch (error) {
      console.error(`Failed to ${action} request:`, error)
      showError(error.response?.data?.error || `Failed to ${action.toLowerCase()} request`)
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: false }))
    }
  }

  const handleRemoveParticipant = async (participantId, userId) => {
    try {
      setActionLoading(prev => ({ ...prev, [participantId]: true }))
      
      // Call leave session endpoint (you'll need to modify this)
      await sessionService.removeParticipant(id, userId)
      
      showSuccess('Participant removed successfully!')
      
      // Refresh participants and session data
      fetchParticipants()
      fetchSessionData()
      
    } catch (error) {
      console.error('Failed to remove participant:', error)
      showError('Failed to remove participant')
    } finally {
      setActionLoading(prev => ({ ...prev, [participantId]: false }))
    }
  }

  const changeTab = (tab) => {
    setActiveTab(tab)
    router.push(`/sessions/${id}/manage?tab=${tab}`, { scroll: false })
  }

  const closeHostModal = () => {
    setIsHostModalOpen(false)
    setSelectedMusician(null)
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading session...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white">
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        
        {/* Session Info Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20 mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2 truncate">{session.title}</h2>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-300 text-xs sm:text-sm">
                <span className="flex items-center gap-1">
                  🎵 <span className="truncate">{session.genre?.name}</span>
                </span>
                <span className="whitespace-nowrap">👥 {session.currentParticipants || 0}/{session.maxParticipants}</span>
                <span className="hidden sm:inline">📅 {new Date(session.dateTime).toLocaleDateString()}</span>
                <span className="sm:hidden">📅 {new Date(session.dateTime).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/20 overflow-hidden">
          {/* Tab Buttons */}
          <div className="flex border-b border-white/10 overflow-x-auto">
            <button
              onClick={() => changeTab('requests')}
              className={`flex-1 min-w-[100px] py-3 sm:py-4 px-3 sm:px-6 font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
                activeTab === 'requests'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="hidden sm:inline">📝 Join Requests</span>
              <span className="sm:hidden">📝 Requests</span>
              {joinRequests.length > 0 && (
                <span className="ml-1">({joinRequests.length})</span>
              )}
            </button>
            <button
              onClick={() => changeTab('participants')}
              className={`flex-1 min-w-[100px] py-3 sm:py-4 px-3 sm:px-6 font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
                activeTab === 'participants'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="hidden sm:inline">👥 Participants</span>
              <span className="sm:hidden">👥 People</span>
              {participants.length > 0 && (
                <span className="ml-1">({participants.length})</span>
              )}
            </button>
            <button
              onClick={() => changeTab('invite')}
              className={`flex-1 min-w-[100px] py-3 sm:py-4 px-3 sm:px-6 font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
                activeTab === 'invite'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="hidden sm:inline">✉️ Send Invites</span>
              <span className="sm:hidden">✉️ Invite</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-4 md:p-6">
            
            {/* Join Requests Tab */}
            {activeTab === 'requests' && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Pending Join Requests</h3>
                
                {loading ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm sm:text-base">Loading requests...</p>
                  </div>
                ) : joinRequests.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-5xl sm:text-6xl mb-4">📭</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No pending requests</h3>
                    <p className="text-gray-400 text-sm sm:text-base px-4">No one has requested to join your session yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {joinRequests.map((request) => (
                      <div key={request.id} className="bg-white/5 rounded-lg md:rounded-xl p-4 sm:p-5 md:p-6 border border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                              <ProfilePictureImage
                                publicId={request.userProfilePictureId}
                                name={request.userName}
                                size="sm"
                                alt="Profile"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base sm:text-lg truncate">{request.userName}</h4>
                              <p className="text-gray-400 text-xs sm:text-sm capitalize">
                                {request.userRole?.toLowerCase()}
                              </p>
                              <p className="text-gray-400 text-xs sm:text-sm">
                                <span className="hidden sm:inline">Requested {new Date(request.requestedAt).toLocaleDateString()}</span>
                                <span className="sm:hidden">{new Date(request.requestedAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}</span>
                              </p>
                              {request.message && (
                                <div className="mt-2 bg-white/5 p-2 sm:p-3 rounded-lg">
                                  <p className="text-gray-300 text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">"{request.message}"</p>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleRequestResponse(request.id, 'DECLINE')}
                              disabled={actionLoading[request.id]}
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                            >
                              {actionLoading[request.id] ? '...' : 'Decline'}
                            </button>
                            <button
                              onClick={() => handleRequestResponse(request.id, 'ACCEPT')}
                              disabled={actionLoading[request.id]}
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                            >
                              {actionLoading[request.id] ? '...' : 'Accept'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Participants Tab */}
            {activeTab === 'participants' && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Current Participants</h3>
                
                {loading ? (
                  <div className="text-center py-6 sm:py-8">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400 text-sm sm:text-base">Loading participants...</p>
                  </div>
                ) : participants.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-5xl sm:text-6xl mb-4">👥</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No participants yet</h3>
                    <p className="text-gray-400 text-sm sm:text-base px-4">Accept some join requests to see participants here.</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {participants.map((participant) => (
                      <div key={participant.id} className="bg-white/5 rounded-lg md:rounded-xl p-4 sm:p-5 md:p-6 border border-white/10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                              <ProfilePictureImage
                                publicId={participant.userProfilePictureId}
                                name={participant.userName}
                                size="sm"
                                alt="Profile"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-base sm:text-lg truncate">{participant.userName}</h4>
                              <p className="text-gray-400 text-xs sm:text-sm capitalize truncate">
                                {participant.userRole}
                              </p>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveParticipant(participant.id, participant.userId)}
                            disabled={actionLoading[participant.id]}
                            className="w-full sm:w-auto px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                          >
                            {actionLoading[participant.id] ? '...' : 'Remove'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Send Invites Tab */}
            {activeTab === 'invite' && (
              <InviteMusiciansTab
                sessionId={id}
                session={session}
                sessionService={sessionService}
                showSuccess={showSuccess}
                showError={showError}
              />
            )}

          </div>
        </div>
      </main>
      
      
    </div>
  )
}


function InviteMusiciansTab({ 
  sessionId, 
  session, 
  sessionService, 
  showSuccess, 
  showError,
}) {
  const [availableMusicians, setAvailableMusicians] = useState([])
  const [sentInvitations, setSentInvitations] = useState([])
  const [musicianSearch, setMusicianSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})
  
  // Modal states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false)  // ✅ ADD THIS
  const [selectedMusician, setSelectedMusician] = useState(null) 

  // Computed value for filtered musicians
  const filteredMusicians = availableMusicians.filter(musician =>
    musician.name.toLowerCase().includes(musicianSearch.toLowerCase()) ||
    musician.bio?.toLowerCase().includes(musicianSearch.toLowerCase())
  )

  useEffect(() => {
    if (sessionId) {
      fetchData()
    }
  }, [sessionId])

  const fetchData = async () => {
    await Promise.all([
      fetchAvailableMusicians(),
      fetchSentInvitations()
    ])
  }

  const fetchAvailableMusicians = async () => {
    try {
      setLoading(true)
      const musicians = await sessionService.getAvailableMusicians(sessionId)
      setAvailableMusicians(musicians)
    } catch (error) {
      console.error('Failed to fetch available musicians:', error)
      showError('Failed to load available musicians')
    } finally {
      setLoading(false)
    }
  }

  const fetchSentInvitations = async () => {
    try {
      const invitations = await sessionService.getSentInvitations(sessionId)
      setSentInvitations(invitations)
    } catch (error) {
      console.error('Failed to fetch sent invitations:', error)
    }
  }

  const openInviteModal = (musician) => {
    setSelectedMusician(musician)
    setIsInviteModalOpen(true)
  }

  const closeInviteModal = () => {
    setIsInviteModalOpen(false)
    setSelectedMusician(null)
  }

  const openHostModal = (musician) => {
    setSelectedMusician(musician)
    setIsHostModalOpen(true)
  }

  const handleSendInvite = async (inviteMessage) => {
    if (!selectedMusician) return
    
    try {
      setActionLoading(prev => ({ ...prev, [selectedMusician.id]: true }))
      
      await sessionService.sendInvitation(sessionId, selectedMusician.id, inviteMessage)
      
      showSuccess(`Invitation sent to ${selectedMusician.name}!`)
      
      // Refresh data
      fetchSentInvitations()
      
      closeInviteModal()
      
    } catch (error) {
      console.error('Failed to send invitation:', error)
      showError(error.response?.data?.error || 'Failed to send invitation')
    } finally {
      setActionLoading(prev => ({ ...prev, [selectedMusician.id]: false }))
    }
  }

  const isInvitationSent = (musicianId) => {
    return sentInvitations.some(inv => inv.userId === musicianId && inv.status === 'PENDING')
  }

  return (
    <div className="w-full">
      <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Send Invitations to Musicians</h3>
      
      {loading ? (
        <div className="text-center py-8 md:py-12">
          <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm md:text-base">Loading available musicians...</p>
        </div>
      ) : availableMusicians.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <div className="text-5xl md:text-6xl mb-4">🎵</div>
          <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-2">No musicians available</h3>
          <p className="text-gray-400 text-sm md:text-base px-4">All musicians are either already participating or have pending requests.</p>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {/* Search Filter */}
          <div className="mb-4 md:mb-6">
            <input
              type="text"
              placeholder="Search musicians by name..."
              value={musicianSearch}
              onChange={(e) => setMusicianSearch(e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/10 border border-white/20 rounded-lg md:rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors text-sm md:text-base"
            />
          </div>

          {/* Musicians List */}
          {filteredMusicians.map((musician) => (
            <div key={musician.id} className="bg-white/5 rounded-lg md:rounded-xl p-4 md:p-6 border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Profile Section */}
                <div className="flex items-start gap-3 md:gap-4 flex-1">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                    <ProfilePictureImage
                      publicId={musician.profilePictureId}
                      name={musician.name}
                      size="sm"
                      alt="Profile"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base md:text-lg text-white truncate">{musician.name}</h4>
                    <p className="text-purple-400 text-xs md:text-sm capitalize mb-1 md:mb-2">
                      {musician.role?.toLowerCase()}
                    </p>
                    
                    {/* Experience */}
                    {musician.yearsOfExperience && (
                      <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm mb-2">
                        <svg className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="truncate">{musician.yearsOfExperience} years experience</span>
                      </div>
                    )}

                    {/* Bio */}
                    {musician.bio && (
                      <div className="mt-2 md:mt-3 bg-white/5 p-2 md:p-3 rounded-lg">
                        <p className="text-gray-300 text-xs md:text-sm line-clamp-2">{musician.bio}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex sm:flex-col gap-2 w-full sm:w-auto sm:ml-2 md:ml-4">
                  <button
                    onClick={() => openInviteModal(musician)}
                    disabled={actionLoading[musician.id] || isInvitationSent(musician.id)}
                    className={`flex-1 sm:flex-none px-4 md:px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none text-sm md:text-base whitespace-nowrap ${
                      isInvitationSent(musician.id)
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white'
                    }`}
                  >
                    {actionLoading[musician.id] ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Sending...</span>
                      </div>
                    ) : isInvitationSent(musician.id) ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>Invited</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        <span className="hidden sm:inline">Send Invite</span>
                        <span className="sm:hidden">Invite</span>
                      </div>
                    )}
                  </button>

                  {/* View Profile Button */}
                  <button
                    onClick={() => openHostModal(musician)}
                    className="flex-1 sm:flex-none px-4 md:px-6 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-medium transition-colors text-sm md:text-base whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">View Profile</span>
                    <span className="sm:hidden">Profile</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <InvitationModal
        isOpen={isInviteModalOpen}
        onClose={closeInviteModal}
        musician={selectedMusician}
        session={session}
        onSendInvite={handleSendInvite}
        isLoading={actionLoading[selectedMusician?.id]}
      />
      {/* ✅ ADD THIS HostModal */}
      <HostModal
        isOpen={isHostModalOpen}
        onClose={() => {
          setIsHostModalOpen(false)
          setSelectedMusician(null)
        }}
        host={selectedMusician}
      />
    </div>
  )
}
      