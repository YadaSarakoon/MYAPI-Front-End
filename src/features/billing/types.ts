export type Language = 'th' | 'en';
export type HistoryRange = 1 | 3 | 6 | 12;

export interface BillingHistoryItem {
  month: string;
  monthEn: string;
  amount: number;
  shipments: number;
}

export interface Payment {
  id: string;
  date: string;
  reference: string;
  amount: number;
  status: 'Paid' | 'Processing';
}

export interface BillingDocument {
  id: string;
  type: 'statement' | 'tax';
  period: string;
  issueDate: string;
  amount: number;
  status: 'Paid' | 'Pending';
  reference?: string;
}
