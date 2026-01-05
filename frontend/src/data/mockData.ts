export interface Case {
  caseId: string;
  customerName: string;
  amount: number;
  agingDays: number;
  recoveryProbability: number;
  assignedAgency: string | null;
  status: 'pending' | 'assigned' | 'in_progress' | 'resolved' | 'legal';
  accountNumber: string;
  dueDate: string;
  lastContact: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: 'fedex' | 'dca' | 'customer';
  eventType: 'email' | 'status_change' | 'payment' | 'call' | 'legal_notice';
  title: string;
  description: string;
  metadata?: {
    amount?: number;
    emailSubject?: string;
    previousStatus?: string;
    newStatus?: string;
  };
}

export const mockCases: Case[] = [
  {
    caseId: 'CS-2024-001',
    customerName: 'Acme Corporation',
    amount: 45000,
    agingDays: 120,
    recoveryProbability: 0.75,
    assignedAgency: 'Premier Recovery Solutions',
    status: 'in_progress',
    accountNumber: 'AC-892341',
    dueDate: '2023-09-15',
    lastContact: '2024-01-03'
  },
  {
    caseId: 'CS-2024-002',
    customerName: 'Global Logistics Inc',
    amount: 28500,
    agingDays: 95,
    recoveryProbability: 0.82,
    assignedAgency: 'Elite Collection Agency',
    status: 'in_progress',
    accountNumber: 'GL-445782',
    dueDate: '2023-10-02',
    lastContact: '2024-01-05'
  },
  {
    caseId: 'CS-2024-003',
    customerName: 'Midwest Manufacturing',
    amount: 67800,
    agingDays: 145,
    recoveryProbability: 0.45,
    assignedAgency: 'Premier Recovery Solutions',
    status: 'legal',
    accountNumber: 'MM-329845',
    dueDate: '2023-08-12',
    lastContact: '2023-12-28'
  },
  {
    caseId: 'CS-2024-004',
    customerName: 'TechStart Solutions',
    amount: 12300,
    agingDays: 45,
    recoveryProbability: 0.91,
    assignedAgency: null,
    status: 'pending',
    accountNumber: 'TS-772891',
    dueDate: '2023-11-20',
    lastContact: '2024-01-06'
  },
  {
    caseId: 'CS-2024-005',
    customerName: 'Coastal Retail Group',
    amount: 34200,
    agingDays: 78,
    recoveryProbability: 0.78,
    assignedAgency: 'Elite Collection Agency',
    status: 'in_progress',
    accountNumber: 'CR-558923',
    dueDate: '2023-10-19',
    lastContact: '2024-01-04'
  },
  {
    caseId: 'CS-2024-006',
    customerName: 'Northern Distributors',
    amount: 89500,
    agingDays: 165,
    recoveryProbability: 0.38,
    assignedAgency: 'Premier Recovery Solutions',
    status: 'legal',
    accountNumber: 'ND-238476',
    dueDate: '2023-07-23',
    lastContact: '2023-12-15'
  },
  {
    caseId: 'CS-2024-007',
    customerName: 'Summit Industries',
    amount: 15600,
    agingDays: 32,
    recoveryProbability: 0.94,
    assignedAgency: null,
    status: 'pending',
    accountNumber: 'SI-994523',
    dueDate: '2023-12-04',
    lastContact: '2024-01-06'
  },
  {
    caseId: 'CS-2024-008',
    customerName: 'Pacific Imports LLC',
    amount: 52400,
    agingDays: 110,
    recoveryProbability: 0.68,
    assignedAgency: 'Rapid Recovery Associates',
    status: 'in_progress',
    accountNumber: 'PI-445829',
    dueDate: '2023-09-17',
    lastContact: '2024-01-02'
  },
  {
    caseId: 'CS-2024-009',
    customerName: 'Metro Services Group',
    amount: 23700,
    agingDays: 62,
    recoveryProbability: 0.85,
    assignedAgency: 'Elite Collection Agency',
    status: 'in_progress',
    accountNumber: 'MS-667234',
    dueDate: '2023-11-04',
    lastContact: '2024-01-05'
  },
  {
    caseId: 'CS-2024-010',
    customerName: 'Eastern Supply Chain',
    amount: 41800,
    agingDays: 135,
    recoveryProbability: 0.52,
    assignedAgency: 'Rapid Recovery Associates',
    status: 'in_progress',
    accountNumber: 'ES-338901',
    dueDate: '2023-08-23',
    lastContact: '2023-12-30'
  }
];

export const mockTimelineData: Record<string, TimelineEvent[]> = {
  'CS-2024-001': [
    {
      id: 'evt-001',
      timestamp: '2023-09-15T09:00:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Invoice Generated',
      description: 'Invoice #INV-892341 generated for $45,000',
      metadata: { amount: 45000 }
    },
    {
      id: 'evt-002',
      timestamp: '2023-10-15T14:30:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'First Payment Reminder',
      description: 'Automated payment reminder sent to customer',
      metadata: { emailSubject: 'Payment Due: Invoice #INV-892341' }
    },
    {
      id: 'evt-003',
      timestamp: '2023-11-01T10:15:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Customer Response',
      description: 'Customer requested payment extension due to cash flow issues',
      metadata: { emailSubject: 'Re: Payment Due - Request for Extension' }
    },
    {
      id: 'evt-004',
      timestamp: '2023-11-15T11:00:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Case Escalated',
      description: 'Account moved to collections after 60 days overdue',
      metadata: { previousStatus: 'overdue', newStatus: 'collections' }
    },
    {
      id: 'evt-005',
      timestamp: '2023-11-20T08:45:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Assigned to DCA',
      description: 'Case assigned to Premier Recovery Solutions',
      metadata: { previousStatus: 'collections', newStatus: 'assigned' }
    },
    {
      id: 'evt-006',
      timestamp: '2023-11-22T13:20:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'DCA Initial Contact',
      description: 'Premier Recovery sent initial collection notice',
      metadata: { emailSubject: 'Notice of Debt Collection - Account AC-892341' }
    },
    {
      id: 'evt-007',
      timestamp: '2023-12-05T15:30:00Z',
      actor: 'dca',
      eventType: 'call',
      title: 'Phone Contact Attempted',
      description: 'Called customer - left voicemail requesting callback'
    },
    {
      id: 'evt-008',
      timestamp: '2023-12-12T09:10:00Z',
      actor: 'customer',
      eventType: 'call',
      title: 'Customer Called Back',
      description: 'Customer discussed payment plan options'
    },
    {
      id: 'evt-009',
      timestamp: '2023-12-20T14:00:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Payment Plan Proposed',
      description: 'Sent payment plan proposal: $15,000 monthly for 3 months',
      metadata: { emailSubject: 'Payment Plan Proposal - Account AC-892341' }
    },
    {
      id: 'evt-010',
      timestamp: '2024-01-03T16:45:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Customer Accepted Plan',
      description: 'Customer agreed to payment plan terms',
      metadata: { emailSubject: 'Re: Payment Plan Accepted' }
    }
  ],
  'CS-2024-003': [
    {
      id: 'evt-101',
      timestamp: '2023-08-12T09:00:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Invoice Generated',
      description: 'Invoice #INV-329845 generated for $67,800'
    },
    {
      id: 'evt-102',
      timestamp: '2023-09-15T10:00:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Payment Reminder',
      description: 'First overdue notice sent'
    },
    {
      id: 'evt-103',
      timestamp: '2023-10-20T11:30:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Assigned to Collections',
      description: 'Case escalated to Premier Recovery Solutions'
    },
    {
      id: 'evt-104',
      timestamp: '2023-11-05T14:15:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Final Notice Before Legal',
      description: 'Sent formal notice of legal action'
    },
    {
      id: 'evt-105',
      timestamp: '2023-11-25T09:00:00Z',
      actor: 'dca',
      eventType: 'call',
      title: 'No Response to Contact',
      description: 'Multiple contact attempts failed'
    },
    {
      id: 'evt-106',
      timestamp: '2023-12-10T10:00:00Z',
      actor: 'dca',
      eventType: 'legal_notice',
      title: 'Legal Proceedings Initiated',
      description: 'Case forwarded to legal department'
    },
    {
      id: 'evt-107',
      timestamp: '2023-12-28T15:30:00Z',
      actor: 'dca',
      eventType: 'status_change',
      title: 'Court Filing Prepared',
      description: 'Documentation prepared for civil suit'
    }
  ]
};

export const agencies = [
  { id: 'prs', name: 'Premier Recovery Solutions', performanceScore: 0.87, totalRecovered: 2345000, activeCases: 45 },
  { id: 'eca', name: 'Elite Collection Agency', performanceScore: 0.92, totalRecovered: 3120000, activeCases: 38 },
  { id: 'rra', name: 'Rapid Recovery Associates', performanceScore: 0.79, totalRecovered: 1890000, activeCases: 52 }
];

export const dashboardStats = {
  totalOutstanding: 4523400,
  recoveryRate: 0.68,
  activeAgencies: 3,
  pendingCases: 127,
  resolvedThisMonth: 23,
  averageRecoveryTime: 45
};
