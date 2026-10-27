import type {
  DocSection,
  Endpoint,
  ErrorItem,
  HeaderItem,
  Method,
} from './types';

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

/** คำอธิบายของแต่ละกลุ่ม (tags ใน api-1.json) */
export const GROUP_DESCRIPTIONS: Record<string, string> = {
  Authentication:
    'ทุก API ของ Open API ใช้มาตรฐานความปลอดภัย OAuth 2.0 และ grant type แบบ Client Credentials',
  Parcel:
    'ขนส่งที่เปิดใช้งาน: ไปรษณีย์ไทย (THAI_POST) ประเภท NON_COD และ COD',
  Webhook:
    'ประกอบด้วย Parcel Shipping Status Update (สถานะพัสดุ). ขนส่งที่เปิดใช้งาน: ไปรษณีย์ไทย (THAI_POST) ประเภท NON_COD และ COD',
  'Print Label':
    'ขนส่งที่เปิดใช้งาน: ไปรษณีย์ไทย (THAI_POST) ประเภท NON_COD และ COD',
  'Verify COD Account':
    'ขั้นตอนสมัครบัญชีผู้ส่ง COD: อัปโหลดรูปเอกสาร → สร้างบัญชี Sender COD → ตรวจสอบสถานะการอนุมัติ',
};

export const STATUS_TABLE = [
  { code: 200, detail: 'Request is successful.' },
  { code: 400, detail: 'Error bad request' },
  {
    code: 401,
    detail: 'Error an access token is missing or unauthorized',
  },
  { code: 403, detail: 'Error find an account forbidden' },
  { code: 500, detail: 'Error internal server http request' },
];

/* ============================================================
   SHARED PIECES
   ============================================================ */

const BEARER: HeaderItem = {
  key: 'Authorization',
  value: 'Bearer {access_token}',
  required: true,
};

const JSON_HEADER: HeaderItem = {
  key: 'Content-Type',
  value: 'application/json',
  required: true,
};

const ERR_401: ErrorItem = {
  code: 401,
  name: 'invalid_request',
  body: {
    error: 'invalid_request',
    error_description: 'The access token is missing',
  },
};

const ERR_403: ErrorItem = {
  code: 403,
  name: 'AccountDisableException',
  body: {
    name: 'AccountDisableException',
    message: 'AccountDisableException',
  },
};

const PERSON_FIELDS = (who: string) => [
  { field: `${who}.name`, type: 'String', required: true, desc: `ชื่อ${who === 'sender' ? 'ผู้ส่ง' : 'ผู้รับ'}` },
  { field: `${who}.phoneNumber`, type: 'String', required: true, desc: `เบอร์โทรศัพท์ที่ติดต่อได้ของ${who === 'sender' ? 'ผู้ส่ง' : 'ผู้รับ'}` },
  { field: `${who}.address`, type: 'String', required: true, desc: `เลขที่อยู่${who === 'sender' ? 'ผู้ส่ง' : 'ผู้รับ'}` },
  { field: `${who}.subDistrict`, type: 'String', required: true, desc: `ตำบล${who === 'sender' ? 'ผู้ส่ง' : 'ผู้รับ'}` },
  { field: `${who}.district`, type: 'String', required: true, desc: `อำเภอ${who === 'sender' ? 'ผู้ส่ง' : 'ผู้รับ'}` },
  { field: `${who}.province`, type: 'String', required: true, desc: `จังหวัด${who === 'sender' ? 'ผู้ส่ง' : 'ผู้รับ'}` },
  { field: `${who}.zipCode`, type: 'String', required: true, desc: `รหัสไปรษณีย์${who === 'sender' ? 'ผู้ส่ง' : 'ผู้รับ'}` },
];

const MOO_FIELD = {
  field: 'receiver.moo',
  type: 'String',
  required: false,
  desc: 'หมู่ผู้รับ — จำเป็นต้องระบุเมื่อที่อยู่ผู้รับอยู่ในพื้นที่พิเศษที่คิดค่าบริการตามหมู่ (Conditionally required)',
};

const WEIGHT_FIELD = {
  field: 'weightGram',
  type: 'Number',
  required: true,
  desc: 'น้ำหนักพัสดุ หน่วยกรัม — ไม่น้อยกว่า 10 และไม่เกิน 20,000 กรัม',
};

const PARTY_RESPONSE_FIELDS = (who: 'sender' | 'receiver') => {
  const w = who === 'sender' ? 'ผู้ส่ง' : 'ผู้รับ';
  return [
    { field: `data.${who}`, type: 'Object', desc: `ข้อมูล${w}` },
    { field: `data.${who}.name`, type: 'String', desc: `ชื่อ${w}` },
    { field: `data.${who}.phoneNumber`, type: 'String', desc: `เบอร์โทร${w}` },
    { field: `data.${who}.address`, type: 'String', desc: `ที่อยู่${w}` },
    { field: `data.${who}.subDistrict`, type: 'String', desc: `ตำบล/แขวง${w}` },
    { field: `data.${who}.district`, type: 'String', desc: `อำเภอ/เขต${w}` },
    { field: `data.${who}.province`, type: 'String', desc: `จังหวัด${w}` },
    { field: `data.${who}.zipCode`, type: 'String', desc: `รหัสไปรษณีย์${w}` },
  ];
};

const PARCEL_RESPONSE_COMMON = [
  { field: 'message', type: 'String', desc: 'ข้อมูลสถานะการสร้างเลข' },
  { field: 'data', type: 'Object', desc: 'ข้อมูลตอบกลับหลังจากการสร้างเลข' },
  { field: 'data.id', type: 'String', desc: 'รหัสพัสดุ (parcel id) ใช้สำหรับ Delete Parcel / Print Label' },
  ...PARTY_RESPONSE_FIELDS('sender'),
  ...PARTY_RESPONSE_FIELDS('receiver'),
  { field: 'data.note', type: 'String', desc: 'ข้อความผู้รับ' },
  { field: 'data.weightGram', type: 'Number', desc: 'น้ำหนักพัสดุผู้รับ (หน่วยกรัม)' },
  { field: 'data.shipping', type: 'Object', desc: 'ข้อมูล tracking' },
  { field: 'data.shipping.express', type: 'String', desc: 'บริษัทขนส่ง' },
  { field: 'data.shipping.trackingNumber', type: 'String', desc: 'เลข tracking จากขนส่ง' },
  { field: 'data.shipping.weightGram', type: 'Number', desc: 'น้ำหนักจากขนส่ง (หน่วยกรัม)' },
  { field: 'data.shipping.statusLog', type: 'Array', desc: 'ข้อมูล log ขนส่ง' },
  { field: 'data.status', type: 'String', desc: 'สถานะพัสดุ' },
  { field: 'data.type', type: 'String', desc: 'ชนิดการส่งพัสดุ' },
  { field: 'data.createdAt', type: 'String', desc: 'วันที่สร้างพัสดุ' },
  { field: 'data.updatedAt', type: 'String', desc: 'วันที่ update พัสดุ' },
];

const THAIPOST_STATUS_DETAIL: [string, string, string][] = [
  ['0', 'ผู้ฝากนำข้อมูลสินค้าเข้าระบบแล้ว', 'preload item data in to system'],
  ['1', 'ผู้ฝากสร้างใบฝากส่งเข้าระบบแล้ว', 'Preparing to ship.'],
  ['2', 'ปณ.ต้นทางรับฝากแล้ว', 'Received from source postoffice.'],
  ['3', 'ถึง ปณ.ปลายทาง เตรียมนำจ่าย', 'Destination postoffice prepare to pay package.'],
  ['4', 'นำจ่ายถึงผู้รับแล้ว', 'Successful delivery'],
  ['5', 'ปณ.ปลายทางส่งคืน', 'destination postoffice send a returned item'],
  ['6', 'ปณ.ต้นทางส่งคืนบริษัท', 'source postoffice send a returned item to sender'],
  ['7', 'ของสูญหาย', 'lost item'],
  ['8', 'เลื่อนวันรับของ', 'receiver postpone to receive item'],
  ['9', 'นำจ่าย/ชำระเงินเรียบร้อย', 'Successful delivery and collect COD money'],
  ['10', 'ยกเลิกจัดส่ง', 'Canceled Order.'],
  ['11', 'ทำการนำจ่าย', 'Pay to customer.'],
  ['12', 'นำจ่ายไม่ได้', '-'],
  ['13', 'อยู่ในระหว่างการขนส่ง', 'in transit'],
  ['14', 'รับ/ผ่าน สิ่งของ', '-'],
  ['15', 'อยู่ในระหว่างส่งคืน', '-'],
  ['16', 'สแกนเปิดเพื่อส่งต่อ', '-'],
  ['17', 'สแกนรับเข้าปลายทาง', '-'],
  ['18', 'สแกนรับมอบ', 'Scan received item.'],
  ['19', 'ไม่สามารถนำจ่ายได้ แจ้ง ศปง. เพื่อประสานงาน', 'Carded'],
  ['20', 'จ่าหน้าไม่ชัดเจน', 'Address not clear'],
  ['21', 'ไม่มีเลขบ้านตามจ่าหน้า', 'No such address'],
  ['22', 'ไม่ยอมรับ', 'Refused/Unclaimed'],
  ['23', 'ไม่มีผู้รับตามจ่าหน้า', 'No Recipient'],
  ['24', 'ไม่มารับตามกำหนด', 'Overdue'],
  ['25', 'เลิกกิจการ', 'Out of business'],
  ['26', 'ย้าย / ไม่ทราบที่อยู่ใหม่', 'Moved no forwarding add.'],
  ['27', 'บ้านปิด', 'Closed House'],
  ['28', 'ส่วนราชการ / บริษัทหยุด', 'Government/Public Company closed'],
  ['29', 'อื่นๆ', 'Others'],
  ['30', 'รอจ่าย ณ ที่ทำการไปรษณีย์', 'Poste Restante'],
  ['31', 'นำจ่าย ณ ตู้ไปรษณีย์เช่า (ออกใบแจ้ง)', 'P.O. Box (Issue Notification)'],
  ['32', 'นำจ่ายใหม่', 'Re Delivery'],
  ['33', 'ปณอ. (ไปรษณีย์อนุญาตเอกชน)', 'Licensed Post Office'],
  ['34', 'ต่างประเทศ (นำจ่ายไม่ได้)', 'International ( Unsuccessful Attempt)'],
  ['35', 'ขอรับเองที่ไปรษณีย์', 'Request own pick-up at the post office'],
  ['36', 'โทรศัพท์ติดต่อผู้รับ', 'Contact the recipient by phone'],
  ['37', 'ตู้นำจ่ายไปรษณีย์อัตโนมัติ', 'Smart Parcel Locker'],
  ['38', 'Super EMS', '-'],
  ['39', 'ติดต่อผู้รับไม่ได้', 'Can not contact receiver'],
  ['40', 'ผิดเขต', 'Wrong zone.'],
  ['41', 'เตรียมส่งสิ่งของคืนลูกค้า', '-'],
  ['42', 'อยู่ในระหว่างส่งของคืนลูกค้า', '-'],
  ['43', 'ส่งของคืนลูกค้าเรียบร้อยแล้ว', '-'],
  ['44', 'เตรียมทำใบฝากส่งคืนสินค้า Reverse', '-'],
  ['45', 'ปณ.ต้นทางรับฝากสินค้าส่งคืน Reverse แล้ว', '-'],
  ['46', 'ปณ.ต้นทาง เตรียมส่งคืนสถานทูต', '-'],
  ['47', 'ปณ.ต้นทาง ส่งคืนสถานทูตแล้ว', '-'],
  ['48', 'นำจ่าย/ส่งเงินธนาณัติ', 'Paid by money order'],
  ['49', 'Claim', 'Claim'],
  ['50', 'อยู่ระหว่างการสอบสวน', 'Item investigate'],
  ['51', 'อนุมัติชดใช้/ ส่งคืน ปภค.10003', '-'],
  ['53', 'ไม่ทราบสาเหตุการส่งคืน', '-'],
  ['54', 'ศป.ต้นทางรับเข้า', '-'],
  ['55', 'ศป.ต้นทางส่งออก', '-'],
  ['56', 'ศป.กลางทางรับเข้า', '-'],
  ['57', 'ศป.กลางทางส่งออก', '-'],
  ['58', 'ศป.ปลายทางรับเข้า', '-'],
  ['59', 'ศป.ปลายทางส่งออก', '-'],
  ['60', 'ปณ.ปลายทางรับเข้า', '-'],
  ['61', 'ปณ.ต้นทางเตรียมส่งคืน', '-'],
  ['62', 'อยู่ระหว่างคัดแยกสินค้า', '-'],
  ['63', 'ส่งออกจากศูนย์คัดแยกสินค้า/ที่ทำการ', '-'],
  ['64', 'ผู้ฝากส่งกำหนดวัน/เวลา นำจ่าย', 'Flexible Delivery (FD)'],
  ['65', 'หมายเหตุ', 'Utility'],
  ['66', 'ส่งออกจากที่ทำการแลกเปลี่ยนแล้ว', 'Departure From Outward OE'],
  ['67', 'ส่งศุลกากร', 'To Customs'],
  ['68', 'มาจากศุลกากร', 'From Customs'],
  ['69', 'ศุลกากรกัก', 'Detention in Customs'],
  ['70', 'ส่งผ่านศูนย์คัดแยกสินค้า', 'Transfer'],
  ['71', 'ถึงศูนย์คัดแยกสินค้า/ที่ทำการ', 'Container Received'],
  ['72', 'ไม่อนุมัติชดใช้', '-'],
  ['74', 'โทรศัพท์ติดต่อผู้รับ/ผู้ฝากแล้ว ให้เก็บรอนำจ่าย', '-'],
];

const STATUS_DETAIL_SECTION: DocSection = {
  title: 'Status Detail',
  description:
    'status code และคำอธิบายสถานะจากไปรษณีย์ไทย ใช้ในฟิลด์ stage.status / stage.statusDescription',
  headers: ['Status', 'StatusDescription', 'StatusDescription EN'],
  rows: THAIPOST_STATUS_DETAIL,
};

const CREATE_PARCEL_RECEIVER = {
  address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1',
  district: 'ศรีราชา',
  name: 'คุณมายเอ็กซ์เพรส ชลบุรี',
  phoneNumber: '0989392917',
  province: 'ชลบุรี',
  subDistrict: 'หนองขาม',
  zipCode: '20230',
};

const IMAGE_TYPE_DESC =
  'ชนิดรูปภาพ: BOOKBANK, ID_CARD, PERSON_ID_CARD, CERTIFICATE';

const IMAGE_UPLOAD_SECTION: DocSection = {
  title: 'เอกสารที่ต้องอัปโหลด',
  description:
    'ระบุ type ให้ตรงกับเอกสารแต่ละชนิด (อัปโหลดได้ครั้งละ 1 ไฟล์ต่อ 1 request, รองรับ image/jpeg และ image/png, ขนาดไม่เกิน 20 MB)',
  headers: ['ประเภทผู้สมัคร', 'เอกสาร', 'type'],
  rows: [
    ['บุคคลธรรมดา', 'ภาพถ่ายบัตรประชาชน', 'ID_CARD'],
    ['บุคคลธรรมดา', 'ภาพถ่ายหน้าสมุดบัญชีธนาคาร', 'BOOKBANK'],
    ['บุคคลธรรมดา', 'ภาพถ่ายหน้าตรงคู่กับบัตรประชาชน', 'PERSON_ID_CARD'],
    ['นิติบุคคล', 'ภาพถ่ายหนังสือรับรองบริษัท', 'CERTIFICATE'],
    ['นิติบุคคล', 'ภาพถ่ายหน้าสมุดบัญชีธนาคาร', 'BOOKBANK'],
  ],
};

const UPLOAD_NOTE =
  'หลังอัปโหลดสำเร็จ ระบบจะคืนค่า directory ให้นำไปใส่ในฟิลด์ bankAccount.bookBankImage, identification.image และ identification.selfPicture ของ Create Sender COD (ต้องมาจาก Upload Image API เท่านั้น)';

/* ============================================================
   DATA
   ============================================================ */

export const ENDPOINTS: Endpoint[] = [
  /* ---------------- Authentication ---------------- */
  {
    id: 'generate-access-token',
    group: 'Authentication',
    name: 'Generate Access Token',
    method: 'POST',
    path: '/v1/auth/oauth2/token',
    summary:
      'แลก client_id / client_secret เป็น access_token สำหรับเรียก API อื่น ๆ (OAuth 2.0 Client Credentials)',
    auth: 'none',
    headers: [JSON_HEADER],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'client_id', type: 'String', required: true, desc: 'client_id ที่ได้รับจากระบบ MyAPI' },
      { field: 'client_secret', type: 'String', required: true, desc: 'client_secret ที่ได้รับจากระบบ MyAPI' },
      { field: 'grant_type', type: 'String', required: true, desc: 'รหัส grant type ต้องเป็น client_credentials' },
      { field: 'scope', type: 'String', required: true, desc: 'scope ที่ได้รับจากระบบ MyAPI เช่น parcel' },
    ],
    bodyExample: {
      client_id: '<YOUR_CLIENT_ID>',
      client_secret: '<YOUR_CLIENT_SECRET>',
      grant_type: 'client_credentials',
      scope: 'parcel',
    },
    responseFields: [
      { field: 'access_token', type: 'String', desc: 'ข้อมูลเข้ารหัส รับรองความปลอดภัยของ user' },
      { field: 'expires_in', type: 'Number', desc: 'ระยะเวลาที่ token หมดอายุ (วินาที)' },
      { field: 'token_type', type: 'String', desc: 'ชนิด Token' },
    ],
    successCode: 200,
    successExample: {
      expires_in: 7200,
      token_type: 'bearer',
      access_token: '<ACCESS_TOKEN>',
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

  /* ---------------- Parcel ---------------- */
  {
    id: 'create-parcel',
    group: 'Parcel',
    name: 'Create Parcel (NON_COD / COD)',
    method: 'POST',
    path: '/v1/parcel',
    summary:
      'สร้างเลขพัสดุ รองรับ 2 ประเภท: NON_COD (ไม่เก็บเงินปลายทาง) และ COD (เก็บเงินปลายทาง — ผู้ส่งต้องมีบัญชี Sender COD ที่ได้รับอนุมัติแล้ว)',
    auth: 'bearer',
    headers: [BEARER, JSON_HEADER],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [],
    bodyGroups: [
      {
        title: 'Request Body — NON_COD',
        fields: [
          { field: 'express', type: 'String', required: true, desc: 'ชื่อขนส่ง (EN) — "THAI_POST"' },
          { field: 'sender', type: 'Object', required: true, desc: 'ข้อมูลผู้ส่ง' },
          ...PERSON_FIELDS('sender'),
          { field: 'receiver', type: 'Object', required: true, desc: 'ข้อมูลผู้รับ' },
          ...PERSON_FIELDS('receiver'),
          MOO_FIELD,
          { field: 'note', type: 'String', required: false, desc: 'หมายเหตุ' },
          WEIGHT_FIELD,
          { field: 'isInsured', type: 'Boolean', required: false, desc: 'ประกันพัสดุ — หากไม่ต้องการประกัน ให้ละเว้นหรือระบุเป็น false' },
          { field: 'insuranceDeclaredValue', type: 'Number', required: false, desc: 'วงเงินเอาประกัน — ต้องระบุเมื่อ isInsured = true (0–50,000 บาท)' },
          { field: 'insuranceProductPrice', type: 'Number', required: false, desc: 'ราคาสินค้าภายในกล่องพัสดุ — ต้องระบุเมื่อ isInsured = true (มากกว่า 0)' },
        ],
      },
      {
        title: 'Request Body — COD',
        fields: [
          { field: 'express', type: 'String', required: true, desc: 'ชื่อขนส่ง (EN) — "THAI_POST"' },
          { field: 'sender', type: 'Object', required: true, desc: 'ข้อมูลผู้ส่ง' },
          { field: 'sender.phoneNumber', type: 'String', required: true, desc: 'เบอร์โทรศัพท์ของบัญชี COD ที่ลงทะเบียน (ไม่น้อยกว่า 9 หลัก และไม่เกิน 10 หลัก)' },
          { field: 'sender.email', type: 'String', required: true, desc: 'อีเมลของบัญชี COD ที่ลงทะเบียน' },
          { field: 'receiver', type: 'Object', required: true, desc: 'ข้อมูลผู้รับ' },
          { field: 'receiver.name', type: 'String', required: true, desc: 'ชื่อผู้รับ' },
          { field: 'receiver.phoneNumber', type: 'String', required: true, desc: 'เบอร์โทรศัพท์ที่ติดต่อได้ของผู้รับ' },
          { field: 'receiver.address', type: 'String', required: true, desc: 'เลขที่อยู่ผู้รับ' },
          { field: 'receiver.subDistrict', type: 'String', required: true, desc: 'ตำบลผู้รับ' },
          { field: 'receiver.district', type: 'String', required: true, desc: 'อำเภอผู้รับ' },
          { field: 'receiver.province', type: 'String', required: true, desc: 'จังหวัดผู้รับ' },
          { field: 'receiver.zipCode', type: 'String', required: true, desc: 'ไปรษณีย์ผู้รับ' },
          MOO_FIELD,
          { field: 'note', type: 'String', required: false, desc: 'หมายเหตุ' },
          WEIGHT_FIELD,
          { field: 'codEnabled', type: 'Boolean', required: true, desc: 'พัสดุประเภท COD' },
          { field: 'codAmount', type: 'Number', required: true, desc: 'มูลค่า COD หน่วยบาท — ต้องมากกว่า 0' },
          { field: 'insideBoxDetail', type: 'Object[]', required: true, desc: 'รายการสิ่งของภายในกล่อง — Object ภายใน Array ต้องมีมากกว่า 0 และไม่เกิน 30 รายการ' },
          { field: 'insideBoxDetail.name', type: 'String', required: true, desc: 'ประเภทของสิ่งของ' },
          { field: 'insideBoxDetail.type', type: 'String', required: true, desc: 'ชนิดของสิ่งของ (ถ้าไม่มีใส่ - ได้)' },
          { field: 'insideBoxDetail.size', type: 'String', required: true, desc: 'ขนาดของสิ่งของ' },
          { field: 'insideBoxDetail.amount', type: 'Number', required: true, desc: 'จำนวนของสิ่งของ — ต้องมากกว่า 0' },
          { field: 'insideBoxDetail.price', type: 'Number', required: true, desc: 'ราคาของสิ่งของ — ต้องมากกว่า 0' },
          { field: 'insideBoxDetail.color', type: 'String', required: true, desc: 'สีของสิ่งของ' },
          { field: 'insideBoxDetail.weightGram', type: 'Number', required: true, desc: 'น้ำหนักของสิ่งของ หน่วยกรัม — ต้องมากกว่า 0' },
          { field: 'isInsured', type: 'Boolean', required: false, desc: 'ประกันพัสดุ — หากไม่ต้องการประกัน ให้ละเว้นหรือระบุเป็น false' },
          { field: 'insuranceDeclaredValue', type: 'Number', required: false, desc: 'วงเงินเอาประกัน — ต้องระบุเมื่อ isInsured = true (0–50,000 บาท)' },
        ],
      },
    ],
    bodyExampleTitle: 'Request Example — NON_COD',
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
        address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1',
        moo: '1',
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
    extraExamples: [
      {
        title: 'Request Example — COD',
        body: {
          express: 'THAI_POST',
          sender: {
            phoneNumber: '0900000000',
            email: 'test@test.com',
          },
          receiver: {
            name: 'คุณมายเอ็กซ์เพรส ชลบุรี',
            phoneNumber: '0989392917',
            address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1',
            moo: '1',
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
              type: 'กล้่อง Cannon',
              size: 'ขนาดเล็ก (S)',
              color: 'สีดำ (Black)',
              amount: 1,
              price: 1,
              weightGram: 1000,
            }
          ],
          isInsured: true,
          insuranceDeclaredValue: 3000,
        },
      },
    ],
    responseFields: [],
    responseGroups: [
      {
        title: 'Response Body — NON_COD',
        fields: PARCEL_RESPONSE_COMMON,
      },
      {
        title: 'Response Body — COD',
        fields: PARCEL_RESPONSE_COMMON.concat([
          { field: 'data.insideBoxDetail', type: 'Object[]', desc: 'รายการสิ่งของภายในกล่อง' },
          { field: 'data.insideBoxDetail.name', type: 'String', desc: 'ประเภทของสิ่งของ' },
          { field: 'data.insideBoxDetail.type', type: 'String', desc: 'ข้อมูลชนิดของสิ่งของ' },
          { field: 'data.insideBoxDetail.size', type: 'String', desc: 'ข้อมูลขนาดของสิ่งของ' },
          { field: 'data.insideBoxDetail.amount', type: 'Number', desc: 'ข้อมูลจำนวนของสิ่งของ' },
          { field: 'data.insideBoxDetail.price', type: 'Number', desc: 'ข้อมูลราคาของสิ่งของ' },
          { field: 'data.insideBoxDetail.color', type: 'String', desc: 'ข้อมูลสีของสิ่งของ' },
          { field: 'data.insideBoxDetail.weightGram', type: 'Number', desc: 'ข้อมูลน้ำหนักของสิ่งของ หน่วยกรัม' },
          { field: 'data.codAmount', type: 'Number', desc: 'มูลค่า COD หน่วยบาท' },
          { field: 'data.codEnabled', type: 'Boolean', desc: 'พัสดุประเภท COD' },
          { field: 'data.codFee', type: 'Number', desc: 'ค่าบริการ COD' },
          { field: 'data.codFeeVat', type: 'Number', desc: 'Vat 7% ของค่าบริการ COD' },
          { field: 'data.isInsured', type: 'Boolean', desc: 'ระบุว่ารับประกันพัสดุหรือไม่' },
          { field: 'data.insuranceDeclaredValue', type: 'Number', desc: 'วงเงินเอาประกัน (เมื่อรับประกัน)' },
          { field: 'data.insuranceProductPrice', type: 'Number', desc: 'ราคาสินค้าภายในกล่อง (เมื่อรับประกัน)' },
        ]),
      },
    ],
    successCode: 200,
    successExampleTitle: 'Success 200 — รับประกันพัสดุ',
    successExample: {
      message: 'create parcel success',
      data: {
        note: '',
        receiver: {
          address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1',
          district: 'ศรีราชา',
          name: 'คุณมายเอ็กซ์เพรส ชลบุรี',
          phoneNumber: '0989392917',
          province: 'ชลบุรี',
          subDistrict: 'หนองขาม',
          zipCode: '20230',
        },
        id: 'cd613f68fd1bb07c3dcb4f4bc78d0c48fcb1c685ff5529055d6f3daa2d05d043OP1728541345897',
        sender: {
          address: '99/9',
          district: 'เมืองจันทบุรี',
          name: 'Test',
          phoneNumber: '0900000000',
          province: 'จันทบุรี',
          subDistrict: 'เกาะขวาง',
          zipCode: '22000',
        },
        shipping: {
          express: 'THAI_POST',
          trackingNumber: 'JA056666571TH',
          weightGram: 1000,
          statusLog: [],
        },
        status: 'NEW',
        type: 'COD',
        createdAt: '2024-10-10T06:22:25.897Z',
        updatedAt: '2024-10-10T06:22:27.594Z',
        weightGram: 1000,
        isInsured: true,
        insideBoxDetail: [
          {
            name: 'อุปกรณ์อิเล็กทรอนิกส์',
            type: 'กล้่อง Cannon',
            size: 'ขนาดเล็ก (S)',
            color: 'สีดำ (Black)',
            amount: 1,
            price: 1,
            weightGram: 1000,
          }
        ],
        codAmount: 100,
        codEnabled: true,
        codFee: 1.3,
        codFeeVat: 0.09,
        insuranceDeclaredValue: 3500,
        insuranceProductPrice: 3000,
      }
    },
    successExtraExamples: [
      {
        title: 'Success 200 — ไม่รับประกันพัสดุ',
        body: {
          message: 'create parcel success',
          data: {
            note: '',
            receiver: {
              address: '188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1',
              district: 'ศรีราชา',
              name: 'คุณมายเอ็กซ์เพรส ชลบุรี',
              phoneNumber: '0989392917',
              province: 'ชลบุรี',
              subDistrict: 'หนองขาม',
              zipCode: '20230',
            },
            id: 'cd613f68fd1bb07c3dcb4f4bc78d0c48fcb1c685ff5529055d6f3daa2d05d043OP1728541345897',
            sender: {
              address: '99/9',
              district: 'เมืองจันทบุรี',
              name: 'Test',
              phoneNumber: '0900000000',
              province: 'จันทบุรี',
              subDistrict: 'เกาะขวาง',
              zipCode: '22000',
            },
            shipping: {
              express: 'THAI_POST',
              trackingNumber: 'JA056666571TH',
              weightGram: 1000,
              statusLog: [],
            },
            status: 'NEW',
            type: 'COD',
            createdAt: '2024-10-10T06:22:25.897Z',
            updatedAt: '2024-10-10T06:22:27.594Z',
            weightGram: 1000,
            isInsured: false,
            insideBoxDetail: [
              {
                name: 'อุปกรณ์อิเล็กทรอนิกส์',
                type: 'กล้่อง Cannon',
                size: 'ขนาดเล็ก (S)',
                color: 'สีดำ (Black)',
                amount: 1,
                price: 1,
                weightGram: 1000,
              }
            ],
            codAmount: 100,
            codEnabled: true,
            codFee: 1.3,
            codFeeVat: 0.09,
          }
        },
      },
    ],
    errors: [
      ERR_401,
      ERR_403,
      {
        code: 400,
        name: 'SenderCODNotApproveException',
        body: {
          status: 400,
          message:
            'senderCOD phoneNumber 0810000000 is currently pending approval or has not been approved',
          name: 'SenderCODNotApproveException',
        },
      },
      {
        code: 400,
        name: 'BadRequestException (weightKg)',
        body: {
          status: 400,
          message: 'weightKg not allow. Please use weightGram',
          name: 'BadRequestException',
        },
      },
      {
        code: 400,
        name: 'BadRequestException (weightGram)',
        body: {
          status: 400,
          message: 'Gram not allow below 10 gram and more 20,000 gram',
          name: 'BadRequestException',
        },
      },
      {
        code: 400,
        name: 'CODAmountInvalidException',
        body: {
          status: 400,
          message: 'not found codAmount or codAmount less than 1',
          name: 'CODAmountInvalidException',
        },
      },
      {
        code: 400,
        name: 'CODAmountInvalidException (decimal)',
        body: {
          status: 400,
          message:
            'not found codAmount or codAmount less than 1 or codAmount must not have more than 2 decimal places',
          name: 'CODAmountInvalidException',
        },
      },
      {
        code: 400,
        name: 'InsideBoxDetailNotCorrectException',
        body: {
          status: 400,
          message:
            'cannot create parcel cod because not found insideBoxDetail or length equal 0',
          name: 'InsideBoxDetailNotCorrectException',
        },
      },
      {
        code: 400,
        name: 'SenderPhoneNumberInvalidException',
        body: {
          status: 400,
          message: 'not found sender.phoneNumber or invalid length',
          name: 'SenderPhoneNumberInvalidException',
        },
      },
      {
        code: 400,
        name: 'SenderEmailInvalidException',
        body: {
          status: 400,
          message: 'not found sender.email or invalid format',
          name: 'SenderEmailInvalidException',
        },
      },
      {
        code: 400,
        name: 'BadRequestException (insuranceDeclaredValue)',
        body: {
          status: 400,
          message: 'insuranceDeclaredValue must be a number between 0 and 50,000',
          name: 'BadRequestException',
        },
      },
      {
        code: 400,
        name: 'Error (receiver)',
        body: { status: 400, name: 'Error', message: 'receiver require' },
      },
      {
        code: 400,
        name: 'Error (sender)',
        body: { status: 400, name: 'Error', message: 'sender require' },
      },
      {
        code: 400,
        name: 'Error (moo)',
        body: { status: 400, message: 'receiver.moo is require', name: 'Error' },
      },
      {
        code: 404,
        name: 'SenderCODNotFoundException',
        body: {
          status: 404,
          message: 'not found senderCOD with phoneNumber 0820000000',
          name: 'SenderCODNotFoundException',
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
    summary: 'ค้นหาข้อมูลพัสดุจากเลข tracking หลายรายการพร้อมกัน (สูงสุด 20 เลข)',
    auth: 'bearer',
    headers: [BEARER, JSON_HEADER],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'express', type: 'String', required: true, desc: 'ชื่อขนส่ง — "THAI_POST"' },
      { field: 'trackingNumbers', type: 'String[]', required: true, desc: 'รายการเลข tracking เช่น ["TH0001", "TH0002"] — ไม่เกิน 20 รายการ' },
    ],
    bodyExample: {
      express: 'THAI_POST',
      trackingNumbers: ['JB052917036TH', 'JB050236579TH', 'JB012345678TH'],
    },
    responseFields: [
      { field: 'notFoundTrackingNumbers', type: 'String[]', desc: 'เลข tracking ที่ค้นหาไม่พบ' },
      { field: 'express', type: 'String', desc: 'ชื่อขนส่ง' },
      { field: 'data', type: 'Array', desc: 'รายการพัสดุที่พบ' },
      { field: 'data[].id', type: 'String', desc: 'รหัส Parcel' },
      { field: 'data[].note', type: 'String', desc: 'ข้อมูลเพิ่มเติม' },
      { field: 'data[].sender', type: 'Object', desc: 'ข้อมูลผู้ส่ง (name, phoneNumber, address, subDistrict, district, province, zipCode)' },
      { field: 'data[].receiver', type: 'Object', desc: 'ข้อมูลผู้รับ (name, phoneNumber, address, subDistrict, district, province, zipCode)' },
      { field: 'data[].shipping.express', type: 'String', desc: 'ชื่อขนส่งจากข้อมูลขนส่ง' },
      { field: 'data[].shipping.trackingNumber', type: 'String', desc: 'เลข tracking' },
      { field: 'data[].shipping.weightGram', type: 'Number', desc: 'น้ำหนักที่บันทึกจากขนส่ง (กรัม)' },
      { field: 'data[].shipping.statusLog.code', type: 'String', desc: 'log code ข้อมูลจากขนส่ง' },
      { field: 'data[].shipping.statusLog.timestamp', type: 'Date', desc: 'เวลาจากสถานะขนส่ง' },
      { field: 'data[].shipping.statusLog.message', type: 'String', desc: 'ข้อมูลสถานะจากขนส่ง' },
      { field: 'data[].shipping.statusLog.weightGram', type: 'Number', desc: 'น้ำหนัก (กรัม) ที่บันทึกจากขนส่งใน log' },
      { field: 'data[].shipping.statusLog.trackingNumber', type: 'String', desc: 'เลข tracking จากขนส่งที่บันทึกใน log' },
      { field: 'data[].status', type: 'String', desc: 'สถานะการขนส่งล่าสุด' },
      { field: 'data[].type', type: 'String', desc: 'ชนิดพัสดุ' },
      { field: 'data[].createdAt', type: 'Date', desc: 'วันที่สร้าง' },
      { field: 'data[].updatedAt', type: 'Date', desc: 'วันที่อัปเดต' },
      { field: 'data[].weightGram', type: 'Number', desc: 'น้ำหนักที่บันทึกจากระบบ (กรัม)' },
    ],
    successCode: 200,
    successExample: {
      notFoundTrackingNumbers: ['JB012345678TH'],
      express: 'THAI_POST',
      data: [
        {
          note: '',
          receiver: CREATE_PARCEL_RECEIVER,
          id: '1211c0bccc0142404df1274999e94d0144c3eadc181bb95ee01cfb61ea46e7e1OP1723622204784',
          sender: {
            address: '69/429 หมู่ 2',
            district: 'เมืองภูเก็ต',
            name: 'คุณมายเอ็กซ์เพรส ภูเก็ต',
            phoneNumber: '0813150764',
            province: 'ภูเก็ต',
            subDistrict: 'วิชิต',
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
          weightGram: 10000,
        },
        {
          note: '',
          receiver: {
            ...CREATE_PARCEL_RECEIVER,
            name: 'คุณมายออเดอร์ ชลบุรี',
            phoneNumber: '0872570359',
          },
          id: 'dbd61e125fcbca1f297139feeed8e60812a33b5973426e3c54edbd27dfd0fd61OP1722422793562',
          sender: {
            address: '69/429 หมู่ 2',
            district: 'เมืองภูเก็ต',
            name: 'คุณมายออเดอร์ ภูเก็ต',
            phoneNumber: '0887656466',
            province: 'ภูเก็ต',
            subDistrict: 'วิชิต',
            zipCode: '83000',
          },
          shipping: {
            express: 'THAI_POST',
            statusLog: [
              {
                code: '1',
                timestamp: '2024-08-07T10:00:19.000Z',
                message: 'รับฝาก',
                isReturn: false,
                weightGram: 1000,
                trackingNumber: 'JB050236579TH',
              },
            ],
            trackingNumber: 'JB050236579TH',
            weightGram: 1000,
          },
          status: 'PICKUPED',
          type: 'NON_COD',
          createdAt: '2024-07-31T10:46:33.562Z',
          updatedAt: '2024-08-15T06:37:18.433Z',
          weightGram: 1000,
        },
      ],
    },
    errors: [
      {
        code: 400,
        name: 'BadRequestException (express)',
        body: {
          status: 400,
          message:
            'Express name: undefined is not allow. Please change to express that you can accept.',
          name: 'BadRequestException',
        },
      },
      {
        code: 400,
        name: 'BadRequestException (trackingNumbers)',
        body: {
          status: 400,
          message:
            'Tracking numbers must be require. Tracking numbers must have a limit of 20.',
          name: 'BadRequestException',
        },
      },
    ],
    notes: [
      'ตัวอย่าง response ถูกตัดทอนให้สั้นลง (ใน response จริง statusLog จะมีรายการตามสถานะที่ขนส่งส่งมา)',
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
    headers: [BEARER],
    pathParams: [
      {
        key: 'parcelId',
        example:
          '8a88a0acb0ff10fb526cb3de97f7c1681e8cc488d4b39eb646f484fbf23cb8e3OP1721804390165',
        desc: 'parcel id ที่ได้รับจากการสร้าง parcel (Required)',
      },
    ],
    queryParams: [],
    bodyType: 'none',
    bodyFields: [],
    bodyExample: null,
    responseFields: [
      { field: 'message', type: 'String', desc: 'อธิบายสถานะการลบ' },
    ],
    successCode: 200,
    successExample: {
      message:
        'delete parcelNumber: 8a88a0acb0ff10fb526cb3de97f7c1681e8cc488d4b39eb646f484fbf23cb8e3OP1721804390165 success',
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
    headers: [BEARER, JSON_HEADER],
    pathParams: [],
    queryParams: [
      { key: 'trackingNumber', example: 'JA056666695TH', required: true, desc: 'เลขพัสดุ' },
    ],
    bodyType: 'none',
    bodyFields: [],
    bodyExample: null,
    responseFields: [
      { field: 'trackingNumber', type: 'String', desc: 'เลขพัสดุ' },
      {
        field: 'codTransferStatus',
        type: 'String',
        desc: 'NONE = พัสดุยังไม่ถูกจัดส่งหรือยังไม่ถึงปลายทาง · PENDING = พัสดุถึงปลายทางและรอทำรายการโอนเงิน · TRANSFERRED = ทำรายการโอนเงินเรียบร้อยแล้ว · REJECTED = ยกเลิกรายการโอนเนื่องจากพัสดุตีกลับ',
      },
      { field: 'codTransferDate', type: 'String', desc: 'วันที่ทำรายการโอนเงินเรียบร้อยแล้ว' },
      { field: 'shippingCost', type: 'Object', desc: 'รายละเอียดต้นทุนค่าขนส่ง' },
      { field: 'shippingCost.totalAmount', type: 'Number', desc: 'ราคาต้นทุนรวมทั้งหมด' },
      { field: 'shippingCost.shippingCost', type: 'Number', desc: 'ราคาต้นทุนขนส่ง' },
      { field: 'shippingCost.codAmount', type: 'Number', desc: 'ยอดเงิน COD (บาท)' },
      { field: 'shippingCost.codFee', type: 'Number', desc: 'ค่าธรรมเนียม COD' },
      { field: 'shippingCost.codVat', type: 'Number', desc: 'ภาษีมูลค่าเพิ่ม COD' },
      { field: 'shippingCost.specialAreaCost', type: 'Number', desc: 'ค่าพื้นที่พิเศษ พื้นที่ห่างไกล' },
    ],
    successCode: 200,
    successExample: {
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
    successExtraExamples: [
      {
        title: 'Success — status PENDING',
        body: {
          trackingNumber: 'JA056666687TH',
          codTransferStatus: 'PENDING',
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
      },
      {
        title: 'Success — status REJECTED',
        body: {
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
      },
      {
        title: 'Success — status NONE',
        body: {
          trackingNumber: 'JA056666545TH',
          codTransferStatus: 'NONE',
          codTransferDate: '',
          shippingCost: {
            totalAmount: 17.0139,
            shippingCost: 17,
            codAmount: 1,
            codFee: 0.013,
            codVat: 0.0009,
            specialAreaCost: 0,
          },
        },
      },
    ],
    errors: [
      {
        code: 404,
        name: 'NotFoundException',
        body: {
          status: 404,
          message: 'trackingNumber=[JA000000000TH] not found',
          name: 'NotFoundException',
        },
      },
    ],
  },

  {
    id: 'simulate-thaipost-webhook',
    group: 'Webhook',
    name: 'Simulate Thaipost Webhook',
    method: 'POST',
    path: '/v1/simulate/thaipost/webhook',
    summary:
      'จำลองการยิง webhook สถานะพัสดุจากไปรษณีย์ไทย สำหรับทดสอบใน Test Environment',
    auth: 'bearer',
    headers: [BEARER, JSON_HEADER],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'barcode', type: 'String', required: true, desc: 'เลข tracking จากขนส่ง' },
      { field: 'weight', type: 'Number', required: true, desc: 'น้ำหนักหน่วยเป็นกรัม ตัวอย่าง 1000' },
      { field: 'cod', type: 'String', required: true, desc: 'พัสดุ COD — ใช่ = yes, ไม่ = no' },
      { field: 'status', type: 'String', required: true, desc: 'status code จากขนส่ง ดูตาราง Status Detail' },
      { field: 'statusDescription', type: 'String', required: true, desc: 'status description จากขนส่ง ดูตาราง Status Detail' },
      { field: 'statusDate', type: 'String', required: true, desc: 'วันที่ เวลา ที่ได้รับสถานะ เช่น 23/07/2024 10:00:00 — ต้องมากกว่าวันที่สร้างพัสดุ' },
      { field: 'stationPostcode', type: 'String', required: true, desc: 'รหัสไปรษณีย์ตำแหน่งที่ทำการไปรษณีย์ เช่น 10160' },
      { field: 'station', type: 'String', required: true, desc: 'ที่ทำการไปรษณีย์ เช่น ภาษีเจริญ/กรุงเทพฯ' },
      { field: 'receiverName', type: 'String', required: true, desc: 'ชื่อผู้รับ' },
      { field: 'latitude', type: 'String', required: true, desc: 'ละติจูดที่ทำการไปรษณีย์ — ถ้าไม่มีให้ใส่ ""' },
      { field: 'longtitude', type: 'String', required: true, desc: 'ลองติจูดที่ทำการไปรษณีย์ — ถ้าไม่มีให้ใส่ "" (สะกดตามต้นฉบับ longtitude)' },
      { field: 'signature', type: 'String', required: true, desc: 'ลายเซ็นผู้รับ — ถ้าไม่มีให้ใส่ ""' },
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
    responseFields: [
      { field: 'errorCode', type: 'String', desc: 'หมายเลข ErrorCode (Success = 000)' },
      { field: 'errorDetail', type: 'String', desc: 'รายละเอียดของ Error' },
      { field: 'status', type: 'String', desc: 'สถานะของ Error (true or false)' },
    ],
    successCode: 200,
    successExample: {
      errorCode: '000',
      errorDetail: 'success',
      status: 'true',
    },
    errors: [],
    sections: [STATUS_DETAIL_SECTION],
  },

  /* ---------------- Print Label ---------------- */
  {
    id: 'print-label',
    group: 'Print Label',
    name: 'Print Label',
    method: 'POST',
    path: '/v1/print-label',
    summary: 'สร้างไฟล์ใบลาเบล (PDF) จากรายการ parcel id',
    auth: 'bearer',
    headers: [BEARER, JSON_HEADER],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      {
        field: 'size',
        type: 'String',
        required: true,
        desc: 'ขนาดใบลาเบล: TSC_100_75, TSC_100_100, TSC_100_150, TSC_100_180, MINI_57_100',
      },
      {
        field: 'parcelIds',
        type: 'String[]',
        required: true,
        desc: 'รหัสพัสดุ — ต้องไม่เป็นค่าว่างและไม่เกิน 20 รายการ',
      },
    ],
    bodyExample: {
      size: 'TSC_100_75',
      parcelIds: [
        '7b50a746b657a0c5e96ba46888afe37b2389be97c298e3774f64fcfd9f9a575fOP1723535199935',
      ],
    },
    successCode: 200,
    successLabel: 'PDF',
    successRaw:
      'Content-Type: application/pdf\nContent-Disposition: attachment;filename=1723543704932.pdf\n\n<binary PDF data (blob)>',
    successExample: null,
    responseFields: [
      { field: 'Content-Type', type: 'Header', desc: 'application/pdf — ระบุว่าการตอบกลับเป็นไฟล์ PDF' },
      { field: 'Content-Disposition', type: 'Header', desc: 'attachment;filename={timestamp}.pdf — ไฟล์ถูกตั้งชื่อด้วย timestamp ของเวลาที่สร้างไฟล์' },
      { field: 'Response Body', type: 'Binary', desc: 'ไฟล์ PDF ในรูปแบบ Binary Data (blob) สำหรับแสดงผลหรือดาวน์โหลด' },
    ],
    errors: [
      {
        code: 400,
        name: 'BadRequestException',
        body: {
          status: 400,
          message:
            'The number of parcel IDs must be greater than 0 and not exceed the limit of 20. Please adjust the number of parcel IDs and try again.',
          name: 'BadRequestException',
        },
      },
      {
        code: 404,
        name: 'NotFoundException',
        body: {
          status: 404,
          message: 'No parcels found for the given reference IDs with this account.',
          name: 'NotFoundException',
        },
      },
    ],
  },

  /* ---------------- Verify COD Account ---------------- */
  {
    id: 'upload-image-file',
    group: 'Verify COD Account',
    name: 'Upload Image by File',
    method: 'POST',
    path: '/v1/account/sender-cod/image',
    summary: 'อัปโหลดรูปภาพยืนยันตัวตนจากไฟล์ในเครื่อง (multipart/form-data)',
    auth: 'bearer',
    headers: [
      BEARER,
      { key: 'Content-Type', value: 'multipart/form-data', required: true },
    ],
    pathParams: [],
    queryParams: [],
    bodyType: 'formdata',
    bodyFields: [
      { field: 'file', type: 'File', required: true, desc: 'ไฟล์รูปภาพ png, jpg ขนาดไม่เกิน 20 MB' },
      { field: 'type', type: 'String', required: true, desc: IMAGE_TYPE_DESC },
    ],
    bodyExample: [
      { key: 'file', value: 'sample.png' },
      { key: 'type', value: 'BOOKBANK' },
    ],
    responseFields: [
      { field: 'directory', type: 'String', desc: 'ที่อยู่ไฟล์' },
    ],
    successCode: 200,
    successExample: {
      directory:
        'mxp-bookbank-cod-image/mxp-bookbank-cod-image/xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png',
    },
    successExtraExamples: [
      {
        title: 'Success — บัตรประชาชน (ID_CARD)',
        body: {
          directory:
            'mxp-identification-cod-image/mxp-identification-cod-image/idCard_xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png',
        },
      },
      {
        title: 'Success — รูปคู่บัตรประชาชน (PERSON_ID_CARD)',
        body: {
          directory:
            'mxp-identification-cod-image/mxp-identification-cod-image/PersonIdCard_xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png',
        },
      },
      {
        title: 'Success — หนังสือรับรองบริษัท (CERTIFICATE)',
        body: {
          directory:
            'mxp-identification-cod-image/mxp-identification-cod-image/Cert_xxxxxxxxxxxxxxxxx_xxxxxxxxxxxx.png',
        },
      },
    ],
    errors: [
      {
        code: 400,
        name: 'File is required',
        body: { status: 400, message: 'File is required.', name: 'BadRequestException' },
      },
      {
        code: 400,
        name: 'Type is required',
        body: { status: 400, message: 'Type is required.', name: 'BadRequestException' },
      },
      {
        code: 400,
        name: 'Invalid type',
        body: { status: 400, message: 'Invalid type.', name: 'BadRequestException' },
      },
      {
        code: 400,
        name: 'Multiple files',
        body: {
          status: 400,
          message: 'You can upload only one file.',
          name: 'BadRequestException',
        },
      },
    ],
    notes: [UPLOAD_NOTE],
    sections: [IMAGE_UPLOAD_SECTION],
  },

  {
    id: 'upload-image-url',
    group: 'Verify COD Account',
    name: 'Upload Image by Url',
    method: 'POST',
    path: '/v1/account/sender-cod/image-from-url',
    summary: 'อัปโหลดรูปภาพยืนยันตัวตนจาก public URL',
    auth: 'bearer',
    headers: [BEARER],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'url', type: 'String', required: true, desc: 'Public URL ของรูปภาพ' },
      { field: 'type', type: 'String', required: true, desc: IMAGE_TYPE_DESC },
    ],
    bodyExample: {
      url: 'https://storage.googleapis.com/beta-mxp-image/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%84%E0%B8%B9%E0%B9%88%E0%B8%9A%E0%B8%B1%E0%B8%95%E0%B8%A3.png',
      type: 'PERSON_ID_CARD',
    },
    responseFields: [
      { field: 'directory', type: 'String', desc: 'ที่อยู่ไฟล์' },
    ],
    successCode: 200,
    successExample: {
      directory:
        'beta-mxp-identification-cod-image/mxp-identification-cod-image/idCard_669f693984d21500143eb80a_1728763660035.jpg',
    },
    errors: [
      {
        code: 400,
        name: 'Url is required',
        body: { status: 400, message: 'Url is required.', name: 'BadRequestException' },
      },
      {
        code: 400,
        name: 'Type is required',
        body: { status: 400, message: 'Type is required.', name: 'BadRequestException' },
      },
      {
        code: 400,
        name: 'Failed to download',
        body: {
          status: 400,
          message: 'Failed to download file from URL: Request failed with status code 403',
          name: 'BadRequestException',
        },
      },
      {
        code: 400,
        name: 'Invalid type',
        body: { status: 400, message: 'Invalid type.', name: 'BadRequestException' },
      },
    ],
    notes: [UPLOAD_NOTE],
    sections: [IMAGE_UPLOAD_SECTION],
  },

  {
    id: 'get-image-file',
    group: 'Verify COD Account',
    name: 'Get Image File',
    method: 'POST',
    path: '/v1/account/sender-cod/image/view',
    summary: 'ดึงไฟล์รูปภาพที่เคยอัปโหลดไว้จาก directory path',
    auth: 'bearer',
    headers: [BEARER],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'directory', type: 'String', required: true, desc: 'ที่อยู่ไฟล์ที่ได้จาก Upload Image API' },
      { field: 'type', type: 'String', required: true, desc: IMAGE_TYPE_DESC },
    ],
    bodyExample: {
      directory:
        'beta-mxp-identification-cod-image/mxp-identification-cod-image/idCard_669f693984d21500143eb80a_1728763660035.jpg',
      type: 'ID_CARD',
    },
    successCode: 200,
    successLabel: 'IMAGE',
    successRaw: '<image file (binary)>',
    successExample: null,
    responseFields: [
      { field: '(response body)', type: 'File', desc: 'image file' },
    ],
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
    headers: [BEARER, JSON_HEADER],
    pathParams: [],
    queryParams: [],
    bodyType: 'json',
    bodyFields: [
      { field: 'bankAccount', type: 'Object', required: true, desc: 'ข้อมูลบัญชีธนาคาร' },
      { field: 'bankAccount.bankInitial', type: 'String', required: true, desc: 'อักษรย่อธนาคาร: KBANK, SCB, BBL, KTB, TMB, BAY' },
      { field: 'bankAccount.holderName', type: 'String', required: true, desc: 'ชื่อบนสมุดบัญชีธนาคาร' },
      { field: 'bankAccount.number', type: 'String', required: true, desc: 'หมายเลขสมุดบัญชีธนาคาร' },
      { field: 'bankAccount.bookBankImage', type: 'String', required: true, desc: 'ภาพถ่ายหน้าสมุดบัญชีธนาคาร (directory จากการอัปโหลด)' },
      { field: 'identification', type: 'Object', required: true, desc: 'ข้อมูลการยืนยันตัวตน' },
      { field: 'identification.number', type: 'String', required: true, desc: 'หมายเลขประจำตัวประชาชน / หมายเลขนิติบุคคล' },
      { field: 'identification.image', type: 'String', required: true, desc: 'บุคคลธรรมดา = ภาพบัตรประชาชน · นิติบุคคล = ภาพหนังสือรับรองบริษัท (directory จากการอัปโหลด)' },
      { field: 'identification.selfPicture', type: 'String', required: false, desc: 'ภาพถ่ายหน้าตรงคู่กับบัตรประชาชน — จำเป็นสำหรับบุคคลธรรมดาเท่านั้น (directory จากการอัปโหลด)' },
      { field: 'identification.type', type: 'String', required: true, desc: 'ประเภทบัญชี COD: PERSON, LEGAL_ENTITY' },
      { field: 'name', type: 'String', required: true, desc: 'ชื่อผู้ส่ง' },
      { field: 'phoneNumber', type: 'String', required: true, desc: 'เบอร์โทรศัพท์ผู้ส่ง' },
      { field: 'email', type: 'String', required: true, desc: 'อีเมลผู้ส่ง' },
      { field: 'address', type: 'String', required: true, desc: 'ที่อยู่ผู้ส่ง' },
      { field: 'subDistrict', type: 'String', required: true, desc: 'ตำบลผู้ส่ง' },
      { field: 'district', type: 'String', required: true, desc: 'อำเภอผู้ส่ง' },
      { field: 'province', type: 'String', required: true, desc: 'จังหวัดผู้ส่ง' },
      { field: 'zipCode', type: 'String', required: true, desc: 'รหัสไปรษณีย์ผู้ส่ง' },
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
          'mxp-indentification-cod-image/mxp-indentification-cod-image/idCard-1707213724148.png',
        selfPicture:
          'mxp-indentification-cod-image/mxp-indentification-cod-image/PersonIdCard-1707213724149.png',
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
    responseFields: [
      { field: 'message', type: 'String', desc: 'ข้อมูลสถานะการสร้างบัญชี COD' },
      { field: 'data', type: 'Object', desc: 'ข้อมูลตอบกลับหลังจากการสร้างบัญชี COD' },
      { field: 'data.bankAccount.bankFullName', type: 'String', desc: 'ชื่อเต็มธนาคาร' },
      { field: 'data.bankAccount.bankInitial', type: 'String', desc: 'อักษรย่อธนาคาร' },
      { field: 'data.bankAccount.holderName', type: 'String', desc: 'ชื่อบนสมุดบัญชีธนาคาร' },
      { field: 'data.bankAccount.number', type: 'String', desc: 'หมายเลขสมุดบัญชีธนาคาร' },
      { field: 'data.bankAccount.bookBankImage', type: 'String', desc: 'ภาพถ่ายหน้าสมุดบัญชีธนาคาร' },
      { field: 'data.approval', type: 'String', desc: 'สถานะการอนุมัติ' },
      { field: 'data.updateApprovalDate', type: 'String', desc: 'เวลาการอนุมัติ' },
      { field: 'data.name / phoneNumber / email', type: 'String', desc: 'ชื่อ เบอร์โทรศัพท์ และอีเมลผู้ส่ง' },
      { field: 'data.address / subDistrict / district / province / zipCode', type: 'String', desc: 'ที่อยู่ผู้ส่ง' },
    ],
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
    successExampleTitle: 'Success 200 — บุคคลธรรมดา',
    successExtraExamples: [
      {
        title: 'Success 200 — นิติบุคคล',
        body: {
          message: 'create sender cod success',
          data: {
            bankAccount: {
              bankFullName: 'ธนาคารกสิกรไทย (KBANK)',
              bankInitial: 'KBANK',
              holderName: 'Test',
              number: '00000000000',
              bookBankImage: 'mxp-bookbank-cod-image/mxp-bookbank-cod-image/1707213724144.png',
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
          }
        },
      },
    ],
    errors: [
      {
        code: 400,
        name: 'Invalid Bank Initial',
        body: {
          status: 400,
          message: 'bankInitial has wrong format. Please recheck bankInitial again.',
          name: 'BadRequestException',
        },
      },
      {
        code: 400,
        name: 'Invalid Type',
        body: { status: 400, message: 'Invalid Type.', name: 'BadRequestException' },
      },
      {
        code: 400,
        name: 'Self picture required',
        body: {
          status: 400,
          message: 'Self picture is required for PERSON type',
          name: 'BadRequestException',
        },
      },
      {
        code: 400,
        name: 'Invalid Input',
        body: {
          status: 400,
          message: 'Invalid input. Please review your details and try again.',
          name: 'BadRequestException',
        },
      },
    ],
    sections: [
      {
        title: 'Bank Initial ที่ระบบรองรับ',
        headers: ['Bank Initial', 'ธนาคาร'],
        rows: [
          ['KBANK', 'ธนาคารกสิกรไทย'],
          ['SCB', 'ธนาคารไทยพาณิชย์'],
          ['BBL', 'ธนาคารกรุงเทพ'],
          ['KTB', 'ธนาคารกรุงไทย'],
          ['TMB', 'ธนาคารทหารไทยธนชาต'],
          ['BAY', 'ธนาคารกรุงศรี'],
        ],
      },
    ],
    notes: [
      'ต้องอัปโหลดรูปผ่าน Upload Image API ก่อน แล้วนำ directory ที่ได้มาใส่ใน bookBankImage, identification.image และ identification.selfPicture ให้ตรงประเภท',
    ],
  },

  {
    id: 'get-sender-cod',
    group: 'Verify COD Account',
    name: 'Get Sender COD',
    method: 'GET',
    path: '/v1/account/sender-cod',
    summary: 'ค้นหาบัญชีผู้ส่ง COD และสถานะการอนุมัติ ด้วยอีเมลหรือเบอร์โทรศัพท์',
    auth: 'bearer',
    headers: [BEARER, JSON_HEADER],
    pathParams: [],
    queryParams: [
      {
        key: 'email',
        example: 'test@example.com',
        required: false,
        desc: 'อีเมลผู้ส่ง COD ต้องเป็นรูปแบบอีเมลที่ถูกต้อง (เช่น test@.com, test@domain, @domain.com ไม่ถูกต้อง) — ต้องระบุ email หรือ phoneNumber อย่างน้อยหนึ่งอย่าง หรือทั้งสองอย่าง',
      },
      {
        key: 'phoneNumber',
        example: '0989392917',
        required: false,
        desc: 'เบอร์โทรผู้ส่ง COD ต้องมากกว่า 9 ตัวและไม่เกิน 10 ตัว — ต้องระบุ email หรือ phoneNumber อย่างน้อยหนึ่งอย่าง หรือทั้งสองอย่าง',
      },
    ],
    bodyType: 'none',
    bodyFields: [],
    bodyExample: null,
    responseFields: [
      { field: 'data', type: 'Array', desc: 'ข้อมูลผู้ส่ง COD' },
      { field: 'data[].bankAccount.bankFullName', type: 'String', desc: 'ชื่อเต็มธนาคาร' },
      { field: 'data[].bankAccount.bankInitial', type: 'String', desc: 'อักษรย่อธนาคาร' },
      { field: 'data[].bankAccount.holderName', type: 'String', desc: 'ชื่อบนสมุดบัญชีธนาคาร' },
      { field: 'data[].bankAccount.number', type: 'String', desc: 'หมายเลขสมุดบัญชีธนาคาร' },
      { field: 'data[].bankAccount.bookBankImage', type: 'String', desc: 'ภาพถ่ายหน้าสมุดบัญชีธนาคาร' },
      { field: 'data[].approval', type: 'String', desc: 'PENDING = รอการตรวจสอบ · APPROVED = ผ่านการตรวจสอบ · NOT_APPROVED = ไม่ผ่านการตรวจสอบ' },
      { field: 'data[].updateApprovalDate', type: 'String', desc: 'เวลาการอนุมัติ' },
      { field: 'data[].note', type: 'String', desc: 'เหตุผลการไม่อนุมัติข้อมูล' },
      { field: 'data[].name / phoneNumber / email', type: 'String', desc: 'ชื่อ เบอร์โทรศัพท์ และอีเมลผู้ส่ง' },
      { field: 'data[].address / subDistrict / district / province / zipCode', type: 'String', desc: 'ที่อยู่ผู้ส่ง' },
    ],
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
              'beta-mxp-bookbank-cod-image/mxp-bookbank-cod-image/662f048bfbd1db001302450e_1727885297312.jpg',
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
    successExtraExamples: [
      {
        title: 'Success — APPROVED',
        body: {
          data: [
            {
              bankAccount: {
                bankFullName: 'ธนาคารกสิกรไทย (KBANK)',
                bankInitial: 'KBANK',
                holderName: 'มายเอกซ์เพลส น่ารัก',
                number: '00000000011',
                bookBankImage: 'beta-mxp-bookbank-cod-image/mxp-bookbank-cod-image/662f048bfbd1db001302450e_1727885297312.jpg',
              },
              approval: 'APPROVED',
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
            }
          ],
        },
      },
      {
        title: 'Success — NOT_APPROVED',
        body: {
          data: [
            {
              bankAccount: {
                bankFullName: 'ธนาคารกสิกรไทย (KBANK)',
                bankInitial: 'KBANK',
                holderName: 'มายเอกซ์เพลส น่ารัก',
                number: '00000000011',
                bookBankImage:
                  'beta-mxp-bookbank-cod-image/mxp-bookbank-cod-image/662f048bfbd1db001302450e_1727885297312.jpg',
              },
              approval: 'NOT_APPROVED',
              updateApprovalDate: '2024-10-08 23:08:18',
              note: 'หนังสือรับรองบริษัทมีอายุเกิน 6 เดือน,มีข้อความ/ลายน้ำ ทับซ้อนข้อมูล',
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
      },
    ],
    errors: [
      {
        code: 400,
        name: 'Invalid search',
        body: {
          status: 400,
          message: 'Phone number or email not found.',
          name: 'BadRequestException',
        },
      },
      {
        code: 400,
        name: 'Invalid phone number',
        body: {
          status: 400,
          message: 'Phone number invalid length',
          name: 'BadRequestException',
        },
      },
      {
        code: 400,
        name: 'Invalid email pattern',
        body: {
          status: 400,
          message: 'Invalid email format',
          name: 'BadRequestException',
        },
      },
      {
        code: 404,
        name: 'NotFoundException',
        body: {
          status: 404,
          message: 'COD Account Not Found',
          name: 'NotFoundException',
        },
      },
    ],
  },
];

export const GROUPS = GROUP_ORDER.map((group) => ({
  label: group,
  description: GROUP_DESCRIPTIONS[group],
  items: ENDPOINTS.filter((endpoint) => endpoint.group === group),
}));