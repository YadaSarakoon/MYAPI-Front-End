import { useMemo, useState, type ReactNode } from 'react';
import logo from '../assets/logo.png';

/* ============================================================
   TYPES
   ============================================================ */

type Method = 'GET' | 'POST' | 'DELETE';
type Env = 'test' | 'prod';
type BodyType = 'json' | 'formdata' | 'none';
type AuthType = 'none' | 'bearer';
type ClientLibraryLanguage =
  | 'C# - HttpClient' | 'C# - RestSharp' | 'cURL - cURL' | 'Dart - http' | 'Go - Native'
  | 'HTTP - HTTP' | 'Java - OkHttp' | 'Java - Unirest' | 'JavaScript - Fetch'
  | 'JavaScript - jQuery' | 'JavaScript - XHR' | 'C - libcurl' | 'NodeJs - Axios'
  | 'NodeJs - Native' | 'NodeJs - Request' | 'NodeJs - Unirest' | 'Objective-C - NSURLSession'
  | 'OCaml - Cohttp' | 'PHP - cURL' | 'PHP - Guzzle' | 'PHP - HTTP_Request2' | 'PHP - pecl_http'
  | 'PowerShell - RestMethod' | 'Python - http.client' | 'Python - Requests' | 'R - httr' | 'R - RCurl';
type DocsPage = 'overview' | 'docs';

interface HeaderItem {
  key: string;
  value: string;
  required?: boolean;
}

interface PathParam {
  key: string;
  example: string;
  desc: string;
}

interface QueryParam {
  key: string;
  example: string;
  required?: boolean;
  desc: string;
}

interface BodyField {
  field: string;
  type: string;
  required?: boolean;
  desc: string;
}

interface ErrorItem {
  code: number;
  name: string;
  body: Record<string, unknown>;
}

interface Endpoint {
  id: string;
  group: string;
  name: string;
  method: Method;
  path: string;
  summary: string;
  auth: AuthType;
  headers: HeaderItem[];
  pathParams: PathParam[];
  queryParams: QueryParam[];
  bodyType: BodyType;
  bodyFields: BodyField[];
  bodyExample: unknown;
  successCode: number;
  successExample: unknown;
  errors: ErrorItem[];
}

type StringMap = Record<string, string>;

interface SandboxCredentials {
  clientId: string;
  clientSecret: string;
  createdAt: string;
}

type ApiResponseState =
  | { loading: true }
  | { loading?: false; status: number; ms: number; body: unknown; demo?: boolean }
  | null;

/* ============================================================
   CONSTANTS — same design language as the API Docs page
   ============================================================ */

const BASE_URLS: Record<Env, string> = {
  test: 'https://dev-open-api.myexpress.ai',
  prod: 'https://open-api.myexpress.ai',
};

const METHOD_STYLE: Record<
  Method,
  { text: string; bg: string; border: string; solid: string }
> = {
  GET: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', solid: 'bg-emerald-600' },
  POST: { text: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200', solid: 'bg-indigo-600' },
  DELETE: { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', solid: 'bg-rose-600' },
};

const CLIENT_LIBRARY_LANGUAGES: ClientLibraryLanguage[] = [
  'C# - HttpClient', 'C# - RestSharp', 'cURL - cURL', 'Dart - http', 'Go - Native',
  'HTTP - HTTP', 'Java - OkHttp', 'Java - Unirest', 'JavaScript - Fetch',
  'JavaScript - jQuery', 'JavaScript - XHR', 'C - libcurl', 'NodeJs - Axios',
  'NodeJs - Native', 'NodeJs - Request', 'NodeJs - Unirest', 'Objective-C - NSURLSession',
  'OCaml - Cohttp', 'PHP - cURL', 'PHP - Guzzle', 'PHP - HTTP_Request2', 'PHP - pecl_http',
  'PowerShell - RestMethod', 'Python - http.client', 'Python - Requests', 'R - httr', 'R - RCurl',
];

const GROUP_ORDER = ['Authentication', 'Parcel', 'Webhook', 'Print Label', 'Verify COD Account'] as const;

/* ============================================================
   DATA — extracted from MyExpress Open API Postman collection
   ============================================================ */

const ENDPOINTS: Endpoint[] = [
  {
    id: 'generate-access-token',
    group: 'Authentication',
    name: 'Generate Access Token',
    method: 'POST',
    path: '/v1/auth/oauth2/token',
    summary: 'แลก client_id / client_secret เป็น access_token สำหรับเรียก API อื่น ๆ',
    auth: 'none',
    headers: [{ key: 'Content-Type', value: 'application/json', required: true }],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'client_id', type: 'String', required: true, desc: 'client_id ที่ได้รับจากระบบ MyAPI' },
      { field: 'client_secret', type: 'String', required: true, desc: 'client_secret ที่ได้รับจากระบบ MyAPI' },
      { field: 'grant_type', type: 'String', required: true, desc: 'ค่าคงที่ = client_credentials' },
      { field: 'scope', type: 'String', required: true, desc: 'ขอบเขตการเข้าถึง เช่น parcel' },
    ],
    bodyExample: {
      client_id: 'maF8xqVVCnz0Z4mgXQnvuWHHddC33RN7',
      client_secret: 'fQbMMUd3EcP9HjTaakrxvWjugMuuremA',
      grant_type: 'client_credentials',
      scope: 'parcel',
    },
    successCode: 200,
    successExample: { expires_in: 7200, token_type: 'bearer', access_token: 'Zznl0qTp3p75ceFIntT1XXQcVS44ZCl3' },
    errors: [
      { code: 400, name: 'invalid_client', body: { error: 'invalid_client', error_description: 'Invalid client authentication' } },
    ],
  },
  {
    id: 'create-parcel-non-cod',
    group: 'Parcel',
    name: 'Create Parcel — NON_COD',
    method: 'POST',
    path: '/v1/parcel',
    summary: 'สร้างเลขพัสดุประเภทไม่เก็บเงินปลายทาง (NON_COD)',
    auth: 'bearer',
    headers: [
      { key: 'Authorization', value: 'Bearer {access_token}', required: true },
      { key: 'Content-Type', value: 'application/json', required: true },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'express', type: 'String', required: true, desc: 'ชื่อขนส่ง — "THAI_POST"' },
      { field: 'sender', type: 'Object', required: true, desc: 'ข้อมูลผู้ส่ง (name, phoneNumber, address, subDistrict, district, province, zipCode)' },
      { field: 'receiver', type: 'Object', required: true, desc: 'ข้อมูลผู้รับ (โครงสร้างเดียวกับ sender)' },
      { field: 'note', type: 'String', required: false, desc: 'หมายเหตุ' },
      { field: 'weightGram', type: 'Number', required: true, desc: 'น้ำหนักพัสดุ (10–20,000 กรัม)' },
      { field: 'isInsured', type: 'Boolean', required: false, desc: 'ต้องการประกันพัสดุหรือไม่' },
      { field: 'insuranceDeclaredValue', type: 'Number', required: false, desc: 'วงเงินเอาประกัน (0–50,000) เมื่อ isInsured = true' },
      { field: 'insuranceProductPrice', type: 'Number', required: false, desc: 'ราคาสินค้าภายในกล่อง เมื่อ isInsured = true' },
    ],
    bodyExample: {
      express: 'THAI_POST',
      sender: { name: 'คุณมายเอ็กซ์เพรส ภูเก็ต', phoneNumber: '0813150764', address: '69/429 หมู่ 2', subDistrict: 'วิชิต', district: 'เมืองภูเก็ต', province: 'ภูเก็ต', zipCode: '83000' },
      receiver: { name: 'คุณมายเอ็กซ์เพรส ชลบุรี', phoneNumber: '0989392917', address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1', subDistrict: 'หนองขาม', district: 'ศรีราชา', province: 'ชลบุรี', zipCode: '20230' },
      note: '',
      weightGram: 1000,
      isInsured: true,
      insuranceDeclaredValue: 3000,
      insuranceProductPrice: 3000,
    },
    successCode: 200,
    successExample: {
      message: 'create parcel success',
      data: {
        note: '', id: '8a88a0acb0ff10fb526cb3de97f7c1681e8cc488...OP1721804390165',
        sender: { name: 'คุณมายเอ็กซ์เพรส ภูเก็ต', phoneNumber: '0813150764', address: '69/429 หมู่ 2', subDistrict: 'วิชิต', district: 'เมืองภูเก็ต', province: 'ภูเก็ต', zipCode: '83000' },
        receiver: { name: 'คุณมายเอ็กซ์เพรส ชลบุรี', phoneNumber: '0989392917', address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1', subDistrict: 'หนองขาม', district: 'ศรีราชา', province: 'ชลบุรี', zipCode: '20230' },
        shipping: { express: 'THAI_POST', statusLog: [], trackingNumber: 'JB048855193TH', weightGram: 1000 },
        status: 'NEW', type: 'NON_COD', createdAt: '2024-07-24T06:59:50.165Z', updatedAt: '2024-07-24T06:59:50.564Z',
        weightGram: 1000, isInsured: true, insuranceDeclaredValue: 3500, insuranceProductPrice: 3000,
      },
    },
    errors: [{ code: 400, name: 'BadRequestException', body: { status: 400, message: 'Express name: undefined is not allow.', name: 'BadRequestException' } }],
  },
  {
    id: 'create-parcel-cod',
    group: 'Parcel',
    name: 'Create Parcel — COD',
    method: 'POST',
    path: '/v1/parcel',
    summary: 'สร้างเลขพัสดุประเภทเก็บเงินปลายทาง (COD)',
    auth: 'bearer',
    headers: [
      { key: 'Authorization', value: 'Bearer {access_token}', required: true },
      { key: 'Content-Type', value: 'application/json', required: true },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'express', type: 'String', required: true, desc: 'ชื่อขนส่ง — "THAI_POST"' },
      { field: 'sender.phoneNumber', type: 'String', required: true, desc: 'เบอร์โทรของบัญชี COD ที่ลงทะเบียน (9–10 หลัก)' },
      { field: 'sender.email', type: 'String', required: true, desc: 'อีเมลของบัญชี COD ที่ลงทะเบียน' },
      { field: 'receiver', type: 'Object', required: true, desc: 'ข้อมูลผู้รับ' },
      { field: 'weightGram', type: 'Number', required: true, desc: 'น้ำหนักพัสดุ (10–20,000 กรัม)' },
      { field: 'codEnabled', type: 'Boolean', required: true, desc: 'ระบุว่าเป็นพัสดุ COD' },
      { field: 'codAmount', type: 'Number', required: true, desc: 'มูลค่า COD หน่วยบาท (> 0)' },
      { field: 'insideBoxDetail', type: 'Object[]', required: true, desc: 'รายการสิ่งของภายในกล่อง (1–30 รายการ)' },
      { field: 'isInsured', type: 'Boolean', required: false, desc: 'ต้องการประกันพัสดุหรือไม่' },
      { field: 'insuranceDeclaredValue', type: 'Number', required: false, desc: 'วงเงินเอาประกัน เมื่อ isInsured = true' },
    ],
    bodyExample: {
      express: 'THAI_POST',
      sender: { phoneNumber: '0900000000', email: 'test@test.com' },
      receiver: { name: 'คุณมายเอ็กซ์เพรส ชลบุรี', phoneNumber: '0989392917', address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1', subDistrict: 'หนองขาม', district: 'ศรีราชา', province: 'ชลบุรี', zipCode: '20230' },
      note: '',
      weightGram: 1000,
      codEnabled: true,
      codAmount: 100,
      insideBoxDetail: [{ name: 'อุปกรณ์อิเล็กทรอนิกส์', type: 'กล้อง Cannon', size: 'ขนาดเล็ก (S)', color: 'สีดำ (Black)', amount: 1, price: 1, weightGram: 1000 }],
      isInsured: true,
      insuranceDeclaredValue: 3000,
    },
    successCode: 200,
    successExample: {
      message: 'create parcel success',
      data: {
        note: '', id: 'cd613f68fd1bb07c3dcb4f4bc78d0c48...OP1728541345897',
        sender: { name: 'Test', phoneNumber: '0900000000', address: '99/9', subDistrict: 'เกาะขวาง', district: 'เมืองจันทบุรี', province: 'จันทบุรี', zipCode: '22000' },
        receiver: { name: 'คุณมายเอ็กซ์เพรส ชลบุรี', phoneNumber: '0989392917', address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1', subDistrict: 'หนองขาม', district: 'ศรีราชา', province: 'ชลบุรี', zipCode: '20230' },
        shipping: { express: 'THAI_POST', trackingNumber: 'JA056666571TH', weightGram: 1000, statusLog: [] },
        status: 'NEW', type: 'COD', createdAt: '2024-10-10T06:22:25.897Z', updatedAt: '2024-10-10T06:22:27.594Z',
        weightGram: 1000, isInsured: true,
        insideBoxDetail: [{ name: 'อุปกรณ์อิเล็กทรอนิกส์', type: 'กล้อง Cannon', size: 'ขนาดเล็ก (S)', color: 'สีดำ (Black)', amount: 1, price: 1, weightGram: 1000 }],
        codAmount: 100, codEnabled: true, codFee: 1.3, codFeeVat: 0.09, insuranceDeclaredValue: 3500, insuranceProductPrice: 3000,
      },
    },
    errors: [{ code: 400, name: 'BadRequestException', body: { status: 400, message: 'codAmount must be greater than 0', name: 'BadRequestException' } }],
  },
  {
    id: 'get-parcel',
    group: 'Parcel',
    name: 'Get Parcel',
    method: 'POST',
    path: '/v1/parcel/tracking',
    summary: 'ค้นหาข้อมูลพัสดุจากเลข tracking หลายรายการพร้อมกัน',
    auth: 'bearer',
    headers: [
      { key: 'Authorization', value: 'Bearer {access_token}', required: true },
      { key: 'Content-Type', value: 'application/json', required: true },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'express', type: 'String', required: true, desc: 'ชื่อขนส่ง — "THAI_POST"' },
      { field: 'trackingNumbers', type: 'String[]', required: true, desc: 'รายการเลข tracking ที่ต้องการค้นหา' },
    ],
    bodyExample: { express: 'THAI_POST', trackingNumbers: ['JB052917036TH', 'JB052917037TH', 'JB050236582TH'] },
    successCode: 200,
    successExample: {
      notFoundTrackingNumbers: ['JB012345678TH'],
      express: 'THAI_POST',
      data: [
        {
          note: '', id: '1211c0bccc0142404df1274999e94d0...OP1723622204784',
          receiver: { name: 'คุณมายเอ็กซ์เพรส ชลบุรี', phoneNumber: '0989392917', address: '188/273 ...', subDistrict: 'หนองขาม', district: 'ศรีราชา', province: 'ชลบุรี', zipCode: '20230' },
          sender: { name: 'คุณมายเอ็กซ์เพรส ภูเก็ต', phoneNumber: '0813150764', address: '69/429 หมู่ 2', subDistrict: 'วิชิต', district: 'เมืองภูเก็ต', province: 'ภูเก็ต', zipCode: '83000' },
          shipping: { express: 'THAI_POST', statusLog: [], trackingNumber: 'JB052917036TH', weightGram: 1000 },
          status: 'NEW', type: 'NON_COD', createdAt: '2024-08-14T07:56:44.783Z', updatedAt: '2024-08-14T07:56:44.957Z', weightGram: 1000,
        },
      ],
    },
    errors: [{ code: 400, name: 'BadRequestException', body: { status: 400, message: 'Express name: undefined is not allow. Please change to express that you can accept.', name: 'BadRequestException' } }],
  },
  {
    id: 'delete-parcel',
    group: 'Parcel',
    name: 'Delete Parcel',
    method: 'DELETE',
    path: '/v1/parcel/:parcelId',
    summary: 'ลบพัสดุที่สร้างไว้ด้วย parcel id',
    auth: 'bearer',
    headers: [{ key: 'Authorization', value: 'Bearer {access_token}', required: true }],
    pathParams: [{ key: 'parcelId', example: '8a88a0acb0ff10fb526cb3de97f7c1681e8cc488...OP1721804390165', desc: 'id ที่ได้รับหลังจากสร้างพัสดุ' }],
    queryParams: [],
    bodyType: 'none',
    bodyFields: [],
    bodyExample: null,
    successCode: 200,
    successExample: { message: 'delete parcelNumber: 8a88a0acb0ff10fb526cb3de97f7c1681e8cc488...OP1721804390165 success' },
    errors: [{ code: 404, name: 'NotFoundException', body: { status: 404, message: 'Parcel with refId=[1721804390165] not found', name: 'NotFoundException' } }],
  },
  {
    id: 'check-payment-status',
    group: 'Parcel',
    name: 'Check Payment Status',
    method: 'GET',
    path: '/v1/parcel/payment-status',
    summary: 'ตรวจสอบสถานะการโอนเงิน COD ของพัสดุ',
    auth: 'bearer',
    headers: [
      { key: 'Authorization', value: 'Bearer {access_token}', required: true },
      { key: 'Content-Type', value: 'application/json', required: true },
    ],
    pathParams: [],
    queryParams: [{ key: 'trackingNumber', example: 'JA000000000TH', required: true, desc: 'เลขพัสดุ' }],
    bodyType: 'none',
    bodyFields: [],
    bodyExample: null,
    successCode: 200,
    successExample: {
      trackingNumber: 'JA056666917TH', codTransferStatus: 'REJECTED', codTransferDate: '',
      shippingCost: { totalAmount: 18.391, shippingCost: 17, codAmount: 100, codFee: 1.3, codVat: 0.091, specialAreaCost: 0 },
    },
    errors: [],
  },
  {
    id: 'simulate-thaipost-webhook',
    group: 'Webhook',
    name: 'Simulate Thaipost Webhook',
    method: 'POST',
    path: '/v1/simulate/thaipost/webhook',
    summary: 'จำลองการยิง webhook สถานะพัสดุจากไปรษณีย์ไทย สำหรับทดสอบใน sandbox',
    auth: 'bearer',
    headers: [
      { key: 'Authorization', value: 'Bearer {access_token}', required: true },
      { key: 'Content-Type', value: 'application/json', required: true },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'barcode', type: 'String', required: true, desc: 'เลข tracking จากขนส่ง' },
      { field: 'weight', type: 'Number', required: true, desc: 'น้ำหนัก หน่วยกรัม' },
      { field: 'cod', type: 'String', required: true, desc: '"yes" หรือ "no"' },
      { field: 'status', type: 'String', required: true, desc: 'status code จากขนส่ง' },
      { field: 'statusDescription', type: 'String', required: true, desc: 'คำอธิบายสถานะ' },
      { field: 'statusDate', type: 'String', required: true, desc: 'วันเวลาที่ได้รับสถานะ (ต้องมากกว่าวันสร้างพัสดุ)' },
      { field: 'station', type: 'String', required: true, desc: 'ที่ทำการไปรษณีย์' },
    ],
    bodyExample: [{ barcode: 'JB084325131TH', weight: 1000, cod: 'no', status: '2', statusDescription: 'ปณ.ต้นทางรับฝากแล้ว', statusDate: '17/09/2024 16:27:19', stationPostcode: '20230', station: 'ศรีราชา/ชลบุรี', receiverName: '', latitude: '', longtitude: '', signature: '' }],
    successCode: 200,
    successExample: { errorCode: '000', errorDetail: 'success', status: 'true' },
    errors: [],
  },
  {
    id: 'print-label',
    group: 'Print Label',
    name: 'Print Label',
    method: 'POST',
    path: '/v1/print-label',
    summary: 'สร้างไฟล์ใบลาเบล (PDF) จากรายการ parcel id',
    auth: 'bearer',
    headers: [
      { key: 'Authorization', value: 'Bearer {access_token}', required: true },
      { key: 'Content-Type', value: 'application/json', required: true },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'size', type: 'String', required: true, desc: 'TSC_100_75, TSC_100_100, TSC_100_150, TSC_100_180, MINI_57_100' },
      { field: 'parcelIds', type: 'String[]', required: true, desc: 'รหัสพัสดุ ไม่เกิน 20 รายการ' },
    ],
    bodyExample: { size: 'TSC_100_75', parcelIds: ['7b50a746b657a0c5e96ba46888afe37b2389be97c298e3774f64fcfd9f9a575fOP1723535199935'] },
    successCode: 200,
    successExample: { note: 'Response จะถูกส่งกลับเป็นไฟล์ PDF แบบ blob (Content-Type: application/pdf)' },
    errors: [{ code: 400, name: 'BadRequestException', body: { status: 400, message: 'The number of parcel IDs must be greater than 0 and not exceed the limit of 20.', name: 'BadRequestException' } }],
  },
  {
    id: 'upload-image-file',
    group: 'Verify COD Account',
    name: 'Upload Image by File',
    method: 'POST',
    path: '/v1/account/sender-cod/image',
    summary: 'อัปโหลดรูปภาพยืนยันตัวตนจากไฟล์ในเครื่อง (multipart/form-data)',
    auth: 'bearer',
    headers: [
      { key: 'Authorization', value: 'Bearer {access_token}', required: true },
      { key: 'Content-Type', value: 'multipart/form-data', required: true },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'formdata',
    bodyFields: [
      { field: 'file', type: 'File', required: true, desc: 'ไฟล์รูปภาพ png หรือ jpg ขนาดไม่เกิน 20 MB' },
      { field: 'type', type: 'String', required: true, desc: 'BOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE' },
    ],
    bodyExample: [{ key: 'file', value: 'sample.png' }, { key: 'type', value: 'BOOKBANK' }],
    successCode: 200,
    successExample: { directory: 'mxp-bookbank-cod-image/mxp-bookbank-cod-image/xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png' },
    errors: [],
  },
  {
    id: 'upload-image-url',
    group: 'Verify COD Account',
    name: 'Upload Image by Url',
    method: 'POST',
    path: '/v1/account/sender-cod/image-from-url',
    summary: 'อัปโหลดรูปภาพยืนยันตัวตนจาก public URL',
    auth: 'bearer',
    headers: [{ key: 'Authorization', value: 'Bearer {access_token}', required: true }],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'url', type: 'String', required: true, desc: 'Public URL ของรูปภาพ' },
      { field: 'type', type: 'String', required: true, desc: 'BOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE' },
    ],
    bodyExample: { url: 'https://storage.googleapis.com/beta-mxp-image/sample.png', type: 'PERSON_ID_CARD' },
    successCode: 200,
    successExample: { directory: 'beta-mxp-identification-cod-image/mxp-identification-cod-image/idCard_669f693984d21500143eb80a_1728763660035.jpg' },
    errors: [{ code: 400, name: 'BadRequestException', body: { status: 400, message: 'Url is required.', name: 'BadRequestException' } }],
  },
  {
    id: 'get-image-file',
    group: 'Verify COD Account',
    name: 'Get Image File',
    method: 'POST',
    path: '/v1/account/sender-cod/image/view',
    summary: 'ดึงไฟล์รูปภาพที่เคยอัปโหลดไว้จาก directory path',
    auth: 'bearer',
    headers: [{ key: 'Authorization', value: 'Bearer {access_token}', required: true }],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'directory', type: 'String', required: true, desc: 'ที่อยู่ไฟล์ที่ได้จาก Upload Image API' },
      { field: 'type', type: 'String', required: true, desc: 'BOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE' },
    ],
    bodyExample: { directory: 'beta-mxp-identification-cod-image/mxp-identification-cod-image/idCard_669f693984d21500143eb80a_1728763660035.jpg', type: 'ID_CARD' },
    successCode: 200,
    successExample: { note: 'Response จะถูกส่งกลับเป็นไฟล์รูปภาพ (image file)' },
    errors: [],
  },
  {
    id: 'create-sender-cod',
    group: 'Verify COD Account',
    name: 'Create Sender COD',
    method: 'POST',
    path: '/v1/account/sender-cod',
    summary: 'สมัครบัญชีผู้ส่งแบบเก็บเงินปลายทาง (COD) พร้อมเอกสารยืนยันตัวตน',
    auth: 'bearer',
    headers: [
      { key: 'Authorization', value: 'Bearer {access_token}', required: true },
      { key: 'Content-Type', value: 'application/json', required: true },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'bankAccount', type: 'Object', required: true, desc: 'bankInitial (KBANK, SCB, BBL, KTB, TMB, BAY), holderName, number, bookBankImage' },
      { field: 'identification', type: 'Object', required: true, desc: 'number, image, selfPicture, type (PERSON, LEGAL_ENTITY)' },
      { field: 'name / phoneNumber / email', type: 'String', required: true, desc: 'ข้อมูลผู้ส่ง' },
      { field: 'address / subDistrict / district / province / zipCode', type: 'String', required: true, desc: 'ที่อยู่ผู้ส่ง' },
    ],
    bodyExample: {
      bankAccount: { bankInitial: 'KBANK', holderName: 'Test', number: '0000000000', bookBankImage: 'mxp-bookbank-cod-image/mxp-bookbank-cod-image/1707213724144.png' },
      identification: { number: '1111111111111', image: 'mxp-indentification-cod-image/idCard-1707213724148.png', selfPicture: 'mxp-indentification-cod-image/PersonIdCard-1707213724149.png', type: 'PERSON' },
      name: 'Test', phoneNumber: '0900000000', email: 'test@test.com', address: '99/9', subDistrict: 'เกาะขวาง', district: 'เมืองจันทบุรี', province: 'จันทบุรี', zipCode: '22000',
    },
    successCode: 200,
    successExample: {
      message: 'create sender cod success',
      data: {
        bankAccount: { bankFullName: 'ธนาคารกสิกรไทย (KBANK)', bankInitial: 'KBANK', holderName: 'Test', number: '00000000000', bookBankImage: 'mxp-bookbank-cod-image/mxp-bookbank-cod-image/Cert-1707213724144.png' },
        approval: 'PENDING', updateApprovalDate: '2024-10-09 06:07:06', name: 'Test', phoneNumber: '0900000004', email: 'test@test.com',
        address: '99/9', subDistrict: 'เกาะขวาง', district: 'เมืองจันทบุรี', province: 'จันทบุรี', zipCode: '22000',
      },
    },
    errors: [],
  },
  {
    id: 'get-sender-cod',
    group: 'Verify COD Account',
    name: 'Get Sender COD',
    method: 'GET',
    path: '/v1/account/sender-cod',
    summary: 'ค้นหาบัญชีผู้ส่ง COD ด้วยอีเมลหรือเบอร์โทรศัพท์',
    auth: 'bearer',
    headers: [
      { key: 'Authorization', value: 'Bearer {access_token}', required: true },
      { key: 'Content-Type', value: 'application/json', required: true },
    ],
    pathParams: [],
    queryParams: [
      { key: 'email', example: 'myexpress.international@gmail.com', required: false, desc: 'ต้องระบุ email หรือ phoneNumber อย่างน้อยหนึ่งอย่าง' },
      { key: 'phoneNumber', example: '0989392917', required: false, desc: 'ความยาว 9–10 หลัก' },
    ],
    bodyType: 'none',
    bodyFields: [],
    bodyExample: null,
    successCode: 200,
    successExample: {
      data: [{
        bankAccount: { bankFullName: 'ธนาคารกสิกรไทย (KBANK)', bankInitial: 'KBANK', holderName: 'มายเอกซ์เพลส น่ารัก', number: '00000000011', bookBankImage: 'beta-mxp-bookbank-cod-image/...662f048b...jpg' },
        approval: 'PENDING', updateApprovalDate: '2024-10-08 23:08:18', note: '', name: 'มายเอกซ์เพลส น่ารัก', phoneNumber: '0989392917',
        email: 'myexpress.international@gmail.com', address: '123', subDistrict: 'เกาะขวาง', district: 'เมืองจันทบุรี', province: 'จันทบุรี', zipCode: '22000',
      }],
    },
    errors: [],
  },
];

const GROUPS = GROUP_ORDER.map((g) => ({ label: g as string, items: ENDPOINTS.filter((e) => e.group === g) }));

/* ============================================================
   HELPERS
   ============================================================ */

function buildResolvedPath(endpoint: Endpoint, pathValues: StringMap): string {
  let p = endpoint.path;
  endpoint.pathParams.forEach((pp) => {
    p = p.replace(`:${pp.key}`, pathValues[pp.key] || `:${pp.key}`);
  });
  return p;
}

function buildQueryString(endpoint: Endpoint, queryValues: StringMap): string {
  const active = endpoint.queryParams.filter((qp) => (queryValues[qp.key] ?? '') !== '');
  if (!active.length) return '';
  return '?' + active.map((qp) => `${qp.key}=${encodeURIComponent(queryValues[qp.key])}`).join('&');
}

function randomToken(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  const cryptoObj = typeof window !== 'undefined' ? window.crypto : undefined;
  if (cryptoObj?.getRandomValues) {
    const values = new Uint32Array(length);
    cryptoObj.getRandomValues(values);
    for (let i = 0; i < length; i++) out += chars[values[i] % chars.length];
  } else {
    for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function generateSandboxCredentials(): SandboxCredentials {
  return { clientId: randomToken(32), clientSecret: randomToken(32), createdAt: new Date().toISOString() };
}

function authBodyFromCredentials(creds: SandboxCredentials): string {
  return JSON.stringify(
    { client_id: creds.clientId, client_secret: creds.clientSecret, grant_type: 'client_credentials', scope: 'parcel' },
    null,
    2
  );
}

function buildCurl(
  endpoint: Endpoint,
  env: Env,
  token: string,
  pathValues: StringMap,
  queryValues: StringMap,
  bodyText: string
): string {
  const url = BASE_URLS[env] + buildResolvedPath(endpoint, pathValues) + buildQueryString(endpoint, queryValues);
  const lines = [`curl --request ${endpoint.method} \\`, `  --url '${url}' \\`];
  endpoint.headers.forEach((h) => {
    const val = h.key === 'Authorization' ? `Bearer ${token || '{access_token}'}` : h.value;
    lines.push(`  --header '${h.key}: ${val}' \\`);
  });
  if (endpoint.bodyType === 'json' && bodyText) {
    lines.push(`  --data '${bodyText.replace(/\n\s*/g, ' ').trim()}'`);
  } else {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ \\$/, '');
  }
  return lines.join('\n');
}

function buildCodeExample(
  language: ClientLibraryLanguage,
  endpoint: Endpoint,
  env: Env,
  token: string,
  pathValues: StringMap,
  queryValues: StringMap,
  bodyText: string
): string {
  const url = BASE_URLS[env] + buildResolvedPath(endpoint, pathValues) + buildQueryString(endpoint, queryValues);
  const headers = endpoint.headers.map((h) => {
    const value = h.key === 'Authorization' ? `Bearer ${token || '{access_token}'}` : h.value;
    return { key: h.key, value };
  });
  const body = bodyText || '';
  const jsonBody = body.replace(/`/g, '\\`');
  const headerLines = headers.map((h) => `    '${h.key}': '${h.value}'`).join(',\n');

  switch (language) {
    case 'cURL - cURL':
      return buildCurl(endpoint, env, token, pathValues, queryValues, bodyText);
    case 'JavaScript - Fetch':
      return `const response = await fetch('${url}', {\n  method: '${endpoint.method}',\n  headers: {\n${headerLines}\n  }${endpoint.bodyType !== 'none' ? `,\n  body: JSON.stringify(${jsonBody})` : ''}\n});\n\nconst data = await response.json();`;
    case 'NodeJs - Axios':
      return `const axios = require('axios');\n\nconst response = await axios({\n  method: '${endpoint.method.toLowerCase()}',\n  url: '${url}',\n  headers: {\n${headerLines}\n  }${endpoint.bodyType !== 'none' ? `,\n  data: ${jsonBody}` : ''}\n});\n\nconsole.log(response.data);`;
    case 'Python - Requests':
      return `import requests\n\nresponse = requests.request(\n    '${endpoint.method}',\n    '${url}',\n    headers={\n${headers.map((h) => `        '${h.key}': '${h.value}'`).join(',\n')}\n    }${endpoint.bodyType !== 'none' ? `,\n    json=${body}` : ''}\n)\n\nprint(response.json())`;
    case 'Python - http.client':
      return `import http.client\nimport json\n\nconn = http.client.HTTPSConnection('${new URL(url).host}')\nheaders = {\n${headers.map((h) => `    '${h.key}': '${h.value}'`).join(',\n')}\n}\n${endpoint.bodyType !== 'none' ? `body = json.dumps(${body})\nconn.request('${endpoint.method}', '${new URL(url).pathname}${new URL(url).search}', body, headers)` : `conn.request('${endpoint.method}', '${new URL(url).pathname}${new URL(url).search}', headers=headers)`}\nresponse = conn.getresponse()\nprint(response.read().decode())`;
    case 'PowerShell - RestMethod':
      return `$headers = @{\n${headers.map((h) => `  '${h.key}' = '${h.value}'`).join('\n')}\n}\n${endpoint.bodyType !== 'none' ? `$body = @'\n${body}\n'@\n\nInvoke-RestMethod -Uri '${url}' -Method ${endpoint.method} -Headers $headers -Body $body` : `Invoke-RestMethod -Uri '${url}' -Method ${endpoint.method} -Headers $headers`}`;
    case 'Java - OkHttp':
      return `OkHttpClient client = new OkHttpClient();\n\nRequest request = new Request.Builder()\n    .url("${url}")\n${headers.map((h) => `    .addHeader("${h.key}", "${h.value}")`).join('\n')}\n${endpoint.bodyType !== 'none' ? `    .post(RequestBody.create(\n        "${jsonBody.replace(/"/g, '\\"')}",\n        MediaType.parse("application/json")\n    ))\n` : ''}    .build();\n\nResponse response = client.newCall(request).execute();`;
    case 'PHP - cURL':
      return `$ch = curl_init('${url}');\n\ncurl_setopt_array($ch, [\n    CURLOPT_CUSTOMREQUEST => '${endpoint.method}',\n    CURLOPT_HTTPHEADER => [\n${headers.map((h) => `        '${h.key}: ${h.value}'`).join(',\n')}\n    ],${endpoint.bodyType !== 'none' ? `\n    CURLOPT_POSTFIELDS => '${body.replace(/'/g, "\\'")}',` : ''}\n]);\n\n$response = curl_exec($ch);\ncurl_close($ch);`;
    case 'Go - Native':
      return `req, _ := http.NewRequest("${endpoint.method}", "${url}", ${endpoint.bodyType !== 'none' ? `strings.NewReader(${JSON.stringify(body)})` : 'nil'})\n${headers.map((h) => `req.Header.Set("${h.key}", "${h.value}")`).join('\n')}\n\nclient := &http.Client{}\nresp, err := client.Do(req)`;
    case 'C - libcurl':
      return `CURL *curl = curl_easy_init();\nif (curl) {\n  curl_easy_setopt(curl, CURLOPT_URL, "${url}");\n  curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "${endpoint.method}");\n${headers.map((h) => `  /* Header: ${h.key}: ${h.value} */`).join('\n')}\n  curl_easy_perform(curl);\n  curl_easy_cleanup(curl);\n}`;
    default:
      return buildCurl(endpoint, env, token, pathValues, queryValues, bodyText);
  }
}

/* ============================================================
   SHARED UI PRIMITIVES — matching the API Docs page design system
   ============================================================ */

function MethodChip({ method, size = 'sm' }: { method: Method; size?: 'sm' | 'md' }) {
  const style = METHOD_STYLE[method];
  return (
    <span
      className={`
        inline-flex shrink-0 items-center justify-center
        rounded-md border font-mono font-bold
        ${style.bg} ${style.text} ${style.border}
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'}
      `}
    >
      {method}
    </span>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
    >
      {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอก'}
    </button>
  );
}

function CodeBlock({
  children,
  label,
  tone = 'dark',
}: {
  children: ReactNode;
  label?: string;
  tone?: 'dark' | 'light';
}) {
  const text = typeof children === 'string' ? children : '';
  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        tone === 'dark' ? 'border-slate-800 bg-[#0B1220]' : 'border-slate-200 bg-white'
      }`}
    >
      {label && (
        <div
          className={`flex items-center justify-between border-b px-3 py-2 ${
            tone === 'dark' ? 'border-slate-800 bg-[#111827]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              tone === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {label}
          </span>
          <CopyButton text={text} />
        </div>
      )}
      <pre
        className={`overflow-x-auto p-4 font-mono text-[11px] leading-6 whitespace-pre-wrap break-words ${
          tone === 'dark' ? 'text-indigo-100' : 'text-slate-700'
        }`}
      >
        {children}
      </pre>
    </div>
  );
}

function RequiredBadge({ required }: { required?: boolean }) {
  return required ? (
    <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-600">
      required
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
      optional
    </span>
  );
}

/* ============================================================
   SIDEBAR
   ============================================================ */

interface SidebarProps {
  page: DocsPage;
  activeId: string;
  search: string;
  collapsedGroups: Record<string, boolean>;
  onPageChange: (page: DocsPage) => void;
  onEndpointSelect: (id: string) => void;
  onSearchChange: (value: string) => void;
  onToggleGroup: (group: string) => void;
  onLanding: () => void;
  onDocs: () => void;
}

function Sidebar({
  page,
  activeId,
  search,
  collapsedGroups,
  onPageChange,
  onEndpointSelect,
  onSearchChange,
  onToggleGroup,
  onLanding,
  onDocs,
}: SidebarProps) {
  const filteredGroups = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return GROUPS;
    return GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.name.toLowerCase().includes(keyword) || item.path.toLowerCase().includes(keyword)
      ),
    })).filter((group) => group.items.length > 0);
  }, [search]);

  return (
    <aside className="flex h-full w-[272px] shrink-0 flex-col border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="flex h-[68px] shrink-0 items-center border-b border-slate-100 px-4">
        <button
          type="button"
          onClick={onLanding}
          className="flex min-w-0 items-center gap-3 text-left transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <img src={logo} alt="MyAPI" className="h-7 w-7 object-contain" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-slate-950">MyAPI Open API</div>
            <div className="mt-0.5 text-[10px] text-slate-400">Sandbox</div>
          </div>
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-slate-100 p-3">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m2.35-6.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
          </svg>
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search endpoints..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-4">
          <div className="px-2.5 pb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Getting Started
          </div>
          <button
            type="button"
            onClick={() => onPageChange('overview')}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
              page === 'overview'
                ? 'bg-indigo-50 font-semibold text-indigo-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-md">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 21v-7h6v7" />
              </svg>
            </span>
            <span>Overview</span>
          </button>
        </div>

        <div className="space-y-3">
          {filteredGroups.map((group) => {
            const collapsed = collapsedGroups[group.label];
            return (
              <div key={group.label}>
                <button
                  type="button"
                  onClick={() => onToggleGroup(group.label)}
                  className="flex w-full items-center justify-between px-2.5 pb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-slate-600"
                >
                  <span>{group.label}</span>
                  <svg
                    className={`h-3 w-3 transition-transform ${collapsed ? '-rotate-90' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                  </svg>
                </button>
                {!collapsed && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active = page === 'docs' && item.id === activeId;
                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => onEndpointSelect(item.id)}
                          className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                            active
                              ? 'bg-indigo-50 text-indigo-800'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <MethodChip method={item.method} />
                          <span className={`min-w-0 flex-1 truncate ${active ? 'font-semibold' : ''}`}>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Back to docs */}
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={onDocs}
          className="flex w-full items-center justify-between rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md"
        >
          <span>Go to API Docs</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </aside>
  );
}

/* ============================================================
   SANDBOX CREDENTIALS
   ============================================================ */

interface CredentialsCardProps {
  loggedIn: boolean;
  credentials: SandboxCredentials | null;
  onLogin: () => void;
  onGenerate: () => void;
  onRegenerate: () => void;
  onGenerateAccessToken: () => void;
}

function CredentialsCard({
  loggedIn,
  credentials,
  onLogin,
  onGenerate,
  onRegenerate,
  onGenerateAccessToken,
}: CredentialsCardProps) {
  const [secretVisible, setSecretVisible] = useState(false);
  const [confirmingRegenerate, setConfirmingRegenerate] = useState(false);

  const handleRegenerateClick = () => {
    if (!confirmingRegenerate) {
      setConfirmingRegenerate(true);
      return;
    }
    setConfirmingRegenerate(false);
    setSecretVisible(false);
    onRegenerate();
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-50 blur-3xl" />
      <div className="relative p-6 lg:p-7">
        <h2 className="text-base font-bold text-slate-950">Sandbox Credentials</h2>
        <p className="mt-1 max-w-lg text-xs leading-6 text-slate-500">
          สร้าง client_id / client_secret สำหรับ Sandbox ได้ทันที ไม่ต้องรออนุมัติ ต่างจาก Production ที่ต้องผ่านการตรวจสอบก่อนใช้งาน
        </p>

        <div className="mt-5">
          {!loggedIn && (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-6 text-slate-500">
                เข้าสู่ระบบก่อน เพื่อสร้าง credentials ของท่านเอง (ป้องกันการสุ่มสร้างจำนวนมาก)
              </p>
              <button
                type="button"
                onClick={onLogin}
                className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          )}

          {loggedIn && !credentials && (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-6 text-slate-500">
                ยังไม่มี credentials — กดสร้างเพื่อรับ client_id และ client_secret ทันที
              </p>
              <button
                type="button"
                onClick={onGenerate}
                className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
              >
                Generate Sandbox Credentials
              </button>
            </div>
          )}

          {loggedIn && credentials && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">client_id</span>
                  <CopyButton text={credentials.clientId} />
                </div>
                <div className="px-3 py-2.5">
                  <code className="break-all font-mono text-[11px] text-slate-700">{credentials.clientId}</code>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">client_secret</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSecretVisible((v) => !v)}
                      className="rounded-md px-2 py-1 text-[10px] font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      {secretVisible ? 'ซ่อน' : 'แสดง'}
                    </button>
                    <CopyButton text={credentials.clientSecret} />
                  </div>
                </div>
                <div className="px-3 py-2.5">
                  <code className="break-all font-mono text-[11px] text-slate-700">
                    {secretVisible ? credentials.clientSecret : '•'.repeat(32)}
                  </code>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10px] text-slate-400">
                  สร้างเมื่อ {new Date(credentials.createdAt).toLocaleString('th-TH')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {confirmingRegenerate && (
                    <>
                      <span className="text-[10px] font-semibold text-rose-600">secret เดิมจะใช้งานไม่ได้ทันที ยืนยันหรือไม่?</span>
                      <button
                        type="button"
                        onClick={() => setConfirmingRegenerate(false)}
                        className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100"
                      >
                        ยกเลิก
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={onGenerateAccessToken}
                    disabled={confirmingRegenerate}
                    className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Generate Access Token →
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateClick}
                    className={`rounded-lg px-3.5 py-1.5 text-[11px] font-bold transition-colors ${
                      confirmingRegenerate
                        ? 'bg-rose-600 text-white hover:bg-rose-500'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {confirmingRegenerate ? 'ยืนยัน Regenerate' : 'Regenerate'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   OVERVIEW
   ============================================================ */

function Overview({
  onNavigate,
  loggedIn,
  credentials,
  onLogin,
  onGenerateCredentials,
  onRegenerateCredentials,
  onGenerateAccessToken,
}: {
  onNavigate: (page: DocsPage, endpointId?: string) => void;
  loggedIn: boolean;
  credentials: SandboxCredentials | null;
  onLogin: () => void;
  onGenerateCredentials: () => void;
  onRegenerateCredentials: () => void;
  onGenerateAccessToken: () => void;
}) {
  const overviewCards = [
    ['Authentication', 'สร้าง Access Token ด้วย client_id / client_secret แล้วเริ่มยิงคำขอทดสอบ'],
    ['Parcel API', 'ทดลองสร้าง ค้นหา ลบพัสดุ และตรวจสอบสถานะการชำระเงิน COD'],
    ['Webhook', 'จำลองการยิง webhook สถานะพัสดุจากไปรษณีย์ไทยแบบ real-time'],
    ['Print Label', 'สร้างไฟล์ใบลาเบล PDF จากรายการ parcel id ของท่าน'],
  ];

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-indigo-50 blur-3xl" />
            <div className="relative p-7 lg:p-8">
              <div className="mb-3 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Sandbox
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl">MyAPI API Sandbox</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                ทดลองยิง MyAPI Open API แบบ interactive พร้อมดูตัวอย่าง request และ response แบบ real-time
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-[10px] text-slate-500">REST API</span>
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-[10px] text-slate-500">OAuth 2.0</span>
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-[10px] text-slate-500">JSON</span>
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-[10px] text-slate-500">Try it out</span>
              </div>
            </div>
          </section>

          <CredentialsCard
            loggedIn={loggedIn}
            credentials={credentials}
            onLogin={onLogin}
            onGenerate={onGenerateCredentials}
            onRegenerate={onRegenerateCredentials}
            onGenerateAccessToken={onGenerateAccessToken}
          />

          {/* What you can test */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-sm font-bold text-slate-950">สิ่งที่ทดลองได้ใน Sandbox</h2>
              <p className="mt-1 text-xs text-slate-500">เลือก endpoint จากเมนูด้านซ้าย แล้วกด Send เพื่อดูตัวอย่างการตอบกลับ</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {overviewCards.map(([title, description]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
                  >
                    <div className="text-xs font-bold text-slate-900">{title}</div>
                    <p className="mt-1.5 text-xs leading-6 text-slate-500">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Explore API */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle title="Try an Endpoint" description="เลือก API ที่ต้องการทดสอบ" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                ['Authentication', 'Generate Access Token', 'generate-access-token'],
                ['Parcel API', 'Create Parcel — NON_COD', 'create-parcel-non-cod'],
                ['Webhook', 'Simulate Thaipost Webhook', 'simulate-thaipost-webhook'],
              ].map(([group, title, id]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => onNavigate('docs', id)}
                  className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm"
                >
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">{group}</div>
                  <div className="mt-2 text-xs font-bold text-slate-900">{title}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 transition-transform group-hover:translate-x-0.5">
                    Try it out
                    <span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="h-2" />
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export function Sandbox() {
  const [page, setPage] = useState<DocsPage>('overview');
  const [activeId, setActiveId] = useState<string>(ENDPOINTS[0].id);
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState<SandboxCredentials | null>(null);
  const [issuedAccessToken, setIssuedAccessToken] = useState<string | null>(null);

  // Sandbox ใช้ Dev URL เท่านั้น — ไม่มีตัวเลือก Production ในหน้านี้
  const env: Env = 'test';
  const endpoint = useMemo(
    () => ENDPOINTS.find((e) => e.id === activeId) || ENDPOINTS[0],
    [activeId],
  );

  const initFor = (
    ep: Endpoint,
    creds: SandboxCredentials | null = credentials,
  ): { pv: StringMap; qv: StringMap; body: string } => {
    const pv: StringMap = {};
    ep.pathParams.forEach((p) => (pv[p.key] = p.example));

    const qv: StringMap = {};
    ep.queryParams.forEach((q) => (qv[q.key] = q.required ? q.example : ''));

    if (ep.id === 'generate-access-token' && creds) {
      return { pv, qv, body: authBodyFromCredentials(creds) };
    }

    return {
      pv,
      qv,
      body: ep.bodyExample != null ? JSON.stringify(ep.bodyExample, null, 2) : '',
    };
  };

  const [token, setToken] = useState('');
  const [pathValues, setPathValues] = useState<StringMap>(() => initFor(ENDPOINTS[0]).pv);
  const [queryValues, setQueryValues] = useState<StringMap>(() => initFor(ENDPOINTS[0]).qv);
  const [bodyText, setBodyText] = useState<string>(() => initFor(ENDPOINTS[0]).body);
  const [response, setResponse] = useState<ApiResponseState>(null);

  const selectEndpoint = (id: string) => {
    const ep = ENDPOINTS.find((e) => e.id === id);
    if (!ep) return;

    const { pv, qv, body } = initFor(ep);
    setActiveId(id);
    setPage('docs');
    setResponse(null);
    setPathValues(pv);
    setQueryValues(qv);
    setBodyText(body);
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((current) => ({ ...current, [group]: !current[group] }));
  };

  const handleSend = () => {
    setResponse({ loading: true });
    const delay = 500 + Math.random() * 400;

    setTimeout(() => {
      if (endpoint.id === 'generate-access-token') {
        let parsed: { client_id?: string; client_secret?: string } = {};

        try {
          parsed = JSON.parse(bodyText || '{}');
        } catch {
          setResponse({
            status: 400,
            ms: Math.round(delay),
            body: { status: 400, message: 'Invalid JSON body', name: 'BadRequestException' },
            demo: true,
          });
          return;
        }

        const matches =
          credentials != null &&
          parsed.client_id === credentials.clientId &&
          parsed.client_secret === credentials.clientSecret;

        if (!matches) {
          setResponse({
            status: 400,
            ms: Math.round(delay),
            body:
              (endpoint.errors[0]?.body as Record<string, unknown>) ??
              { error: 'invalid_client', error_description: 'Invalid client authentication' },
            demo: true,
          });
          return;
        }

        const issued = randomToken(32);
        setIssuedAccessToken(issued);
        setToken(issued);
        setResponse({
          status: 200,
          ms: Math.round(delay),
          body: { expires_in: 7200, token_type: 'bearer', access_token: issued },
          demo: true,
        });
        return;
      }

      const typedToken = token.trim();

      if (endpoint.auth === 'bearer') {
        if (!typedToken) {
          setResponse({
            status: 401,
            ms: Math.round(delay),
            body: {
              status: 401,
              message: 'Access token is missing or unauthorized',
              name: 'UnauthorizedException',
            },
            demo: true,
          });
          return;
        }

        if (typedToken !== issuedAccessToken) {
          setResponse({
            status: 401,
            ms: Math.round(delay),
            body: {
              status: 401,
              message: 'Access token is invalid or expired',
              name: 'UnauthorizedException',
            },
            demo: true,
          });
          return;
        }
      }

      setResponse({
        status: endpoint.successCode,
        ms: Math.round(delay),
        body: endpoint.successExample,
        demo: true,
      });
    }, delay);
  };

  const handleLogin = () => setLoggedIn(true);

  const handleGenerateCredentials = () => {
    const creds = generateSandboxCredentials();
    setCredentials(creds);
    setIssuedAccessToken(null);
    setToken('');
    setActiveId('generate-access-token');
    setPage('docs');
    setBodyText(authBodyFromCredentials(creds));
    setResponse(null);
  };

  const handleRegenerateCredentials = () => {
    const creds = generateSandboxCredentials();
    setCredentials(creds);
    setIssuedAccessToken(null);
    setToken('');
    if (activeId === 'generate-access-token') {
      setBodyText(authBodyFromCredentials(creds));
      setResponse(null);
    }
  };

  const handleGenerateAccessToken = () => {
    selectEndpoint('generate-access-token');
  };

  const handleUseIssuedToken = () => {
    if (issuedAccessToken) setToken(issuedAccessToken);
  };

  const [codeLanguage, setCodeLanguage] =
    useState<ClientLibraryLanguage>('cURL - cURL');

  const codeExample = buildCodeExample(
    codeLanguage,
    endpoint,
    env,
    token,
    pathValues,
    queryValues,
    bodyText
  );
  const resolvedUrl =
    BASE_URLS[env] +
    buildResolvedPath(endpoint, pathValues) +
    buildQueryString(endpoint, queryValues);

  const goLanding = () => window.location.assign('/');
  const goDocs = () => window.location.assign('/docs');

  const hasToken = Boolean(token || issuedAccessToken);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
      <Sidebar
        page={page}
        activeId={activeId}
        search={search}
        collapsedGroups={collapsedGroups}
        onPageChange={setPage}
        onEndpointSelect={selectEndpoint}
        onSearchChange={setSearch}
        onToggleGroup={toggleGroup}
        onLanding={goLanding}
        onDocs={goDocs}
      />

      {page === 'overview' ? (
        <Overview
          onNavigate={(target, endpointId) => {
            if (endpointId) {
              selectEndpoint(endpointId);
              return;
            }
            setPage(target);
          }}
          loggedIn={loggedIn}
          credentials={credentials}
          onLogin={handleLogin}
          onGenerateCredentials={handleGenerateCredentials}
          onRegenerateCredentials={handleRegenerateCredentials}
          onGenerateAccessToken={handleGenerateAccessToken}
        />
      ) : (
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1480px] px-5 py-6 lg:px-8">
            {/* Environment */}
            <section className="mb-5 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <h1 className="text-sm font-bold text-slate-950">Sandbox Environment</h1>
                  </div>
                  <code className="mt-1.5 block font-mono text-xs text-slate-500">
                    {BASE_URLS.test}
                  </code>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>REST API</span>
                  <span>•</span>
                  <span>JSON</span>
                  <span>•</span>
                  <span>Bearer Auth</span>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
              {/* Documentation */}
              <section className="min-w-0 space-y-5">
                <header className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <MethodChip method={endpoint.method} size="md" />
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                        {endpoint.group}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                      {endpoint.name}
                    </h2>
                    <p className="mt-1.5 max-w-3xl text-xs leading-6 text-slate-500">
                      {endpoint.summary}
                    </p>
                    <div className="mt-4 flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span
                        className={`shrink-0 rounded px-2 py-1 text-[10px] font-bold text-white ${METHOD_STYLE[endpoint.method].solid}`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700">
                        {endpoint.path}
                      </code>
                      <CopyButton text={endpoint.path} />
                    </div>
                  </div>
                </header>

                {/* Headers */}
                {endpoint.headers.length > 0 && (
                  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">Headers</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[520px] text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-5 py-2.5 font-semibold">Key</th>
                            <th className="px-5 py-2.5 font-semibold">Value</th>
                            <th className="px-5 py-2.5 font-semibold">Required</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {endpoint.headers.map((h) => (
                            <tr key={h.key}>
                              <td className="px-5 py-3">
                                <code className="font-mono font-semibold text-indigo-700">{h.key}</code>
                              </td>
                              <td className="px-5 py-3">
                                <code className="font-mono text-[11px] text-slate-500">{h.value}</code>
                              </td>
                              <td className="px-5 py-3">
                                <RequiredBadge required={h.required} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Parameters */}
                {(endpoint.pathParams.length > 0 || endpoint.queryParams.length > 0) && (
                  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">Parameters</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-5 py-2.5 font-semibold">Name</th>
                            <th className="px-5 py-2.5 font-semibold">Type</th>
                            <th className="px-5 py-2.5 font-semibold">Example</th>
                            <th className="px-5 py-2.5 font-semibold">Required</th>
                            <th className="px-5 py-2.5 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {endpoint.pathParams.map((p) => (
                            <tr key={`path-${p.key}`} className="align-top">
                              <td className="px-5 py-3"><code className="font-mono font-semibold text-indigo-700">{p.key}</code></td>
                              <td className="px-5 py-3 text-slate-500">Path</td>
                              <td className="px-5 py-3"><code className="font-mono text-[10px] text-slate-500">{p.example}</code></td>
                              <td className="px-5 py-3"><RequiredBadge required /></td>
                              <td className="px-5 py-3 leading-5 text-slate-600">{p.desc}</td>
                            </tr>
                          ))}
                          {endpoint.queryParams.map((p) => (
                            <tr key={`query-${p.key}`} className="align-top">
                              <td className="px-5 py-3"><code className="font-mono font-semibold text-indigo-700">{p.key}</code></td>
                              <td className="px-5 py-3 text-slate-500">Query</td>
                              <td className="px-5 py-3"><code className="font-mono text-[10px] text-slate-500">{p.example}</code></td>
                              <td className="px-5 py-3"><RequiredBadge required={p.required} /></td>
                              <td className="px-5 py-3 leading-5 text-slate-600">{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Request fields */}
                {endpoint.bodyFields.length > 0 && (
                  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">Request Body</h3>
                      <p className="mt-1 text-[11px] text-slate-400">Fields accepted by this endpoint.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[680px] text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-5 py-2.5 font-semibold">Field</th>
                            <th className="px-5 py-2.5 font-semibold">Type</th>
                            <th className="px-5 py-2.5 font-semibold">Required</th>
                            <th className="px-5 py-2.5 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {endpoint.bodyFields.map((f) => (
                            <tr key={f.field} className="align-top">
                              <td className="px-5 py-3"><code className="font-mono font-semibold text-indigo-700">{f.field}</code></td>
                              <td className="px-5 py-3"><code className="font-mono text-[10px] text-slate-500">{f.type}</code></td>
                              <td className="px-5 py-3"><RequiredBadge required={f.required} /></td>
                              <td className="px-5 py-3 leading-5 text-slate-600">{f.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Errors */}
                {endpoint.errors.length > 0 && (
                  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">Error Response</h3>
                    </div>
                    <div className="space-y-3 p-4">
                      {endpoint.errors.map((e) => (
                        <div key={`${e.code}-${e.name}`} className="overflow-hidden rounded-lg border border-rose-100">
                          <div className="flex items-center gap-2 bg-rose-50 px-3 py-2">
                            <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-rose-600">{e.code}</span>
                            <span className="text-[10px] font-semibold text-rose-700">{e.name}</span>
                          </div>
                          <div className="p-3"><CodeBlock>{JSON.stringify(e.body, null, 2)}</CodeBlock></div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </section>

              {/* Developer playground */}
              <aside className="min-w-0 space-y-4 xl:sticky xl:top-5">
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-950">Try it out</h3>
                        <p className="mt-1 text-[11px] text-slate-400">ส่ง Request และดู Response ได้จากจุดเดียว</p>
                      </div>
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[9px] text-slate-500">DEV</span>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    {/* Authentication */}
                    <section>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Authentication</h4>
                          <p className="mt-0.5 text-[10px] text-slate-400">Access Token สำหรับ endpoint ที่ใช้ Bearer Authentication</p>
                        </div>
                        {hasToken ? (
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">Token Ready</span>
                        ) : (
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">No Token</span>
                        )}
                      </div>

                      {endpoint.id === 'generate-access-token' ? (
                        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                          {credentials ? (
                            <>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div>
                                  <label className="mb-1 block text-[9px] font-bold text-slate-400">client_id</label>
                                  <code className="block truncate rounded-md border border-slate-200 bg-white px-2 py-2 font-mono text-[10px] text-slate-600">{credentials.clientId}</code>
                                </div>
                                <div>
                                  <label className="mb-1 block text-[9px] font-bold text-slate-400">client_secret</label>
                                  <code className="block truncate rounded-md border border-slate-200 bg-white px-2 py-2 font-mono text-[10px] text-slate-600">{credentials.clientSecret}</code>
                                </div>
                              </div>
                              <button type="button" onClick={handleRegenerateCredentials} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">
                                สร้าง Credentials ใหม่
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[10px] text-slate-500">ยังไม่มี Sandbox Credentials</span>
                              <button type="button" onClick={handleGenerateCredentials} className="rounded-md bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-indigo-700">
                                Generate Credentials
                              </button>
                            </div>
                          )}
                        </div>
                      ) : endpoint.auth === 'bearer' ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <code className="min-w-0 truncate font-mono text-[10px] text-emerald-800">
                              Bearer {token ? `${token.slice(0, 16)}...` : '—'}
                            </code>
                            {issuedAccessToken && (
                              <button type="button" onClick={handleUseIssuedToken} className="shrink-0 rounded-md border border-emerald-200 bg-white px-2 py-1.5 text-[9px] font-bold text-emerald-700 hover:bg-emerald-50">
                                Use latest token
                              </button>
                            )}
                          </div>
                          {!token && (
                            <button type="button" onClick={handleGenerateAccessToken} className="mt-2 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">
                              Generate Access Token →
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] text-slate-500">
                          This endpoint does not require authentication.
                        </div>
                      )}
                    </section>

                    {/* Request */}
                    <section>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">Request</h4>
                        <span className="font-mono text-[9px] text-slate-400">{endpoint.method}</span>
                      </div>

                      <div className="mb-3 flex min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <span className={`shrink-0 px-2.5 py-2 text-[10px] font-bold text-white ${METHOD_STYLE[endpoint.method].solid}`}>
                          {endpoint.method}
                        </span>
                        <input readOnly value={resolvedUrl} title={resolvedUrl} className="min-w-0 flex-1 bg-transparent px-2.5 py-2 font-mono text-[10px] text-slate-600 outline-none" />
                        <CopyButton text={resolvedUrl} />
                        <button
                          type="button"
                          onClick={handleSend}
                          disabled={endpoint.id === 'generate-access-token' && !credentials}
                          className="shrink-0 bg-indigo-600 px-4 py-2 text-[10px] font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Send
                        </button>
                      </div>

                      {endpoint.pathParams.length > 0 && (
                        <div className="mb-3 space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Path Parameters</div>
                          {endpoint.pathParams.map((p) => (
                            <label key={p.key} className="block">
                              <span className="mb-1 block text-[10px] font-semibold text-slate-600">{p.key}</span>
                              <input
                                value={pathValues[p.key] ?? ''}
                                onChange={(e) => setPathValues((v) => ({ ...v, [p.key]: e.target.value }))}
                                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 font-mono text-[10px] text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              />
                            </label>
                          ))}
                        </div>
                      )}

                      {endpoint.queryParams.length > 0 && (
                        <div className="mb-3 space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Query Parameters</div>
                          {endpoint.queryParams.map((q) => (
                            <label key={q.key} className="block">
                              <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                                {q.key}
                                {q.required && <span className="text-rose-500">*</span>}
                              </span>
                              <input
                                value={queryValues[q.key] ?? ''}
                                onChange={(e) => setQueryValues((v) => ({ ...v, [q.key]: e.target.value }))}
                                placeholder={q.example}
                                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 font-mono text-[10px] text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              />
                            </label>
                          ))}
                        </div>
                      )}

                      {endpoint.bodyType !== 'none' && (
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Request Body</div>
                            <span className="font-mono text-[9px] text-slate-400">{endpoint.bodyType === 'json' ? 'JSON' : endpoint.bodyType}</span>
                          </div>
                          <textarea
                            value={bodyText}
                            onChange={(e) => setBodyText(e.target.value)}
                            spellCheck={false}
                            className="min-h-[260px] w-full resize-y rounded-lg border border-slate-200 bg-slate-950 px-3 py-3 font-mono text-[10px] leading-5 text-slate-100 outline-none focus:border-indigo-400"
                          />
                        </div>
                      )}

                    </section>

                    {/* Response */}
                    <section>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">Response</h4>
                        <div className="flex items-center gap-2">
                          {response && !response.loading && (
                            <span className={`rounded-md px-2 py-1 font-mono text-[9px] font-bold ${response.status >= 200 && response.status < 300 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {response.status} · {response.ms} ms
                            </span>
                          )}
                        </div>
                      </div>

                      {!response && (
                        <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-[10px] text-slate-400">
                          Response จะแสดงที่นี่หลังจากกด Send Request
                        </div>
                      )}

                      {response?.loading && (
                        <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-10 text-slate-400">
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          <span className="text-[10px]">Sending request...</span>
                        </div>
                      )}

                      {response && !response.loading && (
                        <>
                          {endpoint.id === 'generate-access-token' && response.status === 200 && typeof response.body === 'object' && response.body !== null && 'access_token' in response.body && (
                            <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                              <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">Access Token</div>
                              <div className="flex items-center gap-2 rounded-md border border-emerald-100 bg-white px-2.5 py-2">
                                <code className="min-w-0 flex-1 break-all font-mono text-[10px] text-slate-700">
                                  {(response.body as { access_token: string }).access_token}
                                </code>
                                <CopyButton text={(response.body as { access_token: string }).access_token} />
                              </div>
                            </div>
                          )}

                          <CodeBlock label="JSON">{JSON.stringify(response.body, null, 2)}</CodeBlock>

                          {endpoint.id === 'generate-access-token' && response.status === 200 && (
                            <button
                              type="button"
                              onClick={() => selectEndpoint('create-parcel-non-cod')}
                              className="mt-3 w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100"
                            >
                              Open Parcel API →
                            </button>
                          )}

                          {response.demo && (
                            <p className="mt-2 text-[9px] leading-5 text-slate-400">
                              Demo response — ตัวอย่างการตอบกลับจากข้อมูล endpoint ที่มีอยู่ใน Sandbox
                            </p>
                          )}
                        </>
                      )}
                    </section>

                    {/* Code Example */}
                    <section className="rounded-lg border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2.5">
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-bold text-slate-700">
                            Code Example
                          </h4>
                          <p className="mt-0.5 text-[9px] text-slate-400">
                            ตัวอย่างโค้ดสำหรับส่ง Request ในภาษาที่เลือก
                          </p>
                        </div>

                        <select
                          value={codeLanguage}
                          onChange={(e) =>
                            setCodeLanguage(e.target.value as ClientLibraryLanguage)
                          }
                          aria-label="Code example language"
                          className="shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                          {CLIENT_LIBRARY_LANGUAGES.map((language) => (
                            <option key={language} value={language}>
                              {language}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="p-3">
                        <CodeBlock label={codeLanguage}>
                          {codeExample}
                        </CodeBlock>
                      </div>
                    </section>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default Sandbox;
