// src/services/authService.js
import apiClient from '@/lib/api'

export const authService = {
  // Login API call
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials)
    return response
  },

  // Register API call  
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response
  },

  // Logout API call (optional)
  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response
  }
}
