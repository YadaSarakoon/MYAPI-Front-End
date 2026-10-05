export type UsageRange = '7' | '30' | '90';
export type DashboardActivityStatus = 'Success' | 'Failed';

export interface DashboardActivity {
  time: string;
  method: string;
  endpoint: string;
  status: DashboardActivityStatus;
  code: number;
  response: string;
}

export interface GettingStartedItem {
  label: string;
  done: boolean;
  href: string;
}

export interface DashboardData {
  totalRequests: string;
  monthRequests: string;
  walletBalance: string;
  usage: Record<UsageRange, readonly number[]>;
  activity: readonly DashboardActivity[];
  checklist: readonly GettingStartedItem[];
}
