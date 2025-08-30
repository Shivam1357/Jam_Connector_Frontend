import apiClient from "@/lib/api";


export const profileService = {
    updateProfile: async (profileData) => {
        const response = apiClient.put('/profile', profileData);
        return response;
    },

    getProfile: async () => {
        const response = apiClient.get('/profile', profileData);
        return response;
    }
}