// pages/sessions.js or components/SessionsPage.js
"use client"
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sessionService } from '@/services/sessionService'; // Adjust import path
import { FaInstagram, FaSpotify, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa';
import SocialMediaLinks from '@/components/SocialMediaLinks';
import { formatDuration } from '@/hooks/formatDuration';
import JamSessionImage from '@/components/JamSessionImage';
import ProfilePictureImage from '@/components/ProfilePictureImage';
import HostModal from '@/components/HostModal';


const SessionsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);
  const [isOnlyMySessions, setIsOnlyMySessions] = useState(false);

  // Get unique genres and cities from sessions
  const [genres, setGenres] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchAllSessions();
  }, [isOnlyMySessions]);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchQuery, selectedGenre, selectedCity]);

  const fetchAllSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data =(isOnlyMySessions ?  await sessionService.getMySessions() : await sessionService.getAllSessions());
      console.log(data);
      const upcomingSessions = data.filter(session => session.status === 'UPCOMING');
      setSessions(upcomingSessions);
      
      // Extract unique genres and cities
      const uniqueGenres = [...new Set(upcomingSessions.map(session => session.genre?.name).filter(Boolean))];
      const uniqueCities = [...new Set(upcomingSessions.map(session => session.address?.city).filter(Boolean))];
      
      setGenres(uniqueGenres);
      setCities(uniqueCities);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

// Add this useEffect to initialize from URL
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const genre = searchParams.get('genre') || '';
    const city = searchParams.get('city') || '';
    const mySessions = searchParams.get('mySessions') === 'true';
    
    setSearchQuery(search);
    setSelectedGenre(genre);
    setSelectedCity(city);
    setIsOnlyMySessions(mySessions);
  }, []); // Run only once on mount

  // Add this function after your state declarations
const updateURL = (params) => {
  const url = new URLSearchParams();
  
  if (params.search) url.set('search', params.search);
  if (params.genre) url.set('genre', params.genre);
  if (params.city) url.set('city', params.city);
  if (params.mySessions) url.set('mySessions', 'true');
  
  const queryString = url.toString();
  router.push(`/sessions${queryString ? `?${queryString}` : ''}`, { scroll: false });
};


  const filterSessions = () => {
    let filtered = sessions;

    // Search by title or host name
    if (searchQuery) {
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.host?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(session => session.genre?.name === selectedGenre);
    }

    // Filter by city
    if (selectedCity) {
      filtered = filtered.filter(session => session.address?.city === selectedCity);
    }

    setFilteredSessions(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedCity('');
    setIsOnlyMySessions(false);

    router.push('/sessions', { scroll: false });
  };

  const getGenreStyle = (genreName) => {
    switch (genreName?.toLowerCase()) {
      case 'rock':
        return {
          gradient: 'from-orange-500/20 to-red-500/20',
          border: 'border-orange-500/30',
          button: 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700',
          progress: 'from-orange-400 to-red-400',
          emoji: '🎸'
        };
      case 'jazz':
        return {
          gradient: 'from-purple-500/20 to-pink-500/20',
          border: 'border-purple-500/30',
          button: 'from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700',
          progress: 'from-purple-400 to-pink-400',
          emoji: '🎤'
        };
      case 'classical':
        return {
          gradient: 'from-blue-500/20 to-indigo-500/20',
          border: 'border-blue-500/30',
          button: 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
          progress: 'from-blue-400 to-indigo-400',
          emoji: '🎼'
        };
      default:
        return {
          gradient: 'from-gray-500/20 to-slate-500/20',
          border: 'border-gray-500/30',
          button: 'from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700',
          progress: 'from-gray-400 to-slate-400',
          emoji: '🎵'
        };
    }
  };

  const openHostModal = (host) => {
    setSelectedHost(host);
    setIsHostModalOpen(true);
  };

  const closeHostModal = () => {
    setIsHostModalOpen(false);
    setSelectedHost(null);
  };


  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeHostModal();
    }
  };

  React.useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{isOnlyMySessions ? "My Sessions" : "All Sessions"}</h1>
          <p className="text-gray-400">{!isOnlyMySessions ? "Find and join music sessions near you" : ""}</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by session title or host name..."
                value={searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchQuery(value);
                  updateURL({ 
                    search: value, 
                    genre: selectedGenre, 
                    city: selectedCity, 
                    mySessions: isOnlyMySessions 
                  });
                }}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <select
                value={selectedGenre}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedGenre(value);
                  updateURL({ 
                    search: searchQuery, 
                    genre: value, 
                    city: selectedCity, 
                    mySessions: isOnlyMySessions 
                  });
                }}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedCity(value);
                  updateURL({ 
                    search: searchQuery, 
                    genre: selectedGenre, 
                    city: value, 
                    mySessions: isOnlyMySessions 
                  });
                }}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* My Sessions Toggle - Added below the main filters */}
          <div className="flex items-center justify-start mt-4 pt-4 border-t border-white/10">
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isOnlyMySessions}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsOnlyMySessions(checked);
                    updateURL({ 
                      search: searchQuery, 
                      genre: selectedGenre, 
                      city: selectedCity, 
                      mySessions: checked 
                    });
                  }}
                  className="sr-only"
                />
                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                  isOnlyMySessions 
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                    : 'bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ${
                    isOnlyMySessions ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`}></div>
                </div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                Show only my sessions
              </span>
            </label>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedGenre || selectedCity || isOnlyMySessions) && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-300">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  Search: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedGenre && (
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  Genre: {selectedGenre}
                </span>
              )}
              {selectedCity && (
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  City: {selectedCity}
                </span>
              )}
              {isOnlyMySessions && (
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                  My Sessions Only
                </span>
              )}
              <button
                onClick={clearFilters}
                className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm hover:bg-red-500/30 transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>


        {/* Sessions Grid */}
        <div className="mb-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-gray-400">Loading sessions...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <p>{error}</p>
              </div>
              <button 
                onClick={fetchAllSessions}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-white mb-2">No sessions found</h3>
              <p className="text-gray-400 mb-4">
                {searchQuery || selectedGenre || selectedCity 
                  ? 'Try adjusting your filters to see more results'
                  : 'No active sessions right now. Create your own!'
                }
              </p>
              {(searchQuery || selectedGenre || selectedCity) && (
                <button
                  onClick={clearFilters}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {filteredSessions.length} Session{filteredSessions.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSessions.map((session) => {
                  const style = getGenreStyle(session.genre?.name);
                  const isLive = new Date(session.dateTime) <= new Date();
                  const currentParticipants = session.currentParticipants;
                  const progressPercentage = (currentParticipants / session.maxParticipants) * 100;

                  return (
                    <div 
                      key={session.id} 
                      className={`bg-gradient-to-br ${style.gradient} border ${style.border} rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer`}
                      onClick={() => router.push(`/sessions/${session.id}`)}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                          <span>{style.emoji}</span>
                          <span className="truncate">{session.title}</span>
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          isLive 
                            ? 'bg-green-500/20 text-green-300' 
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {isLive ? 'Live' : 'Soon'}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2">{session.description}</p>

                      {/* Host */}
                      {/* {!isOnlyMySessions && */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-purple-400 mb-2">👤 Host</h4>
                          <div 
                            className="flex items-center gap-3 cursor-pointer hover:bg-white/10 rounded-lg p-2 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              openHostModal(session.host);
                            }}
                          >
                            <ProfilePictureImage
                              publicId={session.host?.profilePictureId}
                              name={session.host?.name}
                              size="sm"
                              alt="Profile Picture"
                            />
                            <div>
                              <p className="text-sm font-medium">{session.host?.name}</p>
                              <p className="text-xs text-gray-400">Session Host</p>
                            </div>
                          </div>
                        </div>
                      {/* } */}


                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Genre:</span>
                          <span className="text-white">{session.genre?.name}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Location:</span>
                          <span className="text-white">{session.address?.city}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Date:</span>
                          <span className="text-white">
                            {new Date(session.dateTime).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Time:</span>
                          <span className="text-white">
                            {new Date(session.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-white">{formatDuration(session.durationInMinutes)}</span>
                        </div>
                      </div>

                      {/* Participants Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-300">
                            {currentParticipants}/{session.maxParticipants} participants
                          </span>
                          <span className="text-xs text-gray-400">
                            {Math.round(progressPercentage)}% full
                          </span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-2">
                          <div 
                            className={`bg-gradient-to-r ${style.progress} h-2 rounded-full transition-all duration-300`} 
                            style={{width: `${progressPercentage}%`}}
                          ></div>
                        </div>
                      </div>

                      {/* Join Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/sessions/${session.id}`);
                        }}
                        className={`w-full bg-gradient-to-r ${style.button} text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]`}
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Host Modal */}

        {/* Replace your old modal with this */}
        <HostModal
          isOpen={isHostModalOpen}
          onClose={closeHostModal}
          host={selectedHost}
        />

      </div>
    </div>
  );
};

export default SessionsPage;
