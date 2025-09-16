// services/musiciansService.js
import apiClient from '@/lib/api';

class MusiciansService {
  constructor() {
    this.basePath = '/musicians';
  }

  // Search musicians with filters and pagination
  async searchMusicians(searchParams = {}, page = 0, size = 12, sort = 'name,asc') {
    try {
      const params = new URLSearchParams();
      
      // Add search parameters with null/undefined checks
      if (searchParams.name && searchParams.name.trim()) {
        params.append('name', searchParams.name.trim());
      }
      if (searchParams.city && searchParams.city.trim()) {
        params.append('city', searchParams.city.trim());
      }
      if (searchParams.genres && Array.isArray(searchParams.genres) && searchParams.genres.length > 0) {
        searchParams.genres.forEach(genre => {
          if (genre && genre.trim()) params.append('genres', genre.trim());
        });
      }
      if (searchParams.instruments && Array.isArray(searchParams.instruments) && searchParams.instruments.length > 0) {
        searchParams.instruments.forEach(instrument => {
          if (instrument && instrument.trim()) params.append('instruments', instrument.trim());
        });
      }
      if (searchParams.minExperience !== undefined && searchParams.minExperience !== null && searchParams.minExperience !== '') {
        params.append('minExperience', searchParams.minExperience);
      }
      if (searchParams.maxExperience !== undefined && searchParams.maxExperience !== null && searchParams.maxExperience !== '') {
        params.append('maxExperience', searchParams.maxExperience);
      }
      
      // Add pagination parameters
      params.append('page', page);
      params.append('size', size);
      params.append('sort', sort);

      const response = await apiClient.get(`${this.basePath}/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Search musicians error:', error);
      throw new Error(`Failed to search musicians: ${error.response?.data?.message || error.message}`);
    }
  }

  // Search musicians using POST (for complex search criteria)
  async searchMusiciansPost(searchRequest, page = 0, size = 12, sort = 'name,asc') {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', size);
      params.append('sort', sort);

      // Clean up the search request
      const cleanSearchRequest = this._cleanSearchRequest(searchRequest);

      const response = await apiClient.post(`${this.basePath}/search?${params.toString()}`, cleanSearchRequest);
      return response.data;
    } catch (error) {
      console.error('Search musicians POST error:', error);
      throw new Error(`Failed to search musicians: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get musician by ID
  async getMusicianById(id) {
    try {
      if (!id) {
        throw new Error('Musician ID is required');
      }
      const response = await apiClient.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get musician by ID error:', error);
      if (error.response?.status === 404) {
        throw new Error('Musician not found');
      }
      throw new Error(`Failed to get musician: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get all musicians (simple pagination)
  async getAllMusicians(page = 0, size = 12, sort = 'name,asc') {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', size);
      params.append('sort', sort);

      const response = await apiClient.get(`${this.basePath}/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get all musicians error:', error);
      throw new Error(`Failed to get musicians: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get musicians by genre
  async getMusiciansByGenre(genre, page = 0, size = 12, sort = 'name,asc') {
    try {
      if (!genre || !genre.trim()) {
        throw new Error('Genre is required');
      }
      const searchParams = { genres: [genre.trim()] };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by genre: ${error.message}`);
    }
  }

  // Get musicians by city
  async getMusiciansByCity(city, page = 0, size = 12, sort = 'name,asc') {
    try {
      if (!city || !city.trim()) {
        throw new Error('City is required');
      }
      const searchParams = { city: city.trim() };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by city: ${error.message}`);
    }
  }

  // Get musicians by instrument
  async getMusiciansByInstrument(instrument, page = 0, size = 12, sort = 'name,asc') {
    try {
      if (!instrument || !instrument.trim()) {
        throw new Error('Instrument is required');
      }
      const searchParams = { instruments: [instrument.trim()] };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by instrument: ${error.message}`);
    }
  }

  // Get musicians by experience range
  async getMusiciansByExperience(minExperience, maxExperience, page = 0, size = 12, sort = 'name,asc') {
    try {
      const searchParams = {};
      if (minExperience !== undefined && minExperience !== null) {
        searchParams.minExperience = minExperience;
      }
      if (maxExperience !== undefined && maxExperience !== null) {
        searchParams.maxExperience = maxExperience;
      }
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by experience: ${error.message}`);
    }
  }

  // Get musicians by name (search)
  async getMusiciansByName(name, page = 0, size = 12, sort = 'name,asc') {
    try {
      if (!name || !name.trim()) {
        throw new Error('Name is required');
      }
      const searchParams = { name: name.trim() };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to search musicians by name: ${error.message}`);
    }
  }

  // Advanced search with multiple criteria
  async advancedSearch(searchCriteria) {
    try {
      const {
        name,
        city,
        genres,
        instruments,
        minExperience,
        maxExperience,
        page = 0,
        size = 12,
        sort = 'name,asc'
      } = searchCriteria;

      const searchParams = {};
      if (name && name.trim()) searchParams.name = name.trim();
      if (city && city.trim()) searchParams.city = city.trim();
      if (genres && Array.isArray(genres) && genres.length > 0) {
        searchParams.genres = genres.filter(g => g && g.trim()).map(g => g.trim());
      }
      if (instruments && Array.isArray(instruments) && instruments.length > 0) {
        searchParams.instruments = instruments.filter(i => i && i.trim()).map(i => i.trim());
      }
      if (minExperience !== undefined && minExperience !== null) searchParams.minExperience = minExperience;
      if (maxExperience !== undefined && maxExperience !== null) searchParams.maxExperience = maxExperience;

      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to perform advanced search: ${error.message}`);
    }
  }

  // Get musicians statistics
  async getMusiciansStats() {
    try {
      const response = await apiClient.get(`${this.basePath}/stats`);
      return response.data;
    } catch (error) {
      console.error('Get musicians stats error:', error);
      throw new Error(`Failed to get musicians statistics: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get featured musicians
  async getFeaturedMusicians(limit = 6) {
    try {
      const response = await apiClient.get(`${this.basePath}/featured?limit=${Math.max(1, Math.min(50, limit))}`);
      return response.data;
    } catch (error) {
      console.error('Get featured musicians error:', error);
      throw new Error(`Failed to get featured musicians: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get recent musicians (newly joined)
  async getRecentMusicians(limit = 12) {
    try {
      const response = await apiClient.get(`${this.basePath}/recent?limit=${Math.max(1, Math.min(50, limit))}`);
      return response.data;
    } catch (error) {
      console.error('Get recent musicians error:', error);
      throw new Error(`Failed to get recent musicians: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get similar musicians (based on genres/instruments)
  async getSimilarMusicians(musicianId, limit = 6) {
    try {
      if (!musicianId) {
        throw new Error('Musician ID is required');
      }
      const response = await apiClient.get(`${this.basePath}/${musicianId}/similar?limit=${Math.max(1, Math.min(20, limit))}`);
      return response.data;
    } catch (error) {
      console.error('Get similar musicians error:', error);
      throw new Error(`Failed to get similar musicians: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get musicians by multiple genres
  async getMusiciansByGenres(genres, page = 0, size = 12, sort = 'name,asc') {
    try {
      if (!genres || !Array.isArray(genres) || genres.length === 0) {
        throw new Error('At least one genre is required');
      }
      const cleanGenres = genres.filter(g => g && g.trim()).map(g => g.trim());
      if (cleanGenres.length === 0) {
        throw new Error('Valid genres are required');
      }
      const searchParams = { genres: cleanGenres };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by genres: ${error.message}`);
    }
  }

  // Get musicians by multiple instruments
  async getMusiciansByInstruments(instruments, page = 0, size = 12, sort = 'name,asc') {
    try {
      if (!instruments || !Array.isArray(instruments) || instruments.length === 0) {
        throw new Error('At least one instrument is required');
      }
      const cleanInstruments = instruments.filter(i => i && i.trim()).map(i => i.trim());
      if (cleanInstruments.length === 0) {
        throw new Error('Valid instruments are required');
      }
      const searchParams = { instruments: cleanInstruments };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by instruments: ${error.message}`);
    }
  }

  // Get musicians near location (if geolocation is implemented)
  async getMusiciansNearby(latitude, longitude, radius = 50, page = 0, size = 12) {
    try {
      if (latitude === undefined || longitude === undefined) {
        throw new Error('Latitude and longitude are required');
      }
      
      const params = new URLSearchParams();
      params.append('lat', latitude);
      params.append('lng', longitude);
      params.append('radius', Math.max(1, Math.min(500, radius))); // Limit radius between 1-500km
      params.append('page', page);
      params.append('size', size);

      const response = await apiClient.get(`${this.basePath}/nearby?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Get nearby musicians error:', error);
      throw new Error(`Failed to get nearby musicians: ${error.response?.data?.message || error.message}`);
    }
  }

  // Helper method to clean search request
  _cleanSearchRequest(searchRequest) {
    if (!searchRequest) return {};
    
    const cleaned = {};
    
    if (searchRequest.name && searchRequest.name.trim()) {
      cleaned.name = searchRequest.name.trim();
    }
    if (searchRequest.city && searchRequest.city.trim()) {
      cleaned.city = searchRequest.city.trim();
    }
    if (searchRequest.genres && Array.isArray(searchRequest.genres)) {
      const cleanGenres = searchRequest.genres.filter(g => g && g.trim()).map(g => g.trim());
      if (cleanGenres.length > 0) cleaned.genres = cleanGenres;
    }
    if (searchRequest.instruments && Array.isArray(searchRequest.instruments)) {
      const cleanInstruments = searchRequest.instruments.filter(i => i && i.trim()).map(i => i.trim());
      if (cleanInstruments.length > 0) cleaned.instruments = cleanInstruments;
    }
    if (searchRequest.minExperience !== undefined && searchRequest.minExperience !== null && searchRequest.minExperience !== '') {
      cleaned.minExperience = parseInt(searchRequest.minExperience);
    }
    if (searchRequest.maxExperience !== undefined && searchRequest.maxExperience !== null && searchRequest.maxExperience !== '') {
      cleaned.maxExperience = parseInt(searchRequest.maxExperience);
    }
    
    return cleaned;
  }

  // Helper method to validate pagination parameters
  _validatePagination(page, size) {
    const validPage = Math.max(0, parseInt(page) || 0);
    const validSize = Math.max(1, Math.min(100, parseInt(size) || 12)); // Limit size between 1-100
    return { page: validPage, size: validSize };
  }
}

export const musiciansService = new MusiciansService();
export default musiciansService;
