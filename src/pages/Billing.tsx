import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Header as ConsoleHeader } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Sidebar as AppSidebar } from '../components/layout/Sidebar';

type Language = 'th' | 'en';
type HistoryRange = 1 | 3 | 6 | 12;

interface BillingHistoryItem {
    month: string;
    monthEn: string;
    amount: number;
    shipments: number;
}

interface Payment {
    id: string;
    date: string;
    reference: string;
    amount: number;
    status: 'Paid' | 'Processing';
}

interface BillingDocument {
    id: string;
    type: 'statement' | 'tax';
    period: string;
    issueDate: string;
    amount: number;
    status: 'Paid' | 'Pending';
    reference?: string;
}

const NAV_LINKS = [
    { to: '/docs', label: 'API Docs' },
    { to: '/sandbox', label: 'Sandbox' },
    { to: '/production', label: 'Production' },
    { to: '/wallet', label: 'Billing' },
];

// เปลี่ยนเป็น 14 สำหรับลูกค้าที่มี Credit Term 14 วัน
const CREDIT_TERM_DAYS = 30;

const BILLING_PERIOD_START = '1 Sep 2026';
const BILLING_PERIOD_END = '30 Sep 2026';

const BILLING_HISTORY: BillingHistoryItem[] = [
    {
        month: 'ต.ค.',
        monthEn: 'Oct',
        amount: 152000,
        shipments: 7600,
    },
    {
        month: 'พ.ย.',
        monthEn: 'Nov',
        amount: 159000,
        shipments: 7950,
    },
    {
        month: 'ธ.ค.',
        monthEn: 'Dec',
        amount: 165000,
        shipments: 8250,
    },
    {
        month: 'ม.ค.',
        monthEn: 'Jan',
        amount: 171500,
        shipments: 8575,
    },
    {
        month: 'ก.พ.',
        monthEn: 'Feb',
        amount: 160000,
        shipments: 7980,
    },
    {
        month: 'มี.ค.',
        monthEn: 'Mar',
        amount: 168900,
        shipments: 8420,
    },
    {
        month: 'เม.ย.',
        monthEn: 'Apr',
        amount: 176280,
        shipments: 8950,
    },
    {
        month: 'พ.ค.',
        monthEn: 'May',
        amount: 181450,
        shipments: 9300,
    },
    {
        month: 'มิ.ย.',
        monthEn: 'Jun',
        amount: 205120,
        shipments: 10850,
    },
    {
        month: 'ก.ค.',
        monthEn: 'Jul',
        amount: 172350,
        shipments: 8650,
    },
    {
        month: 'ส.ค.',
        monthEn: 'Aug',
        amount: 186420,
        shipments: 9750,
    },
    {
        month: 'ก.ย.',
        monthEn: 'Sep',
        amount: 227250,
        shipments: 11850,
    },
];

const BILLING_DOCUMENTS: BillingDocument[] = [
    {
        id: 'BL-2026-09-0001',
        type: 'statement',
        period: 'September 2026',
        issueDate: '30 Sep 2026',
        amount: 227250,
        status: 'Pending',
    },
    {
        id: 'TAX-2026-09-0001',
        type: 'tax',
        period: 'September 2026',
        issueDate: '30 Sep 2026',
        amount: 227250,
        status: 'Pending',
        reference: 'BL-2026-09-0001',
    },
    {
        id: 'BL-2026-08-0001',
        type: 'statement',
        period: 'August 2026',
        issueDate: '31 Aug 2026',
        amount: 186420,
        status: 'Paid',
    },
    {
        id: 'TAX-2026-08-0001',
        type: 'tax',
        period: 'August 2026',
        issueDate: '31 Aug 2026',
        amount: 186420,
        status: 'Paid',
        reference: 'BL-2026-08-0001',
    },
];

const PAYMENTS: Payment[] = [
    {
        id: 'PAY-001',
        date: '15 Sep 2026',
        reference: 'BANK-09152345',
        amount: 186420,
        status: 'Paid',
    },
    {
        id: 'PAY-002',
        date: '14 Aug 2026',
        reference: 'BANK-08142345',
        amount: 172350,
        status: 'Paid',
    },
];

const translations = {
    th: {
        billing: 'Billing',
        billingSubtitle: 'ตรวจสอบค่าขนส่งและเอกสารการเรียกเก็บเงิน',
        postpaid: 'Postpaid',

        shipmentsThisMonth: 'พัสดุเดือนนี้',
        shippingCharges: 'ค่าขนส่งเดือนนี้',
        outstanding: 'ยอดที่ต้องชำระ',
        due: 'ครบกำหนด',

        currentBilling: 'Current Billing',
        currentBillingDesc: 'สรุปยอดค่าขนส่งของรอบบิลปัจจุบัน',
        billingPeriod: 'รอบบิล',
        amountDue: 'ยอดที่ต้องชำระ',
        paymentDue: 'ครบกำหนดชำระ',
        creditTerm: 'เครดิตเทอม',
        days: 'วัน',
        invoiceDate: 'วันที่ออกเอกสาร',

        viewStatement: 'ดูใบวางบิล',
        viewTaxInvoice: 'ดูใบแจ้งหนี้/ใบกำกับภาษี',

        billingHistory: 'Billing History',
        billingHistoryDesc: 'ดูแนวโน้มยอดค่าขนส่งย้อนหลัง',
        oneMonth: '1 เดือน',
        threeMonths: '3 เดือน',
        sixMonths: '6 เดือน',
        oneYear: '1 ปี',
        totalCharges: 'ยอดค่าขนส่ง',
        totalShipments: 'พัสดุรวม',
        averagePerMonth: 'เฉลี่ยต่อเดือน',
        viewDetails: 'ดูรายละเอียด →',
        hideDetails: 'ซ่อนรายละเอียด ↑',

        documents: 'Billing Documents',
        documentsDesc: 'เอกสารเรียกเก็บเงินตามรอบบิล',

        billingStatement: 'ใบวางบิล',
        billingStatementEn: 'Billing Statement',
        billingStatementDesc: 'เอกสารสรุปยอดค่าขนส่งตามรอบบิล',

        taxInvoice: 'ใบแจ้งหนี้/ใบกำกับภาษี',
        taxInvoiceEn: 'Tax Invoice',
        taxInvoiceDesc: 'เอกสารสำหรับการเรียกเก็บเงินและภาษี',

        documentNumber: 'เลขที่เอกสาร',
        reference: 'อ้างอิง',
        view: 'ดู',
        download: 'ดาวน์โหลด',

        paymentHistory: 'Payment History',
        paymentHistoryDesc: 'ประวัติการชำระค่าขนส่ง',
        latestPayment: 'การชำระล่าสุด',
        viewPaymentHistory: 'ดูประวัติการชำระ →',
        hidePaymentHistory: 'ซ่อนประวัติ ↑',

        pending: 'รอชำระ',
        paid: 'ชำระแล้ว',
        processing: 'กำลังดำเนินการ',

        aboutPostpaid: 'Postpaid',
        aboutPostpaidDesc:
            'ยอดค่าขนส่งจะถูกรวมและเรียกเก็บตามรอบบิลและเครดิตเทอมที่กำหนดไว้ในบัญชีของคุณ',

        logout: 'ออกจากระบบ',

        opening: 'กำลังเปิดเอกสาร',
        downloading: 'กำลังดาวน์โหลด',
    },

    en: {
        billing: 'Billing',
        billingSubtitle: 'View shipping charges and billing documents.',
        postpaid: 'Postpaid',

        shipmentsThisMonth: 'Shipments This Month',
        shippingCharges: 'Shipping Charges',
        outstanding: 'Amount Due',
        due: 'Due',

        currentBilling: 'Current Billing',
        currentBillingDesc: 'Summary of shipping charges for the current billing period.',
        billingPeriod: 'Billing Period',
        amountDue: 'Amount Due',
        paymentDue: 'Payment Due',
        creditTerm: 'Credit Term',
        days: 'Days',
        invoiceDate: 'Document Date',

        viewStatement: 'View Billing Statement',
        viewTaxInvoice: 'View Tax Invoice',

        billingHistory: 'Billing History',
        billingHistoryDesc: 'View your shipping charge trend over time.',
        oneMonth: '1 Month',
        threeMonths: '3 Months',
        sixMonths: '6 Months',
        oneYear: '1 Year',
        totalCharges: 'Total Charges',
        totalShipments: 'Total Shipments',
        averagePerMonth: 'Average / Month',
        viewDetails: 'View details →',
        hideDetails: 'Hide details ↑',

        documents: 'Billing Documents',
        documentsDesc: 'Billing documents by billing period.',

        billingStatement: 'Billing Statement',
        billingStatementEn: 'Billing Statement',
        billingStatementDesc: 'Summary of shipping charges for the billing period.',

        taxInvoice: 'Tax Invoice',
        taxInvoiceEn: 'Tax Invoice',
        taxInvoiceDesc: 'Document for billing and tax purposes.',

        documentNumber: 'Document No.',
        reference: 'Reference',
        view: 'View',
        download: 'Download',

        paymentHistory: 'Payment History',
        paymentHistoryDesc: 'History of shipping payments.',
        latestPayment: 'Latest Payment',
        viewPaymentHistory: 'View payment history →',
        hidePaymentHistory: 'Hide history ↑',

        pending: 'Pending',
        paid: 'Paid',
        processing: 'Processing',

        aboutPostpaid: 'Postpaid',
        aboutPostpaidDesc:
            'Shipping charges are consolidated and billed according to your assigned billing cycle and credit term.',

        logout: 'Log out',

        opening: 'Opening document',
        downloading: 'Downloading',
    },
} as const;

function formatCurrency(value: number) {
    return new Intl.NumberFormat('th-TH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

function calculateDueDate(issueDate: string, creditTermDays: number) {
    const date = new Date(issueDate);

    date.setDate(date.getDate() + creditTermDays);

    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function StatusBadge({
    status,
    language,
}: {
    status: 'Paid' | 'Pending' | 'Processing';
    language: Language;
}) {
    const t = translations[language];

    const label =
        status === 'Paid'
            ? t.paid
            : status === 'Pending'
              ? t.pending
              : t.processing;

    if (status === 'Paid') {
        return <Badge tone="emerald">{label}</Badge>;
    }

    if (status === 'Pending') {
        return <Badge tone="amber">{label}</Badge>;
    }

    return <Badge tone="amber">{label}</Badge>;
}

function LineChart({
    data,
    language,
}: {
    data: BillingHistoryItem[];
    language: Language;
}) {
    const width = 760;
    const height = 250;

    const padding = {
        top: 25,
        right: 25,
        bottom: 45,
        left: 65,
    };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const values = data.map((item) => item.amount);

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const valueRange = Math.max(maxValue - minValue, 1);

    const points = data.map((item, index) => {
        const x =
            data.length === 1
                ? padding.left + chartWidth / 2
                : padding.left +
                  (index / (data.length - 1)) * chartWidth;

        const y =
            padding.top +
            (1 - (item.amount - minValue) / valueRange) * chartHeight;

        return {
            x,
            y,
            item,
        };
    });

    const linePoints = points
        .map((point) => `${point.x},${point.y}`)
        .join(' ');

    const areaPoints = [
        `${padding.left},${padding.top + chartHeight}`,
        ...points.map((point) => `${point.x},${point.y}`),
        `${padding.left + chartWidth},${padding.top + chartHeight}`,
    ].join(' ');

    const gridValues = [
        maxValue,
        minValue + valueRange / 2,
        minValue,
    ];

    return (
        <div className="w-full overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-[250px] w-full min-w-[650px]"
                role="img"
                aria-label={
                    language === 'th'
                        ? 'กราฟยอดค่าขนส่งย้อนหลัง'
                        : 'Shipping charge history chart'
                }
            >
                {/* Grid */}
                {gridValues.map((value, index) => {
                    const y =
                        padding.top +
                        (index / (gridValues.length - 1)) *
                            chartHeight;

                    return (
                        <g key={index}>
                            <line
                                x1={padding.left}
                                y1={y}
                                x2={padding.left + chartWidth}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeDasharray="4 5"
                            />

                            <text
                                x={padding.left - 10}
                                y={y + 4}
                                textAnchor="end"
                                fontSize="11"
                                fill="#94a3b8"
                            >
                                ฿
                                {Math.round(
                                    value / 1000,
                                ).toLocaleString()}
                                k
                            </text>
                        </g>
                    );
                })}

                {/* Area */}
                <polygon
                    points={areaPoints}
                    fill="url(#billingArea)"
                />

                {/* Line */}
                <polyline
                    points={linePoints}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Points */}
                {points.map((point, index) => (
                    <g key={index}>
                        <circle
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="white"
                            stroke="#6366f1"
                            strokeWidth="3"
                        />

                        <text
                            x={point.x}
                            y={point.y - 12}
                            textAnchor="middle"
                            fontSize="10"
                            fontWeight="600"
                            fill="#475569"
                        >
                            ฿
                            {Math.round(
                                point.item.amount / 1000,
                            ).toLocaleString()}
                            k
                        </text>

                        <text
                            x={point.x}
                            y={height - 15}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#94a3b8"
                        >
                            {language === 'th'
                                ? point.item.month
                                : point.item.monthEn}
                        </text>
                    </g>
                ))}

                <defs>
                    <linearGradient
                        id="billingArea"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            stopColor="#6366f1"
                            stopOpacity="0.12"
                        />
                        <stop
                            offset="100%"
                            stopColor="#6366f1"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}

export default function Wallet() {
    const navigate = useNavigate();

    const [language, setLanguage] =
        useState<Language>('th');

    const [historyRange, setHistoryRange] =
        useState<HistoryRange>(6);

    const [showHistoryDetails, setShowHistoryDetails] =
        useState(false);

    const [showPaymentHistory, setShowPaymentHistory] =
        useState(false);

    const t = translations[language];

    const creditTermDays = CREDIT_TERM_DAYS;

    const billingPeriod = `${BILLING_PERIOD_START} – ${BILLING_PERIOD_END}`;

    const dueDate = calculateDueDate(
        '2026-09-30T00:00:00',
        creditTermDays,
    );

    /*
     * ยอดปัจจุบัน
     * ใช้ข้อมูลเดียวกับ Billing History เดือน ก.ย. 2026
     */
    const currentBilling = useMemo(() => {
        const current =
            BILLING_HISTORY[BILLING_HISTORY.length - 1];

        return {
            shipments: current.shipments,
            amount: current.amount,
        };
    }, []);

    const filteredHistory = useMemo(() => {
        return BILLING_HISTORY.slice(-historyRange);
    }, [historyRange]);

    const historySummary = useMemo(() => {
        const totalCharges = filteredHistory.reduce(
            (sum, item) => sum + item.amount,
            0,
        );

        const totalShipments = filteredHistory.reduce(
            (sum, item) => sum + item.shipments,
            0,
        );

        return {
            totalCharges,
            totalShipments,
            average:
                filteredHistory.length > 0
                    ? totalCharges / filteredHistory.length
                    : 0,
        };
    }, [filteredHistory]);

    const latestPayment = PAYMENTS[0];

    const billingStatement =
        BILLING_DOCUMENTS.find(
            (document) =>
                document.type === 'statement' &&
                document.period === 'September 2026',
        );

    const taxInvoice = BILLING_DOCUMENTS.find(
        (document) =>
            document.type === 'tax' &&
            document.period === 'September 2026',
    );

    const handleOpenDocument = (
        documentId: string,
    ) => {
        window.alert(
            `${t.opening}: ${documentId}`,
        );
    };

    const handleDownloadDocument = (
        documentId: string,
    ) => {
        window.alert(
            `${t.downloading}: ${documentId}`,
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
            <AppSidebar
                items={NAV_LINKS.map((link) => ({
                    label: link.label,
                    path: link.to,
                }))}
                activePath="/wallet"
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
                        {t.logout}
                    </Button>
                }
            />

            <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
                <ConsoleHeader
                    title={t.billing}
                    subtitle={t.aboutPostpaidDesc}
                    badge={
                        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                            {t.aboutPostpaid}
                        </span>
                    }
                    actions={
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                                {(['TH', 'EN'] as const).map((code) => (
                                    <button
                                        key={code}
                                        type="button"
                                        onClick={() =>
                                            setLanguage(code === 'TH' ? 'th' : 'en')
                                        }
                                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${
                                            language === (code === 'TH' ? 'th' : 'en')
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
                />

                <PageContainer>
                    <div className="mx-auto max-w-[1200px] space-y-5">

                        {/* ================================================= */}
                        {/* SUMMARY */}
                        {/* ================================================= */}

                        <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <Card>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        {t.shipmentsThisMonth}
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-950">
                                        {currentBilling.shipments.toLocaleString()}
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        shipments
                                    </p>
                                </div>
                            </Card>

                            <Card>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        {t.shippingCharges}
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-950">
                                        ฿
                                        {formatCurrency(
                                            currentBilling.amount,
                                        )}
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        {billingPeriod}
                                    </p>
                                </div>
                            </Card>

                            <Card>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        {t.outstanding}
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-amber-600">
                                        ฿
                                        {formatCurrency(
                                            currentBilling.amount,
                                        )}
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        {t.due} {dueDate}
                                    </p>
                                </div>
                            </Card>

                        </section>

                        {/* ================================================= */}
                        {/* CURRENT BILLING */}
                        {/* ================================================= */}

                        <section>
                            <Card>
                                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-base font-bold text-slate-950">
                                                {t.currentBilling}
                                            </h2>

                                            <Badge tone="amber">
                                                {t.pending}
                                            </Badge>
                                        </div>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {t.currentBillingDesc}
                                        </p>
                                    </div>

                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-slate-400">
                                            {t.amountDue}
                                        </p>

                                        <p className="mt-1 text-3xl font-bold text-slate-950">
                                            ฿
                                            {formatCurrency(
                                                currentBilling.amount,
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {t.paymentDue}:{' '}
                                            {dueDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                                        <div>
                                            <span className="text-slate-400">
                                                {t.billingPeriod}
                                            </span>

                                            <p className="mt-1 font-semibold text-slate-800">
                                                September 2026
                                            </p>
                                        </div>

                                        <div>
                                            <span className="text-slate-400">
                                                {t.creditTerm}
                                            </span>

                                            <p className="mt-1 font-semibold text-slate-800">
                                                {creditTermDays}{' '}
                                                {t.days}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row">
                                        {billingStatement && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenDocument(
                                                        billingStatement.id,
                                                    )
                                                }
                                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                            >
                                                {t.viewStatement}
                                            </button>
                                        )}

                                        {taxInvoice && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleOpenDocument(
                                                        taxInvoice.id,
                                                    )
                                                }
                                                className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                                            >
                                                {t.viewTaxInvoice}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* ================================================= */}
                        {/* BILLING HISTORY */}
                        {/* ================================================= */}

                        <section>
                            <Card padded={false}>
                                <div className="border-b border-slate-100 px-6 py-5">

                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        <div>
                                            <h2 className="text-sm font-bold text-slate-950">
                                                {t.billingHistory}
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {t.billingHistoryDesc}
                                            </p>
                                        </div>

                                        <div className="flex w-fit items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
                                            {[
                                                {
                                                    value: 1 as HistoryRange,
                                                    label: t.oneMonth,
                                                },
                                                {
                                                    value: 3 as HistoryRange,
                                                    label: t.threeMonths,
                                                },
                                                {
                                                    value: 6 as HistoryRange,
                                                    label: t.sixMonths,
                                                },
                                                {
                                                    value: 12 as HistoryRange,
                                                    label: t.oneYear,
                                                },
                                            ].map((item) => (
                                                <button
                                                    key={item.value}
                                                    type="button"
                                                    onClick={() =>
                                                        setHistoryRange(
                                                            item.value,
                                                        )
                                                    }
                                                    className={`rounded-md px-3 py-1.5 text-[11px] font-semibold transition ${
                                                        historyRange ===
                                                        item.value
                                                            ? 'bg-white text-indigo-600 shadow-sm'
                                                            : 'text-slate-500 hover:text-slate-700'
                                                    }`}
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 pt-5">

                                    {/* History summary */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                {t.totalCharges}
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                ฿
                                                {formatCurrency(
                                                    historySummary.totalCharges,
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                {t.totalShipments}
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                {historySummary.totalShipments.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                                {t.averagePerMonth}
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                ฿
                                                {formatCurrency(
                                                    historySummary.average,
                                                )}
                                            </p>
                                        </div>

                                    </div>

                                    {/* Line Chart */}
                                    <div className="mt-3 rounded-xl border border-slate-100 bg-white px-2 py-2">
                                        <LineChart
                                            data={filteredHistory}
                                            language={language}
                                        />
                                    </div>

                                    {/* Details Toggle */}
                                    <div className="border-t border-slate-100 py-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowHistoryDetails(
                                                    !showHistoryDetails,
                                                )
                                            }
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                        >
                                            {showHistoryDetails
                                                ? t.hideDetails
                                                : t.viewDetails}
                                        </button>
                                    </div>

                                    {/* Optional Details */}
                                    {showHistoryDetails && (
                                        <div className="border-t border-slate-100 pb-5 pt-4">
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[600px] text-left">
                                                    <thead>
                                                        <tr className="border-b border-slate-100">
                                                            <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                {t.billingPeriod}
                                                            </th>

                                                            <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                {t.totalShipments}
                                                            </th>

                                                            <th className="px-3 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                {t.totalCharges}
                                                            </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {[...filteredHistory]
                                                            .reverse()
                                                            .map(
                                                                (
                                                                    item,
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            item.monthEn
                                                                        }
                                                                        className="border-b border-slate-50 last:border-0"
                                                                    >
                                                                        <td className="px-3 py-3 text-xs font-semibold text-slate-700">
                                                                            {language ===
                                                                            'th'
                                                                                ? item.month
                                                                                : item.monthEn}{' '}
                                                                            2026
                                                                        </td>

                                                                        <td className="px-3 py-3 text-right text-xs text-slate-600">
                                                                            {item.shipments.toLocaleString()}
                                                                        </td>

                                                                        <td className="px-3 py-3 text-right text-xs font-bold text-slate-900">
                                                                            ฿
                                                                            {formatCurrency(
                                                                                item.amount,
                                                                            )}
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </section>

                        {/* ================================================= */}
                        {/* BILLING DOCUMENTS */}
                        {/* ================================================= */}

                        <section>
                            <Card padded={false}>
                                <div className="border-b border-slate-100 px-6 py-5">
                                    <h2 className="text-sm font-bold text-slate-950">
                                        {t.documents}
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {t.documentsDesc}
                                    </p>
                                </div>

                                <div className="divide-y divide-slate-100">

                                    {/* Billing Statement */}
                                    {billingStatement && (
                                        <div className="flex flex-col justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center">

                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={1.8}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M7 3h7l4 4v14H7V3Z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M14 3v5h5M10 12h5M10 16h5"
                                                        />
                                                    </svg>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-900">
                                                        {t.billingStatement}
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                                        {
                                                            t.billingStatementEn
                                                        }{' '}
                                                        ·{' '}
                                                        {
                                                            billingStatement.id
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-900">
                                                        ฿
                                                        {formatCurrency(
                                                            billingStatement.amount,
                                                        )}
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                                        {
                                                            billingStatement.issueDate
                                                        }
                                                    </p>
                                                </div>

                                                <StatusBadge
                                                    status={
                                                        billingStatement.status
                                                    }
                                                    language={
                                                        language
                                                    }
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenDocument(
                                                            billingStatement.id,
                                                        )
                                                    }
                                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                                >
                                                    {t.view}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDownloadDocument(
                                                            billingStatement.id,
                                                        )
                                                    }
                                                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                                                >
                                                    {t.download}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tax Invoice */}
                                    {taxInvoice && (
                                        <div className="flex flex-col justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center">

                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                    <svg
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth={1.8}
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M7 3h7l4 4v14H7V3Z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M14 3v5h5M10 12h5M10 16h5"
                                                        />
                                                    </svg>
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-slate-900">
                                                        {t.taxInvoice}
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                                        {
                                                            t.taxInvoiceEn
                                                        }{' '}
                                                        ·{' '}
                                                        {
                                                            taxInvoice.id
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-900">
                                                        ฿
                                                        {formatCurrency(
                                                            taxInvoice.amount,
                                                        )}
                                                    </p>

                                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                                        {
                                                            taxInvoice.issueDate
                                                        }
                                                    </p>
                                                </div>

                                                <StatusBadge
                                                    status={
                                                        taxInvoice.status
                                                    }
                                                    language={
                                                        language
                                                    }
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleOpenDocument(
                                                            taxInvoice.id,
                                                        )
                                                    }
                                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                                >
                                                    {t.view}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDownloadDocument(
                                                            taxInvoice.id,
                                                        )
                                                    }
                                                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                                                >
                                                    {t.download}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </section>

                        {/* ================================================= */}
                        {/* PAYMENT HISTORY - COMPACT */}
                        {/* ================================================= */}

                        <section>
                            <Card padded={false}>
                                <div className="flex flex-col justify-between gap-3 px-6 py-4 sm:flex-row sm:items-center">

                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.8}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M3 7h18M5 7v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7M7 4h10l2 3H5l2-3Z"
                                                />
                                            </svg>
                                        </div>

                                        <div>
                                            <p className="text-xs font-bold text-slate-900">
                                                {t.paymentHistory}
                                            </p>

                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                {t.latestPayment}:{' '}
                                                {latestPayment.date}
                                                {' · '}
                                                ฿
                                                {formatCurrency(
                                                    latestPayment.amount,
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPaymentHistory(
                                                !showPaymentHistory,
                                            )
                                        }
                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                                    >
                                        {showPaymentHistory
                                            ? t.hidePaymentHistory
                                            : t.viewPaymentHistory}
                                    </button>
                                </div>

                                {showPaymentHistory && (
                                    <div className="border-t border-slate-100 px-6 py-4">
                                        <div className="space-y-2">
                                            {PAYMENTS.map(
                                                (payment) => (
                                                    <div
                                                        key={
                                                            payment.id
                                                        }
                                                        className="flex flex-col justify-between gap-2 rounded-lg bg-slate-50 px-4 py-3 sm:flex-row sm:items-center"
                                                    >
                                                        <div>
                                                            <p className="text-xs font-semibold text-slate-800">
                                                                {
                                                                    payment.reference
                                                                }
                                                            </p>

                                                            <p className="mt-0.5 text-[10px] text-slate-400">
                                                                {
                                                                    payment.date
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs font-bold text-slate-900">
                                                                ฿
                                                                {formatCurrency(
                                                                    payment.amount,
                                                                )}
                                                            </span>

                                                            <StatusBadge
                                                                status={
                                                                    payment.status
                                                                }
                                                                language={
                                                                    language
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        </section>

                    </div>
                </PageContainer>
            </main>
        </div>
    );
}