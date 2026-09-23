import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Header as ConsoleHeader } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Sidebar as AppSidebar } from '../components/layout/Sidebar';

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

const RECENT_ACTIVITY = [
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

// ============================================================
// TYPES
// ============================================================

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ProductionStatus =
    | 'not_applied'
    | 'pending'
    | 'approved';

// ============================================================
// SMALL COMPONENTS
// ============================================================

function StatusDot({
    active = false,
}: {
    active?: boolean;
}) {
    return (
        <span className="relative flex h-2.5 w-2.5">
            {active && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            )}

            <span
                className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    active
                        ? 'bg-emerald-500'
                        : 'bg-slate-300'
                }`}
            />
        </span>
    );
}

function CopyButton({
    value,
}: {
    value: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        >
            {copied ? (
                <>
                    <span>✓</span>
                    Copied
                </>
            ) : (
                <>
                    <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.8}
                    >
                        <rect
                            x="9"
                            y="9"
                            width="11"
                            height="11"
                            rx="2"
                        />
                        <path
                            d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                        />
                    </svg>
                    Copy
                </>
            )}
        </button>
    );
}

function SectionHeader({
    title,
    description,
}: {
    title: string;
    description?: string;
}) {
    return (
        <div>
            <h2 className="text-sm font-bold text-slate-950">
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

function MethodBadge({
    method,
}: {
    method: Method;
}) {
    const styles: Record<Method, string> = {
        GET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        POST: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        PUT: 'bg-amber-50 text-amber-700 border-amber-200',
        DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    return (
        <span
            className={`inline-flex rounded-md border px-2 py-1 font-mono text-[10px] font-bold ${styles[method]}`}
        >
            {method}
        </span>
    );
}

function ActivityStatus({
    status,
}: {
    status: 'Success' | 'Failed';
}) {
    const success = status === 'Success';

    return (
        <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                success
                    ? 'text-emerald-600'
                    : 'text-rose-600'
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
// ACCESS REQUIRED
// ============================================================

function ProductionAccessRequired({
    onApply,
}: {
    onApply: () => void;
}) {
    return (
        <div className="mx-auto max-w-3xl">
            <Card className="overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-6">
                    <div className="flex items-start justify-between gap-5">
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                Production Access
                            </div>

                            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                                Production API ยังไม่เปิดใช้งาน
                            </h2>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                ขอเปิดใช้งาน Production API
                                เพื่อเชื่อมต่อระบบจริงและสร้าง
                                Shipment ที่มีค่าใช้บริการจริง
                            </p>
                        </div>

                        <Badge
                            tone="rose"
                            className="shrink-0"
                        >
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-rose-500" />
                            Required
                        </Badge>
                    </div>
                </div>

                <div className="space-y-6 p-6">
                    {/* Requirements */}
                    <div className="grid gap-3 md:grid-cols-3">
                        {[
                            {
                                number: '1',
                                title: 'Contract',
                                text: 'ทำสัญญากับ MyAPI',
                                done: true,
                            },
                            {
                                number: '2',
                                title: 'KYC',
                                text: 'ตรวจสอบข้อมูลบริษัท',
                                done: true,
                            },
                            {
                                number: '3',
                                title: 'Production',
                                text: 'เปิดใช้งาน API จริง',
                                done: false,
                            },
                        ].map((item) => (
                            <div
                                key={item.number}
                                className={`rounded-xl border p-4 ${
                                    item.done
                                        ? 'border-emerald-200 bg-emerald-50/50'
                                        : 'border-indigo-200 bg-indigo-50/50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                                            item.done
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-indigo-600 text-white'
                                        }`}
                                    >
                                        {item.done
                                            ? '✓'
                                            : item.number}
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-slate-900">
                                            {item.title}
                                        </div>

                                        <div className="mt-0.5 text-[10px] text-slate-500">
                                            {item.text}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Info */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <svg
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.7}
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />
                                    <path d="M12 11v5" />
                                    <path d="M12 8h.01" />
                                </svg>
                            </div>

                            <div>
                                <div className="text-xs font-bold text-slate-900">
                                    พร้อมเริ่มใช้งาน Production แล้ว?
                                </div>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    ระบบจะส่งคำขอให้ทีมงานตรวจสอบ
                                    และเปิดสิทธิ์ Production API
                                    ให้กับบัญชีของคุณ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="button"
                            onClick={onApply}
                        >
                            ขอเปิดใช้งาน Production API
                        </Button>

                        <button
                            type="button"
                            className="text-xs font-semibold text-slate-500 transition hover:text-indigo-600"
                        >
                            ดูรายละเอียดการเปิดใช้งาน
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}

// ============================================================
// ACCESS PENDING
// ============================================================

function ProductionAccessPending({
    onDemoApprove,
}: {
    onDemoApprove: () => void;
}) {
    return (
        <div className="mx-auto max-w-3xl">
            <Card className="overflow-hidden">
                <div className="p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                        <svg
                            className="h-7 w-7 text-amber-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.7}
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />
                            <path d="M12 7v5l3 2" />
                        </svg>
                    </div>

                    <div className="mt-5">
                        <Badge tone="amber">
                            <span className="mr-1.5">●</span>
                            Pending Review
                        </Badge>

                        <h2 className="mt-3 text-2xl font-bold text-slate-950">
                            กำลังตรวจสอบ Production Access
                        </h2>

                        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                            เราได้รับคำขอของคุณแล้ว
                            ทีมงานกำลังตรวจสอบข้อมูล
                            เมื่ออนุมัติแล้ว Production API
                            จะพร้อมใช้งานทันที
                        </p>
                    </div>

                    <div className="mx-auto mt-7 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
                        <div className="flex justify-between">
                            <span className="text-xs text-slate-500">
                                สถานะ
                            </span>

                            <span className="text-xs font-bold text-amber-600">
                                Pending Review
                            </span>
                        </div>

                        <div className="mt-3 flex justify-between">
                            <span className="text-xs text-slate-500">
                                ขั้นตอนถัดไป
                            </span>

                            <span className="text-xs font-semibold text-slate-700">
                                Admin Approval
                            </span>
                        </div>
                    </div>

                    {/* Demo only */}
                    <button
                        type="button"
                        onClick={onDemoApprove}
                        className="mt-6 text-[10px] text-slate-300 hover:text-slate-500"
                    >
                        Demo: Approve Production
                    </button>
                </div>
            </Card>
        </div>
    );
}

// ============================================================
// CREDENTIAL ROW
// ============================================================

function CredentialRow({
    icon,
    label,
    description,
    value,
    secret = false,
}: {
    icon: React.ReactNode;
    label: string;
    description: string;
    value: string;
    secret?: boolean;
}) {
    const [show, setShow] = useState(false);

    const displayValue = secret && !show
        ? '••••••••••••••••••••'
        : value;

    return (
        <div className="flex flex-col gap-3 border-b border-slate-100 py-4 last:border-b-0 lg:flex-row lg:items-center">
            <div className="flex min-w-[230px] items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                    {icon}
                </div>

                <div>
                    <div className="text-xs font-bold text-slate-900">
                        {label}
                    </div>

                    <div className="mt-0.5 text-[10px] text-slate-400">
                        {description}
                    </div>
                </div>
            </div>

            <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="min-w-0 flex-1 rounded-lg bg-slate-50 px-3 py-2.5">
                    <code className="block truncate font-mono text-xs text-slate-700">
                        {displayValue}
                    </code>
                </div>

                {secret && (
                    <button
                        type="button"
                        onClick={() => setShow((value) => !value)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:border-indigo-200 hover:text-indigo-700"
                    >
                        {show ? 'Hide' : 'Show'}
                    </button>
                )}

                <CopyButton value={value} />
            </div>
        </div>
    );
}

// ============================================================
// CREDENTIALS
// ============================================================

function ApiCredentials({
    onDocs,
}: {
    onDocs: () => void;
}) {
    return (
        <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.7}
                        >
                            <path d="M8 15l-3 3 3 3" />
                            <path d="M16 9l3-3-3-3" />
                            <path d="M14 4l-4 16" />
                        </svg>
                    </div>

                    <div>
                        <h2 className="text-sm font-bold text-slate-950">
                            API Credentials
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            ข้อมูลสำหรับเชื่อมต่อระบบของคุณกับ MyAPI
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onDocs}
                    className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
                >
                    วิธีการเชื่อมต่อ API ↗
                </button>
            </div>

            <div className="px-5">
                <CredentialRow
                    label="Base URL"
                    description="URL สำหรับเรียกใช้งาน API จริง"
                    value={PRODUCTION_BASE_URL}
                    icon={
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="9"
                            />
                            <path d="M3 12h18" />
                            <path d="M12 3c3 3 3 15 0 18" />
                        </svg>
                    }
                />

                <CredentialRow
                    label="Client ID"
                    description="รหัสสำหรับยืนยันตัวตนของคุณ"
                    value="mxp_live_7f3a9c2e4b6d8e1f"
                    icon={
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <circle
                                cx="9"
                                cy="7"
                                r="3"
                            />
                            <path d="M3 21v-2a6 6 0 0112 0v2" />
                            <path d="M16 11h5" />
                            <path d="M18.5 8.5v5" />
                        </svg>
                    }
                />

                <CredentialRow
                    label="Client Secret"
                    description="รหัสลับสำหรับยืนยันตัวตน"
                    value="sk_live_8e4a91c2f7b6d5a3"
                    secret
                    icon={
                        <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                        >
                            <rect
                                x="5"
                                y="10"
                                width="14"
                                height="10"
                                rx="2"
                            />
                            <path d="M8 10V7a4 4 0 018 0v3" />
                        </svg>
                    }
                />
            </div>

            <div className="mx-5 mb-5 mt-3 flex flex-col gap-3 rounded-xl bg-indigo-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600">
                        <span className="font-mono text-sm font-bold">
                            {'</>'}
                        </span>
                    </div>

                    <div>
                        <div className="text-xs font-bold text-indigo-900">
                            ตัวอย่างการเรียกใช้ API
                        </div>

                        <p className="mt-0.5 text-[10px] text-indigo-700/70">
                            ดูตัวอย่างคำสั่งและ Response
                            ได้จาก API Docs
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onDocs}
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                >
                    Open API Docs ↗
                </button>
            </div>
        </Card>
    );
}

// ============================================================
// QUICK ACTIONS
// ============================================================

function QuickActions({
    onDocs,
    onGuide,
}: {
    onDocs: () => void;
    onGuide: () => void;
}) {
    const items = [
        {
            title: 'API Docs',
            description: 'ดูเอกสารการใช้งาน API ทั้งหมด',
            icon: '▣',
            action: onDocs,
            tone: 'bg-indigo-50 text-indigo-600',
        },
        {
            title: 'Integration Guide',
            description: 'คู่มือการเชื่อมต่อแบบ Step by Step',
            icon: '↗',
            action: onGuide,
            tone: 'bg-violet-50 text-violet-600',
        },
        {
            title: 'View Example Request',
            description: 'ดูตัวอย่างคำสั่งและ Response',
            icon: '{}',
            action: onDocs,
            tone: 'bg-emerald-50 text-emerald-600',
        },
    ];

    return (
        <Card>
            <SectionHeader
                title="Quick Actions"
                description="เครื่องมือสำหรับเริ่มต้นใช้งาน"
            />

            <div className="mt-4 space-y-2">
                {items.map((item) => (
                    <button
                        key={item.title}
                        type="button"
                        onClick={item.action}
                        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-200 hover:bg-slate-50"
                    >
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${item.tone}`}
                        >
                            {item.icon}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-slate-800">
                                {item.title}
                            </div>

                            <div className="mt-0.5 truncate text-[10px] text-slate-400">
                                {item.description}
                            </div>
                        </div>

                        <span className="text-slate-300">
                            →
                        </span>
                    </button>
                ))}
            </div>
        </Card>
    );
}

// ============================================================
// WEBHOOK CARD
// ============================================================

function WebhookCard({
    onManage,
}: {
    onManage: () => void;
}) {
    const [enabled, setEnabled] = useState(true);

    return (
        <Card>
            <SectionHeader
                title="Webhook"
                description="รับแจ้งเตือนเหตุการณ์จากระบบ"
            />

            <div className="mt-4 rounded-xl border border-slate-200 p-3">
                <div className="flex items-center gap-3">
                    <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                            enabled
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-slate-100 text-slate-400'
                        }`}
                    >
                        {enabled ? '✓' : '−'}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div
                            className={`text-xs font-bold ${
                                enabled
                                    ? 'text-emerald-600'
                                    : 'text-slate-500'
                            }`}
                        >
                            {enabled
                                ? 'Webhook เปิดใช้งานแล้ว'
                                : 'Webhook ปิดใช้งาน'}
                        </div>

                        <div className="mt-0.5 truncate text-[10px] text-slate-400">
                            https://your-domain.com/webhook
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setEnabled((value) => !value)
                        }
                        className={`relative h-5 w-9 rounded-full transition ${
                            enabled
                                ? 'bg-emerald-500'
                                : 'bg-slate-300'
                        }`}
                    >
                        <span
                            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                enabled
                                    ? 'left-[18px]'
                                    : 'left-0.5'
                            }`}
                        />
                    </button>
                </div>
            </div>

            <button
                type="button"
                onClick={onManage}
                className="mt-3 w-full rounded-lg border border-indigo-200 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50"
            >
                จัดการ Webhook
            </button>
        </Card>
    );
}

// ============================================================
// USAGE SUMMARY
// ============================================================

function UsageSummary() {
    return (
        <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionHeader
                    title="Usage Summary"
                    description="สถิติการใช้งาน API ของคุณ"
                />

                <select
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 outline-none focus:border-indigo-300"
                    defaultValue="current"
                >
                    <option value="current">
                        เดือนนี้
                    </option>
                    <option value="previous">
                        เดือนก่อน
                    </option>
                </select>
            </div>

            <div className="mt-5 grid divide-y divide-slate-100 md:grid-cols-3 md:divide-x md:divide-y-0">
                <UsageItem
                    label="Total Requests"
                    value="8,421"
                    change="+12%"
                    description="จากเดือนก่อน"
                />

                <UsageItem
                    label="Success Rate"
                    value="99.8%"
                    change="+0.2%"
                    description="จากเดือนก่อน"
                />

                <UsageItem
                    label="Total Shipment"
                    value="1,284"
                    change="+18%"
                    description="จากเดือนก่อน"
                />
            </div>
        </Card>
    );
}

function UsageItem({
    label,
    value,
    change,
    description,
}: {
    label: string;
    value: string;
    change: string;
    description: string;
}) {
    return (
        <div className="py-3 first:pt-0 last:pb-0 md:px-5 md:first:pl-0 md:last:pr-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </div>

            <div className="mt-2 flex items-end gap-2">
                <span className="text-2xl font-bold tracking-tight text-slate-950">
                    {value}
                </span>

                <span className="mb-1 text-[10px] font-bold text-emerald-500">
                    ↑ {change}
                </span>
            </div>

            <div className="mt-1 text-[10px] text-slate-400">
                {description}
            </div>
        </div>
    );
}

// ============================================================
// ACTIVITY
// ============================================================

function RecentActivity({
    onViewAll,
}: {
    onViewAll: () => void;
}) {
    return (
        <Card className="overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                    <h2 className="text-sm font-bold text-slate-950">
                        Recent API Activity
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                        รายการเรียกใช้งาน API ล่าสุด
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onViewAll}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    ดูทั้งหมด →
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/60 text-left">
                            <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Time
                            </th>

                            <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Method
                            </th>

                            <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Endpoint
                            </th>

                            <th className="px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Status
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Response
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                Charge
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {RECENT_ACTIVITY.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50"
                            >
                                <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">
                                    {item.time}
                                </td>

                                <td className="px-5 py-3">
                                    <MethodBadge
                                        method={
                                            item.method as Method
                                        }
                                    />
                                </td>

                                <td className="px-5 py-3">
                                    <code className="font-mono text-xs text-slate-700">
                                        {item.endpoint}
                                    </code>
                                </td>

                                <td className="px-5 py-3">
                                    <ActivityStatus
                                        status={item.status as
                                            | 'Success'
                                            | 'Failed'}
                                    />
                                </td>

                                <td className="px-5 py-3 text-right text-xs text-slate-500">
                                    {item.responseTime}
                                </td>

                                <td className="px-5 py-3 text-right text-xs font-semibold text-slate-700">
                                    {item.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}

// ============================================================
// MAIN PRODUCTION
// ============================================================

export function Production() {
    const navigate = useNavigate();

    /*
     * DEMO STATE
     *
     * เปลี่ยนส่วนนี้เป็นข้อมูลจาก Backend จริงภายหลัง
     */
    const [productionStatus, setProductionStatus] =
        useState<ProductionStatus>('approved');

    const [lang, setLang] =
        useState<'TH' | 'EN'>('EN');

    const handleApply = () => {
        setProductionStatus('pending');
    };

    const handleDocs = () => {
        navigate('/docs');
    };

    const handleGuide = () => {
        navigate('/docs');
    };

    const handleWebhook = () => {
        navigate('/webhook');
    };

    const handleActivity = () => {
        // หากภายหลังมีหน้า logs แยก
        // สามารถเปลี่ยนเป็น navigate('/logs')
        window.alert(
            'เปิดหน้า API Activity / Logs',
        );
    };

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
                        className="w-full"
                        onClick={() => {
                            // logout
                        }}
                    >
                        ออกจากระบบ
                    </Button>
                }
            />

            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
                <ConsoleHeader
                    title="Production API"
                    subtitle="เชื่อมต่อระบบของคุณกับ MyAPI เพื่อใช้งานจริง ทั้งการสร้างพัสดุ ติดตามสถานะ และรับ Webhook ผ่าน API"
                    badge={
                        productionStatus ===
                        'approved' ? (
                            <Badge
                                tone="emerald"
                                className="inline-flex items-center gap-1.5"
                            >
                                <StatusDot active />
                                Production Active
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
                                            setLang(code)
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
                    CONTENT
                ================================================== */}

                {productionStatus ===
                    'not_applied' && (
                    <PageContainer className="!px-6 !py-7 lg:!px-10">
                        <ProductionAccessRequired
                            onApply={handleApply}
                        />
                    </PageContainer>
                )}

                {productionStatus ===
                    'pending' && (
                    <PageContainer className="!px-6 !py-7 lg:!px-10">
                        <ProductionAccessPending
                            onDemoApprove={() =>
                                setProductionStatus(
                                    'approved',
                                )
                            }
                        />
                    </PageContainer>
                )}

                {productionStatus ===
                    'approved' && (
                    <PageContainer className="!px-6 !py-7 lg:!px-10">
                        <div className="mx-auto max-w-[1440px] space-y-5">
                            {/* ==================================================
                                ACTIVE BANNER
                            ================================================== */}

                            <div className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path d="M5 12l4 4L19 6" />
                                        </svg>
                                    </div>

                                    <div>
                                        <div className="text-sm font-bold text-emerald-700">
                                            Production API Active
                                        </div>

                                        <p className="mt-0.5 text-xs text-emerald-700/70">
                                            คุณสามารถใช้งาน Production
                                            API ได้แล้ว
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge tone="emerald">
                                        Active
                                    </Badge>

                                    <div className="hidden border-l border-emerald-200 pl-4 text-right sm:block">
                                        <div className="text-[10px] text-emerald-700/60">
                                            เปิดใช้งานเมื่อ
                                        </div>

                                        <div className="mt-0.5 text-xs font-semibold text-emerald-800">
                                            12 ก.ย. 2026
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                                MAIN GRID
                            ================================================== */}

                            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                                {/* LEFT */}
                                <div className="min-w-0 space-y-5">
                                    <ApiCredentials
                                        onDocs={handleDocs}
                                    />

                                    <UsageSummary />

                                    <RecentActivity
                                        onViewAll={
                                            handleActivity
                                        }
                                    />
                                </div>

                                {/* RIGHT */}
                                <aside className="space-y-5">
                                    <QuickActions
                                        onDocs={handleDocs}
                                        onGuide={
                                            handleGuide
                                        }
                                    />

                                    <WebhookCard
                                        onManage={
                                            handleWebhook
                                        }
                                    />

                                    {/* Security notice */}
                                    <Card className="border-amber-200 bg-amber-50/50">
                                        <div className="flex gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                                !
                                            </div>

                                            <div>
                                                <div className="text-xs font-bold text-amber-900">
                                                    Security Notice
                                                </div>

                                                <p className="mt-1 text-[10px] leading-5 text-amber-800/70">
                                                    ห้ามเปิดเผย Client
                                                    Secret
                                                    หรือเก็บไว้ใน
                                                    Frontend
                                                    ของเว็บไซต์
                                                    ควรเก็บไว้ใน
                                                    Backend
                                                    หรือ Environment
                                                    Variable
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </aside>
                            </div>
                        </div>
                    </PageContainer>
                )}
            </main>
        </div>
    );
}

export default Production;