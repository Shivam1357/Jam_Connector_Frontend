// components/ProfilePictureImage.js
import React from 'react';
import { useFileUrl } from '../hooks/useFileUrl';

const ProfilePictureImage = ({ 
  publicId, 
  name = "",
  alt = "Profile Picture", 
  size = "md", // xs, sm, md, lg, xl, 2xl
  className = "",
  showBorder = true,
  borderColor = "border-white/20",
  gradientFrom = "from-orange-400",
  gradientTo = "to-purple-600",
  fallbackBg = "bg-gradient-to-br"
}) => {
  const { url, loading, error } = useFileUrl(publicId, {
    width: getSizeInPixels(size),
    height: getSizeInPixels(size),
    crop: 'fill',
    quality: 'auto'
  });

  // Size mapping
  const sizeClasses = {
    xs: "w-8 h-8 text-xs",
    sm: "w-12 h-12 text-sm", 
    md: "w-20 h-20 text-2xl",
    lg: "w-32 h-32 text-4xl",
    xl: "w-40 h-40 text-5xl",
    "2xl": "w-48 h-48 text-6xl"
  };

  function getSizeInPixels(size) {
    const sizeMap = {
      xs: 32,
      sm: 48,
      md: 80,
      lg: 128,
      xl: 160,
      "2xl": 192
    };
    return sizeMap[size] || 80;
  }

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    rounded-full 
    flex 
    items-center 
    justify-center 
    font-bold 
    relative 
    overflow-hidden
    ${showBorder ? `border-2 ${borderColor}` : ''}
    ${className}
  `.trim();

  // Loading state
  if (loading) {
    return (
      <div className={`${baseClasses} ${fallbackBg} ${gradientFrom} ${gradientTo}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
      </div>
    );
  }

  // Error or no image state - show initials
  if (error || !url || !publicId) {
    return (
      <div className={`${baseClasses} ${fallbackBg} ${gradientFrom} ${gradientTo} text-white shadow-lg`}>
        <span className="select-none">
          {getInitials(name)}
        </span>
      </div>
    );
  }

  // Success state with image
  return (
    <div className={baseClasses}>
      <img
        src={url}
        alt={alt}
        className="w-full h-full object-cover rounded-full"
        onError={(e) => {
          // Replace with fallback when image fails
          const parent = e.target.parentElement;
          parent.innerHTML = `
            <div class="${fallbackBg} ${gradientFrom} ${gradientTo} w-full h-full rounded-full flex items-center justify-center text-white shadow-lg">
              <span class="select-none ${sizeClasses[size].split(' ')[2]}">${getInitials(name)}</span>
            </div>
          `;
        }}
      />
    </div>
  );
};

export default ProfilePictureImage;
