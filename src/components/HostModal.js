import React, { useState } from 'react'
import ProfilePictureImage from './ProfilePictureImage'
import SocialMediaLinks from './SocialMediaLinks'

export default function HostModal({ 
  isOpen, 
  onClose, 
  host 
}) {
  const [isImageZoomed, setIsImageZoomed] = useState(false)

  if (!isOpen || !host) return null

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleImageZoomBackdrop = (e) => {
    if (e.target === e.currentTarget) {
      setIsImageZoomed(false)
    }
  }

  return (
    <>
      {/* Main Modal */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl font-bold"
          >
            ×
          </button>
          
          <div className="text-center">
            {/* Clickable Profile Picture */}
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-4 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setIsImageZoomed(true)}
            >
              <ProfilePictureImage
                publicId={host.profilePictureId}
                name={host.name}
                size="md"
                alt="Profile Picture"
              />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">{host.name}</h2>
            <p className="text-purple-400 mb-4 capitalize">{host.role?.toLowerCase()}</p>
            
            {host.bio && (
              <div className="mb-4 text-left">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Bio</h3>
                <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded-lg">{host.bio}</p>
              </div>
            )}
            
            {host.phoneNumber && (
              <div className="mb-4 text-left">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Contact</h3>
                <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded-lg">{host.phoneNumber}</p>
              </div>
            )}

            {(host.instagramUrl || host.spotifyUrl || host.youtubeUrl || host.twitterUrl || host.tiktokUrl) && (
              <div className="mb-4 text-left">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Social Media</h3>
                <div className="flex items-center gap-5 justify-center">
                  <SocialMediaLinks
                    instagramUrl={host.instagramUrl}
                    spotifyUrl={host.spotifyUrl}
                    youtubeUrl={host.youtubeUrl}
                    twitterUrl={host.twitterUrl}
                    tiktokUrl={host.tiktokUrl}
                  />
                </div>
              </div>
            )}

            {host.yearsOfExperience != null && (
              <div className="mb-4 text-left">
                <h3 className="text-sm font-semibold text-gray-300 mb-2">Years of Experience</h3>
                <p className="text-gray-400 text-sm bg-gray-700 p-3 rounded-lg">{host.yearsOfExperience} years</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple Full Screen Image */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]"
          onClick={handleImageZoomBackdrop}
        >
          <button
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-4 right-4 text-white text-3xl font-bold"
          >
            ×
          </button>

          <div className="w-80 h-80">
            <ProfilePictureImage
              publicId={host.profilePictureId}
              name={host.name}
              size="2xl"
              alt="Profile Picture"
            />
          </div>
        </div>
      )}
    </>
  )
}
