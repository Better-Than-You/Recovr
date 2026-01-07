import api from './api';
import type { Agency } from './agencyService';

// Types
export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  totalDebt: number;
  recoveredAmount: number;
  recoveryRate: number;
}

export interface RecoveryStats {
  month: string;
  recovered: number;
}

// Dashboard Services
export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },

  /**
   * Get recovery statistics (monthly data)
   */
  async getRecoveryStats(): Promise<RecoveryStats[]> {
    const response = await api.get('/stats/recovery');
    return response.data;
  },

  /**
   * Get agency performance data
   */
  async getAgencyPerformance(): Promise<Agency[]> {
    const response = await api.get('/performance/agencies');
    return response.data;
  },
};

export default dashboardService;
