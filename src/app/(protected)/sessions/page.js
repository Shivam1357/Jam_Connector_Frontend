"use client"
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { sessionService } from '@/services/sessionService';
import { formatDuration } from '@/hooks/formatDuration';
import ProfilePictureImage from '@/components/ProfilePictureImage';
import HostModal from '@/components/HostModal';
import { genresList } from '@/data/genres';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SessionsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State management
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isOnlyMySessions, setIsOnlyMySessions] = useState(false);

  // Modal states
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState(null);

  // Debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const pageSize = 6;
  
  const genres = useMemo(() => {
    const uniqueGenres = [...new Set(genresList.map(genre => genre?.name).filter(Boolean))];
    // console.log(uniqueGenres);
    return uniqueGenres.sort();
  }, [sessions]);


  const cities = useMemo(() => {
    const uniqueCities = [...new Set(sessions.map(session => session.address?.city).filter(Boolean))];
    return uniqueCities.sort();
  }, [sessions]);

  // Initialize filters from URL (only once)
  useEffect(() => {
    const urlTitle = searchParams.get('title') || '';
    const urlCity = searchParams.get('city') || '';
    const urlGenre = searchParams.get('genre') || '';
    const urlMySessions = searchParams.get('mySessions') === 'true';
    const urlPage = parseInt(searchParams.get('page')) || 0;

    setSearchQuery(urlTitle);
    setSelectedCity(urlCity);
    setSelectedGenre(urlGenre);
    setIsOnlyMySessions(urlMySessions);
    setCurrentPage(urlPage);
  }, []);

  // Fetch sessions with search and pagination
  const fetchSessions = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);

      const page = resetPage ? 0 : currentPage;
      let response;

      if (isOnlyMySessions) {
        // Get user's own sessions
        response = await sessionService.getMySessions(page, pageSize);
      } else {
        // Search with filters
        const searchParams = {};
        if (debouncedSearchQuery.trim()) searchParams.title = debouncedSearchQuery.trim();
        if (selectedCity) searchParams.city = selectedCity;
        if (selectedGenre) searchParams.genres = [selectedGenre];
        searchParams.status = 'UPCOMING'; // Only show upcoming sessions

        response = await sessionService.searchSessions(
          searchParams,
          page,
          pageSize,
          'dateTime,asc'
        );
      }

      // console.log(response.content);

      setSessions(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);

      if (resetPage && currentPage !== 0) {
        setCurrentPage(0);
      }

      // Update URL
      updateURL({
        title: debouncedSearchQuery,
        city: selectedCity,
        genre: selectedGenre,
        mySessions: isOnlyMySessions,
        page: resetPage ? 0 : page
      });

    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setError(error.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchQuery, selectedCity, selectedGenre, isOnlyMySessions, currentPage]);

  // Update URL with current filters
  // In updateURL function - change 'search' to 'title'
  const updateURL = useCallback((params) => {
    const url = new URLSearchParams();
    
    if (params.title) url.set('title', params.title); 
    if (params.city) url.set('city', params.city);
    if (params.genre) url.set('genre', params.genre);
    if (params.mySessions) url.set('mySessions', 'true');
    if (params.page !== undefined && params.page !== 0) url.set('page', params.page);
    
    const queryString = url.toString();
    router.push(`/sessions${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [router]);


  // Fetch sessions when filters change
  useEffect(() => {
    const isInitialLoad = !sessions.length && 
      !debouncedSearchQuery && !selectedCity && !selectedGenre;

    if (isInitialLoad) {
      fetchSessions();
    } else {
      fetchSessions(true);
    }
  }, [debouncedSearchQuery, selectedCity, selectedGenre, isOnlyMySessions]); 

  // Fetch when page changes
  useEffect(() => {
    if (sessions.length > 0) {
      fetchSessions(false);
    }
  }, [currentPage]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedCity('');
    setIsOnlyMySessions(false);
    setCurrentPage(0);
    router.push('/sessions', { scroll: false });
  }, [router]);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Genre styling function
  const getGenreStyle = useCallback((genreName) => {
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
  }, []);

  // Modal functions
  const openHostModal = useCallback((host) => {
    setSelectedHost(host);
    setIsHostModalOpen(true);
  }, []);

  const closeHostModal = useCallback(() => {
    setIsHostModalOpen(false);
    setSelectedHost(null);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => 
    searchQuery || selectedGenre || selectedCity || isOnlyMySessions,
    [searchQuery, selectedGenre, selectedCity, isOnlyMySessions]
  );

  // Loading state for initial load
  if (loading && sessions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header - REST OF CODE SAME AS BEFORE */}
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
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isOnlyMySessions} // ✅ Add this
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed" // ✅ Add disabled styles
              />
            </div>

            {/* Genre Filter */}
            <div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)} 
                disabled={isOnlyMySessions} // ✅ Add this
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed" // ✅ Add disabled styles
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
                onChange={(e) => setSelectedCity(e.target.value)} 
                disabled={isOnlyMySessions} // ✅ Add this
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 disabled:opacity-50 disabled:cursor-not-allowed" // ✅ Add disabled styles
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* My Sessions Toggle - Added below the main filters */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10"> {/* ✅ Changed justify-start to justify-between */}
            <label className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isOnlyMySessions}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsOnlyMySessions(checked);
                    
                    if (checked) {
                      setSearchQuery('');
                      setSelectedGenre('');
                      setSelectedCity('');
                    }
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
            
            {/* ✅ Add info message when My Sessions is active */}
            {isOnlyMySessions && (
              <span className="text-xs text-gray-400 italic">
                Other filters are disabled
              </span>
            )}
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedGenre || selectedCity || isOnlyMySessions) && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-gray-300">Active filters:</span>
              {searchQuery && !isOnlyMySessions && ( // ✅ Hide if My Sessions active
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  Search: &quot;{searchQuery}&quot;
                </span>
              )}
              {selectedGenre && !isOnlyMySessions && ( // ✅ Hide if My Sessions active
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  Genre: {selectedGenre}
                </span>
              )}
              {selectedCity && !isOnlyMySessions && ( // ✅ Hide if My Sessions active
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
                onClick={() => fetchSessions()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : sessions.length === 0 ? (
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
                  {totalElements} Session{totalElements !== 1 ? 's' : ''} Found  {/* ✅ Use totalElements instead of sessions.length */}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session) => {
                  const style = getGenreStyle(session.genre?.name);
                  const isLive = new Date(session.dateTime) <= new Date();
                  const currentParticipants = session.currentParticipants;
                  const progressPercentage = (currentParticipants / session.maxParticipants) * 100;

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

                  return (
                    <div 
                      key={session.id} 
                      className={`bg-gradient-to-br ${style.gradient} border ${style.border} rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer`}
                      onClick={() => router.push(`/sessions/${session.id}`)}
                    >
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between mb-4">
                        <h3 className="font-bold text-lg flex items-center gap-2 break-words">
                          <span>{style.emoji}</span>
                          <span className="break-words whitespace-normal">{session.title}</span>
                        </h3>
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


        {/* Pagination - COMPLETELY REPLACE THIS SECTION */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0 || loading}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              
              {(() => {
                const pages = [];
                const maxPagesToShow = 5;
                let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
                let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
                
                // Adjust start if we're near the end
                if (endPage - startPage < maxPagesToShow - 1) {
                  startPage = Math.max(0, endPage - maxPagesToShow + 1);
                }
                
                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => handlePageChange(i)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed ${
                        i === currentPage
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                }
                
                return pages;
              })()}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1 || loading}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}


        {/* Host Modal */}
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
