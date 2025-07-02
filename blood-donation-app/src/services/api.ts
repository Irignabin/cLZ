import axios from 'axios';
import type { AxiosResponse, AxiosInstance } from 'axios';

// Types
interface ApiResponse<T> {
    message?: string;
    errors?: Record<string, string[]>;
    user?: User;
    token?: string;
    data?: T;
}

interface User {
    id: number;
    name: string;
    email: string;
    blood_type: string;
    phone: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    is_donor: boolean;
    available_to_donate: boolean;
    last_donation_date?: string;
    created_at?: string;
    updated_at?: string;
    email_verified_at?: string | null;
}

interface AuthResponse {
    message: string;
    user: User;
    token: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    blood_type: string;
    phone: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
}

interface ProfileUpdateData {
    name?: string;
    blood_type?: string;
    phone?: string;
    address?: string;
    city?: string;
    is_donor?: boolean;
    available_to_donate?: boolean;
}

interface DonorFormData {
    name: string;
    phone: string;
    blood_type: string;
    address: string;
    city: string;
    date_of_birth: string;
    weight: string;
    height: string;
    last_donation: string;
    last_donation_date?: string;
    medical_conditions: string[];
    medications: string;
    agreement: boolean;
    health_status: string;
}

interface LocationData {
    latitude: number;
    longitude: number;
    radius?: number;
    blood_type?: string;
    city?: string;
}

interface Donor {
    id: number;
    name: string;
    blood_type: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    latitude: number;
    longitude: number;
    is_available: boolean;
    last_donation_date: string;
    distance: number;
}

type UrgencyLevel = 'normal' | 'urgent' | 'emergency';

interface BloodRequestData {
    blood_type: string;
    units_needed: number;
    hospital_id: number;
    contact_name: string;
    contact_phone: string;
    urgency_level: UrgencyLevel;
    notes?: string;
}

interface BloodRequest {
    id: number;
    user_id: number;
    blood_type: string;
    units_needed: number;
    hospital_name: string;
    hospital_address: string;
    latitude: number;
    longitude: number;
    urgency_level: string;
    patient_name: string;
    contact_phone: string;
    additional_notes?: string;
    status: string;
    distance: number;
    created_at: string;
    updated_at: string;
}

interface DashboardStats {
    totalDonations: number;
    lastDonationDate: string | null;
    livesImpacted: number;
    nearbyRequests: number;
    nearbyDonors: number;
}

interface Activity {
    id: number;
    type: string;
    location: string;
    date: string;
    status: string;
    details?: {
        blood_type?: string;
        units?: number;
        hospital?: string;
    };
}

interface Hospital {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    phone: string;
    distance?: number;
    has_blood_bank: boolean;
}

interface BloodBank {
    id: number;
    name: string;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
    phone: string;
    distance?: number;
    blood_inventory?: Record<string, number>;
}

interface ValidationResponse {
    valid: boolean;
    user?: User;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const isAuthEndpoint = error.config.url.includes('/login') || 
                                 error.config.url.includes('/validate-token');
            
            if (!isAuthEndpoint) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        return Promise.reject(error);
    }
);

// Helper function to extract data from response
function extractData<T>(response: ApiResponse<T> | T): T {
    if (response && typeof response === 'object' && 'data' in response) {
        return (response as ApiResponse<T>).data as T;
    }
    return response as T;
}

// Create services
const authService = {
    async login(data: LoginData): Promise<AuthResponse> {
        try {
            console.log('Sending login request:', data);
            const response = await api.post<AuthResponse>('/login', data);
            console.log('Login response:', response.data);
            
            const { user, token, message } = response.data;
            
            if (!token || !user) {
                console.error('Invalid login response:', response.data);
                throw new Error(message || 'Invalid response from server');
            }

            // Set token in axios headers immediately
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return response.data;
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error);
            const errorMessage = error.response?.data?.message || 
                               (error.response?.data?.errors && Object.values(error.response.data.errors).flat()[0]) || 
                               error.message || 
                               'Failed to login';
            throw new Error(errorMessage);
        }
    },

    async validateToken(): Promise<ValidationResponse> {
        try {
            console.log('Validating token...');
            const response = await api.get<ValidationResponse>('/validate-token');
            console.log('Validation response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Token validation error:', error.response?.data || error);
            return { valid: false };
        }
    },

    async logout(): Promise<void> {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error('Logout error:', error);
            // Still clear local storage even if API call fails
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete api.defaults.headers.common['Authorization'];
        }
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        try {
            console.log('Sending registration request:', data);
            const response = await api.post<AuthResponse>('/register', data);
            console.log('Registration response:', response.data);
            
            const { user, token, message } = response.data;
            
            if (!token || !user) {
                console.error('Invalid registration response:', response.data);
                throw new Error(message || 'Invalid response from server');
            }

            // Set token in axios headers immediately
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return response.data;
        } catch (error: any) {
            console.error('Registration error:', error.response?.data || error);
            const errorMessage = error.response?.data?.message || 
                               (error.response?.data?.errors && Object.values(error.response.data.errors).flat()[0]) || 
                               error.message || 
                               'Failed to register';
            throw new Error(errorMessage);
        }
    }
};

const userService = {
    getProfile: async (): Promise<User> => {
        try {
            const response = await api.get<ApiResponse<User>>('/user');
            return extractData(response.data);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get user profile';
            throw new Error(message);
        }
    },

    getDashboardStats: async (): Promise<DashboardStats> => {
        try {
            const response = await api.get<ApiResponse<DashboardStats>>('/user/dashboard/stats');
            return extractData(response.data);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get dashboard stats';
            throw new Error(message);
        }
    },

    getRecentActivity: async (): Promise<Activity[]> => {
        try {
            const response = await api.get<ApiResponse<Activity[]>>('/user/dashboard/activity');
            return extractData(response.data);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to get recent activity';
            throw new Error(message);
        }
    },

    updateProfile: async (data: ProfileUpdateData): Promise<User> => {
        try {
            const response = await api.put<ApiResponse<User>>('/user/profile', data);
            return extractData(response.data);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to update profile';
            throw new Error(message);
        }
    },

    updateLocation: async (data: { latitude: number; longitude: number; address: string }): Promise<User> => {
        try {
            const response = await api.put<ApiResponse<User>>('/user/location', data);
            const user = response.data.data ?? response.data;
            if (!user || typeof user !== 'object' || !('id' in user)) {
                throw new Error('Failed to update location');
            }
            return user;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Failed to update location';
            throw new Error(message);
        }
    }
};

const donorService = {
    becomeDonor: async (data: DonorFormData): Promise<Donor> => {
        const response = await api.post<ApiResponse<Donor>>('/donors', {
            ...data,
            medical_conditions: data.medical_conditions || [],
            last_donation_date: data.last_donation || null
        });
        return extractData(response.data);
    },

    getNearbyDonors: async (params: LocationData): Promise<Donor[]> => {
        const response = await api.get<ApiResponse<Donor[]>>('/donors/nearby', { params });
        return extractData(response.data);
    },

    updateAvailability: async (data: { available_to_donate: boolean }): Promise<Donor> => {
        const response = await api.post<ApiResponse<Donor>>('/donors/availability', data);
        return extractData(response.data);
    },

    searchDonors: async (params: LocationData & { blood_type: string }): Promise<Donor[]> => {
        const response = await api.get<ApiResponse<Donor[]>>('/donors/search', { params });
        return extractData(response.data);
    }
};

const requestService = {
    createRequest: async (data: BloodRequestData): Promise<BloodRequest> => {
        const response = await api.post<ApiResponse<BloodRequest>>('/blood-requests', data);
        return extractData(response.data);
    },

    getRequests: async (params?: { status?: string; blood_type?: string }): Promise<BloodRequest[]> => {
        const response = await api.get<ApiResponse<BloodRequest[]>>('/blood-requests', { params });
        return extractData(response.data);
    },

    getRequest: async (id: number): Promise<BloodRequest> => {
        const response = await api.get<ApiResponse<BloodRequest>>(`/blood-requests/${id}`);
        return extractData(response.data);
    },

    updateRequest: async (id: number, data: {
        status?: string;
        additional_notes?: string;
    }): Promise<BloodRequest> => {
        const response = await api.put<ApiResponse<BloodRequest>>(`/blood-requests/${id}`, data);
        return extractData(response.data);
    },

    deleteRequest: async (id: number): Promise<void> => {
        await api.delete(`/blood-requests/${id}`);
    },

    getNearbyRequests: async (params: LocationData): Promise<BloodRequest[]> => {
        const response = await api.get<ApiResponse<BloodRequest[]>>('/blood-requests/nearby', { params });
        return extractData(response.data);
    }
};

// Export services and types
export {
    authService,
    userService,
    donorService,
    requestService,
    type User,
    type LoginData,
    type RegisterData,
    type AuthResponse,
    type ProfileUpdateData,
    type DonorFormData,
    type LocationData,
    type Donor,
    type BloodRequestData,
    type BloodRequest,
    type DashboardStats,
    type Activity,
    type ValidationResponse,
    type Hospital,
    type BloodBank,
    type ApiResponse,
    type UrgencyLevel
};

export default api; 