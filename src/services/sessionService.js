// src/services/sessionService.js
import apiClient from '@/lib/api';
import axios from 'axios'

export const sessionService = {
  // Create a new jam session

  async createSession(formData) {
    try {
      const response = await apiClient.post('/jam-sessions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // Authorization header will be added automatically by your interceptor
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
 
  // Get all jam sessions
  getUpcomingSessions: async () => {
    const response = await apiClient.get('/jam-sessions/upcoming')
    return response.data;
  },

  getAllSessions: async () => {
    const response = await apiClient.get('/jam-sessions')
    return response.data;
  },

  async getById(id) {
    const response = await apiClient.get(`/jam-sessions/${id}`);
    return response.data;
  },

  // Update a jam session
  updateSession: async (id, sessionData) => {
    const response = await apiClient.put(`/jam-sessions/${id}`, sessionData)
    return response
  },

  // Delete a jam session
  deleteSession: async (id) => {
    const response = await apiClient.delete(`/jam-sessions/${id}`)
    return response
  }
}
