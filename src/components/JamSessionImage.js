// components/JamSessionImage.js
import React from 'react';
import { useFileUrl } from '../hooks/useFileUrl';

const JamSessionImage = ({ 
  publicId, 
  alt = "Jam Session Cover", 
  width = 'auto', 
  height = 'auto',
  className = "",
  fallbackIcon = "🎸"
}) => {
  const { url, loading, error } = useFileUrl(publicId, {
    width: width !== 'auto' ? width : undefined,
    height: height !== 'auto' ? height : undefined,
    crop: 'fill',
    quality: 'auto'
  });

  // Loading state
  if (loading) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Error or no image state
  if (error || !url) {
    return (
      <div className={`w-full h-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-6xl ${className}`}>
        {fallbackIcon}
      </div>
    );
  }

  // Success state with image
  return (
    <div className={`w-full h-full relative overflow-hidden ${className}`}>
      <img
        src={url}
        alt={alt}
        className="w-full h-full"
        onError={(e) => {
          // Fallback to icon if image fails to load
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
        onLoad={(e) => {
          // Hide fallback when image loads successfully
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'none';
          }
        }}
      />
      {/* Fallback div (hidden by default) */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center text-6xl"
        style={{ display: 'none' }}
      >
        {fallbackIcon}
      </div>
    </div>
  );
};

export default JamSessionImage;