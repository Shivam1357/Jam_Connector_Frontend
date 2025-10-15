"use client"
export const dynamic = "force-dynamic";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { sessionService } from '@/services/sessionService';
import ProfilePictureImage from '@/components/ProfilePictureImage';
import { formatDuration } from '@/hooks/formatDuration';

const ParticipationsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  // State management
  const [activeTab, setActiveTab] = useState('participating');
  const [participatingSessions, setParticipatingSessions] = useState([]);
  const [requestsAndInvitations, setRequestsAndInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch participating sessions (JamParticipantDTO[])
      const participationsResponse = await sessionService.getMyParticipations();
       console.log('Participations:', participationsResponse);
      setParticipatingSessions(participationsResponse || []);

      // Fetch received invitations and sent requests (JamJoinRequestDTO[])
      const requestsResponse = await sessionService.getMyReceivedInvitationsAndSentRequests();
       console.log('Requests & Invitations:', requestsResponse);
      setRequestsAndInvitations(requestsResponse || []);

    } catch (error) {
      console.error('Failed to fetch participation data:', error);
      showError('Failed to load participation data');
    } finally {
      setLoading(false);
    }
  };

  // Genre styling
  const getGenreStyle = (genreName) => {
    switch (genreName?.toLowerCase()) {
      case 'rock':
        return { gradient: 'from-orange-500/20 to-red-500/20', border: 'border-orange-500/30', emoji: '🎸' };
      case 'jazz':
        return { gradient: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30', emoji: '🎤' };
      case 'classical':
        return { gradient: 'from-blue-500/20 to-indigo-500/20', border: 'border-blue-500/30', emoji: '🎼' };
      default:
        return { gradient: 'from-gray-500/20 to-slate-500/20', border: 'border-gray-500/30', emoji: '🎵' };
    }
  };

  // Separate invitations and sent requests
  const receivedInvitations = requestsAndInvitations.filter(
    item => item.requestType === 'INVITATION' && item.status === 'PENDING'
  );
  
  const sentRequests = requestsAndInvitations.filter(
    item => item.requestType === 'JOIN_REQUEST' && item.status === 'PENDING'
  );

  // Render participating sessions
  const renderParticipatingSessions = () => {
    if (participatingSessions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎸</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Participating Sessions</h3>
          <p className="text-gray-400 mb-4">You&apos;re not participating in any sessions yet</p>
          <button
            onClick={() => router.push('/sessions')}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            Browse Sessions
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {participatingSessions.map((participation) => {
          const style = getGenreStyle(participation.sessionTitle); // You may need genre info from backend
          
          return (
            <div
              key={participation.id}
              className={`bg-gradient-to-br ${style.gradient} border ${style.border} rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer`}
              onClick={() => router.push(`/sessions/${participation.sessionId}`)}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2 flex-1 min-w-0">
                  <span>{style.emoji}</span>
                  <span className="truncate">{participation.sessionTitle}</span>
                </h3>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-300 whitespace-nowrap ml-2">
                  ✓ Joined
                </span>
              </div>

              {/* Host Info */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-purple-400 mb-2">Host</h4>
                <div className="flex items-center gap-2">
                  {/* <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-sm font-bold">
                    {participation.hostName?.charAt(0)?.toUpperCase()}
                  </div> */}
                  <ProfilePictureImage
                    publicId={participation.hostProfilePictureId}
                    name={participation.hostName}
                    size="sm"
                    alt="Host"
                />
                  <span className="text-sm text-white truncate">{participation.hostName}</span>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white">
                    {new Date(participation.dateTimeOfEvent).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Time:</span>
                  <span className="text-white">
                    {new Date(participation.dateTimeOfEvent).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{formatDuration(participation.durationInMinutesOfEvent)}</span>
                </div>
              </div>

              {/* View Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/sessions/${participation.sessionId}`);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  // Render pending requests and invitations
  const renderRequestsAndInvitations = () => {
    const hasRequests = receivedInvitations.length > 0 || sentRequests.length > 0;

    if (!hasRequests) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📬</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Pending Requests</h3>
          <p className="text-gray-400 mb-4">You don&apos;t have any pending requests or invitations</p>
          <button
            onClick={() => router.push('/sessions')}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-2 rounded-lg transition-all"
          >
            Browse Sessions
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Received Invitations */}
        {receivedInvitations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📩</span>
              Received Invitations ({receivedInvitations.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {receivedInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-500/50 hover:border-yellow-500/70 transition-all shadow-lg shadow-yellow-500/10"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Session Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-2xl">🎵</span>
                        <h3 className="text-xl font-bold text-white">{invitation.sessionTitle}</h3>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 flex items-center gap-1">
                          <span>📩</span> Invitation
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <ProfilePictureImage
                          publicId={invitation.hostProfilePictureId}
                          name={invitation.hostName}
                          size="sm"
                          alt="Host"
                        />
                        <div>
                          <p className="text-sm text-gray-300">
                            Invited by <span className="font-semibold text-white">{invitation.hostName}</span>
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(invitation.requestedAt).toLocaleDateString()} at{' '}
                            {new Date(invitation.requestedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {invitation.message && (
                        <p className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg mb-3 italic">
                          &quot;{invitation.message}&quot;
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>📅 {new Date(invitation.dateTimeOfEvent).toLocaleDateString()}</span>
                        <span>🕐 {new Date(invitation.dateTimeOfEvent).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                        <span>⏱️ {formatDuration(invitation.durationInMinutesOfEvent)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <button
                        onClick={() => router.push(`/sessions/${invitation.sessionId}`)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg font-medium transition-all whitespace-nowrap"
                      >
                        👁 View & Respond
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sent Join Requests */}
        {sentRequests.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📤</span>
              Sent Join Requests ({sentRequests.length})
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {sentRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-500/50 hover:border-blue-500/70 transition-all shadow-lg shadow-blue-500/10"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Session Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-2xl">🎵</span>
                        <h3 className="text-xl font-bold text-white">{request.sessionTitle}</h3>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/50 flex items-center gap-1">
                          <span>📤</span> Request Sent
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        <ProfilePictureImage
                          publicId={request.hostProfilePictureId}
                          name={request.hostName}
                          size="sm"
                          alt="Host"
                        />
                        <div>
                          <p className="text-sm text-gray-300">
                            Sent to <span className="font-semibold text-white">{request.hostName}</span>
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(request.requestedAt).toLocaleDateString()} at{' '}
                            {new Date(request.requestedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {request.message && (
                        <p className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg mb-3 italic">
                          Your message: &quot;{request.message}&quot;
                        </p>
                      )}

                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>📅 {new Date(request.dateTimeOfEvent).toLocaleDateString()}</span>
                        <span>🕐 {new Date(request.dateTimeOfEvent).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                        <span>⏱️ {formatDuration(request.durationInMinutesOfEvent)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <button
                        onClick={() => router.push(`/sessions/${request.sessionId}`)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg font-medium transition-all whitespace-nowrap"
                      >
                        👁 View & Manage
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading your participations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Participations</h1>
          <p className="text-gray-400">Manage your session participations and requests</p>
        </div>

        {/* Tabs */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20 mb-8 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('participating')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'participating'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>🎸</span>
              Participating ({participatingSessions.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 rounded-xl font-medium transition-all relative ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="flex items-center gap-2">
              <span>📬</span>
              Requests & Invitations ({sentRequests.length + receivedInvitations.length})
            </span>
            {receivedInvitations.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 text-xs text-white rounded-full flex items-center justify-center font-bold animate-pulse">
                {receivedInvitations.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'participating' ? renderParticipatingSessions() : renderRequestsAndInvitations()}
        </div>
      </div>
    </div>
  );
};

export default ParticipationsPage;
