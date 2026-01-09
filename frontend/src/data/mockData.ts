// Notification types and mock data
export interface Notification {
  id: string;
  type: 'case_update' | 'payment_received' | 'action_required' | 'status_change' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  caseId?: string;
  priority?: 'high' | 'medium' | 'low';
}

export const mockNotifications: Notification[] = [
  {
    id: 'notif-001',
    type: 'action_required',
    title: 'Urgent: Case CS-2024-001 Requires Action',
    message: 'Payment plan acceptance needs review and approval',
    timestamp: '2024-01-06T14:30:00Z',
    read: false,
    caseId: 'CS-2024-001',
    priority: 'high'
  },
  {
    id: 'notif-002',
    type: 'payment_received',
    title: 'Payment Received - $10,000',
    message: 'Partial payment received for case CS-2024-002',
    timestamp: '2024-01-06T10:15:00Z',
    read: false,
    caseId: 'CS-2024-002',
    priority: 'medium'
  },
  {
    id: 'notif-003',
    type: 'status_change',
    title: 'Case Status Updated',
    message: 'CS-2024-005 status changed to "Payment Plan Negotiation"',
    timestamp: '2024-01-05T16:45:00Z',
    read: true,
    caseId: 'CS-2024-005',
    priority: 'low'
  },
  {
    id: 'notif-004',
    type: 'reminder',
    title: 'Follow-up Reminder',
    message: 'CS-2024-008 - Customer payment plan deadline in 3 days',
    timestamp: '2024-01-05T09:00:00Z',
    read: true,
    caseId: 'CS-2024-008',
    priority: 'medium'
  },
  {
    id: 'notif-005',
    type: 'case_update',
    title: 'New Case Assigned',
    message: 'Case CS-2024-011 has been assigned to Elite Collection Agency',
    timestamp: '2024-01-04T11:20:00Z',
    read: true,
    link: '/case-allocation',
    priority: 'low'
  },
  {
    id: 'notif-006',
    type: 'action_required',
    title: 'Legal Action Pending',
    message: 'CS-2024-003 requires legal review before proceeding',
    timestamp: '2024-01-03T15:30:00Z',
    read: true,
    caseId: 'CS-2024-003',
    priority: 'high'
  }
];
