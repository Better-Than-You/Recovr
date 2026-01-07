import api from './api';
import type { Case } from './caseService';

// Types
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  total_owed?: number;
  company?: string;
  address?: string;
}

export interface CustomersResponse {
  customers: Customer[];
  total: number;
  pages: number;
  current_page: number;
}

export interface CustomerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Customer Services
export const customerService = {
  /**
   * Get all customers with pagination and search
   */
  async getCustomers(params: CustomerQueryParams = {}): Promise<CustomersResponse> {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  /**
   * Get a single customer by ID
   */
  async getCustomerById(customerId: string): Promise<Customer> {
    const response = await api.get(`/customers/${customerId}`);
    return response.data;
  },

  /**
   * Get all cases for a specific customer
   */
  async getCustomerCases(customerId: string): Promise<Case[]> {
    const response = await api.get(`/customers/${customerId}/cases`);
    return response.data;
  },
};

export default customerService;
