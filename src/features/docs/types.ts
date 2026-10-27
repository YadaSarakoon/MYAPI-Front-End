export type Method = 'GET' | 'POST' | 'DELETE';
export type BodyType = 'json' | 'formdata' | 'none';
export type AuthType = 'none' | 'bearer';
export type DocsPage = 'overview' | 'docs';

export interface HeaderItem {
  key: string;
  value: string;
  required?: boolean;
}

export interface PathParam {
  key: string;
  example: string;
  desc: string;
}

export interface QueryParam {
  key: string;
  example: string;
  required?: boolean;
  desc: string;
}

export interface BodyField {
  field: string;
  type: string;
  required?: boolean;
  desc: string;
}

export interface ResponseField {
  field: string;
  type: string;
  desc: string;
}

/** กลุ่มตารางฟิลด์ (ใช้เมื่อ endpoint เดียวมีหลายรูปแบบ เช่น NON_COD / COD) */
export interface FieldGroup<T> {
  title?: string;
  fields: T[];
}

export interface ErrorItem {
  code: number;
  name: string;
  body: Record<string, unknown>;
}

export interface ExtraExample {
  title: string;
  body: unknown;
}

/** ตารางเสริมใต้รายละเอียด endpoint (เช่น Status Detail ของ Webhook) */
export interface DocSection {
  title: string;
  description?: string;
  headers: string[];
  rows: string[][];
}

export interface Endpoint {
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
  /** ตารางฟิลด์ request แยกตามรูปแบบ (ถ้ามี จะแสดงแทน bodyFields) */
  bodyGroups?: FieldGroup<BodyField>[];
  bodyExample: unknown;
  /** หัวข้อของตัวอย่าง request หลัก (ค่าเริ่มต้น Request Example) */
  bodyExampleTitle?: string;
  /** ตัวอย่าง request เพิ่มเติม (เช่น COD / NON_COD) */
  extraExamples?: ExtraExample[];
  /** ฟิลด์ใน response */
  responseFields?: ResponseField[];
  /** ตารางฟิลด์ response แยกตามรูปแบบ (ถ้ามี จะแสดงแทน responseFields) */
  responseGroups?: FieldGroup<ResponseField>[];
  successCode: number;
  successExample: unknown;
  /** หัวข้อของตัวอย่าง response หลัก (ค่าเริ่มต้น Response Example) */
  successExampleTitle?: string;
  /** แสดงแทน JSON เมื่อ response ไม่ใช่ JSON (เช่น PDF / image) */
  successRaw?: string;
  /** ป้ายประเภท response (ค่าเริ่มต้น JSON) */
  successLabel?: string;
  /** ตัวอย่าง success เพิ่มเติม */
  successExtraExamples?: ExtraExample[];
  errors: ErrorItem[];
  /** หมายเหตุสำคัญ แสดงเป็นกล่องเตือน */
  notes?: string[];
  sections?: DocSection[];
}

export interface FormField {
  key: string;
  value: string;
}