import {
  BILLING_DOCUMENTS_DEMO,
  BILLING_HISTORY_DEMO,
  PAYMENTS_DEMO,
} from '../data';
import type { BillingDocument, BillingHistoryItem, Payment } from '../types';

export interface BillingSnapshot {
  documents: BillingDocument[];
  history: BillingHistoryItem[];
  payments: Payment[];
}

export interface BillingService {
  getSnapshot(): BillingSnapshot;
}

// Demo adapter only. Payment, document, and history APIs need a confirmed Backend contract.
export const demoBillingService: BillingService = {
  getSnapshot: () => ({
    documents: BILLING_DOCUMENTS_DEMO,
    history: BILLING_HISTORY_DEMO,
    payments: PAYMENTS_DEMO,
  }),
};
