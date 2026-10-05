import type { DashboardData } from './types';

export const DASHBOARD_MOCK: DashboardData = {
  totalRequests: '8,421',
  monthRequests: '1,284',
  walletBalance: '—',
  usage: {
    '7': [38, 55, 43, 72, 62, 85, 68],
    '30': [24, 48, 41, 66, 52, 78, 68],
    '90': [18, 36, 49, 42, 71, 62, 85],
  },
  activity: [
    { time: 'Today, 14:22', method: 'POST', endpoint: '/v1/parcel', status: 'Success', code: 201, response: '248 ms' },
    { time: 'Today, 14:18', method: 'GET', endpoint: '/v1/tracking/TH048855193', status: 'Success', code: 200, response: '156 ms' },
    { time: 'Today, 14:02', method: 'POST', endpoint: '/v1/parcel', status: 'Success', code: 201, response: '312 ms' },
    { time: 'Yesterday, 17:45', method: 'POST', endpoint: '/v1/parcel', status: 'Failed', code: 400, response: '401 ms' },
  ],
  checklist: [
    { label: 'Review API documentation', done: true, href: '/docs' },
    { label: 'Try a request in Sandbox', done: true, href: '/sandbox' },
    { label: 'Request Production access', done: false, href: '/production' },
    { label: 'Configure billing details', done: false, href: '/billing' },
  ],
};
