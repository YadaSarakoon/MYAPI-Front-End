export type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Header { key: string; value: string; required: boolean; }
export interface Param { key: string; desc: string; required: boolean; }
export interface BodyField { field: string; type: string; required: boolean; desc: string; }
export interface ResponseExample { code: number; name: string; body: unknown; }
export interface Endpoint {
  id: string;
  group: string;
  name: string;
  method: Method;
  path: string;
  summary: string;
  auth: 'bearer' | 'none';
  headers: Header[];
  pathParams: Param[];
  queryParams: Param[];
  bodyFields: BodyField[];
  bodyType?: string;
  bodyExample?: unknown;
  responses: ResponseExample[];
  successExample: unknown;
}

type AnyRecord = Record<string, any>;

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const inferType = (value: unknown): string => {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  if (typeof value === 'object') return 'object';
  return typeof value;
};

const flattenBody = (value: unknown, prefix = ''): BodyField[] => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
  return Object.entries(value as AnyRecord).flatMap(([key, child]) => {
    const field = prefix ? `${prefix}.${key}` : key;
    const isObject = child && typeof child === 'object' && !Array.isArray(child);
    return [{ field, type: inferType(child), required: true, desc: '' }, ...(isObject ? flattenBody(child, field) : [])];
  });
};

const parseBody = (body: AnyRecord | undefined) => {
  if (!body) return { bodyType: undefined, bodyExample: undefined, bodyFields: [] as BodyField[] };
  if (body.mode === 'formdata') {
    const fields = (body.formdata ?? []).map((item: AnyRecord) => ({
      field: item.key ?? '',
      type: item.type ?? 'string',
      required: true,
      desc: item.description ?? '',
    }));
    return { bodyType: 'formdata', bodyExample: (body.formdata ?? []).map((item: AnyRecord) => ({ key: item.key, value: item.value ?? '' })), bodyFields: fields };
  }

  if (body.mode === 'raw') {
    let parsed: unknown = body.raw;
    try { parsed = JSON.parse(body.raw); } catch { /* keep raw string */ }
    return { bodyType: 'json', bodyExample: parsed, bodyFields: flattenBody(parsed) };
  }

  return { bodyType: body.mode, bodyExample: undefined, bodyFields: [] as BodyField[] };
};

export function parsePostmanCollection(collection: AnyRecord): Endpoint[] {
  const endpoints: Endpoint[] = [];

  for (const group of collection?.item ?? []) {
    for (const item of group?.item ?? []) {
      const request = item.request ?? {};
      const url = request.url ?? {};
      const pathParts = Array.isArray(url.path) ? url.path : [];
      const path = `/${pathParts.join('/')}`.replace(/\/+/g, '/');
      const method = (request.method ?? 'GET') as Method;
      const headers: Header[] = (request.header ?? []).map((h: AnyRecord) => ({
        key: h.key ?? '', value: h.value ?? '', required: !h.disabled,
      }));
      const pathParams: Param[] = (url.variable ?? []).map((p: AnyRecord) => ({
        key: p.key ?? '', desc: p.description ?? '', required: true,
      }));
      const queryParams: Param[] = (url.query ?? []).filter((p: AnyRecord) => !p.disabled).map((p: AnyRecord) => ({
        key: p.key ?? '', desc: p.description ?? '', required: true,
      }));
      const body = parseBody(request.body);
      const responses: ResponseExample[] = (item.response ?? []).map((response: AnyRecord) => {
        let parsed: unknown = response.body ?? '';
        try { parsed = JSON.parse(response.body); } catch { /* non-JSON response */ }
        return { code: Number(response.code ?? 200), name: response.name ?? 'Response', body: parsed };
      });

      endpoints.push({
        id: `${slugify(group.name ?? 'group')}-${slugify(item.name ?? method)}`,
        group: group.name ?? 'API',
        name: item.name ?? 'Untitled Endpoint',
        method,
        path,
        summary: request.description?.content ?? request.description ?? `${method} ${path}`,
        auth: headers.some((h) => h.key.toLowerCase() === 'authorization') ? 'bearer' : 'none',
        headers,
        pathParams,
        queryParams,
        bodyFields: body.bodyFields,
        bodyType: body.bodyType,
        bodyExample: body.bodyExample,
        responses,
        successExample: responses.find((r) => r.code >= 200 && r.code < 300)?.body ?? null,
      });
    }
  }

  return endpoints;
}
