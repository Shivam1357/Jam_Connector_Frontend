// hooks/useFileUrl.js
import { useState, useEffect } from 'react';

export const useFileUrl = (publicId, options = {}) => {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const generateUrl = async () => {
      setLoading(true);
      setError(null);

      if (!publicId) {
        setUrl(null);
        setLoading(false);
        return;
      }

      try {
        // Option 1: For Cloudinary
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (cloudName) {
          const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;
          
          // Build transformations
          let transformations = [];
          if (options.width) transformations.push(`w_${options.width}`);
          if (options.height) transformations.push(`h_${options.height}`);
          if (options.crop) transformations.push(`c_${options.crop}`);
          if (options.quality) transformations.push(`q_${options.quality}`);
          
          // Default transformations
          if (transformations.length === 0) {
            transformations.push('q_auto', 'f_auto');
          }
          
          const transformString = transformations.join(',');
          const generatedUrl = `${baseUrl}/${transformString}/${publicId}`;
          setUrl(generatedUrl);
        } else {
          // Option 2: For custom file storage
          const baseStorageUrl = process.env.NEXT_PUBLIC_FILE_STORAGE_BASE_URL || 'https://your-storage.example.com';
          const generatedUrl = `${baseStorageUrl}/files/${publicId}`;
          setUrl(generatedUrl);
        }
      } catch (err) {
        console.error('Error generating file URL:', err);
        setError(err);
        setUrl(null);
      } finally {
        setLoading(false);
      }
    };

    generateUrl();
  }, [publicId, options.width, options.height, options.crop, options.quality]);

  return { url, loading, error };
};
