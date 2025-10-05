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
    // console.log(response);
    return response
  },

 googleLogin: async (data) => {
    try {
      const response = await apiClient.post('/auth/google', data);
      console.log('Google login response:', response);
      return response; // This will be { data: { token, user }, status: 200, ... }
    } catch (error) {
      console.error('Service error:', error);
      throw error; // Re-throw so AuthContext can handle it
    }
  },

  forgotPassword: async (data) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', data);
      return response;
    } catch (error) {
      console.error('Forgot password service error:', error);
      throw error;
    }
  },

  // Logout API call (optional)
  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response
  },

  validateResetToken: async (data) => {
    try {
      const response = await apiClient.post('/auth/validate-reset-token', data);
      return response;
    } catch (error) {
      console.error('Validate reset token service error:', error);
      throw error;
    }
  },

  resetPassword: async (data) => {
    try {
      const response = await apiClient.post('/auth/reset-password', data);
      return response;
    } catch (error) {
      console.error('Reset password service error:', error);
      throw error;
    }
  },
}
