import api from './api';

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'fedex' | 'dca';
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Authenticates a user with email and password
 * @param credentials - User login credentials
 * @returns Promise resolving to authentication response with user data and token
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  
  // Store token in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};

/**
 * Logs out the current user
 * @returns Promise resolving when logout is complete
 */
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
  
  // Clear token from localStorage
  localStorage.removeItem('token');
};

/**
 * Retrieves the currently authenticated user's information
 * @returns Promise resolving to the current user
 */
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};

/**
 * Refreshes the authentication token
 * @returns Promise resolving to a new token
 */
export const refreshToken = async (): Promise<{ token: string }> => {
  const response = await api.post<{ token: string }>('/auth/refresh');
  
  // Update token in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  
  return response.data;
};
