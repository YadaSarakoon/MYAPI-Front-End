import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    CheckCircle2,
    Clock3,
    Copy,
    CreditCard,
    QrCode,
    Receipt,
    Truck,
    Wallet as WalletIcon,
    X,
    XCircle,
} from 'lucide-react';

import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Header as ConsoleHeader } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Sidebar as AppSidebar } from '../components/layout/Sidebar';

// ============================================================
// TYPES
// ============================================================

type TransactionStatus = 'SUCCESS' | 'PENDING' | 'FAILED';

interface Transaction {
    id: string;
    date: string;
    type: string;
    reference: string;
    amount: number;
    balance: number;
    status: TransactionStatus;
}

// ============================================================
// NAVIGATION
// ============================================================

const NAV_LINKS = [
    { to: '/docs', label: 'API Docs' },
    { to: '/sandbox', label: 'Sandbox' },
    { to: '/production', label: 'Production' },
    { to: '/wallet', label: 'Wallet' },
];

// ============================================================
// MOCK DATA
// ============================================================

const transactions: Transaction[] = [
    {
        id: 'TXN-001',
        date: '2 ก.ย. 2569 11:11',
        type: 'เติมเงิน',
        reference: 'TOPUP-20260902-001',
        amount: 1000,
        balance: 9999,
        status: 'SUCCESS',
    },
    {
        id: 'TXN-002',
        date: '1 ก.ย. 2569 15:32',
        type: 'เติมเงิน',
        reference: 'TOPUP-20260901-002',
        amount: 2000,
        balance: 8999,
        status: 'SUCCESS',
    },
    {
        id: 'TXN-003',
        date: '30 ส.ค. 2569 10:21',
        type: 'ใช้บริการ API',
        reference: 'SHIP-20260830-014',
        amount: -35,
        balance: 6999,
        status: 'SUCCESS',
    },
];

// ============================================================
// HELPERS
// ============================================================

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('th-TH').format(amount);
}

function StatusBadge({ status }: { status: TransactionStatus }) {
    const config = {
        SUCCESS: {
            label: 'สำเร็จ',
            icon: CheckCircle2,
            className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        PENDING: {
            label: 'กำลังดำเนินการ',
            icon: Clock3,
            className: 'bg-amber-50 text-amber-700 border-amber-200',
        },
        FAILED: {
            label: 'ไม่สำเร็จ',
            icon: XCircle,
            className: 'bg-rose-50 text-rose-700 border-rose-200',
        },
    };

    const item = config[status];
    const Icon = item.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${item.className}`}
        >
            <Icon size={13} />
            {item.label}
        </span>
    );
}

// ============================================================
// WALLET
// ============================================================

export default function Wallet() {
    const navigate = useNavigate();

    const [selectedAmount, setSelectedAmount] = useState<number | null>(1000);
    const [customAmount, setCustomAmount] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [copied, setCopied] = useState(false);
    const [transferSubmitted, setTransferSubmitted] = useState(false);

    const walletBalance = 9999;

    const displayAmount = useMemo(() => {
        if (customAmount) {
            return Number(customAmount) || 0;
        }

        return selectedAmount ?? 0;
    }, [customAmount, selectedAmount]);

    const estimatedRequests = useMemo(() => {
        return Math.floor(walletBalance / 32);
    }, [walletBalance]);

    // ============================================================
    // HANDLERS
    // ============================================================

    const handleSelectAmount = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount('');
    };

    const handleCustomAmount = (value: string) => {
        const numericValue = value.replace(/\D/g, '');

        setCustomAmount(numericValue);
        setSelectedAmount(null);
    };

    const handlePayment = () => {
        if (displayAmount <= 0) return;

        setTransferSubmitted(false);
        setShowPayment(true);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText('1234567890123');
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch {
            // Ignore clipboard errors in mock UI
        }
    };

    const handleConfirmPayment = () => {
        setTransferSubmitted(true);
    };

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
            {/* ======================================================
          SIDEBAR
      ====================================================== */}

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
                        onClick={() => navigate('/login')}
                    >
                        ออกจากระบบ
                    </Button>
                }
            />

            {/* ======================================================
          MAIN
      ====================================================== */}

            <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
                <ConsoleHeader
                    title="Wallet"
                    subtitle="Manage your balance for Production API usage."
                    actions={
                        <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                            {(['TH', 'EN'] as const).map((code) => (
                                <button
                                    key={code}
                                    type="button"
                                    className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${
                                        code === 'TH'
                                            ? 'bg-white text-indigo-700 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {code}
                                </button>
                            ))}
                        </div>
                    }
                    userName="My Company"
                    userMeta="Production Account"
                />

                <PageContainer className="!px-6 !py-7 lg:!px-10">
                    {/* ==================================================
              PAGE HEADER
          ================================================== */}

                    <div className="mb-7">
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                        Production Wallet
                                    </h1>
                                </div>

                                <p className="max-w-2xl text-sm leading-6 text-slate-500">
                                    จัดการยอดเงินสำหรับการใช้งาน API และค่าขนส่งจริง
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ==================================================
              SUMMARY
          ================================================== */}

                    <div className="mb-6 grid gap-4 md:grid-cols-3">
                        {/* Balance */}

                        <Card className="border-slate-200 bg-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        ยอดเงิน
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                                        ฿{formatCurrency(walletBalance)}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        ยอดเงินคงเหลือ
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    <CreditCard size={20} />
                                </div>
                            </div>
                        </Card>

                        {/* Shipping */}

                        <Card className="border-slate-200 bg-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        ค่าขนส่งที่ใช้ได้
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                                        ฿{formatCurrency(walletBalance)}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        ยอดที่สามารถใช้งานได้
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Truck size={20} />
                                </div>
                            </div>
                        </Card>

                        {/* Estimated usage */}

                        <Card className="border-slate-200 bg-white">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        ประมาณการใช้งานคงเหลือ
                                    </p>

                                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
                                        {formatCurrency(estimatedRequests)}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        รายการ API โดยประมาณ
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <Receipt size={20} />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* ==================================================
              TOP UP
          ================================================== */}

                    <Card className="mb-6 overflow-hidden" padded={false}>
                        <div className="border-b border-slate-200 px-6 py-5">
                            <h2 className="text-base font-semibold text-slate-900">
                                เติมเงิน
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                เลือกช่องทางการชำระเงินและจำนวนเงินที่ต้องการเติม
                            </p>
                        </div>

                        <div className="space-y-6 p-6">
                            {/* Payment method */}

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    ช่องทางการเติมเครดิต
                                </label>

                                <div className="flex items-center gap-3 rounded-xl border border-indigo-300 bg-indigo-50/60 p-4 ring-1 ring-indigo-200">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                        <QrCode size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">โอนเข้าบัญชี MyOrder ผ่าน QR</p>
                                        <p className="mt-0.5 text-xs text-slate-500">เงินเข้าบัญชีบริษัทโดยตรง ระบบจะเพิ่มเครดิตหลังตรวจสอบยอดโอน</p>
                                    </div>
                                </div>
                            </div>

                            {/* Amount */}

                            <div>
                                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    จำนวนเงิน
                                </label>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {[500, 1000, 1500, 2000].map((amount) => {
                                        const active = selectedAmount === amount;

                                        return (
                                            <button
                                                key={amount}
                                                type="button"
                                                onClick={() => handleSelectAmount(amount)}
                                                className={`rounded-lg border px-4 py-3 text-sm font-semibold transition ${active
                                                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                                                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                                                    }`}
                                            >
                                                ฿{formatCurrency(amount)}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-3">
                                    <div className="relative">
                                        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-slate-400">
                                            ฿
                                        </span>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            value={customAmount}
                                            onChange={(e) =>
                                                handleCustomAmount(e.target.value)
                                            }
                                            placeholder="จำนวนเงินอื่น ๆ"
                                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-8 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action */}

                            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-medium text-slate-500">
                                        จำนวนเงินที่ต้องชำระ
                                    </p>

                                    <p className="mt-1 text-xl font-semibold text-slate-900">
                                        ฿{formatCurrency(displayAmount)}
                                    </p>
                                </div>

                                <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    disabled={displayAmount <= 0}
                                    onClick={handlePayment}
                                    className="min-w-[180px]"
                                >
                                    สร้าง QR สำหรับโอน ฿{formatCurrency(displayAmount)}
                                </Button>
                            </div>

                            {/* Info */}

                            <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                                <div className="flex gap-3">
                                    <div className="mt-0.5 text-blue-600">
                                        <WalletIcon size={18} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-blue-900">
                                            เครดิต Wallet สำหรับค่าพัสดุ
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-blue-700">
                                            เงินที่โอนเข้าบัญชีบริษัทและยอดเครดิตใน Wallet เป็นคนละสิ่งกัน บริษัทจะตรวจสอบยอดโอนก่อนอนุมัติเพิ่มเครดิต และระบบจะหักเครดิตเมื่อมีการส่งพัสดุจริงเท่านั้น
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* ==================================================
              TRANSACTION HISTORY
          ================================================== */}

                    <Card className="overflow-hidden" padded={false}>
                        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-base font-semibold text-slate-900">
                                    ประวัติรายการ
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    รายการเติมเงินและการใช้งาน Wallet
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="border-slate-200 bg-white"
                            >
                                ดูทั้งหมด
                            </Button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left">
                                <thead className="border-b border-slate-200 bg-slate-50">
                                    <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        <th className="px-6 py-3">วันที่</th>
                                        <th className="px-6 py-3">ประเภท</th>
                                        <th className="px-6 py-3">อ้างอิง</th>
                                        <th className="px-6 py-3 text-right">จำนวนเงิน</th>
                                        <th className="px-6 py-3 text-right">ยอดคงเหลือ</th>
                                        <th className="px-6 py-3">สถานะ</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {transactions.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="transition hover:bg-slate-50/70"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                                {transaction.date}
                                            </td>

                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-800">
                                                    {transaction.type}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <code className="rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-slate-600">
                                                    {transaction.reference}
                                                </code>
                                            </td>

                                            <td
                                                className={`px-6 py-4 text-right font-semibold ${transaction.amount >= 0
                                                        ? 'text-emerald-600'
                                                        : 'text-rose-600'
                                                    }`}
                                            >
                                                {transaction.amount >= 0 ? '+' : '-'}฿
                                                {formatCurrency(
                                                    Math.abs(transaction.amount)
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right font-medium text-slate-800">
                                                ฿{formatCurrency(transaction.balance)}
                                            </td>

                                            <td className="px-6 py-4">
                                                <StatusBadge status={transaction.status} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </PageContainer>
            </main>

            {/* ======================================================
          PAYMENT MODAL
      ====================================================== */}

            {showPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-[2px]">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        {/* Modal header */}

                        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    ยืนยันการชำระเงิน
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    ตรวจสอบรายละเอียดก่อนดำเนินการ
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPayment(false)}
                                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                aria-label="ปิด"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Amount */}

                        <div className="px-6 pt-6">
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                                <p className="text-xs font-medium text-slate-500">
                                    จำนวนเงิน
                                </p>

                                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                                    ฿{formatCurrency(displayAmount)}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    โอนเข้าบัญชีบริษัทโดยตรง
                                </p>
                            </div>
                        </div>

                        {/* Payment body */}

                        <div className="px-6 py-5">
                            {transferSubmitted ? (
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                        <Clock3 size={22} />
                                    </div>
                                    <p className="mt-3 font-semibold text-amber-900">แจ้งโอนเงินแล้ว</p>
                                    <p className="mt-1 text-sm leading-5 text-amber-800">
                                        ระบบจะตรวจสอบยอดเงินเข้าบัญชีบริษัทและเพิ่มเครดิต Wallet ให้โดยอัตโนมัติหลังอนุมัติ
                                    </p>
                                    <div className="mt-4 rounded-lg border border-amber-200 bg-white/70 px-3 py-2 text-left text-xs text-amber-900">
                                        สถานะรายการ: <span className="font-semibold">รอตรวจสอบ</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-xl border border-slate-200 bg-white p-4">
                                        <div className="grid grid-cols-7 gap-1">
                                            {Array.from({ length: 49 }).map((_, index) => {
                                                const filled =
                                                    (index * 17 +
                                                        index * index +
                                                        3) %
                                                    5 !==
                                                    0;

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`h-4 w-4 ${filled
                                                                ? 'bg-slate-900'
                                                                : 'bg-white'
                                                            }`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm font-medium text-slate-700">
                                        สแกนเพื่อโอน ฿{formatCurrency(displayAmount)} เข้าบัญชี MyOrder
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        ยอดเงินจะเข้าบัญชีบริษัทโดยตรง
                                    </p>

                                    <div className="mx-auto mt-4 max-w-xs rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs text-slate-600">
                                        <p className="font-semibold text-slate-800">บริษัท MyOrder จำกัด</p>
                                        <p className="mt-1">ธนาคารกสิกรไทย · บัญชีออมทรัพย์</p>
                                        <p className="mt-1 font-mono text-slate-800">123-4-56789-0</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCopy}
                                        className="mx-auto mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckCircle2
                                                    size={14}
                                                    className="text-emerald-600"
                                                />
                                                คัดลอกแล้ว
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={14} />
                                                คัดลอกเลขบัญชี
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal footer */}

                        <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowPayment(false)}
                            >
                                ยกเลิก
                            </Button>

                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={handleConfirmPayment}
                                disabled={transferSubmitted}
                            >
                                {transferSubmitted ? 'รอตรวจสอบยอดโอน' : 'แจ้งโอนแล้ว'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}