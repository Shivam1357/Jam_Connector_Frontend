// src/services/sessionService.js
import apiClient from '@/lib/api'

export const sessionService = {
  // Create a new jam session
  createSession: async (sessionData) => {
    const response = await apiClient.post('/sessions', sessionData)
    return response
  },

  // Get all jam sessions
  getAllSessions: async () => {
    const response = await apiClient.get('/sessions')
    return response
  },

  // Update a jam session
  updateSession: async (id, sessionData) => {
    const response = await apiClient.put(`/sessions/${id}`, sessionData)
    return response
  },

  // Delete a jam session
  deleteSession: async (id) => {
    const response = await apiClient.delete(`/sessions/${id}`)
    return response
  }
}
