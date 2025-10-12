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
