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
      
      // Add search parameters
      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.city) params.append('city', searchParams.city);
      if (searchParams.genres && searchParams.genres.length > 0) {
        searchParams.genres.forEach(genre => params.append('genres', genre));
      }
      if (searchParams.instruments && searchParams.instruments.length > 0) {
        searchParams.instruments.forEach(instrument => params.append('instruments', instrument));
      }
      if (searchParams.minExperience) params.append('minExperience', searchParams.minExperience);
      if (searchParams.maxExperience) params.append('maxExperience', searchParams.maxExperience);
      
      // Add pagination parameters
      params.append('page', page);
      params.append('size', size);
      params.append('sort', sort);

      const response = await apiClient.get(`${this.basePath}/search?${params.toString()}`);
      return response.data;
    } catch (error) {
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

      const response = await apiClient.post(`${this.basePath}/search?${params.toString()}`, searchRequest);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search musicians: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get musician by ID
  async getMusicianById(id) {
    try {
      const response = await apiClient.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error) {
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
      throw new Error(`Failed to get musicians: ${error.response?.data?.message || error.message}`);
    }
  }

  // Get musicians by genre
  async getMusiciansByGenre(genre, page = 0, size = 12, sort = 'name,asc') {
    try {
      const searchParams = { genres: [genre] };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by genre: ${error.message}`);
    }
  }

  // Get musicians by city
  async getMusiciansByCity(city, page = 0, size = 12, sort = 'name,asc') {
    try {
      const searchParams = { city };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by city: ${error.message}`);
    }
  }

  // Get musicians by instrument
  async getMusiciansByInstrument(instrument, page = 0, size = 12, sort = 'name,asc') {
    try {
      const searchParams = { instruments: [instrument] };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by instrument: ${error.message}`);
    }
  }

  // Get musicians by experience range
  async getMusiciansByExperience(minExperience, maxExperience, page = 0, size = 12, sort = 'name,asc') {
    try {
      const searchParams = { minExperience, maxExperience };
      return await this.searchMusicians(searchParams, page, size, sort);
    } catch (error) {
      throw new Error(`Failed to get musicians by experience: ${error.message}`);
    }
  }
}

export const musiciansService = new MusiciansService();
export default musiciansService;
