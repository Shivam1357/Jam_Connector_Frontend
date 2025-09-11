// components/JamSessionCard.js
import React from 'react';
import JamSessionImage from './JamSessionImage';

const JamSessionCard = ({ session }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Cover Image Section */}
      <div className="relative h-48 w-full">
        <JamSessionImage
          publicId={session.coverImagePublicId}
          alt={session.title}
          width={400}
          height={300}
          className="rounded-t-2xl"
          fallbackIcon="🎸"
        />
        
        {/* Overlay for additional info */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-lg text-sm">
          {session.genre?.name}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h3>
        <p className="text-gray-600 mb-4">{session.description}</p>
        
        {/* Host Info */}
        {session.host && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full mr-3">
              <JamSessionImage
                publicId={session.host.profilePictureUrl}
                alt={session.host.name}
                width={32}
                height={32}
                className="rounded-full"
                fallbackIcon="👤"
              />
            </div>
            <span className="text-sm text-gray-700">{session.host.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};
