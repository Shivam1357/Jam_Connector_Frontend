"use client"
export const dynamic = "force-dynamic";
import React, { useState, useEffect, useCallback, useMemo, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { musiciansService } from '@/services/musiciansService';
import { genresList } from '@/data/genres';
import { instrumentsList } from '@/data/instruments';
import SocialMediaLinks from '@/components/SocialMediaLinks';
import ProfilePictureImage from '@/components/ProfilePictureImage';

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

const MusiciansPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useNotification();

  // State management
  const [musicians, setMusicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [minExperience, setMinExperience] = useState('');
  const [maxExperience, setMaxExperience] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modal states
  const [isMusicianModalOpen, setIsMusicianModalOpen] = useState(false);
  const [selectedMusician, setSelectedMusician] = useState(null);

  // Debounced values for API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedMinExperience = useDebounce(minExperience, 500);
  const debouncedMaxExperience = useDebounce(maxExperience, 500);

  
  const updateURL = useCallback((filters) => {
    const params = new URLSearchParams();
    
    if (filters.name) params.set('name', filters.name);
    if (filters.city) params.set('city', filters.city);
    if (filters.genre) params.set('genre', filters.genre);
    if (filters.instrument) params.set('instrument', filters.instrument);
    if (filters.minExperience) params.set('minExperience', filters.minExperience);
    if (filters.maxExperience) params.set('maxExperience', filters.maxExperience);
    if (filters.page !== undefined && filters.page !== 0) params.set('page', filters.page);
    
    const queryString = params.toString();
    router.push(`/musicians${queryString ? `?${queryString}` : ''}`, { scroll: false });
  }, [router]);


  // Get unique cities from musicians (memoized)
  const cities = useMemo(() => {
    const uniqueCities = [...new Set(musicians.map(musician => musician.city).filter(Boolean))];
    return uniqueCities.sort();
  }, [musicians]);

  const pageSize = 6;

    // Initialize filters from URL params (only once) and fetch
  useEffect(() => {
    const urlName = searchParams.get('name') || '';
    const urlCity = searchParams.get('city') || '';
    const urlGenre = searchParams.get('genre') || '';
    const urlInstrument = searchParams.get('instrument') || '';
    const urlMinExp = searchParams.get('minExperience') || '';
    const urlMaxExp = searchParams.get('maxExperience') || '';
    const urlPage = parseInt(searchParams.get('page')) || 0;

    setSearchQuery(urlName);
    setSelectedCity(urlCity);
    setSelectedGenre(urlGenre);
    setSelectedInstrument(urlInstrument);
    setMinExperience(urlMinExp);
    setMaxExperience(urlMaxExp);
    setCurrentPage(urlPage);

    // ✅ Fetch immediately with URL params
    fetchMusiciansWithParams({
      name: urlName,
      city: urlCity,
      genre: urlGenre,
      instrument: urlInstrument,
      minExperience: urlMinExp,
      maxExperience: urlMaxExp,
      page: urlPage
    });
  }, []); // Empty dependency - run only once

  // Add this function before fetchMusicians
  const fetchMusiciansWithParams = useCallback(async (params) => {
    try {
      setLoading(true);
      setError(null);

      const { name = '', city = '', genre = '', instrument = '', minExperience = '', maxExperience = '', page = 0 } = params;
      
      const searchParams = {};
      if (name.trim()) searchParams.name = name.trim();
      if (city) searchParams.city = city;
      if (genre) searchParams.genres = [genre];
      if (instrument) searchParams.instruments = [instrument];
      if (minExperience) searchParams.minExperience = parseInt(minExperience);
      if (maxExperience) searchParams.maxExperience = parseInt(maxExperience);

      const response = await musiciansService.searchMusicians(
        searchParams,
        page,
        pageSize,
        'name,asc'
      );

      // console.log('Initial fetch with URL params:', response.content);

      setMusicians(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);

    } catch (error) {
      console.error('Failed to fetch musicians:', error);
      setError(error.message || 'Failed to load musicians');
      showError(error.message || 'Failed to load musicians. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Fetch musicians with search and pagination (memoized)
  const fetchMusicians = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);

      const page = resetPage ? 0 : currentPage;
      
      const searchParams = {};
      if (debouncedSearchQuery.trim()) searchParams.name = debouncedSearchQuery.trim();
      if (selectedCity) searchParams.city = selectedCity;
      if (selectedGenre) searchParams.genres = [selectedGenre];
      if (selectedInstrument) searchParams.instruments = [selectedInstrument];
      if (debouncedMinExperience) searchParams.minExperience = parseInt(debouncedMinExperience);
      if (debouncedMaxExperience) searchParams.maxExperience = parseInt(debouncedMaxExperience);

      const response = await musiciansService.searchMusicians(
        searchParams,
        page,
        pageSize,
        'name,asc'
      );

      // console.log(response.content);

      setMusicians(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);

      if (resetPage && currentPage !== 0) {
        setCurrentPage(0);
      }

      // ❌ Remove updateURL from here completely

    } catch (error) {
      console.error('Failed to fetch musicians:', error);
      setError(error.message || 'Failed to load musicians');
      showError(error.message || 'Failed to load musicians. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearchQuery, 
    selectedCity, 
    selectedGenre, 
    selectedInstrument, 
    debouncedMinExperience, 
    debouncedMaxExperience, 
    currentPage, 
    showError
  ]);



  // Update URL when filters or page change
  useEffect(() => {
    updateURL({
      name: debouncedSearchQuery,
      city: selectedCity,
      genre: selectedGenre,
      instrument: selectedInstrument,
      minExperience: debouncedMinExperience,
      maxExperience: debouncedMaxExperience,
      page: currentPage
    });
  }, [
    debouncedSearchQuery,
    selectedCity,
    selectedGenre,
    selectedInstrument,
    debouncedMinExperience,
    debouncedMaxExperience,
    currentPage,
    updateURL
  ]);



  // Add a ref to track first render
  const isFirstRender = useRef(true);

  // Fetch musicians when debounced search terms or filters change
  useEffect(() => {
    // ✅ Skip first render (already fetched in initialization)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const isInitialLoad = !musicians.length && 
      !debouncedSearchQuery && !selectedCity && !selectedGenre && 
      !selectedInstrument && !debouncedMinExperience && !debouncedMaxExperience;

    if (isInitialLoad) {
      fetchMusicians();
    } else {
      fetchMusicians(true); // Reset to page 0 when filters change
    }
  }, [
    debouncedSearchQuery, 
    selectedCity, 
    selectedGenre, 
    selectedInstrument, 
    debouncedMinExperience, 
    debouncedMaxExperience
  ]);



  // Fetch musicians when page changes (without resetting page)
  useEffect(() => {
    if (musicians.length > 0) { // Only if we have data already
      fetchMusicians(false);
    }
  }, [currentPage]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedGenre('');
    setSelectedInstrument('');
    setSelectedCity('');
    setMinExperience('');
    setMaxExperience('');
    setCurrentPage(0);
    router.push('/musicians', { scroll: false });
  }, [router]);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);




  // Helper functions (memoized)
  const getExperienceColor = useCallback((years) => {
    if (years >= 10) return 'text-green-400';
    if (years >= 5) return 'text-yellow-400';
    return 'text-blue-400';
  }, []);

  // Modal functions
  const openMusicianModal = useCallback((musician) => {
    setSelectedMusician(musician);
    setIsMusicianModalOpen(true);
  }, []);

  const closeMusicianModal = useCallback(() => {
    setIsMusicianModalOpen(false);
    setSelectedMusician(null);
  }, []);


  // Check if any filters are active
  const hasActiveFilters = useMemo(() => 
    searchQuery || selectedGenre || selectedInstrument || selectedCity || minExperience || maxExperience,
    [searchQuery, selectedGenre, selectedInstrument, selectedCity, minExperience, maxExperience]
  );

  // Loading state for initial load
  if (loading && musicians.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading musicians...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Discover Musicians</h1>
          <p className="text-gray-400">Find talented musicians to collaborate with</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          {/* Basic Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="Search musicians by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              />
              {searchQuery !== debouncedSearchQuery && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Genre Filter */}
            <div>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">All Genres</option>
                {genresList.map(genre => (
                  <option key={genre.id} value={genre.name}>{genre.name}</option>
                ))}
              </select>
            </div>

            {/* Instrument Filter */}
            <div>
              <select
                value={selectedInstrument}
                onChange={(e) => setSelectedInstrument(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">All Instruments</option>
                {instrumentsList.map(instrument => (
                  <option key={instrument.id} value={instrument.name}>{instrument.name}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-2 transition-colors"
            >
              {showAdvancedFilters ? '▼' : '▶'} Advanced Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-800/30 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Min Experience (years)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    value={minExperience}
                    onChange={(e) => setMinExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  {minExperience !== debouncedMinExperience && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Experience (years)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="50"
                    min="0"
                    value={maxExperience}
                    onChange={(e) => setMaxExperience(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  {maxExperience !== debouncedMaxExperience && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
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
              {selectedInstrument && (
                <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                  Instrument: {selectedInstrument}
                </span>
              )}
              {selectedCity && (
                <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                  City: {selectedCity}
                </span>
              )}
              {(minExperience || maxExperience) && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                  Experience: {minExperience || 0}-{maxExperience || '∞'} years
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

        {/* Results */}
        <div className="mb-8">
          {error ? (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">
                <p>{error}</p>
              </div>
              <button 
                onClick={() => fetchMusicians()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : musicians.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-white mb-2">No musicians found</h3>
              <p className="text-gray-400 mb-4">
                {hasActiveFilters
                  ? 'Try adjusting your search criteria or clear filters'
                  : 'No musicians available right now'
                }
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {loading ? 'Searching...' : `${totalElements} Musician${totalElements !== 1 ? 's' : ''} Found`}
                </h2>
                {totalPages > 0 && (
                  <div className="text-gray-400">
                    Page {currentPage + 1} of {totalPages}
                  </div>
                )}
              </div>

              {/* Loading overlay for pagination */}
              <div className="relative">
                {loading && (
                  <div className="absolute inset-0 bg-gray-900/50 z-10 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                {/* Musicians Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {musicians.map((musician) => (
                    <div 
                      key={musician.id} 
                      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                      onClick={() => openMusicianModal(musician)}
                    >
                      {/* Profile Picture */}
                      <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                        <ProfilePictureImage
                          publicId={musician.profilePictureId}
                          name={musician.name}
                          size="md"
                          alt="Profile Picture"
                      />
                      </div> 
                      

                      {/* Musician Info */}
                      <div className="text-center">
                        <h3 className="font-bold text-lg text-white mb-1">{musician.name}</h3>
                        {musician.city && (
                          <p className="text-sm text-gray-400 mb-2">📍 {musician.city}</p>
                        )}
                        {musician.yearsOfExperience != null && (
                          <p className={`text-sm mb-2 ${getExperienceColor(musician.yearsOfExperience)}`}>
                            {musician.yearsOfExperience} years experience
                          </p>
                        )}
                      </div>

                      {/* Genres */}
                      {musician.genres && musician.genres.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-purple-400 mb-1 text-center">Genres</h4>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {musician.genres.slice(0, 3).map(genre => (
                              <span key={genre} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                {genre}
                              </span>
                            ))}
                            {musician.genres.length > 3 && (
                              <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                                +{musician.genres.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Instruments */}
                      {musician.instruments && musician.instruments.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-orange-400 mb-1 text-center">Instruments</h4>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {musician.instruments.slice(0, 3).map(instrument => (
                              <span key={instrument} className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                                {instrument}
                              </span>
                            ))}
                            {musician.instruments.length > 3 && (
                              <span className="px-2 py-1 bg-gray-500/20 text-gray-300 text-xs rounded-full">
                                +{musician.instruments.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Bio Preview */}
                      {musician.bio && (
                        <p className="text-sm text-gray-400 text-center line-clamp-2 mb-3">
                          {musician.bio}
                        </p>
                      )}

                      {/* Social Media Icons */}
                      <div className="flex justify-center mb-4" onClick={(e) => e.stopPropagation()}>
                        <SocialMediaLinks
                          instagramUrl={musician.instagramUrl}
                          spotifyUrl={musician.spotifyUrl}
                          youtubeUrl={musician.youtubeUrl}
                          twitterUrl={musician.twitterUrl}
                          tiktokUrl={musician.tiktokUrl}
                        />
                      </div>

                      {/* View Profile Button */}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openMusicianModal(musician);
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
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

              </div>
            </>
          )}
        </div>

        {/* Musician Detail Modal */}
        {isMusicianModalOpen && selectedMusician && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={closeMusicianModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
              >
                ×
              </button>
              
              <div className="text-center">
                {/* Profile Picture */}
                <div className="w-32 h-32 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  <ProfilePictureImage
                      publicId={selectedMusician.profilePictureId}
                      name={selectedMusician.name}
                      size="lg"
                      alt="Profile Picture"
                  />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">{selectedMusician.name}</h2>
                
                {/* Location */}
                {(selectedMusician.city || selectedMusician.state) && (
                  <p className="text-purple-400 mb-4">
                    📍 {[selectedMusician.city, selectedMusician.state, selectedMusician.country]
                      .filter(Boolean).join(', ')}
                  </p>
                )}

                {/* Experience */}
                {selectedMusician.yearsOfExperience != null && (
                  <div className="mb-4 text-left">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Years of Experience</h3>
                    <p className={`text-sm bg-gray-700 p-3 rounded-lg ${getExperienceColor(selectedMusician.yearsOfExperience)}`}>
                      {selectedMusician.yearsOfExperience} years
                    </p>
                  </div>
                )}
                
                {/* Bio */}
                {selectedMusician.bio && (
                  <div className="mb-4 text-left">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Bio</h3>
                    <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded-lg">
                      {selectedMusician.bio}
                    </p>
                  </div>
                )}

                {/* Genres */}
                {selectedMusician.genres && selectedMusician.genres.length > 0 && (
                  <div className="mb-4 text-left">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMusician.genres.map(genre => (
                        <span key={genre} className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Instruments */}
                {selectedMusician.instruments && selectedMusician.instruments.length > 0 && (
                  <div className="mb-4 text-left">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Instruments</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedMusician.instruments.map(instrument => (
                        <span key={instrument} className="px-3 py-1 bg-orange-500/20 text-orange-300 text-sm rounded-full">
                          {instrument}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Contact */}
                {selectedMusician.phoneNumber && (
                  <div className="mb-4 text-left">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Contact</h3>
                    <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded-lg">
                      {selectedMusician.phoneNumber}
                    </p>
                  </div>
                )}

                {/* Social Media */}
                {(selectedMusician.instagramUrl || selectedMusician.spotifyUrl || selectedMusician.youtubeUrl 
                || selectedMusician.twitterUrl || selectedMusician.tiktokUrl) && (
                  <div className="mb-4 text-left">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Social Media</h3>
                    <div className="flex items-center gap-5 justify-center">
                      <SocialMediaLinks
                        instagramUrl={selectedMusician.instagramUrl}
                        spotifyUrl={selectedMusician.spotifyUrl}
                        youtubeUrl={selectedMusician.youtubeUrl}
                        twitterUrl={selectedMusician.twitterUrl}
                        tiktokUrl={selectedMusician.tiktokUrl}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6">
                  <button 
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={closeMusicianModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusiciansPage;
