import { useMemo, useState, type ReactNode } from 'react';
import logo from '../../assets/logo.png';


/* ============================================================
   TYPES
   ============================================================ */

import { ENDPOINTS, GROUPS, METHOD_STYLE, STATUS_TABLE } from './data';
import type {
  DocsPage,
  Endpoint,
  FormField,
  Method,
} from './types';
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
            : 'px-2.5 py-1 text-[11px]'
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
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>

      {description && (
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
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
        {label}
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
      {label && (
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
            {label}
          </span>

          <CopyButton text={text} />
        </div>
      )}

      <pre
        className={`
          overflow-x-auto p-4
          font-mono text-[11px] leading-6
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
  );
}

function RequiredBadge({
  required,
}: {
  required?: boolean;
}) {
  return required ? (
    <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose-600">
      required
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
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
  onSandbox: () => void;
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
  onSandbox,
}: SidebarProps) {
  const filteredGroups = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return GROUPS;

    return GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.path.toLowerCase().includes(keyword),
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            <img src={logo} alt="MyAPI" className="h-8 w-8 object-contain" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-slate-950">
              MyAPI Open API
            </div>

            <div className="mt-0.5 text-xs text-slate-400">
              API Documentation
            </div>
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
            placeholder="Search endpoints..."
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
            Getting Started
          </div>

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

            <span>Overview</span>
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
                  <span>{group.label}</span>

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
                            {item.name}
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

      {/* Sandbox */}
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={onSandbox}
          className="
            flex w-full items-center justify-between
            rounded-xl bg-indigo-600 px-4 py-3
            text-xs font-bold text-white
            shadow-sm shadow-indigo-200
            transition-all hover:bg-indigo-700
            hover:shadow-md
          "
        >
          <span>Go to Sandbox</span>

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
   OVERVIEW
   ============================================================ */

function Overview({
  onNavigate,
}: {
  onNavigate: (
    page: DocsPage,
    endpointId?: string,
  ) => void;
}) {
  const handleEndpoint = (id: string) => {
    onNavigate('docs', id);
  };

  const overviewCards = [
    [
      'Signing Up',
      'เริ่มต้นสมัคร Partner และรับ credentials สำหรับ Sandbox.',
    ],
    [
      'API Use Suggestion',
      'Base URL, HTTP status codes และรูปแบบ Error Response.',
    ],
    [
      'Authentication / Authorization',
      'สร้าง Access Token ด้วย OAuth 2.0 Client Credentials.',
    ],
    [
      'Parcel API',
      'สร้าง ค้นหา ลบพัสดุ และตรวจสอบสถานะการชำระเงิน COD.',
    ],
    [
      'Webhook',
      'เรียนรู้รูปแบบการรับสถานะพัสดุผ่าน Webhook.',
    ],
  ];

  const signupSteps = [
    [
      '01',
      'Partner submit Google Form',
      'Partner ส่งแบบฟอร์มเพื่อสมัครใช้งาน MyAPI Open API.',
      'https://forms.gle/FHuFkuTXCHW9kBTR9',
    ],
    [
      '02',
      'MyAPI create Partner Account',
      'สร้าง account information, generate client_id / client_secret และ setup webhook.',
      '',
    ],
    [
      '03',
      'Receive Test Credentials',
      'MyAPI ส่ง client_id และ client_secret สำหรับ Test Environment.',
      '',
    ],
    [
      '04',
      'Go to Sandbox',
      'ขอ Test Credential และทดลองยิง API จริงใน Sandbox.',
      '',
    ],
    [
      '05',
      'Plan go-live',
      'Partner เตรียมความพร้อมเพื่อใช้งาน Production Environment.',
      '',
    ],
    [
      '06',
      'Receive Production Credentials',
      'MyAPI ส่ง client_id และ client_secret สำหรับ Production Environment.',
      '',
    ],
  ];

  const quickStart = [
    ['1', 'Sign Up', 'กรอกแบบฟอร์มเพื่อสมัคร Partner'],
    [
      '2',
      'Get Sandbox Credentials',
      'รับ client_id / client_secret สำหรับ Test Environment',
    ],
    [
      '3',
      'Read API Docs & Test',
      'ศึกษาวิธีเรียก API และทดลองใช้งานผ่าน Sandbox',
    ],
    [
      '4',
      'Go Live',
      'เตรียม Production และรับ Production Credentials เมื่อพร้อมใช้งานจริง',
    ],
  ];

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-indigo-50 blur-3xl" />

            <div className="relative p-7 lg:p-8">
              <div className="mb-3 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                Getting Started
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl">
                MyAPI Open API
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Introduction and quick start guide for
                integrating your application with
                MyAPI Open API.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500">
                  REST API
                </span>

                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500">
                  OAuth 2.0
                </span>

                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500">
                  JSON
                </span>

                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500">
                  Sandbox
                </span>
              </div>
            </div>
          </section>

          {/* Introduction */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-sm font-bold text-slate-950">
                Introduction
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Everything you need to start integrating with
                MyAPI.
              </p>
            </div>

            <div className="p-6">
              <p className="text-sm leading-7 text-slate-600">
                This documentation covers the steps required to sign up as a Partner,
                receive Sandbox Credentials, understand authentication,
                and integrate MyAPI Open API with your application.
              </p>

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
                        {title}
                      </div>

                      <p className="mt-1.5 text-xs leading-6 text-slate-500">
                        {description}
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
              <h2 className="text-sm font-bold text-slate-950">
                Signing Up & Getting Started
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                ขั้นตอนการสมัคร รับ Credentials และเตรียมพร้อมสำหรับการใช้งาน
                API
              </p>
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
                          {title}
                        </h3>

                        <p className="mt-1 text-xs leading-6 text-slate-500">
                          {desc}
                        </p>

                        {link && (
                          <a
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="
                              mt-2 inline-flex items-center gap-1
                              text-[11px] font-semibold
                              text-indigo-600
                              hover:text-indigo-800
                            "
                          >
                            Open Google Form
                            <span>↗</span>
                          </a>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="mt-7 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <svg
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v4m0 4h.01M10.3 3.8 2.9 18a2 2 0 0 0 1.8 3h14.6a2 2 0 0 0 1.8-3L13.7 3.8a2 2 0 0 0-3.4 0Z"
                  />
                </svg>

                <p className="text-xs leading-6 text-amber-800">
                  <strong>Credentials:</strong> client_id
                  และ client_secret เป็นข้อมูลสำหรับ Partner
                  โดยเฉพาะ ควรเก็บเป็นความลับและไม่เผยแพร่ใน
                  client-side code หรือ source control
                </p>
              </div>
            </div>
          </section>

          {/* API Use Suggestion */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-sm font-bold text-slate-950">
                API Use Suggestion
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Base URL และมาตรฐาน Response ที่ใช้กับ API
              </p>
            </div>

            <div className="space-y-6 p-6">
              {/* Environment */}
              <div>
                <SectionTitle title="Environment" />

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">
                          Environment
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Base URL
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          Test
                        </td>

                        <td className="px-4 py-3">
                          <code className="rounded-md bg-slate-50 px-2 py-1 font-mono text-[11px] text-indigo-700">
                            https://dev-open-api.myexpress.ai
                          </code>
                        </td>
                      </tr>

                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-700">
                          Production
                        </td>

                        <td className="px-4 py-3">
                          <code className="rounded-md bg-slate-50 px-2 py-1 font-mono text-[11px] text-indigo-700">
                            https://open-api.myexpress.ai
                          </code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status */}
              <div>
                <SectionTitle title="Response Status Code" />

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="w-28 px-4 py-3 font-semibold">
                          Status
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Detail
                        </th>
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
                            {status.detail}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Error */}
              <div>
                <SectionTitle title="Error Response Detail" />

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">
                          Name
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Description
                        </th>
                        <th className="px-4 py-3 font-semibold">
                          Type
                        </th>
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
                            {description}
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

          {/* Quick Start */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              title="Quick Start"
              description="เริ่มต้นใช้งาน MyAPI Open API ใน 4 ขั้นตอน"
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {quickStart.map(([num, title, desc]) => (
                <div
                  key={num}
                  className="
                    rounded-xl border border-slate-200
                    bg-white p-4
                    transition-all hover:-translate-y-0.5
                    hover:border-indigo-200 hover:shadow-sm
                  "
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Step {num}
                  </span>

                  <h3 className="mt-2 text-xs font-bold text-slate-900">
                    {title}
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Explore API */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle
              title="Explore API"
              description="เลือก API ที่ต้องการดูรายละเอียด"
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
                  'Create Parcel — NON_COD',
                  'create-parcel-non-cod',
                ],
                [
                  'Webhook',
                  'Simulate Thaipost Webhook',
                  'simulate-thaipost-webhook',
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
                    {group}
                  </div>

                  <div className="mt-2 text-xs font-bold text-slate-900">
                    {title}
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-transform group-hover:translate-x-0.5">
                    View API
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
   API DOCUMENTATION
   ============================================================ */

function Documentation({
  endpoint,
}: {
  endpoint: Endpoint;
}) {
  const requestExample =
    endpoint.bodyType === 'formdata'
      ? (endpoint.bodyExample as FormField[])
          .map(
            (field) =>
              `${field.key}: ${field.value}`,
          )
          .join('\n')
      : JSON.stringify(
          endpoint.bodyExample,
          null,
          2,
        );

  const successExample = JSON.stringify(
    endpoint.successExample,
    null,
    2,
  );

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="mx-auto max-w-[1440px] px-6 py-7 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
          {/* Main Documentation */}
          <section className="min-w-0 space-y-7 xl:col-span-7">
            {/* Endpoint Header */}
            <header className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-6 lg:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <MethodChip
                    method={endpoint.method}
                    size="md"
                  />

                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                    {endpoint.group}
                  </span>
                </div>

                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                  {endpoint.name}
                </h1>

                <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
                  {endpoint.summary}
                </p>
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

            {/* Endpoint Details */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h2 className="text-sm font-bold text-slate-950">
                  Endpoint
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-x-8 gap-y-6 p-6 sm:grid-cols-2">
                <Field label="Method">
                  <MethodChip
                    method={endpoint.method}
                    size="md"
                  />
                </Field>

                <Field label="Authentication">
                  {endpoint.auth === 'bearer' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Bearer Access Token
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">
                      ไม่ต้องใช้ Authentication
                    </span>
                  )}
                </Field>

                <Field label="Path">
                  <div className="flex min-w-0 max-w-full items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5">
                    <code className="min-w-0 truncate font-mono text-[11px] text-indigo-700">
                      {endpoint.path}
                    </code>

                    <CopyButton text={endpoint.path} />
                  </div>
                </Field>

                <Field label="Content Type">
                  <code className="max-w-full truncate rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[11px] text-slate-600">
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
                  title="Headers"
                  description="HTTP headers required for this request."
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50">
                        <tr className="text-slate-500">
                          <th className="px-4 py-3 font-semibold">
                            Key
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Value
                          </th>
                          <th className="w-28 px-4 py-3 font-semibold">
                            Required
                          </th>
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
                                <code className="font-mono text-[11px] text-slate-500">
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
                  title="Path Params"
                  description="Parameters included directly in the URL path."
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            Name
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Example
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Description
                          </th>
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

                              <td className="px-4 py-3.5">
                                <code className="font-mono text-xs text-slate-500">
                                  {param.example}
                                </code>
                              </td>

                              <td className="px-4 py-3.5 leading-5 text-slate-600">
                                {param.desc}
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
                  title="Query Params"
                  description="Optional or required parameters appended to the URL."
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[620px] text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            Name
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Example
                          </th>
                          <th className="w-28 px-4 py-3 font-semibold">
                            Required
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Description
                          </th>
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
                                {param.desc}
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
            {endpoint.bodyFields.length > 0 && (
              <section>
                <SectionTitle
                  title="Request Body"
                  description="Fields accepted in the request payload."
                />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50 text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">
                            Field
                          </th>
                          <th className="w-28 px-4 py-3 font-semibold">
                            Type
                          </th>
                          <th className="w-28 px-4 py-3 font-semibold">
                            Required
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Description
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {endpoint.bodyFields.map(
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
                                {field.desc}
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
          </section>

          {/* Right Rail */}
          <aside className="min-w-0 space-y-5 xl:sticky xl:top-6 xl:col-span-5">
            {/* Request */}
            {endpoint.bodyExample != null && (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">
                      Request Example
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {endpoint.bodyType ===
                        'formdata'
                          ? 'FORM DATA'
                          : 'JSON'}
                      </span>
                    </div>
                  </div>

                  <CopyButton text={requestExample} />
                </div>

                <div className="p-4">
                  <CodeBlock>
                    {requestExample}
                  </CodeBlock>
                </div>
              </section>
            )}

            {/* Response */}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Response Example
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-xs font-bold text-emerald-600">
                      {endpoint.successCode}
                    </span>

                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      JSON
                    </span>
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

            {/* Errors */}
            {endpoint.errors.length > 0 && (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">
                      Error Response
                    </h3>

                    <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                      JSON
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">
                    {endpoint.errors.length}{' '}
                    {endpoint.errors.length === 1
                      ? 'Example'
                      : 'Examples'}
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

  const goSandbox = () => {
    window.location.assign('/sandbox');
  };

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
        onSandbox={goSandbox}
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
        />
      ) : (
        <Documentation endpoint={endpoint} />
      )}
    </div>
  );
}

export default ApiDocs;
