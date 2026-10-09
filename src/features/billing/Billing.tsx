import { useLanguage } from '../../i18n/language';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '../../components/common/Badge';
import { Card } from '../../components/common/Card';
import { Header as ConsoleHeader } from '../../components/layout/Header';
import { PageContainer } from '../../components/layout/PageContainer';
import { Sidebar as AppSidebar } from '../../components/layout/Sidebar';
import { SidebarLogoutButton } from '../../components/layout/SidebarLogoutButton';
import LanguageSwitcher, { type Language as SwitcherLanguage } from '../../components/common/LanguageSwitcher';

import { useAuth } from '../auth/useAuth';
import { calculateDueDate, formatCurrency } from './billingLogic';
import {
    BILLING_PERIOD_END,
    BILLING_PERIOD_START,
    CREDIT_TERM_DAYS,
    NAV_LINKS,
    translations,
} from './data';
import { demoBillingService } from './services/billingService';
import type {
    BillingHistoryItem,
    HistoryRange,
} from './types';

function StatusBadge({
    status,
    language,
}: {
    status: 'Paid' | 'Pending' | 'Processing';
    language: SwitcherLanguage;
}) {
  const { t } = useLanguage();
    const copy = translations[language === 'TH' ? 'th' : 'en'];

    const label =
        status === 'Paid'
            ? copy.paid
            : status === 'Pending'
              ? copy.pending
              : copy.processing;

    if (status === 'Paid') {
        return <Badge tone="emerald">{t(label)}</Badge>;
    }

    if (status === 'Pending') {
        return <Badge tone="amber">{t(label)}</Badge>;
    }

    return <Badge tone="amber">{t(label)}</Badge>;
}

function LineChart({
    data,
    language,
}: {
    data: BillingHistoryItem[];
    language: SwitcherLanguage;
}) {
  const { t } = useLanguage();
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
                    language === 'TH'
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
                                {t("฿")}{Math.round(
                                    value / 1000,
                                ).toLocaleString()}
                                {t("k")}</text>
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
                            {t("฿")}{Math.round(
                                point.item.amount / 1000,
                            ).toLocaleString()}
                            {t("k")}</text>

                        <text
                            x={point.x}
                            y={height - 15}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#94a3b8"
                        >
                            {language === 'TH'
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

export default function Billing() {
  const { t } = useLanguage();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const {
        documents: BILLING_DOCUMENTS,
        history: BILLING_HISTORY,
        payments: PAYMENTS,
    } = demoBillingService.getSnapshot();

    const { lang: language, setLang: setLanguage } = useLanguage();

    const [historyRange, setHistoryRange] =
        useState<HistoryRange>(6);

    const [showHistoryDetails, setShowHistoryDetails] =
        useState(false);

    const [showPaymentHistory, setShowPaymentHistory] =
        useState(false);

    const copy = translations[language === 'TH' ? 'th' : 'en'];

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/', { replace: true });
        } catch {
            window.alert(copy.logoutError);
        }
    };

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
    const current = BILLING_HISTORY[BILLING_HISTORY.length - 1];
    const currentBilling = { shipments: current.shipments, amount: current.amount };
    const filteredHistory = BILLING_HISTORY.slice(-historyRange);
    const totalCharges = filteredHistory.reduce((sum, item) => sum + item.amount, 0);
    const totalShipments = filteredHistory.reduce((sum, item) => sum + item.shipments, 0);
    const historySummary = {
        totalCharges,
        totalShipments,
        average: filteredHistory.length > 0 ? totalCharges / filteredHistory.length : 0,
    };

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
        window.alert(`${copy.documentUnavailable}: ${documentId}`);
    };

    const handleDownloadDocument = (
        documentId: string,
    ) => {
        window.alert(`${copy.documentUnavailable}: ${documentId}`);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
            <AppSidebar
                items={NAV_LINKS.map((link) => ({
                    label: link.label,
                    path: link.to,
                }))}
                activePath="/billing"
                footer={
                    <SidebarLogoutButton
                        label={t(copy.logout)}
                        onClick={() => void handleLogout()}
                    />
                }
            />

            <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
                <ConsoleHeader
                    title={t(copy.billing)}
                    subtitle={t(copy.aboutPostpaidDesc)}
                    badge={
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                                {t(copy.aboutPostpaid)}
                            </span>
                        </div>
                    }
                    actions={
                        <div className="flex items-center gap-3">
                            <LanguageSwitcher
                                lang={language}
                                onChange={setLanguage}
                            />
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
                                        {t(copy.shipmentsThisMonth)}
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-950">
                                        {currentBilling.shipments.toLocaleString()}
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        {t("shipments")}</p>
                                </div>
                            </Card>

                            <Card>
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        {t(copy.shippingCharges)}
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-slate-950">
                                        {t("฿")}{formatCurrency(
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
                                        {t(copy.outstanding)}
                                    </p>

                                    <p className="mt-2 text-2xl font-bold text-amber-600">
                                        {t("฿")}{formatCurrency(
                                            currentBilling.amount,
                                        )}
                                    </p>

                                    <p className="mt-1 text-[11px] text-slate-400">
                                        {t(copy.due)} {dueDate}
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
                                                {t(copy.currentBilling)}
                                            </h2>

                                            <Badge tone="amber">
                                                {t(copy.pending)}
                                            </Badge>
                                        </div>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {t(copy.currentBillingDesc)}
                                        </p>
                                    </div>

                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-slate-400">
                                            {t(copy.amountDue)}
                                        </p>

                                        <p className="mt-1 text-3xl font-bold text-slate-950">
                                            {t("฿")}{formatCurrency(
                                                currentBilling.amount,
                                            )}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {t(copy.paymentDue)}:{' '}
                                            {dueDate}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                                        <div>
                                            <span className="text-slate-400">
                                                {t(copy.billingPeriod)}
                                            </span>

                                            <p className="mt-1 font-semibold text-slate-800">
                                                {t("September 2026")}</p>
                                        </div>

                                        <div>
                                            <span className="text-slate-400">
                                                {t(copy.creditTerm)}
                                            </span>

                                            <p className="mt-1 font-semibold text-slate-800">
                                                {creditTermDays}{' '}
                                                {t(copy.days)}
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
                                                {t(copy.viewStatement)}
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
                                                {t(copy.viewTaxInvoice)}
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
                                                {t(copy.billingHistory)}
                                            </h2>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {t(copy.billingHistoryDesc)}
                                            </p>
                                        </div>

                                        <div className="flex w-fit items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
                                            {[
                                                {
                                                    value: 1 as HistoryRange,
                                                    label: copy.oneMonth,
                                                },
                                                {
                                                    value: 3 as HistoryRange,
                                                    label: copy.threeMonths,
                                                },
                                                {
                                                    value: 6 as HistoryRange,
                                                    label: copy.sixMonths,
                                                },
                                                {
                                                    value: 12 as HistoryRange,
                                                    label: copy.oneYear,
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
                                                    {t(item.label)}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 pt-5">

                                    {/* History summary */}
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

                                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                {t(copy.totalCharges)}
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                {t("฿")}{formatCurrency(
                                                    historySummary.totalCharges,
                                                )}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                {t(copy.totalShipments)}
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                {historySummary.totalShipments.toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                {t(copy.averagePerMonth)}
                                            </p>

                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                {t("฿")}{formatCurrency(
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
                                                ? copy.hideDetails
                                                : copy.viewDetails}
                                        </button>
                                    </div>

                                    {/* Optional Details */}
                                    {showHistoryDetails && (
                                        <div className="border-t border-slate-100 pb-5 pt-4">
                                            <div className="overflow-x-auto">
                                                <table className="w-full min-w-[600px] text-left">
                                                    <thead>
                                                        <tr className="border-b border-slate-100">
                                                            <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                {t(copy.billingPeriod)}
                                                            </th>

                                                            <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                {t(copy.totalShipments)}
                                                            </th>

                                                            <th className="px-3 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-400">
                                                                {t(copy.totalCharges)}
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
                                                                            'TH'
                                                                                ? item.month
                                                                                : item.monthEn}{' '}
                                                                            2026
                                                                        </td>

                                                                        <td className="px-3 py-3 text-right text-xs text-slate-600">
                                                                            {item.shipments.toLocaleString()}
                                                                        </td>

                                                                        <td className="px-3 py-3 text-right text-xs font-bold text-slate-900">
                                                                            {t("฿")}{formatCurrency(
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
                                        {t(copy.documents)}
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-500">
                                        {t(copy.documentsDesc)}
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
                                                        {t(copy.billingStatement)}
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                                        {
                                                            t(copy.billingStatementEn)
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
                                                        {t("฿")}{formatCurrency(
                                                            billingStatement.amount,
                                                        )}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-400">
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
                                                    {t(copy.view)}
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
                                                    {t(copy.download)}
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
                                                        {t(copy.taxInvoice)}
                                                    </p>

                                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                                        {
                                                            t(copy.taxInvoiceEn)
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
                                                        {t("฿")}{formatCurrency(
                                                            taxInvoice.amount,
                                                        )}
                                                    </p>

                                                    <p className="mt-0.5 text-xs text-slate-400">
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
                                                    {t(copy.view)}
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
                                                    {t(copy.download)}
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
                                                {t(copy.paymentHistory)}
                                            </p>

                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                {t(copy.latestPayment)}:{' '}
                                                {latestPayment.date}
                                                {' · '}
                                                {t("฿")}{formatCurrency(
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
                                            ? copy.hidePaymentHistory
                                            : copy.viewPaymentHistory}
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

                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                {
                                                                    payment.date
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {t("฿")}{formatCurrency(
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
