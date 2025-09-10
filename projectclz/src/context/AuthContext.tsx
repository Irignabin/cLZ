import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authService, userService } from '../services/api';
import type { User, AuthResponse } from '../services/api';
import axios from 'axios';

interface ValidationResponse {
  valid: boolean;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  initializing: boolean;
  error: string | null;
  color: "dark" | "light";
  setColor: React.Dispatch<React.SetStateAction<"dark" | "light">>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    blood_type: string;
    is_donor: boolean;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUserData: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState<"dark" | "light">("dark");

  // Helper function to set up auth state
  const setupAuthState = useCallback((userData: User, newToken: string) => {
    // Set up axios default authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    
    // Update state
    setUser(userData);
    setToken(newToken);
    setError(null);
    
    // Save to localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  // Helper function to clear auth state
  const clearAuthState = useCallback(() => {
    // Clear state
    setUser(null);
    setToken(null);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear axios header
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const refreshUserData = useCallback(async (): Promise<void> => {
    if (!token) return;
    
    try {
      const response = await userService.getProfile();
      setUser(response);
      localStorage.setItem('user', JSON.stringify(response));
    } catch (error: any) {
      console.error('Failed to refresh user data:', error);
      if (error?.response?.status === 401) {
        clearAuthState();
      }
      throw error;
    }
  }, [token, clearAuthState]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          // Set up axios with stored token
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setToken(storedToken);

          // Validate token and get fresh user data
          const validationResponse: ValidationResponse = await authService.validateToken();
          if (validationResponse.valid) {
            // If we have user data in the validation response, use it
            if (validationResponse.user) {
              setUser(validationResponse.user);
              localStorage.setItem('user', JSON.stringify(validationResponse.user));
            } else {
              // Otherwise refresh user data
              await refreshUserData();
            }
          } else {
            clearAuthState();
          }
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        clearAuthState();
      } finally {
        setInitializing(false);
      }
    };

    initAuth();
  }, [clearAuthState, refreshUserData]);

  // Also update the periodic token validation to handle the response structure
  useEffect(() => {
    if (!token) return;

    const validateToken = async () => {
      try {
        const validationResponse: ValidationResponse = await authService.validateToken();
        if (!validationResponse.valid) {
          clearAuthState();
        } else if (validationResponse.user) {
          // Update user data if provided in validation response
          setUser(validationResponse.user);
          localStorage.setItem('user', JSON.stringify(validationResponse.user));
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          clearAuthState();
        }
      }
    };

    // Validate token every minute
    const interval = setInterval(validateToken, 60000);
    return () => clearInterval(interval);
  }, [token, clearAuthState]);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      console.log('Starting login process...'); // Debug log
      
      const response = await authService.login({ email, password });
      console.log('Login response received:', response); // Debug log
      
      if (!response.token || !response.user) {
        console.error('Invalid login response:', response); // Debug log
        throw new Error('Invalid response from server');
      }
      
      // Set up auth state first
      console.log('Setting up auth state...'); // Debug log
      setupAuthState(response.user, response.token);
      
      // Then validate token
      console.log('Validating token...'); // Debug log
      const validationResponse = await authService.validateToken();
      console.log('Token validation response:', validationResponse); // Debug log
      
      if (!validationResponse.valid) {
        console.error('Token validation failed:', validationResponse); // Debug log
        clearAuthState();
        throw new Error('Token validation failed');
      }

      // Update user data if provided in validation response
      if (validationResponse.user) {
        console.log('Updating user data from validation response...'); // Debug log
        setUser(validationResponse.user);
        localStorage.setItem('user', JSON.stringify(validationResponse.user));
      } else {
        // Only refresh user data if not provided in validation response
        console.log('Refreshing user data...'); // Debug log
        await refreshUserData();
      }
      
      console.log('Login process completed successfully'); // Debug log
    } catch (error: any) {
      console.error('Login process failed:', error); // Debug log
      clearAuthState();
      const errorMessage = error.message || 'Failed to login';
      setError(errorMessage);
      throw error;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone: string;
    blood_type: string;
    is_donor: boolean;
    address: string;
    city: string;
    latitude: number;
    longitude: number;
  }) => {
    try {
      setError(null);
      const response = await authService.register(data);
      setupAuthState(response.user, response.token);
    } catch (error: any) {
      console.error('Registration failed:', error);
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
    } catch (error: any) {
      console.error('Logout failed:', error);
      setError(error.message);
    } finally {
      clearAuthState();
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    token,
    initializing,
    error,
    color,
    setColor,
    login,
    register,
    logout,
    updateUser,
    refreshUserData,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 