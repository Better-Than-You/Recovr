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

export interface UploadCsvResponse {
  success: boolean;
  message: string;
  filePath: string;
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

  /**
   * Upload CSV file for bulk actions
   * @param file - The CSV file to upload
   */
  async uploadActionsCsv(file: File): Promise<UploadCsvResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/actions/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default actionsService;
