import api from './api';

// Types
export interface PendingAction {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  caseId: string;
  dueDate: string;
}

// Actions Services
export const actionsService = {
  /**
   * Get all pending actions
   */
  async getPendingActions(): Promise<PendingAction[]> {
    const response = await api.get('/actions/pending');
    return response.data;
  },
};

export default actionsService;
