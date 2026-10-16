import type { Endpoint } from './types';
import { OP_DOCS, OP_RESPONSES, type DocBlock, type ResponseDoc } from './apiReference';

/**
 * Endpoint ทั้งหมดของ Sandbox — แปลงจาก api-1.json (MyExpress Open API 1.0.0)
 *
 * วิธีใช้: ใน data.ts ให้แทนที่ ENDPOINTS / GROUPS เดิมด้วย
 *   export { ENDPOINTS, GROUPS } from './endpoints';
 * (BASE_URLS, METHOD_STYLE, CLIENT_LIBRARY_LANGUAGES ใช้ของเดิมต่อได้)
 */

/**
 * Endpoint + ข้อมูลเสริมจาก api-1.json
 * - docBlocks: คำอธิบาย/ตาราง request-response ฉบับเต็มของ endpoint
 * - responses: ทุก status code พร้อม header และตัวอย่างทั้งหมด
 */
export type EndpointDoc = Omit<Endpoint, 'bodyExample' | 'successCode' | 'successExample' | 'errors'> & {
    bodyExample?: unknown;
    successCode?: number;
    successExample?: unknown;
    errors: { code: number; name: string; body: unknown }[];
    successResponse?: unknown;
    docBlocks?: DocBlock[];
    responses?: ResponseDoc[];
};

const AUTH_HEADER = {
    key: 'Authorization',
    value: 'Bearer <YOUR_ACCESS_TOKEN>',
    required: true,
};
const JSON_HEADER = { key: 'Content-Type', value: 'application/json', required: true };

const RECEIVER_EXAMPLE = {
    name: 'คุณมายเอ็กซ์เพรส ชลบุรี',
    phoneNumber: '0989392917',
    address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1',
    moo: '1',
    subDistrict: 'หนองขาม',
    district: 'ศรีราชา',
    province: 'ชลบุรี',
    zipCode: '20230',
};

const AUTH_ERROR_401 = {
    code: 401,
    name: 'Unauthorized',
    body: { error: 'invalid_request', error_description: 'The access token is missing' },
};

const BASE_ENDPOINTS: EndpointDoc[] = [
    /* ───────────── Authentication ───────────── */
    {
        id: 'generate-access-token',
        name: 'Generate Access Token',
        group: 'Authentication',
        method: 'POST',
        path: '/v1/auth/oauth2/token',
        summary:
            'ขอ Access Token ด้วย OAuth 2.0 (Client Credentials) — token มีอายุ 7,200 วินาที ใช้เป็น Bearer ในทุก endpoint ที่เหลือ',
        auth: 'none',
        headers: [JSON_HEADER],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: {
            client_id: '<YOUR_CLIENT_ID>',
            client_secret: '<YOUR_CLIENT_SECRET>',
            grant_type: 'client_credentials',
            scope: 'parcel',
        },
        bodyFields: [
            { field: 'client_id', type: 'string', required: true, desc: 'client_id ที่ MyExpress ส่งให้' },
            { field: 'client_secret', type: 'string', required: true, desc: 'client_secret ที่ MyExpress ส่งให้' },
            { field: 'grant_type', type: 'string', required: true, desc: 'ต้องเป็น client_credentials' },
            { field: 'scope', type: 'string', required: true, desc: 'scope ที่ได้รับสิทธิ์ เช่น parcel' },
        ],
        successResponse: { expires_in: 7200, token_type: 'bearer', access_token: '<ACCESS_TOKEN>' },
        errors: [
            {
                code: 400,
                name: 'Bad Request',
                body: { error: 'invalid_client', error_description: 'Invalid client authentication' },
            },
        ],
    },

    /* ───────────── Parcel ───────────── */
    {
        id: 'create-parcel-non-cod',
        name: 'Create Parcel — NON_COD',
        group: 'Parcel',
        method: 'POST',
        path: '/v1/parcel',
        summary: 'สร้างพัสดุประเภท NON_COD (ไม่เก็บเงินปลายทาง) ผ่านไปรษณีย์ไทย ได้เลข tracking กลับมาทันที',
        auth: 'bearer',
        headers: [AUTH_HEADER, JSON_HEADER],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: {
            express: 'THAI_POST',
            sender: {
                name: 'คุณมายเอ็กซ์เพรส ภูเก็ต',
                phoneNumber: '0813150764',
                address: '69/429 หมู่ 2',
                subDistrict: 'วิชิต',
                district: 'เมืองภูเก็ต',
                province: 'ภูเก็ต',
                zipCode: '83000',
            },
            receiver: RECEIVER_EXAMPLE,
            note: '',
            weightGram: 1000,
            isInsured: true,
            insuranceDeclaredValue: 3000,
            insuranceProductPrice: 3000,
        },
        bodyFields: [
            { field: 'express', type: 'string', required: true, desc: 'ชื่อขนส่ง — THAI_POST' },
            { field: 'sender', type: 'object', required: true, desc: 'ข้อมูลผู้ส่ง (name, phoneNumber, address, subDistrict, district, province, zipCode ต้องครบทุกฟิลด์)' },
            { field: 'receiver', type: 'object', required: true, desc: 'ข้อมูลผู้รับ (name, phoneNumber, address, subDistrict, district, province, zipCode)' },
            { field: 'receiver.moo', type: 'string', required: false, desc: 'หมู่ — จำเป็นเมื่อที่อยู่ผู้รับอยู่ในพื้นที่พิเศษที่คิดค่าบริการตามหมู่' },
            { field: 'note', type: 'string', required: false, desc: 'หมายเหตุ' },
            { field: 'weightGram', type: 'number', required: true, desc: 'น้ำหนักพัสดุ (กรัม) อยู่ระหว่าง 10 – 20,000' },
            { field: 'isInsured', type: 'boolean', required: false, desc: 'ประกันพัสดุ — ไม่ต้องการให้ละเว้นหรือส่ง false' },
            { field: 'insuranceDeclaredValue', type: 'number', required: false, desc: 'วงเงินเอาประกัน 0 – 50,000 บาท (จำเป็นเมื่อ isInsured = true)' },
            { field: 'insuranceProductPrice', type: 'number', required: false, desc: 'ราคาสินค้าในกล่อง > 0 (จำเป็นเมื่อ isInsured = true)' },
        ],
        successResponse: {
            message: 'create parcel success',
            data: {
                id: 'cd613f68fd1bb07c3dcb4f4bc78d0c48fcb1c685ff5529055d6f3daa2d05d043OP1728541345897',
                sender: { name: 'คุณมายเอ็กซ์เพรส ภูเก็ต', phoneNumber: '0813150764', province: 'ภูเก็ต', zipCode: '83000' },
                receiver: { name: 'คุณมายเอ็กซ์เพรส ชลบุรี', phoneNumber: '0989392917', province: 'ชลบุรี', zipCode: '20230' },
                shipping: { express: 'THAI_POST', trackingNumber: 'JB056666571TH', weightGram: 1000, statusLog: [] },
                status: 'NEW',
                type: 'NON_COD',
                weightGram: 1000,
                isInsured: true,
                insuranceDeclaredValue: 3000,
                insuranceProductPrice: 3000,
                createdAt: '2024-10-10T06:22:25.897Z',
                updatedAt: '2024-10-10T06:22:27.594Z',
            },
        },
        errors: [
            { code: 400, name: 'น้ำหนักไม่อยู่ในช่วงที่กำหนด', body: { status: 400, message: 'Gram not allow below 10 gram and more 20,000 gram', name: 'BadRequestException' } },
            { code: 400, name: 'ไม่ได้ส่ง sender', body: { status: 400, name: 'Error', message: 'sender require' } },
            { code: 400, name: 'ไม่ได้ส่ง receiver', body: { status: 400, name: 'Error', message: 'receiver require' } },
            { code: 400, name: 'ต้องระบุหมู่ (moo)', body: { status: 400, message: 'receiver.moo is require', name: 'Error' } },
            { code: 400, name: 'วงเงินเอาประกันไม่ถูกต้อง', body: { status: 400, message: 'insuranceDeclaredValue must be a number between 0 and 50,000', name: 'BadRequestException' } },
            AUTH_ERROR_401,
            { code: 403, name: 'Forbidden', body: { name: 'AccountDisableException', message: 'AccountDisableException' } },
        ],
    },
    {
        id: 'create-parcel-cod',
        name: 'Create Parcel — COD',
        group: 'Parcel',
        method: 'POST',
        path: '/v1/parcel',
        summary: 'สร้างพัสดุประเภท COD (เก็บเงินปลายทาง) — ผู้ส่งต้องมีบัญชี COD ที่ผ่านการอนุมัติแล้ว (ดูกลุ่ม Verify COD Account)',
        auth: 'bearer',
        headers: [AUTH_HEADER, JSON_HEADER],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: {
            express: 'THAI_POST',
            sender: { phoneNumber: '0900000000', email: 'test@test.com' },
            receiver: RECEIVER_EXAMPLE,
            note: '',
            weightGram: 1000,
            codEnabled: true,
            codAmount: 100,
            insideBoxDetail: [
                {
                    name: 'อุปกรณ์อิเล็กทรอนิกส์',
                    type: 'กล้อง Canon',
                    size: 'ขนาดเล็ก (S)',
                    color: 'สีดำ (Black)',
                    amount: 1,
                    price: 1,
                    weightGram: 1000,
                },
            ],
            isInsured: true,
            insuranceDeclaredValue: 3000,
        },
        bodyFields: [
            { field: 'express', type: 'string', required: true, desc: 'ชื่อขนส่ง — THAI_POST' },
            { field: 'sender.phoneNumber', type: 'string', required: true, desc: 'เบอร์โทรของบัญชี COD ที่ลงทะเบียน (9–10 หลัก)' },
            { field: 'sender.email', type: 'string', required: true, desc: 'อีเมลของบัญชี COD ที่ลงทะเบียน' },
            { field: 'receiver', type: 'object', required: true, desc: 'ข้อมูลผู้รับ (name, phoneNumber, address, subDistrict, district, province, zipCode)' },
            { field: 'receiver.moo', type: 'string', required: false, desc: 'หมู่ — จำเป็นเมื่อที่อยู่ผู้รับอยู่ในพื้นที่พิเศษ' },
            { field: 'weightGram', type: 'number', required: true, desc: 'น้ำหนักพัสดุ (กรัม) 10 – 20,000' },
            { field: 'codEnabled', type: 'boolean', required: true, desc: 'ต้องเป็น true สำหรับพัสดุ COD' },
            { field: 'codAmount', type: 'number', required: true, desc: 'มูลค่า COD (บาท) > 0 ทศนิยมไม่เกิน 2 ตำแหน่ง' },
            { field: 'insideBoxDetail', type: 'object[]', required: true, desc: 'รายการสิ่งของในกล่อง 1 – 30 รายการ (name, type, size, color, amount, price, weightGram — ทุกฟิลด์จำเป็น, type ใส่ "-" ได้)' },
            { field: 'isInsured', type: 'boolean', required: false, desc: 'ประกันพัสดุ' },
            { field: 'insuranceDeclaredValue', type: 'number', required: false, desc: 'วงเงินเอาประกัน 0 – 50,000 (จำเป็นเมื่อ isInsured = true)' },
        ],
        successResponse: {
            message: 'create parcel success',
            data: {
                id: 'cd613f68fd1bb07c3dcb4f4bc78d0c48fcb1c685ff5529055d6f3daa2d05d043OP1728541345897',
                shipping: { express: 'THAI_POST', trackingNumber: 'JA056666571TH', weightGram: 1000, statusLog: [] },
                status: 'NEW',
                type: 'COD',
                weightGram: 1000,
                codEnabled: true,
                codAmount: 100,
                codFee: 1.3,
                codFeeVat: 0.09,
                isInsured: true,
                insuranceDeclaredValue: 3000,
                createdAt: '2024-10-10T06:22:25.897Z',
                updatedAt: '2024-10-10T06:22:27.594Z',
            },
        },
        errors: [
            { code: 400, name: 'บัญชี COD ยังไม่ได้รับอนุมัติ', body: { status: 400, message: 'senderCOD phoneNumber 0810000000 is currently pending approval or has not been approved', name: 'SenderCODNotApproveException' } },
            { code: 400, name: 'codAmount ไม่ถูกต้อง', body: { status: 400, message: 'not found codAmount or codAmount less than 1', name: 'CODAmountInvalidException' } },
            { code: 400, name: 'ไม่มี insideBoxDetail', body: { status: 400, message: 'cannot create parcel cod because not found insideBoxDetail or length equal 0', name: 'InsideBoxDetailNotCorrectException' } },
            { code: 400, name: 'เบอร์ผู้ส่งไม่ถูกต้อง', body: { status: 400, message: 'not found sender.phoneNumber or invalid length', name: 'SenderPhoneNumberInvalidException' } },
            { code: 400, name: 'อีเมลผู้ส่งไม่ถูกต้อง', body: { status: 400, message: 'not found sender.email or invalid format', name: 'SenderEmailInvalidException' } },
            { code: 400, name: 'ใช้ weightKg แทน weightGram', body: { status: 400, message: 'weightKg not allow. Please use weightGram', name: 'BadRequestException' } },
            AUTH_ERROR_401,
            { code: 404, name: 'ไม่พบบัญชี COD', body: { status: 404, message: 'not found senderCOD with phoneNumber 0820000000', name: 'SenderCODNotFoundException' } },
        ],
    },
    {
        id: 'get-parcel',
        name: 'Get Parcel (Tracking)',
        group: 'Parcel',
        method: 'POST',
        path: '/v1/parcel/tracking',
        summary: 'ค้นหาพัสดุและสถานะล่าสุดจากเลข tracking (สูงสุด 20 เลขต่อครั้ง)',
        auth: 'bearer',
        headers: [AUTH_HEADER, JSON_HEADER],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: {
            express: 'THAI_POST',
            trackingNumbers: ['JB052917036TH', 'JB050236582TH', 'JB012345678TH'],
        },
        bodyFields: [
            { field: 'express', type: 'string', required: true, desc: 'ชื่อขนส่ง — THAI_POST' },
            { field: 'trackingNumbers', type: 'string[]', required: true, desc: 'รายการเลข tracking (1 – 20 รายการ)' },
        ],
        successResponse: {
            notFoundTrackingNumbers: ['JB012345678TH'],
            express: 'THAI_POST',
            data: [
                {
                    id: '1211c0bccc0142404df1274999e94d0144c3eadc181bb95ee01cfb61ea46e7e1OP1723622204784',
                    shipping: { express: 'THAI_POST', trackingNumber: 'JB052917036TH', weightGram: 1000, statusLog: [] },
                    status: 'NEW',
                    type: 'NON_COD',
                    weightGram: 1000,
                    createdAt: '2024-08-14T07:56:44.783Z',
                    updatedAt: '2024-08-14T07:56:44.957Z',
                },
                {
                    id: 'dbd61e125fcbca1f297139feeed8e60812a33b5973426e3c54edbd27dfd0fd61OP1722422793562',
                    shipping: {
                        express: 'THAI_POST',
                        trackingNumber: 'JB050236582TH',
                        weightGram: 1000,
                        statusLog: [
                            { code: '1', timestamp: '2024-08-07T10:00:19.000Z', message: 'รับฝาก', isReturn: false, weightGram: 1000, trackingNumber: 'JB050236582TH' },
                        ],
                    },
                    status: 'PICKUPED',
                    type: 'NON_COD',
                    weightGram: 1000,
                    createdAt: '2024-07-31T10:46:33.562Z',
                    updatedAt: '2024-08-15T06:37:18.433Z',
                },
            ],
        },
        errors: [
            { code: 400, name: 'ไม่ได้ระบุ express', body: { status: 400, message: 'Express name: undefined is not allow. Please change to express that you can accept.', name: 'BadRequestException' } },
            { code: 400, name: 'เกินจำนวน tracking ที่กำหนด', body: { status: 400, message: 'Tracking numbers must be require. Tracking numbers must have a limit of 20.', name: 'BadRequestException' } },
            AUTH_ERROR_401,
        ],
    },
    {
        id: 'delete-parcel',
        name: 'Delete Parcel',
        group: 'Parcel',
        method: 'DELETE',
        path: '/v1/parcel/{parcelId}',
        summary: 'ลบ (ยกเลิก) พัสดุด้วย parcel id ที่ได้จากการสร้างพัสดุ',
        auth: 'bearer',
        headers: [AUTH_HEADER],
        pathParams: [
            {
                key: 'parcelId',
                example: 'cd613f68fd1bb07c3dcb4f4bc78d0c48fcb1c685ff5529055d6f3daa2d05d043OP1728541345897',
                desc: 'parcel id (field "id") จาก response ของ Create Parcel',
            },
        ],
        queryParams: [],
        bodyType: 'none',
        bodyFields: [],
        successResponse: {
            message: 'delete parcelNumber: cd613f68fd1bb07c3dcb4f4bc78d0c48fcb1c685ff5529055d6f3daa2d05d043OP1728541345897 success',
        },
        errors: [
            { code: 404, name: 'ไม่พบพัสดุ', body: { status: 404, message: 'Parcel with refId=[1721804390165] not found', name: 'NotFoundException' } },
            AUTH_ERROR_401,
        ],
    },
    {
        id: 'check-payment-status',
        name: 'Check Payment Status (COD)',
        group: 'Parcel',
        method: 'GET',
        path: '/v1/parcel/payment-status',
        summary: 'ตรวจสอบสถานะการโอนเงิน COD และต้นทุนค่าส่งของพัสดุ',
        auth: 'bearer',
        headers: [AUTH_HEADER],
        pathParams: [],
        queryParams: [
            { key: 'trackingNumber', example: 'JA056666695TH', required: true, desc: 'เลขพัสดุ' },
        ],
        bodyType: 'none',
        bodyFields: [],
        successResponse: {
            trackingNumber: 'JA056666695TH',
            codTransferStatus: 'TRANSFERRED',
            codTransferDate: '2024-10-21',
            shippingCost: {
                totalAmount: 18.391,
                shippingCost: 17,
                codAmount: 100,
                codFee: 1.3,
                codVat: 0.091,
                specialAreaCost: 0,
            },
        },
        errors: [
            { code: 404, name: 'ไม่พบเลขพัสดุ', body: { status: 404, message: 'trackingNumber=[JA000000000TH] not found', name: 'NotFoundException' } },
            AUTH_ERROR_401,
        ],
    },

    /* ───────────── Webhook ───────────── */
    {
        id: 'simulate-thaipost-webhook',
        name: 'Simulate Thaipost Webhook',
        group: 'Webhook',
        method: 'POST',
        path: '/v1/simulate/thaipost/webhook',
        summary:
            'จำลองการส่งสถานะพัสดุจากไปรษณีย์ไทย เพื่อทดสอบว่า webhook ของท่านรับ-ตอบกลับได้ถูกต้อง (ต้องตอบ HTTP 200 มิฉะนั้นระบบจะส่งซ้ำไม่เกิน 5 ครั้ง)',
        auth: 'bearer',
        headers: [AUTH_HEADER, JSON_HEADER],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: [
            {
                barcode: 'JB084325131TH',
                weight: 1000,
                cod: 'no',
                status: '2',
                statusDescription: 'ปณ.ต้นทางรับฝากแล้ว',
                statusDate: '17/09/2024 16:27:19',
                stationPostcode: '20230',
                station: 'ศรีราชา/ชลบุรี',
                receiverName: '',
                latitude: '',
                longtitude: '',
                signature: '',
            },
        ],
        bodyFields: [
            { field: 'barcode', type: 'string', required: true, desc: 'เลข tracking จากขนส่ง' },
            { field: 'weight', type: 'number', required: true, desc: 'น้ำหนัก (กรัม) เช่น 1000' },
            { field: 'cod', type: 'string', required: true, desc: 'พัสดุ COD: "yes" หรือ "no"' },
            { field: 'status', type: 'string', required: true, desc: 'status code จากขนส่ง เช่น 2 = ปณ.ต้นทางรับฝากแล้ว, 4 = นำจ่ายถึงผู้รับแล้ว, 9 = นำจ่าย/ชำระเงินเรียบร้อย' },
            { field: 'statusDescription', type: 'string', required: true, desc: 'คำอธิบายสถานะจากขนส่ง' },
            { field: 'statusDate', type: 'string', required: true, desc: 'วัน-เวลาของสถานะ dd/MM/yyyy HH:mm:ss — ต้องมากกว่าวันที่สร้างพัสดุ' },
            { field: 'stationPostcode', type: 'string', required: true, desc: 'รหัสไปรษณีย์ที่ทำการ เช่น 10160' },
            { field: 'station', type: 'string', required: true, desc: 'ที่ทำการไปรษณีย์ เช่น ภาษีเจริญ/กรุงเทพฯ' },
            { field: 'receiverName', type: 'string', required: true, desc: 'ชื่อผู้รับ (ถ้าไม่มีใส่ "")' },
            { field: 'latitude', type: 'string', required: true, desc: 'ละติจูดที่ทำการ (ถ้าไม่มีใส่ "")' },
            { field: 'longtitude', type: 'string', required: true, desc: 'ลองติจูดที่ทำการ (ถ้าไม่มีใส่ "") — สะกดตามเอกสารต้นฉบับ' },
            { field: 'signature', type: 'string', required: true, desc: 'ลายเซ็นผู้รับ (ถ้าไม่มีใส่ "")' },
        ],
        successResponse: { errorCode: '000', errorDetail: 'success', status: 'true' },
        errors: [AUTH_ERROR_401],
    },

    /* ───────────── Print Label ───────────── */
    {
        id: 'print-label',
        name: 'Print Label',
        group: 'Print Label',
        method: 'POST',
        path: '/v1/print-label',
        summary: 'สร้างไฟล์ PDF ใบลาเบลจากรายการ parcel id (ไม่เกิน 20 รายการ) — response เป็นไฟล์ PDF แบบ blob',
        auth: 'bearer',
        headers: [AUTH_HEADER, JSON_HEADER],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: {
            size: 'TSC_100_75',
            parcelIds: ['7b50a746b657a0c5e96ba46888afe37b2389be97c298e3774f64fcfd9f9a575fOP1723535199935'],
        },
        bodyFields: [
            { field: 'size', type: 'string', required: true, desc: 'ขนาดลาเบล: TSC_100_75, TSC_100_100, TSC_100_150, TSC_100_180, MINI_57_100' },
            { field: 'parcelIds', type: 'string[]', required: true, desc: 'รายการ parcel id (1 – 20 รายการ)' },
        ],
        successResponse: {
            note: 'ของจริงจะคืนไฟล์ PDF (Content-Type: application/pdf, Content-Disposition: attachment;filename={timestamp}.pdf)',
        },
        errors: [
            { code: 400, name: 'จำนวน parcel id ไม่ถูกต้อง', body: { status: 400, message: 'The number of parcel IDs must be greater than 0 and not exceed the limit of 20. Please adjust the number of parcel IDs and try again.', name: 'BadRequestException' } },
            { code: 404, name: 'ไม่พบพัสดุ', body: { status: 404, message: 'No parcels found for the given reference IDs with this account.', name: 'NotFoundException' } },
            AUTH_ERROR_401,
        ],
    },

    /* ───────────── Verify COD Account ───────────── */
    {
        id: 'upload-image-file',
        name: 'Upload Image by File',
        group: 'Verify COD Account',
        method: 'POST',
        path: '/v1/account/sender-cod/image',
        summary:
            'อัปโหลดรูปเอกสารยืนยันตัวตนบัญชี COD (multipart/form-data, png/jpg ไม่เกิน 20 MB, ครั้งละ 1 ไฟล์) — ใน Sandbox จำลองด้วย JSON',
        auth: 'bearer',
        headers: [AUTH_HEADER, { key: 'Content-Type', value: 'multipart/form-data', required: true }],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: { file: 'sample.png', type: 'BOOKBANK' },
        bodyFields: [
            { field: 'file', type: 'file', required: true, desc: 'ไฟล์รูป png / jpg ขนาดไม่เกิน 20 MB' },
            { field: 'type', type: 'string', required: true, desc: 'BOOKBANK, ID_CARD, PERSON_ID_CARD (บุคคลธรรมดา) หรือ CERTIFICATE (นิติบุคคล)' },
        ],
        successResponse: {
            directory: 'mxp-bookbank-cod-image/mxp-bookbank-cod-image/xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png',
        },
        errors: [
            { code: 400, name: 'ไม่ได้แนบไฟล์', body: { status: 400, message: 'File is required.', name: 'BadRequestException' } },
            { code: 400, name: 'ไม่ได้ระบุ type', body: { status: 400, message: 'Type is required.', name: 'BadRequestException' } },
            { code: 400, name: 'type ไม่ถูกต้อง', body: { status: 400, message: 'Invalid type.', name: 'BadRequestException' } },
            { code: 400, name: 'อัปโหลดหลายไฟล์', body: { status: 400, message: 'You can upload only one file.', name: 'BadRequestException' } },
        ],
    },
    {
        id: 'upload-image-url',
        name: 'Upload Image by URL',
        group: 'Verify COD Account',
        method: 'POST',
        path: '/v1/account/sender-cod/image-from-url',
        summary: 'อัปโหลดรูปเอกสารยืนยันตัวตนจาก Public URL — คืนค่า directory เพื่อนำไปใช้ตอนสร้างบัญชี COD',
        auth: 'bearer',
        headers: [AUTH_HEADER, JSON_HEADER],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: { url: 'https://example.com/id-card.png', type: 'ID_CARD' },
        bodyFields: [
            { field: 'url', type: 'string', required: true, desc: 'Public URL ของรูปภาพ (png / jpg)' },
            { field: 'type', type: 'string', required: true, desc: 'BOOKBANK, ID_CARD, PERSON_ID_CARD หรือ CERTIFICATE' },
        ],
        successResponse: {
            directory: 'beta-mxp-identification-cod-image/mxp-identification-cod-image/idCard_669f693984d21500143eb80a_1728763660035.jpg',
        },
        errors: [
            { code: 400, name: 'ไม่ได้ระบุ url', body: { status: 400, message: 'Url is required.', name: 'BadRequestException' } },
            { code: 400, name: 'ดาวน์โหลดรูปไม่สำเร็จ', body: { status: 400, message: 'Failed to download file from URL: Request failed with status code 403', name: 'BadRequestException' } },
            { code: 400, name: 'type ไม่ถูกต้อง', body: { status: 400, message: 'Invalid type.', name: 'BadRequestException' } },
        ],
    },
    {
        id: 'get-image-file',
        name: 'Get Image File',
        group: 'Verify COD Account',
        method: 'POST',
        path: '/v1/account/sender-cod/image/view',
        summary: 'ดึงไฟล์รูปที่เคยอัปโหลดจาก directory — response เป็นไฟล์รูปภาพ',
        auth: 'bearer',
        headers: [AUTH_HEADER, JSON_HEADER],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: {
            directory: 'beta-mxp-identification-cod-image/mxp-identification-cod-image/idCard_669f693984d21500143eb80a_1728763660035.jpg',
            type: 'ID_CARD',
        },
        bodyFields: [
            { field: 'directory', type: 'string', required: true, desc: 'ที่อยู่ไฟล์ที่ได้จาก Upload Image' },
            { field: 'type', type: 'string', required: true, desc: 'BOOKBANK, ID_CARD, PERSON_ID_CARD หรือ CERTIFICATE' },
        ],
        successResponse: { note: 'ของจริงจะคืนไฟล์รูปภาพ (image file)' },
        errors: [AUTH_ERROR_401],
    },
    {
        id: 'create-sender-cod',
        name: 'Create Sender COD',
        group: 'Verify COD Account',
        method: 'POST',
        path: '/v1/account/sender-cod',
        summary: 'ลงทะเบียนบัญชีผู้ส่ง COD (บุคคลธรรมดา / นิติบุคคล) — ต้องอัปโหลดรูปก่อน แล้วนำ directory มาใส่ฟิลด์รูปภาพ',
        auth: 'bearer',
        headers: [AUTH_HEADER, JSON_HEADER],
        pathParams: [],
        queryParams: [],
        bodyType: 'json',
        bodyExample: {
            bankAccount: {
                bankInitial: 'KBANK',
                holderName: 'Test',
                number: '0000000000',
                bookBankImage: 'mxp-bookbank-cod-image/mxp-bookbank-cod-image/1707213724144.png',
            },
            identification: {
                number: '1111111111111',
                image: 'mxp-identification-cod-image/mxp-identification-cod-image/idCard_1707213724148.png',
                selfPicture: 'mxp-identification-cod-image/mxp-identification-cod-image/PersonIdCard_1707213724149.png',
                type: 'PERSON',
            },
            name: 'Test',
            phoneNumber: '0900000000',
            email: 'test@test.com',
            address: '99/9',
            subDistrict: 'เกาะขวาง',
            district: 'เมืองจันทบุรี',
            province: 'จันทบุรี',
            zipCode: '22000',
        },
        bodyFields: [
            { field: 'bankAccount.bankInitial', type: 'string', required: true, desc: 'KBANK, SCB, BBL, KTB, TMB, BAY' },
            { field: 'bankAccount.holderName', type: 'string', required: true, desc: 'ชื่อบนสมุดบัญชี' },
            { field: 'bankAccount.number', type: 'string', required: true, desc: 'เลขบัญชีธนาคาร' },
            { field: 'bankAccount.bookBankImage', type: 'string', required: true, desc: 'directory ของรูปหน้าสมุดบัญชี (จาก Upload Image)' },
            { field: 'identification.number', type: 'string', required: true, desc: 'เลขบัตรประชาชน / เลขนิติบุคคล' },
            { field: 'identification.image', type: 'string', required: true, desc: 'directory รูปบัตรประชาชน หรือหนังสือรับรองบริษัท' },
            { field: 'identification.selfPicture', type: 'string', required: false, desc: 'directory รูปถ่ายคู่บัตร — จำเป็นเมื่อ type = PERSON' },
            { field: 'identification.type', type: 'string', required: true, desc: 'PERSON (บุคคลธรรมดา) หรือ LEGAL_ENTITY (นิติบุคคล)' },
            { field: 'name', type: 'string', required: true, desc: 'ชื่อผู้ส่ง' },
            { field: 'phoneNumber', type: 'string', required: true, desc: 'เบอร์โทรผู้ส่ง' },
            { field: 'email', type: 'string', required: true, desc: 'อีเมลผู้ส่ง' },
            { field: 'address / subDistrict / district / province / zipCode', type: 'string', required: true, desc: 'ที่อยู่ผู้ส่ง (แต่ละฟิลด์เป็นฟิลด์แยกกัน)' },
        ],
        successResponse: {
            message: 'create sender cod success',
            data: {
                bankAccount: { bankFullName: 'ธนาคารกสิกรไทย (KBANK)', bankInitial: 'KBANK', holderName: 'Test', number: '0000000000' },
                approval: 'PENDING',
                updateApprovalDate: '2024-10-09 06:07:06',
                name: 'Test',
                phoneNumber: '0900000000',
                email: 'test@test.com',
            },
        },
        errors: [
            { code: 400, name: 'bankInitial ไม่ถูกต้อง', body: { status: 400, message: 'bankInitial has wrong format. Please recheck bankInitial again.', name: 'BadRequestException' } },
            { code: 400, name: 'type ไม่ถูกต้อง', body: { status: 400, message: 'Invalid Type.', name: 'BadRequestException' } },
            { code: 400, name: 'บุคคลธรรมดาไม่แนบรูปคู่บัตร', body: { status: 400, message: 'Self picture is required for PERSON type', name: 'BadRequestException' } },
            { code: 400, name: 'ข้อมูลไม่ถูกต้อง', body: { status: 400, message: 'Invalid input. Please review your details and try again.', name: 'BadRequestException' } },
        ],
    },
    {
        id: 'get-sender-cod',
        name: 'Get Sender COD',
        group: 'Verify COD Account',
        method: 'GET',
        path: '/v1/account/sender-cod',
        summary: 'ค้นหาบัญชีผู้ส่ง COD และสถานะการอนุมัติ (PENDING / APPROVED / NOT_APPROVED) ด้วย email หรือเบอร์โทร อย่างน้อย 1 อย่าง',
        auth: 'bearer',
        headers: [AUTH_HEADER],
        pathParams: [],
        queryParams: [
            { key: 'email', example: 'test@example.com', required: false, desc: 'อีเมลผู้ส่ง COD (ต้องเป็นรูปแบบอีเมลที่ถูกต้อง)' },
            { key: 'phoneNumber', example: '0989392917', required: false, desc: 'เบอร์โทรผู้ส่ง COD (10 หลัก)' },
        ],
        bodyType: 'none',
        bodyFields: [],
        successResponse: {
            data: [
                {
                    bankAccount: { bankFullName: 'ธนาคารกสิกรไทย (KBANK)', bankInitial: 'KBANK', holderName: 'มายเอกซ์เพลส น่ารัก', number: '00000000011' },
                    approval: 'APPROVED',
                    updateApprovalDate: '2024-10-08 23:08:18',
                    note: '',
                    name: 'มายเอกซ์เพลส น่ารัก',
                    phoneNumber: '0989392917',
                    email: 'myexpress.international@gmail.com',
                },
            ],
        },
        errors: [
            { code: 400, name: 'ไม่ได้ระบุ email/เบอร์โทร', body: { status: 400, message: 'Phone number or email not found.', name: 'BadRequestException' } },
            { code: 400, name: 'รูปแบบอีเมลไม่ถูกต้อง', body: { status: 400, message: 'Invalid email format', name: 'BadRequestException' } },
            { code: 404, name: 'ไม่พบบัญชี COD', body: { status: 404, message: 'COD Account Not Found', name: 'NotFoundException' } },
        ],
    },
];

/** ผสานข้อมูลฉบับเต็มจาก api-1.json (apiReference.ts) เข้าแต่ละ endpoint */
export const ENDPOINTS: EndpointDoc[] = BASE_ENDPOINTS.map((ep) => {
    const responses = OP_RESPONSES[ep.id] ?? [];
    const errors = responses
        .filter((r) => /^[45]\d\d$/.test(r.code))
        .flatMap((r) =>
            r.examples.map((e, i) => ({
                code: Number(r.code),
                name: e.name || (i === 0 ? r.description : `${r.description} (${i + 1})`),
                body: e.body,
            })),
        );
    return {
        ...ep,
        docBlocks: OP_DOCS[ep.id],
        responses,
        errors: errors.length > 0 ? errors : ep.errors,
    };
});

const GROUP_ORDER = ['Authentication', 'Parcel', 'Webhook', 'Print Label', 'Verify COD Account'];

export const GROUPS: { label: string; items: EndpointDoc[] }[] = GROUP_ORDER.map((label) => ({
    label,
    items: ENDPOINTS.filter((e) => e.group === label),
}));