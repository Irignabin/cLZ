import api from './api';
import type { DonorFormData, LocationData, Donor } from './api';

export const donorService = {
    becomeDonor: async (data: DonorFormData) => {
        const response = await api.post('/donors', {
            ...data,
            medical_conditions: data.medical_conditions || [],
            last_donation_date: data.last_donation || null
        });
        return response.data;
    },

    getNearbyDonors: async (params: LocationData) => {
        const response = await api.get('/donors/nearby', { params });
        return response.data;
    },

    updateAvailability: async (data: { available_to_donate: boolean }) => {
        const response = await api.post('/donors/availability', data);
        return response.data;
    },

    searchDonors: async (params: LocationData & { blood_type: string }) => {
        const response = await api.get('/donors/search', { params });
        return response.data;
    }
}; 