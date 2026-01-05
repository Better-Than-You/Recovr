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
  createdAt: string;
  autoAssignAfterHours?: number;
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
    lastContact: '2024-01-03',
    createdAt: '2023-09-15T08:00:00Z'
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
    lastContact: '2024-01-05',
    createdAt: '2023-10-02T08:00:00Z'
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
    lastContact: '2023-12-28',
    createdAt: '2023-08-12T08:00:00Z'
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
    lastContact: '2024-01-06',
    createdAt: '2024-01-05T14:30:00Z',
    autoAssignAfterHours: 12
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
    lastContact: '2024-01-04',
    createdAt: '2023-10-19T08:00:00Z'
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
    lastContact: '2023-12-15',
    createdAt: '2023-07-23T08:00:00Z'
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
    lastContact: '2024-01-06',
    createdAt: '2024-01-06T09:15:00Z',
    autoAssignAfterHours: 48
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
    lastContact: '2024-01-02',
    createdAt: '2023-09-17T08:00:00Z'
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
    lastContact: '2024-01-05',
    createdAt: '2023-11-04T08:00:00Z'
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
    lastContact: '2023-12-30',
    createdAt: '2023-08-23T08:00:00Z'
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
  'CS-2024-002': [
    {
      id: 'evt-201',
      timestamp: '2023-10-02T08:30:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Invoice Generated',
      description: 'Invoice #INV-445782 generated for $28,500',
      metadata: { amount: 28500 }
    },
    {
      id: 'evt-202',
      timestamp: '2023-11-02T09:15:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Payment Overdue Notice',
      description: 'Automated reminder sent - payment 30 days overdue',
      metadata: { emailSubject: 'URGENT: Payment Overdue - Invoice #INV-445782' }
    },
    {
      id: 'evt-203',
      timestamp: '2023-11-08T14:20:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Customer Acknowledgment',
      description: 'Customer acknowledged debt and promised payment by month end',
      metadata: { emailSubject: 'Re: Payment Status Update' }
    },
    {
      id: 'evt-204',
      timestamp: '2023-11-20T10:00:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Assigned to DCA',
      description: 'Case assigned to Elite Collection Agency after 48 days',
      metadata: { previousStatus: 'overdue', newStatus: 'assigned' }
    },
    {
      id: 'evt-205',
      timestamp: '2023-11-23T11:30:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'DCA Introduction Email',
      description: 'Elite Collection Agency sent initial contact letter',
      metadata: { emailSubject: 'Account Assignment Notice - Global Logistics Inc' }
    },
    {
      id: 'evt-206',
      timestamp: '2023-12-01T15:45:00Z',
      actor: 'dca',
      eventType: 'call',
      title: 'Successful Phone Contact',
      description: 'Spoke with accounts payable department'
    },
    {
      id: 'evt-207',
      timestamp: '2023-12-10T09:20:00Z',
      actor: 'customer',
      eventType: 'payment',
      title: 'Partial Payment Received',
      description: 'Received $10,000 payment, balance remaining: $18,500',
      metadata: { amount: 10000 }
    },
    {
      id: 'evt-208',
      timestamp: '2023-12-15T13:15:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Balance Reminder',
      description: 'Sent follow-up email regarding remaining balance',
      metadata: { emailSubject: 'Remaining Balance Due - Account GL-445782' }
    },
    {
      id: 'evt-209',
      timestamp: '2024-01-05T16:30:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Payment Commitment',
      description: 'Customer committed to full payment by January 15th',
      metadata: { emailSubject: 'Re: Final Payment Confirmation' }
    }
  ],
  'CS-2024-003': [
    {
      id: 'evt-301',
      timestamp: '2023-08-12T09:00:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Invoice Generated',
      description: 'Invoice #INV-329845 generated for $67,800',
      metadata: { amount: 67800 }
    },
    {
      id: 'evt-302',
      timestamp: '2023-09-15T10:00:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Payment Reminder',
      description: 'First overdue notice sent',
      metadata: { emailSubject: 'Payment Reminder: Invoice #INV-329845' }
    },
    {
      id: 'evt-303',
      timestamp: '2023-09-28T14:30:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Second Notice',
      description: 'Second payment reminder - account 45 days overdue',
      metadata: { emailSubject: 'SECOND NOTICE: Payment Required' }
    },
    {
      id: 'evt-304',
      timestamp: '2023-10-20T11:30:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Assigned to Collections',
      description: 'Case escalated to Premier Recovery Solutions',
      metadata: { previousStatus: 'overdue', newStatus: 'assigned' }
    },
    {
      id: 'evt-305',
      timestamp: '2023-10-25T09:45:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'DCA Initial Contact',
      description: 'Premier Recovery sent formal collection notice',
      metadata: { emailSubject: 'Collection Notice - Account MM-329845' }
    },
    {
      id: 'evt-306',
      timestamp: '2023-11-05T14:15:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Final Notice Before Legal',
      description: 'Sent formal notice of potential legal action',
      metadata: { emailSubject: 'FINAL NOTICE - Legal Action Pending' }
    },
    {
      id: 'evt-307',
      timestamp: '2023-11-10T10:20:00Z',
      actor: 'dca',
      eventType: 'call',
      title: 'Contact Attempt Failed',
      description: 'Phone disconnected, voicemail full'
    },
    {
      id: 'evt-308',
      timestamp: '2023-11-20T16:00:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Email Delivery Failed',
      description: 'Multiple email addresses returned as undeliverable',
      metadata: { emailSubject: 'URGENT: Account Status' }
    },
    {
      id: 'evt-309',
      timestamp: '2023-11-25T09:00:00Z',
      actor: 'dca',
      eventType: 'call',
      title: 'No Response to Contact',
      description: 'Multiple contact attempts failed - all channels'
    },
    {
      id: 'evt-310',
      timestamp: '2023-12-10T10:00:00Z',
      actor: 'dca',
      eventType: 'legal_notice',
      title: 'Legal Proceedings Initiated',
      description: 'Case forwarded to legal department for litigation',
      metadata: { previousStatus: 'in_progress', newStatus: 'legal' }
    },
    {
      id: 'evt-311',
      timestamp: '2023-12-28T15:30:00Z',
      actor: 'dca',
      eventType: 'status_change',
      title: 'Court Filing Prepared',
      description: 'Documentation prepared for civil suit filing'
    }
  ],
  'CS-2024-005': [
    {
      id: 'evt-501',
      timestamp: '2023-10-19T08:00:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Invoice Generated',
      description: 'Invoice #INV-558923 generated for $34,200',
      metadata: { amount: 34200 }
    },
    {
      id: 'evt-502',
      timestamp: '2023-11-19T09:30:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Payment Due Reminder',
      description: 'Automated overdue notice sent',
      metadata: { emailSubject: 'Payment Overdue: Invoice #INV-558923' }
    },
    {
      id: 'evt-503',
      timestamp: '2023-11-25T10:45:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Customer Dispute',
      description: 'Customer disputed invoice, claiming service issues',
      metadata: { emailSubject: 'Dispute: Invoice #INV-558923' }
    },
    {
      id: 'evt-504',
      timestamp: '2023-11-28T14:20:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Dispute Investigation',
      description: 'Forwarded to customer service for investigation',
      metadata: { emailSubject: 'Re: Investigating Your Dispute' }
    },
    {
      id: 'evt-505',
      timestamp: '2023-12-05T11:00:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Dispute Resolution',
      description: 'Dispute resolved - invoice validated, payment still due',
      metadata: { emailSubject: 'Dispute Resolution - Payment Required' }
    },
    {
      id: 'evt-506',
      timestamp: '2023-12-12T09:15:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Assigned to DCA',
      description: 'Case assigned to Elite Collection Agency',
      metadata: { previousStatus: 'disputed', newStatus: 'assigned' }
    },
    {
      id: 'evt-507',
      timestamp: '2023-12-15T13:30:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Collection Notice Sent',
      description: 'Elite Collection Agency initiated contact',
      metadata: { emailSubject: 'Collection Account Notice - CR-558923' }
    },
    {
      id: 'evt-508',
      timestamp: '2023-12-22T10:45:00Z',
      actor: 'dca',
      eventType: 'call',
      title: 'Customer Contact',
      description: 'Discussed payment options with customer'
    },
    {
      id: 'evt-509',
      timestamp: '2024-01-04T15:20:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Payment Plan Request',
      description: 'Customer requested 60-day payment plan',
      metadata: { emailSubject: 'Payment Plan Proposal' }
    }
  ],
  'CS-2024-008': [
    {
      id: 'evt-801',
      timestamp: '2023-09-17T09:30:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Invoice Generated',
      description: 'Invoice #INV-445829 generated for $52,400',
      metadata: { amount: 52400 }
    },
    {
      id: 'evt-802',
      timestamp: '2023-10-17T10:00:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'First Payment Reminder',
      description: 'Initial overdue notice sent to customer',
      metadata: { emailSubject: 'Payment Reminder: Invoice #INV-445829' }
    },
    {
      id: 'evt-803',
      timestamp: '2023-10-25T11:15:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Customer Response',
      description: 'Customer acknowledged invoice and requested billing verification',
      metadata: { emailSubject: 'Re: Need Invoice Details' }
    },
    {
      id: 'evt-804',
      timestamp: '2023-10-28T09:45:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Documentation Sent',
      description: 'Sent detailed billing breakdown and proof of delivery',
      metadata: { emailSubject: 'Re: Invoice Documentation Attached' }
    },
    {
      id: 'evt-805',
      timestamp: '2023-11-15T13:20:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Follow-up Reminder',
      description: 'Second notice sent after no payment received',
      metadata: { emailSubject: 'SECOND NOTICE: Payment Required' }
    },
    {
      id: 'evt-806',
      timestamp: '2023-11-28T08:30:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Assigned to Collections',
      description: 'Account transferred to Rapid Recovery Associates',
      metadata: { previousStatus: 'overdue', newStatus: 'assigned' }
    },
    {
      id: 'evt-807',
      timestamp: '2023-12-01T10:15:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'DCA First Contact',
      description: 'Rapid Recovery Associates sent initial collection letter',
      metadata: { emailSubject: 'Account Assignment - Pacific Imports LLC' }
    },
    {
      id: 'evt-808',
      timestamp: '2023-12-10T14:30:00Z',
      actor: 'dca',
      eventType: 'call',
      title: 'Phone Discussion',
      description: 'Spoke with CFO regarding payment timeline'
    },
    {
      id: 'evt-809',
      timestamp: '2023-12-20T16:00:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Payment Schedule Proposal',
      description: 'Customer proposed two installment payments in January',
      metadata: { emailSubject: 'Payment Schedule Proposal' }
    },
    {
      id: 'evt-810',
      timestamp: '2024-01-02T11:45:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Agreement Confirmed',
      description: 'Payment plan approved: $26,200 due Jan 10 and Jan 25',
      metadata: { emailSubject: 'Payment Plan Confirmation' }
    }
  ],
  'CS-2024-009': [
    {
      id: 'evt-901',
      timestamp: '2023-11-04T08:00:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Invoice Generated',
      description: 'Invoice #INV-667234 generated for $23,700',
      metadata: { amount: 23700 }
    },
    {
      id: 'evt-902',
      timestamp: '2023-12-04T09:15:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Payment Overdue Notice',
      description: 'First reminder sent - 30 days past due',
      metadata: { emailSubject: 'Payment Due: Invoice #INV-667234' }
    },
    {
      id: 'evt-903',
      timestamp: '2023-12-12T10:30:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Customer Response',
      description: 'Customer cited administrative delays, promised payment soon',
      metadata: { emailSubject: 'Re: Payment Processing Delayed' }
    },
    {
      id: 'evt-904',
      timestamp: '2023-12-20T11:00:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Escalated to Collections',
      description: 'Account assigned to Elite Collection Agency',
      metadata: { previousStatus: 'overdue', newStatus: 'assigned' }
    },
    {
      id: 'evt-905',
      timestamp: '2023-12-22T13:45:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Collection Notice',
      description: 'Elite Collection Agency sent initial outreach',
      metadata: { emailSubject: 'Collection Account Notice - MS-667234' }
    },
    {
      id: 'evt-906',
      timestamp: '2023-12-28T15:20:00Z',
      actor: 'dca',
      eventType: 'call',
      title: 'Left Voicemail',
      description: 'Called customer service line, left detailed message'
    },
    {
      id: 'evt-907',
      timestamp: '2024-01-02T09:30:00Z',
      actor: 'customer',
      eventType: 'call',
      title: 'Customer Callback',
      description: 'Customer returned call, requested payment arrangement'
    },
    {
      id: 'evt-908',
      timestamp: '2024-01-05T14:15:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Payment Options Provided',
      description: 'Sent email with multiple payment methods and deadline',
      metadata: { emailSubject: 'Payment Options - Account MS-667234' }
    }
  ],
  'CS-2024-010': [
    {
      id: 'evt-1001',
      timestamp: '2023-08-23T08:45:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Invoice Generated',
      description: 'Invoice #INV-338901 generated for $41,800',
      metadata: { amount: 41800 }
    },
    {
      id: 'evt-1002',
      timestamp: '2023-09-23T10:00:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Payment Reminder',
      description: 'Automated payment reminder sent',
      metadata: { emailSubject: 'Payment Due: Invoice #INV-338901' }
    },
    {
      id: 'evt-1003',
      timestamp: '2023-10-10T11:20:00Z',
      actor: 'fedex',
      eventType: 'email',
      title: 'Second Notice',
      description: 'Follow-up reminder sent - account overdue',
      metadata: { emailSubject: 'URGENT: Payment Overdue' }
    },
    {
      id: 'evt-1004',
      timestamp: '2023-10-25T09:30:00Z',
      actor: 'fedex',
      eventType: 'status_change',
      title: 'Assigned to DCA',
      description: 'Case transferred to Rapid Recovery Associates',
      metadata: { previousStatus: 'overdue', newStatus: 'assigned' }
    },
    {
      id: 'evt-1005',
      timestamp: '2023-10-28T13:15:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'DCA Introduction',
      description: 'Rapid Recovery Associates initiated collection process',
      metadata: { emailSubject: 'Collection Account Assignment - ES-338901' }
    },
    {
      id: 'evt-1006',
      timestamp: '2023-11-05T10:45:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Customer Outreach',
      description: 'Customer contacted DCA, requested settlement options',
      metadata: { emailSubject: 'Inquiry: Settlement Options' }
    },
    {
      id: 'evt-1007',
      timestamp: '2023-11-10T14:30:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Settlement Offer',
      description: 'Proposed settlement: $35,000 lump sum or full payment plan',
      metadata: { emailSubject: 'Settlement Proposal - Account ES-338901' }
    },
    {
      id: 'evt-1008',
      timestamp: '2023-11-22T16:00:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Declined Settlement',
      description: 'Customer declined settlement, requested time to arrange full payment',
      metadata: { emailSubject: 'Re: Need More Time' }
    },
    {
      id: 'evt-1009',
      timestamp: '2023-12-05T09:15:00Z',
      actor: 'dca',
      eventType: 'call',
      title: 'Status Check Call',
      description: 'Called to check on payment progress'
    },
    {
      id: 'evt-1010',
      timestamp: '2023-12-15T11:30:00Z',
      actor: 'dca',
      eventType: 'email',
      title: 'Final Reminder',
      description: 'Sent reminder that account is 113 days overdue',
      metadata: { emailSubject: 'Final Notice - Payment Required' }
    },
    {
      id: 'evt-1011',
      timestamp: '2023-12-30T15:45:00Z',
      actor: 'customer',
      eventType: 'email',
      title: 'Payment Commitment',
      description: 'Customer committed to payment by mid-January 2024',
      metadata: { emailSubject: 'Re: Payment by January 15' }
    }
  ]
};

export const agencies = [
  { id: 'prs', name: 'Premier Recovery Solutions', performanceScore: 0.87, totalRecovered: 2345000, activeCases: 45 },
  { id: 'eca', name: 'Elite Collection Agency', performanceScore: 0.92, totalRecovered: 3120000, activeCases: 38 },
  { id: 'rra', name: 'Rapid Recovery Associates', performanceScore: 0.79, totalRecovered: 1890000, activeCases: 52 }
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  totalOwed: number;
  activeCases: number;
  paymentHistory: 'excellent' | 'good' | 'fair' | 'poor';
  lastContact: string;
}

export const customers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Acme Corporation',
    email: 'accounts@acmecorp.com',
    phone: '+1 (555) 234-5678',
    address: '123 Business Park Drive',
    city: 'Chicago',
    state: 'IL',
    zip: '60601',
    totalOwed: 45000,
    activeCases: 1,
    paymentHistory: 'good',
    lastContact: '2024-01-03'
  },
  {
    id: 'CUST-002',
    name: 'Global Logistics Inc',
    email: 'finance@globallogistics.com',
    phone: '+1 (555) 345-6789',
    address: '456 Harbor Boulevard',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90001',
    totalOwed: 28500,
    activeCases: 1,
    paymentHistory: 'excellent',
    lastContact: '2024-01-05'
  },
  {
    id: 'CUST-003',
    name: 'Midwest Manufacturing',
    email: 'billing@midwestmfg.com',
    phone: '+1 (555) 456-7890',
    address: '789 Industrial Way',
    city: 'Detroit',
    state: 'MI',
    zip: '48201',
    totalOwed: 67800,
    activeCases: 1,
    paymentHistory: 'poor',
    lastContact: '2023-12-28'
  },
  {
    id: 'CUST-004',
    name: 'TechStart Solutions',
    email: 'ap@techstart.io',
    phone: '+1 (555) 567-8901',
    address: '321 Innovation Circle',
    city: 'Austin',
    state: 'TX',
    zip: '78701',
    totalOwed: 12300,
    activeCases: 1,
    paymentHistory: 'excellent',
    lastContact: '2024-01-06'
  },
  {
    id: 'CUST-005',
    name: 'Coastal Retail Group',
    email: 'payments@coastalretail.com',
    phone: '+1 (555) 678-9012',
    address: '654 Beach Boulevard',
    city: 'Miami',
    state: 'FL',
    zip: '33101',
    totalOwed: 34200,
    activeCases: 1,
    paymentHistory: 'good',
    lastContact: '2024-01-04'
  },
  {
    id: 'CUST-006',
    name: 'Northern Distributors',
    email: 'accounting@northerndist.com',
    phone: '+1 (555) 789-0123',
    address: '987 Commerce Street',
    city: 'Seattle',
    state: 'WA',
    zip: '98101',
    totalOwed: 89500,
    activeCases: 1,
    paymentHistory: 'poor',
    lastContact: '2023-12-15'
  },
  {
    id: 'CUST-007',
    name: 'Summit Industries',
    email: 'finance@summitind.com',
    phone: '+1 (555) 890-1234',
    address: '147 Mountain View Drive',
    city: 'Denver',
    state: 'CO',
    zip: '80201',
    totalOwed: 15600,
    activeCases: 1,
    paymentHistory: 'excellent',
    lastContact: '2024-01-06'
  },
  {
    id: 'CUST-008',
    name: 'Pacific Imports LLC',
    email: 'billing@pacificimports.com',
    phone: '+1 (555) 901-2345',
    address: '258 Waterfront Plaza',
    city: 'San Francisco',
    state: 'CA',
    zip: '94101',
    totalOwed: 52400,
    activeCases: 1,
    paymentHistory: 'fair',
    lastContact: '2024-01-02'
  },
  {
    id: 'CUST-009',
    name: 'Metro Services Group',
    email: 'ap@metroservices.com',
    phone: '+1 (555) 012-3456',
    address: '369 Downtown Avenue',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    totalOwed: 23700,
    activeCases: 1,
    paymentHistory: 'good',
    lastContact: '2024-01-05'
  },
  {
    id: 'CUST-010',
    name: 'Eastern Supply Chain',
    email: 'finance@easternsupply.com',
    phone: '+1 (555) 123-4567',
    address: '741 Logistics Lane',
    city: 'Boston',
    state: 'MA',
    zip: '02101',
    totalOwed: 41800,
    activeCases: 1,
    paymentHistory: 'fair',
    lastContact: '2023-12-30'
  }
];

export const dashboardStats = {
  totalOutstanding: 4523400,
  recoveryRate: 0.68,
  activeAgencies: 3,
  pendingCases: 127,
  resolvedThisMonth: 23,
  averageRecoveryTime: 45
};

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
