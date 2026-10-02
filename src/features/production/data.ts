export const PRODUCTION_BASE_URL = 'https://open-api.myexpress.ai';

export const PRODUCTION_COPY = {
    TH: {
        apiDocs: 'API Docs',
        sandbox: 'Sandbox',
        production: 'Production',
        billing: 'Billing',
        logout: 'ออกจากระบบ',
        title: 'Production API',
        subtitle: 'เชื่อมต่อระบบของคุณกับ MyAPI เพื่อใช้งานจริง ทั้งการสร้างพัสดุ ติดตามสถานะ และรับ Webhook ผ่าน API',
        active: 'Production Active',
        activeTitle: 'Production API Active',
        activeDescription: 'คุณสามารถใช้งาน Production API ได้แล้ว',
        activeSince: 'เปิดใช้งานเมื่อ',
    },
    EN: {
        apiDocs: 'API Docs',
        sandbox: 'Sandbox',
        production: 'Production',
        billing: 'Billing',
        logout: 'Log out',
        title: 'Production API',
        subtitle: 'Connect your system to MyAPI for live shipments, tracking, and webhooks through the API.',
        active: 'Production Active',
        activeTitle: 'Production API Active',
        activeDescription: 'Your Production API is ready to use.',
        activeSince: 'Active since',
    },
} as const;

// ============================================================



export const RECENT_ACTIVITY = [
    {
        id: '1',
        method: 'POST',
        endpoint: '/v1/parcel',
        status: 'Success',
        responseTime: '248 ms',
        amount: '฿32.00',
        time: 'Today, 14:22',
    },
    {
        id: '2',
        method: 'GET',
        endpoint: '/v1/tracking/TH048855193',
        status: 'Success',
        responseTime: '156 ms',
        amount: '—',
        time: 'Today, 14:18',
    },
    {
        id: '3',
        method: 'POST',
        endpoint: '/v1/parcel',
        status: 'Success',
        responseTime: '312 ms',
        amount: '฿45.00',
        time: 'Today, 14:02',
    },
    {
        id: '4',
        method: 'POST',
        endpoint: '/v1/parcel',
        status: 'Failed',
        responseTime: '401 ms',
        amount: '฿0.00',
        time: 'Yesterday, 17:45',
    },
];
