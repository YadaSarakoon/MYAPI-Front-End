export type Company = {
  id: string;
  name: string;
  requests: number;
  monthlyRequests: number;
  activity: { date: string; endpoint: string; status: number; requests: number }[];
  invoices: { id: string; date: string; due: string; amount: number; status: 'paid' | 'pending' }[];
};

// Explicit fixtures, not customer records. Replace with an authorized API when available.
export const demoCompanies: Company[] = [
  {
    id: 'demo-siam', name: 'บริษัท สยาม เทรดดิ้ง (ตัวอย่าง)', requests: 12450, monthlyRequests: 3200,
    activity: [
      { date: '2026-10-15', endpoint: '/tracking', status: 200, requests: 2400 },
      { date: '2026-10-16', endpoint: '/labels', status: 200, requests: 800 },
    ],
    invoices: [
      { id: 'DEMO-SIAM-001', date: '2026-10-01', due: '2026-10-31', amount: 1600, status: 'pending' },
      { id: 'DEMO-SIAM-002', date: '2026-09-01', due: '2026-09-30', amount: 1200, status: 'paid' },
    ],
  },
  {
    id: 'demo-north', name: 'บริษัท นอร์ท โลจิสติกส์ (ตัวอย่าง)', requests: 8650, monthlyRequests: 1800,
    activity: [
      { date: '2026-10-15', endpoint: '/tracking', status: 200, requests: 1750 },
      { date: '2026-10-16', endpoint: '/labels', status: 400, requests: 50 },
    ],
    invoices: [{ id: 'DEMO-NORTH-001', date: '2026-10-01', due: '2026-10-31', amount: 900, status: 'paid' }],
  },
  { id: 'demo-new', name: 'บริษัท เริ่มต้นใหม่ (ตัวอย่าง)', requests: 0, monthlyRequests: 0, activity: [], invoices: [] },
];

export function makeCsv(rows: Array<Array<string | number>>): string {
  return '\uFEFF' + rows.map(row => row.map(value => {
    let text = String(value);
    const first = Array.from(text).find(char => char.trim() !== '' && char.charCodeAt(0) > 31);
    if (typeof value === 'string' && first && '=+@-'.includes(first)) text = "'" + text;
    return `"${text.replaceAll('"', '""')}"`;
  }).join(',')).join('\r\n');
}

export function companyCsv(company: Company, page: 'dashboard' | 'billing'): string {
  return page === 'dashboard'
    ? makeCsv([
      ['ข้อมูลตัวอย่าง / Demo data', 'บริษัท', 'คำขอทั้งหมด', 'คำขอเดือนนี้', 'วันที่', 'Endpoint', 'HTTP status', 'จำนวนคำขอ'],
      ...company.activity.map(row => ['Demo', company.name, company.requests, company.monthlyRequests, row.date, row.endpoint, row.status, row.requests]),
      ...(company.activity.length ? [] : [['Demo', company.name, company.requests, company.monthlyRequests, '', '', '', 0]]),
    ])
    : makeCsv([
      ['ข้อมูลตัวอย่าง / Demo data', 'บริษัท', 'เลขที่ใบแจ้งหนี้', 'วันที่ออก', 'วันครบกำหนด', 'จำนวนเงิน (THB)', 'สถานะ'],
      ...company.invoices.map(row => ['Demo', company.name, row.id, row.date, row.due, row.amount, row.status]),
    ]);
}

export function downloadCompanyCsv(company: Company, page: 'dashboard' | 'billing') {
  const url = URL.createObjectURL(new Blob([companyCsv(company, page)], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `${company.id}-${page}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
