import api from './api';
import type { Case } from './caseService';

// Types
export interface Agency {
  id: string;
  name: string;
  capacity: number;
  currentCapacity: number;
  email?: string;
  phone?: string;
  performanceScore?: number;
  activeOutstandingAmount?: number;
  summary?: string;
}

// Agency Services
export const agencyService = {
  /**
   * Get all agencies
   */
  async getAgencies(): Promise<Agency[]> {
    const response = await api.get('/agencies');
    return response.data;
  },

  /**
   * Get a single agency by ID
   */
  async getAgencyById(agencyId: string): Promise<Agency> {
    const response = await api.get(`/agencies/${agencyId}`);
    return response.data;
  },

  /**
   * Get all cases assigned to a specific agency
   */
  async getAgencyCases(agencyId: string): Promise<Case[]> {
    const response = await api.get(`/agencies/${agencyId}/cases`);
    return response.data;
  },
};

export default agencyService;
