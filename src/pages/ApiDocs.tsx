import { useState, useMemo, type ReactNode } from 'react';
import logo from '../assets/logo.png';

/* ============================================================
   TYPES
   ============================================================ */

type Method = 'GET' | 'POST' | 'DELETE';
type Env = 'test' | 'prod';
type BodyType = 'json' | 'formdata' | 'none';
type AuthType = 'none' | 'bearer';
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
  // Body examples vary in shape by endpoint (object, array, or form-data field list)
  bodyFields: BodyField[];
  bodyExample: unknown;
  successCode: number;
  successExample: unknown;
  errors: ErrorItem[];
}

type StringMap = Record<string, string>;
interface FormField {
  key: string;
  value: string;
}

type ApiResponseState =
  | { loading: true }
  | { loading?: false; status: number; ms: number; body: unknown; demo?: boolean }
  | null;

/* ============================================================
   DATA — extracted from MyExpress Open API Postman collection
   ============================================================ */

const BASE_URLS: Record<Env, string> = {
  test: 'https://dev-open-api.myexpress.ai',
  prod: 'https://open-api.myexpress.ai',
};

const METHOD_STYLE: Record<Method, { text: string; bg: string; ring: string; solid: string }> = {
  GET: { text: 'text-teal-700', bg: 'bg-teal-50', ring: 'ring-teal-200', solid: 'bg-teal-600' },
  POST: { text: 'text-indigo-700', bg: 'bg-indigo-50', ring: 'ring-indigo-200', solid: 'bg-indigo-600' },
  DELETE: { text: 'text-rose-700', bg: 'bg-rose-50', ring: 'ring-rose-200', solid: 'bg-rose-600' },
};

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
      { field: 'client_id', type: 'String', required: true, desc: 'client_id ที่ได้รับจากระบบ MyExpress' },
      { field: 'client_secret', type: 'String', required: true, desc: 'client_secret ที่ได้รับจากระบบ MyExpress' },
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

const GROUP_ORDER = ['Authentication', 'Parcel', 'Webhook', 'Print Label', 'Verify COD Account'] as const;
const GROUPS = GROUP_ORDER.map((g) => ({ label: g as string, items: ENDPOINTS.filter((e) => e.group === g) }));

const STATUS_TABLE: { code: number; detail: string }[] = [
  { code: 200, detail: 'Request is successful.' },
  { code: 400, detail: 'Error bad request' },
  { code: 401, detail: 'Error an access token is missing or unauthorized' },
  { code: 403, detail: 'Error find an account forbidden' },
  { code: 500, detail: 'Error internal server http request' },
];

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

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */

const MethodChip = ({ method, size = 'sm' }: { method: Method; size?: 'sm' | 'md' }) => {
  const s = METHOD_STYLE[method] || METHOD_STYLE.POST;
  const cls = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1';
  return <span className={`font-mono font-bold rounded ${s.bg} ${s.text} ${cls}`}>{method}</span>;
};

const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-1">
    <div className="text-[11px] font-semibold text-slate-500">{label}</div>
    {children}
  </div>
);

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="text-[10px] font-semibold text-slate-400 hover:text-slate-700 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-100"
    >
      {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอก'}
    </button>
  );
};

const CodeBlock = ({
  children,
  label,
  tone = 'dark',
}: {
  children: ReactNode;
  label?: string;
  tone?: 'dark' | 'light';
}) => (
  <div className="rounded-lg overflow-hidden border border-slate-200 shadow-sm">
    {label && (
      <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 border-b border-slate-200">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
        <CopyButton text={typeof children === 'string' ? children : ''} />
      </div>
    )}
    <pre className={`p-4 font-mono text-[11.5px] overflow-x-auto leading-relaxed whitespace-pre-wrap break-words ${tone === 'dark' ? 'bg-[#0B1220] text-indigo-100' : 'bg-white text-slate-700'}`}>
      {children}
    </pre>
  </div>
);

/* ============================================================
   OVERVIEW / INTRODUCTION
   ============================================================ */

function Overview({ onNavigate }: { onNavigate: (page: DocsPage, endpointId?: string) => void }) {
  return (
    <main className="flex-1 overflow-y-auto min-w-0 bg-white">
      <div className="max-w-4xl mx-auto px-8 py-10 space-y-10">
        <header className="space-y-3">
          <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Getting Started</div>
          <h1 className="text-3xl font-bold text-slate-900">MyExpress Open API</h1>
          <p className="text-sm text-slate-500 leading-7 max-w-2xl">Introduction and quick start guide for integrating your application with MyExpress Open API.</p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">Introduction</h2>
          <p className="text-sm text-slate-600 leading-7">This documentation covers the steps required to sign up as a Partner and use MyExpress Open API, including authentication, parcel APIs, and webhook integration.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              ['Signing Up', 'เริ่มต้นสมัคร Partner และรับ credentials สำหรับ Test Environment.'],
              ['API Use Suggestion', 'Environment, HTTP status codes และรูปแบบ Error Response.'],
              ['Authentication / Authorization', 'สร้าง Access Token ด้วย OAuth 2.0 Client Credentials.'],
              ['Parcel API', 'สร้าง ค้นหา ลบพัสดุ และตรวจสอบสถานะการชำระเงิน COD.'],
              ['Webhook', 'ทดสอบการรับสถานะพัสดุผ่าน Webhook ใน Test Environment.'],
            ].map(([title, description]) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-bold text-slate-900">{title}</div>
                <p className="mt-1.5 text-xs text-slate-500 leading-6">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div><h2 className="text-lg font-bold text-slate-900">Signing Up</h2><p className="text-sm text-slate-500 mt-1">ขั้นตอนการสมัครและเตรียมพร้อมสำหรับการใช้งาน API</p></div>
          <div className="relative ml-2 border-l border-slate-200 pl-7 space-y-5">
            {[
              ['01', 'Partner submit Google Form', 'Partner ส่งแบบฟอร์มเพื่อสมัครใช้งาน MyExpress Open API.', 'https://forms.gle/FHuFkuTXCHW9kBTR9'],
              ['02', 'MyExpress create Partner Account', 'สร้าง account information, generate client_id / client_secret และ setup webhook.'],
              ['03', 'Receive Test Credentials', 'MyExpress ส่ง client_id และ client_secret สำหรับ Test Environment.'],
              ['04', 'Partner self-test', 'ทดสอบ API Use Suggestion, Authentication / Authorization, Create & Delete Parcel และ Webhook.'],
              ['05', 'Plan go-live', 'Partner เตรียมความพร้อมเพื่อใช้งาน Production Environment.'],
              ['06', 'Receive Production Credentials', 'MyExpress ส่ง client_id และ client_secret สำหรับ Production Environment.'],
            ].map(([num, title, desc, link]) => (
              <div key={num} className="relative">
                <span className="absolute -left-[45px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">{num}</span>
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-6">{desc}</p>
                {link && <a href={link} target="_blank" rel="noreferrer" className="inline-flex mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800">Open Google Form →</a>}
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800"><strong>Credentials:</strong> client_id และ client_secret เป็นข้อมูลสำหรับ Partner โดยเฉพาะ ควรเก็บเป็นความลับและไม่เผยแพร่ใน client-side code หรือ source control</div>
        </section>

        <section className="space-y-4">
          <div><h2 className="text-lg font-bold text-slate-900">API Use Suggestion</h2><p className="text-sm text-slate-500 mt-1">Base URL และมาตรฐาน Response ที่ใช้กับ API</p></div>
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">Environment</div>
            <table className="w-full text-left text-xs"><thead className="bg-white text-slate-500 border-b border-slate-100"><tr><th className="p-3">Environment</th><th className="p-3">URL</th></tr></thead><tbody className="divide-y divide-slate-100">
              <tr><td className="p-3 font-semibold">Test</td><td className="p-3 font-mono text-indigo-700">https://dev-open-api.myexpress.ai</td></tr>
              <tr><td className="p-3 font-semibold">Production</td><td className="p-3 font-mono text-indigo-700">https://open-api.myexpress.ai</td></tr>
            </tbody></table>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">Response Status Code</div>
            <table className="w-full text-left text-xs"><thead className="bg-white text-slate-500 border-b border-slate-100"><tr><th className="p-3 w-24">Status</th><th className="p-3">Detail</th></tr></thead><tbody className="divide-y divide-slate-100">
              {STATUS_TABLE.map((status) => <tr key={status.code}><td className="p-3 font-mono font-bold">{status.code}</td><td className="p-3 text-slate-600">{status.detail}</td></tr>)}
            </tbody></table>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-700">Error Response Detail</div>
            <table className="w-full text-left text-xs"><thead className="bg-white text-slate-500 border-b border-slate-100"><tr><th className="p-3">Name</th><th className="p-3">Description</th><th className="p-3">Type</th></tr></thead><tbody className="divide-y divide-slate-100">
              {[['status', 'status error code', 'Number'], ['error_description', 'error description', 'String'], ['name', 'error name from Bad request', 'String'], ['error', 'error name', 'String'], ['message', 'detail error', 'String']].map(([name, description, type]) => <tr key={name}><td className="p-3 font-mono font-semibold text-indigo-700">{name}</td><td className="p-3 text-slate-600">{description}</td><td className="p-3 font-mono text-slate-400">{type}</td></tr>)}
            </tbody></table>
          </div>
        </section>

        <section className="space-y-4"><h2 className="text-lg font-bold text-slate-900">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {[['1', 'Sign Up', 'สมัคร Partner'], ['2', 'Get Credentials', 'รับ client_id / client_secret'], ['3', 'Self-Test', 'ทดสอบใน Test Environment'], ['4', 'Go Live', 'รับ Production Credentials']].map(([num, title, desc]) => <div key={num} className="rounded-xl border border-slate-200 p-4 bg-white"><div className="text-xs font-bold text-indigo-600">STEP {num}</div><div className="mt-2 text-sm font-bold text-slate-900">{title}</div><div className="mt-1 text-xs text-slate-500">{desc}</div></div>)}
          </div>
        </section>

        <section className="space-y-4 pb-8"><h2 className="text-lg font-bold text-slate-900">Explore API</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[['Authentication', 'Generate Access Token', 'generate-access-token'], ['Parcel API', 'Create Parcel — NON_COD', 'create-parcel-non-cod'], ['Webhook', 'Simulate Thaipost Webhook', 'simulate-thaipost-webhook']].map(([group, title, id]) => <button key={id} onClick={() => onNavigate('docs', id)} className="text-left rounded-xl border border-slate-200 p-4 bg-white hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"><div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{group}</div><div className="mt-2 text-sm font-bold text-slate-900">{title}</div><div className="mt-2 text-xs font-semibold text-indigo-600">View API →</div></button>)}
          </div>
        </section>
      </div>
    </main>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export function ApiDocs() {
  const [page, setPage] = useState<DocsPage>('overview');
  const [activeId, setActiveId] = useState<string>(ENDPOINTS[0].id);
  const [env, setEnv] = useState<Env>('test');
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const endpoint = useMemo(() => ENDPOINTS.find((e) => e.id === activeId) || ENDPOINTS[0], [activeId]);

  // ---- Try it out state (keyed by endpoint so switching resets the form) ----
  const initFor = (ep: Endpoint): { pv: StringMap; qv: StringMap; body: string } => {
    const pv: StringMap = {};
    ep.pathParams.forEach((p) => (pv[p.key] = p.example));
    const qv: StringMap = {};
    ep.queryParams.forEach((q) => (qv[q.key] = q.required ? q.example : ''));
    return { pv, qv, body: ep.bodyExample != null ? JSON.stringify(ep.bodyExample, null, 2) : '' };
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

  const filteredGroups = GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((it) => it.name.toLowerCase().includes(search.toLowerCase()) || it.path.toLowerCase().includes(search.toLowerCase())),
  })).filter((g) => g.items.length);

  const handleSend = () => {
    setResponse({ loading: true });
    const delay = 500 + Math.random() * 400;
    setTimeout(() => {
      const hasToken = token.trim().length > 0;
      if (endpoint.auth === 'bearer' && !hasToken) {
        setResponse({ status: 401, ms: Math.round(delay), body: { status: 401, message: 'Access token is missing or unauthorized', name: 'UnauthorizedException' }, demo: true });
        return;
      }
      setResponse({ status: endpoint.successCode, ms: Math.round(delay), body: endpoint.successExample, demo: true });
    }, delay);
  };

  const curl = buildCurl(endpoint, env, token, pathValues, queryValues, bodyText);
  const resolvedUrl = BASE_URLS[env] + buildResolvedPath(endpoint, pathValues) + buildQueryString(endpoint, queryValues);

  const goLanding = () => {
    window.location.assign('/');
  };

  if (page === 'overview') {
    return (
      <div className="flex h-screen bg-slate-50 text-slate-800 font-sans text-sm">
        <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
          <div className="h-14 px-4 flex items-center gap-2 border-b border-slate-100 shrink-0">
            <button onClick={goLanding} className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left" title="กลับหน้า Landing Page">
              <img
                src={logo}
                alt="MyExpress"
                className="w-8 h-8 object-contain"
              />
              <div className="leading-tight"><div className="font-bold text-sm text-slate-900">MyExpress Open API Document</div>
              </div>
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto py-3">
            <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Getting Started</div>
            <button onClick={() => setPage('overview')} className="w-full flex items-center px-4 py-2 text-xs text-left bg-indigo-50 text-indigo-800 font-semibold">Overview</button>
            {GROUPS.map((group) => <div key={group.label} className="mt-2"><div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{group.label}</div><div className="px-2 space-y-0.5">{group.items.map((item) => <button key={item.id} onClick={() => selectEndpoint(item.id)} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-left text-slate-600 hover:bg-slate-50"><MethodChip method={item.method} /><span className="truncate">{item.name}</span></button>)}</div></div>)}
          </nav>
          
        </aside>
        <Overview onNavigate={(target, id) => { if (id) selectEndpoint(id); else setPage(target); }} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans text-sm">
      {/* ================= Sidebar ================= */}
      <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col h-full">
        <div className="h-14 px-4 flex items-center gap-2 border-b border-slate-100 shrink-0">
          <button onClick={goLanding} className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left" title="กลับหน้า Landing Page">
            <img
              src={logo}
              alt="MyExpress"
              className="w-8 h-8 object-contain"
            />
            <div className="leading-tight">
              <div className="font-bold text-sm text-slate-900">MyExpress Open API Document</div>
            </div>
          </button>
        </div>

        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา endpoint..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 placeholder:text-slate-400"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          <div className="mb-1">
            <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Getting Started</div>
            <div className="px-2 space-y-0.5">
              <button onClick={() => setPage('overview')} className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-left text-slate-600 hover:bg-slate-50">
                <span className="w-3.5 text-center text-slate-400">⌂</span><span className="truncate">Overview</span>
              </button>
            </div>
          </div>
          {filteredGroups.map((group) => {
            const collapsed = collapsedGroups[group.label];
            return (
              <div key={group.label} className="mb-1">
                <button
                  onClick={() => setCollapsedGroups((s) => ({ ...s, [group.label]: !s[group.label] }))}
                  className="w-full flex items-center justify-between px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600"
                >
                  {group.label}
                  <svg className={`w-3 h-3 transition-transform ${collapsed ? '-rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {!collapsed && (
                  <div className="px-2 space-y-0.5">
                    {group.items.map((item) => {
                      const active = item.id === activeId;
                      return (
                        <button
                          key={item.id}
                          onClick={() => selectEndpoint(item.id)}
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-left transition-colors ${active ? 'bg-indigo-50 text-indigo-800 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                          <MethodChip method={item.method} />
                          <span className="truncate">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* ================= Main content ================= */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="max-w-3xl mx-auto px-8 py-8 space-y-8">
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">{endpoint.group}</div>
            <h1 className="text-2xl font-bold text-slate-900">{endpoint.name}</h1>
            <p className="text-[13px] text-slate-500 leading-relaxed">{endpoint.summary}</p>
          </div>

          <div className="flex items-stretch rounded-lg border border-slate-200 overflow-hidden font-mono text-xs shadow-sm">
            <span className={`px-3 py-2 font-bold text-white ${METHOD_STYLE[endpoint.method].solid}`}>{endpoint.method}</span>
            <span className="px-3 py-2 bg-white text-slate-700 flex-1 truncate">{endpoint.path}</span>
          </div>

          {endpoint.auth === 'bearer' && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
              <span>🔒</span> ต้องแนบ <code className="font-mono bg-white px-1 rounded border border-amber-200">Authorization: Bearer &#123;access_token&#125;</code> ใน Header ทุกครั้ง
            </div>
          )}

          {endpoint.headers.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Headers</h3>
              <table className="w-full text-left border-collapse text-xs bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <th className="p-2.5 font-semibold">Key</th>
                    <th className="p-2.5 font-semibold">Value</th>
                    <th className="p-2.5 font-semibold w-20">Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {endpoint.headers.map((h) => (
                    <tr key={h.key}>
                      <td className="p-2.5 font-mono font-semibold text-indigo-700">{h.key}</td>
                      <td className="p-2.5 font-mono text-slate-500">{h.value}</td>
                      <td className="p-2.5">{h.required && <span className="text-[10px] font-bold text-rose-500">required</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {endpoint.pathParams.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Path Params</h3>
              <table className="w-full text-left border-collapse text-xs bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <th className="p-2.5 font-semibold">Name</th>
                    <th className="p-2.5 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {endpoint.pathParams.map((p) => (
                    <tr key={p.key}>
                      <td className="p-2.5 font-mono font-semibold text-indigo-700 align-top whitespace-nowrap">{p.key}</td>
                      <td className="p-2.5 text-slate-600">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {endpoint.queryParams.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Query Params</h3>
              <table className="w-full text-left border-collapse text-xs bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <th className="p-2.5 font-semibold">Name</th>
                    <th className="p-2.5 font-semibold w-20">Required</th>
                    <th className="p-2.5 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {endpoint.queryParams.map((p) => (
                    <tr key={p.key}>
                      <td className="p-2.5 font-mono font-semibold text-indigo-700 whitespace-nowrap">{p.key}</td>
                      <td className="p-2.5">{p.required ? <span className="text-[10px] font-bold text-rose-500">required</span> : <span className="text-[10px] text-slate-400">optional</span>}</td>
                      <td className="p-2.5 text-slate-600">{p.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {endpoint.bodyFields.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Request Body</h3>
              <table className="w-full text-left border-collapse text-xs bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <th className="p-2.5 font-semibold">Field</th>
                    <th className="p-2.5 font-semibold w-20">Type</th>
                    <th className="p-2.5 font-semibold w-20">Required</th>
                    <th className="p-2.5 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {endpoint.bodyFields.map((f) => (
                    <tr key={f.field}>
                      <td className="p-2.5 font-mono font-semibold text-indigo-700 align-top whitespace-nowrap">{f.field}</td>
                      <td className="p-2.5 font-mono text-slate-400 align-top">{f.type}</td>
                      <td className="p-2.5 align-top">{f.required ? <span className="text-[10px] font-bold text-rose-500">required</span> : <span className="text-[10px] text-slate-400">optional</span>}</td>
                      <td className="p-2.5 text-slate-600 align-top">{f.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {endpoint.bodyExample != null && (
                <CodeBlock label={endpoint.bodyType === 'formdata' ? 'form-data (ตัวอย่าง)' : 'Request Body — JSON'}>
                  {endpoint.bodyType === 'formdata'
                    ? (endpoint.bodyExample as FormField[]).map((f) => `${f.key}: ${f.value}`).join('\n')
                    : JSON.stringify(endpoint.bodyExample, null, 2)}
                </CodeBlock>
              )}
            </section>
          )}

          <section className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Response</h3>
              <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-mono">{endpoint.successCode} OK</span>
            </div>
            <CodeBlock tone="dark">{JSON.stringify(endpoint.successExample, null, 2)}</CodeBlock>
          </section>

          {endpoint.errors.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Error Response</h3>
              {endpoint.errors.map((e) => (
                <CodeBlock key={e.code} tone="light" label={`${e.code} · ${e.name}`}>
                  {JSON.stringify(e.body, null, 2)}
                </CodeBlock>
              ))}
            </section>
          )}

          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">HTTP Status Codes</h3>
            <table className="w-full text-left border-collapse text-xs bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <tbody className="divide-y divide-slate-100">
                {STATUS_TABLE.map((s) => (
                  <tr key={s.code}>
                    <td className="p-2.5 font-mono font-bold text-slate-700 w-16">{s.code}</td>
                    <td className="p-2.5 text-slate-600">{s.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </main>

      {/* ================= Try it out panel ================= */}
      <aside className="w-[380px] shrink-0 bg-white border-l border-slate-200 h-full flex flex-col">
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-100 shrink-0">
          <span className="font-bold text-sm text-slate-900">Try it out</span>
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{env === 'test' ? 'Sandbox' : 'Production'}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-stretch rounded-lg overflow-hidden border border-slate-200">
            <span className={`px-2.5 py-2 text-[11px] font-bold text-white font-mono ${METHOD_STYLE[endpoint.method].solid}`}>{endpoint.method}</span>
            <input
              readOnly
              value={resolvedUrl}
              title={resolvedUrl}
              className="flex-1 px-2 py-2 text-[11px] font-mono text-slate-600 outline-none min-w-0"
            />
            <button
              onClick={handleSend}
              className="px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shrink-0"
            >
              Send
            </button>
          </div>

          <Field label="Credentials">
            <div className="relative">
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="วาง access_token ที่นี่"
                className="w-full px-2.5 py-1.5 text-xs font-mono border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
            {endpoint.id === 'generate-access-token' && (
              <p className="text-[10px] text-slate-400">endpoint นี้ไม่ต้องใช้ token — ใช้ client_id / client_secret ใน body แทน</p>
            )}
          </Field>

          {endpoint.pathParams.length > 0 && (
            <Field label="Path Params">
              <div className="space-y-2">
                {endpoint.pathParams.map((p) => (
                  <div key={p.key} className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500 w-24 shrink-0 truncate">{p.key}</span>
                    <input
                      value={pathValues[p.key] ?? ''}
                      onChange={(e) => setPathValues((v) => ({ ...v, [p.key]: e.target.value }))}
                      className="flex-1 px-2 py-1 text-[11px] font-mono border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 min-w-0"
                    />
                  </div>
                ))}
              </div>
            </Field>
          )}

          {endpoint.queryParams.length > 0 && (
            <Field label="Query Params">
              <div className="space-y-2">
                {endpoint.queryParams.map((p) => (
                  <div key={p.key} className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-500 w-24 shrink-0 truncate" title={p.key}>{p.key}{p.required && <span className="text-rose-500">*</span>}</span>
                    <input
                      value={queryValues[p.key] ?? ''}
                      onChange={(e) => setQueryValues((v) => ({ ...v, [p.key]: e.target.value }))}
                      placeholder={p.example}
                      className="flex-1 px-2 py-1 text-[11px] font-mono border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200 min-w-0"
                    />
                  </div>
                ))}
              </div>
            </Field>
          )}

          {endpoint.bodyType === 'json' && (
            <Field label="Body (JSON)">
              <textarea
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                rows={10}
                spellCheck={false}
                className="w-full px-2.5 py-2 text-[11px] font-mono border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 bg-slate-50"
              />
            </Field>
          )}

          {endpoint.bodyType === 'formdata' && (
            <Field label="Body (form-data)">
              <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-md p-2.5">
                {(endpoint.bodyExample as FormField[]).map((f) => (
                  <div key={f.key} className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-slate-500 w-14 shrink-0">{f.key}</span>
                    <span className="flex-1 text-slate-700 truncate">{f.value}</span>
                  </div>
                ))}
                <p className="text-[10px] text-slate-400 font-sans pt-1">อัปโหลดไฟล์จริงได้จากแอปฝั่งของท่าน — ที่นี่แสดงตัวอย่างค่าที่ต้องส่ง</p>
              </div>
            </Field>
          )}

          <Field label="cURL">
            <CodeBlock>{curl}</CodeBlock>
          </Field>

          <div className="pt-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Response</span>
              {response && !response.loading && (
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${response.status < 300 ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'}`}>{response.status}</span>
                  <span className="text-[10px] text-slate-400">{response.ms} ms</span>
                </div>
              )}
            </div>

            {!response && (
              <div className="flex flex-col items-center justify-center gap-2 py-10 border border-dashed border-slate-200 rounded-lg text-slate-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-[11px]">กด Send เพื่อดูตัวอย่างการตอบกลับ</span>
              </div>
            )}

            {response?.loading && (
              <div className="flex items-center justify-center gap-2 py-10 border border-slate-200 rounded-lg text-slate-400">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                <span className="text-[11px]">กำลังส่งคำขอ...</span>
              </div>
            )}

            {response && !response.loading && (
              <>
                <CodeBlock tone="dark">{JSON.stringify(response.body, null, 2)}</CodeBlock>
                {response.demo && (
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    * โหมดสาธิต — แสดงตัวอย่างการตอบกลับสำหรับ endpoint นี้ ยังไม่ได้เชื่อมต่อกับเซิร์ฟเวอร์จริง
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default ApiDocs;