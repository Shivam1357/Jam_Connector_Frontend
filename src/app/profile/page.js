// src/app/profile/page.js - Updated to use UserContext
'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { profile, loading: userLoading, updateProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    profilePictureUrl: '',
    bio: '',
    role: 'LISTENER',
    selectedGenres: [],
    selectedInstruments: [],
    address: {
      label: '',
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    }
  });

  // Mock data for genres and instruments
  const [genres, setGenres] = useState([]);
  const [instruments, setInstruments] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router, loading]);

  // Load mock data and set profile data when profile is fetched
  useEffect(() => {
    const loadData = async () => {
      try {
        // Mock genres and instruments
        const mockGenres = [
          { id: 1, name: 'Rock', description: 'Heavy guitar-driven music', imageUrl: '/genres/rock.jpg' },
          { id: 2, name: 'Jazz', description: 'Improvised musical style', imageUrl: '/genres/jazz.jpg' },
          { id: 3, name: 'Classical', description: 'Traditional orchestral music', imageUrl: '/genres/classical.jpg' },
          { id: 4, name: 'Pop', description: 'Popular mainstream music', imageUrl: '/genres/pop.jpg' },
          { id: 5, name: 'Hip-Hop', description: 'Rhythmic spoken lyrics', imageUrl: '/genres/hiphop.jpg' },
          { id: 6, name: 'Blues', description: 'Soulful expressive music', imageUrl: '/genres/blues.jpg' },
          { id: 7, name: 'Electronic', description: 'Digital and synthesized music', imageUrl: '/genres/electronic.jpg' },
          { id: 8, name: 'Country', description: 'Rural American folk music', imageUrl: '/genres/country.jpg' },
          { id: 9, name: 'R&B', description: 'Rhythm and blues', imageUrl: '/genres/rnb.jpg' },
          { id: 10, name: 'Reggae', description: 'Jamaican rhythmic music', imageUrl: '/genres/reggae.jpg' }
        ];

        const mockInstruments = [
          { id: 1, name: 'Guitar', description: 'Stringed musical instrument', imageUrl: '/instruments/guitar.jpg' },
          { id: 2, name: 'Piano', description: 'Keyboard instrument', imageUrl: '/instruments/piano.jpg' },
          { id: 3, name: 'Drums', description: 'Percussion instrument set', imageUrl: '/instruments/drums.jpg' },
          { id: 4, name: 'Violin', description: 'Bowed string instrument', imageUrl: '/instruments/violin.jpg' },
          { id: 5, name: 'Bass Guitar', description: 'Low-pitched guitar', imageUrl: '/instruments/bass.jpg' },
          { id: 6, name: 'Saxophone', description: 'Woodwind instrument', imageUrl: '/instruments/saxophone.jpg' },
          { id: 7, name: 'Trumpet', description: 'Brass wind instrument', imageUrl: '/instruments/trumpet.jpg' },
          { id: 8, name: 'Flute', description: 'Woodwind instrument', imageUrl: '/instruments/flute.jpg' },
          { id: 9, name: 'Cello', description: 'Large string instrument', imageUrl: '/instruments/cello.jpg' },
          { id: 10, name: 'Vocals', description: 'Human voice as instrument', imageUrl: '/instruments/vocals.jpg' }
        ];

        setGenres(mockGenres);
        setInstruments(mockInstruments);

      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  // Update form data when profile is loaded from backend
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        profilePictureUrl: profile.profilePictureUrl || '',
        bio: profile.bio || '',
        role: profile.role || 'LISTENER',
        selectedGenres: profile.selectedGenres || [],
        selectedInstruments: profile.selectedInstruments || [],
        address: profile.address || {
          label: '',
          street: '',
          city: '',
          state: '',
          country: '',
          postalCode: ''
        }
      });
    } else if (user) {
      // Fallback to auth user data if profile not loaded yet
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'LISTENER'
      }));
    }
  }, [profile, user]);

  // Handle input changes for basic fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  // Handle genre toggle
  const handleGenreToggle = (genreName) => {
    setProfileData(prev => ({
      ...prev,
      selectedGenres: prev.selectedGenres.includes(genreName)
        ? prev.selectedGenres.filter(name => name !== genreName)
        : [...prev.selectedGenres, genreName]
    }));
  };

  // Handle instrument toggle
  const handleInstrumentToggle = (instrumentName) => {
    setProfileData(prev => ({
      ...prev,
      selectedInstruments: prev.selectedInstruments.includes(instrumentName)
        ? prev.selectedInstruments.filter(name => name !== instrumentName)
        : [...prev.selectedInstruments, instrumentName]
    }));
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file);
      setProfileData(prev => ({
        ...prev,
        profilePictureUrl: file.name
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Updating complete profile:', profileData);
      
      const result = await updateProfile(profileData);
      
      if (result.success) {
        alert('Profile updated successfully!');
      } else {
        alert(`Failed to update profile: ${result.error}`);
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

   // Show loading while profile is being fetched
  if (userLoading || loading) {
    return (
      <div className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }




  return (
  <div className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#2a0a3a] text-white min-h-screen py-8 px-5 font-sans relative overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
    </div>

    <div className="relative z-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Your Profile
        </h1>
        <p className="text-gray-400">Customize your musical identity</p>
      </div>

      {/* Profile Form */}
      <div className="bg-white/10 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-orange-400 border-b border-orange-400/30 pb-2 flex items-center gap-2">
              👤 Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  required
                  disabled
                  className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={profileData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
              />
            </div>
          </div>

          {/* Profile Picture */}
          <div>
            <h3 className="text-xl font-semibold text-purple-400 border-b border-purple-400/30 pb-2 mb-4 flex items-center gap-2">
              📸 Profile Picture
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload New Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-xl font-semibold text-blue-400 border-b border-blue-400/30 pb-2 mb-4 flex items-center gap-2">
              📍 Address
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={profileData.address.label}
                  onChange={handleAddressChange}
                  placeholder="e.g., Home, Studio, Office"
                  className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  name="street"
                  value={profileData.address.street}
                  onChange={handleAddressChange}
                  placeholder="123 Main Street"
                  className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={profileData.address.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={profileData.address.country}
                    onChange={handleAddressChange}
                    placeholder="Country"
                    className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={profileData.address.postalCode}
                    onChange={handleAddressChange}
                    placeholder="12345"
                    className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <h3 className="text-xl font-semibold text-pink-400 border-b border-pink-400/30 pb-2 mb-4 flex items-center gap-2">
              🎭 Profile Type
            </h3>
            <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-sm border border-white/20">
              <button
                type="button"
                onClick={() => setProfileData(prev => ({ ...prev, role: 'MUSICIAN' }))}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  profileData.role === 'MUSICIAN'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎸 Musician
              </button>
              <button
                type="button"
                onClick={() => setProfileData(prev => ({ ...prev, role: 'LISTENER' }))}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  profileData.role === 'LISTENER'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🎧 Listener
              </button>
            </div>
          </div>

          {/* Genres Section */}
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 border-b border-cyan-400/30 pb-2 mb-4 flex items-center gap-2">
              🎵 {profileData.role === 'MUSICIAN' ? 'Music Genres You Play' : 'Favorite Genres'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => handleGenreToggle(genre.name)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    profileData.selectedGenres.includes(genre.name)
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Selected: {profileData.selectedGenres.length} genres
            </p>
          </div>

          {/* Instruments Section - Only for Musicians */}
          {profileData.role === 'MUSICIAN' && (
            <div>
              <h3 className="text-xl font-semibold text-yellow-400 border-b border-yellow-400/30 pb-2 mb-4 flex items-center gap-2">
                🎼 Instruments You Play
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {instruments.map((instrument) => (
                  <button
                    key={instrument.id}
                    type="button"
                    onClick={() => handleInstrumentToggle(instrument.name)}
                    className={`p-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      profileData.selectedInstruments.includes(instrument.name)
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
                    }`}
                  >
                    {instrument.name}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Selected: {profileData.selectedInstruments.length} instruments
              </p>
            </div>
          )}

          {/* Bio Section */}
          <div>
            <h3 className="text-xl font-semibold text-green-400 border-b border-green-400/30 pb-2 mb-4 flex items-center gap-2">
              📝 About You
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio / Description
              </label>
              <textarea
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
                rows="4"
                placeholder={profileData.role === 'MUSICIAN' ? 
                  "Tell us about your musical journey, experience, style, and what makes you unique as a musician..." : 
                  "Tell us about your music preferences, favorite artists, concerts you've attended, and what you love about music..."
                }
                className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 resize-none"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl ${
                profileData.role === 'MUSICIAN'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 hover:shadow-orange-500/50'
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 hover:shadow-purple-500/50'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating Profile...
                </div>
              ) : (
                `💾 Save Complete Profile`
              )}
            </button>
          </div>
        </form>
      </div>



      {/* Additional Actions */}
      <div className="text-center mt-6">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-gray-400 hover:text-orange-400 font-medium transition-colors duration-300"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  </div>
);

}
