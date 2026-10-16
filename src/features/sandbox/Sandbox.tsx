import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../auth/useAuth';


/* ============================================================
   TYPES
   ============================================================ */

import {
  BASE_URLS,
  CLIENT_LIBRARY_LANGUAGES,
  METHOD_STYLE,
} from './data';
import { ENDPOINTS as DOCUMENTED_ENDPOINTS, GROUPS as DOCUMENTED_GROUPS } from './endpoints';
import {
  authBodyFromCredentials,
  buildCodeExample,
  buildQueryString,
  buildResolvedPath,
  generateSandboxCredentials,
} from './sandboxLogic';
import { simulateSandboxRequest } from './services/mockSandboxService';
import type {
  ApiResponseState,
  ClientLibraryLanguage,
  DocsPage,
  Endpoint,
  Env,
  Method,
  SandboxCredentials,
  StringMap,
} from './types';
import { GROUP_DOCS, INTRO_BLOCKS, type DocBlock } from './apiReference';
import type { EndpointDoc } from './endpoints';

// Use the updated endpoint dataset, including documented response examples and schemas.
const ENDPOINTS = DOCUMENTED_ENDPOINTS as unknown as Endpoint[];
const GROUPS = DOCUMENTED_GROUPS as unknown as { label: string; items: Endpoint[] }[];

/** ลิงก์ไปยัง Open API Client ของ Scalar (เปลี่ยนเป็น URL ของท่านเองได้ เช่น client ที่ host เอง) */
const SCALAR_CLIENT_URL = 'https://client.scalar.com';
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
        ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-[11px]'}
      `}
    >
      {method}
    </span>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  const { t } = useLanguage();
  return (
    <div className="mb-3">
      <h2 className="text-sm font-bold text-slate-900">{t(title)}</h2>
      {description && <p className="mt-1 text-xs leading-5 text-slate-500">{t(description)}</p>}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const { t } = useLanguage();
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
      className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
    >
      {t(copied ? 'คัดลอกแล้ว ✓' : 'คัดลอก')}
    </button>
  );
}

function CodeBlock({
  children,
  label,
  tone = 'dark',
  preClassName = '',
}: {
  children: ReactNode;
  label?: string;
  tone?: 'dark' | 'light';
  preClassName?: string;
}) {
  const { t } = useLanguage();
  const text = typeof children === 'string' ? children : '';
  return (
    <div
      className={`overflow-hidden rounded-xl border ${tone === 'dark' ? 'border-slate-800 bg-[#0B1220]' : 'border-slate-200 bg-white'
        }`}
    >
      {label && (
        <div
          className={`flex items-center justify-between border-b px-3 py-2 ${tone === 'dark' ? 'border-slate-800 bg-[#111827]' : 'border-slate-200 bg-slate-50'
            }`}
        >
          <span
            className={`text-xs font-bold uppercase tracking-wider ${tone === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}
          >
            {t(label)}
          </span>
          <CopyButton text={text} />
        </div>
      )}
      <pre
        className={`overflow-x-auto p-4 font-mono text-[11px] leading-6 whitespace-pre-wrap break-words ${tone === 'dark' ? 'text-indigo-100' : 'text-slate-700'
          } ${preClassName
          }`}
      >
        {children}
      </pre>
    </div>
  );
}

function RequiredBadge({ required }: { required?: boolean }) {
  const { t } = useLanguage();
  return required ? (
    <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-rose-600">
      {t("required")}</span>
  ) : (
    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
      optional
    </span>
  );
}

/* ============================================================
   SCALAR-STYLE TEST REQUEST PRIMITIVES
   ============================================================ */

const REQ_FILTERS = [
  ['all', 'All'],
  ['auth', 'Auth'],
  ['cookies', 'Cookies'],
  ['headers', 'Headers'],
  ['query', 'Query'],
  ['body', 'Body'],
] as const;

type ReqFilter = (typeof REQ_FILTERS)[number][0];
type BodyMode = 'form' | 'raw' | 'schema';

function CopyIconButton({ text, label = 'คัดลอก' }: { text: string; label?: string }) {
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
      title={copied ? 'คัดลอกแล้ว' : label}
      aria-label={label}
      className="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
    >
      {copied ? (
        <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15V6a2 2 0 0 1 2-2h9" />
        </svg>
      )}
    </button>
  );
}

function ScalarSection({
  title,
  hint,
  badge,
  open,
  onToggle,
  children,
}: {
  title: string;
  hint?: string;
  badge?: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-slate-200">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 bg-slate-50 px-4 py-2.5 text-left text-[13px] transition-colors hover:bg-slate-100/70"
      >
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform ${open ? '' : '-rotate-90'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
        </svg>
        <span className="font-medium text-slate-800">{title}</span>
        {hint && <span className="text-slate-400">{hint}</span>}
        {badge}
      </button>
      {open && <div className="bg-white">{children}</div>}
    </div>
  );
}

function KvRow({
  checked = false,
  ghost = false,
  muted = false,
  onToggle,
  name,
  value,
  namePlaceholder = 'Key',
  valuePlaceholder = 'Value',
  onNameChange,
  onValueChange,
  hint,
}: {
  checked?: boolean;
  /** แถวว่างท้ายตาราง — แสดงติ๊กจาง ๆ */
  ghost?: boolean;
  /** แถวที่ถูกปิดไว้ (เอาติ๊กออก) */
  muted?: boolean;
  onToggle?: () => void;
  name: string;
  value: string;
  namePlaceholder?: string;
  valuePlaceholder?: string;
  onNameChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  hint?: string;
}) {
  const check = (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  );
  return (
    <div
      className={`grid grid-cols-[40px_minmax(0,1fr)_minmax(0,1.3fr)] border-b border-slate-200 text-[13px] last:border-b-0 ${muted ? 'opacity-50' : ''}`}
    >
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={checked}
          aria-label={checked ? 'Disable' : 'Enable'}
          className="flex items-center justify-center border-r border-slate-200 text-slate-800 transition-colors hover:bg-slate-100"
        >
          {checked ? check : null}
        </button>
      ) : (
        <div className={`flex items-center justify-center border-r border-slate-200 ${ghost ? 'text-slate-200' : 'text-slate-800'}`}>
          {checked || ghost ? check : null}
        </div>
      )}
      <input
        readOnly={!onNameChange}
        value={name}
        placeholder={namePlaceholder}
        onChange={(e) => onNameChange?.(e.target.value)}
        spellCheck={false}
        className="min-w-0 border-r border-slate-200 bg-transparent px-3 py-2.5 text-slate-700 outline-none placeholder:text-slate-400"
      />
      <div className="flex min-w-0 items-center">
        <input
          readOnly={!onValueChange}
          value={value}
          placeholder={valuePlaceholder}
          onChange={(e) => onValueChange?.(e.target.value)}
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-slate-700 outline-none placeholder:text-slate-400"
        />
        {hint && (
          <span title={hint} className="mr-3 shrink-0 text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v5m0-8h.01" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

type KvEntry = { key: string; value: string; enabled: boolean };

/** ตาราง key/value ที่เพิ่มแถวได้เอง (พิมพ์ในแถวว่างท้ายตารางเพื่อเพิ่ม) และติ๊กเปิด/ปิดแต่ละแถวได้ */
function KvList({ entries, onChange }: { entries: KvEntry[]; onChange: (entries: KvEntry[]) => void }) {
  const patch = (i: number, p: Partial<KvEntry>) =>
    onChange(entries.map((e, idx) => (idx === i ? { ...e, ...p } : e)).filter((e) => e.key !== '' || e.value !== ''));
  const rows = entries.map((e, i) => (
    <KvRow
      key={i}
      checked={e.enabled}
      muted={!e.enabled}
      onToggle={() => patch(i, { enabled: !e.enabled })}
      name={e.key}
      value={e.value}
      onNameChange={(v) => patch(i, { key: v })}
      onValueChange={(v) => patch(i, { value: v })}
    />
  ));
  // key = entries.length เพื่อให้แถวว่างกลายเป็นแถวจริงโดยไม่เสีย focus
  rows.push(
    <KvRow
      key={entries.length}
      ghost
      name=""
      value=""
      onNameChange={(v) => onChange([...entries, { key: v, value: '', enabled: true }])}
      onValueChange={(v) => onChange([...entries, { key: '', value: v, enabled: true }])}
    />,
  );
  return <>{rows}</>;
}

const RES_FILTERS = [
  ['all', 'All'],
  ['cookies', 'Cookies'],
  ['headers', 'Headers'],
  ['body', 'Body'],
] as const;
type ResFilter = (typeof RES_FILTERS)[number][0];

function ResTable({ rows, emptyText }: { rows: { name: string; value: string }[]; emptyText: string }) {
  if (rows.length === 0) return <p className="px-4 py-4 text-xs text-slate-400">{emptyText}</p>;
  return (
    <div>
      {rows.map((r, i) => (
        <div
          key={`${r.name}-${i}`}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] border-b border-slate-200 text-[13px] last:border-b-0"
        >
          <div className="break-all border-r border-slate-200 px-3 py-2.5 text-slate-700">{r.name}</div>
          <div className="break-all px-3 py-2.5 font-mono text-[12px] text-slate-600">{r.value}</div>
        </div>
      ))}
    </div>
  );
}

/** textarea + เลขบรรทัด (ไม่ต้อง sync scroll เพราะ textarea ขยายความสูงตามจำนวนบรรทัด) */
function CodeEditor({
  value,
  onChange,
  minLines = 8,
}: {
  value: string;
  onChange: (value: string) => void;
  minLines?: number;
}) {
  const lineCount = Math.max(value.split('\n').length, minLines);
  return (
    <div className="flex font-mono text-[12.5px] leading-6">
      <div aria-hidden className="select-none py-3 pl-4 pr-3 text-right text-slate-400">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        wrap="off"
        rows={lineCount}
        aria-label="Request body"
        className="min-w-0 flex-1 resize-none overflow-x-auto bg-transparent py-3 pr-4 text-slate-800 outline-none"
      />
    </div>
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
}: SidebarProps) {
  const { t } = useLanguage();
  const filteredGroups = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return GROUPS;
    return GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.name.toLowerCase().includes(keyword) || t(item.name).toLowerCase().includes(keyword) || item.path.toLowerCase().includes(keyword)
      ),
    })).filter((group) => group.items.length > 0);
  }, [search, t]);

  return (
    <aside className="flex h-full w-[272px] shrink-0 flex-col border-r border-slate-200 bg-[#fafafa]">
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
            <div className="truncate text-xs font-bold text-slate-950">{t("MyAPI Open API")}</div>
            <div className="mt-0.5 text-xs text-slate-400">{t("Sandbox")}</div>
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
            placeholder={t("Search endpoints...")}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-4">
          <div className="px-2.5 pb-2 text-xs font-bold uppercase tracking-[0.05em] text-slate-400">
            {t("Getting Started")}</div>
          <button
            type="button"
            onClick={() => onPageChange('overview')}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${page === 'overview'
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
            <span>Introduction</span>
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
                  className="flex w-full items-center justify-between px-2.5 pb-1.5 text-xs font-bold uppercase tracking-[0.05em] text-slate-400 transition-colors hover:text-slate-600"
                >
                  <span>{t(group.label)}</span>
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
                          className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${active
                            ? 'bg-indigo-50 text-indigo-800'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                          <MethodChip method={item.method} />
                          <span className={`min-w-0 flex-1 truncate ${active ? 'font-semibold' : ''}`}>{t(item.name)}</span>
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

      {/* Open API Client (Scalar) */}
      <div className="border-t border-slate-100 p-3">
        <a
          href={SCALAR_CLIENT_URL}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-700"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7m0 0H8m9 0v9" />
          </svg>
          Open API Client
        </a>
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
  const { t, language: languageCode } = useLanguage();
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
    <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-50 blur-3xl" />
      <div className="relative p-6 lg:p-7">
        <h2 className="text-base font-bold text-slate-950">{t("Sandbox Credentials")}</h2>
        <p className="mt-1 max-w-lg text-xs leading-6 text-slate-500">
          {t("สร้างข้อมูลตัวอย่าง client_id / client_secret ภายใน Browser สำหรับทดลอง UI เท่านั้น ไม่สามารถใช้ยืนยันตัวตนกับ MyExpress API ได้")}</p>

        <div className="mt-5">
          {!loggedIn && (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-6 text-slate-500">
                {t("เข้าสู่ระบบก่อน เพื่อสร้าง credentials ของท่านเอง (ป้องกันการสุ่มสร้างจำนวนมาก)")}</p>
              <button
                type="button"
                onClick={onLogin}
                className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800"
              >
                {t("เข้าสู่ระบบ")}</button>
            </div>
          )}

          {loggedIn && !credentials && (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-6 text-slate-500">
                {t("ยังไม่มีข้อมูลตัวอย่าง — กดสร้าง Demo credentials เพื่อทดลอง Sandbox จำลอง")}</p>
              <button
                type="button"
                onClick={onGenerate}
                className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
              >
                {t("Generate Demo Credentials")}</button>
            </div>
          )}

          {loggedIn && credentials && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("client_id")}</span>
                  <CopyButton text={credentials.clientId} />
                </div>
                <div className="px-3 py-2.5">
                  <code className="break-all font-mono text-[11px] text-slate-700">{credentials.clientId}</code>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("client_secret")}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSecretVisible((v) => !v)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      {t(secretVisible ? 'ซ่อน' : 'แสดง')}
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
                <p className="text-xs text-slate-400">
                  {t("สร้างเมื่อ")}{new Date(credentials.createdAt).toLocaleString(languageCode === 'en' ? 'en-GB' : 'th-TH')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {confirmingRegenerate && (
                    <>
                      <span className="text-xs font-semibold text-rose-600">{t("secret เดิมจะใช้งานไม่ได้ทันที ยืนยันหรือไม่?")}</span>
                      <button
                        type="button"
                        onClick={() => setConfirmingRegenerate(false)}
                        className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100"
                      >
                        {t("ยกเลิก")}</button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={onGenerateAccessToken}
                    disabled={confirmingRegenerate}
                    className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {t("Generate Access Token →")}</button>
                  <button
                    type="button"
                    onClick={handleRegenerateClick}
                    className={`rounded-lg px-3.5 py-1.5 text-[11px] font-bold transition-colors ${confirmingRegenerate
                      ? 'bg-rose-600 text-white hover:bg-rose-500'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    {t(confirmingRegenerate ? 'ยืนยัน Regenerate' : 'Regenerate')}
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
  hasToken,
}: {
  onNavigate: (page: DocsPage, endpointId?: string) => void;
  loggedIn: boolean;
  hasToken: boolean;
  credentials: SandboxCredentials | null;
  onLogin: () => void;
  onGenerateCredentials: () => void;
  onRegenerateCredentials: () => void;
  onGenerateAccessToken: () => void;
}) {
  const { t } = useLanguage();
  const overviewCards = [
    ['Authentication', 'สร้าง Access Token ด้วย client_id / client_secret แล้วเริ่มยิงคำขอทดสอบ'],
    ['Parcel API', 'ทดลองสร้าง ค้นหา ลบพัสดุ และตรวจสอบสถานะการชำระเงิน COD'],
    ['Webhook', 'จำลองการยิง webhook สถานะพัสดุจากไปรษณีย์ไทยแบบ real-time'],
    ['Print Label', 'สร้างไฟล์ใบลาเบล PDF จากรายการ parcel id ของท่าน'],
    ['Verify COD Account', 'อัปโหลดเอกสาร ลงทะเบียน และตรวจสอบสถานะการอนุมัติบัญชีผู้ส่ง COD'],
  ];

  const steps: { title: string; desc: string; done: boolean }[] = [
    { title: 'เข้าสู่ระบบ', desc: 'ล็อกอินเพื่อใช้งาน Sandbox', done: loggedIn },
    { title: 'สร้าง Credentials', desc: 'สร้าง client_id / client_secret ตัวอย่าง', done: Boolean(credentials) },
    { title: 'ขอ Access Token', desc: 'เรียก Generate Access Token', done: hasToken },
    { title: 'ทดลองเรียก API', desc: 'เลือก endpoint แล้วกด Send', done: false },
  ];
  const currentStep = steps.findIndex((s) => !s.done);

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-indigo-50 blur-3xl" />
            <div className="relative p-7 lg:p-8">
              <div className="mb-3 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
                {t("Sandbox")}</div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl">{t("MyAPI API Sandbox")}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                {t("ทดลองยิง MyAPI Open API แบบ interactive พร้อมดูตัวอย่าง request และ response แบบ real-time")}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500">{t("REST API")}</span>
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500">{t("OAuth 2.0")}</span>
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-500">{t("JSON")}</span>
                <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-xs text-amber-700">{t("Mock responses")}</span>
              </div>
            </div>
          </section>

          {/* Getting started steps */}
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <SectionTitle title="เริ่มต้นใช้งานใน 4 ขั้นตอน" />
            <ol className="grid grid-cols-1 gap-3 md:grid-cols-4">
              {steps.map((s, i) => {
                const active = i === currentStep;
                return (
                  <li
                    key={s.title}
                    className={`rounded-xl border p-3 ${s.done ? 'border-emerald-200 bg-emerald-50/50' : active ? 'border-indigo-300 bg-indigo-50/50' : 'border-slate-200 bg-slate-50/50'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${s.done ? 'bg-emerald-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        {s.done ? '✓' : i + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{s.title}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-5 text-slate-500">{s.desc}</p>
                  </li>
                );
              })}
            </ol>
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
          <section className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-sm font-bold text-slate-950">{t("สิ่งที่ทดลองได้ใน Sandbox")}</h2>
              <p className="mt-1 text-xs text-slate-500">{t("เลือก endpoint จากเมนูด้านซ้าย แล้วกด Send เพื่อดูตัวอย่างการตอบกลับ")}</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {overviewCards.map(([title, description]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
                  >
                    <div className="text-xs font-bold text-slate-900">{t(title)}</div>
                    <p className="mt-1.5 text-xs leading-6 text-slate-500">{t(description)}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Introduction (จาก api-1.json) */}
          <section className="rounded-lg border border-slate-200 bg-white p-6">
            <DocBlocks blocks={INTRO_BLOCKS} />
          </section>

          {/* Explore API */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle title={t("Try an Endpoint")} description={t("เลือก API ที่ต้องการทดสอบ")} />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                ['Authentication', 'Generate Access Token', 'generate-access-token'],
                ['Parcel API', 'Create Parcel — NON_COD', 'create-parcel-non-cod'],
                ['Parcel API', 'Create Parcel — COD', 'create-parcel-cod'],
                ['Parcel API', 'Get Parcel (Tracking)', 'get-parcel'],
                ['Webhook', 'Simulate Thaipost Webhook', 'simulate-thaipost-webhook'],
              ].map(([group, title, id]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => onNavigate('docs', id)}
                  className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm"
                >
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{group}</div>
                  <div className="mt-2 text-xs font-bold text-slate-900">{title}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-transform group-hover:translate-x-0.5">
                    {t("Try it out")}<span>→</span>
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
   DOC BLOCKS — แสดงเอกสารฉบับเต็มจาก api-1.json (ตาราง / รายการ / โค้ด)
   ============================================================ */

function Rich({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s)]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <a key={i} href={part} target="_blank" rel="noreferrer" className="break-all text-indigo-600 underline hover:text-indigo-700">
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function DocBlocks({ blocks }: { blocks: DocBlock[] }) {
  return (
    <div className="space-y-3">
      {blocks.map((b, i) => {
        if (b.t === 'h') {
          const cls =
            b.level <= 2
              ? 'mt-6 text-base font-bold text-slate-950'
              : b.level <= 4
                ? 'mt-5 text-sm font-bold text-slate-900'
                : 'mt-4 text-xs font-bold text-slate-700';
          return <h4 key={i} className={cls}>{b.text}</h4>;
        }
        if (b.t === 'p') {
          return (
            <p key={i} className="whitespace-pre-line text-xs leading-6 text-slate-600">
              <Rich text={b.text} />
            </p>
          );
        }
        if (b.t === 'ul') {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 text-xs leading-6 text-slate-600">
              {b.items.map((item, j) => (
                <li key={j} className="whitespace-pre-line"><Rich text={item} /></li>
              ))}
            </ul>
          );
        }
        if (b.t === 'code') {
          return <CodeBlock key={i} label="JSON">{b.text}</CodeBlock>;
        }
        if (b.t === 'hr') {
          return <hr key={i} className="border-slate-100" />;
        }
        const long = b.rows.length > 16;
        return (
          <div key={i} className={`overflow-auto rounded-lg border border-slate-200 ${long ? 'max-h-[460px]' : ''}`}>
            <table className="w-full min-w-[480px] text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 text-slate-500">
                <tr>
                  {b.headers.map((h, j) => (
                    <th key={j} className="px-4 py-2.5 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {b.rows.map((row, r) => (
                  <tr key={r} className="align-top">
                    {row.map((cell, c) => (
                      <td
                        key={c}
                        className={`whitespace-pre-line px-4 py-2.5 leading-5 ${c === 0 ? 'font-mono font-semibold text-indigo-700' : 'text-slate-600'}`}
                      >
                        <Rich text={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function blocksToMarkdown(blocks: DocBlock[]): string {
  return blocks
    .map((b) => {
      if (b.t === 'h') return `${'#'.repeat(Math.min(Math.max(b.level, 1), 6))} ${b.text}`;
      if (b.t === 'p') return b.text;
      if (b.t === 'ul') return b.items.map((x) => `- ${x.replace(/\n/g, ' ')}`).join('\n');
      if (b.t === 'code') return '```json\n' + b.text + '\n```';
      if (b.t === 'hr') return '---';
      const esc = (s: string) => s.replace(/\n/g, '<br>').replace(/\|/g, '\\|');
      return [
        `| ${b.headers.map(esc).join(' | ')} |`,
        `| ${b.headers.map(() => '---').join(' | ')} |`,
        ...b.rows.map((r) => `| ${r.map(esc).join(' | ')} |`),
      ].join('\n');
    })
    .join('\n\n');
}

function endpointToMarkdown(ep: EndpointDoc): string {
  const head = `# ${ep.name}\n\n\`${ep.method} ${ep.path}\`\n\n${ep.summary}\n`;
  return head + '\n' + (ep.docBlocks ? blocksToMarkdown(ep.docBlocks) : '');
}

function CopyMarkdownButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button
      type="button"
      onClick={handle}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15V6a2 2 0 0 1 2-2h9" />
      </svg>
      {copied ? 'คัดลอกแล้ว ✓' : 'Copy as Markdown'}
    </button>
  );
}

/* ============================================================
   SCHEMA — สร้าง schema (ชนิดข้อมูล) จากตัวอย่าง response
   หมายเหตุ: api-1.json ระบุ schema เป็นแค่ {"type":"object"} จึงอนุมานจากตัวอย่างจริงแทน
   ============================================================ */

type SchemaNode = { type: string; properties?: Record<string, SchemaNode>; items?: SchemaNode };

function mergeSchema(a: SchemaNode, b: SchemaNode): SchemaNode {
  if (a.type !== b.type) return a;
  if (a.type === 'object') {
    const props: Record<string, SchemaNode> = { ...(a.properties ?? {}) };
    for (const [k, v] of Object.entries(b.properties ?? {})) {
      props[k] = props[k] ? mergeSchema(props[k], v) : v;
    }
    return { type: 'object', properties: props };
  }
  if (a.type === 'array' && a.items && b.items) {
    return { type: 'array', items: mergeSchema(a.items, b.items) };
  }
  return a;
}

function inferSchema(value: unknown): SchemaNode {
  if (value === null) return { type: 'null' };
  if (Array.isArray(value)) {
    const items = value.map(inferSchema).reduce<SchemaNode | null>((acc, cur) => (acc ? mergeSchema(acc, cur) : cur), null);
    return items ? { type: 'array', items } : { type: 'array' };
  }
  switch (typeof value) {
    case 'string':
      return { type: 'string' };
    case 'number':
      return { type: Number.isInteger(value) ? 'integer' : 'number' };
    case 'boolean':
      return { type: 'boolean' };
    case 'object': {
      const properties: Record<string, SchemaNode> = {};
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) properties[k] = inferSchema(v);
      return { type: 'object', properties };
    }
    default:
      return { type: 'string' };
  }
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export function Sandbox() {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState<DocsPage>('overview');
  const [activeId, setActiveId] = useState<string>(ENDPOINTS[0].id);
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const loggedIn = Boolean(user);
  const [credentials, setCredentials] = useState<SandboxCredentials | null>(null);
  const [issuedAccessToken, setIssuedAccessToken] = useState<string | null>(null);

  // เลือก Base URL ได้ (Dev / Production) — การส่ง Request ใน Sandbox ยังเป็นการจำลองเสมอ
  const [env, setEnv] = useState<Env>('test');
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
  const [testOpen, setTestOpen] = useState(false);
  const [resCode, setResCode] = useState<string | null>(null);
  const [resIdx, setResIdx] = useState(0);
  const [showSchema, setShowSchema] = useState(false);

  // Test Request modal (Scalar-style) — UI state
  const [testSidebarOpen, setTestSidebarOpen] = useState(true);
  const [testSearchOpen, setTestSearchOpen] = useState(false);
  const [testSearch, setTestSearch] = useState('');
  const [testCollapsed, setTestCollapsed] = useState<Record<string, boolean>>({});
  const [reqFilter, setReqFilter] = useState<ReqFilter>('all');
  const [reqFilterOpen, setReqFilterOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [bodyMode, setBodyMode] = useState<BodyMode>('raw');
  const [urlMenuOpen, setUrlMenuOpen] = useState(false);
  const [customHeaders, setCustomHeaders] = useState<KvEntry[]>([]);
  const [customCookies, setCustomCookies] = useState<KvEntry[]>([]);
  const [headerOff, setHeaderOff] = useState<Record<string, boolean>>({});
  const [resFilter, setResFilter] = useState<ResFilter>('all');
  const [resFilterOpen, setResFilterOpen] = useState(false);
  const authHeaderOn = !headerOff['Authorization'];

  const testGroups = useMemo(() => {
    const keyword = testSearch.toLowerCase().trim();
    if (!keyword) return GROUPS;
    return GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.name.toLowerCase().includes(keyword) || item.path.toLowerCase().includes(keyword),
      ),
    })).filter((group) => group.items.length > 0);
  }, [testSearch]);

  const selectEndpoint = (id: string) => {
    const ep = ENDPOINTS.find((e) => e.id === id);
    if (!ep) return;

    const { pv, qv, body } = initFor(ep);
    setActiveId(id);
    setPage('docs');
    setResCode(null);
    setResIdx(0);
    setResponse(null);
    setPathValues(pv);
    setQueryValues(qv);
    setBodyText(body);
  };

  const toggleGroup = (group: string) => {
    setCollapsedGroups((current) => ({ ...current, [group]: !current[group] }));
  };

  const handleSend = async () => {
    if (!loggedIn) {
      navigate('/login', { state: { from: '/sandbox' } });
      return;
    }

    if (endpoint.id === 'generate-access-token' && !credentials) return;
    if (response?.loading) return;

    if (endpoint.bodyType === 'json' && bodyText.trim()) {
      try {
        JSON.parse(bodyText);
      } catch {
        setResponse({
          status: 400,
          ms: 0,
          body: { message: 'Invalid JSON request body' },
          demo: true,
        });
        return;
      }
    }

    setResponse({ loading: true });
    const result = await simulateSandboxRequest({
      endpoint,
      bodyText,
      credentials,
      token: authHeaderOn ? token : '',
      issuedAccessToken: authHeaderOn ? issuedAccessToken : null,
    });

    if (result.issuedAccessToken) {
      setIssuedAccessToken(result.issuedAccessToken);
      setToken(result.issuedAccessToken);
    }

    setResponse(result.response);
  };

  const handleResetRequest = () => {
    const { pv, qv, body } = initFor(endpoint);
    setPathValues(pv);
    setQueryValues(qv);
    setBodyText(body);
    setResponse(null);
  };

  const handleLogin = () => navigate('/login', { state: { from: '/sandbox' } });

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
    authHeaderOn ? token : '',
    pathValues,
    queryValues,
    bodyText
  );
  const resolvedUrl =
    BASE_URLS[env] +
    buildResolvedPath(endpoint, pathValues) +
    buildQueryString(endpoint, queryValues);

  const goLanding = () => window.location.assign('/');

  const hasToken = Boolean(token || issuedAccessToken);

  const doc = endpoint as EndpointDoc;
  const groupBlocks = GROUP_DOCS[endpoint.group] ?? [];
  const responseDocs = doc.responses ?? [];
  const activeRes = responseDocs.find((r) => r.code === resCode) ?? responseDocs[0];
  const safeIdx = activeRes ? Math.min(resIdx, Math.max(activeRes.examples.length - 1, 0)) : 0;
  const activeEx = activeRes?.examples[safeIdx];
  const exBody = activeEx
    ? showSchema
      ? JSON.stringify(inferSchema(activeEx.body), null, 2)
      : typeof activeEx.body === 'string'
        ? activeEx.body
        : JSON.stringify(activeEx.body, null, 2)
    : '';
  const openTestRequest = () => {
    setTestOpen(true);
  };

  const canSend = !(endpoint.id === 'generate-access-token' && !credentials);
  // เปิดส่วน Authentication อัตโนมัติเมื่อยังต้องตั้งค่า credentials / token
  const needsAuthSetup =
    (endpoint.id === 'generate-access-token' && !credentials) || (endpoint.auth === 'bearer' && !hasToken);
  const isSectionOpen = (key: string, fallback = true) => openSections[key] ?? fallback;
  const toggleSection = (key: string, fallback = true) =>
    setOpenSections((cur) => ({ ...cur, [key]: !(cur[key] ?? fallback) }));
  const showReq = (section: Exclude<ReqFilter, 'all'>) => reqFilter === 'all' || reqFilter === section;

  const parsedBody = useMemo<{ ok: true; value: unknown } | { ok: false }>(() => {
    if (!bodyText.trim()) return { ok: true, value: {} };
    try {
      return { ok: true, value: JSON.parse(bodyText) };
    } catch {
      return { ok: false };
    }
  }, [bodyText]);
  const bodyObject =
    parsedBody.ok &&
      parsedBody.value !== null &&
      typeof parsedBody.value === 'object' &&
      !Array.isArray(parsedBody.value)
      ? (parsedBody.value as Record<string, unknown>)
      : null;
  const handleFormatBody = () => {
    try {
      setBodyText(JSON.stringify(JSON.parse(bodyText), null, 2));
    } catch {
      /* JSON ไม่ถูกต้อง — ไม่ต้องทำอะไร */
    }
  };

  const baseUrlOptions = Object.entries(BASE_URLS) as [Env, string][];
  const toggleHeader = (name: string) => setHeaderOff((cur) => ({ ...cur, [name]: !cur[name] }));
  const showRes = (section: Exclude<ResFilter, 'all'>) => resFilter === 'all' || resFilter === section;

  // Headers / Cookies ของ Response ดึงจากตัวอย่างในเอกสาร endpoint ตาม status code (Demo)
  const resDoc =
    response && !response.loading ? responseDocs.find((r) => r.code === String(response.status)) : undefined;
  const resAllHeaders = resDoc?.headers ?? [];
  const resHeaders = resAllHeaders
    .filter((h) => h.name.toLowerCase() !== 'set-cookie')
    .map((h) => ({ name: h.name, value: String(h.example) }));
  const resCookies = resAllHeaders
    .filter((h) => h.name.toLowerCase() === 'set-cookie')
    .map((h) => {
      const pair = String(h.example).split(';')[0];
      const i = pair.indexOf('=');
      return i < 0 ? { name: pair.trim(), value: '' } : { name: pair.slice(0, i).trim(), value: pair.slice(i + 1).trim() };
    });

  // Esc = ปิด modal, Ctrl/⌘ + Enter = Send
  const sendRef = useRef(handleSend);
  useEffect(() => {
    sendRef.current = handleSend;
  });
  useEffect(() => {
    if (!testOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setTestOpen(false);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        void sendRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [testOpen]);

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-white text-sm text-slate-500">Loading account…</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-sm text-slate-800">
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
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 justify-end border-b border-slate-200 bg-white px-5 py-3 lg:px-8"><LanguageSwitcher /></div>
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
          hasToken={hasToken}
          credentials={credentials}
          onLogin={handleLogin}
          onGenerateCredentials={handleGenerateCredentials}
          onRegenerateCredentials={handleRegenerateCredentials}
          onGenerateAccessToken={handleGenerateAccessToken}
        />
      ) : (
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1600px] px-5 py-6 lg:px-8">
            {!loggedIn && (
              <div className="mb-5 flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-6 text-slate-500">{t("เข้าสู่ระบบก่อนเพื่อทดลองส่ง Request ใน Sandbox")}</p>
                <button type="button" onClick={handleLogin} className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800">{t("เข้าสู่ระบบ")}</button>
              </div>
            )}

            <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              {/* ───────── Documentation (กลาง) ───────── */}
              <section className="min-w-0 space-y-5 pb-10">
                <header>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{endpoint.name}</h2>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {endpoint.auth === 'bearer' && (
                        <span className="group relative inline-flex">
                          <span
                            tabIndex={0}
                            aria-describedby="auth-required-tooltip"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                              <rect x="5" y="11" width="14" height="9" rx="2" />
                              <path strokeLinecap="round" d="M8 11V8a4 4 0 0 1 8 0v3" />
                            </svg>
                            Auth Required
                          </span>
                          <span
                            id="auth-required-tooltip"
                            role="tooltip"
                            className="pointer-events-none absolute right-0 top-full z-20 mt-2 hidden w-64 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal leading-5 text-slate-700 shadow-lg group-hover:block group-focus-within:block"
                          >
                            <span className="block font-semibold text-slate-900">Authentication required</span>
                            <span className="block">bearerAuth (HTTP bearer)</span>
                            <span className="block">Access token จาก Generate Access Token endpoint</span>
                          </span>
                        </span>
                      )}
                      <CopyMarkdownButton text={endpointToMarkdown(doc)} />
                    </div>
                  </div>
                  <p className="mt-3 max-w-3xl text-xs leading-6 text-slate-500">{endpoint.summary}</p>
                  <div className="mt-4 flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className={`shrink-0 rounded px-2 py-1 text-xs font-bold text-white ${METHOD_STYLE[endpoint.method].solid}`}>
                      {endpoint.method}
                    </span>
                    <code className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700">{BASE_URLS[env] + endpoint.path}</code>
                    <CopyButton text={BASE_URLS[env] + endpoint.path} />
                  </div>
                </header>

                {/* Headers */}
                {endpoint.headers.length > 0 && (
                  <section>
                    <h4 className="mb-2 text-sm font-bold text-slate-900">Headers</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full min-w-[480px] text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-4 py-2.5 font-semibold">Key</th>
                            <th className="px-4 py-2.5 font-semibold">Value</th>
                            <th className="px-4 py-2.5 font-semibold">Required</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {endpoint.headers.map((h) => (
                            <tr key={h.key}>
                              <td className="px-4 py-2.5"><code className="font-mono font-semibold text-indigo-700">{h.key}</code></td>
                              <td className="px-4 py-2.5"><code className="font-mono text-[11px] text-slate-500">{h.value}</code></td>
                              <td className="px-4 py-2.5"><RequiredBadge required={h.required} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* ข้อมูลกลุ่ม (tag description) เช่น Status Detail ของ Webhook */}
                {groupBlocks.length > 0 && (
                  <details key={endpoint.id} open={endpoint.group === 'Webhook'} className="group rounded-xl border border-slate-200 bg-white">
                    <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs font-bold text-slate-900">
                      <span>ข้อมูลกลุ่ม {endpoint.group}</span>
                      <svg className="h-3.5 w-3.5 text-slate-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="border-t border-slate-100 p-4">
                      <DocBlocks blocks={groupBlocks} />
                    </div>
                  </details>
                )}

                {/* เอกสารฉบับเต็มของ endpoint (Request / Response / Data Detail ...) */}
                {doc.docBlocks && doc.docBlocks.length > 0 && <DocBlocks blocks={doc.docBlocks} />}
              </section>

              {/* ───────── Code + Responses (ขวา) ───────── */}
              <aside className="min-w-0 space-y-4 xl:sticky xl:top-4">
                <section className="overflow-hidden rounded-xl bg-[#0B1220] ring-1 ring-slate-800">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2 font-mono text-xs">
                      <span className="font-bold text-sky-400">{endpoint.method}</span>
                      <span className="truncate text-slate-200">{endpoint.path}</span>
                    </div>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value as ClientLibraryLanguage)}
                      aria-label="Code example language"
                      className="max-w-[170px] shrink-0 rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs font-medium text-slate-200 outline-none focus:border-indigo-400"
                    >
                      {CLIENT_LIBRARY_LANGUAGES.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                  <pre className="max-h-[340px] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-[11px] leading-6 text-indigo-100">
                    {codeExample}
                  </pre>
                  <div className="flex items-center justify-between gap-2 border-t border-slate-800 px-3 py-2.5">
                    <a
                      href={SCALAR_CLIENT_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7m0 0H8m9 0v9" />
                      </svg>
                      Open API Client
                    </a>
                    <div className="flex items-center gap-1">
                      <CopyButton text={codeExample} />
                      <button
                        type="button"
                        onClick={openTestRequest}
                        className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-100"
                      >
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                        Test Request
                      </button>
                    </div>
                  </div>
                </section>

                {responseDocs.length > 0 && activeRes && (
                  <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 px-3">
                      {responseDocs.map((r) => {
                        const active = r.code === activeRes.code;
                        return (
                          <button
                            key={r.code}
                            type="button"
                            onClick={() => {
                              setResCode(r.code);
                              setResIdx(0);
                            }}
                            className={`relative px-2.5 py-3 text-xs font-bold transition-colors ${active ? 'text-slate-950' : 'text-slate-400 hover:text-slate-700'}`}
                          >
                            {r.code}
                            {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-slate-900" />}
                          </button>
                        );
                      })}
                      <label className="ml-auto flex cursor-pointer items-center gap-2 py-3 pl-2 text-xs font-semibold text-slate-600">
                        Show Schema
                        <input
                          type="checkbox"
                          checked={showSchema}
                          onChange={(e) => setShowSchema(e.target.checked)}
                          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-900"
                        />
                      </label>
                    </div>

                    <div className="p-3">
                      {activeRes.examples.length > 0 ? (
                        <CodeBlock preClassName="max-h-[340px] overflow-auto">{exBody}</CodeBlock>
                      ) : (
                        <p className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
                          ไม่มีตัวอย่าง body สำหรับ status นี้
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-2.5 text-xs">
                      <span className="font-bold text-slate-900">{activeRes.description}</span>
                      {activeRes.examples.length > 1 && (
                        <select
                          value={safeIdx}
                          onChange={(e) => setResIdx(Number(e.target.value))}
                          aria-label="Example"
                          className="min-w-0 max-w-[260px] truncate rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-indigo-400"
                        >
                          {activeRes.examples.map((ex, i) => (
                            <option key={i} value={i}>
                              {ex.name || `ตัวอย่าง ${i + 1}`}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>


                  </section>
                )}
              </aside>
            </div>
          </div>

          {/* ───────── Test Request (modal · Scalar API Client style) ───────── */}
          {testOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 sm:p-6"
              onClick={() => setTestOpen(false)}
              role="presentation"
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Test Request"
                className="flex h-[min(88vh,820px)] w-full max-w-[1280px] overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-slate-200"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Sidebar: กลุ่ม endpoint */}
                {testSidebarOpen && (
                  <aside className="hidden w-[300px] shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
                    <div className="flex items-center justify-between px-4 pb-2 pt-4">
                      <button
                        type="button"
                        onClick={() => setTestSidebarOpen(false)}
                        aria-label="Hide sidebar"
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          <path strokeLinecap="round" d="M9 4v16" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTestSearchOpen((v) => !v);
                          setTestSearch('');
                        }}
                        aria-label="Search endpoints"
                        className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m2.35-6.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                        </svg>
                      </button>
                    </div>

                    {testSearchOpen && (
                      <div className="px-3 pb-2">
                        <input
                          autoFocus
                          value={testSearch}
                          onChange={(e) => setTestSearch(e.target.value)}
                          placeholder="Search endpoints..."
                          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                    )}

                    <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-1 text-[13px]">
                      {testGroups.map((group) => {
                        const hasActive = group.items.some((item) => item.id === activeId);
                        const collapsed = testSearch.trim() ? false : (testCollapsed[group.label] ?? !hasActive);
                        return (
                          <div key={group.label} className="mb-1">
                            <button
                              type="button"
                              onClick={() => setTestCollapsed((c) => ({ ...c, [group.label]: !collapsed }))}
                              aria-expanded={!collapsed}
                              className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                              <span className="truncate">{group.label}</span>
                              <svg
                                className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${collapsed ? '-rotate-90' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                              </svg>
                            </button>
                            {!collapsed && (
                              <div className="ml-3 border-l border-slate-200 pl-2">
                                {group.items.map((item) => {
                                  const active = item.id === activeId;
                                  return (
                                    <button
                                      type="button"
                                      key={item.id}
                                      onClick={() => selectEndpoint(item.id)}
                                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left transition-colors ${active ? 'bg-slate-100 font-medium text-slate-950' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                    >
                                      <span className="min-w-0 flex-1 truncate">{item.name}</span>
                                      <span className={`shrink-0 font-mono text-[10px] font-bold ${METHOD_STYLE[item.method].text}`}>
                                        {item.method}
                                      </span>
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
                )}

                {/* Main */}
                <div className="flex min-w-0 flex-1 flex-col">
                  {/* Top bar: method · URL · Send · Open API Client · Close */}
                  <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2.5 sm:px-4">
                    {!testSidebarOpen && (
                      <button
                        type="button"
                        onClick={() => setTestSidebarOpen(true)}
                        aria-label="Show sidebar"
                        className="hidden rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 md:inline-flex"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          <path strokeLinecap="round" d="M9 4v16" />
                        </svg>
                      </button>
                    )}

                    <div className="relative flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white py-1 pl-3 pr-1">
                      <span className={`shrink-0 font-mono text-[11px] font-bold ${METHOD_STYLE[endpoint.method].text}`}>
                        {endpoint.method}
                      </span>
                      <span className="h-4 w-px shrink-0 bg-slate-200" />
                      <button
                        type="button"
                        onClick={() => setUrlMenuOpen((v) => !v)}
                        aria-haspopup="listbox"
                        aria-expanded={urlMenuOpen}
                        title={resolvedUrl}
                        className="min-w-0 flex-1 truncate text-left font-mono text-[13px]"
                      >
                        <span className="text-slate-500">{BASE_URLS[env]}</span>
                        <span className="text-slate-900">{resolvedUrl.slice(BASE_URLS[env].length)}</span>
                      </button>
                      <CopyIconButton text={resolvedUrl} label="Copy URL" />
                      <button
                        type="button"
                        onClick={handleSend}
                        disabled={!canSend || Boolean(response?.loading)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-slate-950 px-3.5 py-1.5 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Send
                      </button>
                      {urlMenuOpen && (
                        <>
                          <button
                            type="button"
                            aria-label="Close URL menu"
                            tabIndex={-1}
                            className="fixed inset-0 z-10 cursor-default"
                            onClick={() => setUrlMenuOpen(false)}
                          />
                          <div
                            role="listbox"
                            className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                          >
                            {baseUrlOptions.map(([key, url]) => {
                              const selected = key === env;
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  role="option"
                                  aria-selected={selected}
                                  onClick={() => {
                                    setEnv(key);
                                    setUrlMenuOpen(false);
                                  }}
                                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left font-mono text-[13px] transition-colors ${selected ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
                                >
                                  <span
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${selected ? 'bg-indigo-600 text-white' : 'border border-slate-200'}`}
                                  >
                                    {selected && (
                                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                                      </svg>
                                    )}
                                  </span>
                                  <span className="min-w-0 truncate text-slate-800">{url}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    <a
                      href={SCALAR_CLIENT_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:inline-flex"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7m0 0H8m9 0v9" />
                      </svg>
                      Open API Client
                    </a>

                    <button
                      type="button"
                      onClick={() => setTestOpen(false)}
                      aria-label="ปิด"
                      className="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </div>

                  {/* Panes */}
                  <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
                    {/* ───── Request pane ───── */}
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:w-1/2 lg:flex-none">
                      <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-2.5">
                        <h4 className="min-w-0 truncate text-[13px] font-semibold text-slate-900">{endpoint.name}</h4>
                        <div className="relative ml-auto flex items-center gap-0.5 text-[12px]">
                          <button
                            type="button"
                            onClick={() => setReqFilterOpen((open) => !open)}
                            aria-haspopup="listbox"
                            aria-expanded={reqFilterOpen}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                          >
                            {REQ_FILTERS.find(([key]) => key === reqFilter)?.[1]}
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M7 12h10M10 17h4" />
                            </svg>
                          </button>
                          {reqFilterOpen && (
                            <>
                              <button
                                type="button"
                                aria-label="Close request filter menu"
                                tabIndex={-1}
                                className="fixed inset-0 z-10 cursor-default"
                                onClick={() => setReqFilterOpen(false)}
                              />
                              <div
                                role="listbox"
                                className="absolute right-12 top-full z-20 mt-1 w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                              >
                                {REQ_FILTERS.map(([key, label]) => {
                                  const selected = key === reqFilter;
                                  return (
                                    <button
                                      key={key}
                                      type="button"
                                      role="option"
                                      aria-selected={selected}
                                      onClick={() => {
                                        setReqFilter(key);
                                        setReqFilterOpen(false);
                                      }}
                                      className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors ${selected ? 'bg-slate-100 font-medium text-slate-950' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-indigo-600">
                                        {selected && (
                                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                                          </svg>
                                        )}
                                      </span>
                                      {label}
                                    </button>
                                  );
                                })}
                              </div>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={handleResetRequest}
                            title="Reset request"
                            aria-label="Reset request"
                            className="ml-1 shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M20 20v-6h-6M5.6 15A8 8 0 0 0 20 14m-1.6-5A8 8 0 0 0 4 10" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="min-h-0 flex-1 overflow-y-auto">
                        {/* Authentication */}
                        {showReq('auth') && (
                          <ScalarSection
                            title="Authentication"
                            hint={endpoint.auth === 'bearer' ? 'Required' : undefined}
                            badge={
                              endpoint.auth === 'bearer' ? (
                                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-slate-200 bg-white px-1.5 text-[11px] text-slate-600">
                                  1
                                </span>
                              ) : undefined
                            }
                            open={isSectionOpen('auth', needsAuthSetup)}
                            onToggle={() => toggleSection('auth', needsAuthSetup)}
                          >
                            <div className="space-y-3 p-4">
                              {endpoint.id === 'generate-access-token' ? (
                                credentials ? (
                                  <>
                                    <div className="overflow-hidden rounded-lg border border-slate-200">
                                      <KvRow checked name="client_id" value={credentials.clientId} />
                                      <KvRow checked name="client_secret" value={credentials.clientSecret} />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={handleRegenerateCredentials}
                                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                    >
                                      สร้าง Credentials ใหม่
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs text-slate-500">ยังไม่มี Sandbox Credentials</span>
                                    <button
                                      type="button"
                                      onClick={handleGenerateCredentials}
                                      className="rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                                    >
                                      Generate Credentials
                                    </button>
                                  </div>
                                )
                              ) : endpoint.auth === 'bearer' ? (
                                <>
                                  <label className="block">
                                    <span className="mb-1 block text-xs font-semibold text-slate-600">Bearer Token</span>
                                    <input
                                      value={token}
                                      onChange={(e) => setToken(e.target.value)}
                                      placeholder="<YOUR_ACCESS_TOKEN>"
                                      spellCheck={false}
                                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                                    />
                                  </label>
                                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                    {issuedAccessToken && token !== issuedAccessToken && (
                                      <button
                                        type="button"
                                        onClick={handleUseIssuedToken}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                      >
                                        Use latest token
                                      </button>
                                    )}
                                    {!token && (
                                      <button
                                        type="button"
                                        onClick={handleGenerateAccessToken}
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                      >
                                        ยังไม่มี Token — Generate Access Token →
                                      </button>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <p className="text-xs text-slate-500">This endpoint does not require authentication.</p>
                              )}
                            </div>
                          </ScalarSection>
                        )}

                        {/* Cookies */}
                        {showReq('cookies') && (
                          <ScalarSection
                            title="Cookies"
                            open={isSectionOpen('cookies')}
                            onToggle={() => toggleSection('cookies')}
                          >
                            <KvList entries={customCookies} onChange={setCustomCookies} />
                          </ScalarSection>
                        )}

                        {/* Headers */}
                        {showReq('headers') && (
                          <ScalarSection
                            title="Headers"
                            open={isSectionOpen('headers')}
                            onToggle={() => toggleSection('headers')}
                          >
                            <KvRow
                              checked={!headerOff['accept']}
                              muted={Boolean(headerOff['accept'])}
                              onToggle={() => toggleHeader('accept')}
                              name="accept"
                              value="application/json"
                            />
                            {endpoint.auth === 'bearer' && (
                              <KvRow
                                checked={authHeaderOn}
                                muted={!authHeaderOn}
                                onToggle={() => toggleHeader('Authorization')}
                                name="Authorization"
                                value={token ? `Bearer ${token}` : ''}
                                valuePlaceholder="Bearer <YOUR_ACCESS_TOKEN>"
                                onValueChange={(v) => setToken(v.replace(/^Bearer\s+/i, ''))}
                                hint="เอาติ๊กออกเพื่อทดสอบการเรียกโดยไม่แนบ token"
                              />
                            )}
                            {endpoint.bodyType === 'json' && (
                              <KvRow
                                checked={!headerOff['Content-Type']}
                                muted={Boolean(headerOff['Content-Type'])}
                                onToggle={() => toggleHeader('Content-Type')}
                                name="Content-Type"
                                value="application/json"
                              />
                            )}
                            <KvList entries={customHeaders} onChange={setCustomHeaders} />
                          </ScalarSection>
                        )}

                        {/* Path Variables */}
                        {showReq('query') && endpoint.pathParams.length > 0 && (
                          <ScalarSection
                            title="Path Variables"
                            open={isSectionOpen('path')}
                            onToggle={() => toggleSection('path')}
                          >
                            {endpoint.pathParams.map((p) => (
                              <KvRow
                                key={p.key}
                                checked
                                name={p.key}
                                value={pathValues[p.key] ?? ''}
                                onValueChange={(v) => setPathValues((cur) => ({ ...cur, [p.key]: v }))}
                              />
                            ))}
                          </ScalarSection>
                        )}

                        {/* Query Parameters */}
                        {showReq('query') && (
                          <ScalarSection
                            title="Query Parameters"
                            open={isSectionOpen('query')}
                            onToggle={() => toggleSection('query')}
                          >
                            {endpoint.queryParams.map((q) => {
                              const value = queryValues[q.key] ?? '';
                              return (
                                <KvRow
                                  key={q.key}
                                  checked={value !== ''}
                                  onToggle={() =>
                                    setQueryValues((cur) => ({ ...cur, [q.key]: cur[q.key] ? '' : (q.example ?? '') }))
                                  }
                                  name={q.required ? `${q.key} *` : q.key}
                                  value={value}
                                  valuePlaceholder={q.example || 'Value'}
                                  onValueChange={(v) => setQueryValues((cur) => ({ ...cur, [q.key]: v }))}
                                />
                              );
                            })}
                            {endpoint.queryParams.length === 0 && (
                              <p className="px-4 py-3 text-xs text-slate-400">endpoint นี้ไม่มี Query Parameter</p>
                            )}
                          </ScalarSection>
                        )}

                        {/* Request Body */}
                        {showReq('body') && endpoint.bodyType !== 'none' && (
                          <ScalarSection
                            title="Request Body"
                            open={isSectionOpen('body')}
                            onToggle={() => toggleSection('body')}
                          >
                            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 text-[12px]">
                              <span className="font-medium text-slate-700">
                                {endpoint.bodyType === 'json' ? 'JSON' : endpoint.bodyType}
                              </span>
                              <div className="flex items-center gap-1">
                                {bodyMode === 'raw' && (
                                  <button
                                    type="button"
                                    onClick={handleFormatBody}
                                    title="Format JSON"
                                    aria-label="Format JSON"
                                    className="mr-1 rounded-md px-1.5 py-1 font-mono text-[12px] text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                  >
                                    {'{ }'}
                                  </button>
                                )}
                                {(
                                  [
                                    ['form', 'Form'],
                                    ['raw', 'Raw'],
                                    ['schema', 'Schema'],
                                  ] as const
                                ).map(([mode, label]) => (
                                  <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setBodyMode(mode)}
                                    className={`rounded-md px-2 py-1 font-medium transition-colors ${bodyMode === mode ? 'bg-slate-100 text-slate-950' : 'text-slate-500 hover:text-slate-800'
                                      }`}
                                  >
                                    {label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {bodyMode === 'raw' && <CodeEditor value={bodyText} onChange={setBodyText} />}

                            {bodyMode === 'form' &&
                              (bodyObject ? (
                                Object.keys(bodyObject).length > 0 ? (
                                  Object.entries(bodyObject).map(([k, v]) => (
                                    <KvRow
                                      key={k}
                                      checked
                                      name={k}
                                      value={typeof v === 'string' ? v : JSON.stringify(v)}
                                      onValueChange={
                                        typeof v === 'string'
                                          ? (nv) => setBodyText(JSON.stringify({ ...bodyObject, [k]: nv }, null, 2))
                                          : undefined
                                      }
                                      hint={typeof v === 'string' ? undefined : 'ค่าที่ไม่ใช่ข้อความ ให้แก้ไขในโหมด Raw'}
                                    />
                                  ))
                                ) : (
                                  <p className="px-4 py-6 text-center text-xs text-slate-400">Body ว่างเปล่า — เพิ่มข้อมูลในโหมด Raw</p>
                                )
                              ) : (
                                <p className="px-4 py-6 text-center text-xs text-slate-400">
                                  Body ไม่ใช่ JSON object ที่ถูกต้อง — แก้ไขในโหมด Raw
                                </p>
                              ))}

                            {bodyMode === 'schema' &&
                              (parsedBody.ok ? (
                                <pre className="overflow-x-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-[12.5px] leading-6 text-slate-700">
                                  {JSON.stringify(inferSchema(parsedBody.value), null, 2)}
                                </pre>
                              ) : (
                                <p className="px-4 py-6 text-center text-xs text-slate-400">Invalid JSON — ไม่สามารถสร้าง Schema ได้</p>
                              ))}
                          </ScalarSection>
                        )}

                        {/* Code Snippet */}
                        {reqFilter === 'all' && (
                          <ScalarSection
                            title="Code Snippet"
                            open={isSectionOpen('code', false)}
                            onToggle={() => toggleSection('code', false)}
                          >
                            <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-2">
                              <select
                                value={codeLanguage}
                                onChange={(e) => setCodeLanguage(e.target.value as ClientLibraryLanguage)}
                                aria-label="Code example language"
                                className="max-w-[220px] rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-400"
                              >
                                {CLIENT_LIBRARY_LANGUAGES.map((language) => (
                                  <option key={language} value={language}>
                                    {language}
                                  </option>
                                ))}
                              </select>
                              <CopyIconButton text={codeExample} label="Copy code" />
                            </div>
                            <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap break-words bg-[#0B1220] p-4 font-mono text-[12px] leading-6 text-indigo-100">
                              {codeExample}
                            </pre>
                          </ScalarSection>
                        )}
                      </div>
                    </div>

                    {/* ───── Response pane ───── */}
                    <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-slate-200 lg:w-1/2 lg:flex-none lg:border-l lg:border-t-0">
                      <div className="relative flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
                        <h4 className="text-[13px] font-semibold text-slate-900">Response</h4>
                        <div className="flex items-center gap-2">
                          {response && !response.loading && (
                            <>
                              <button
                                type="button"
                                onClick={() => setResponse(null)}
                                className="text-xs font-medium text-slate-400 hover:text-slate-700"
                              >
                                Clear
                              </button>
                              <span
                                className={`rounded-md px-2 py-1 font-mono text-xs font-bold ${response.status >= 200 && response.status < 300
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                                  }`}
                              >
                                {response.status} · {response.ms} ms
                              </span>
                            </>
                          )}
                          <button
                            type="button"
                            onClick={() => setResFilterOpen((v) => !v)}
                            aria-haspopup="listbox"
                            aria-expanded={resFilterOpen}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
                          >
                            {RES_FILTERS.find(([key]) => key === resFilter)?.[1]}
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M7 12h10M10 17h4" />
                            </svg>
                          </button>
                        </div>

                        {resFilterOpen && (
                          <>
                            <button
                              type="button"
                              aria-label="Close filter menu"
                              tabIndex={-1}
                              className="fixed inset-0 z-10 cursor-default"
                              onClick={() => setResFilterOpen(false)}
                            />
                            <div
                              role="listbox"
                              className="absolute right-3 top-full z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
                            >
                              {RES_FILTERS.map(([key, label]) => {
                                const selected = key === resFilter;
                                return (
                                  <button
                                    key={key}
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    onClick={() => {
                                      setResFilter(key);
                                      setResFilterOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] transition-colors ${selected ? 'bg-slate-100 font-medium text-slate-950' : 'text-slate-600 hover:bg-slate-50'}`}
                                  >
                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center text-indigo-600">
                                      {selected && (
                                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                                        </svg>
                                      )}
                                    </span>
                                    {label}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="min-h-0 flex-1 overflow-y-auto">
                        {!response && (
                          <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 p-4 text-center text-slate-400">
                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5v14l11-7z" />
                            </svg>
                            <p className="text-xs">กด Send เพื่อทดลองส่ง Request — Response จะแสดงที่นี่</p>
                          </div>
                        )}

                        {response?.loading && (
                          <div className="flex min-h-[200px] items-center justify-center gap-2 p-4 text-slate-400">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                            </svg>
                            <span className="text-xs">Sending request...</span>
                          </div>
                        )}

                        {response && !response.loading && (
                          <div>
                            {showRes('cookies') && (
                              <div>
                                <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] font-medium text-slate-800">
                                  Cookies
                                </div>
                                <ResTable rows={resCookies} emptyText="ไม่มี Cookie ใน Response นี้" />
                              </div>
                            )}

                            {showRes('headers') && (
                              <div>
                                <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] font-medium text-slate-800">
                                  Headers
                                  {resHeaders.length > 0 && <span className="ml-2 text-slate-400">{resHeaders.length}</span>}
                                </div>
                                <ResTable rows={resHeaders} emptyText="ไม่มี Header ตัวอย่างสำหรับ status นี้" />
                                {resHeaders.length > 0 && (
                                  <p className="border-t border-slate-200 px-4 py-2 text-[11px] text-slate-400">
                                    Demo — header ตัวอย่างจากเอกสารของ endpoint
                                  </p>
                                )}
                              </div>
                            )}

                            {showRes('body') && (
                              <div>
                                <div className="border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] font-medium text-slate-800">
                                  Body
                                </div>
                                <div className="space-y-3 p-4">
                                  {endpoint.id === 'generate-access-token' &&
                                    response.status === 200 &&
                                    typeof response.body === 'object' &&
                                    response.body !== null &&
                                    'access_token' in response.body && (
                                      <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                                        <div className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-700">Access Token</div>
                                        <div className="flex items-center gap-2 rounded-md border border-emerald-100 bg-white px-2.5 py-2">
                                          <code className="min-w-0 flex-1 break-all font-mono text-xs text-slate-700">
                                            {(response.body as { access_token: string }).access_token}
                                          </code>
                                          <CopyButton text={(response.body as { access_token: string }).access_token} />
                                        </div>
                                      </div>
                                    )}

                                  <div className="overflow-hidden rounded-lg border border-slate-200">
                                    <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-1.5">
                                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">JSON</span>
                                      <CopyButton text={JSON.stringify(response.body, null, 2)} />
                                    </div>
                                    <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-[12.5px] leading-6 text-slate-700">
                                      {JSON.stringify(response.body, null, 2)}
                                    </pre>
                                  </div>

                                  {endpoint.id === 'generate-access-token' && response.status === 200 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        selectEndpoint('create-parcel-non-cod');
                                        setTestOpen(true);
                                      }}
                                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                      Open Parcel API →
                                    </button>
                                  )}

                                  {response.demo && (
                                    <p className="text-xs leading-5 text-slate-400">
                                      Demo response — ตัวอย่างการตอบกลับจากข้อมูล endpoint ที่มีอยู่ใน Sandbox
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        {/* Responses (ตัวอย่างจากเอกสาร + Show Schema) */}
                        {responseDocs.length > 0 && activeRes && (
                          <ScalarSection
                            title="Responses"
                            hint="ตัวอย่างจากเอกสาร"
                            open={isSectionOpen('responses')}
                            onToggle={() => toggleSection('responses')}
                          >
                            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-3">
                              {responseDocs.map((r) => {
                                const active = r.code === activeRes.code;
                                return (
                                  <button
                                    key={r.code}
                                    type="button"
                                    onClick={() => {
                                      setResCode(r.code);
                                      setResIdx(0);
                                    }}
                                    className={`relative px-2.5 py-2.5 text-xs font-bold transition-colors ${active ? 'text-slate-950' : 'text-slate-400 hover:text-slate-700'}`}
                                  >
                                    {r.code}
                                    {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-slate-900" />}
                                  </button>
                                );
                              })}
                              <label className="ml-auto flex cursor-pointer items-center gap-2 py-2.5 pl-2 text-xs font-semibold text-slate-600">
                                Show Schema
                                <input
                                  type="checkbox"
                                  checked={showSchema}
                                  onChange={(e) => setShowSchema(e.target.checked)}
                                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-slate-900"
                                />
                              </label>
                            </div>

                            <div className="p-3">
                              {activeRes.examples.length > 0 ? (
                                <CodeBlock>{exBody}</CodeBlock>
                              ) : (
                                <p className="rounded-lg border border-dashed border-slate-200 px-3 py-6 text-center text-xs text-slate-400">
                                  ไม่มีตัวอย่าง body สำหรับ status นี้
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-2.5 text-xs">
                              <span className="font-bold text-slate-900">{activeRes.description}</span>
                              {activeRes.examples.length > 1 && (
                                <select
                                  value={safeIdx}
                                  onChange={(e) => setResIdx(Number(e.target.value))}
                                  aria-label="Example"
                                  className="min-w-0 max-w-[220px] truncate rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-indigo-400"
                                >
                                  {activeRes.examples.map((ex, i) => (
                                    <option key={i} value={i}>
                                      {ex.name || `ตัวอย่าง ${i + 1}`}
                                    </option>
                                  ))}
                                </select>
                              )}
                            </div>

                            {activeRes.headers.length > 0 && (
                              <details className="group border-t border-slate-200">
                                <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
                                  <span>Response Headers ({activeRes.headers.length})</span>
                                  <svg className="h-3.5 w-3.5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
                                  </svg>
                                </summary>
                                <ResTable
                                  rows={activeRes.headers.map((h) => ({ name: h.name, value: String(h.example) }))}
                                  emptyText=""
                                />
                              </details>
                            )}
                          </ScalarSection>
                        )}
                      </div>

                      <div className="flex justify-end border-t border-slate-100 px-4 py-2.5">
                        <button
                          type="button"
                          onClick={handleSend}
                          disabled={!canSend || Boolean(response?.loading)}
                          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Send Request
                          <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-sans text-[11px] text-slate-500">
                            CTRL ↵
                          </kbd>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      )}
      </div>
    </div>
  );
}

export default Sandbox;