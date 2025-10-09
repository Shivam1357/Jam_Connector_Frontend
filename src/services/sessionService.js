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

  getMySessions: async () => {
    const response = await apiClient.get('/jam-sessions/my-sessions')
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
  },

  sendJoinRequest: async (sessionId, requestData = {}) => {
    try {
      const response = await apiClient.post(`/jam-sessions/${sessionId}/join-request`, {
        message: requestData.message || ''
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyJoinRequest: async (sessionId) => {
    try {
      const response = await apiClient.get(`/jam-sessions/${sessionId}/my-request`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No existing request
      }
      throw error;
    }
  },

  getJoinRequests: async (sessionId) => {
    try {
      const response = await apiClient.get(`/jam-sessions/${sessionId}/requests`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Respond to join request
  respondToJoinRequest: async (requestId, action, message = '') => {
    try {
      const response = await apiClient.patch(`/jam-sessions/requests/${requestId}`, {
        action, // 'ACCEPT' or 'DECLINE'
        message
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get session participants
  getParticipants: async (sessionId) => {
    try {
      const response = await apiClient.get(`/jam-sessions/${sessionId}/participants`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

   // Remove participant (host action)
  removeParticipant: async (sessionId, userId) => {
    try {
      const response = await apiClient.delete(`/jam-sessions/${sessionId}/participants/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get available musicians to invite
  getAvailableMusicians: async (sessionId) => {
    try {
      const response = await apiClient.get(`/jam-sessions/${sessionId}/available-musicians`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send invitation
  sendInvitation: async (sessionId, userId, message = '') => {
    try {
      const response = await apiClient.post(`/jam-sessions/${sessionId}/invite`, {
        userId,
        message
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get sent invitations
  getSentInvitations: async (sessionId) => {
    try {
      const response = await apiClient.get(`/jam-sessions/${sessionId}/invitations`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  // Add these methods to your sessionService.js

// Get invitations received by current user
getMyReceivedInvitations: async () => {
  try {
    const response = await apiClient.get('/jam-sessions/my-invitations');
    return response.data;
  } catch (error) {
    throw error;
  }
},

// Respond to invitation
respondToInvitation: async (invitationId, action) => {
  try {
    const response = await apiClient.patch(`/jam-sessions/requests/${invitationId}`, {
      action, // 'ACCEPT' or 'DECLINE'
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}


}
