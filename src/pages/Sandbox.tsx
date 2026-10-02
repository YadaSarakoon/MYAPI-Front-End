import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../features/auth/useAuth';

/* ============================================================
   TYPES
   ============================================================ */

import {
  BASE_URLS,
  CLIENT_LIBRARY_LANGUAGES,
  ENDPOINTS,
  GROUPS,
  METHOD_STYLE,
} from '../features/sandbox/data';
import {
  authBodyFromCredentials,
  buildCodeExample,
  buildQueryString,
  buildResolvedPath,
  generateSandboxCredentials,
} from '../features/sandbox/sandboxLogic';
import { simulateSandboxRequest } from '../features/sandbox/services/mockSandboxService';
import type {
  ApiResponseState,
  ClientLibraryLanguage,
  DocsPage,
  Endpoint,
  Env,
  Method,
  SandboxCredentials,
  StringMap,
} from '../features/sandbox/types';
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
        ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]'}
      `}
    >
      {method}
    </span>
  );
}

function SectionTitle({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
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
      className="shrink-0 rounded-md px-2 py-1 text-[10px] font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
  const text = typeof children === 'string' ? children : '';
  return (
    <div
      className={`overflow-hidden rounded-xl border ${
        tone === 'dark' ? 'border-slate-800 bg-[#0B1220]' : 'border-slate-200 bg-white'
      }`}
    >
      {label && (
        <div
          className={`flex items-center justify-between border-b px-3 py-2 ${
            tone === 'dark' ? 'border-slate-800 bg-[#111827]' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              tone === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {label}
          </span>
          <CopyButton text={text} />
        </div>
      )}
      <pre
        className={`overflow-x-auto p-4 font-mono text-[11px] leading-6 whitespace-pre-wrap break-words ${
          tone === 'dark' ? 'text-indigo-100' : 'text-slate-700'
        }`}
      >
        {children}
      </pre>
    </div>
  );
}

function RequiredBadge({ required }: { required?: boolean }) {
  return required ? (
    <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-rose-600">
      required
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
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
  onDocs: () => void;
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
  onDocs,
}: SidebarProps) {
  const filteredGroups = useMemo(() => {
    const keyword = search.toLowerCase().trim();
    if (!keyword) return GROUPS;
    return GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => item.name.toLowerCase().includes(keyword) || item.path.toLowerCase().includes(keyword)
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white shadow-sm">
            <img src={logo} alt="MyAPI" className="h-7 w-7 object-contain" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-slate-950">MyAPI Open API</div>
            <div className="mt-0.5 text-[10px] text-slate-400">Sandbox</div>
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
            placeholder="Search endpoints..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-4">
          <div className="px-2.5 pb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Getting Started
          </div>
          <button
            type="button"
            onClick={() => onPageChange('overview')}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
              page === 'overview'
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
            <span>Overview</span>
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
                  className="flex w-full items-center justify-between px-2.5 pb-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400 transition-colors hover:text-slate-600"
                >
                  <span>{group.label}</span>
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
                          className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                            active
                              ? 'bg-indigo-50 text-indigo-800'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                        >
                          <MethodChip method={item.method} />
                          <span className={`min-w-0 flex-1 truncate ${active ? 'font-semibold' : ''}`}>{item.name}</span>
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

      {/* Back to docs */}
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={onDocs}
          className="flex w-full items-center justify-between rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md"
        >
          <span>Go to API Docs</span>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </button>
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
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-emerald-50 blur-3xl" />
      <div className="relative p-6 lg:p-7">
        <h2 className="text-base font-bold text-slate-950">Sandbox Credentials</h2>
        <p className="mt-1 max-w-lg text-xs leading-6 text-slate-500">
          สร้างข้อมูลตัวอย่าง client_id / client_secret ภายใน Browser สำหรับทดลอง UI เท่านั้น ไม่สามารถใช้ยืนยันตัวตนกับ MyExpress API ได้
        </p>

        <div className="mt-5">
          {!loggedIn && (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-6 text-slate-500">
                เข้าสู่ระบบก่อน เพื่อสร้าง credentials ของท่านเอง (ป้องกันการสุ่มสร้างจำนวนมาก)
              </p>
              <button
                type="button"
                onClick={onLogin}
                className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800"
              >
                เข้าสู่ระบบ
              </button>
            </div>
          )}

          {loggedIn && !credentials && (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-6 text-slate-500">
                ยังไม่มีข้อมูลตัวอย่าง — กดสร้าง Demo credentials เพื่อทดลอง Sandbox จำลอง
              </p>
              <button
                type="button"
                onClick={onGenerate}
                className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700"
              >
                Generate Demo Credentials
              </button>
            </div>
          )}

          {loggedIn && credentials && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">client_id</span>
                  <CopyButton text={credentials.clientId} />
                </div>
                <div className="px-3 py-2.5">
                  <code className="break-all font-mono text-[11px] text-slate-700">{credentials.clientId}</code>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">client_secret</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSecretVisible((v) => !v)}
                      className="rounded-md px-2 py-1 text-[10px] font-semibold text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      {secretVisible ? 'ซ่อน' : 'แสดง'}
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
                <p className="text-[10px] text-slate-400">
                  สร้างเมื่อ {new Date(credentials.createdAt).toLocaleString('th-TH')}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {confirmingRegenerate && (
                    <>
                      <span className="text-[10px] font-semibold text-rose-600">secret เดิมจะใช้งานไม่ได้ทันที ยืนยันหรือไม่?</span>
                      <button
                        type="button"
                        onClick={() => setConfirmingRegenerate(false)}
                        className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100"
                      >
                        ยกเลิก
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={onGenerateAccessToken}
                    disabled={confirmingRegenerate}
                    className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Generate Access Token →
                  </button>
                  <button
                    type="button"
                    onClick={handleRegenerateClick}
                    className={`rounded-lg px-3.5 py-1.5 text-[11px] font-bold transition-colors ${
                      confirmingRegenerate
                        ? 'bg-rose-600 text-white hover:bg-rose-500'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {confirmingRegenerate ? 'ยืนยัน Regenerate' : 'Regenerate'}
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
}: {
  onNavigate: (page: DocsPage, endpointId?: string) => void;
  loggedIn: boolean;
  credentials: SandboxCredentials | null;
  onLogin: () => void;
  onGenerateCredentials: () => void;
  onRegenerateCredentials: () => void;
  onGenerateAccessToken: () => void;
}) {
  const overviewCards = [
    ['Authentication', 'สร้าง Access Token ด้วย client_id / client_secret แล้วเริ่มยิงคำขอทดสอบ'],
    ['Parcel API', 'ทดลองสร้าง ค้นหา ลบพัสดุ และตรวจสอบสถานะการชำระเงิน COD'],
    ['Webhook', 'จำลองการยิง webhook สถานะพัสดุจากไปรษณีย์ไทยแบบ real-time'],
    ['Print Label', 'สร้างไฟล์ใบลาเบล PDF จากรายการ parcel id ของท่าน'],
  ];

  return (
    <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
      <div className="mx-auto max-w-[1280px] px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Hero */}
          <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-indigo-50 blur-3xl" />
            <div className="relative p-7 lg:p-8">
              <div className="mb-3 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                Sandbox
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-950 lg:text-3xl">MyAPI API Sandbox</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                ทดลองยิง MyAPI Open API แบบ interactive พร้อมดูตัวอย่าง request และ response แบบ real-time
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-[10px] text-slate-500">REST API</span>
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-[10px] text-slate-500">OAuth 2.0</span>
                <span className="rounded-lg bg-slate-50 px-3 py-1.5 font-mono text-[10px] text-slate-500">JSON</span>
                <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 font-mono text-[10px] text-amber-700">Mock responses</span>
              </div>
            </div>
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
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-sm font-bold text-slate-950">สิ่งที่ทดลองได้ใน Sandbox</h2>
              <p className="mt-1 text-xs text-slate-500">เลือก endpoint จากเมนูด้านซ้าย แล้วกด Send เพื่อดูตัวอย่างการตอบกลับ</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {overviewCards.map(([title, description]) => (
                  <div
                    key={title}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/40"
                  >
                    <div className="text-xs font-bold text-slate-900">{title}</div>
                    <p className="mt-1.5 text-xs leading-6 text-slate-500">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Explore API */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionTitle title="Try an Endpoint" description="เลือก API ที่ต้องการทดสอบ" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                ['Authentication', 'Generate Access Token', 'generate-access-token'],
                ['Parcel API', 'Create Parcel — NON_COD', 'create-parcel-non-cod'],
                ['Webhook', 'Simulate Thaipost Webhook', 'simulate-thaipost-webhook'],
              ].map(([group, title, id]) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => onNavigate('docs', id)}
                  className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm"
                >
                  <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-400">{group}</div>
                  <div className="mt-2 text-xs font-bold text-slate-900">{title}</div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 transition-transform group-hover:translate-x-0.5">
                    Try it out
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
   MAIN COMPONENT
   ============================================================ */

export function Sandbox() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState<DocsPage>('overview');
  const [activeId, setActiveId] = useState<string>(ENDPOINTS[0].id);
  const [search, setSearch] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const loggedIn = Boolean(user);
  const [credentials, setCredentials] = useState<SandboxCredentials | null>(null);
  const [issuedAccessToken, setIssuedAccessToken] = useState<string | null>(null);

  // Sandbox ใช้ Dev URL เท่านั้น — ไม่มีตัวเลือก Production ในหน้านี้
  const env: Env = 'test';
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

  const toggleGroup = (group: string) => {
    setCollapsedGroups((current) => ({ ...current, [group]: !current[group] }));
  };

  const handleSend = async () => {
    if (!loggedIn) {
      navigate('/login', { state: { from: '/sandbox' } });
      return;
    }

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
      token,
      issuedAccessToken,
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
    token,
    pathValues,
    queryValues,
    bodyText
  );
  const resolvedUrl =
    BASE_URLS[env] +
    buildResolvedPath(endpoint, pathValues) +
    buildQueryString(endpoint, queryValues);

  const goLanding = () => window.location.assign('/');
  const goDocs = () => window.location.assign('/docs');

  const hasToken = Boolean(token || issuedAccessToken);

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-sm text-slate-500">Loading account…</div>;
  }

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
        onDocs={goDocs}
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
          loggedIn={loggedIn}
          credentials={credentials}
          onLogin={handleLogin}
          onGenerateCredentials={handleGenerateCredentials}
          onRegenerateCredentials={handleRegenerateCredentials}
          onGenerateAccessToken={handleGenerateAccessToken}
        />
      ) : (
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1480px] px-5 py-6 lg:px-8">
            {!loggedIn && (
              <div className="mb-5 flex flex-col items-start gap-3 rounded-xl border border-dashed border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-6 text-slate-500">เข้าสู่ระบบก่อนเพื่อทดลองส่ง Request ใน Sandbox</p>
                <button type="button" onClick={handleLogin} className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-slate-800">เข้าสู่ระบบ</button>
              </div>
            )}
            {/* Environment */}
            <section className="mb-5 rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <h1 className="text-sm font-bold text-slate-950">Sandbox Environment</h1>
                  </div>
                  <code className="mt-1.5 block font-mono text-xs text-slate-500">
                    {BASE_URLS.test}
                  </code>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>REST API</span>
                  <span>•</span>
                  <span>JSON</span>
                  <span>•</span>
                  <span>Bearer Auth</span>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
              {/* Documentation */}
              <section className="min-w-0 space-y-5">
                <header className="rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <MethodChip method={endpoint.method} size="md" />
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                        {endpoint.group}
                      </span>
                    </div>
                    <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950">
                      {endpoint.name}
                    </h2>
                    <p className="mt-1.5 max-w-3xl text-xs leading-6 text-slate-500">
                      {endpoint.summary}
                    </p>
                    <div className="mt-4 flex min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span
                        className={`shrink-0 rounded px-2 py-1 text-[10px] font-bold text-white ${METHOD_STYLE[endpoint.method].solid}`}
                      >
                        {endpoint.method}
                      </span>
                      <code className="min-w-0 flex-1 truncate font-mono text-xs text-slate-700">
                        {endpoint.path}
                      </code>
                      <CopyButton text={endpoint.path} />
                    </div>
                  </div>
                </header>

                {/* Headers */}
                {endpoint.headers.length > 0 && (
                  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">Headers</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[520px] text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-5 py-2.5 font-semibold">Key</th>
                            <th className="px-5 py-2.5 font-semibold">Value</th>
                            <th className="px-5 py-2.5 font-semibold">Required</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {endpoint.headers.map((h) => (
                            <tr key={h.key}>
                              <td className="px-5 py-3">
                                <code className="font-mono font-semibold text-indigo-700">{h.key}</code>
                              </td>
                              <td className="px-5 py-3">
                                <code className="font-mono text-[11px] text-slate-500">{h.value}</code>
                              </td>
                              <td className="px-5 py-3">
                                <RequiredBadge required={h.required} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Parameters */}
                {(endpoint.pathParams.length > 0 || endpoint.queryParams.length > 0) && (
                  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">Parameters</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[620px] text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-5 py-2.5 font-semibold">Name</th>
                            <th className="px-5 py-2.5 font-semibold">Type</th>
                            <th className="px-5 py-2.5 font-semibold">Example</th>
                            <th className="px-5 py-2.5 font-semibold">Required</th>
                            <th className="px-5 py-2.5 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {endpoint.pathParams.map((p) => (
                            <tr key={`path-${p.key}`} className="align-top">
                              <td className="px-5 py-3"><code className="font-mono font-semibold text-indigo-700">{p.key}</code></td>
                              <td className="px-5 py-3 text-slate-500">Path</td>
                              <td className="px-5 py-3"><code className="font-mono text-[10px] text-slate-500">{p.example}</code></td>
                              <td className="px-5 py-3"><RequiredBadge required /></td>
                              <td className="px-5 py-3 leading-5 text-slate-600">{p.desc}</td>
                            </tr>
                          ))}
                          {endpoint.queryParams.map((p) => (
                            <tr key={`query-${p.key}`} className="align-top">
                              <td className="px-5 py-3"><code className="font-mono font-semibold text-indigo-700">{p.key}</code></td>
                              <td className="px-5 py-3 text-slate-500">Query</td>
                              <td className="px-5 py-3"><code className="font-mono text-[10px] text-slate-500">{p.example}</code></td>
                              <td className="px-5 py-3"><RequiredBadge required={p.required} /></td>
                              <td className="px-5 py-3 leading-5 text-slate-600">{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Request fields */}
                {endpoint.bodyFields.length > 0 && (
                  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">Request Body</h3>
                      <p className="mt-1 text-[11px] text-slate-400">Fields accepted by this endpoint.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[680px] text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-5 py-2.5 font-semibold">Field</th>
                            <th className="px-5 py-2.5 font-semibold">Type</th>
                            <th className="px-5 py-2.5 font-semibold">Required</th>
                            <th className="px-5 py-2.5 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {endpoint.bodyFields.map((f) => (
                            <tr key={f.field} className="align-top">
                              <td className="px-5 py-3"><code className="font-mono font-semibold text-indigo-700">{f.field}</code></td>
                              <td className="px-5 py-3"><code className="font-mono text-[10px] text-slate-500">{f.type}</code></td>
                              <td className="px-5 py-3"><RequiredBadge required={f.required} /></td>
                              <td className="px-5 py-3 leading-5 text-slate-600">{f.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}

                {/* Errors */}
                {endpoint.errors.length > 0 && (
                  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4">
                      <h3 className="text-sm font-bold text-slate-950">Error Response</h3>
                    </div>
                    <div className="space-y-3 p-4">
                      {endpoint.errors.map((e) => (
                        <div key={`${e.code}-${e.name}`} className="overflow-hidden rounded-lg border border-rose-100">
                          <div className="flex items-center gap-2 bg-rose-50 px-3 py-2">
                            <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-rose-600">{e.code}</span>
                            <span className="text-[10px] font-semibold text-rose-700">{e.name}</span>
                          </div>
                          <div className="p-3"><CodeBlock>{JSON.stringify(e.body, null, 2)}</CodeBlock></div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}
              </section>

              {/* Developer playground */}
              <aside className="min-w-0 space-y-4 xl:sticky xl:top-5">
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-950">Try it out</h3>
                        <p className="mt-1 text-[11px] text-slate-400">ส่ง Request และดู Response ได้จากจุดเดียว</p>
                      </div>
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-[9px] text-slate-500">DEV</span>
                    </div>
                  </div>

                  <div className="space-y-5 p-5">
                    {/* Authentication */}
                    <section>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Authentication</h4>
                          <p className="mt-0.5 text-[10px] text-slate-400">Access Token สำหรับ endpoint ที่ใช้ Bearer Authentication</p>
                        </div>
                        {hasToken ? (
                          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700">Token Ready</span>
                        ) : (
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-[9px] font-bold text-slate-500">No Token</span>
                        )}
                      </div>

                      {endpoint.id === 'generate-access-token' ? (
                        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                          {credentials ? (
                            <>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <div>
                                  <label className="mb-1 block text-[9px] font-bold text-slate-400">client_id</label>
                                  <code className="block truncate rounded-md border border-slate-200 bg-white px-2 py-2 font-mono text-[10px] text-slate-600">{credentials.clientId}</code>
                                </div>
                                <div>
                                  <label className="mb-1 block text-[9px] font-bold text-slate-400">client_secret</label>
                                  <code className="block truncate rounded-md border border-slate-200 bg-white px-2 py-2 font-mono text-[10px] text-slate-600">{credentials.clientSecret}</code>
                                </div>
                              </div>
                              <button type="button" onClick={handleRegenerateCredentials} className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">
                                สร้าง Credentials ใหม่
                              </button>
                            </>
                          ) : (
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[10px] text-slate-500">ยังไม่มี Sandbox Credentials</span>
                              <button type="button" onClick={handleGenerateCredentials} className="rounded-md bg-indigo-600 px-3 py-2 text-[10px] font-bold text-white hover:bg-indigo-700">
                                Generate Credentials
                              </button>
                            </div>
                          )}
                        </div>
                      ) : endpoint.auth === 'bearer' ? (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
                          <div className="flex items-center justify-between gap-3">
                            <code className="min-w-0 truncate font-mono text-[10px] text-emerald-800">
                              Bearer {token ? `${token.slice(0, 16)}...` : '—'}
                            </code>
                            {issuedAccessToken && (
                              <button type="button" onClick={handleUseIssuedToken} className="shrink-0 rounded-md border border-emerald-200 bg-white px-2 py-1.5 text-[9px] font-bold text-emerald-700 hover:bg-emerald-50">
                                Use latest token
                              </button>
                            )}
                          </div>
                          {!token && (
                            <button type="button" onClick={handleGenerateAccessToken} className="mt-2 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700">
                              Generate Access Token →
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] text-slate-500">
                          This endpoint does not require authentication.
                        </div>
                      )}
                    </section>

                    {/* Request */}
                    <section>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">Request</h4>
                        <span className="font-mono text-[9px] text-slate-400">{endpoint.method}</span>
                      </div>

                      <div className="mb-3 flex min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                        <span className={`shrink-0 px-2.5 py-2 text-[10px] font-bold text-white ${METHOD_STYLE[endpoint.method].solid}`}>
                          {endpoint.method}
                        </span>
                        <input readOnly value={resolvedUrl} title={resolvedUrl} className="min-w-0 flex-1 bg-transparent px-2.5 py-2 font-mono text-[10px] text-slate-600 outline-none" />
                        <CopyButton text={resolvedUrl} />
                        <button
                          type="button"
                          onClick={handleResetRequest}
                          className="shrink-0 border-l border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-500 transition-colors hover:bg-white hover:text-indigo-700"
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={handleSend}
                          disabled={endpoint.id === 'generate-access-token' && !credentials}
                          className="shrink-0 bg-indigo-600 px-4 py-2 text-[10px] font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          Send
                        </button>
                      </div>

                      {endpoint.pathParams.length > 0 && (
                        <div className="mb-3 space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Path Parameters</div>
                          {endpoint.pathParams.map((p) => (
                            <label key={p.key} className="block">
                              <span className="mb-1 block text-[10px] font-semibold text-slate-600">{p.key}</span>
                              <input
                                value={pathValues[p.key] ?? ''}
                                onChange={(e) => setPathValues((v) => ({ ...v, [p.key]: e.target.value }))}
                                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 font-mono text-[10px] text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              />
                            </label>
                          ))}
                        </div>
                      )}

                      {endpoint.queryParams.length > 0 && (
                        <div className="mb-3 space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Query Parameters</div>
                          {endpoint.queryParams.map((q) => (
                            <label key={q.key} className="block">
                              <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold text-slate-600">
                                {q.key}
                                {q.required && <span className="text-rose-500">*</span>}
                              </span>
                              <input
                                value={queryValues[q.key] ?? ''}
                                onChange={(e) => setQueryValues((v) => ({ ...v, [q.key]: e.target.value }))}
                                placeholder={q.example}
                                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 font-mono text-[10px] text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                              />
                            </label>
                          ))}
                        </div>
                      )}

                      {endpoint.bodyType !== 'none' && (
                        <div>
                          <div className="mb-1 flex items-center justify-between">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Request Body</div>
                            <span className="font-mono text-[9px] text-slate-400">{endpoint.bodyType === 'json' ? 'JSON' : endpoint.bodyType}</span>
                          </div>
                          <textarea
                            value={bodyText}
                            onChange={(e) => setBodyText(e.target.value)}
                            spellCheck={false}
                            className="min-h-[260px] w-full resize-y rounded-lg border border-slate-200 bg-slate-950 px-3 py-3 font-mono text-[10px] leading-5 text-slate-100 outline-none focus:border-indigo-400"
                          />
                        </div>
                      )}

                    </section>

                    {/* Response */}
                    <section>
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">Response</h4>
                        <div className="flex items-center gap-2">
                          {response && !response.loading && (
                            <button type="button" onClick={() => setResponse(null)} className="text-[10px] font-semibold text-slate-400 hover:text-indigo-600">
                              Clear response
                            </button>
                          )}
                          {response && !response.loading && (
                            <span className={`rounded-md px-2 py-1 font-mono text-[9px] font-bold ${response.status >= 200 && response.status < 300 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                              {response.status} · {response.ms} ms
                            </span>
                          )}
                        </div>
                      </div>

                      {!response && (
                        <div className="rounded-lg border border-dashed border-slate-200 px-4 py-8 text-center text-[10px] text-slate-400">
                          Response จะแสดงที่นี่หลังจากกด Send Request
                        </div>
                      )}

                      {response?.loading && (
                        <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-10 text-slate-400">
                          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          <span className="text-[10px]">Sending request...</span>
                        </div>
                      )}

                      {response && !response.loading && (
                        <>
                          {endpoint.id === 'generate-access-token' && response.status === 200 && typeof response.body === 'object' && response.body !== null && 'access_token' in response.body && (
                            <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                              <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700">Access Token</div>
                              <div className="flex items-center gap-2 rounded-md border border-emerald-100 bg-white px-2.5 py-2">
                                <code className="min-w-0 flex-1 break-all font-mono text-[10px] text-slate-700">
                                  {(response.body as { access_token: string }).access_token}
                                </code>
                                <CopyButton text={(response.body as { access_token: string }).access_token} />
                              </div>
                            </div>
                          )}

                          <CodeBlock label="JSON">{JSON.stringify(response.body, null, 2)}</CodeBlock>

                          {endpoint.id === 'generate-access-token' && response.status === 200 && (
                            <button
                              type="button"
                              onClick={() => selectEndpoint('create-parcel-non-cod')}
                              className="mt-3 w-full rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100"
                            >
                              Open Parcel API →
                            </button>
                          )}

                          {response.demo && (
                            <p className="mt-2 text-[9px] leading-5 text-slate-400">
                              Demo response — ตัวอย่างการตอบกลับจากข้อมูล endpoint ที่มีอยู่ใน Sandbox
                            </p>
                          )}
                        </>
                      )}
                    </section>

                    {/* Code Example */}
                    <section className="rounded-lg border border-slate-200 bg-slate-50">
                      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2.5">
                        <div className="min-w-0">
                          <h4 className="text-[10px] font-bold text-slate-700">
                            Code Example
                          </h4>
                          <p className="mt-0.5 text-[9px] text-slate-400">
                            ตัวอย่างโค้ดสำหรับส่ง Request ในภาษาที่เลือก
                          </p>
                        </div>

                        <select
                          value={codeLanguage}
                          onChange={(e) =>
                            setCodeLanguage(e.target.value as ClientLibraryLanguage)
                          }
                          aria-label="Code example language"
                          className="shrink-0 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[9px] font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        >
                          {CLIENT_LIBRARY_LANGUAGES.map((language) => (
                            <option key={language} value={language}>
                              {language}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="p-3">
                        <CodeBlock label={codeLanguage}>
                          {codeExample}
                        </CodeBlock>
                      </div>
                    </section>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default Sandbox;
