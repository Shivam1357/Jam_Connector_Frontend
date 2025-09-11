// src/app/dashboard/page.js
'use client'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { genresList } from '@/data/genres' // Import your genres data
import { sessionService } from '@/services/sessionService'

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false) // Modal state

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router]);


  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    router.push('/login')
  }

  // Handle create session modal
  const handleCreateSession = async (sessionData) => {
    try {
      console.log('Creating session:', sessionData)
      
      // ✅ CORRECT WAY to log FormData contents
      console.log('=== FormData Contents ===')
      for (const [key, value] of sessionData.entries()) {
        console.log(`${key}:`, value)
      }

      // TODO: Call your session creation API here
      const result = await sessionService.createSession(sessionData)
      console.log(result);
      // setShowCreateModal(false);
      alert('Session created successfully!')
      // Optionally refresh session list
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Failed to create session. Please try again.')
    }
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
      {/* Header - Same as before */}
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

        {/* Create Session Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span>🎵</span>
              Create Jam Session
            </h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => setShowCreateModal(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg"
              >
                🚀 Start New Jam Session
              </button>
            </div>
          </div>
        </div>

        {/* Join Session Section */}
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

        {/* Recent Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

      {/* Create Session Modal */}
      {showCreateModal && (
        <CreateSessionModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSession}
          genres={genresList}
        />
      )}
    </div>
  )
}



// CreateSessionModal Component
function CreateSessionModal({ onClose, onSubmit, genres }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    isOnlyMusicians: false,
    genre: '',
    dateTime: '',
    maxParticipants: 5,
    isPublic: true,
    coverPhoto: null,
    coverPhotoFile: null,
    address: {
      label: '',
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle regular input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }))
  }

  // Handle address input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }))
  }

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setFormData(prev => ({
        ...prev,
        coverPhoto: previewUrl,
        coverPhotoFile: file
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add all form fields
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('isOnlyMusicians', formData.isOnlyMusicians)
      submitData.append('genre', formData.genre)
      submitData.append('dateTime', formData.dateTime)
      submitData.append('maxParticipants', formData.maxParticipants)
      submitData.append('isPublic', formData.isPublic)
      
      // Add address fields
      submitData.append('address.label', formData.address.label)
      submitData.append('address.street', formData.address.street)
      submitData.append('address.city', formData.address.city)
      submitData.append('address.state', formData.address.state)
      submitData.append('address.country', formData.address.country)
      submitData.append('address.postalCode', formData.address.postalCode)
      
      // Add file if selected
      if (formData.coverPhotoFile) {
        submitData.append('coverPhoto', formData.coverPhotoFile)
      }
      
      
      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
       setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Jam Session</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Session Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
              placeholder="e.g., Evening Jazz Session"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 resize-none"
              placeholder="Describe your jam session..."
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre *
            </label>
            <select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
            >
              <option value="">Select a genre</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.name} className="bg-gray-800">
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Date & Time *
            </label>
            <input
              type="datetime-local"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
            />
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Participants
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              max="50"
              className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300"
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isOnlyMusicians"
                id="isOnlyMusicians"
                checked={formData.isOnlyMusicians}
                onChange={handleChange}
                className="w-4 h-4 text-orange-500 bg-white/20 border-white/30 rounded focus:ring-orange-500/50"
              />
              <label htmlFor="isOnlyMusicians" className="text-sm text-gray-300">
                Musicians only (exclude listeners)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isPublic"
                id="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
                className="w-4 h-4 text-orange-500 bg-white/20 border-white/30 rounded focus:ring-orange-500/50"
              />
              <label htmlFor="isPublic" className="text-sm text-gray-300">
                Public session (anyone can join)
              </label>
            </div>
          </div>

          {/* Cover Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Cover Photo (Optional)
            </label>
            <div className="space-y-3">
              <input
                type="file"
                accept="image/*"
                name="coverPhoto"
                onChange={handleFileChange}
                className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
              />
              
              {/* Preview Image */}
              {formData.coverPhoto && (
                <div className="mt-3">
                  <img
                    src={formData.coverPhoto}
                    alt="Cover preview"
                    className="w-full h-32 object-cover rounded-xl border border-white/30"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h4 className="text-lg font-semibold text-blue-400 border-b border-blue-400/30 pb-2 mb-4 flex items-center gap-2">
              📍 Event Location *
            </h4>
            
            <div className="space-y-4">
              {/* Address Label */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location Label
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.address.label}
                  onChange={handleAddressChange}
                  placeholder="e.g., Music Studio, Community Center"
                  className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={handleAddressChange}
                  required
                  placeholder="123 Main Street"
                  className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    required
                    placeholder="City"
                    className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    required
                    placeholder="State"
                    className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Country and Postal Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.address.country}
                    onChange={handleAddressChange}
                    required
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
                    value={formData.address.postalCode}
                    onChange={handleAddressChange}
                    placeholder="12345"
                    className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-gray-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </div>
              ) : (
                '🚀 Create Session'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
