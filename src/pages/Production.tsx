import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { Header as ConsoleHeader } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Sidebar as AppSidebar } from '../components/layout/Sidebar';

// ============================================================
// TYPES
// ============================================================

type Tab =
    | 'Overview'
    | 'Create Shipment'
    | 'Tracking'
    | 'Webhook'
    | 'API Activity';

type ShipmentType = 'insured' | 'non-insured';

type AccessStatus =
    | 'login'
    | 'not_applied'
    | 'pending'
    | 'approved';

type ActivityStatus = 'Success' | 'Failed';

interface Activity {
    id: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    status: ActivityStatus;
    amount: string;
    time: string;
}

interface ShipmentForm {
    shipmentType: ShipmentType;

    senderName: string;
    senderPhone: string;
    senderAddress: string;
    senderProvince: string;
    senderDistrict: string;
    senderSubDistrict: string;
    senderZipCode: string;

    receiverName: string;
    receiverPhone: string;
    receiverAddress: string;
    receiverProvince: string;
    receiverDistrict: string;
    receiverSubDistrict: string;
    receiverZipCode: string;

    weightGram: string;
    declaredValue: string;
    note: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const PRODUCTION_BASE_URL = 'https://open-api.myexpress.ai';

const NAV_LINKS = [
    { to: '/docs', label: 'API Docs' },
    { to: '/sandbox', label: 'Sandbox' },
    { to: '/production', label: 'Production' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/wallet', label: 'Wallet' },
    { to: '/webhook', label: 'Webhook' },
];

const TABS: { id: Tab; label: string }[] = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Create Shipment', label: 'Create Shipment' },
    { id: 'Tracking', label: 'Tracking' },
    { id: 'Webhook', label: 'Webhook' },
    { id: 'API Activity', label: 'API Activity' },
];

const INITIAL_FORM: ShipmentForm = {
    shipmentType: 'non-insured',

    senderName: '',
    senderPhone: '',
    senderAddress: '',
    senderProvince: '',
    senderDistrict: '',
    senderSubDistrict: '',
    senderZipCode: '',

    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverProvince: '',
    receiverDistrict: '',
    receiverSubDistrict: '',
    receiverZipCode: '',

    weightGram: '1000',
    declaredValue: '',
    note: '',
};

const RECENT_ACTIVITY: Activity[] = [
    {
        id: '1',
        method: 'POST',
        endpoint: '/v1/parcel',
        status: 'Success',
        amount: '฿32.00',
        time: 'Today, 14:22',
    },
    {
        id: '2',
        method: 'GET',
        endpoint: '/v1/tracking/TH048855193',
        status: 'Success',
        amount: '—',
        time: 'Today, 14:18',
    },
    {
        id: '3',
        method: 'POST',
        endpoint: '/v1/parcel',
        status: 'Success',
        amount: '฿45.00',
        time: 'Today, 14:02',
    },
    {
        id: '4',
        method: 'POST',
        endpoint: '/v1/parcel',
        status: 'Failed',
        amount: '฿0.00',
        time: 'Yesterday, 17:45',
    },
];

const METHOD_STYLE = {
    GET: {
        text: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
    },
    POST: {
        text: 'text-indigo-700',
        bg: 'bg-indigo-50',
        border: 'border-indigo-200',
    },
    PUT: {
        text: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
    },
    DELETE: {
        text: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
    },
} as const;

// ============================================================
// SMALL UI COMPONENTS
// ============================================================

function StatusDot({ active = false }: { active?: boolean }) {
    return (
        <span className="relative flex h-2.5 w-2.5">
            {active && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            )}

            <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    active ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
            />
        </span>
    );
}

function MethodChip({
    method,
}: {
    method: keyof typeof METHOD_STYLE;
}) {
    const style = METHOD_STYLE[method];

    return (
        <span
            className={`inline-flex shrink-0 items-center justify-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold ${style.bg} ${style.text} ${style.border}`}
        >
            {method}
        </span>
    );
}

function SectionTitle({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div className="mb-4">
            <h2 className="text-sm font-bold text-slate-900">
                {title}
            </h2>

            {description && (
                <p className="mt-1 text-xs leading-5 text-slate-500">
                    {description}
                </p>
            )}
        </div>
    );
}

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        if (!text) return;

        try {
            await navigator.clipboard.writeText(text);

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1200);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="rounded-md px-2 py-1 text-[10px] font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
        >
            {copied ? 'Copied ✓' : 'Copy'}
        </button>
    );
}

function StatCard({
    label,
    value,
    description,
    action,
}: {
    label: string;
    value: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        {label}
                    </div>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                        {value}
                    </p>

                    <p className="mt-1.5 text-xs text-slate-400">
                        {description}
                    </p>
                </div>

                {action}
            </div>
        </div>
    );
}

function Field({
    label,
    required = false,
    children,
}: {
    label: string;
    required?: boolean;
    children: ReactNode;
}) {
    return (
        <label className="block min-w-0">
            <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {label}

                {required && (
                    <span className="ml-1 text-rose-500">
                        *
                    </span>
                )}
            </span>

            {children}
        </label>
    );
}

function Input({
    value,
    onChange,
    placeholder,
    type = 'text',
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <input
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
    );
}

function TextArea({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
    );
}

function StatusBadge({
    status,
}: {
    status: ActivityStatus;
}) {
    const success = status === 'Success';

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold ${
                success
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-700'
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    success
                        ? 'bg-emerald-500'
                        : 'bg-rose-500'
                }`}
            />

            {status}
        </span>
    );
}

// ============================================================
// API CREDENTIALS CARD
//
// SECURITY NOTE (see conversation): the Client Secret is a
// production credential used to sign real API calls. It must
// never be retrievable in full from the frontend after issuance.
// This card intentionally has NO "reveal" affordance for an
// already-issued secret — the only ways to see a full secret
// value are:
//   1. Immediately after Regenerate (shown once, in-memory only)
//   2. Never again after that — only Regenerate works from here
// The backend should mirror this: store the secret encrypted
// (key held in Vault/Secret Manager) or hashed, never return the
// full value on a plain "GET credentials" call, and require
// re-authentication + audit logging on the regenerate endpoint.
// ============================================================

function generateMockSecret() {
    const chars =
        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let out = '';

    for (let i = 0; i < 32; i += 1) {
        out += chars[Math.floor(Math.random() * chars.length)];
    }

    return `mxp_live_sk_${out}`;
}

function ApiCredentialsCard({
    clientId,
    revealedSecret,
    onRegenerateSecret,
    onDismissRevealedSecret,
}: {
    clientId: string;
    revealedSecret: string | null;
    onRegenerateSecret: () => void;
    onDismissRevealedSecret: () => void;
}) {
    return (
        <Card
            className="overflow-hidden"
            padded={false}
        >
            <div className="border-b border-slate-100 px-5 py-4">
                <h3 className="text-sm font-bold text-slate-950">
                    API Credentials
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Credentials issued after Production approval.
                </p>
            </div>

            <div className="space-y-4 p-5">
                <Field label="Client ID">
                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <code className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700">
                            {clientId}
                        </code>

                        <CopyButton text={clientId} />
                    </div>
                </Field>

                <Field label="Client Secret">
                    {revealedSecret ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50/60 px-3 py-2.5">
                                <code className="min-w-0 flex-1 truncate font-mono text-xs text-slate-800">
                                    {revealedSecret}
                                </code>

                                <CopyButton
                                    text={revealedSecret}
                                />
                            </div>

                            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                                <p className="text-[11px] font-semibold leading-5 text-amber-900">
                                    บันทึกค่านี้ไว้ตอนนี้ — จะไม่แสดงค่าเต็มให้เห็นอีก
                                </p>

                                <p className="mt-1 text-[10px] leading-5 text-amber-700">
                                    ระบบจะเก็บ Secret นี้แบบเข้ารหัส/hash
                                    เท่านั้น หากทำหายให้กด Regenerate
                                    เพื่อสร้างค่าใหม่ (ค่าเดิมจะใช้งานไม่ได้ทันที)
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    onDismissRevealedSecret
                                }
                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 transition hover:bg-slate-50"
                            >
                                บันทึกแล้ว ซ่อนค่านี้
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                                <code className="min-w-0 flex-1 truncate font-mono text-xs text-slate-400">
                                    ••••••••••••••••••••
                                </code>

                                <span className="text-[10px] font-semibold text-slate-400">
                                    Not retrievable
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={
                                    onRegenerateSecret
                                }
                                className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50"
                            >
                                Regenerate Client Secret
                            </button>
                        </div>
                    )}
                </Field>

                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
                    <p className="text-[11px] leading-5 text-amber-800">
                        Client Secret ใช้สำหรับยิง Production API จริง
                        ห้ามฝัง Secret นี้ไว้ใน Frontend/โค้ดฝั่งไคลเอนต์
                        ควรเก็บไว้ในฝั่งเซิร์ฟเวอร์เท่านั้น (env ที่เข้ารหัส
                        หรือ Vault/Secret Manager)
                    </p>
                </div>
            </div>
        </Card>
    );
}

// ============================================================
// ACCESS GATE
// ============================================================

function AccessGate({
    status,
    onApply,
    onApprove,
}: {
    status: Exclude<AccessStatus, 'login' | 'approved'>;
    onApply: () => void;
    onApprove?: () => void;
}) {
    const stepConfig = [
        { label: 'Required', description: 'KYC Verification' },
        { label: 'Pending', description: 'Admin Review' },
        { label: 'Completed', description: 'Production Access' },
    ];

    const activeIndex = status === 'not_applied' ? 0 : status === 'pending' ? 1 : 2;

    const title =
        status === 'not_applied'
            ? 'Production Access Required'
            : 'Application Under Review';

    const bodyText =
        status === 'not_applied'
            ? 'Production API ใช้สำหรับการสร้าง Shipment จริง และมีค่าใช้จ่ายเกิดขึ้นจากการใช้งาน ก่อนเริ่มใช้งานต้องผ่านการตรวจสอบ KYC และได้รับอนุมัติจาก Admin ก่อน.'
            : 'เราได้รับข้อมูลและเอกสารของคุณแล้ว Admin กำลังตรวจสอบข้อมูล KYC เมื่อได้รับอนุมัติ ระบบจะเปิด Production และส่ง Credential ไปยัง Email ที่ลงทะเบียนไว้.';

    return (
        <div className="mx-auto max-w-4xl">
            <Card className="overflow-hidden border-slate-200">
                <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                Production Access
                            </div>

                            <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                                {title}
                            </h2>
                        </div>

                        <Badge
                            tone={status === 'not_applied' ? 'rose' : 'amber'}
                            className="inline-flex items-center gap-1.5"
                        >
                            {status === 'not_applied' ? (
                                <>
                                    <StatusDot />
                                    Required
                                </>
                            ) : (
                                <>
                                    <span>⏳</span>
                                    Pending
                                </>
                            )}
                        </Badge>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        {stepConfig.map((step, index) => {
                            const isDone = index < activeIndex;
                            const isCurrent = index === activeIndex;

                            return (
                                <div
                                    key={step.label}
                                    className={`rounded-xl border p-3 transition ${
                                        isDone
                                            ? 'border-emerald-200 bg-emerald-50/70'
                                            : isCurrent
                                              ? 'border-indigo-200 bg-indigo-50/70'
                                              : 'border-slate-200 bg-slate-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                                                isDone
                                                    ? 'bg-emerald-600 text-white'
                                                    : isCurrent
                                                      ? 'bg-indigo-600 text-white'
                                                      : 'bg-slate-200 text-slate-500'
                                            }`}
                                        >
                                            {index + 1}
                                        </div>

                                        <div className="text-[11px] font-semibold text-slate-800">
                                            {step.label}
                                        </div>
                                    </div>

                                    <div className="mt-2 text-[10px] leading-5 text-slate-500">
                                        {step.description}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-5 sm:p-6">
                    <p className="text-sm leading-7 text-slate-600">
                        {bodyText}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        {status === 'not_applied' ? (
                            <>
                                <Button type="button" onClick={onApply}>
                                    สมัคร Production Access
                                </Button>

                                <span className="text-xs text-slate-400">
                                    ต้องยืนยันตัวตนก่อนใช้งานจริง
                                </span>
                            </>
                        ) : (
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
                                    <span className="font-bold">Status:</span> PENDING REVIEW
                                </div>

                                {onApprove && (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={onApprove}
                                    >
                                        Demo: Approve
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}

// ============================================================
// OVERVIEW
// ============================================================

function Overview({
    onCreateShipment,
    onTopUp,
    onTracking,
    clientId,
    revealedSecret,
    onRegenerateSecret,
    onDismissRevealedSecret,
}: {
    onCreateShipment: () => void;
    onTopUp: () => void;
    onTracking: () => void;
    clientId: string;
    revealedSecret: string | null;
    onRegenerateSecret: () => void;
    onDismissRevealedSecret: () => void;
}) {
    return (
        <div className="space-y-7">
            <div>
                <SectionTitle
                    title="Production overview"
                    description="Monitor your live API environment, wallet balance and recent activity."
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Wallet Balance"
                        value="฿1,250.00"
                        description="Available for API usage"
                        action={
                            <button
                                type="button"
                                onClick={onTopUp}
                                className="rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[10px] font-bold text-indigo-700 transition hover:bg-indigo-100"
                            >
                                + Top Up
                            </button>
                        }
                    />

                    <StatCard
                        label="Shipments This Month"
                        value="1,245"
                        description="Total live shipments"
                    />

                    <StatCard
                        label="Spending This Month"
                        value="฿8,420"
                        description="Shipping cost"
                    />

                    <StatCard
                        label="Success Rate"
                        value="99.8%"
                        description="Last 30 days"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <section className="space-y-6 xl:col-span-8">
                    <Card
                        className="overflow-hidden"
                        padded={false}
                    >
                        <div className="border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-950">
                                        Production Environment
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500">
                                        Configuration for your live API integration.
                                    </p>
                                </div>

                                <Badge
                                    tone="emerald"
                                    className="inline-flex items-center gap-1.5"
                                >
                                    <StatusDot active />
                                    Operational
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-5 p-5">
                            <Field label="Base URL">
                                <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                                    <code className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700">
                                        {PRODUCTION_BASE_URL}
                                    </code>

                                    <CopyButton
                                        text={PRODUCTION_BASE_URL}
                                    />
                                </div>
                            </Field>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Environment
                                    </div>

                                    <div className="mt-2 text-sm font-bold text-slate-900">
                                        Production
                                    </div>
                                </div>

                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Billing
                                    </div>

                                    <div className="mt-2 text-sm font-bold text-slate-900">
                                        Real Charges
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card
                        className="overflow-hidden"
                        padded={false}
                    >
                        <div className="border-b border-slate-100 px-5 py-4">
                            <h3 className="text-sm font-bold text-slate-950">
                                Quick Actions
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Common actions for your production account.
                            </p>
                        </div>

                        <div className="grid gap-3 p-5 sm:grid-cols-3">
                            <button
                                type="button"
                                onClick={onCreateShipment}
                                className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                            >
                                <div className="text-sm font-bold text-slate-900">
                                    Create Shipment
                                </div>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Create a live shipment
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={onTracking}
                                className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                            >
                                <div className="text-sm font-bold text-slate-900">
                                    Tracking
                                </div>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Check shipment status
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={onTopUp}
                                className="rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                            >
                                <div className="text-sm font-bold text-slate-900">
                                    Top Up Wallet
                                </div>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Add balance via QR Code
                                </p>
                            </button>
                        </div>
                    </Card>
                </section>

                <aside className="space-y-6 xl:col-span-4">
                    <ApiCredentialsCard
                        clientId={clientId}
                        revealedSecret={revealedSecret}
                        onRegenerateSecret={
                            onRegenerateSecret
                        }
                        onDismissRevealedSecret={
                            onDismissRevealedSecret
                        }
                    />

                    <Card
                        className="overflow-hidden"
                        padded={false}
                    >
                        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                            <h3 className="text-sm font-bold text-slate-950">
                                Shipment Summary
                            </h3>

                            <span className="text-[10px] font-semibold text-slate-400">
                                This month
                            </span>
                        </div>

                        <div className="grid grid-cols-3 divide-x divide-slate-100">
                            <div className="p-4 text-center">
                                <div className="text-lg font-bold text-slate-900">
                                    1,245
                                </div>

                                <div className="mt-1 text-[10px] text-slate-400">
                                    Total
                                </div>
                            </div>

                            <div className="p-4 text-center">
                                <div className="text-lg font-bold text-emerald-600">
                                    1,210
                                </div>

                                <div className="mt-1 text-[10px] text-slate-400">
                                    Success
                                </div>
                            </div>

                            <div className="p-4 text-center">
                                <div className="text-lg font-bold text-rose-600">
                                    35
                                </div>

                                <div className="mt-1 text-[10px] text-slate-400">
                                    Failed
                                </div>
                            </div>
                        </div>
                    </Card>
                </aside>
            </div>

            <Card
                className="overflow-hidden"
                padded={false}
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-950">
                            Recent API Activity
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Latest requests made from your production account.
                        </p>
                    </div>
                </div>

                <ActivityTable compact />
            </Card>
        </div>
    );
}

// ============================================================
// ACTIVITY TABLE
// ============================================================

function ActivityTable({
    compact = false,
}: {
    compact?: boolean;
}) {
    const activities = compact
        ? RECENT_ACTIVITY.slice(0, 3)
        : RECENT_ACTIVITY;

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
                <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-left">
                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Endpoint
                        </th>

                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Status
                        </th>

                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Charge
                        </th>

                        <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Time
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {activities.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b border-slate-100 last:border-0"
                        >
                            <td className="px-5 py-3.5">
                                <div className="flex items-center gap-2.5">
                                    <MethodChip
                                        method={item.method}
                                    />

                                    <code className="font-mono text-[11px] text-slate-700">
                                        {item.endpoint}
                                    </code>
                                </div>
                            </td>

                            <td className="px-5 py-3.5">
                                <StatusBadge
                                    status={item.status}
                                />
                            </td>

                            <td className="px-5 py-3.5 text-xs font-semibold text-slate-700">
                                {item.amount}
                            </td>

                            <td className="px-5 py-3.5 text-xs text-slate-400">
                                {item.time}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ============================================================
// CREATE SHIPMENT
// ============================================================

function CreateShipment({
    form,
    setForm,
    onCreate,
}: {
    form: ShipmentForm;
    setForm: React.Dispatch<
        React.SetStateAction<ShipmentForm>
    >;
    onCreate: () => void;
}) {
    const update = <K extends keyof ShipmentForm>(
        key: K,
        value: ShipmentForm[K],
    ) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    const estimatedFee = useMemo(() => {
        const weight = Number(form.weightGram || 0);

        if (weight <= 0) return 0;
        if (weight <= 1000) return 32;
        if (weight <= 2000) return 40;

        return 55;
    }, [form.weightGram]);

    return (
        <div className="space-y-6">
            <div>
                <SectionTitle
                    title="Create Shipment"
                    description="Create a real shipment using your Production environment."
                />

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <div className="flex items-start gap-2">
                        <span>⚠️</span>

                        <div>
                            <p className="text-xs font-semibold text-amber-900">
                                Production request
                            </p>

                            <p className="mt-1 text-[11px] leading-5 text-amber-700">
                                This action creates a real shipment and
                                deducts the shipping fee from your wallet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <section className="space-y-6 xl:col-span-8">
                    <Card>
                        <SectionTitle
                            title="Shipment Type"
                            description="Choose the type of shipment you want to create."
                        />

                        <div className="grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() =>
                                    update(
                                        'shipmentType',
                                        'non-insured',
                                    )
                                }
                                className={`rounded-xl border p-4 text-left transition ${
                                    form.shipmentType ===
                                    'non-insured'
                                        ? 'border-indigo-300 bg-indigo-50/60 ring-2 ring-indigo-100'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="text-sm font-bold text-slate-900">
                                    Non-Insured
                                </div>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Standard shipment without insurance.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    update(
                                        'shipmentType',
                                        'insured',
                                    )
                                }
                                className={`rounded-xl border p-4 text-left transition ${
                                    form.shipmentType ===
                                    'insured'
                                        ? 'border-indigo-300 bg-indigo-50/60 ring-2 ring-indigo-100'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="text-sm font-bold text-slate-900">
                                    Insured
                                </div>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Shipment with declared value coverage.
                                </p>
                            </button>
                        </div>
                    </Card>

                    <Card>
                        <SectionTitle title="Sender Information" />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Name"
                                required
                            >
                                <Input
                                    value={form.senderName}
                                    onChange={(value) =>
                                        update(
                                            'senderName',
                                            value,
                                        )
                                    }
                                    placeholder="Sender name"
                                />
                            </Field>

                            <Field
                                label="Phone Number"
                                required
                            >
                                <Input
                                    value={form.senderPhone}
                                    onChange={(value) =>
                                        update(
                                            'senderPhone',
                                            value,
                                        )
                                    }
                                    placeholder="08xxxxxxxx"
                                />
                            </Field>

                            <div className="sm:col-span-2">
                                <Field
                                    label="Address"
                                    required
                                >
                                    <TextArea
                                        value={
                                            form.senderAddress
                                        }
                                        onChange={(value) =>
                                            update(
                                                'senderAddress',
                                                value,
                                            )
                                        }
                                        placeholder="Sender address"
                                    />
                                </Field>
                            </div>

                            <Field
                                label="Province"
                                required
                            >
                                <Input
                                    value={
                                        form.senderProvince
                                    }
                                    onChange={(value) =>
                                        update(
                                            'senderProvince',
                                            value,
                                        )
                                    }
                                    placeholder="Province"
                                />
                            </Field>

                            <Field
                                label="District"
                                required
                            >
                                <Input
                                    value={
                                        form.senderDistrict
                                    }
                                    onChange={(value) =>
                                        update(
                                            'senderDistrict',
                                            value,
                                        )
                                    }
                                    placeholder="District"
                                />
                            </Field>

                            <Field
                                label="Sub District"
                                required
                            >
                                <Input
                                    value={
                                        form.senderSubDistrict
                                    }
                                    onChange={(value) =>
                                        update(
                                            'senderSubDistrict',
                                            value,
                                        )
                                    }
                                    placeholder="Sub district"
                                />
                            </Field>

                            <Field
                                label="Zip Code"
                                required
                            >
                                <Input
                                    value={
                                        form.senderZipCode
                                    }
                                    onChange={(value) =>
                                        update(
                                            'senderZipCode',
                                            value,
                                        )
                                    }
                                    placeholder="Zip code"
                                />
                            </Field>
                        </div>
                    </Card>

                    <Card>
                        <SectionTitle title="Receiver Information" />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Name"
                                required
                            >
                                <Input
                                    value={
                                        form.receiverName
                                    }
                                    onChange={(value) =>
                                        update(
                                            'receiverName',
                                            value,
                                        )
                                    }
                                    placeholder="Receiver name"
                                />
                            </Field>

                            <Field
                                label="Phone Number"
                                required
                            >
                                <Input
                                    value={
                                        form.receiverPhone
                                    }
                                    onChange={(value) =>
                                        update(
                                            'receiverPhone',
                                            value,
                                        )
                                    }
                                    placeholder="08xxxxxxxx"
                                />
                            </Field>

                            <div className="sm:col-span-2">
                                <Field
                                    label="Address"
                                    required
                                >
                                    <TextArea
                                        value={
                                            form.receiverAddress
                                        }
                                        onChange={(value) =>
                                            update(
                                                'receiverAddress',
                                                value,
                                            )
                                        }
                                        placeholder="Receiver address"
                                    />
                                </Field>
                            </div>

                            <Field
                                label="Province"
                                required
                            >
                                <Input
                                    value={
                                        form.receiverProvince
                                    }
                                    onChange={(value) =>
                                        update(
                                            'receiverProvince',
                                            value,
                                        )
                                    }
                                    placeholder="Province"
                                />
                            </Field>

                            <Field
                                label="District"
                                required
                            >
                                <Input
                                    value={
                                        form.receiverDistrict
                                    }
                                    onChange={(value) =>
                                        update(
                                            'receiverDistrict',
                                            value,
                                        )
                                    }
                                    placeholder="District"
                                />
                            </Field>

                            <Field
                                label="Sub District"
                                required
                            >
                                <Input
                                    value={
                                        form.receiverSubDistrict
                                    }
                                    onChange={(value) =>
                                        update(
                                            'receiverSubDistrict',
                                            value,
                                        )
                                    }
                                    placeholder="Sub district"
                                />
                            </Field>

                            <Field
                                label="Zip Code"
                                required
                            >
                                <Input
                                    value={
                                        form.receiverZipCode
                                    }
                                    onChange={(value) =>
                                        update(
                                            'receiverZipCode',
                                            value,
                                        )
                                    }
                                    placeholder="Zip code"
                                />
                            </Field>
                        </div>
                    </Card>

                    <Card>
                        <SectionTitle title="Parcel Information" />

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                label="Weight (gram)"
                                required
                            >
                                <Input
                                    value={form.weightGram}
                                    onChange={(value) =>
                                        update(
                                            'weightGram',
                                            value,
                                        )
                                    }
                                    type="number"
                                    placeholder="1000"
                                />
                            </Field>

                            {form.shipmentType ===
                                'insured' && (
                                <Field
                                    label="Declared Value (THB)"
                                    required
                                >
                                    <Input
                                        value={
                                            form.declaredValue
                                        }
                                        onChange={(value) =>
                                            update(
                                                'declaredValue',
                                                value,
                                            )
                                        }
                                        type="number"
                                        placeholder="3000"
                                    />
                                </Field>
                            )}

                            <div className="sm:col-span-2">
                                <Field label="Note">
                                    <TextArea
                                        value={form.note}
                                        onChange={(value) =>
                                            update(
                                                'note',
                                                value,
                                            )
                                        }
                                        placeholder="Optional note"
                                    />
                                </Field>
                            </div>
                        </div>
                    </Card>
                </section>

                <aside className="xl:col-span-4">
                    <div className="xl:sticky xl:top-6">
                        <Card
                            className="overflow-hidden"
                            padded={false}
                        >
                            <div className="border-b border-slate-100 px-5 py-4">
                                <h3 className="text-sm font-bold text-slate-950">
                                    Shipment Summary
                                </h3>

                                <p className="mt-1 text-xs text-slate-500">
                                    Review before creating a live shipment.
                                </p>
                            </div>

                            <div className="space-y-5 p-5">
                                <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Carrier
                                    </div>

                                    <div className="mt-2 text-sm font-bold text-slate-900">
                                        THAI_POST
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                        Shipment Type
                                    </div>

                                    <div className="mt-2 text-sm font-bold text-slate-900">
                                        {form.shipmentType ===
                                        'insured'
                                            ? 'Insured'
                                            : 'Non-Insured'}
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            Estimated shipping fee
                                        </span>

                                        <span className="text-lg font-bold text-slate-950">
                                            ฿
                                            {estimatedFee.toFixed(
                                                2,
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            Wallet balance
                                        </span>

                                        <span className="text-xs font-bold text-emerald-600">
                                            ฿1,250.00
                                        </span>
                                    </div>

                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">
                                            Balance after request
                                        </span>

                                        <span className="text-xs font-bold text-slate-800">
                                            ฿
                                            {(
                                                1250 -
                                                estimatedFee
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={onCreate}
                                >
                                    Create Live Shipment
                                </Button>

                                <p className="text-center text-[10px] leading-5 text-slate-400">
                                    By continuing, you confirm that this
                                    request may create a real shipment and
                                    deduct funds from your wallet.
                                </p>
                            </div>
                        </Card>
                    </div>
                </aside>
            </div>
        </div>
    );
}

// ============================================================
// TRACKING
// ============================================================

function Tracking() {
    const [trackingNumber, setTrackingNumber] =
        useState('TH048855193');

    const [searched, setSearched] =
        useState(false);

    return (
        <div className="space-y-6">
            <SectionTitle
                title="Tracking"
                description="Check the latest status of a production shipment."
            />

            <Card>
                <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                    <Field label="Tracking Number">
                        <Input
                            value={trackingNumber}
                            onChange={setTrackingNumber}
                            placeholder="Enter tracking number"
                        />
                    </Field>

                    <div className="flex items-end">
                        <Button
                            type="button"
                            onClick={() =>
                                setSearched(true)
                            }
                        >
                            Track Shipment
                        </Button>
                    </div>
                </div>
            </Card>

            {!searched ? (
                <Card>
                    <EmptyState
                        title="Enter a tracking number"
                        icon={
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0v3.75m-18-3.75v3.75"
                                />
                            </svg>
                        }
                    />
                </Card>
            ) : (
                <Card
                    className="overflow-hidden"
                    padded={false}
                >
                    <div className="border-b border-slate-100 px-5 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Tracking Number
                                </div>

                                <code className="mt-1 block font-mono text-sm font-bold text-slate-900">
                                    {trackingNumber}
                                </code>
                            </div>

                            <Badge
                                tone="emerald"
                                className="inline-flex items-center gap-1.5"
                            >
                                <StatusDot active />
                                In Transit
                            </Badge>
                        </div>
                    </div>

                    <div className="p-5">
                        <div className="space-y-0">
                            {[
                                {
                                    title: 'Shipment Created',
                                    time: '01 Sep 2026, 09:12',
                                    active: true,
                                },
                                {
                                    title: 'Picked Up',
                                    time: '01 Sep 2026, 11:30',
                                    active: true,
                                },
                                {
                                    title: 'In Transit',
                                    time: '01 Sep 2026, 14:05',
                                    active: true,
                                },
                                {
                                    title: 'Delivered',
                                    time: 'Waiting for delivery',
                                    active: false,
                                },
                            ].map((item, index) => (
                                <div
                                    key={item.title}
                                    className="flex gap-4"
                                >
                                    <div className="flex flex-col items-center">
                                        <span
                                            className={`mt-1 h-3 w-3 rounded-full border-2 ${
                                                item.active
                                                    ? 'border-indigo-500 bg-indigo-500'
                                                    : 'border-slate-300 bg-white'
                                            }`}
                                        />

                                        {index < 3 && (
                                            <span
                                                className={`h-12 w-px ${
                                                    item.active
                                                        ? 'bg-indigo-200'
                                                        : 'bg-slate-200'
                                                }`}
                                            />
                                        )}
                                    </div>

                                    <div className="pb-6">
                                        <div
                                            className={`text-sm font-semibold ${
                                                item.active
                                                    ? 'text-slate-900'
                                                    : 'text-slate-400'
                                            }`}
                                        >
                                            {item.title}
                                        </div>

                                        <div className="mt-1 text-xs text-slate-400">
                                            {item.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
}

// ============================================================
// WEBHOOK
// ============================================================

function Webhook() {
    const [enabled, setEnabled] =
        useState(true);

    return (
        <div className="space-y-6">
            <SectionTitle
                title="Webhook"
                description="Configure how MyAPI sends production events to your system."
            />

            <Card
                className="overflow-hidden"
                padded={false}
            >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-950">
                            Webhook Configuration
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                            Production webhook endpoint
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setEnabled((value) => !value)
                        }
                        className={`relative h-6 w-11 rounded-full transition ${
                            enabled
                                ? 'bg-emerald-500'
                                : 'bg-slate-300'
                        }`}
                    >
                        <span
                            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                enabled
                                    ? 'left-6'
                                    : 'left-1'
                            }`}
                        />
                    </button>
                </div>

                <div className="space-y-6 p-5">
                    <Field label="Endpoint URL">
                        <Input
                            value="https://api.yourcompany.com/webhooks/myapi"
                            onChange={() => undefined}
                        />
                    </Field>

                    <div>
                        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                            Events
                        </div>

                        <div className="space-y-2">
                            {[
                                'Create Shipment',
                                'Tracking Update',
                                'Webhook Event',
                                'Customer System Update',
                            ].map((event) => (
                                <label
                                    key={event}
                                    className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3"
                                >
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />

                                    <span className="text-xs font-medium text-slate-700">
                                        {event}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button type="button">
                            Save Configuration
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                        >
                            Test Webhook
                        </Button>
                    </div>
                </div>
            </Card>

            <Card>
                <SectionTitle
                    title="Webhook Events"
                    description="Latest webhook delivery status."
                />

                <div className="space-y-2">
                    {[
                        {
                            event: 'tracking.updated',
                            status: 'Delivered',
                            time: 'Today, 14:18',
                        },
                        {
                            event: 'parcel.created',
                            status: 'Delivered',
                            time: 'Today, 14:02',
                        },
                        {
                            event: 'parcel.status.updated',
                            status: 'Delivered',
                            time: 'Yesterday, 17:45',
                        },
                    ].map((item) => (
                        <div
                            key={`${item.event}-${item.time}`}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                        >
                            <div>
                                <code className="font-mono text-xs font-semibold text-slate-700">
                                    {item.event}
                                </code>

                                <div className="mt-1 text-[10px] text-slate-400">
                                    {item.time}
                                </div>
                            </div>

                            <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                                {item.status}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export function Production() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] =
        useState<Tab>('Overview');

    const [lang, setLang] =
        useState<'TH' | 'EN'>('EN');

    const [form, setForm] =
        useState<ShipmentForm>(INITIAL_FORM);

    // --------------------------------------------------------
    // DEMO ACCESS STATE
    // --------------------------------------------------------

    const isAuthenticated = true;

    const [
        productionApplicationSubmitted,
        setProductionApplicationSubmitted,
    ] = useState(false);

    const [
        isProductionApproved,
        setIsProductionApproved,
    ] = useState(false);

    const accessStatus: AccessStatus =
        !isAuthenticated
            ? 'login'
            : !productionApplicationSubmitted
              ? 'not_applied'
              : isProductionApproved
                ? 'approved'
                : 'pending';

    // --------------------------------------------------------
    // ACCESS HANDLERS
    // --------------------------------------------------------

    const handleApplyProductionAccess = () => {
        setProductionApplicationSubmitted(true);
        setIsProductionApproved(false);
    };

    const handleAdminApprovalDemo = () => {
        setIsProductionApproved(true);
    };

    // --------------------------------------------------------
    // API CREDENTIALS STATE
    //
    // clientId is fine to show in full (not a secret, like a
    // username). revealedSecret is intentionally *not* the
    // account's real secret hash — it only ever holds a value
    // right after Regenerate, and is cleared on dismiss/unmount.
    // In a real integration this would come from a one-time
    // API response, never from a "GET credentials" endpoint.
    // --------------------------------------------------------

    const [clientId] = useState(
        'mxp_live_9f3a1c7e2b8d4f60',
    );

    const [revealedSecret, setRevealedSecret] =
        useState<string | null>(null);

    const handleRegenerateSecret = () => {
        const confirmed = window.confirm(
            '⚠️ Regenerate Client Secret?\n\nค่าเดิมจะใช้งานไม่ได้ทันที ระบบที่ยิง Production อยู่ต้องอัปเดต Secret ใหม่ก่อนถึงจะเรียก API ต่อได้',
        );

        if (!confirmed) return;

        setRevealedSecret(generateMockSecret());
    };

    const handleDismissRevealedSecret = () => {
        setRevealedSecret(null);
    };

    // --------------------------------------------------------
    // TAB
    // --------------------------------------------------------

    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab);
    };

    // --------------------------------------------------------
    // ACTIONS
    // --------------------------------------------------------

    const handleTopUp = () => {
        navigate('/wallet');
    };

    const handleCreateShipment = () => {
        const confirmed = window.confirm(
            '⚠️ Create Live Shipment?\n\nThis will create a real shipment and deduct the shipping fee from your wallet.',
        );

        if (!confirmed) return;

        window.alert(
            'Production shipment request submitted.',
        );
    };

    // --------------------------------------------------------
    // RENDER
    // --------------------------------------------------------

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <AppSidebar
                items={NAV_LINKS.map((link) => ({
                    label: link.label,
                    path: link.to,
                }))}
                activePath="/production"
                footer={
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                        onClick={() =>
                            navigate('/login')
                        }
                    >
                        ออกจากระบบ
                    </Button>
                }
            />

            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
                {/* ==================================================
                    HEADER
                ================================================== */}

                <ConsoleHeader
                    title={
                        accessStatus === 'approved'
                            ? 'Production Console'
                            : 'Production'
                    }
                    subtitle="Live API environment for real shipments and real charges."
                    badge={
                        accessStatus === 'approved' ? (
                            <Badge
                                tone="emerald"
                                className="inline-flex items-center gap-1.5"
                            >
                                <StatusDot active />
                                Production Console
                            </Badge>
                        ) : null
                    }
                    actions={
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                                {(
                                    ['TH', 'EN'] as const
                                ).map((code) => (
                                    <button
                                        key={code}
                                        type="button"
                                        onClick={() =>
                                            setLang(
                                                code,
                                            )
                                        }
                                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${
                                            lang === code
                                                ? 'bg-white text-indigo-700 shadow-sm'
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>
                    }
                    userName="My Company"
                    userMeta="Production Account"
                />

                {/* ==================================================
                    ONLY SHOW IMPORTANT ACTION ALERTS
                    Approved state does NOT show a large banner.
                ================================================== */}

                {/* ==================================================
                    CONTENT
                ================================================== */}

                {accessStatus !== 'approved' ? (
                    <PageContainer className="!px-6 !py-7 lg:!px-10">
                        {accessStatus ===
                        'not_applied' ? (
                            <AccessGate
                                status="not_applied"
                                onApply={
                                    handleApplyProductionAccess
                                }
                            />
                        ) : accessStatus ===
                          'pending' ? (
                            <AccessGate
                                status="pending"
                                onApply={
                                    handleApplyProductionAccess
                                }
                                onApprove={
                                    handleAdminApprovalDemo
                                }
                            />
                        ) : (
                            <div className="mx-auto max-w-3xl">
                                <Card>
                                    <EmptyState
                                        title="Sign in required"
                                    />

                                    <div className="mt-5 flex justify-center">
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    '/login',
                                                )
                                            }
                                        >
                                            Sign in
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </PageContainer>
                ) : (
                    <>
                        {/* ==================================================
                            TAB NAVIGATION
                        ================================================== */}

                        <nav className="sticky top-0 z-10 flex gap-7 overflow-x-auto border-b border-slate-200 bg-white px-6 lg:px-10">
                            <div className="mx-auto flex w-full max-w-[1440px] gap-7">
                                {TABS.map(
                                    (tab) => {
                                        const active =
                                            activeTab ===
                                            tab.id;

                                        return (
                                            <button
                                                key={
                                                    tab.id
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleTabChange(
                                                        tab.id,
                                                    )
                                                }
                                                className={`whitespace-nowrap border-b-2 py-3 text-xs font-semibold transition-colors ${
                                                    active
                                                        ? 'border-indigo-600 text-indigo-700'
                                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                                }`}
                                            >
                                                {
                                                    tab.label
                                                }
                                            </button>
                                        );
                                    },
                                )}
                            </div>
                        </nav>

                        {/* ==================================================
                            PAGE CONTENT
                        ================================================== */}

                        <PageContainer className="!px-6 !py-7 lg:!px-10">
                            {activeTab ===
                                'Overview' && (
                                <Overview
                                    onCreateShipment={() =>
                                        setActiveTab(
                                            'Create Shipment',
                                        )
                                    }
                                    onTopUp={
                                        handleTopUp
                                    }
                                    onTracking={() =>
                                        setActiveTab(
                                            'Tracking',
                                        )
                                    }
                                    clientId={clientId}
                                    revealedSecret={
                                        revealedSecret
                                    }
                                    onRegenerateSecret={
                                        handleRegenerateSecret
                                    }
                                    onDismissRevealedSecret={
                                        handleDismissRevealedSecret
                                    }
                                />
                            )}

                            {activeTab ===
                                'Create Shipment' && (
                                <CreateShipment
                                    form={form}
                                    setForm={setForm}
                                    onCreate={
                                        handleCreateShipment
                                    }
                                />
                            )}

                            {activeTab ===
                                'Tracking' && (
                                <Tracking />
                            )}

                            {activeTab ===
                                'Webhook' && (
                                <Webhook />
                            )}

                            {activeTab ===
                                'API Activity' && (
                                <div className="space-y-6">
                                    <SectionTitle
                                        title="API Activity"
                                        description="Review requests and charges from your Production environment."
                                    />

                                    <Card
                                        className="overflow-hidden"
                                        padded={false}
                                    >
                                        <ActivityTable />
                                    </Card>
                                </div>
                            )}
                        </PageContainer>
                    </>
                )}
            </main>
        </div>
    );
}

export default Production;