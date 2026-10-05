export type Method = 'GET' | 'POST' | 'DELETE';
export type Env = 'test' | 'prod';
export type BodyType = 'json' | 'formdata' | 'none';
export type AuthType = 'none' | 'bearer';
export type ClientLibraryLanguage =
  | 'C# - HttpClient' | 'C# - RestSharp' | 'cURL - cURL' | 'Dart - http' | 'Go - Native'
  | 'HTTP - HTTP' | 'Java - OkHttp' | 'Java - Unirest' | 'JavaScript - Fetch'
  | 'JavaScript - jQuery' | 'JavaScript - XHR' | 'C - libcurl' | 'NodeJs - Axios'
  | 'NodeJs - Native' | 'NodeJs - Request' | 'NodeJs - Unirest' | 'Objective-C - NSURLSession'
  | 'OCaml - Cohttp' | 'PHP - cURL' | 'PHP - Guzzle' | 'PHP - HTTP_Request2' | 'PHP - pecl_http'
  | 'PowerShell - RestMethod' | 'Python - http.client' | 'Python - Requests' | 'R - httr' | 'R - RCurl';
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

export type StringMap = Record<string, string>;

export interface SandboxCredentials {
  clientId: string;
  clientSecret: string;
  createdAt: string;
}

export type ApiResponseState =
  | { loading: true }
  | { loading?: false; status: number; ms: number; body: unknown; demo?: boolean }
  | null;

/* ============================================================
   CONSTANTS — same design language as the API Docs page
   ============================================================ */
