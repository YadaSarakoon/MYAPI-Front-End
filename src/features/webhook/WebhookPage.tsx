import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Header } from '../../components/layout/Header';
import { PageContainer } from '../../components/layout/PageContainer';
import { Sidebar } from '../../components/layout/Sidebar';
import { SidebarLogoutButton } from '../../components/layout/SidebarLogoutButton';
import { useAuth } from '../auth/useAuth';
import { demoWebhookService } from './services/webhookService';
import { WEBHOOK_EVENTS } from './types';
import type { DateFilter, DeliveryFilter, WebhookDelivery, WebhookEndpoint, WebhookEndpointInput, WebhookEventType } from './types';

const links = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'API Docs', path: '/docs' },
  { label: 'Sandbox', path: '/sandbox' },
  { label: 'Production', path: '/production' },
  { label: 'Webhook', path: '/webhook' },
  { label: 'Billing', path: '/billing' },
];

const EMPTY_FORM: WebhookEndpointInput = {
  name: '',
  url: '',
  events: [],
  description: '',
  enabled: true,
};

const COPY = {
  EN: {
    title: 'Webhook Management', subtitle: 'Configure event notifications and inspect example delivery activity.', logout: 'Log out', logoutError: 'Could not log out', retry: 'Retry',
    totalEndpoints: 'Total Endpoints', activeEndpoints: 'Active Endpoints', successful: 'Successful Deliveries', failed: 'Failed Deliveries', exampleEndpoints: 'Example endpoints', enabledDemo: 'Enabled in this demo', exampleLogs: 'Example log records',
    endpoints: 'Endpoints', endpointsDesc: 'Manage subscribed event destinations.', addEndpoint: '＋ Add Endpoint', loadingEndpoints: 'Loading example endpoints…', noEndpoints: 'No endpoints configured', noEndpointsHint: 'Add an HTTPS endpoint to see how endpoint management works in this demo.',
    subscribedEvents: 'Subscribed events', lastDelivery: 'Last delivery', noneYet: 'No delivery yet', enabled: 'Enabled', disabled: 'Disabled', view: 'View', edit: 'Edit', disable: 'Disable', enable: 'Enable', test: 'Test', delete: 'Delete',
    logs: 'Webhook Event Logs', logsDesc: 'Example delivery records; not live account activity.', loadingLogs: 'Loading example delivery logs…', allStatuses: 'All statuses', delivered: 'Delivered', allEvents: 'All event types', anyTime: 'Any time', last24: 'Last 24 hours', last7: 'Last 7 days', last30: 'Last 30 days', noMatches: 'No matching log records. Try changing the filters.',
    timestamp: 'Timestamp', eventType: 'Event Type', endpoint: 'Endpoint', http: 'HTTP', status: 'Status', attempts: 'Attempts', response: 'Response', details: 'Details', inspect: 'Inspect',
    addTitle: 'Add Webhook Endpoint', editTitle: 'Edit Webhook Endpoint', name: 'Endpoint Name', url: 'Webhook URL', required: '*', httpsHint: 'Production endpoints must use HTTPS.', subscriptions: 'Event Subscriptions', description: 'Description', optional: '(optional)', enableEndpoint: 'Enable endpoint', enableHint: 'Demo state only; does not enable delivery.', cancel: 'Cancel', save: 'Save Endpoint', saving: 'Saving…',
    enterName: 'Enter an endpoint name.', enterUrl: 'Enter a webhook URL.', invalidUrl: 'Enter a valid HTTPS URL.', httpsError: 'Production webhook URLs must use HTTPS.', selectEvent: 'Select at least one event.', saveError: 'The example endpoint could not be saved. Try again.',
    savedCreate: 'Example endpoint added', savedEdit: 'Example endpoint updated', savedHint: 'Saved in this browser session only. No Backend request was made.', deleted: 'Example endpoint deleted', deletedHint: 'No Backend request was made.', close: 'Close', enabledNotice: 'Example endpoint enabled', disabledNotice: 'Example endpoint disabled', localToggle: 'This change is local to the current browser session.',
    detailsTitle: 'Endpoint Details', signingNote: 'Signing configuration is not displayed here. Signature format and secret rotation require a confirmed Backend contract. No signing secret is stored in this demo.', noDescription: 'No description provided.',
    testTitle: 'Test Webhook · Demo Preview', testNote: 'This is a mock demonstration. It will not send an HTTP request or create a delivery log.', sampleEvent: 'Sample event', destination: 'Destination', mockResult: 'Show Mock Result', mockOnly: 'Mock demonstration only', testResult: 'Selected event: {event}. No request was sent to {url}. A real HTTP status and response require Backend support.',
    deliveryTitle: 'Delivery Details · Example Record', eventId: 'Event ID', requestUrl: 'Request URL', responseBody: 'Response Body', requestHeaders: 'Request Headers', requestPayload: 'Request Payload', attemptsTitle: 'Delivery Attempts', attempt: 'Attempt', noResponse: 'No response', copyJson: 'Copy JSON', copied: 'Copied', noResponseBody: 'No response body in example record.',
    dismiss: 'Dismiss message', unknownLoadError: 'Could not load the local example data. Please retry.', logoutDetail: 'Please try again.',
  },
  TH: {
    title: 'จัดการ Webhook', subtitle: 'ตั้งค่าการแจ้งเตือนเหตุการณ์และตรวจสอบตัวอย่างประวัติการส่ง', logout: 'ออกจากระบบ', logoutError: 'ออกจากระบบไม่สำเร็จ', retry: 'ลองอีกครั้ง',
    totalEndpoints: 'Endpoint ทั้งหมด', activeEndpoints: 'Endpoint ที่เปิดใช้', successful: 'ส่งสำเร็จ', failed: 'ส่งไม่สำเร็จ', exampleEndpoints: 'Endpoint ตัวอย่าง', enabledDemo: 'เปิดใช้ในตัวอย่างนี้', exampleLogs: 'รายการตัวอย่าง',
    endpoints: 'Endpoints', endpointsDesc: 'จัดการปลายทางที่สมัครรับเหตุการณ์', addEndpoint: '＋ เพิ่ม Endpoint', loadingEndpoints: 'กำลังโหลด Endpoint ตัวอย่าง…', noEndpoints: 'ยังไม่มี Endpoint', noEndpointsHint: 'เพิ่ม HTTPS endpoint เพื่อทดลองการจัดการในหน้านี้',
    subscribedEvents: 'เหตุการณ์ที่สมัครรับ', lastDelivery: 'ส่งล่าสุด', noneYet: 'ยังไม่มีประวัติการส่ง', enabled: 'เปิดใช้', disabled: 'ปิดใช้', view: 'ดู', edit: 'แก้ไข', disable: 'ปิดใช้', enable: 'เปิดใช้', test: 'ทดสอบ', delete: 'ลบ',
    logs: 'ประวัติ Webhook Events', logsDesc: 'รายการส่งตัวอย่าง ไม่ใช่กิจกรรมจริงของบัญชี', loadingLogs: 'กำลังโหลดประวัติการส่งตัวอย่าง…', allStatuses: 'ทุกสถานะ', delivered: 'ส่งแล้ว', allEvents: 'ทุกประเภทเหตุการณ์', anyTime: 'ทุกช่วงเวลา', last24: '24 ชั่วโมงล่าสุด', last7: '7 วันล่าสุด', last30: '30 วันล่าสุด', noMatches: 'ไม่พบรายการที่ตรงกัน ลองเปลี่ยนตัวกรอง',
    timestamp: 'เวลา', eventType: 'ประเภทเหตุการณ์', endpoint: 'ปลายทาง', http: 'HTTP', status: 'สถานะ', attempts: 'จำนวนครั้ง', response: 'Response', details: 'รายละเอียด', inspect: 'ตรวจสอบ',
    addTitle: 'เพิ่ม Webhook Endpoint', editTitle: 'แก้ไข Webhook Endpoint', name: 'ชื่อ Endpoint', url: 'Webhook URL', required: '*', httpsHint: 'Endpoint สำหรับ Production ต้องใช้ HTTPS', subscriptions: 'เหตุการณ์ที่ต้องการรับ', description: 'คำอธิบาย', optional: '(ไม่บังคับ)', enableEndpoint: 'เปิดใช้ Endpoint', enableHint: 'เปลี่ยนสถานะตัวอย่างเท่านั้น ยังไม่เปิดการส่งจริง', cancel: 'ยกเลิก', save: 'บันทึก Endpoint', saving: 'กำลังบันทึก…',
    enterName: 'กรุณาระบุชื่อ Endpoint', enterUrl: 'กรุณาระบุ Webhook URL', invalidUrl: 'กรุณาระบุ HTTPS URL ที่ถูกต้อง', httpsError: 'Webhook URL สำหรับ Production ต้องใช้ HTTPS', selectEvent: 'เลือกอย่างน้อยหนึ่งเหตุการณ์', saveError: 'บันทึก Endpoint ตัวอย่างไม่สำเร็จ กรุณาลองอีกครั้ง',
    savedCreate: 'เพิ่ม Endpoint ตัวอย่างแล้ว', savedEdit: 'แก้ไข Endpoint ตัวอย่างแล้ว', savedHint: 'บันทึกไว้ใน session ของเบราว์เซอร์นี้เท่านั้น ไม่มีการเรียก Backend', deleted: 'ลบ Endpoint ตัวอย่างแล้ว', deletedHint: 'ไม่มีการเรียก Backend', close: 'ปิด', enabledNotice: 'เปิดใช้ Endpoint ตัวอย่างแล้ว', disabledNotice: 'ปิดใช้ Endpoint ตัวอย่างแล้ว', localToggle: 'การเปลี่ยนแปลงมีผลเฉพาะใน session ของเบราว์เซอร์นี้',
    detailsTitle: 'รายละเอียด Endpoint', signingNote: 'ไม่แสดงการตั้งค่า Signing เนื่องจากยังต้องยืนยันรูปแบบลายเซ็นและการจัดการ secret กับ Backend ไม่มีการเก็บ signing secret ในตัวอย่างนี้', noDescription: 'ไม่ได้ระบุคำอธิบาย',
    testTitle: 'ทดสอบ Webhook · ตัวอย่าง', testNote: 'นี่เป็นการจำลองเท่านั้น ไม่มีการส่ง HTTP request หรือเพิ่มประวัติการส่ง', sampleEvent: 'เหตุการณ์ตัวอย่าง', destination: 'ปลายทาง', mockResult: 'แสดงผลจำลอง', mockOnly: 'การจำลองเท่านั้น', testResult: 'เหตุการณ์ที่เลือก: {event} ไม่มีการส่ง request ไปยัง {url} สถานะ HTTP และ response จริงต้องเชื่อมต่อ Backend',
    deliveryTitle: 'รายละเอียดการส่ง · รายการตัวอย่าง', eventId: 'รหัสเหตุการณ์', requestUrl: 'Request URL', responseBody: 'Response Body', requestHeaders: 'Request Headers', requestPayload: 'Request Payload', attemptsTitle: 'ประวัติการลองส่ง', attempt: 'ครั้งที่', noResponse: 'ไม่มี response', copyJson: 'คัดลอก JSON', copied: 'คัดลอกแล้ว', noResponseBody: 'รายการตัวอย่างนี้ไม่มี response body',
    dismiss: 'ปิดข้อความ', unknownLoadError: 'โหลดข้อมูลตัวอย่างไม่สำเร็จ กรุณาลองอีกครั้ง', logoutDetail: 'กรุณาลองอีกครั้ง',
  },
} as const;

function formatTimestamp(value: string, language: 'TH' | 'EN') {
  return new Intl.DateTimeFormat(language === 'TH' ? 'th-TH' : 'en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

function json(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function MetricCard({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <Card>
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value.toLocaleString()}</div>
      <div className="mt-1 text-[10px] text-slate-400">{hint}</div>
    </Card>
  );
}

function Dialog({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-label={title} className={`my-auto max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-xl ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <h2 className="text-sm font-bold text-slate-950">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-lg px-2 py-1 text-lg leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
        </div>
        <div className="p-5">{children}</div>
      </section>
    </div>
  );
}

function JsonPanel({ label, value, copyLabel = 'Copy JSON', copiedLabel = 'Copied' }: { label: string; value: unknown; copyLabel?: string; copiedLabel?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(json(value));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</h3>
        <button type="button" onClick={() => void handleCopy()} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800">{copied ? copiedLabel : copyLabel}</button>
      </div>
      <pre className="max-h-64 overflow-auto bg-white p-3 text-[10px] leading-5 text-slate-700">{json(value)}</pre>
    </div>
  );
}

export function WebhookPage() {
  const { user, logout } = useAuth();
  const [language, setLanguage] = useState<'TH' | 'EN'>('TH');
  const copy = COPY[language];
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState<{ title: string; detail: string; tone: 'emerald' | 'amber' | 'rose' } | null>(null);
  const [dialog, setDialog] = useState<'create' | 'edit' | 'test' | 'delivery' | 'details' | null>(null);
  const [editingEndpoint, setEditingEndpoint] = useState<WebhookEndpoint | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<WebhookDelivery | null>(null);
  const [form, setForm] = useState<WebhookEndpointInput>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [testEvent, setTestEvent] = useState<WebhookEventType>('parcel.created');
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilter>('all');
  const [eventFilter, setEventFilter] = useState<'all' | WebhookEventType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const loadData = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [endpointData, deliveryData] = await Promise.all([
        demoWebhookService.listEndpoints(),
        demoWebhookService.listDeliveries(),
      ]);
      setEndpoints(endpointData);
      setDeliveries(deliveryData);
    } catch {
      setLoadError('load_failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    Promise.all([demoWebhookService.listEndpoints(), demoWebhookService.listDeliveries()])
      .then(([endpointData, deliveryData]) => {
        if (!mounted) return;
        setEndpoints(endpointData);
        setDeliveries(deliveryData);
      })
      .catch(() => {
        if (mounted) setLoadError('load_failed');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const latestDeliveryTimestamp = deliveries.reduce((latest, item) => Math.max(latest, new Date(item.timestamp).getTime()), 0);
  const filteredDeliveries = useMemo(() => deliveries.filter((delivery) => {
    if (deliveryFilter !== 'all' && delivery.status !== deliveryFilter) return false;
    if (eventFilter !== 'all' && delivery.eventType !== eventFilter) return false;
    if (dateFilter !== 'all') {
      const age = latestDeliveryTimestamp - new Date(delivery.timestamp).getTime();
      const maxAge = dateFilter === 'today' ? 24 * 60 * 60 * 1000 : dateFilter === '7days' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
      if (age < 0 || age > maxAge) return false;
    }
    return true;
  }), [deliveries, deliveryFilter, eventFilter, dateFilter, latestDeliveryTimestamp]);

  const openCreate = () => {
    setEditingEndpoint(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setDialog('create');
  };

  const openEdit = (endpoint: WebhookEndpoint) => {
    setEditingEndpoint(endpoint);
    setForm({ name: endpoint.name, url: endpoint.url, events: [...endpoint.events], description: endpoint.description, enabled: endpoint.enabled });
    setFormError('');
    setDialog('edit');
  };

  const saveEndpoint = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError('');
    const trimmedUrl = form.url.trim();
    if (!form.name.trim()) return setFormError(copy.enterName);
    if (!trimmedUrl) return setFormError(copy.enterUrl);
    try {
      const parsedUrl = new URL(trimmedUrl);
      if (parsedUrl.protocol !== 'https:') return setFormError(copy.httpsError);
    } catch {
      return setFormError(copy.invalidUrl);
    }
    if (form.events.length === 0) return setFormError(copy.selectEvent);

    setSaving(true);
    try {
      const saved = await demoWebhookService.saveEndpoint({ ...form, name: form.name.trim(), url: trimmedUrl, description: form.description.trim() }, editingEndpoint?.id);
      setEndpoints((current) => editingEndpoint ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]);
      setDialog(null);
      setNotice({ title: editingEndpoint ? copy.savedEdit : copy.savedCreate, detail: copy.savedHint, tone: 'emerald' });
    } catch {
      setFormError(copy.saveError);
    } finally {
      setSaving(false);
    }
  };

  const toggleEndpoint = async (endpoint: WebhookEndpoint) => {
    await demoWebhookService.setEndpointEnabled(endpoint.id, !endpoint.enabled);
    setEndpoints((current) => current.map((item) => item.id === endpoint.id ? { ...item, enabled: !item.enabled } : item));
    setNotice({ title: endpoint.enabled ? copy.disabledNotice : copy.enabledNotice, detail: copy.localToggle, tone: 'amber' });
  };

  const deleteEndpoint = async (endpoint: WebhookEndpoint) => {
    if (!window.confirm(language === 'TH' ? `ลบ Endpoint ตัวอย่าง “${endpoint.name}” หรือไม่? การเปลี่ยนแปลงนี้มีผลเฉพาะข้อมูลตัวอย่าง` : `Delete the example endpoint “${endpoint.name}”? This only changes local demo data.`)) return;
    await demoWebhookService.deleteEndpoint(endpoint.id);
    setEndpoints((current) => current.filter((item) => item.id !== endpoint.id));
    setNotice({ title: copy.deleted, detail: copy.deletedHint, tone: 'amber' });
  };

  const openTest = (endpoint: WebhookEndpoint) => {
    setEditingEndpoint(endpoint);
    setTestEvent(endpoint.events[0] ?? 'parcel.created');
    setDialog('test');
  };

  const showMockTest = () => {
    setDialog(null);
    setNotice({ title: copy.mockOnly, detail: copy.testResult.replace('{event}', testEvent).replace('{url}', editingEndpoint?.url ?? ''), tone: 'amber' });
  };

  const openDelivery = (delivery: WebhookDelivery) => {
    setSelectedDelivery(delivery);
    setDialog('delivery');
  };

  const activeEndpointCount = endpoints.filter((endpoint) => endpoint.enabled).length;
  const successCount = deliveries.filter((delivery) => delivery.status === 'Delivered').length;
  const failedCount = deliveries.filter((delivery) => delivery.status === 'Failed').length;

  const handleLogout = async () => {
    try { await logout(); } catch { setNotice({ title: copy.logoutError, detail: copy.logoutDetail, tone: 'rose' }); }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
      <Sidebar items={links} activePath="/webhook" footer={<SidebarLogoutButton label={copy.logout} onClick={() => void handleLogout()} />} />
      <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
        <Header title={copy.title} subtitle={copy.subtitle} userName={user?.displayName || user?.email || 'My Company'} userMeta="Developer Account" actions={<div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">{(['TH', 'EN'] as const).map((code) => <button key={code} type="button" onClick={() => setLanguage(code)} aria-pressed={language === code} className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${language === code ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{code}</button>)}</div>} />
        <PageContainer className="!px-6 !py-7 lg:!px-10">
          <div className="mx-auto max-w-[1440px] space-y-5">

            {notice && (
              <div role="status" className={`flex flex-col gap-2 rounded-xl border px-4 py-3 sm:flex-row sm:items-start sm:justify-between ${notice.tone === 'emerald' ? 'border-emerald-200 bg-emerald-50' : notice.tone === 'rose' ? 'border-rose-200 bg-rose-50' : 'border-amber-200 bg-amber-50'}`}>
                <div><div className="text-xs font-bold text-slate-900">{notice.title}</div><p className="mt-1 text-[10px] leading-5 text-slate-600">{notice.detail}</p></div>
                <button type="button" onClick={() => setNotice(null)} aria-label="Dismiss message" className="self-start text-slate-400 hover:text-slate-700">×</button>
              </div>
            )}

            {loadError && <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3"><p className="text-xs text-rose-700">{copy.unknownLoadError}</p><Button type="button" size="sm" variant="secondary" onClick={() => void loadData()}>{copy.retry}</Button></div>}

            <section aria-label="Webhook overview" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label={copy.totalEndpoints} value={endpoints.length} hint={copy.exampleEndpoints} />
              <MetricCard label={copy.activeEndpoints} value={activeEndpointCount} hint={copy.enabledDemo} />
              <MetricCard label={copy.successful} value={successCount} hint={copy.exampleLogs} />
              <MetricCard label={copy.failed} value={failedCount} hint={copy.exampleLogs} />
            </section>

            <Card padded={false}>
              <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h2 className="text-sm font-bold text-slate-950">{copy.endpoints}</h2><p className="mt-1 text-xs text-slate-500">{copy.endpointsDesc}</p></div>
                <Button type="button" onClick={openCreate}>{copy.addEndpoint}</Button>
              </div>
              {loading ? <div className="p-8 text-center text-xs text-slate-500" role="status">{copy.loadingEndpoints}</div> : endpoints.length === 0 ? (
                <div className="px-5 py-10 text-center"><div className="text-sm font-bold text-slate-800">{copy.noEndpoints}</div><p className="mt-1 text-xs text-slate-500">{copy.noEndpointsHint}</p><Button type="button" className="mt-4" onClick={openCreate}>{copy.addEndpoint}</Button></div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {endpoints.map((endpoint) => (
                    <article key={endpoint.id} className="flex flex-col gap-4 px-5 py-4 xl:flex-row xl:items-center">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2"><h3 className="text-xs font-bold text-slate-900">{endpoint.name}</h3><Badge tone={endpoint.enabled ? 'emerald' : 'slate'}>{endpoint.enabled ? copy.enabled : copy.disabled}</Badge></div>
                        <p className="mt-1 break-all font-mono text-[10px] text-slate-500">{endpoint.url}</p>
                        {endpoint.description && <p className="mt-1 text-[10px] text-slate-400">{endpoint.description}</p>}
                      </div>
                      <div className="min-w-0 xl:w-64"><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{copy.subscribedEvents}</div><div className="mt-1 flex flex-wrap gap-1">{endpoint.events.map((eventName) => <span key={eventName} className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[9px] text-slate-600">{eventName}</span>)}</div></div>
                      <div className="shrink-0 text-[10px] text-slate-500 xl:w-36"><div className="font-semibold text-slate-700">{copy.lastDelivery}</div><div className="mt-1">{endpoint.lastDelivery ?? copy.noneYet}</div></div>
                      <div className="flex flex-wrap gap-1 xl:w-[240px] xl:justify-end">
                        <button type="button" onClick={() => { setEditingEndpoint(endpoint); setDialog('details'); }} className="rounded-lg px-2.5 py-2 text-[10px] font-semibold text-indigo-600 hover:bg-indigo-50">{copy.view}</button>
                        <button type="button" onClick={() => openEdit(endpoint)} className="rounded-lg px-2.5 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-100">{copy.edit}</button>
                        <button type="button" onClick={() => void toggleEndpoint(endpoint)} className="rounded-lg px-2.5 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-100">{endpoint.enabled ? copy.disable : copy.enable}</button>
                        <button type="button" onClick={() => openTest(endpoint)} className="rounded-lg px-2.5 py-2 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50">{copy.test}</button>
                        <button type="button" onClick={() => void deleteEndpoint(endpoint)} className="rounded-lg px-2.5 py-2 text-[10px] font-semibold text-rose-600 hover:bg-rose-50">{copy.delete}</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Card>

            <Card padded={false}>
              <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                <div><h2 className="text-sm font-bold text-slate-950">{copy.logs}</h2><p className="mt-1 text-xs text-slate-500">{copy.logsDesc}</p></div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <label className="sr-only" htmlFor="delivery-filter">{copy.status}</label><select id="delivery-filter" value={deliveryFilter} onChange={(event) => setDeliveryFilter(event.target.value as DeliveryFilter)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-600"><option value="all">{copy.allStatuses}</option><option value="Delivered">{copy.delivered}</option><option value="Failed">{copy.failed}</option></select>
                  <label className="sr-only" htmlFor="event-filter">{copy.eventType}</label><select id="event-filter" value={eventFilter} onChange={(event) => setEventFilter(event.target.value as 'all' | WebhookEventType)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-600"><option value="all">{copy.allEvents}</option>{WEBHOOK_EVENTS.map((eventName) => <option key={eventName} value={eventName}>{eventName}</option>)}</select>
                  <label className="sr-only" htmlFor="date-filter">{copy.timestamp}</label><select id="date-filter" value={dateFilter} onChange={(event) => setDateFilter(event.target.value as DateFilter)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[10px] text-slate-600"><option value="all">{copy.anyTime}</option><option value="today">{copy.last24}</option><option value="7days">{copy.last7}</option><option value="30days">{copy.last30}</option></select>
                </div>
              </div>
              {loading ? <div className="p-8 text-center text-xs text-slate-500">{copy.loadingLogs}</div> : filteredDeliveries.length === 0 ? <div className="p-8 text-center text-xs text-slate-500">{copy.noMatches}</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead><tr className="border-b border-slate-100 bg-slate-50/60"><th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">{copy.timestamp}</th><th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">{copy.eventType}</th><th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">{copy.endpoint}</th><th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">{copy.http}</th><th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">{copy.status}</th><th className="px-5 py-3 text-[9px] font-semibold uppercase tracking-wider text-slate-400">{copy.attempts}</th><th className="px-5 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">{copy.response}</th><th className="px-5 py-3 text-right text-[9px] font-semibold uppercase tracking-wider text-slate-400">{copy.details}</th></tr></thead>
                    <tbody>{filteredDeliveries.map((delivery) => <tr key={delivery.id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"><td className="whitespace-nowrap px-5 py-3 text-[10px] text-slate-500">{formatTimestamp(delivery.timestamp, language)}</td><td className="px-5 py-3"><code className="font-mono text-[10px] text-slate-700">{delivery.eventType}</code></td><td className="px-5 py-3 text-[10px] text-slate-600">{delivery.endpointName}</td><td className="px-5 py-3 text-xs font-semibold text-slate-700">{delivery.statusCode ?? '—'}</td><td className="px-5 py-3"><Badge tone={delivery.status === 'Delivered' ? 'emerald' : 'rose'}>{delivery.status === 'Delivered' ? copy.delivered : copy.failed}</Badge></td><td className="px-5 py-3 text-xs text-slate-600">{delivery.attempts.length}</td><td className="px-5 py-3 text-right text-xs text-slate-500">{delivery.responseTimeMs === null ? '—' : `${delivery.responseTimeMs} ms`}</td><td className="px-5 py-3 text-right"><button type="button" onClick={() => openDelivery(delivery)} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800">{copy.inspect}</button></td></tr>)}</tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </PageContainer>
      </main>

      {(dialog === 'create' || dialog === 'edit') && (
        <Dialog title={dialog === 'create' ? copy.addTitle : copy.editTitle} onClose={() => setDialog(null)}>
          <form onSubmit={(event) => void saveEndpoint(event)} className="space-y-4">
            <div><label htmlFor="endpoint-name" className="mb-1.5 block text-xs font-semibold text-slate-700">{copy.name} <span className="text-rose-500">{copy.required}</span></label><input id="endpoint-name" autoFocus value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-indigo-400" placeholder="e.g. Order service" /></div>
            <div><label htmlFor="endpoint-url" className="mb-1.5 block text-xs font-semibold text-slate-700">{copy.url} <span className="text-rose-500">{copy.required}</span></label><input id="endpoint-url" type="url" value={form.url} onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 font-mono text-xs outline-none focus:border-indigo-400" placeholder="https://example.com/webhook" /><p className="mt-1 text-[10px] text-slate-400">{copy.httpsHint}</p></div>
            <fieldset><legend className="mb-2 text-xs font-semibold text-slate-700">{copy.subscriptions} <span className="text-rose-500">{copy.required}</span></legend><div className="grid gap-2 sm:grid-cols-2">{WEBHOOK_EVENTS.map((eventName) => <label key={eventName} className="flex items-center gap-2 rounded-lg border border-slate-100 px-3 py-2"><input type="checkbox" checked={form.events.includes(eventName)} onChange={(event) => setForm((current) => ({ ...current, events: event.target.checked ? [...current.events, eventName] : current.events.filter((item) => item !== eventName) }))} className="h-3.5 w-3.5 accent-indigo-600" /><code className="text-[10px] text-slate-600">{eventName}</code></label>)}</div></fieldset>
            <div><label htmlFor="endpoint-description" className="mb-1.5 block text-xs font-semibold text-slate-700">{copy.description} <span className="font-normal text-slate-400">{copy.optional}</span></label><textarea id="endpoint-description" rows={2} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="w-full resize-y rounded-lg border border-slate-200 px-3 py-2.5 text-xs outline-none focus:border-indigo-400" /></div>
            <label className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-3"><span><span className="block text-xs font-semibold text-slate-700">{copy.enableEndpoint}</span><span className="mt-0.5 block text-[10px] text-slate-400">{copy.enableHint}</span></span><input type="checkbox" checked={form.enabled} onChange={(event) => setForm((current) => ({ ...current, enabled: event.target.checked }))} className="h-4 w-4 accent-indigo-600" /></label>
            {formError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">{formError}</p>}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button type="button" variant="secondary" onClick={() => setDialog(null)}>{copy.cancel}</Button><Button type="submit" disabled={saving}>{saving ? copy.saving : copy.save}</Button></div>
          </form>
        </Dialog>
      )}

      {dialog === 'details' && editingEndpoint && (
        <Dialog title={copy.detailsTitle} onClose={() => setDialog(null)}>
          <div className="space-y-4">
            <div className="flex items-center justify-between"><span className="text-xs text-slate-500">{copy.status}</span><Badge tone={editingEndpoint.enabled ? 'emerald' : 'slate'}>{editingEndpoint.enabled ? copy.enabled : copy.disabled}</Badge></div>
            <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{copy.name}</div><p className="mt-1 text-xs font-semibold text-slate-800">{editingEndpoint.name}</p></div>
            <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{copy.requestUrl}</div><p className="mt-1 break-all font-mono text-xs text-slate-700">{editingEndpoint.url}</p></div>
            <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{copy.subscribedEvents}</div><div className="mt-2 flex flex-wrap gap-1">{editingEndpoint.events.map((eventName) => <code key={eventName} className="rounded-md bg-slate-100 px-2 py-1 text-[10px] text-slate-600">{eventName}</code>)}</div></div>
            <div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{copy.description}</div><p className="mt-1 text-xs text-slate-600">{editingEndpoint.description || copy.noDescription}</p></div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[10px] leading-5 text-amber-800">{copy.signingNote}</div>
            <div className="flex justify-end"><Button type="button" variant="secondary" onClick={() => setDialog(null)}>{copy.close}</Button></div>
          </div>
        </Dialog>
      )}

      {dialog === 'test' && editingEndpoint && (
        <Dialog title={copy.testTitle} onClose={() => setDialog(null)}>
          <div className="space-y-4">
            <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[10px] leading-5 text-amber-800">{copy.testNote}</p>
            <div><label htmlFor="test-event" className="mb-1.5 block text-xs font-semibold text-slate-700">{copy.sampleEvent}</label><select id="test-event" value={testEvent} onChange={(event) => setTestEvent(event.target.value as WebhookEventType)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs">{WEBHOOK_EVENTS.filter((eventName) => editingEndpoint.events.includes(eventName)).map((eventName) => <option key={eventName}>{eventName}</option>)}</select></div>
            <div><div className="mb-1.5 text-xs font-semibold text-slate-700">{copy.destination}</div><code className="block break-all rounded-lg bg-slate-50 p-3 text-[10px] text-slate-600">{editingEndpoint.url}</code></div>
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4"><Button type="button" variant="secondary" onClick={() => setDialog(null)}>{copy.cancel}</Button><Button type="button" onClick={showMockTest}>{copy.mockResult}</Button></div>
          </div>
        </Dialog>
      )}

      {dialog === 'delivery' && selectedDelivery && (
        <Dialog title={copy.deliveryTitle} onClose={() => setDialog(null)} wide>
          <div className="space-y-4">
            <div className="grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2"><div><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{copy.eventId}</div><code className="mt-1 block text-[10px] text-slate-700">{selectedDelivery.eventId}</code></div><div><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{copy.eventType}</div><code className="mt-1 block text-[10px] text-slate-700">{selectedDelivery.eventType}</code></div><div><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{copy.requestUrl}</div><code className="mt-1 block break-all text-[10px] text-slate-700">{selectedDelivery.requestUrl}</code></div><div><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{copy.response}</div><div className="mt-1 flex items-center gap-2"><Badge tone={selectedDelivery.status === 'Delivered' ? 'emerald' : 'rose'}>{selectedDelivery.status === 'Delivered' ? copy.delivered : copy.failed}</Badge><span className="text-xs text-slate-600">{selectedDelivery.statusCode ?? copy.noResponse}</span></div></div><div><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{copy.timestamp}</div><p className="mt-1 text-[10px] text-slate-700">{formatTimestamp(selectedDelivery.timestamp, language)}</p></div><div><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{copy.response}</div><p className="mt-1 text-[10px] text-slate-700">{selectedDelivery.responseTimeMs === null ? '—' : `${selectedDelivery.responseTimeMs} ms`}</p></div></div>
            <div className="grid gap-3 lg:grid-cols-2"><JsonPanel label={copy.requestHeaders} value={selectedDelivery.requestHeaders} copyLabel={copy.copyJson} copiedLabel={copy.copied} /><JsonPanel label={copy.requestPayload} value={selectedDelivery.requestPayload} copyLabel={copy.copyJson} copiedLabel={copy.copied} /><JsonPanel label={copy.responseBody} value={selectedDelivery.responseBody ?? { message: copy.noResponseBody }} copyLabel={copy.copyJson} copiedLabel={copy.copied} /></div>
            <div className="rounded-xl border border-slate-200 p-3"><h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{copy.attemptsTitle}</h3><div className="mt-2 space-y-2">{selectedDelivery.attempts.map((attempt) => <div key={`${attempt.number}-${attempt.attemptedAt}`} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-[10px] text-slate-600"><span>{copy.attempt} {attempt.number} · {formatTimestamp(attempt.attemptedAt, language)}</span><span>HTTP {attempt.statusCode ?? '—'} · {attempt.responseTimeMs === null ? '—' : `${attempt.responseTimeMs} ms`}</span></div>)}</div></div>
            <div className="flex justify-end"><Button type="button" variant="secondary" onClick={() => setDialog(null)}>{copy.close}</Button></div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

