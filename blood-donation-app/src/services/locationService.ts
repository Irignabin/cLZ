import api from './api';
import type { LocationData, Donor, Hospital, BloodBank, BloodRequest } from './api';

interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

export const locationService = {
    getNearbyDonors: async (params: LocationData): Promise<Donor[]> => {
        try {
            const response = await api.get<ApiResponse<Donor[]>>('/donors/nearby', { params });
            if (!response.data.data) {
                throw new Error('Failed to get nearby donors');
            }
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get nearby donors';
            throw new Error(message);
        }
    },

    getNearbyHospitals: async (params: LocationData): Promise<Hospital[]> => {
        try {
            const response = await api.get<ApiResponse<Hospital[]>>('/hospitals/nearby', { params });
            if (!response.data.data) {
                throw new Error('Failed to get nearby hospitals');
            }
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get nearby hospitals';
            throw new Error(message);
        }
    },

    getNearbyBloodBanks: async (params: LocationData): Promise<BloodBank[]> => {
        const response = await api.get<ApiResponse<BloodBank[]>>('/locations/blood-banks', { params });
        return response.data.data;
    },

    getNearbyRequests: async (params: LocationData): Promise<BloodRequest[]> => {
        try {
            const response = await api.get<ApiResponse<BloodRequest[]>>('/requests/nearby', { params });
            if (!response.data.data) {
                throw new Error('Failed to get nearby requests');
            }
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get nearby requests';
            throw new Error(message);
        }
    },

    searchDonors: async (params: LocationData): Promise<Donor[]> => {
        const response = await api.get<ApiResponse<Donor[]>>('/donors/search', { params });
        return response.data.data;
    }
};

export default locationService; 