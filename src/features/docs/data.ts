import type { Endpoint, Method } from './types';
export const METHOD_STYLE: Record<
  Method,
  {
    text: string;
    bg: string;
    border: string;
    solid: string;
  }
> = {
  GET: {
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    solid: 'bg-emerald-600',
  },
  POST: {
    text: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    solid: 'bg-indigo-600',
  },
  DELETE: {
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    solid: 'bg-rose-600',
  },
};

export const GROUP_ORDER = [
  'Authentication',
  'Parcel',
  'Webhook',
  'Print Label',
  'Verify COD Account',
] as const;

export const STATUS_TABLE = [
  {
    code: 200,
    detail: 'Request is successful.',
  },
  {
    code: 400,
    detail: 'Error bad request',
  },
  {
    code: 401,
    detail: 'Error an access token is missing or unauthorized',
  },
  {
    code: 403,
    detail: 'Error find an account forbidden',
  },
  {
    code: 500,
    detail: 'Error internal server http request',
  },
];

/* ============================================================
   DATA
   ============================================================ */

export const ENDPOINTS: Endpoint[] = [
  {
    id: 'generate-access-token',
    group: 'Authentication',
    name: 'Generate Access Token',
    method: 'POST',
    path: '/v1/auth/oauth2/token',
    summary:
      'แลก client_id / client_secret เป็น access_token สำหรับเรียก API อื่น ๆ',
    auth: 'none',
    headers: [
      {
        key: 'Content-Type',
        value: 'application/json',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'client_id',
        type: 'String',
        required: true,
        desc: 'client_id ที่ได้รับจากระบบ MyAPI',
      },
      {
        field: 'client_secret',
        type: 'String',
        required: true,
        desc: 'client_secret ที่ได้รับจากระบบ MyAPI',
      },
      {
        field: 'grant_type',
        type: 'String',
        required: true,
        desc: 'ค่าคงที่ = client_credentials',
      },
      {
        field: 'scope',
        type: 'String',
        required: true,
        desc: 'ขอบเขตการเข้าถึง เช่น parcel',
      },
    ],
    bodyExample: {
      client_id: 'maF8xqVVCnz0Z4mgXQnvuWHHddC33RN7',
      client_secret: 'fQbMMUd3EcP9HjTaakrxvWjugMuuremA',
      grant_type: 'client_credentials',
      scope: 'parcel',
    },
    successCode: 200,
    successExample: {
      expires_in: 7200,
      token_type: 'bearer',
      access_token: 'Zznl0qTp3p75ceFIntT1XXQcVS44ZCl3',
    },
    errors: [
      {
        code: 400,
        name: 'invalid_client',
        body: {
          error: 'invalid_client',
          error_description: 'Invalid client authentication',
        },
      },
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
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
      {
        key: 'Content-Type',
        value: 'application/json',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'express',
        type: 'String',
        required: true,
        desc: 'ชื่อขนส่ง — "THAI_POST"',
      },
      {
        field: 'sender',
        type: 'Object',
        required: true,
        desc: 'ข้อมูลผู้ส่ง (name, phoneNumber, address, subDistrict, district, province, zipCode)',
      },
      {
        field: 'receiver',
        type: 'Object',
        required: true,
        desc: 'ข้อมูลผู้รับ (โครงสร้างเดียวกับ sender)',
      },
      {
        field: 'note',
        type: 'String',
        required: false,
        desc: 'หมายเหตุ',
      },
      {
        field: 'weightGram',
        type: 'Number',
        required: true,
        desc: 'น้ำหนักพัสดุ (10–20,000 กรัม)',
      },
      {
        field: 'isInsured',
        type: 'Boolean',
        required: false,
        desc: 'ต้องการประกันพัสดุหรือไม่',
      },
      {
        field: 'insuranceDeclaredValue',
        type: 'Number',
        required: false,
        desc: 'วงเงินเอาประกัน (0–50,000) เมื่อ isInsured = true',
      },
      {
        field: 'insuranceProductPrice',
        type: 'Number',
        required: false,
        desc: 'ราคาสินค้าภายในกล่อง เมื่อ isInsured = true',
      },
    ],
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
      receiver: {
        name: 'คุณมายเอ็กซ์เพรส ชลบุรี',
        phoneNumber: '0989392917',
        address:
          '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1',
        subDistrict: 'หนองขาม',
        district: 'ศรีราชา',
        province: 'ชลบุรี',
        zipCode: '20230',
      },
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
        note: '',
        id: '8a88a0acb0ff10fb526cb3de97f7c1681e8cc488...OP1721804390165',
        sender: {
          name: 'คุณมายเอ็กซ์เพรส ภูเก็ต',
          phoneNumber: '0813150764',
          address: '69/429 หมู่ 2',
          subDistrict: 'วิชิต',
          district: 'เมืองภูเก็ต',
          province: 'ภูเก็ต',
          zipCode: '83000',
        },
        receiver: {
          name: 'คุณมายเอ็กซ์เพรส ชลบุรี',
          phoneNumber: '0989392917',
          address:
            '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1',
          subDistrict: 'หนองขาม',
          district: 'ศรีราชา',
          province: 'ชลบุรี',
          zipCode: '20230',
        },
        shipping: {
          express: 'THAI_POST',
          statusLog: [],
          trackingNumber: 'JB048855193TH',
          weightGram: 1000,
        },
        status: 'NEW',
        type: 'NON_COD',
        createdAt: '2024-07-24T06:59:50.165Z',
        updatedAt: '2024-07-24T06:59:50.564Z',
        weightGram: 1000,
        isInsured: true,
        insuranceDeclaredValue: 3500,
        insuranceProductPrice: 3000,
      },
    },
    errors: [
      {
        code: 400,
        name: 'BadRequestException',
        body: {
          status: 400,
          message: 'Express name: undefined is not allow.',
          name: 'BadRequestException',
        },
      },
    ],
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
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
      {
        key: 'Content-Type',
        value: 'application/json',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'express',
        type: 'String',
        required: true,
        desc: 'ชื่อขนส่ง — "THAI_POST"',
      },
      {
        field: 'sender.phoneNumber',
        type: 'String',
        required: true,
        desc: 'เบอร์โทรของบัญชี COD ที่ลงทะเบียน (9–10 หลัก)',
      },
      {
        field: 'sender.email',
        type: 'String',
        required: true,
        desc: 'อีเมลของบัญชี COD ที่ลงทะเบียน',
      },
      {
        field: 'receiver',
        type: 'Object',
        required: true,
        desc: 'ข้อมูลผู้รับ',
      },
      {
        field: 'weightGram',
        type: 'Number',
        required: true,
        desc: 'น้ำหนักพัสดุ (10–20,000 กรัม)',
      },
      {
        field: 'codEnabled',
        type: 'Boolean',
        required: true,
        desc: 'ระบุว่าเป็นพัสดุ COD',
      },
      {
        field: 'codAmount',
        type: 'Number',
        required: true,
        desc: 'มูลค่า COD หน่วยบาท (> 0)',
      },
      {
        field: 'insideBoxDetail',
        type: 'Object[]',
        required: true,
        desc: 'รายการสิ่งของภายในกล่อง (1–30 รายการ)',
      },
      {
        field: 'isInsured',
        type: 'Boolean',
        required: false,
        desc: 'ต้องการประกันพัสดุหรือไม่',
      },
      {
        field: 'insuranceDeclaredValue',
        type: 'Number',
        required: false,
        desc: 'วงเงินเอาประกัน เมื่อ isInsured = true',
      },
    ],
    bodyExample: {
      express: 'THAI_POST',
      sender: {
        phoneNumber: '0900000000',
        email: 'test@test.com',
      },
      receiver: {
        name: 'คุณมายเอ็กซ์เพรส ชลบุรี',
        phoneNumber: '0989392917',
        address:
          '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1',
        subDistrict: 'หนองขาม',
        district: 'ศรีราชา',
        province: 'ชลบุรี',
        zipCode: '20230',
      },
      note: '',
      weightGram: 1000,
      codEnabled: true,
      codAmount: 100,
      insideBoxDetail: [
        {
          name: 'อุปกรณ์อิเล็กทรอนิกส์',
          type: 'กล้อง Cannon',
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
    successCode: 200,
    successExample: {
      message: 'create parcel success',
      data: {
        message: 'create parcel success',
        codAmount: 100,
        codEnabled: true,
        codFee: 1.3,
        codFeeVat: 0.09,
      },
    },
    errors: [
      {
        code: 400,
        name: 'BadRequestException',
        body: {
          status: 400,
          message: 'codAmount must be greater than 0',
          name: 'BadRequestException',
        },
      },
    ],
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
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
      {
        key: 'Content-Type',
        value: 'application/json',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'express',
        type: 'String',
        required: true,
        desc: 'ชื่อขนส่ง — "THAI_POST"',
      },
      {
        field: 'trackingNumbers',
        type: 'String[]',
        required: true,
        desc: 'รายการเลข tracking ที่ต้องการค้นหา',
      },
    ],
    bodyExample: {
      express: 'THAI_POST',
      trackingNumbers: [
        'JB052917036TH',
        'JB052917037TH',
        'JB050236582TH',
      ],
    },
    successCode: 200,
    successExample: {
      notFoundTrackingNumbers: ['JB012345678TH'],
      express: 'THAI_POST',
      data: [
        {
          note: '',
          id: '1211c0bccc0142404df1274999e94d0...OP1723622204784',
          receiver: {
            name: 'คุณมายเอ็กซ์เพรส ชลบุรี',
            phoneNumber: '0989392917',
            address: '188/273 ...',
            subDistrict: 'หนองขาม',
            district: 'ศรีราชา',
            province: 'ชลบุรี',
            zipCode: '20230',
          },
          sender: {
            name: 'คุณมายเอ็กซ์เพรส ภูเก็ต',
            phoneNumber: '0813150764',
            address: '69/429 หมู่ 2',
            subDistrict: 'วิชิต',
            district: 'เมืองภูเก็ต',
            province: 'ภูเก็ต',
            zipCode: '83000',
          },
          shipping: {
            express: 'THAI_POST',
            statusLog: [],
            trackingNumber: 'JB052917036TH',
            weightGram: 1000,
          },
          status: 'NEW',
          type: 'NON_COD',
          createdAt: '2024-08-14T07:56:44.783Z',
          updatedAt: '2024-08-14T07:56:44.957Z',
          weightGram: 1000,
        },
      ],
    },
    errors: [
      {
        code: 400,
        name: 'BadRequestException',
        body: {
          status: 400,
          message:
            'Express name: undefined is not allow. Please change to express that you can accept.',
          name: 'BadRequestException',
        },
      },
    ],
  },

  {
    id: 'delete-parcel',
    group: 'Parcel',
    name: 'Delete Parcel',
    method: 'DELETE',
    path: '/v1/parcel/:parcelId',
    summary: 'ลบพัสดุที่สร้างไว้ด้วย parcel id',
    auth: 'bearer',
    headers: [
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
    ],
    pathParams: [
      {
        key: 'parcelId',
        example:
          '8a88a0acb0ff10fb526cb3de97f7c1681e8cc488...OP1721804390165',
        desc: 'id ที่ได้รับหลังจากสร้างพัสดุ',
      },
    ],
    queryParams: [],
    bodyType: 'none',
    bodyFields: [],
    bodyExample: null,
    successCode: 200,
    successExample: {
      message:
        'delete parcelNumber: 8a88a0acb0ff10fb526cb3de97f7c1681e8cc488...OP1721804390165 success',
    },
    errors: [
      {
        code: 404,
        name: 'NotFoundException',
        body: {
          status: 404,
          message: 'Parcel with refId=[1721804390165] not found',
          name: 'NotFoundException',
        },
      },
    ],
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
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
      {
        key: 'Content-Type',
        value: 'application/json',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [
      {
        key: 'trackingNumber',
        example: 'JA000000000TH',
        required: true,
        desc: 'เลขพัสดุ',
      },
    ],
    bodyType: 'none',
    bodyFields: [],
    bodyExample: null,
    successCode: 200,
    successExample: {
      trackingNumber: 'JA056666917TH',
      codTransferStatus: 'REJECTED',
      codTransferDate: '',
      shippingCost: {
        totalAmount: 18.391,
        shippingCost: 17,
        codAmount: 100,
        codFee: 1.3,
        codVat: 0.091,
        specialAreaCost: 0,
      },
    },
    errors: [],
  },

  {
    id: 'simulate-thaipost-webhook',
    group: 'Webhook',
    name: 'Simulate Thaipost Webhook',
    method: 'POST',
    path: '/v1/simulate/thaipost/webhook',
    summary:
      'จำลองการยิง webhook สถานะพัสดุจากไปรษณีย์ไทย สำหรับทดสอบใน sandbox',
    auth: 'bearer',
    headers: [
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
      {
        key: 'Content-Type',
        value: 'application/json',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'barcode',
        type: 'String',
        required: true,
        desc: 'เลข tracking จากขนส่ง',
      },
      {
        field: 'weight',
        type: 'Number',
        required: true,
        desc: 'น้ำหนัก หน่วยกรัม',
      },
      {
        field: 'cod',
        type: 'String',
        required: true,
        desc: '"yes" หรือ "no"',
      },
      {
        field: 'status',
        type: 'String',
        required: true,
        desc: 'status code จากขนส่ง',
      },
      {
        field: 'statusDescription',
        type: 'String',
        required: true,
        desc: 'คำอธิบายสถานะ',
      },
      {
        field: 'statusDate',
        type: 'String',
        required: true,
        desc: 'วันเวลาที่ได้รับสถานะ',
      },
      {
        field: 'station',
        type: 'String',
        required: true,
        desc: 'ที่ทำการไปรษณีย์',
      },
    ],
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
    successCode: 200,
    successExample: {
      errorCode: '000',
      errorDetail: 'success',
      status: 'true',
    },
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
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
      {
        key: 'Content-Type',
        value: 'application/json',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'size',
        type: 'String',
        required: true,
        desc: 'TSC_100_75, TSC_100_100, TSC_100_150, TSC_100_180, MINI_57_100',
      },
      {
        field: 'parcelIds',
        type: 'String[]',
        required: true,
        desc: 'รหัสพัสดุ ไม่เกิน 20 รายการ',
      },
    ],
    bodyExample: {
      size: 'TSC_100_75',
      parcelIds: [
        '7b50a746b657a0c5e96ba46888afe37b2389be97c298e3774f64fcfd9f9a575fOP1723535199935',
      ],
    },
    successCode: 200,
    successExample: {
      note: 'Response จะถูกส่งกลับเป็นไฟล์ PDF แบบ blob (Content-Type: application/pdf)',
    },
    errors: [
      {
        code: 400,
        name: 'BadRequestException',
        body: {
          status: 400,
          message:
            'The number of parcel IDs must be greater than 0 and not exceed the limit of 20.',
          name: 'BadRequestException',
        },
      },
    ],
  },

  {
    id: 'upload-image-file',
    group: 'Verify COD Account',
    name: 'Upload Image by File',
    method: 'POST',
    path: '/v1/account/sender-cod/image',
    summary:
      'อัปโหลดรูปภาพยืนยันตัวตนจากไฟล์ในเครื่อง (multipart/form-data)',
    auth: 'bearer',
    headers: [
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
      {
        key: 'Content-Type',
        value: 'multipart/form-data',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'formdata',
    bodyFields: [
      {
        field: 'file',
        type: 'File',
        required: true,
        desc: 'ไฟล์รูปภาพ png หรือ jpg ขนาดไม่เกิน 20 MB',
      },
      {
        field: 'type',
        type: 'String',
        required: true,
        desc: 'BOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE',
      },
    ],
    bodyExample: [
      {
        key: 'file',
        value: 'sample.png',
      },
      {
        key: 'type',
        value: 'BOOKBANK',
      },
    ],
    successCode: 200,
    successExample: {
      directory:
        'mxp-bookbank-cod-image/mxp-bookbank-cod-image/xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png',
    },
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
    headers: [
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'url',
        type: 'String',
        required: true,
        desc: 'Public URL ของรูปภาพ',
      },
      {
        field: 'type',
        type: 'String',
        required: true,
        desc: 'BOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE',
      },
    ],
    bodyExample: {
      url: 'https://storage.googleapis.com/beta-mxp-image/sample.png',
      type: 'PERSON_ID_CARD',
    },
    successCode: 200,
    successExample: {
      directory:
        'beta-mxp-identification-cod-image/mxp-identification-cod-image/idCard_669f693984d21500143eb80a_1728763660035.jpg',
    },
    errors: [
      {
        code: 400,
        name: 'BadRequestException',
        body: {
          status: 400,
          message: 'Url is required.',
          name: 'BadRequestException',
        },
      },
    ],
  },

  {
    id: 'get-image-file',
    group: 'Verify COD Account',
    name: 'Get Image File',
    method: 'POST',
    path: '/v1/account/sender-cod/image/view',
    summary: 'ดึงไฟล์รูปภาพที่เคยอัปโหลดไว้จาก directory path',
    auth: 'bearer',
    headers: [
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'directory',
        type: 'String',
        required: true,
        desc: 'ที่อยู่ไฟล์ที่ได้จาก Upload Image API',
      },
      {
        field: 'type',
        type: 'String',
        required: true,
        desc: 'BOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE',
      },
    ],
    bodyExample: {
      directory:
        'beta-mxp-identification-cod-image/mxp-identification-cod-image/idCard_669f693984d21500143eb80a_1728763660035.jpg',
      type: 'ID_CARD',
    },
    successCode: 200,
    successExample: {
      note: 'Response จะถูกส่งกลับเป็นไฟล์รูปภาพ (image file)',
    },
    errors: [],
  },

  {
    id: 'create-sender-cod',
    group: 'Verify COD Account',
    name: 'Create Sender COD',
    method: 'POST',
    path: '/v1/account/sender-cod',
    summary:
      'สมัครบัญชีผู้ส่งแบบเก็บเงินปลายทาง (COD) พร้อมเอกสารยืนยันตัวตน',
    auth: 'bearer',
    headers: [
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
      {
        key: 'Content-Type',
        value: 'application/json',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'bankAccount',
        type: 'Object',
        required: true,
        desc: 'bankInitial (KBANK, SCB, BBL, KTB, TMB, BAY), holderName, number, bookBankImage',
      },
      {
        field: 'identification',
        type: 'Object',
        required: true,
        desc: 'number, image, selfPicture, type (PERSON, LEGAL_ENTITY)',
      },
      {
        field: 'name / phoneNumber / email',
        type: 'String',
        required: true,
        desc: 'ข้อมูลผู้ส่ง',
      },
      {
        field: 'address / subDistrict / district / province / zipCode',
        type: 'String',
        required: true,
        desc: 'ที่อยู่ผู้ส่ง',
      },
    ],
    bodyExample: {
      bankAccount: {
        bankInitial: 'KBANK',
        holderName: 'Test',
        number: '0000000000',
        bookBankImage:
          'mxp-bookbank-cod-image/mxp-bookbank-cod-image/1707213724144.png',
      },
      identification: {
        number: '1111111111111',
        image:
          'mxp-indentification-cod-image/idCard-1707213724148.png',
        selfPicture:
          'mxp-indentification-cod-image/PersonIdCard-1707213724149.png',
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
    successCode: 200,
    successExample: {
      message: 'create sender cod success',
      data: {
        bankAccount: {
          bankFullName: 'ธนาคารกสิกรไทย (KBANK)',
          bankInitial: 'KBANK',
          holderName: 'Test',
          number: '00000000000',
          bookBankImage:
            'mxp-bookbank-cod-image/mxp-bookbank-cod-image/Cert-1707213724144.png',
        },
        approval: 'PENDING',
        updateApprovalDate: '2024-10-09 06:07:06',
        name: 'Test',
        phoneNumber: '0900000004',
        email: 'test@test.com',
        address: '99/9',
        subDistrict: 'เกาะขวาง',
        district: 'เมืองจันทบุรี',
        province: 'จันทบุรี',
        zipCode: '22000',
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
      {
        key: 'Authorization',
        value: 'Bearer {access_token}',
        required: true,
      },
      {
        key: 'Content-Type',
        value: 'application/json',
        required: true,
      },
    ],
    pathParams: [],
    queryParams: [
      {
        key: 'email',
        example: 'myexpress.international@gmail.com',
        required: false,
        desc: 'ต้องระบุ email หรือ phoneNumber อย่างน้อยหนึ่งอย่าง',
      },
      {
        key: 'phoneNumber',
        example: '0989392917',
        required: false,
        desc: 'ความยาว 9–10 หลัก',
      },
    ],
    bodyType: 'none',
    bodyFields: [],
    bodyExample: null,
    successCode: 200,
    successExample: {
      data: [
        {
          bankAccount: {
            bankFullName: 'ธนาคารกสิกรไทย (KBANK)',
            bankInitial: 'KBANK',
            holderName: 'มายเอกซ์เพลส น่ารัก',
            number: '00000000011',
            bookBankImage:
              'beta-mxp-bookbank-cod-image/...662f048b...jpg',
          },
          approval: 'PENDING',
          updateApprovalDate: '2024-10-08 23:08:18',
          note: '',
          name: 'มายเอกซ์เพลส น่ารัก',
          phoneNumber: '0989392917',
          email: 'myexpress.international@gmail.com',
          address: '123',
          subDistrict: 'เกาะขวาง',
          district: 'เมืองจันทบุรี',
          province: 'จันทบุรี',
          zipCode: '22000',
        },
      ],
    },
    errors: [],
  },
];

export const GROUPS = GROUP_ORDER.map((group) => ({
  label: group,
  items: ENDPOINTS.filter((endpoint) => endpoint.group === group),
}));

/* ============================================================
   UI PRIMITIVES
   ============================================================ */
