// src/services/profileService.js
import apiClient from '@/lib/api'

export const profileService = {
  // Update profile - JWT token automatically added by apiClient interceptor
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/profile', profileData, {
      headers:{
        "Content-Type" : 'multipart/form-data'
      }
    });
    return response
  },

  // Get profile - JWT token automatically added by apiClient interceptor
  getProfile: async () => {
    const response = await apiClient.get('/profile')
    return response
  }
}