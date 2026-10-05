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

export interface ErrorItem {
  code: number;
  name: string;
  body: Record<string, unknown>;
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
  bodyExample: unknown;
  successCode: number;
  successExample: unknown;
  errors: ErrorItem[];
}

export interface FormField {
  key: string;
  value: string;
}

/* ============================================================
   CONSTANTS
   ============================================================ */
