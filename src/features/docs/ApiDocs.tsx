import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import logo from '../../assets/logo.png';


/* ============================================================
   TYPES
   ============================================================ */

import {
  ENDPOINTS,
  GROUPS,
  GROUP_DESCRIPTIONS,
  METHOD_STYLE,
  STATUS_TABLE,
} from './data';
import type {
  BodyField,
  DocsPage,
  Endpoint,
  FieldGroup,
  FormField,
  Method,
  ResponseField,
} from './types';
const t = (value: string) => value;

function MethodChip({
  method,
  size = 'sm',
}: {
  method: Method;
  size?: 'sm' | 'md';
}) {
  const style = METHOD_STYLE[method];

  return (
    <span
      className={`
        inline-flex shrink-0 items-center justify-center
        rounded-md border font-mono font-bold
        ${style.bg} ${style.text} ${style.border}
        ${
          size === 'sm'
            ? 'px-2 py-0.5 text-xs'
            : 'px-2.5 py-1 text-xs'
        }
      `}
    >
      {method}
    </span>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-3">
      <h2 className="text-xs font-bold text-slate-900">{t(title)}</h2>

      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {t(description)}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {t(label)}
      </div>

      <div className="min-h-7 flex items-center min-w-0">
        {children}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="
        shrink-0 rounded-md px-2 py-1
        text-xs font-semibold text-slate-400
        transition-colors hover:bg-slate-100 hover:text-slate-700
      "
    >
      {(copied ? 'Copied ✓' : 'Copy')}
    </button>
  );
}

function CopyAsMarkdownButton({ markdown }: { markdown: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const handleCopy = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API is unavailable');
      }

      await navigator.clipboard.writeText(markdown);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }

    window.setTimeout(() => setStatus('idle'), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
      aria-live="polite"
    >
      {status === 'copied'
        ? t('Copied!')
        : status === 'failed'
          ? t('Copy failed')
          : t('Copy as Markdown')}
    </button>
  );
}

function markdownCell(value: string) {
  return value.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');
}

function markdownTable(headers: string[], rows: string[][]) {
  if (rows.length === 0) return '';

  return [
    `| ${headers.map(markdownCell).join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(markdownCell).join(' | ')} |`),
  ].join('\n');
}

function exampleAsText(example: unknown) {
  if (typeof example === 'string') return example;
  return JSON.stringify(example, null, 2) ?? '';
}

type RequestLanguage =
  | 'c'
  | 'csharp'
  | 'clojure'
  | 'dart'
  | 'fsharp'
  | 'go'
  | 'java'
  | 'javascript'
  | 'julia'
  | 'kotlin'
  | 'node'
  | 'objective-c'
  | 'ocaml'
  | 'php'
  | 'powershell'
  | 'python'
  | 'r'
  | 'ruby'
  | 'rust'
  | 'shell'
  | 'swift';

type RequestClientId =
  | 'c-libcurl'
  | 'csharp-httpclient'
  | 'csharp-restsharp'
  | 'clojure-clj-http'
  | 'dart-http'
  | 'fsharp-httpclient'
  | 'go-net-http'
  | 'java-okhttp'
  | 'java-unirest'
  | 'javascript-fetch'
  | 'javascript-axios'
  | 'julia-http'
  | 'kotlin-okhttp'
  | 'kotlin-fuel'
  | 'node-axios'
  | 'node-fetch'
  | 'objc-nsurlsession'
  | 'ocaml-cohttp'
  | 'php-guzzle'
  | 'php-curl'
  | 'powershell-restmethod'
  | 'python-requests'
  | 'python-httpclient'
  | 'r-httr'
  | 'r-curl'
  | 'ruby-faraday'
  | 'ruby-nethttp'
  | 'rust-reqwest'
  | 'shell-curl'
  | 'shell-httpie'
  | 'swift-urlsession';

const REQUEST_LANGUAGES: {
  id: RequestLanguage;
  label: string;
  clients: { id: RequestClientId; label: string }[];
}[] = [
  { id: 'c', label: 'C', clients: [{ id: 'c-libcurl', label: 'libcurl' }] },
  { id: 'csharp', label: 'C#', clients: [{ id: 'csharp-httpclient', label: 'HttpClient' }, { id: 'csharp-restsharp', label: 'RestSharp' }] },
  { id: 'clojure', label: 'Clojure', clients: [{ id: 'clojure-clj-http', label: 'clj-http' }] },
  { id: 'dart', label: 'Dart', clients: [{ id: 'dart-http', label: 'package:http' }] },
  { id: 'fsharp', label: 'F#', clients: [{ id: 'fsharp-httpclient', label: 'HttpClient' }] },
  { id: 'go', label: 'Go HTTP', clients: [{ id: 'go-net-http', label: 'net/http' }] },
  { id: 'java', label: 'Java', clients: [{ id: 'java-okhttp', label: 'OkHttp' }, { id: 'java-unirest', label: 'Unirest' }] },
  { id: 'javascript', label: 'JavaScript', clients: [{ id: 'javascript-fetch', label: 'Fetch' }, { id: 'javascript-axios', label: 'Axios' }] },
  { id: 'julia', label: 'Julia', clients: [{ id: 'julia-http', label: 'HTTP.jl' }] },
  { id: 'kotlin', label: 'Kotlin', clients: [{ id: 'kotlin-okhttp', label: 'OkHttp' }, { id: 'kotlin-fuel', label: 'Fuel' }] },
  { id: 'node', label: 'Node.js', clients: [{ id: 'node-axios', label: 'Axios' }, { id: 'node-fetch', label: 'Fetch' }] },
  { id: 'objective-c', label: 'Objective-C', clients: [{ id: 'objc-nsurlsession', label: 'NSURLSession' }] },
  { id: 'ocaml', label: 'OCaml', clients: [{ id: 'ocaml-cohttp', label: 'Cohttp' }] },
  { id: 'php', label: 'PHP', clients: [{ id: 'php-guzzle', label: 'Guzzle' }, { id: 'php-curl', label: 'cURL' }] },
  { id: 'powershell', label: 'PowerShell', clients: [{ id: 'powershell-restmethod', label: 'Invoke-RestMethod' }] },
  { id: 'python', label: 'Python', clients: [{ id: 'python-requests', label: 'Requests' }, { id: 'python-httpclient', label: 'http.client' }] },
  { id: 'r', label: 'R', clients: [{ id: 'r-httr', label: 'httr' }, { id: 'r-curl', label: 'curl' }] },
  { id: 'ruby', label: 'Ruby', clients: [{ id: 'ruby-faraday', label: 'Faraday' }, { id: 'ruby-nethttp', label: 'Net::HTTP' }] },
  { id: 'rust', label: 'Rust', clients: [{ id: 'rust-reqwest', label: 'reqwest' }] },
  { id: 'shell', label: 'Shell', clients: [{ id: 'shell-curl', label: 'cURL' }, { id: 'shell-httpie', label: 'HTTPie' }] },
  { id: 'swift', label: 'Swift', clients: [{ id: 'swift-urlsession', label: 'URLSession' }] },
];

type LanguageIconName = 'shell' | 'ruby' | 'node' | 'php' | 'python' | 'more';

function LanguageIcon({ name }: { name: LanguageIconName }) {
  const common = {
    className: 'h-4 w-4 shrink-0',
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (name) {
    case 'shell':
      return (
        <svg {...common}>
          <path d="m5 8 5 4-5 4" />
          <path d="M13 17h6" />
        </svg>
      );
    case 'ruby':
      return (
        <svg {...common}>
          <path d="M6 4h12l4 6-10 11L2 10l4-6Z" />
          <path d="M2 10h20M8 4l4 6 4-6" />
        </svg>
      );
    case 'node':
      return (
        <svg {...common}>
          <path d="M12 2.5 20 7v10l-8 4.5L4 17V7l8-4.5Z" />
          <text x="12" y="15" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">
            JS
          </text>
        </svg>
      );
    case 'php':
      return (
        <svg {...common}>
          <ellipse cx="12" cy="12" rx="10" ry="6" />
          <text x="12" y="14.5" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor" stroke="none">
            php
          </text>
        </svg>
      );
    case 'python':
      return (
        <svg {...common}>
          <rect x="4" y="3" width="11" height="11" rx="4" />
          <rect x="9" y="10" width="11" height="11" rx="4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="m8 7-5 5 5 5M16 7l5 5-5 5" />
        </svg>
      );
  }
}

function clientTabClass(active: boolean) {
  return `
    -mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5
    text-xs transition-colors
    ${
      active
        ? 'border-slate-900 font-semibold text-slate-900'
        : 'border-transparent font-medium text-slate-500 hover:text-slate-800'
    }
  `;
}

const SORTED_REQUEST_LANGUAGES = [...REQUEST_LANGUAGES].sort((a, b) =>
  a.label.localeCompare(b.label),
);

function RequestClientPicker({
  language,
  client,
  onChange,
  variant = 'code',
  active = false,
}: {
  language: RequestLanguage;
  client: RequestClientId;
  onChange: (language: RequestLanguage, client: RequestClientId) => void;
  variant?: 'code' | 'tab';
  active?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState<{
    top: number;
    right: number;
    maxHeight: number;
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const selectedLanguage = REQUEST_LANGUAGES.find(
    (item) => item.id === language,
  );
  const selectedClient = selectedLanguage?.clients.find(
    (item) => item.id === client,
  );

  const keyword = query.trim().toLowerCase();

  const groups = useMemo(() => {
    if (!keyword) return SORTED_REQUEST_LANGUAGES;

    return SORTED_REQUEST_LANGUAGES.map((group) => ({
      ...group,
      clients: group.label.toLowerCase().includes(keyword)
        ? group.clients
        : group.clients.filter((item) =>
            item.label.toLowerCase().includes(keyword),
          ),
    })).filter((group) => group.clients.length > 0);
  }, [keyword]);

  const close = () => {
    setOpen(false);
    setQuery('');
  };

  const toggle = () => {
    if (open) {
      close();
      return;
    }

    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const top = rect.bottom + 8;
    setPosition({
      top,
      right: Math.max(8, window.innerWidth - rect.right),
      maxHeight: Math.max(200, Math.min(380, window.innerHeight - top - 16)),
    });
    setOpen(true);
  };

  const pick = (nextLanguage: RequestLanguage, nextClient: RequestClientId) => {
    onChange(nextLanguage, nextClient);
    close();
  };

  useEffect(() => {
    if (!open) return;

    const dismiss = () => {
      setOpen(false);
      setQuery('');
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }
      dismiss();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss();
        buttonRef.current?.focus();
      }
    };

    // The panel is position: fixed, so close it when the page scrolls
    // (but not when the list inside the panel scrolls).
    const handleScroll = (event: Event) => {
      if (panelRef.current?.contains(event.target as Node)) return;
      dismiss();
    };

    inputRef.current?.focus({ preventScroll: true });
    selectedRef.current?.scrollIntoView({ block: 'nearest' });

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', dismiss);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', dismiss);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={t('Request code language')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className={
          variant === 'tab'
            ? clientTabClass(active || open)
            : `
              inline-flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1
              text-xs font-semibold transition-colors
              ${
                open
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }
            `
        }
      >
        {variant === 'tab' ? (
          <>
            <LanguageIcon name="more" />
            <span>{t('More')}</span>
          </>
        ) : (
          <>
            <span className="truncate">
              {selectedLanguage?.label} {selectedClient?.label}
            </span>

            <svg
              className={`h-3 w-3 shrink-0 transition-transform ${
                open ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {open &&
        position &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              top: position.top,
              right: position.right,
              maxHeight: position.maxHeight,
            }}
            className="fixed z-50 flex w-64 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"
          >
            <div className="shrink-0 p-2">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35m2.35-6.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>

                <input
                  ref={inputRef}
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && groups[0]) {
                      event.preventDefault();
                      pick(groups[0].id, groups[0].clients[0].id);
                    }
                  }}
                  aria-label={t('Search languages')}
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div role="menu" className="min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
              {groups.length === 0 && (
                <div className="px-2.5 py-6 text-center text-xs text-slate-400">
                  {t('No results')}
                </div>
              )}

              {groups.map((group) => (
                <div key={group.id}>
                  <div className="px-2.5 pb-1 pt-3 text-xs font-medium text-slate-400">
                    {group.label}
                  </div>

                  {group.clients.map((item) => {
                    const selected =
                      group.id === language && item.id === client;

                    return (
                      <button
                        type="button"
                        key={item.id}
                        ref={selected ? selectedRef : undefined}
                        role="menuitemradio"
                        aria-checked={selected}
                        onClick={() => pick(group.id, item.id)}
                        className={`
                          flex w-full items-center gap-2.5 rounded-lg
                          px-2.5 py-2 text-left text-xs transition-colors
                          hover:bg-slate-100
                          ${
                            selected
                              ? 'bg-slate-50 font-semibold text-slate-900'
                              : 'text-slate-700'
                          }
                        `}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            selected ? 'border-indigo-600' : 'border-slate-300'
                          }`}
                        >
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-indigo-600" />
                          )}
                        </span>

                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function isFormExample(example: unknown): example is FormField[] {
  return (
    Array.isArray(example) &&
    example.every(
      (field) =>
        typeof field === 'object' &&
        field !== null &&
        'key' in field &&
        'value' in field &&
        typeof field.key === 'string' &&
        typeof field.value === 'string',
    )
  );
}

function toLanguageValue(value: unknown, language: 'ruby' | 'python'): string {
  if (value === null) return language === 'ruby' ? 'nil' : 'None';
  if (typeof value === 'boolean') {
    if (language === 'ruby') return value ? 'true' : 'false';
    return value ? 'True' : 'False';
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => toLanguageValue(item, language)).join(', ')}]`;
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return language === 'ruby' ? '{}' : '{}';
    const pairs = entries.map(([key, item]) =>
      language === 'ruby'
        ? `${JSON.stringify(key)} => ${toLanguageValue(item, language)}`
        : `${JSON.stringify(key)}: ${toLanguageValue(item, language)}`,
    );
    return `{ ${pairs.join(', ')} }`;
  }
  return 'null';
}

function shellQuote(value: string) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function phpSingleQuote(value: string) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function toPhpValue(value: unknown): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return phpSingleQuote(value);
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (Array.isArray(value)) {
    return `[${value.map(toPhpValue).join(', ')}]`;
  }
  if (typeof value === 'object') {
    return `[${Object.entries(value)
      .map(([key, item]) => `${phpSingleQuote(key)} => ${toPhpValue(item)}`)
      .join(', ')}]`;
  }
  return 'null';
}

const SERVERS = [
  {
    id: 'test',
    url: 'https://dev-open-api.myexpress.ai',
    description: 'Test Environment',
  },
  {
    id: 'production',
    url: 'https://open-api.myexpress.ai',
    description: 'Production Environment',
  },
] as const;

type ServerId = (typeof SERVERS)[number]['id'];

interface ApiClientSettings {
  language: RequestLanguage;
  client: RequestClientId;
  serverId: ServerId;
  token: string;
}

const DEFAULT_CLIENT_SETTINGS: ApiClientSettings = {
  language: 'shell',
  client: 'shell-curl',
  serverId: 'test',
  token: '',
};

function serverUrl(serverId: ServerId): string {
  return SERVERS.find((item) => item.id === serverId)?.url ?? SERVERS[0].url;
}

function requestUrl(endpoint: Endpoint, baseUrl: string = SERVERS[0].url) {
  let path = endpoint.path;
  for (const param of endpoint.pathParams) {
    path = path.replace(`:${param.key}`, encodeURIComponent(param.example));
  }

  const query = endpoint.queryParams
    .map(
      (param) =>
        `${encodeURIComponent(param.key)}=${encodeURIComponent(param.example)}`,
    )
    .join('&');
  const pathWithQuery = query ? `${path}?${query}` : path;

  return path.startsWith('{')
    ? pathWithQuery
    : `${baseUrl}${pathWithQuery}`;
}

function requestHeaders(endpoint: Endpoint) {
  return endpoint.headers
    .filter((header) => header.key.toLowerCase() !== 'content-type' || endpoint.bodyType !== 'formdata')
    .map((header) => [
      header.key,
      header.key.toLowerCase() === 'authorization'
        ? 'Bearer <ACCESS_TOKEN>'
        : header.value,
    ]);
}

function headersJsonToPowerShell(headers: Record<string, string>) {
  const entries = Object.entries(headers)
    .map(([key, value]) => `'${key.replace(/'/g, "''")}' = '${value.replace(/'/g, "''")}'`)
    .join('; ');
  return `@{ ${entries} }`;
}

function requestAsCode(
  endpoint: Endpoint,
  body: unknown,
  client: RequestClientId,
  options: { baseUrl?: string; token?: string } = {},
) {
  const url = requestUrl(endpoint, options.baseUrl);
  const bearerToken = options.token?.trim();
  const headers = requestHeaders(endpoint).map(([key, value]) => [
    key,
    key.toLowerCase() === 'authorization'
      ? 'Bearer <ACCESS_TOKEN>'
      : value,
  ]);
  for (const header of headers) {
    if (header[0].toLowerCase() === ['author', 'ization'].join('')) {
      header[1] = bearerToken
        ? `Bearer ${bearerToken}`
        : ['Bearer', 'YOUR_TOKEN'].join(' ');
    }
  }
  const formFields = endpoint.bodyType === 'formdata' && isFormExample(body)
    ? body
    : null;
  const hasBody = endpoint.bodyType !== 'none' && body != null;

  if (client === 'shell-curl') {
    const lines = [`curl --request ${endpoint.method} \\`, `  --url ${shellQuote(url)}`];
    for (const [key, value] of headers) {
      lines.push(`  --header ${shellQuote(`${key}: ${value}`)}`);
    }
    if (formFields) {
      for (const field of formFields) {
        const value = field.key === 'file' ? `@${field.value}` : field.value;
        lines.push(`  --form ${shellQuote(`${field.key}=${value}`)}`);
      }
    } else if (hasBody) {
      lines.push(`  --data ${shellQuote(JSON.stringify(body))}`);
    }
    return lines.join(' \\\n');
  }

  if (
    client !== 'python-requests' &&
    client !== 'php-guzzle' &&
    client !== 'ruby-faraday'
  ) {
    if (formFields) {
      if (client === 'node-axios' || client === 'javascript-axios') {
        return [
        "const axios = require('axios');",
        "const FormData = require('form-data');",
        "const fs = require('node:fs');",
        '',
        'const form = new FormData();',
        ...formFields.map((field) =>
          field.key === 'file'
            ? `form.append(${JSON.stringify(field.key)}, fs.createReadStream(${JSON.stringify(field.value)}));`
            : `form.append(${JSON.stringify(field.key)}, ${JSON.stringify(field.value)});`,
        ),
        'axios.request({',
        `  method: ${JSON.stringify(endpoint.method)},`,
        `  url: ${JSON.stringify(url)},`,
        `  headers: { ...form.getHeaders(), ${headers.map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)}`).join(', ')} },`,
        '  data: form,',
        '}).then((response) => console.log(response.data));',
        ].join('\n');
      }
    }

      const jsonBody = JSON.stringify(body);
      const headersObject = Object.fromEntries(headers);
      const headerPairs = Object.entries(headersObject)
        .map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)}`)
        .join(', ');

      if (client === 'shell-httpie') {
        return [
          `http ${endpoint.method} ${url}`,
          ...headers.map(([key, value]) => `${key}:${value}`),
          ...(hasBody ? [jsonBody] : []),
        ].join(' \\\n  ');
      }

      if (client === 'javascript-fetch' || client === 'node-fetch') {
        return [
          ...(client === 'node-fetch' ? ["const fetch = require('node-fetch');", ''] : []),
          `const response = await fetch(${JSON.stringify(url)}, {`,
          `  method: ${JSON.stringify(endpoint.method)},`,
          `  headers: { ${headerPairs} },`,
          ...(hasBody ? [`  body: ${JSON.stringify(jsonBody)},`] : []),
          '});',
          'console.log(await response.text());',
        ].join('\n');
      }

      if (client === 'powershell-restmethod') {
        return [
          `$headers = ${headersJsonToPowerShell(Object.fromEntries(headers))}`,
          ...(hasBody ? [`$body = @'\n${JSON.stringify(body, null, 2)}\n'@`] : []),
          `Invoke-RestMethod -Method ${endpoint.method} -Uri '${url}' -Headers $headers${hasBody ? ' -ContentType "application/json" -Body $body' : ''}`,
        ].join('\n');
      }

      if (client === 'c-libcurl') {
        return [
          '#include <curl/curl.h>',
          '',
          'CURL *curl = curl_easy_init();',
          'struct curl_slist *headers = NULL;',
          ...headers.map(([key, value]) => `headers = curl_slist_append(headers, ${JSON.stringify(`${key}: ${value}`)});`),
          `curl_easy_setopt(curl, CURLOPT_URL, ${JSON.stringify(url)});`,
          `curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, ${JSON.stringify(endpoint.method)});`,
          'curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);',
          ...(hasBody ? [`curl_easy_setopt(curl, CURLOPT_POSTFIELDS, ${JSON.stringify(jsonBody)});`] : []),
          'curl_easy_perform(curl);',
          'curl_slist_free_all(headers);',
          'curl_easy_cleanup(curl);',
        ].join('\n');
      }

      if (client === 'csharp-httpclient' || client === 'fsharp-httpclient') {
        const fsharp = client === 'fsharp-httpclient';
        return [
          ...(fsharp ? ['open System.Net.Http', 'open System.Text', '', 'use client = new HttpClient()'] : ['using System.Net.Http;', 'using System.Text;', '', 'using var client = new HttpClient();']),
          ...headers.map(([key, value]) => fsharp
            ? `client.DefaultRequestHeaders.TryAddWithoutValidation(${JSON.stringify(key)}, ${JSON.stringify(value)}) |> ignore`
            : `client.DefaultRequestHeaders.TryAddWithoutValidation(${JSON.stringify(key)}, ${JSON.stringify(value)});`),
          ...(hasBody ? [fsharp
            ? `use content = new StringContent(${JSON.stringify(jsonBody)}, Encoding.UTF8, "application/json")`
            : `using var content = new StringContent(${JSON.stringify(jsonBody)}, Encoding.UTF8, "application/json");`] : []),
          ...(fsharp
            ? [`let! request = new HttpRequestMessage(HttpMethod.${endpoint.method[0]}${endpoint.method.slice(1).toLowerCase()}, ${JSON.stringify(url)})`, ...(hasBody ? ['request.Content <- content'] : []), 'let! response = client.SendAsync(request)']
            : [`using var request = new HttpRequestMessage(HttpMethod.${endpoint.method[0]}${endpoint.method.slice(1).toLowerCase()}, ${JSON.stringify(url)})${hasBody ? ' { Content = content }' : ''};`, 'using var response = await client.SendAsync(request);']),
          fsharp ? 'let! responseBody = response.Content.ReadAsStringAsync()' : 'var responseBody = await response.Content.ReadAsStringAsync();',
        ].join('\n');
      }

      if (client === 'csharp-restsharp') {
        return [
          'using RestSharp;',
          '',
          `var client = new RestClient(${JSON.stringify(url)});`,
          `var request = new RestRequest("", Method.${endpoint.method[0]}${endpoint.method.slice(1).toLowerCase()});`,
          ...headers.map(([key, value]) => `request.AddHeader(${JSON.stringify(key)}, ${JSON.stringify(value)});`),
          ...(hasBody ? [`request.AddStringBody(${JSON.stringify(jsonBody)}, DataFormat.Json);`] : []),
          'var response = await client.ExecuteAsync(request);',
        ].join('\n');
      }

      if (client === 'clojure-clj-http') {
        return [
          "(require '[clj-http.client :as http])",
          '',
          `(http/request {:method :${endpoint.method.toLowerCase()}`,
          `                :url ${JSON.stringify(url)}`,
          `                :headers {${headers.map(([key, value]) => `${JSON.stringify(key)} ${JSON.stringify(value)}`).join(', ')}}${hasBody ? `\n                :body ${JSON.stringify(jsonBody)}` : ''}})`,
        ].join('\n');
      }

      if (client === 'dart-http') {
        return [
          "import 'package:http/http.dart' as http;",
          '',
          `final uri = Uri.parse(${JSON.stringify(url)});`,
          `final request = http.Request(${JSON.stringify(endpoint.method)}, uri);`,
          ...headers.map(([key, value]) => `request.headers[${JSON.stringify(key)}] = ${JSON.stringify(value)};`),
          ...(hasBody ? [`request.body = ${JSON.stringify(jsonBody)};`] : []),
          'final response = await request.send();',
          'print(await response.stream.bytesToString());',
        ].join('\n');
      }

      if (client === 'go-net-http') {
        return [
          'package main',
          '',
          'import (',
          '    "fmt"',
          '    "io"',
          '    "net/http"',
          ...(hasBody ? ['    "strings"'] : []),
          ')',
          '',
          `req, err := http.NewRequest(${JSON.stringify(endpoint.method)}, ${JSON.stringify(url)}, ${hasBody ? `strings.NewReader(${JSON.stringify(jsonBody)})` : 'nil'})`,
          'if err != nil { /* handle error */ }',
          ...headers.map(([key, value]) => `req.Header.Set(${JSON.stringify(key)}, ${JSON.stringify(value)})`),
          'resp, err := http.DefaultClient.Do(req)',
          'if err != nil { /* handle error */ }',
          'defer resp.Body.Close()',
          'responseBody, _ := io.ReadAll(resp.Body)',
          'fmt.Println(string(responseBody))',
        ].join('\n');
      }

      if (client === 'java-okhttp') {
        return [
          'import okhttp3.*;',
          '',
          'OkHttpClient client = new OkHttpClient();',
          ...(hasBody ? [`RequestBody body = RequestBody.create(${JSON.stringify(jsonBody)}, MediaType.parse("application/json"));`] : []),
          'Request request = new Request.Builder()',
          `    .url(${JSON.stringify(url)})`,
          ...headers.map(([key, value]) => `    .addHeader(${JSON.stringify(key)}, ${JSON.stringify(value)})`),
          `    .method(${JSON.stringify(endpoint.method)}, ${hasBody ? 'body' : 'null'})`,
          '    .build();',
          'try (Response response = client.newCall(request).execute()) {',
          '    System.out.println(response.body().string());',
          '}',
        ].join('\n');
      }

      if (client === 'java-unirest') {
        return [
          'import kong.unirest.Unirest;',
          '',
          `var response = Unirest.${endpoint.method.toLowerCase()}(${JSON.stringify(url)})`,
          ...headers.map(([key, value]) => `    .header(${JSON.stringify(key)}, ${JSON.stringify(value)})`),
          ...(hasBody ? [`    .body(${JSON.stringify(jsonBody)})`] : []),
          '    .asString();',
          'System.out.println(response.getBody());',
        ].join('\n');
      }

      if (client === 'julia-http') {
        return [
          'using HTTP',
          '',
          `headers = ${JSON.stringify(headersObject)}`,
          `response = HTTP.request(${JSON.stringify(endpoint.method)}, ${JSON.stringify(url)}, headers${hasBody ? `, ${JSON.stringify(jsonBody)}` : ''})`,
          'println(String(response.body))',
        ].join('\n');
      }

      if (client === 'kotlin-okhttp') {
        return [
          'val client = OkHttpClient()',
          ...(hasBody ? [`val body = ${JSON.stringify(jsonBody)}.toRequestBody("application/json".toMediaType())`] : []),
          'val request = Request.Builder()',
          `    .url(${JSON.stringify(url)})`,
          ...headers.map(([key, value]) => `    .addHeader(${JSON.stringify(key)}, ${JSON.stringify(value)})`),
          `    .method(${JSON.stringify(endpoint.method)}, ${hasBody ? 'body' : 'null'})`,
          '    .build()',
          'client.newCall(request).execute().use { response -> println(response.body?.string()) }',
        ].join('\n');
      }

      if (client === 'kotlin-fuel') {
        return [
          'import com.github.kittinunf.fuel.Fuel',
          '',
          `Fuel.${endpoint.method.toLowerCase()}(${JSON.stringify(url)})`,
          ...headers.map(([key, value]) => `    .header(${JSON.stringify(key)}, ${JSON.stringify(value)})`),
          ...(hasBody ? [`    .body(${JSON.stringify(jsonBody)})`] : []),
          '    .responseString { _, _, result -> println(result.get()) }',
        ].join('\n');
      }

      if (client === 'objc-nsurlsession') {
        return [
          '#import <Foundation/Foundation.h>',
          '',
          `NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:${JSON.stringify(url)}]];`,
          `request.HTTPMethod = ${JSON.stringify(endpoint.method)};`,
          ...headers.map(([key, value]) => `[request setValue:${JSON.stringify(value)} forHTTPHeaderField:${JSON.stringify(key)}];`),
          ...(hasBody ? [`request.HTTPBody = [${JSON.stringify(jsonBody)} dataUsingEncoding:NSUTF8StringEncoding];`] : []),
          'NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {',
          '    NSLog(@"%@", [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding]);',
          '}];',
          '[task resume];',
        ].join('\n');
      }

      if (client === 'ocaml-cohttp') {
        return [
          'open Lwt.Infix',
          'open Cohttp',
          'open Cohttp_lwt_unix',
          '',
          `let headers = Header.of_list [${headers.map(([key, value]) => `(${JSON.stringify(key)}, ${JSON.stringify(value)})`).join('; ')}] in`,
          `let body = ${hasBody ? `Cohttp_lwt.Body.of_string ${JSON.stringify(jsonBody)}` : 'Cohttp_lwt.Body.empty'} in`,
          `Client.call ~headers ~body \`${endpoint.method} (Uri.of_string ${JSON.stringify(url)})`,
          '|= fun (_response, body) -> body |> Cohttp_lwt.Body.to_string |> Lwt.map print_endline',
        ].join('\n');
      }

      if (client === 'php-curl') {
        return [
          '<?php',
          '$curl = curl_init();',
          'curl_setopt_array($curl, [',
          `    CURLOPT_URL => ${phpSingleQuote(url)},`,
          '    CURLOPT_RETURNTRANSFER => true,',
          `    CURLOPT_CUSTOMREQUEST => ${phpSingleQuote(endpoint.method)},`,
          `    CURLOPT_HTTPHEADER => ${toPhpValue(headers.map(([key, value]) => `${key}: ${value}`))},`,
          ...(hasBody ? [`    CURLOPT_POSTFIELDS => ${phpSingleQuote(jsonBody)},`] : []),
          ']);',
          '$response = curl_exec($curl);',
          'curl_close($curl);',
          'echo $response;',
        ].join('\n');
      }

      if (client === 'python-httpclient') {
        return [
          'import http.client',
          'from urllib.parse import urlparse',
          '',
          `url = urlparse(${JSON.stringify(url)})`,
          'connection = http.client.HTTPSConnection(url.netloc)',
          `headers = ${JSON.stringify(headersObject, null, 2)}`,
          ...(hasBody ? [`body = ${JSON.stringify(jsonBody)}`] : []),
          `connection.request(${JSON.stringify(endpoint.method)}, url.path, ${hasBody ? 'body=body, ' : ''}headers=headers)`,
          'response = connection.getresponse()',
          'print(response.read().decode())',
          'connection.close()',
        ].join('\n');
      }

      if (client === 'r-httr') {
        return [
          'library(httr)',
          '',
          `response <- VERB(${JSON.stringify(endpoint.method)}, ${JSON.stringify(url)},`,
          `  add_headers(.headers = ${JSON.stringify(headersObject)}),`,
          ...(hasBody ? [`  body = ${JSON.stringify(jsonBody)},`, '  encode = "raw"'] : ['  encode = "json"']),
          ')',
          'content(response, "text")',
        ].join('\n');
      }

      if (client === 'r-curl') {
        return [
          'library(curl)',
          '',
          'handle <- new_handle()',
          `handle_setopt(handle, customrequest = ${JSON.stringify(endpoint.method)})`,
          ...headers.map(([key, value]) => `handle_setheaders(handle, ${JSON.stringify(`${key}: ${value}`)})`),
          ...(hasBody ? [`handle_setopt(handle, postfields = ${JSON.stringify(jsonBody)})`] : []),
          `response <- curl_fetch_memory(${JSON.stringify(url)}, handle = handle)`,
          'rawToChar(response$content)',
        ].join('\n');
      }

      if (client === 'ruby-nethttp') {
        return [
          'require "net/http"',
          'require "uri"',
          '',
          `uri = URI(${JSON.stringify(url)})`,
          `request = Net::HTTP::${endpoint.method[0]}${endpoint.method.slice(1).toLowerCase()}.new(uri)`,
          ...headers.map(([key, value]) => `request[${JSON.stringify(key)}] = ${JSON.stringify(value)}`),
          ...(hasBody ? [`request.body = ${JSON.stringify(jsonBody)}`] : []),
          'response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: uri.scheme == "https") { |http| http.request(request) }',
          'puts response.body',
        ].join('\n');
      }

      if (client === 'rust-reqwest') {
        return [
          'use reqwest::header::{HeaderMap, HeaderName, HeaderValue};',
          '',
          '#[tokio::main]',
          'async fn main() -> Result<(), Box<dyn std::error::Error>> {',
          '    let client = reqwest::Client::new();',
          '    let mut headers = HeaderMap::new();',
          ...headers.map(([key, value]) => `    headers.insert(HeaderName::from_static(${JSON.stringify(key.toLowerCase())}), HeaderValue::from_static(${JSON.stringify(value)}));`),
          `    let response = client.request(reqwest::Method::${endpoint.method}, ${JSON.stringify(url)}).headers(headers)${hasBody ? `.body(${JSON.stringify(jsonBody)})` : ''}.send().await?;`,
          '    println!("{}", response.text().await?);',
          '    Ok(())',
          '}',
        ].join('\n');
      }

      if (client === 'swift-urlsession') {
        return [
          'import Foundation',
          '',
          `var request = URLRequest(url: URL(string: ${JSON.stringify(url)})!)`,
          `request.httpMethod = ${JSON.stringify(endpoint.method)}`,
          ...headers.map(([key, value]) => `request.setValue(${JSON.stringify(value)}, forHTTPHeaderField: ${JSON.stringify(key)})`),
          ...(hasBody ? [`request.httpBody = ${JSON.stringify(jsonBody)}.data(using: .utf8)`] : []),
          'let (data, _) = try await URLSession.shared.data(for: request)',
          'print(String(data: data, encoding: .utf8) ?? "")',
        ].join('\n');
      }

      if (client === 'node-axios' || client === 'javascript-axios') {
        return [
          "const axios = require('axios');",
          '',
          'axios.request({',
          `  method: ${JSON.stringify(endpoint.method)},`,
          `  url: ${JSON.stringify(url)},`,
          `  headers: { ${headers.map(([key, value]) => `${JSON.stringify(key)}: ${JSON.stringify(value)}`).join(', ')} },`,
          ...(hasBody ? [`  data: ${JSON.stringify(body, null, 2).replace(/\n/g, '\n  ')},`] : []),
          '}).then((response) => console.log(response.data));',
        ].join('\n');
      }

      return '';
  }

  if (client === 'python-requests') {
    if (formFields) {
      return [
        'import requests',
        '',
        `url = ${JSON.stringify(url)}`,
        `headers = ${JSON.stringify(Object.fromEntries(headers), null, 2)}`,
        `data = ${JSON.stringify(Object.fromEntries(formFields.filter((field) => field.key !== 'file').map((field) => [field.key, field.value])), null, 2)}`,
        `files = {${formFields.filter((field) => field.key === 'file').map((field) => `${JSON.stringify(field.key)}: (${JSON.stringify(field.value)}, open(${JSON.stringify(field.value)}, "rb"))`).join(', ')}}`,
        `response = requests.request(${JSON.stringify(endpoint.method)}, url, headers=headers, data=data, files=files)`,
        'print(response.json())',
      ].join('\n');
    }

    return [
      'import requests',
      '',
      `url = ${JSON.stringify(url)}`,
      `headers = ${JSON.stringify(Object.fromEntries(headers), null, 2)}`,
      ...(hasBody
        ? [`json_body = ${toLanguageValue(body, 'python')}`, `response = requests.request(${JSON.stringify(endpoint.method)}, url, headers=headers, json=json_body)`]
        : [`response = requests.request(${JSON.stringify(endpoint.method)}, url, headers=headers)`]),
      'print(response.json())',
    ].join('\n');
  }

  if (client === 'php-guzzle') {
    if (formFields) {
      return [
        '<?php',
        'use GuzzleHttp\\Client;',
        '',
        '$client = new Client();',
        '$response = $client->request(',
        `    ${JSON.stringify(endpoint.method)},`,
        `    ${JSON.stringify(url)},`,
        '    [',
        `        'headers' => ${toPhpValue(Object.fromEntries(headers))},`,
        `        'multipart' => [${formFields.map((field) => field.key === 'file'
          ? `['name' => ${phpSingleQuote(field.key)}, 'contents' => fopen(${phpSingleQuote(field.value)}, 'r')]`
          : `['name' => ${phpSingleQuote(field.key)}, 'contents' => ${phpSingleQuote(field.value)}]`).join(', ')}],`,
        '    ]',
        ');',
        'echo $response->getBody();',
      ].join('\n');
    }

    return [
      '<?php',
      'use GuzzleHttp\\Client;',
      '',
      '$client = new Client();',
      '$response = $client->request(',
      `    ${JSON.stringify(endpoint.method)},`,
      `    ${JSON.stringify(url)},`,
      '    [',
      `        'headers' => ${toPhpValue(Object.fromEntries(headers))},`,
      ...(hasBody
        ? [`        'json' => json_decode(${phpSingleQuote(JSON.stringify(body))}, true),`]
        : []),
      '    ]',
      ');',
      'echo $response->getBody();',
    ].join('\n');
  }

  if (formFields) {
    return [
      'require "faraday"',
      'require "faraday/multipart"',
      '',
      'connection = Faraday.new do |f|',
      '  f.request :multipart',
      '  f.adapter Faraday.default_adapter',
      'end',
      `headers = ${toLanguageValue(Object.fromEntries(headers), 'ruby')}`,
      `body = { ${formFields.map((field) => field.key === 'file'
        ? `${JSON.stringify(field.key)} => Faraday::Multipart::FilePart.new(${JSON.stringify(field.value)}, "application/octet-stream")`
        : `${JSON.stringify(field.key)} => ${JSON.stringify(field.value)}`).join(', ')} }`,
      `response = connection.run_request(${JSON.stringify(endpoint.method.toLowerCase())}, ${JSON.stringify(url)}, body, headers)`,
      'puts response.body',
    ].join('\n');
  }

  return [
    'require "faraday"',
    'require "json"',
    '',
    'connection = Faraday.new',
    `headers = ${toLanguageValue(Object.fromEntries(headers), 'ruby')}`,
    ...(hasBody
      ? [
          `body = ${toLanguageValue(body, 'ruby')}`,
          `response = connection.run_request(${JSON.stringify(endpoint.method.toLowerCase())}, ${JSON.stringify(url)}, JSON.generate(body), headers)`,
        ]
      : [`response = connection.run_request(${JSON.stringify(endpoint.method.toLowerCase())}, ${JSON.stringify(url)}, nil, headers)`]),
    'puts response.body',
  ].join('\n');
}

function endpointAsMarkdown(endpoint: Endpoint) {
  const sections = [
    `# ${endpoint.name}`,
    endpoint.summary,
    GROUP_DESCRIPTIONS[endpoint.group],
    `## Endpoint\n\n- **Method:** ${endpoint.method}\n- **Path:** \`${endpoint.path}\`\n- **Authentication:** ${endpoint.auth === 'bearer' ? 'Bearer token' : 'Not required'}`,
  ].filter(Boolean);

  if (endpoint.headers.length > 0) {
    sections.push(
      `## Headers\n\n${markdownTable(
        ['Key', 'Value', 'Required'],
        endpoint.headers.map((header) => [
          header.key,
          header.value,
          header.required ? 'Yes' : 'No',
        ]),
      )}`,
    );
  }

  if (endpoint.pathParams.length > 0) {
    const showExample = endpoint.id !== 'delete-parcel';
    sections.push(
      `## Path Params\n\n${markdownTable(
        showExample
          ? ['Name', 'Example', 'Description']
          : ['Name', 'Description'],
        endpoint.pathParams.map((param) =>
          showExample
            ? [param.key, param.example, param.desc]
            : [param.key, param.desc],
        ),
      )}`,
    );
  }

  if (endpoint.queryParams.length > 0) {
    sections.push(
      `## Query Params\n\n${markdownTable(
        ['Name', 'Example', 'Required', 'Description'],
        endpoint.queryParams.map((param) => [
          param.key,
          param.example,
          param.required ? 'Yes' : 'No',
          param.desc,
        ]),
      )}`,
    );
  }

  const bodyGroups: FieldGroup<BodyField>[] =
    endpoint.bodyGroups ??
    (endpoint.bodyFields.length > 0
      ? [{ fields: endpoint.bodyFields }]
      : []);

  for (const [index, group] of bodyGroups.entries()) {
    sections.push(
      `## ${group.title ?? (index === 0 ? 'Request Body' : `Request Body ${index + 1}`)}\n\n${markdownTable(
        ['Field', 'Type', 'Required', 'Description'],
        group.fields.map((field) => [
          field.field,
          field.type,
          field.required ? 'Yes' : 'No',
          field.desc,
        ]),
      )}`,
    );
  }

  if (endpoint.notes?.length) {
    sections.push(`## Notes\n\n${endpoint.notes.map((note) => `- ${note}`).join('\n')}`);
  }

  if (endpoint.bodyExample != null) {
    const bodyExample =
      endpoint.bodyType === 'formdata'
        ? (endpoint.bodyExample as FormField[])
            .map((field) => `${field.key}: ${field.value}`)
            .join('\n')
        : exampleAsText(endpoint.bodyExample);

    sections.push(
      `## ${endpoint.bodyExampleTitle ?? 'Request Example'}\n\n\`\`\`${endpoint.bodyType === 'formdata' ? 'text' : 'json'}\n${bodyExample}\n\`\`\``,
    );
  }

  for (const example of endpoint.extraExamples ?? []) {
    sections.push(
      `## ${example.title}\n\n\`\`\`json\n${exampleAsText(example.body)}\n\`\`\``,
    );
  }

  const responseGroups: FieldGroup<ResponseField>[] =
    endpoint.responseGroups ??
    (endpoint.responseFields?.length
      ? [{ fields: endpoint.responseFields }]
      : []);

  for (const [index, group] of responseGroups.entries()) {
    sections.push(
      `## ${group.title ?? (index === 0 ? 'Response Body' : `Response Body ${index + 1}`)}\n\n${markdownTable(
        ['Field', 'Type', 'Description'],
        group.fields.map((field) => [
          field.field,
          field.type,
          field.desc,
        ]),
      )}`,
    );
  }

  for (const section of endpoint.sections ?? []) {
    sections.push(
      `## ${section.title}${section.description ? `\n\n${section.description}` : ''}\n\n${markdownTable(
        section.headers,
        section.rows,
      )}`,
    );
  }

  sections.push(
    `## ${endpoint.successExampleTitle ?? 'Response Example'} (HTTP ${endpoint.successCode})\n\n${endpoint.successLabel ?? 'JSON'}\n\n\`\`\`${endpoint.successRaw ? 'text' : 'json'}\n${exampleAsText(endpoint.successRaw ?? endpoint.successExample)}\n\`\`\``,
  );

  for (const example of endpoint.successExtraExamples ?? []) {
    sections.push(
      `## ${example.title}\n\n\`\`\`json\n${exampleAsText(example.body)}\n\`\`\``,
    );
  }

  if (endpoint.errors.length > 0) {
    sections.push(
      `## Error Responses\n\n${endpoint.errors
        .map(
          (error) =>
            `### ${error.code} — ${error.name}\n\n\`\`\`json\n${exampleAsText(error.body)}\n\`\`\``,
        )
        .join('\n\n')}`,
    );
  }

  return sections.join('\n\n');
}

function CodeCopyButton({ text }: { text: string }) {
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
    <div className="flex shrink-0 items-center gap-2">
      <span
        className="text-xs font-semibold text-slate-300"
        aria-live="polite"
      >
        {copied ? t('Copied') : t('Copy')}
      </span>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={t('Copy code')}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-800/70 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
      >
        {copied ? (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        ) : (
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <rect x="9" y="9" width="11" height="11" rx="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15V6a2 2 0 0 1 2-2h9"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

function CodeBlock({
  children,
  label,
  header,
  tone = 'dark',
}: {
  children: ReactNode;
  label?: string;
  header?: ReactNode;
  tone?: 'dark' | 'light';
}) {
  const text =
    typeof children === 'string' ? children : '';

  return (
    <div
      className={`
        overflow-hidden rounded-xl border
        ${
          tone === 'dark'
            ? 'border-slate-800 bg-[#0B1220]'
            : 'border-slate-200 bg-white'
        }
      `}
    >
      {header && (
        <div
          className={`
            flex flex-wrap items-center justify-between gap-2
            border-b px-3 py-2
            ${
              tone === 'dark'
                ? 'border-slate-800 bg-[#111827]'
                : 'border-slate-200 bg-slate-50'
            }
          `}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2">
            {header}
          </div>
          <CodeCopyButton text={text} />
        </div>
      )}

      {label && !header && (
        <div
          className={`
            flex items-center justify-between
            border-b px-3 py-2
            ${
              tone === 'dark'
                ? 'border-slate-800 bg-[#111827]'
                : 'border-slate-200 bg-slate-50'
            }
          `}
        >
          <span
            className={`
              text-xs font-bold uppercase tracking-wider
              ${
                tone === 'dark'
                  ? 'text-slate-400'
                  : 'text-slate-500'
              }
            `}
          >
            {t(label)}
          </span>

          <CopyButton text={text} />
        </div>
      )}

      <div className="relative">
        <pre
          className={`
            overflow-x-auto p-4
            font-mono text-xs leading-7
            ${
              tone === 'dark'
                ? 'text-indigo-100'
                : 'text-slate-700'
            }
          `}
        >
          {children}
        </pre>
      </div>
    </div>
  );
}

function RequiredBadge({
  required,
}: {
  required?: boolean;
}) {
  return required ? (
    <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-rose-600">
      {t("required")}</span>
  ) : (
    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-slate-400">
      {t("optional")}</span>
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
  onOpenApiClient: () => void;
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
  onOpenApiClient,
}: SidebarProps) {
  const filteredGroups = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return GROUPS;

    return GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) || t(item.name).toLowerCase().includes(keyword) ||
          item.path.toLowerCase().includes(keyword),
      ),
    })).filter((group) => group.items.length > 0);
  }, [search, t]);

  return (
    <aside className="flex h-full w-[272px] shrink-0 flex-col border-r border-slate-200 bg-white">

      {/* Brand */}
      <div className="flex h-[68px] shrink-0 items-center border-b border-slate-100 px-4">
        <button
          type="button"
          onClick={onLanding}
          className="flex min-w-0 items-center gap-3 text-left transition-opacity hover:opacity-80"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            <img src={logo} alt="MyAPI" className="h-8 w-8 object-contain" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-slate-950">
              {t("MyAPI Open API")}</div>

            <div className="mt-0.5 text-xs text-slate-400">
              {t("API Documentation")}</div>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-4.35-4.35m2.35-6.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
            />
          </svg>

          <input
            value={search}
            onChange={(event) =>
              onSearchChange(event.target.value)
            }
            placeholder={t("Search endpoints...")}
            className="
              h-9 w-full rounded-lg border border-slate-200
              bg-slate-50 pl-9 pr-3 text-xs text-slate-700
              outline-none transition-all
              placeholder:text-slate-400
              focus:border-indigo-300 focus:bg-white
              focus:ring-2 focus:ring-indigo-100
            "
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        {/* Getting Started */}
        <div className="mb-4">
          <div className="px-2.5 pb-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            {t("Getting Started")}</div>

          <button
            type="button"
            onClick={() => onPageChange('overview')}
            className={`
              flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2
              text-left text-xs transition-all
              ${
                page === 'overview'
                  ? 'bg-indigo-50 font-semibold text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-md">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21v-7h6v7"
                />
              </svg>
            </span>

            <span>{t("Overview")}</span>
          </button>
        </div>

        {/* Groups */}
        <div className="space-y-3">
          {filteredGroups.map((group) => {
            const collapsed =
              collapsedGroups[group.label];

            return (
              <div key={group.label}>
                <button
                  type="button"
                  onClick={() =>
                    onToggleGroup(group.label)
                  }
                  className="
                    flex w-full items-center justify-between
                    px-2.5 pb-1.5
                    text-xs font-bold uppercase
                    tracking-[0.14em] text-slate-400
                    transition-colors hover:text-slate-600
                  "
                >
                  <span>{t(group.label)}</span>

                  <svg
                    className={`h-3 w-3 transition-transform ${
                      collapsed ? '-rotate-90' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m19 9-7 7-7-7"
                    />
                  </svg>
                </button>

                {!collapsed && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active =
                        page === 'docs' &&
                        item.id === activeId;

                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() =>
                            onEndpointSelect(item.id)
                          }
                          className={`
                            group flex w-full items-center
                            gap-2.5 rounded-lg px-2.5 py-2
                            text-left text-xs transition-all
                            ${
                              active
                                ? 'bg-indigo-50 text-indigo-800'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }
                          `}
                        >
                          <MethodChip
                            method={item.method}
                          />

                          <span
                            className={`
                              min-w-0 flex-1 truncate
                              ${
                                active
                                  ? 'font-semibold'
                                  : ''
                              }
                            `}
                          >
                            {t(item.name)}
                          </span>
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

      {/* Open API Client */}
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={onOpenApiClient}
          className="
            flex w-full items-center justify-between
            rounded-xl bg-indigo-600 px-4 py-3
            text-xs font-bold text-white
            shadow-sm shadow-indigo-200
            transition-all hover:bg-indigo-700
            hover:shadow-md
          "
        >
          <span>{t("Open API Client")}</span>

          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-6-6 6 6-6 6"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}

/* ============================================================
   OVERVIEW PANELS (Server / Authentication / Client Libraries)
   ============================================================ */

function PanelCard({
  title,
  aside,
  children,
}: {
  title: string;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-baseline gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
        <h3 className="text-xs font-semibold text-slate-900">{t(title)}</h3>

        {aside && <span className="text-xs text-slate-400">{t(aside)}</span>}
      </div>

      {children}
    </div>
  );
}

function ServerCard({
  serverId,
  onChange,
}: {
  serverId: ServerId;
  onChange: (serverId: ServerId) => void;
}) {
  const server = SERVERS.find((item) => item.id === serverId) ?? SERVERS[0];

  return (
    <PanelCard title="Server">
      <div className="divide-y divide-slate-200">
        <div className="px-4 py-3">
          <div className="relative inline-flex items-center">
            <select
              aria-label={t('Server')}
              value={server.id}
              onChange={(event) => onChange(event.target.value as ServerId)}
              className="cursor-pointer appearance-none rounded bg-transparent pr-5 text-xs text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-indigo-100"
            >
              {SERVERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.url}
                </option>
              ))}
            </select>

            <svg
              className="pointer-events-none absolute right-0 h-3 w-3 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="px-4 py-3 text-xs text-slate-400">
          {t(server.description)}
        </div>
      </div>
    </PanelCard>
  );
}

function AuthenticationCard({
  token,
  onTokenChange,
  onOpenTokenEndpoint,
}: {
  token: string;
  onTokenChange: (token: string) => void;
  onOpenTokenEndpoint: () => void;
}) {
  return (
    <PanelCard title="Authentication" aside="Required">
      <div className="divide-y divide-slate-200">
        <div className="px-4 py-3 text-xs text-slate-500">
          {t('Access token from')}{' '}
          <button
            type="button"
            onClick={onOpenTokenEndpoint}
            className="font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
          >
            {t('Generate Access Token')}
          </button>{' '}
          {t('endpoint')}
        </div>

        <label className="flex items-center gap-2 px-4 py-3 text-xs">
          <span className="shrink-0 text-slate-800">{t('Bearer Token:')}</span>

          <input
            value={token}
            onChange={(event) => onTokenChange(event.target.value)}
            placeholder={t('Token')}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>
    </PanelCard>
  );
}

const QUICK_CLIENTS: {
  label: string;
  icon: LanguageIconName;
  language: RequestLanguage;
  client: RequestClientId;
}[] = [
  { label: 'Shell', icon: 'shell', language: 'shell', client: 'shell-curl' },
  { label: 'Ruby', icon: 'ruby', language: 'ruby', client: 'ruby-faraday' },
  { label: 'Node.js', icon: 'node', language: 'node', client: 'node-axios' },
  { label: 'PHP', icon: 'php', language: 'php', client: 'php-guzzle' },
  { label: 'Python', icon: 'python', language: 'python', client: 'python-requests' },
];

function ClientLibrariesCard({
  settings,
  onChange,
}: {
  settings: ApiClientSettings;
  onChange: (language: RequestLanguage, client: RequestClientId) => void;
}) {
  const selectedLanguage = REQUEST_LANGUAGES.find(
    (item) => item.id === settings.language,
  );
  const selectedClient = selectedLanguage?.clients.find(
    (item) => item.id === settings.client,
  );
  const quickSelected = QUICK_CLIENTS.some(
    (item) => item.client === settings.client,
  );

  return (
    <PanelCard title="Client Libraries">
      <div className="flex flex-wrap border-b border-slate-200 px-1">
        {QUICK_CLIENTS.map((item) => (
          <button
            type="button"
            key={item.client}
            onClick={() => onChange(item.language, item.client)}
            aria-pressed={item.client === settings.client}
            className={clientTabClass(item.client === settings.client)}
          >
            <LanguageIcon name={item.icon} />
            <span>{t(item.label)}</span>
          </button>
        ))}

        <RequestClientPicker
          variant="tab"
          active={!quickSelected}
          language={settings.language}
          client={settings.client}
          onChange={onChange}
        />
      </div>

      <div className="px-4 py-3 font-mono text-xs text-slate-900">
        {selectedLanguage?.label} {selectedClient?.label}
      </div>
    </PanelCard>
  );
}

/* ============================================================
   OVERVIEW
   ============================================================ */

function Overview({
  onNavigate,
  settings,
  onSettingsChange,
}: {
  onNavigate: (
    page: DocsPage,
    endpointId?: string,
  ) => void;
  settings: ApiClientSettings;
  onSettingsChange: (patch: Partial<ApiClientSettings>) => void;
}) {
  const handleEndpoint = (id: string) => {
    onNavigate('docs', id);
  };

  const overviewCards = [
    [
      'Signing Up',
       'Register as a partner and receive Test Environment credentials.',
    ],
    [
      'API Use Suggestion',
       'Base URLs, HTTP status codes, and error response formats.',
    ],
    [
      'Authentication / Authorization',
       'Generate an access token using OAuth 2.0 Client Credentials.',
    ],
    [
      'Parcel API',
       'Create and delete parcels, look up parcels, and check COD payment status.',
    ],
    [
      'Webhook',
       'Receive parcel status updates through webhooks, review Thai Post status details, and simulate webhooks for testing.',
    ],
    [
      'Print Label',
       'Generate parcel labels as PDF files for up to 20 items per request.',
    ],
    [
      'Verify COD Account',
       'Upload documents, register a COD sender account, and check its approval status.',
    ],
  ];

  const signupSteps = [
    [
      '01',
      'Partner submit Google Form',
       'The partner submits a form to register for MyAPI Open API.',
      'https://forms.gle/FHuFkuTXCHW9kBTR9',
    ],
    [
      '02',
      'MyAPI create Partner Account',
       'MyExpress creates the partner account, generates client_id / client_secret, and configures the webhook.',
      '',
    ],
    [
      '03',
      'Receive Test Credentials',
       'MyExpress sends the client_id and client_secret for the Test Environment.',
      '',
    ],
    [
      '04',
      'Self-test in Test Environment',
       'The partner tests API suggestions, authentication/authorization, parcel creation and deletion, and webhooks in the Test Environment.',
      '',
    ],
    [
      '05',
      'Plan go-live',
       'The partner prepares for production launch.',
      '',
    ],
    [
      '06',
      'Receive Production Credentials',
       'MyExpress sends the client_id and client_secret for the Production Environment.',
      '',
    ],
  ];

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="mx-auto max-w-[1360px] px-7 py-9 lg:px-12">
        <div className="grid items-start gap-6 xl:grid-cols-12">
          <div className="min-w-0 space-y-6 xl:col-span-7">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-indigo-50 blur-3xl" />

            <div className="relative p-7 lg:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                    {t("Getting Started")}</div>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl">
                    {t("MyAPI Open API")}</h1>

                  <p className="mt-3 max-w-2xl text-xs leading-7 text-slate-500">
                    {t("Introduction and guide for integrating your application with MyAPI Open API.")}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a
                    href="/openapi.json"
                    download="openapi.json"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {t("Download JSON")}
                  </a>
                  <a
                    href="/openapi.yaml"
                    download="openapi.yaml"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {t("Download YAML")}
                  </a>
                </div>
              </div>

            </div>
          </section>

          {/* Introduction */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xs font-bold text-slate-950">
                {t("Introduction")}</h2>

              <p className="mt-1 text-xs text-slate-500">
                {t("Everything you need to start integrating with MyAPI.")}</p>
            </div>

            <div className="p-6">
              <p className="text-xs leading-7 text-slate-600">
                {t("This documentation covers the steps required to sign up as a Partner, receive Test Environment Credentials, understand authentication, and integrate MyAPI Open API with your application.")}</p>

              <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
                {overviewCards.map(
                  ([title, description]) => (
                    <div
                      key={title}
                      className="
                        rounded-xl border border-slate-200
                        bg-slate-50/70 p-4
                        transition-colors
                        hover:border-indigo-200
                        hover:bg-indigo-50/40
                      "
                    >
                      <div className="text-xs font-bold text-slate-900">
                        {t(title)}
                      </div>

                      <p className="mt-1.5 text-xs leading-6 text-slate-500">
                        {t(description)}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </section>

          {/* Signing Up */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xs font-bold text-slate-950">
                {t("Signing Up & Getting Started")}</h2>

              <p className="mt-1 text-xs text-slate-500">
                {"Partner onboarding, credentials, and API setup"}</p>
            </div>

            <div className="p-6">
              <div className="relative ml-3 border-l border-slate-200 pl-8">
                <div className="space-y-7">
                  {signupSteps.map(
                    ([num, title, desc, link]) => (
                      <div
                        key={num}
                        className="relative"
                      >
                        <span className="absolute -left-[45px] top-0 flex h-7 w-7 items-center justify-center rounded-full border-4 border-white bg-indigo-600 text-xs font-bold text-white shadow-sm">
                          {num}
                        </span>

                        <h3 className="text-xs font-bold text-slate-900">
                          {t(title)}
                        </h3>

                        <p className="mt-1 text-xs leading-6 text-slate-500">
                          {t(desc)}
                        </p>

                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              mt-2 inline-flex items-center gap-1
                              text-xs font-semibold
                              text-indigo-600
                              hover:text-indigo-800
                            "
                          >
                            {t("Open Google Form")}<span>↗</span>
                          </a>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* API Use Suggestion */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-xs font-bold text-slate-950">
                {t("API Use Suggestion")}</h2>

              <p className="mt-1 text-xs text-slate-500">
                {"Base URLs and API response standards"}</p>
            </div>

            <div className="space-y-6 p-6">
              {/* Environment */}
              <div>
                <SectionTitle title={t("Environment")} />

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">
                          {t("Environment")}</th>
                        <th className="px-4 py-3 font-semibold">
                          {t("Base URL")}</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {t("Test")}</td>

                        <td className="px-4 py-3">
                          <code className="rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-indigo-700">
                            {t("https://dev-open-api.myexpress.ai")}</code>
                        </td>
                      </tr>

                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {t("Production")}</td>

                        <td className="px-4 py-3">
                          <code className="rounded-md bg-slate-50 px-2 py-1 font-mono text-xs text-indigo-700">
                            {t("https://open-api.myexpress.ai")}</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status */}
              <div>
                <SectionTitle title={t("Response Status Code")} />

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="w-28 px-4 py-3 font-semibold">
                          {t("Status")}</th>
                        <th className="px-4 py-3 font-semibold">
                          {t("Detail")}</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {STATUS_TABLE.map((status) => (
                        <tr key={status.code}>
                          <td className="px-4 py-3">
                            <span
                              className={`
                                inline-flex rounded-md px-2 py-1
                                font-mono text-xs font-bold
                                ${
                                  status.code === 200
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : status.code >= 400
                                      ? 'bg-rose-50 text-rose-600'
                                      : 'bg-slate-50 text-slate-600'
                                }
                              `}
                            >
                              {status.code}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {t(status.detail)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Error */}
              <div>
                <SectionTitle title={t("Error Response Detail")} />

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">
                          {t("Name")}</th>
                        <th className="px-4 py-3 font-semibold">
                          {t("Description")}</th>
                        <th className="px-4 py-3 font-semibold">
                          {t("Type")}</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {[
                        [
                          'status',
                          'status error code',
                          'Number',
                        ],
                        [
                          'error_description',
                          'error description',
                          'String',
                        ],
                        [
                          'name',
                          'error name from Bad request',
                          'String',
                        ],
                        [
                          'error',
                          'error name',
                          'String',
                        ],
                        [
                          'message',
                          'detail error',
                          'String',
                        ],
                      ].map(([name, description, type]) => (
                        <tr key={name}>
                          <td className="px-4 py-3">
                            <code className="font-mono font-semibold text-indigo-700">
                              {name}
                            </code>
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {t(description)}
                          </td>

                          <td className="px-4 py-3">
                            <code className="font-mono text-slate-400">
                              {type}
                            </code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Explore API */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              title={t("Explore API")}
              description={"Select an API endpoint to view its details"}
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                [
                  'Authentication',
                  'Generate Access Token',
                  'generate-access-token',
                ],
                [
                  'Parcel API',
                  'Create Parcel (NON_COD / COD)',
                  'create-parcel',
                ],
                [
                  'Webhook',
                  'Simulate Thaipost Webhook',
                  'simulate-thaipost-webhook',
                ],
                [
                  'Print Label',
                  'Print Label',
                  'print-label',
                ],
                [
                  'Verify COD Account',
                  'Create Sender COD',
                  'create-sender-cod',
                ],
              ].map(([group, title, id]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => handleEndpoint(id)}
                  className="
                    group rounded-xl border border-slate-200
                    bg-white p-4 text-left
                    transition-all hover:-translate-y-0.5
                    hover:border-indigo-300
                    hover:bg-indigo-50/30
                    hover:shadow-sm
                  "
                >
                  <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    {t(group)}
                  </div>

                  <div className="mt-2 text-xs font-bold text-slate-900">
                    {t(title)}
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-transform group-hover:translate-x-0.5">
                    {t("View API")}<span>→</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="h-2" />
          </div>

          <aside className="min-w-0 space-y-4 xl:sticky xl:top-6 xl:col-span-5">
            <ServerCard
              serverId={settings.serverId}
              onChange={(serverId) => onSettingsChange({ serverId })}
            />

            <AuthenticationCard
              token={settings.token}
              onTokenChange={(token) => onSettingsChange({ token })}
              onOpenTokenEndpoint={() => handleEndpoint('generate-access-token')}
            />

            <ClientLibrariesCard
              settings={settings}
              onChange={(language, client) =>
                onSettingsChange({ language, client })
              }
            />
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   API DOCUMENTATION
   ============================================================ */

function Documentation({
  endpoint,
  settings,
  onSettingsChange,
}: {
  endpoint: Endpoint;
  settings: ApiClientSettings;
  onSettingsChange: (patch: Partial<ApiClientSettings>) => void;
}) {
  const requestLanguage = settings.language;
  const requestClient = settings.client;
  const requestOptions = {
    baseUrl: serverUrl(settings.serverId),
    token: settings.token,
  };
  const handleClientChange = (
    language: RequestLanguage,
    client: RequestClientId,
  ) => {
    onSettingsChange({ language, client });
  };
  const requestHeader = (
    <>
      <div className="flex min-w-0 items-center gap-2">
        <span
          className={`shrink-0 font-mono text-xs font-bold ${METHOD_STYLE[endpoint.method].text}`}
        >
          {endpoint.method}
        </span>

        <code className="min-w-0 truncate font-mono text-xs text-slate-300">
          {endpoint.path}
        </code>
      </div>

      <RequestClientPicker
        language={requestLanguage}
        client={requestClient}
        onChange={handleClientChange}
      />
    </>
  );
  const showPathParamExample = endpoint.id !== 'delete-parcel';
  const requestExample = requestAsCode(
    endpoint,
    endpoint.bodyExample,
    requestClient,
    requestOptions,
  );

  const successExample =
    endpoint.successRaw ??
    JSON.stringify(endpoint.successExample, null, 2);

  const bodyGroups: FieldGroup<BodyField>[] =
    endpoint.bodyGroups ??
    (endpoint.bodyFields.length > 0
      ? [{ fields: endpoint.bodyFields }]
      : []);

  const responseGroups: FieldGroup<ResponseField>[] =
    endpoint.responseGroups ??
    (endpoint.responseFields &&
    endpoint.responseFields.length > 0
      ? [{ fields: endpoint.responseFields }]
      : []);

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="mx-auto max-w-[1600px] px-7 py-8 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          {/* Main Documentation */}
          <section className="min-w-0 space-y-7 xl:col-span-7">
            {/* Endpoint Header */}
            <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-6 lg:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                    {t(endpoint.name)}
                  </h1>
                  <CopyAsMarkdownButton markdown={endpointAsMarkdown(endpoint)} />
                </div>

                <p className="mt-2 max-w-3xl text-xs leading-7 text-slate-500">
                  {t(endpoint.summary)}
                </p>

                {GROUP_DESCRIPTIONS[endpoint.group] && (
                  <p className="mt-3 max-w-3xl rounded-lg bg-slate-50 px-3 py-2 text-xs leading-6 text-slate-500">
                    {t(GROUP_DESCRIPTIONS[endpoint.group])}
                  </p>
                )}
              </div>

              {/* Path */}
              <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-3 lg:px-7">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`
                      shrink-0 rounded-md px-2.5 py-1
                      text-xs font-bold text-white
                      ${METHOD_STYLE[endpoint.method].solid}
                    `}
                  >
                    {endpoint.method}
                  </span>

                  <code className="min-w-0 flex-1 truncate rounded-md px-1 font-mono text-xs text-slate-700">
                    {endpoint.path}
                  </code>

                  <CopyButton text={endpoint.path} />
                </div>
              </div>
            </header>

            {/* Notes */}
            {endpoint.notes && endpoint.notes.length > 0 && (
              <div className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                {endpoint.notes.map((note) => (
                  <p
                    key={note}
                    className="text-xs leading-6 text-amber-800"
                  >
                    {t(note)}
                  </p>
                ))}
              </div>
            )}

            {/* Endpoint Details */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-xs font-bold text-slate-950">
                  {t("Endpoint")}</h2>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                <Field label={t("Method")}>
                  <MethodChip
                    method={endpoint.method}
                    size="md"
                  />
                </Field>

                <Field label={t("Authentication")}>
                  {endpoint.auth === 'bearer' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {t("Bearer Access Token")}</span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      {"Authentication not required"}</span>
                  )}
                </Field>

                <Field label={t("Path")}>
                  <div className="flex min-w-0 max-w-full items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                    <code className="min-w-0 truncate font-mono text-xs text-indigo-700">
                      {endpoint.path}
                    </code>

                    <CopyButton text={endpoint.path} />
                  </div>
                </Field>

                <Field label={t("Content Type")}>
                  <code className="max-w-full truncate rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-xs text-slate-600">
                    {endpoint.headers.find(
                      (header) =>
                        header.key === 'Content-Type',
                    )?.value || '—'}
                  </code>
                </Field>
              </div>
            </section>

            {/* Headers */}
            {endpoint.headers.length > 0 && (
              <section>
                <SectionTitle
                  title={t("Headers")}
                  description={t("HTTP headers required for this request.")}
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50">
                        <tr className="text-slate-500">
                          <th className="px-4 py-3 font-semibold">
                            {t("Key")}</th>
                          <th className="px-4 py-3 font-semibold">
                            {t("Value")}</th>
                          <th className="w-28 px-4 py-3 font-semibold">
                            {t("Required")}</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {endpoint.headers.map(
                          (header) => (
                            <tr
                              key={header.key}
                              className="transition-colors hover:bg-slate-50/70"
                            >
                              <td className="px-4 py-3.5">
                                <code className="font-mono font-semibold text-indigo-700">
                                  {header.key}
                                </code>
                              </td>

                              <td className="px-4 py-3.5">
                                <code className="font-mono text-xs text-slate-500">
                                  {header.value}
                                </code>
                              </td>

                              <td className="px-4 py-3.5">
                                <RequiredBadge
                                  required={
                                    header.required
                                  }
                                />
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Path Params */}
            {endpoint.pathParams.length > 0 && (
              <section>
                <SectionTitle
                  title={t("Path Params")}
                  description={t("Parameters included directly in the URL path.")}
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className={`w-full ${showPathParamExample ? 'min-w-[560px]' : 'min-w-[420px]'} text-left text-xs`}>
                      <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            {t("Name")}</th>
                          {showPathParamExample && (
                            <th className="px-4 py-3 font-semibold">
                              {t("Example")}</th>
                          )}
                          <th className="px-4 py-3 font-semibold">
                            {t("Description")}</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {endpoint.pathParams.map(
                          (param) => (
                            <tr key={param.key}>
                              <td className="px-4 py-3.5">
                                <code className="font-mono font-semibold text-indigo-700">
                                  {param.key}
                                </code>
                              </td>

                              {showPathParamExample && (
                                <td className="px-4 py-3.5">
                                  <code className="font-mono text-xs text-slate-500">
                                    {param.example}
                                  </code>
                                </td>
                              )}

                              <td className="px-4 py-3.5 leading-5 text-slate-600">
                                {t(param.desc)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Query Params */}
            {endpoint.queryParams.length > 0 && (
              <section>
                <SectionTitle
                  title={t("Query Params")}
                  description={t("Optional or required parameters appended to the URL.")}
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            {t("Name")}</th>
                          <th className="px-4 py-3 font-semibold">
                            {t("Example")}</th>
                          <th className="w-28 px-4 py-3 font-semibold">
                            {t("Required")}</th>
                          <th className="px-4 py-3 font-semibold">
                            {t("Description")}</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {endpoint.queryParams.map(
                          (param) => (
                            <tr key={param.key}>
                              <td className="px-4 py-3.5">
                                <code className="font-mono font-semibold text-indigo-700">
                                  {param.key}
                                </code>
                              </td>

                              <td className="px-4 py-3.5">
                                <code className="font-mono text-xs text-slate-500">
                                  {param.example}
                                </code>
                              </td>

                              <td className="px-4 py-3.5">
                                <RequiredBadge
                                  required={
                                    param.required
                                  }
                                />
                              </td>

                              <td className="px-4 py-3.5 leading-5 text-slate-600">
                                {t(param.desc)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* Request Body */}
            {bodyGroups.map((group, groupIndex) => (
              <section key={group.title ?? groupIndex}>
                <SectionTitle
                  title={group.title ?? t("Request Body")}
                  description={t("Fields accepted in the request payload.")}
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            {t("Field")}</th>
                          <th className="w-28 px-4 py-3 font-semibold">
                            {t("Type")}</th>
                          <th className="w-28 px-4 py-3 font-semibold">
                            {t("Required")}</th>
                          <th className="px-4 py-3 font-semibold">
                            {t("Description")}</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {group.fields.map(
                          (field) => (
                            <tr
                              key={field.field}
                              className="align-top"
                            >
                              <td className="px-4 py-3.5">
                                <code className="font-mono font-semibold text-indigo-700">
                                  {field.field}
                                </code>
                              </td>

                              <td className="px-4 py-3.5">
                                <code className="font-mono text-xs text-slate-400">
                                  {field.type}
                                </code>
                              </td>

                              <td className="px-4 py-3.5">
                                <RequiredBadge
                                  required={
                                    field.required
                                  }
                                />
                              </td>

                              <td className="px-4 py-3.5 leading-6 text-slate-600">
                                {t(field.desc)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            ))}

            {/* Response Body */}
            {responseGroups.map((group, groupIndex) => (
                <section key={group.title ?? groupIndex}>
                  <SectionTitle
                    title={group.title ?? t("Response Body")}
                    description={t("Fields returned in the successful response.")}
                  />

                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-left text-xs">
                        <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-4 py-3 font-semibold">
                              {t("Field")}</th>
                            <th className="w-28 px-4 py-3 font-semibold">
                              {t("Type")}</th>
                            <th className="px-4 py-3 font-semibold">
                              {t("Description")}</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {group.fields.map(
                            (field) => (
                              <tr
                                key={field.field}
                                className="align-top"
                              >
                                <td className="px-4 py-3.5">
                                  <code className="font-mono font-semibold text-indigo-700">
                                    {field.field}
                                  </code>
                                </td>

                                <td className="px-4 py-3.5">
                                  <code className="font-mono text-xs text-slate-400">
                                    {field.type}
                                  </code>
                                </td>

                                <td className="px-4 py-3.5 leading-6 text-slate-600">
                                  {t(field.desc)}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>
              ))}

            {/* Extra tables (e.g. Status Detail) */}
            {endpoint.sections?.map((section) => (
              <section key={section.title}>
                <SectionTitle
                  title={section.title}
                  description={section.description}
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="max-h-[560px] overflow-auto">
                    <table className="w-full min-w-[560px] text-left text-xs">
                      <thead className="sticky top-0 border-b border-slate-100 bg-slate-50 text-slate-500">
                        <tr>
                          {section.headers.map((header) => (
                            <th
                              key={header}
                              className="px-4 py-3 font-semibold"
                            >
                              {t(header)}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {section.rows.map((row) => (
                          <tr
                            key={row.join('|')}
                            className="align-top"
                          >
                            {row.map((cell, index) => (
                              <td
                                key={index}
                                className="px-4 py-3 leading-5 text-slate-600"
                              >
                                {index === 0 ? (
                                  <code className="font-mono font-semibold text-indigo-700">
                                    {cell}
                                  </code>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            ))}
          </section>

          {/* Right Rail */}
          <aside className="min-w-0 space-y-5 xl:sticky xl:top-6 xl:col-span-5">
            {/* Request */}
            {endpoint.bodyExample != null && (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-950">
                      {t(endpoint.bodyExampleTitle ?? "Request Example")}</h3>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {t('HTTP REQUEST')}
                      </span>
                    </div>
                  </div>

                </div>

                <div className="p-4">
                  <CodeBlock header={requestHeader}>
                    {requestExample}
                  </CodeBlock>
                </div>
              </section>
            )}

            {/* Extra request examples */}
            {endpoint.extraExamples?.map((example) => (
              <section
                key={example.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <h3 className="text-xs font-bold text-slate-950">
                    {t(example.title)}
                  </h3>

                </div>

                <div className="p-4">
                  <CodeBlock header={requestHeader}>
                    {requestAsCode(endpoint, example.body, requestClient, requestOptions)}
                  </CodeBlock>
                </div>
              </section>
            ))}

            {/* Response */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-950">
                    {t(endpoint.successExampleTitle ?? "Response Example")}</h3>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-xs font-bold text-emerald-600">
                      {endpoint.successCode}
                    </span>

                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t(endpoint.successLabel ?? 'JSON')}</span>
                  </div>
                </div>

                <CopyButton text={successExample} />
              </div>

              <div className="p-4">
                <CodeBlock>
                  {successExample}
                </CodeBlock>
              </div>
            </section>

            {/* Extra success examples */}
            {endpoint.successExtraExamples?.map((example) => (
              <section
                key={example.title}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <h3 className="text-xs font-bold text-slate-950">
                    {t(example.title)}
                  </h3>

                  <CopyButton
                    text={JSON.stringify(example.body, null, 2)}
                  />
                </div>

                <div className="p-4">
                  <CodeBlock>
                    {JSON.stringify(example.body, null, 2)}
                  </CodeBlock>
                </div>
              </section>
            ))}

            {/* Errors */}
            {endpoint.errors.length > 0 && (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-950">
                      {t("Error Response")}</h3>

                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t("JSON")}</div>
                  </div>

                  <span className="text-xs text-slate-400">
                    {endpoint.errors.length}{' '}
                    {t(endpoint.errors.length === 1
                      ? 'Example'
                      : 'Examples')}
                  </span>
                </div>

                <div className="space-y-4 p-4">
                  {endpoint.errors.map((error) => (
                    <div
                      key={`${error.code}-${error.name}`}
                      className="overflow-hidden rounded-xl border border-rose-100"
                    >
                      <div className="flex items-center justify-between bg-rose-50 px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-white px-2 py-0.5 font-mono text-xs font-bold text-rose-600 shadow-sm">
                            {error.code}
                          </span>

                          <span className="text-xs font-semibold text-rose-700">
                            {error.name}
                          </span>
                        </div>
                      </div>

                      <div className="p-3">
                        <CodeBlock>
                          {JSON.stringify(
                            error.body,
                            null,
                            2,
                          )}
                        </CodeBlock>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </aside>
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export function ApiDocs() {
  const [page, setPage] =
    useState<DocsPage>('overview');

  const [activeId, setActiveId] = useState<string>(
    ENDPOINTS[0].id,
  );

  const [search, setSearch] = useState('');

  const [collapsedGroups, setCollapsedGroups] =
    useState<Record<string, boolean>>({});

  const [settings, setSettings] = useState<ApiClientSettings>(
    DEFAULT_CLIENT_SETTINGS,
  );

  const updateSettings = (patch: Partial<ApiClientSettings>) => {
    setSettings((current) => ({ ...current, ...patch }));
  };

  const endpoint = useMemo(
    () =>
      ENDPOINTS.find(
        (item) => item.id === activeId,
      ) || ENDPOINTS[0],
    [activeId],
  );

  const selectEndpoint = (id: string) => {
    setActiveId(id);
    setPage('docs');
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((current) => ({
      ...current,
      [group]: !current[group],
    }));
  };

  const goLanding = () => {
    window.location.assign('/');
  };

  const goOpenApiClient = () => {
    window.location.assign('https://client.scalar.com/@local/default/get-started?url=https://docs.myexpress.ai/openapi.yaml&integration=html&utm_source=api-reference&utm_medium=button&utm_campaign=sidebar');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-xs text-slate-800">
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
        onOpenApiClient={goOpenApiClient}
      />

      <div className="flex min-w-0 flex-1 flex-col">
      {page === 'overview' ? (
        <Overview
          settings={settings}
          onSettingsChange={updateSettings}
          onNavigate={(target, endpointId) => {
            if (endpointId) {
              selectEndpoint(endpointId);
              return;
            }

            setPage(target);
          }}
        />
      ) : (
        <Documentation
          endpoint={endpoint}
          settings={settings}
          onSettingsChange={updateSettings}
        />
      )}
      </div>
    </div>
  );
}

export default ApiDocs;