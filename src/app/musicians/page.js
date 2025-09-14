// pages/musicians/page.js
'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/contexts/NotificationContext';
import { musiciansService } from '@/services/musiciansService';
import { genresList } from '@/data/genres';
import { instrumentsList } from '@/data/instruments';
import SocialMediaLinks from '@/components/SocialMediaLinks';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

export default function MusiciansPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { showError, showSuccess } = useNotification();

  // State management
  const [musicians, setMusicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Search and filter state
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    city: '',
    genres: [],
    instruments: [],
    minExperience: '',
    maxExperience: ''
  });

  // Pagination settings
  const pageSize = 12;
  const sortBy = 'name,asc';

  // Modal state for musician details
  const [selectedMusician, setSelectedMusician] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize filters from URL params
  useEffect(() => {
    const urlName = searchParams.get('name') || '';
    const urlCity = searchParams.get('city') || '';
    const urlGenres = searchParams.getAll('genres') || [];
    const urlInstruments = searchParams.getAll('instruments') || [];
    const urlMinExp = searchParams.get('minExperience') || '';
    const urlMaxExp = searchParams.get('maxExperience') || '';
    const urlPage = parseInt(searchParams.get('page')) || 0;

    setSearchFilters({
      name: urlName,
      city: urlCity,
      genres: urlGenres,
      instruments: urlInstruments,
      minExperience: urlMinExp,
      maxExperience: urlMaxExp
    });
    setCurrentPage(urlPage);
  }, [searchParams]);

  // Fetch musicians
  const fetchMusicians = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await musiciansService.searchMusicians(
        searchFilters,
        currentPage,
        pageSize,
        sortBy
      );

      setMusicians(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('Failed to fetch musicians:', error);
      setError('Failed to load musicians');
      showError('Failed to load musicians. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchFilters, currentPage, showError]);

  // Fetch musicians when filters or page changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchMusicians();
    }
  }, [isAuthenticated, fetchMusicians]);

  // Update URL when filters change
  const updateURL = useCallback((filters, page = 0) => {
    const params = new URLSearchParams();
    
    if (filters.name) params.set('name', filters.name);
    if (filters.city) params.set('city', filters.city);
    if (filters.genres.length > 0) {
      filters.genres.forEach(genre => params.append('genres', genre));
    }
    if (filters.instruments.length > 0) {
      filters.instruments.forEach(instrument => params.append('instruments', instrument));
    }
    if (filters.minExperience) params.set('minExperience', filters.minExperience);
    if (filters.maxExperience) params.set('maxExperience', filters.maxExperience);
    if (page > 0) params.set('page', page.toString());

    const url = params.toString() ? `/musicians?${params.toString()}` : '/musicians';
    router.push(url, { scroll: false });
  }, [router]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...searchFilters, [name]: value };
    setSearchFilters(newFilters);
    setCurrentPage(0);
    updateURL(newFilters, 0);
  };

  // Handle multi-select filters (genres, instruments)
  const handleMultiSelectChange = (type, value) => {
    const newFilters = { ...searchFilters };
    const currentValues = newFilters[type];
    
    if (currentValues.includes(value)) {
      newFilters[type] = currentValues.filter(item => item !== value);
    } else {
      newFilters[type] = [...currentValues, value];
    }
    
    setSearchFilters(newFilters);
    setCurrentPage(0);
    updateURL(newFilters, 0);
  };

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters = {
      name: '',
      city: '',
      genres: [],
      instruments: [],
      minExperience: '',
      maxExperience: ''
    };
    setSearchFilters(clearedFilters);
    setCurrentPage(0);
    updateURL(clearedFilters, 0);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateURL(searchFilters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open musician modal
  const openMusicianModal = (musician) => {
    setSelectedMusician(musician);
    setIsModalOpen(true);
  };

  // Close musician modal
  const closeMusicianModal = () => {
    setIsModalOpen(false);
    setSelectedMusician(null);
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router, authLoading]);

  if (authLoading || loading) {
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
          <button
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Discover Musicians</h1>
          <p className="text-gray-400">Find talented musicians to collaborate with</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="name"
                placeholder="Search musicians by name..."
                value={searchFilters.name}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* City Search */}
            <div className="lg:w-64">
              <input
                type="text"
                name="city"
                placeholder="City..."
                value={searchFilters.city}
                onChange={handleSearchChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:w-auto w-full bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
            >
              <FaFilter />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-600 pt-4 space-y-4">
              {/* Experience Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Min Experience (years)
                  </label>
                  <input
                    type="number"
                    name="minExperience"
                    placeholder="0"
                    min="0"
                    value={searchFilters.minExperience}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Max Experience (years)
                  </label>
                  <input
                    type="number"
                    name="maxExperience"
                    placeholder="50"
                    min="0"
                    value={searchFilters.maxExperience}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Genres */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Genres
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {genresList.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleMultiSelectChange('genres', genre.name)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        searchFilters.genres.includes(genre.name)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Instruments */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instruments
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {instrumentsList.map((instrument) => (
                    <button
                      key={instrument.id}
                      onClick={() => handleMultiSelectChange('instruments', instrument.name)}
                      className={`p-2 rounded-lg text-sm font-medium transition-all ${
                        searchFilters.instruments.includes(instrument.name)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {instrument.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end">
                <button
                  onClick={clearAllFilters}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaTimes />
                  Clear All Filters
                </button>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(searchFilters.name || searchFilters.city || searchFilters.genres.length > 0 || 
            searchFilters.instruments.length > 0 || searchFilters.minExperience || 
            searchFilters.maxExperience) && (
            <div className="border-t border-gray-600 pt-4 mt-4">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-300">Active filters:</span>
                {searchFilters.name && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                    Name: "{searchFilters.name}"
                  </span>
                )}
                {searchFilters.city && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                    City: {searchFilters.city}
                  </span>
                )}
                {searchFilters.genres.map(genre => (
                  <span key={genre} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                    Genre: {genre}
                  </span>
                ))}
                {searchFilters.instruments.map(instrument => (
                  <span key={instrument} className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">
                    Instrument: {instrument}
                  </span>
                ))}
                {(searchFilters.minExperience || searchFilters.maxExperience) && (
                  <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm">
                    Experience: {searchFilters.minExperience || 0}-{searchFilters.maxExperience || '∞'} years
                  </span>
                )}
              </div>
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
                onClick={fetchMusicians}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : musicians.length === 0 && !loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-white mb-2">No musicians found</h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search criteria or clear filters
              </p>
              <button
                onClick={clearAllFilters}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {totalElements} Musician{totalElements !== 1 ? 's' : ''} Found
                </h2>
                <div className="text-gray-400">
                  Page {currentPage + 1} of {totalPages}
                </div>
              </div>

              {/* Musicians Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {musicians.map((musician) => (
                  <div 
                    key={musician.id} 
                    className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => openMusicianModal(musician)}
                  >
                    {/* Profile Picture */}
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {musician.profilePictureUrl ? (
                        <img 
                          src={musician.profilePictureUrl} 
                          alt={musician.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        musician.name?.charAt(0).toUpperCase()
                      )}
                    </div>

                    {/* Musician Info */}
                    <div className="text-center">
                      <h3 className="font-bold text-lg text-white mb-1">{musician.name}</h3>
                      {musician.city && (
                        <p className="text-sm text-gray-400 mb-2">📍 {musician.city}</p>
                      )}
                      {musician.yearsOfExperience && (
                        <p className="text-sm text-purple-400 mb-2">
                          {musician.yearsOfExperience} years experience
                        </p>
                      )}
                    </div>

                    {/* Genres */}
                    {musician.genres && musician.genres.length > 0 && (
                      <div className="mb-3">
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
                    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
                      <SocialMediaLinks
                        instagramUrl={musician.instagramUrl}
                        spotifyUrl={musician.spotifyUrl}
                        youtubeUrl={musician.youtubeUrl}
                        twitterUrl={musician.twitterUrl}
                        tiktokUrl={musician.tiktokUrl}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const pageNumber = Math.max(0, Math.min(currentPage - 2 + index, totalPages - 5 + index));
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg ${
                            pageNumber === currentPage
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          }`}
                        >
                          {pageNumber + 1}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Musician Detail Modal */}
        {isModalOpen && selectedMusician && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeMusicianModal}
          >
            <div 
              className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeMusicianModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
              >
                ×
              </button>
              
              <div className="text-center">
                {/* Profile Picture */}
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {selectedMusician.profilePictureUrl ? (
                    <img 
                      src={selectedMusician.profilePictureUrl} 
                      alt={selectedMusician.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    selectedMusician.name?.charAt(0).toUpperCase()
                  )}
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
                {selectedMusician.yearsOfExperience && (
                  <div className="mb-4 text-left">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2">Years of Experience</h3>
                    <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded-lg">
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
                <div className="mb-4 text-left">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">Social Media</h3>
                  <div className="flex justify-center">
                    <SocialMediaLinks
                      instagramUrl={selectedMusician.instagramUrl}
                      spotifyUrl={selectedMusician.spotifyUrl}
                      youtubeUrl={selectedMusician.youtubeUrl}
                      twitterUrl={selectedMusician.twitterUrl}
                      tiktokUrl={selectedMusician.tiktokUrl}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-6">
                  <button 
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    onClick={() => {
                      // Add contact functionality here
                      showSuccess(`Contact ${selectedMusician.name}`);
                    }}
                  >
                    Contact Musician
                  </button>
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
}
