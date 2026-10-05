import { DASHBOARD_MOCK } from '../data';
import type { DashboardData } from '../types';

export interface DashboardService {
  getDashboard(): Promise<DashboardData>;
}

// Replace this adapter with an API-backed implementation after the Backend contract is confirmed.
export const demoDashboardService: DashboardService = {
  async getDashboard() {
    return DASHBOARD_MOCK;
  },
};
