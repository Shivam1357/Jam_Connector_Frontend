// src/services/sessionService.js
import apiClient from '@/lib/api';

export const sessionService = {
  // Create a new jam session
  async createSession(formData) {
    try {
      const response = await apiClient.post('/jam-sessions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search sessions with filters and pagination (GET)
  searchSessions: async (searchParams = {}, page = 0, size = 12, sort = 'dateTime,asc') => {
    try {
      const params = new URLSearchParams();
      
      if (searchParams.title) params.append('title', searchParams.title);
      if (searchParams.city) params.append('city', searchParams.city);
      if (searchParams.genres && searchParams.genres.length > 0) {
        searchParams.genres.forEach(genre => params.append('genres', genre));
      }
      if (searchParams.status) params.append('status', searchParams.status);
      if (searchParams.isPublic !== undefined) params.append('isPublic', searchParams.isPublic);
      if (searchParams.isOnlyMusicians !== undefined) params.append('isOnlyMusicians', searchParams.isOnlyMusicians);
      if (searchParams.hostId) params.append('hostId', searchParams.hostId);
      
      params.append('page', page);
      params.append('size', size);
      params.append('sort', sort);

      const response = await apiClient.get(`/jam-sessions/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search sessions with POST (for complex queries)
  searchSessionsPost: async (searchRequest, page = 0, size = 12, sort = 'dateTime,asc') => {
    try {
      const response = await apiClient.post('/jam-sessions/search', searchRequest, {
        params: { page, size, sort }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get all jam sessions (paginated)
  getAllSessions: async (page = 0, size = 12) => {
    try {
      const response = await apiClient.get('/jam-sessions', {
        params: { page, size, sort: 'dateTime,asc' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get upcoming sessions
  getUpcomingSessions: async (page = 0, size = 12) => {
    try {
      const response = await apiClient.get('/jam-sessions/upcoming', {
        params: { page, size, sort: 'dateTime,asc' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get my sessions
  getMySessions: async (page = 0, size = 12) => {
    try {
      const response = await apiClient.get('/jam-sessions/my-sessions', {
        params: { page, size, sort: 'dateTime,desc' }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  

  // Get session by ID
  async getById(id) {
    const response = await apiClient.get(`/jam-sessions/${id}`);
    return response.data;
  },

  // Update a jam session
  updateSession: async (id, sessionData) => {
    const response = await apiClient.put(`/jam-sessions/${id}`, sessionData);
    return response;
  },

  // Delete a jam session
  deleteSession: async (id) => {
    const response = await apiClient.delete(`/jam-sessions/${id}`);
    return response;
  },

  // Join request methods
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
        return null;
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

  respondToJoinRequest: async (requestId, action, message = '') => {
    try {
      const response = await apiClient.patch(`/jam-sessions/requests/${requestId}`, {
        action,
        message
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Participant methods
  getParticipants: async (sessionId) => {
    try {
      const response = await apiClient.get(`/jam-sessions/${sessionId}/participants`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  removeParticipant: async (sessionId, userId) => {
    try {
      const response = await apiClient.delete(`/jam-sessions/${sessionId}/participants/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Invitation methods
  getAvailableMusicians: async (sessionId) => {
    try {
      const response = await apiClient.get(`/jam-sessions/${sessionId}/available-musicians`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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

  getSentInvitations: async (sessionId) => {
    try {
      const response = await apiClient.get(`/jam-sessions/${sessionId}/invitations`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyReceivedInvitations: async () => {
    try {
      const response = await apiClient.get('/jam-sessions/my-invitations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMyReceivedInvitationsAndSentRequests: async () => {
    try {
      const response = await apiClient.get('/jam-sessions/my-invitations-and-requests');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  respondToInvitation: async (invitationId, action) => {
    try {
      const response = await apiClient.patch(`/jam-sessions/requests/${invitationId}`, {
        action,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  getMyParticipations: async () => {
    try {
      const response = await apiClient.get('/jam-sessions/my-participations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get pending join requests sent by current user
  getMySentRequests: async () => {
    try {
      const response = await apiClient.get('/jam-sessions/requests');
      return response.data;
    } catch (error) {
      throw error;
    }
  },





};
