import api from './api';
import type { BloodRequestData, BloodRequest, ApiResponse } from './api';

export const requestService = {
    createRequest: async (data: BloodRequestData): Promise<BloodRequest> => {
        try {
            const response = await api.post<ApiResponse<BloodRequest>>('/blood-requests', data);
            if (!response.data.data) {
                throw new Error('Failed to create blood request');
            }
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to create blood request';
            throw new Error(message);
        }
    },

    getRequests: async (params?: { status?: string; blood_type?: string }): Promise<BloodRequest[]> => {
        try {
            const response = await api.get<ApiResponse<BloodRequest[]>>('/blood-requests', { params });
            if (!response.data.data) {
                throw new Error('Failed to get blood requests');
            }
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get blood requests';
            throw new Error(message);
        }
    },

    getRequest: async (id: number): Promise<BloodRequest> => {
        try {
            const response = await api.get<ApiResponse<BloodRequest>>(`/blood-requests/${id}`);
            if (!response.data.data) {
                throw new Error('Failed to get blood request');
            }
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get blood request';
            throw new Error(message);
        }
    },

    updateRequest: async (id: number, data: {
        status?: string;
        units_needed?: number;
        notes?: string;
    }): Promise<BloodRequest> => {
        try {
            const response = await api.put<ApiResponse<BloodRequest>>(`/blood-requests/${id}`, data);
            if (!response.data.data) {
                throw new Error('Failed to update blood request');
            }
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to update blood request';
            throw new Error(message);
        }
    },

    deleteRequest: async (id: number): Promise<void> => {
        try {
            await api.delete(`/blood-requests/${id}`);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to delete blood request';
            throw new Error(message);
        }
    }
};

export default requestService; 