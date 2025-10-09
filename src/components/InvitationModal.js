// components/InvitationModal.js
import React, { useState, useEffect } from 'react'
import ProfilePictureImage from './ProfilePictureImage'

export default function InvitationModal({ 
  isOpen, 
  onClose, 
  musician, 
  session, 
  onSendInvite, 
  isLoading 
}) {
  const [inviteMessage, setInviteMessage] = useState('')

  useEffect(() => {
    if (isOpen && musician && session) {
      setInviteMessage(
        `Hi ${musician.name}, I would like to invite you to join my ${session.genre?.name} session "${session.title}". Hope you can make it!`
      )
    }
  }, [isOpen, musician, session])

  const handleSend = () => {
    onSendInvite(inviteMessage)
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen || !musician) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Send Invitation</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            ×
          </button>
        </div>
        
        {/* Musician Info */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-white/5 rounded-xl">
          <div className="w-12 h-12">
            <ProfilePictureImage
              publicId={musician.profilePictureId}
              name={musician.name}
              size="sm"
              alt="Profile"
            />
          </div>
          <div>
            <h4 className="font-semibold text-white">{musician.name}</h4>
            <p className="text-purple-400 text-sm capitalize">{musician.role?.toLowerCase()}</p>
            {musician.yearsOfExperience && (
              <p className="text-gray-400 text-xs">{musician.yearsOfExperience} years experience</p>
            )}
          </div>
        </div>

        {/* Session Info */}
        <div className="mb-6 p-4 bg-white/5 rounded-xl">
          <h5 className="font-medium text-white mb-2">Session Details:</h5>
          <div className="text-sm text-gray-300 space-y-1">
            <p><span className="text-orange-400">Title:</span> {session.title}</p>
            <p><span className="text-orange-400">Genre:</span> {session.genre?.name}</p>
            <p><span className="text-orange-400">Date:</span> {new Date(session.dateTime).toLocaleDateString()}</p>
            <p><span className="text-orange-400">Time:</span> {new Date(session.dateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Invitation Message
          </label>
          <textarea
            value={inviteMessage}
            onChange={(e) => setInviteMessage(e.target.value)}
            rows="4"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors resize-none"
            placeholder="Write a personalized invitation message..."
          />
          <p className="text-xs text-gray-400 mt-2">
            {inviteMessage.length}/500 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || !inviteMessage.trim() || inviteMessage.length > 500}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Send Invitation
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
