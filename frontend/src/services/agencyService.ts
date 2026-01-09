import api from './api';
import type { Case } from './caseService';

// Types
export interface Agency {
  id: string;
  name: string;
  active_cases: number;
  active_outstanding_amount: number;
  capacity: number;
  currentCapacity: number;
  success_rate: number;
  contact_email?: string;
  contact_phone?: string;
  performanceScore?: number;
  activeCases?: number;
  recoveredAmount?: number;
  successRate?: number;
  activeOutstandingAmount?: number;
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
