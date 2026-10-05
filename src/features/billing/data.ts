import type { BillingDocument, BillingHistoryItem, Payment } from './types';
export type { BillingDocument, BillingHistoryItem, HistoryRange, Language, Payment } from './types';

export const NAV_LINKS = [
    { to: '/docs', label: 'API Docs' },
    { to: '/sandbox', label: 'Sandbox' },
    { to: '/production', label: 'Production' },
    { to: '/webhook', label: 'Webhook' },
    { to: '/billing', label: 'Billing' },
];

// เปลี่ยนเป็น 14 สำหรับลูกค้าที่มี Credit Term 14 วัน
export const CREDIT_TERM_DAYS = 30;

export const BILLING_PERIOD_START = '1 Sep 2026';
export const BILLING_PERIOD_END = '30 Sep 2026';

export const BILLING_HISTORY_DEMO: BillingHistoryItem[] = [
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

export const BILLING_DOCUMENTS_DEMO: BillingDocument[] = [
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

export const PAYMENTS_DEMO: Payment[] = [
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

export const translations = {
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
        logoutError: 'ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง',
        documentUnavailable: 'ยังเปิดหรือดาวน์โหลดเอกสารจริงไม่ได้ จนกว่าจะเชื่อมต่อ Billing API',

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
        logoutError: 'Could not log out. Please try again.',
        documentUnavailable: 'Real document preview and download are unavailable until the Billing API is connected.',

        opening: 'Opening document',
        downloading: 'Downloading',
    },
} as const;
