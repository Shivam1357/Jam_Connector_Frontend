// components/SocialMediaLinks.jsx
import React from 'react';
import { FaInstagram, FaSpotify, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa';

const SocialMediaLinks = ({ instagramUrl, spotifyUrl, youtubeUrl, twitterUrl, tiktokUrl }) => {
  const links = [
    { url: instagramUrl, icon: <FaInstagram />, label: 'Instagram', colorClass: 'text-pink-500 hover:text-pink-400' },
    { url: spotifyUrl, icon: <FaSpotify />, label: 'Spotify', colorClass: 'text-green-500 hover:text-green-400' },
    { url: youtubeUrl, icon: <FaYoutube />, label: 'YouTube', colorClass: 'text-red-600 hover:text-red-500' },
    { url: twitterUrl, icon: <FaTwitter />, label: 'Twitter', colorClass: 'text-blue-400 hover:text-blue-300' },
    { url: tiktokUrl, icon: <FaTiktok />, label: 'TikTok', colorClass: 'text-black hover:text-gray-800' },
  ];

  const openLink = (url) => {
    if (!url) {
      alert('URL not provided');
      return;
    }
    let linkedUrl = url;
    if (!/^https?:\/\//i.test(linkedUrl)) {
      linkedUrl = 'https://' + linkedUrl;
    }
    window.open(linkedUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-5 justify-center">
      {links.map(({ url, icon, label, colorClass }) => 
        url ? (
          <button
            key={label}
            onClick={() => openLink(url)}
            aria-label={label}
            title={label}
            className={`${colorClass} transition-colors text-3xl`}
            type="button"
          >
            {icon}
          </button>
        ) : null
      )}
    </div>
  );
};

export default SocialMediaLinks;
