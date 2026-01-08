import api from './api';

// Types
export interface Case {
  id: string;
  customerName: string;
  customerId: string;
  amount: number;
  agingDays: number;
  recoveredAmount: number;
  recoveryProbability: number;
  invoiceAmount: number;
  status: string;
  assignedAgency_id?: string;
  assignedAgencyReason?: string;
  customer_id?: string;
  created_at: string;
  assignedAgency?: string;
  caseId?: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  eventType: string;
  title: string;
  metadata?: any;
  description?: string;
  user?: string;
}

export interface CasesResponse {
  cases: Case[];
  total: number;
  pages: number;
  current_page: number;
}

export interface CaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

// Case Services
export const caseService = {
  /**
   * Get all cases with pagination and filters
   */
  async getCases(params: CaseQueryParams = {}): Promise<CasesResponse> {
    const response = await api.get('/cases', { params });
    console.log('Fetched cases:', response.data);
    return response.data;
},

  /**
   * Get a single case by ID
   */
  async getCaseById(caseId: string): Promise<Case> {
    const response = await api.get(`/cases/${caseId}`);
    return response.data;
  },

  /**
   * Create a new case
   */
  async createCase(data: {
    customerName: string;
    amount: number;
    customerId?: string;
  }): Promise<Case> {
    const response = await api.post('/cases', data);
    return response.data;
  },

  /**
   * Update an existing case
   */
  async updateCase(caseId: string, data: Partial<Case>): Promise<Case> {
    const response = await api.put(`/cases/${caseId}`, data);
    return response.data;
  },

  /**
   * Assign a case to an agency
   */
  async assignCase(caseId: string, agencyId: string): Promise<Case> {
    const response = await api.put(`/cases/${caseId}/assign`, { agencyId });
    return response.data;
  },

  /**
   * Get timeline/history for a case
   */
  async getCaseTimeline(caseId: string): Promise<TimelineEvent[]> {
    const response = await api.get(`/cases/${caseId}/timeline`);
    return response.data;
  },

  /**
   * Log an email sent for a case
   */
  async logEmail(caseId: string, data: {
    subject: string;
    body: string;
  }): Promise<{ message: string; event: TimelineEvent }> {
    const response = await api.post(`/cases/${caseId}/email`, data);
    return response.data;
  },

  /**
   * Log a call made for a case
   */
  async logCall(caseId: string, data: {
    notes: string;
  }): Promise<{ message: string; event: TimelineEvent }> {
    const response = await api.post(`/cases/${caseId}/call`, data);
    return response.data;
  },

  /**
   * Add a custom timeline event to a case
   */
  async addTimelineEvent(caseId: string, data: {
    eventType: string;
    title: string;
    actor: string;
    description?: string;
    metadata?: any;
  }): Promise<{ message: string; event: TimelineEvent }> {
    const response = await api.post(`/cases/${caseId}/timeline`, data);
    return response.data;
  },
};

export default caseService;
