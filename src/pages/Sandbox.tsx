import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- Component: MyAPI SVG Logo (ตัว A ทรงมนโค้ง) ---
const MyApiLogo: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
  <svg
    viewBox="0 0 280 85"
    className={`${className} w-auto overflow-visible`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="64"
      fill="#0B132B"
      fontSize="66"
      fontFamily="Inter, system-ui, -apple-system, sans-serif"
      fontWeight="900"
      letterSpacing="-1.5"
    >
      My
    </text>
    <g transform="translate(108, 14)">
      <path
        d="M 10 52 L 35 8 C 38 3, 44 3, 47 8 L 72 52"
        fill="none"
        stroke="url(#myapi_cyan_gradient_sb)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="41" cy="45" r="7.5" fill="url(#myapi_dot_gradient_sb)" />
    </g>
    <text
      x="196"
      y="64"
      fill="url(#myapi_pi_gradient_sb)"
      fontSize="66"
      fontFamily="Inter, system-ui, -apple-system, sans-serif"
      fontWeight="900"
      letterSpacing="-0.5"
    >
      PI
    </text>
    <defs>
      <linearGradient id="myapi_cyan_gradient_sb" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#0088FF" />
      </linearGradient>
      <linearGradient id="myapi_dot_gradient_sb" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00B2FF" />
        <stop offset="100%" stopColor="#0055FF" />
      </linearGradient>
      <linearGradient id="myapi_pi_gradient_sb" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0077FF" />
        <stop offset="100%" stopColor="#0044CC" />
      </linearGradient>
    </defs>
  </svg>
);

export const Sandbox: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'tracking' | 'webhook' | 'customer'>('overview');
  const [activeNav, setActiveNav] = useState('Sandbox');
  const [apiKey, setApiKey] = useState('sk_test_51MzQ...89xA2');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTestResponse(JSON.stringify({
        status: "success",
        code: 200,
        message: "Mock API Sandbox response returned successfully",
        data: {
          tracking_number: "EF889127394TH",
          courier: "THAILAND_POST",
          status: "IN_TRANSIT",
          estimated_delivery: "2026-08-27"
        }
      }, null, 2));
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-['Prompt'] flex antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-slate-200/80 border-r border-slate-300 flex flex-col justify-between p-4 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 py-1">
            <Link to="/">
              <MyApiLogo className="h-7" />
            </Link>
          </div>

          <div className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 px-3">
            OpenAPI Console
          </div>

          <nav className="space-y-1 text-sm font-bold">
            {[
              { name: 'API Docs', icon: '📄' },
              { name: 'Sandbox', icon: '🧪' },
              { name: 'Production', icon: '⚡' },
              { name: 'Dashboard', icon: '📊' },
              { name: 'Wallet', icon: '💳' },
              { name: 'Webhook', icon: '🔔' },
            ].map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setActiveNav(item.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  activeNav === item.name
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:bg-slate-300/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="w-full px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl text-left transition-colors cursor-pointer"
        >
          ออกจากระบบ
        </button>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        
        {/* TOPBAR */}
        <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-extrabold text-sm text-slate-900">Sandbox Mode</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search API..."
                className="w-48 sm:w-64 pl-8 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>
            
            <div className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <span className="text-blue-600">TH</span> | <span>EN</span>
            </div>
          </div>
        </header>

        {/* CONTENT BODY */}
        <main className="p-8 space-y-8 overflow-y-auto">
          
          {/* HEADER TITLE & SUB-NAVIGATION TABS */}
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-slate-900">Webhook</h1>

            <div className="flex border-b border-slate-200 gap-8 text-xs font-bold text-slate-500">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'create', label: 'Create Shipment' },
                { id: 'tracking', label: 'Tracking Update' },
                { id: 'webhook', label: 'Webhook Event' },
                { id: 'customer', label: 'Customer System Update' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 transition-colors cursor-pointer relative ${
                    activeTab === tab.id ? 'text-blue-600 font-extrabold' : 'hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* GRID SECTION: AVAILABLE EVENTS & WEBHOOK SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT TABLE: AVAILABLE EVENTS */}
            <div className="lg:col-span-8 space-y-3">
              <h2 className="text-base font-bold text-slate-900">Available Events</h2>
              <p className="text-xs text-slate-500">รายการ Event ที่ระบบจะส่งไปยัง Webhook URL</p>

              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3.5 pl-6 w-1/3">Event</th>
                      <th className="p-3.5">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                    <tr>
                      <td className="p-3.5 pl-6">
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 font-mono font-bold rounded-lg border border-rose-100 inline-block">
                          shipment.create
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">สร้างออเดอร์พัสดุสำเร็จในระบบ</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 pl-6">
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 font-mono font-bold rounded-lg border border-rose-100 inline-block">
                          shipment.updated
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">อัปเดตสถานะการจัดส่งพัสดุ</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 pl-6">
                        <span className="px-3 py-1 bg-rose-50 text-rose-600 font-mono font-bold rounded-lg border border-rose-100 inline-block">
                          delivery.success
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">พัสดุจัดส่งถึงผู้รับเรียบร้อยแล้ว</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT SUMMARY BOX */}
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Webhook Summary</h3>
              
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">∇ HTTP Method</span>
                  <span className="font-mono font-bold text-slate-900">POST</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">☑ Content-Type</span>
                  <span className="font-mono text-slate-900">app/json</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">🔒 Authentication</span>
                  <span className="font-mono text-slate-900">XXX-XXXX</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">📥 Response</span>
                  <span className="font-mono font-bold text-emerald-600">200 OK</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-500">🔄 Retry Policy</span>
                  <span className="font-bold text-slate-900">3 ครั้ง</span>
                </div>
              </div>
            </div>

          </div>

          {/* DIAGRAM SECTION: HOW WEBHOOK WORKS */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">How Webhook Works</h2>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="bg-slate-200/80 px-6 py-4 rounded-xl text-center space-y-1 w-full sm:w-auto min-w-[130px]">
                <div className="text-xl">🛒</div>
                <div className="text-xs font-bold text-slate-700">Event Occurs</div>
              </div>

              <div className="text-slate-400 font-mono text-xs flex items-center gap-1">
                <span>⟶</span>
                <span className="bg-white px-3 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600">
                  Send to webhook
                </span>
                <span>⟶</span>
              </div>

              <div className="bg-slate-200/80 px-6 py-4 rounded-xl text-center space-y-1 w-full sm:w-auto min-w-[130px]">
                <div className="text-xl">🖥️</div>
                <div className="text-xs font-bold text-slate-700">Your Server</div>
              </div>

              <div className="text-slate-400 font-mono text-xs flex items-center gap-1">
                <span>⟶</span>
                <span className="bg-white px-3 py-1 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600">
                  Return 200 OK
                </span>
                <span>⟶</span>
              </div>

              <div className="bg-slate-200/80 px-6 py-4 rounded-xl text-center space-y-1 w-full sm:w-auto min-w-[130px]">
                <div className="text-xl">⏱️</div>
                <div className="text-xs font-bold text-slate-700">Completed</div>
              </div>
            </div>
          </div>

          {/* TEST CREDENTIALS & SAMPLE MOCK API CONSOLE */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Test Credentials & Mock API</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* TEST CREDENTIALS BOX */}
              <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                  Test Credentials
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Sandbox API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={apiKey}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs font-mono text-emerald-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => alert("Copied API Key!")}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTestRequest}
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                  >
                    {isLoading ? "กำลังยิง Mock API..." : "🚀 ยิงข้อความทดสอบ (Send Sample Request)"}
                  </button>
                </div>
              </div>

              {/* SAMPLE RESPONSE BOX */}
              <div className="bg-slate-950 text-slate-300 p-6 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2">
                  <span>Sample Response</span>
                  <span className="text-emerald-400">200 OK</span>
                </div>

                <pre className="overflow-x-auto text-[11px] leading-relaxed text-slate-300">
                  {testResponse || `// กดปุ่ม "ยิงข้อความทดสอบ" ด้านซ้ายเพื่อดู Sample Response
{
  "status": "waiting_for_trigger",
  "message": "Click the button to simulate API payload"
}`}
                </pre>
              </div>

            </div>
          </div>

        </main>
      </div>

    </div>
  );
};