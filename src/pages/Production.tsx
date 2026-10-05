import { Badge } from '../components/common/Badge';
import { SidebarLogoutButton } from '../components/layout/SidebarLogoutButton';
import { Card } from '../components/common/Card';
import { Header as ConsoleHeader } from '../components/layout/Header';
import { PageContainer } from '../components/layout/PageContainer';
import { Sidebar as AppSidebar } from '../components/layout/Sidebar';
import {
    ApiCredentials,
    ProductionAccessPending,
    ProductionAccessRequired,
    QuickActions,
    RecentActivity,
    StatusDot,
    UsageSummary,
    WebhookCard,
} from '../features/production/components/ProductionSections';
import { useProductionDashboard } from '../features/production/useProductionDashboard';
export function Production() {
    const { productionStatus, lang, setLang, copy, handleApply, approveDemo, handleDocs, handleGuide, handleWebhook, handleActivity, handleLogout } = useProductionDashboard();

    return (
        <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-sm text-slate-800">
            {/* ==================================================
                SIDEBAR
            ================================================== */}

            <AppSidebar
                items={[
                    { label: copy.apiDocs, path: '/docs' },
                    { label: copy.sandbox, path: '/sandbox' },
                    { label: copy.production, path: '/production' },
                    { label: 'Webhook', path: '/webhook' },
                    { label: copy.billing, path: '/billing' },
                ]}
                activePath="/production"
                footer={
                    <SidebarLogoutButton
                        label={copy.logout}
                        onClick={() => void handleLogout()}
                    />
                }
            />

            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="min-w-0 flex-1 overflow-y-auto bg-[#f8fafc]">
                <ConsoleHeader
                    title={copy.title}
                    subtitle={copy.subtitle}
                    badge={
                        productionStatus ===
                        'approved' ? (
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    tone="emerald"
                                    className="inline-flex items-center gap-1.5"
                                >
                                    <StatusDot active />
                                    {copy.active}
                                </Badge>
                            </div>
                        ) : null
                    }
                    actions={
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                                {(
                                    ['TH', 'EN'] as const
                                ).map((code) => (
                                    <button
                                        key={code}
                                        type="button"
                                        onClick={() =>
                                            setLang(code)
                                        }
                                        className={`rounded-md px-2.5 py-1 text-[10px] font-bold transition ${
                                            lang === code
                                                ? 'bg-white text-indigo-700 shadow-sm'
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>
                    }
                    userName="My Company"
                    userMeta="Production Account"
                />

                {/* ==================================================
                    CONTENT
                ================================================== */}

                {productionStatus ===
                    'not_applied' && (
                    <PageContainer className="!px-6 !py-7 lg:!px-10">
                        <ProductionAccessRequired
                            onApply={handleApply}
                        />
                    </PageContainer>
                )}

                {productionStatus ===
                    'pending' && (
                    <PageContainer className="!px-6 !py-7 lg:!px-10">
                        <ProductionAccessPending
                            onDemoApprove={approveDemo}
                        />
                    </PageContainer>
                )}

                {productionStatus ===
                    'approved' && (
                    <PageContainer className="!px-6 !py-7 lg:!px-10">
                        <div className="mx-auto max-w-[1440px] space-y-5">
                            {/* ==================================================
                                ACTIVE BANNER
                            ================================================== */}

                            <div className="flex flex-col gap-4 rounded-xl border border-emerald-200 bg-emerald-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path d="M5 12l4 4L19 6" />
                                        </svg>
                                    </div>

                                    <div>
                                        <div className="text-sm font-bold text-emerald-700">
                                            {copy.activeTitle}
                                        </div>

                                        <p className="mt-0.5 text-xs text-emerald-700/70">
                                            {copy.activeDescription}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge tone="emerald">
                                        Active
                                    </Badge>

                                    <div className="hidden border-l border-emerald-200 pl-4 text-right sm:block">
                                        <div className="text-[10px] text-emerald-700/60">
                                            {copy.activeSince}
                                        </div>

                                        <div className="mt-0.5 text-xs font-semibold text-emerald-800">
                                            12 ก.ย. 2026
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ==================================================
                                MAIN GRID
                            ================================================== */}

                            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
                                {/* LEFT */}
                                <div className="min-w-0 space-y-5">
                                    <ApiCredentials
                                        onDocs={handleDocs}
                                    />

                                    <UsageSummary />

                                    <RecentActivity
                                        onViewAll={handleActivity}
                                    />
                                </div>

                                {/* RIGHT */}
                                <aside className="space-y-5">
                                    <QuickActions
                                        onDocs={handleDocs}
                                        onGuide={handleGuide}
                                    />

                                    <WebhookCard
                                        onManage={handleWebhook}
                                    />

                                    {/* Security notice */}
                                    <Card className="border-amber-200 bg-amber-50/50">
                                        <div className="flex gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                                                !
                                            </div>

                                            <div>
                                                <div className="text-xs font-bold text-amber-900">
                                                    Security Notice
                                                </div>

                                                <p className="mt-1 text-[10px] leading-5 text-amber-800/70">
                                                    ห้ามเปิดเผย Client
                                                    Secret
                                                    หรือเก็บไว้ใน
                                                    Frontend
                                                    ของเว็บไซต์
                                                    ควรเก็บไว้ใน
                                                    Backend
                                                    หรือ Environment
                                                    Variable
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                </aside>
                            </div>
                        </div>
                    </PageContainer>
                )}
            </main>
        </div>
    );
}

export default Production;
