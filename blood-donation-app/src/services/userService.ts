import api from './api';
import type { User, ProfileUpdateData, DashboardStats, Activity, LocationData, Hospital } from './api';

interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

export const userService = {
    getProfile: async (): Promise<User> => {
        try {
            const response = await api.get<ApiResponse<{ user: User }>>('/user');
            if (!response.data.data?.user) {
                throw new Error('Failed to get user profile');
            }
            return response.data.data.user;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get user profile';
            throw new Error(message);
        }
    },

    updateProfile: async (data: ProfileUpdateData): Promise<User> => {
        try {
            const response = await api.put<ApiResponse<{ user: User }>>('/user/profile', data);
            if (!response.data.data?.user) {
                throw new Error('Failed to update profile');
            }
            return response.data.data.user;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to update profile';
            throw new Error(message);
        }
    },

    updateLocation: async (data: { latitude: number; longitude: number; address: string }): Promise<User> => {
        try {
            const response = await api.put<ApiResponse<{ user: User }>>('/user/location', data);
            if (!response.data.data?.user) {
                throw new Error('Failed to update location');
            }
            return response.data.data.user;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to update location';
            throw new Error(message);
        }
    },

    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            const response = await api.get<ApiResponse<DashboardStats>>('/user/dashboard/stats');
            if (!response.data.data) {
                throw new Error('Failed to get dashboard stats');
            }
            return response.data.data;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get dashboard stats';
            throw new Error(message);
        }
    },

    getRecentActivity: async (): Promise<Activity[]> => {
        try {
            const response = await api.get<ApiResponse<{ activities: Activity[] }>>('/user/dashboard/activity');
            if (!response.data.data?.activities) {
                throw new Error('Failed to get recent activity');
            }
            return response.data.data.activities;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get recent activity';
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
    }
}; 