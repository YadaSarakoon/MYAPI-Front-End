import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ==========================================
// 1. TYPES & INTERFACES
// ==========================================
type EndpointKey = 
  | 'AUTH' 
  | 'CREATE_PARCEL_INSURED' 
  | 'CREATE_PARCEL_NO_INSURED'
  | 'TRACKING_GET'
  | 'WEBHOOK_CONFIG'
  | 'CUSTOMER_UPDATE';

interface RequestPayload {
  [key: string]: any;
}

// ==========================================
// 2. SVG LOGO COMPONENT
// ==========================================
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
        stroke="url(#myapi_cyan_gradient)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle 
        cx="41" 
        cy="45" 
        r="7.5" 
        fill="url(#myapi_dot_gradient)" 
      />
    </g>

    <text
      x="196"
      y="64"
      fill="url(#myapi_pi_gradient)"
      fontSize="66"
      fontFamily="Inter, system-ui, -apple-system, sans-serif"
      fontWeight="900"
      letterSpacing="-0.5"
    >
      PI
    </text>

    <defs>
      <linearGradient id="myapi_cyan_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#0088FF" />
      </linearGradient>

      <linearGradient id="myapi_dot_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00B2FF" />
        <stop offset="100%" stopColor="#0055FF" />
      </linearGradient>

      <linearGradient id="myapi_pi_gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0077FF" />
        <stop offset="100%" stopColor="#0044CC" />
      </linearGradient>
    </defs>
  </svg>
);

// ==========================================
// 3. MAIN PRODUCTION PAGE COMPONENT
// ==========================================
export function Production() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Create Shipment' | 'Tracking Update' | 'Webhook Event' | 'Customer System Update'>('Create Shipment');
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointKey>('CREATE_PARCEL_INSURED');
  const [bearerToken, setBearerToken] = useState<string>('prod_live_8f99a0acb0ff10fb526cb3de97f7c168');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseOutput, setResponseOutput] = useState<Record<string, any> | null>(null);
  const [responseStatus, setResponseStatus] = useState<{ code: number; text: string } | null>(null);
  const [lang, setLang] = useState<'TH' | 'EN'>('EN');
  
  // State สำหรับควบคุมแจ้งเตือนการกด Copy
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  const tabs = [
    { id: 'Overview', label: 'Overview' },
    { id: 'Create Shipment', label: 'Create Shipment' },
    { id: 'Tracking Update', label: 'Tracking Update' },
    { id: 'Webhook Event', label: 'Webhook Event' },
    { id: 'Customer System Update', label: 'Customer System Update' },
  ] as const;

  // Mock Production Request Data
  const requestPayloads: Record<EndpointKey, RequestPayload> = {
    AUTH: {
      client_id: "prod_live_maF8xqVVCnz0Z4mgXQnvuWHH",
      client_secret: "prod_live_fQbMMUd3EcP9HjTaakrxvWju",
      grant_type: "client_credentials",
      scope: "parcel"
    },
    CREATE_PARCEL_INSURED: {
      express: "THAI_POST",
      sender: {
        name: "คุณมายเอ็กซ์เพรส ภูเก็ต (HQ)",
        phoneNumber: "0813150764",
        address: "69/429 หมู่ 2",
        subDistrict: "วิชิต",
        district: "เมืองภูเก็ต",
        province: "ภูเก็ต",
        zipCode: "83000"
      },
      receiver: {
        name: "คุณมายเอ็กซ์เพรส ชลบุรี",
        phoneNumber: "0989392917",
        address: "188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1",
        subDistrict: "หนองขาม",
        district: "ศรีราชา",
        province: "ชลบุรี",
        zipCode: "20230"
      },
      note: "Live Production Order",
      weightGram: 1000,
      isInsured: true,
      insuranceDeclaredValue: 3000,
      insuranceProductPrice: 3000
    },
    CREATE_PARCEL_NO_INSURED: {
      express: "THAI_POST",
      sender: {
        name: "คุณมายเอ็กซ์เพรส ภูเก็ต (HQ)",
        phoneNumber: "0813150764",
        address: "69/429 หมู่ 2",
        subDistrict: "วิชิต",
        district: "เมืองภูเก็ต",
        province: "ภูเก็ต",
        zipCode: "83000"
      },
      receiver: {
        name: "คุณมายเอ็กซ์เพรส ชลบุรี",
        phoneNumber: "0989392917",
        address: "188/273 หมู่บ้านเดอะบูเลอวาร์ด ศรีราชา ซอย 14/1 หมู่ที่ 1",
        subDistrict: "หนองขาม",
        district: "ศรีราชา",
        province: "ชลบุรี",
        zipCode: "20230"
      },
      note: "Live Production Order",
      weightGram: 1000,
      isInsured: false
    },
    TRACKING_GET: {
      trackingNumber: "TH048855193PROD"
    },
    WEBHOOK_CONFIG: {
      url: "https://api.yourcompany.com/v1/webhook",
      events: ["PARCEL_CREATED", "STATUS_UPDATED", "DELIVERED"]
    },
    CUSTOMER_UPDATE: {
      customerId: "CUST_PROD_991823",
      status: "ACTIVE"
    }
  };

  // Switch Tab Handler
  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setResponseOutput(null);
    setResponseStatus(null);
    
    // Auto Select Endpoint based on Tab
    if (tabId === 'Overview' || tabId === 'Create Shipment') {
      setSelectedEndpoint('CREATE_PARCEL_INSURED');
    } else if (tabId === 'Tracking Update') {
      setSelectedEndpoint('TRACKING_GET');
    } else if (tabId === 'Webhook Event') {
      setSelectedEndpoint('WEBHOOK_CONFIG');
    } else if (tabId === 'Customer System Update') {
      setSelectedEndpoint('CUSTOMER_UPDATE');
    }
  };

  // Copy Handler Function
  const handleCopyToken = () => {
    const fullToken = `Bearer ${bearerToken}`;
    navigator.clipboard.writeText(fullToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Mock Request Handler
  const handleSendRequest = () => {
    setIsLoading(true);
    setResponseOutput(null);
    setResponseStatus(null);

    setTimeout(() => {
      setIsLoading(false);
      setResponseStatus({ code: 200, text: '200 OK (LIVE)' });

      if (selectedEndpoint === 'AUTH') {
        setResponseOutput({
          expires_in: 7200,
          token_type: "bearer",
          access_token: "prod_live_8f99a0acb0ff10fb526cb3de97f7c168"
        });
      } else if (selectedEndpoint === 'CREATE_PARCEL_INSURED') {
        setResponseOutput({
          message: "production parcel created successfully",
          data: {
            id: "prod_shipment_9920148102931804390165",
            status: "PROCESSING",
            type: "NON_COD",
            sender: requestPayloads.CREATE_PARCEL_INSURED.sender,
            receiver: requestPayloads.CREATE_PARCEL_INSURED.receiver,
            shipping: {
              express: "THAI_POST",
              trackingNumber: "TH048855193PROD",
              weightGram: 1000
            },
            isInsured: true,
            insuranceDeclaredValue: 3000,
            insuranceProductPrice: 3000,
            createdAt: new Date().toISOString()
          }
        });
      } else if (selectedEndpoint === 'CREATE_PARCEL_NO_INSURED') {
        setResponseOutput({
          message: "production parcel created successfully",
          data: {
            id: "prod_shipment_9920148102931804390165",
            status: "PROCESSING",
            type: "NON_COD",
            sender: requestPayloads.CREATE_PARCEL_NO_INSURED.sender,
            receiver: requestPayloads.CREATE_PARCEL_NO_INSURED.receiver,
            shipping: {
              express: "THAI_POST",
              trackingNumber: "TH048855193PROD",
              weightGram: 1000
            },
            isInsured: false,
            createdAt: new Date().toISOString()
          }
        });
      } else if (selectedEndpoint === 'TRACKING_GET') {
        setResponseOutput({
          trackingNumber: "TH048855193PROD",
          express: "THAI_POST",
          status: "IN_TRANSIT",
          logs: [
            { time: new Date().toISOString(), location: "ศูนย์ไปรษณีย์ภูเก็ต", status: "รับฝากเข้าระบบแล้ว" },
            { time: new Date().toISOString(), location: "ศูนย์ไปรษณีย์ศรีราชา", status: "อยู่ระหว่างจัดส่งให้ผู้รับ" }
          ]
        });
      } else {
        setResponseOutput({
          message: "production live event executed successfully",
          status: "SUCCESS",
          timestamp: new Date().toISOString()
        });
      }
    }, 500);
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div 
        className="flex h-screen bg-[#F8FAFC] text-slate-800 overflow-hidden"
        style={{ fontFamily: "'Kanit', 'Prompt', sans-serif" }}
      >
        {/* Sidebar */}
        <aside className="w-60 bg-white text-slate-700 flex flex-col justify-between border-r border-slate-200 shrink-0">
          <div>
            <Link to="/" className="flex items-center px-5 py-4 border-b border-slate-100 hover:opacity-90 transition">
              <MyApiLogo className="h-7" />
            </Link>

            <nav className="p-3 flex flex-col gap-1 text-sm font-medium">
              <div className="px-3 py-3 text-xs font-bold text-slate-400 font-mono tracking-wider uppercase">
                OPENAPI CONSOLE
              </div>
              
              <Link 
                to="/docs" 
                className="px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                API Docs
              </Link>

              <Link 
                to="/sandbox" 
                className="px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Sandbox
              </Link>

              <Link 
                to="/production" 
                className="px-4 py-2.5 bg-[#EBF5FF] text-[#1A56DB] rounded-lg font-semibold transition-colors"
              >
                Production
              </Link>

              <Link 
                to="/dashboard" 
                className="px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>

              <Link 
                to="/wallet" 
                className="px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Wallet
              </Link>

              <Link 
                to="/webhook" 
                className="px-4 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Webhook
              </Link>
            </nav>
          </div>

          <div className="p-3 border-t border-slate-100">
            <button
              onClick={() => navigate('/login')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            >
              ออกจากระบบ
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
          
          {/* Top Header Bar & Navigation Tabs */}
          <header className="bg-white border-b border-slate-200 px-8 pt-6 pb-0 flex flex-col gap-6 shrink-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <h1 className="text-xl font-bold text-slate-900">Production Console (Live)</h1>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 select-none">
                <span className={lang === 'TH' ? 'text-slate-900 font-bold' : 'text-slate-400'}>TH</span>
                <button
                  type="button"
                  onClick={() => setLang(lang === 'TH' ? 'EN' : 'TH')}
                  className="relative w-9 h-5 bg-blue-600 rounded-full p-0.5 transition-colors focus:outline-none"
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      lang === 'EN' ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className={lang === 'EN' ? 'text-slate-900 font-bold' : 'text-slate-400'}>EN</span>
              </div>
            </div>

            {/* Sub-navigation Tabs */}
            <nav className="flex items-center gap-8 -mb-px overflow-x-auto text-sm font-mono">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`pb-3 border-b-2 font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'border-blue-500 text-blue-500'
                        : 'border-transparent text-slate-800 hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </header>

          {/* Console Body Content */}
          <div className="flex-1 grid grid-cols-12 p-6 gap-6 overflow-hidden">
            {/* Request Config Panel */}
            <div className="col-span-6 bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-between overflow-y-auto max-h-full">
              <div className="flex-1 flex flex-col min-h-0">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 shrink-0">
                  Select Production Endpoint ({activeTab})
                </h2>
                
                {/* Endpoint Selection List based on activeTab */}
                <div className="flex flex-col gap-2 mb-4 shrink-0">
                  {(activeTab === 'Overview' || activeTab === 'Create Shipment') && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedEndpoint('CREATE_PARCEL_INSURED')}
                        className={`p-3 rounded-lg border text-left text-sm font-medium transition flex items-center justify-between ${
                          selectedEndpoint === 'CREATE_PARCEL_INSURED'
                            ? 'bg-[#EBF5FF] border-[#1A56DB]/40 text-[#1A56DB] shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-mono text-xs bg-[#1A56DB] text-white font-bold px-2 py-0.5 rounded mr-2">POST</span>
                        <span className="flex-1 font-mono text-xs font-semibold">/v1/parcel</span>
                        <span className="text-xs font-semibold text-emerald-600">Insured</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedEndpoint('CREATE_PARCEL_NO_INSURED')}
                        className={`p-3 rounded-lg border text-left text-sm font-medium transition flex items-center justify-between ${
                          selectedEndpoint === 'CREATE_PARCEL_NO_INSURED'
                            ? 'bg-[#EBF5FF] border-[#1A56DB]/40 text-[#1A56DB] shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-mono text-xs bg-[#1A56DB] text-white font-bold px-2 py-0.5 rounded mr-2">POST</span>
                        <span className="flex-1 font-mono text-xs font-semibold">/v1/parcel</span>
                        <span className="text-xs text-slate-500">Non-Insured</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedEndpoint('AUTH')}
                        className={`p-3 rounded-lg border text-left text-sm font-medium transition flex items-center justify-between ${
                          selectedEndpoint === 'AUTH'
                            ? 'bg-[#EBF5FF] border-[#1A56DB]/40 text-[#1A56DB] shadow-sm'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-mono text-xs bg-[#1A56DB] text-white font-bold px-2 py-0.5 rounded mr-2">POST</span>
                        <span className="flex-1 font-mono text-xs font-semibold">/v1/auth/oauth2/token</span>
                        <span className="text-xs text-slate-500">Auth Token</span>
                      </button>
                    </>
                  )}

                  {activeTab === 'Tracking Update' && (
                    <button
                      type="button"
                      onClick={() => setSelectedEndpoint('TRACKING_GET')}
                      className="p-3 bg-[#EBF5FF] border border-[#1A56DB]/40 text-[#1A56DB] rounded-lg text-left text-sm font-medium flex items-center justify-between"
                    >
                      <span className="font-mono text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded mr-2">GET</span>
                      <span className="flex-1 font-mono text-xs font-semibold">/v1/tracking/:trackingNumber</span>
                      <span className="text-xs text-slate-500">Track Info</span>
                    </button>
                  )}

                  {activeTab === 'Webhook Event' && (
                    <button
                      type="button"
                      onClick={() => setSelectedEndpoint('WEBHOOK_CONFIG')}
                      className="p-3 bg-[#EBF5FF] border border-[#1A56DB]/40 text-[#1A56DB] rounded-lg text-left text-sm font-medium flex items-center justify-between"
                    >
                      <span className="font-mono text-xs bg-[#1A56DB] text-white font-bold px-2 py-0.5 rounded mr-2">POST</span>
                      <span className="flex-1 font-mono text-xs font-semibold">/v1/webhook/config</span>
                      <span className="text-xs text-slate-500">Config Hook</span>
                    </button>
                  )}

                  {activeTab === 'Customer System Update' && (
                    <button
                      type="button"
                      onClick={() => setSelectedEndpoint('CUSTOMER_UPDATE')}
                      className="p-3 bg-[#EBF5FF] border border-[#1A56DB]/40 text-[#1A56DB] rounded-lg text-left text-sm font-medium flex items-center justify-between"
                    >
                      <span className="font-mono text-xs bg-amber-600 text-white font-bold px-2 py-0.5 rounded mr-2">PUT</span>
                      <span className="flex-1 font-mono text-xs font-semibold">/v1/customer/status</span>
                      <span className="text-xs text-slate-500">Update Customer</span>
                    </button>
                  )}
                </div>

                {/* Authorization Header Input With Copy Button */}
                {selectedEndpoint !== 'AUTH' && (
                  <div className="mb-4 shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-600">Live Authorization Header</label>
                      <button
                        type="button"
                        onClick={handleCopyToken}
                        className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                      >
                        {copiedToken ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Copied!
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Copy
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={`Bearer ${bearerToken}`}
                        onChange={(e) => setBearerToken(e.target.value.replace('Bearer ', ''))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-3 pr-16 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1A56DB]"
                      />
                      <button
                        type="button"
                        onClick={handleCopyToken}
                        className="absolute right-2 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-medium rounded-md shadow-sm transition"
                      >
                        {copiedToken ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Request Body JSON */}
                <h3 className="text-xs font-semibold text-slate-600 mb-2 shrink-0">Request Body (JSON)</h3>
                <div className="flex-1 min-h-[160px] bg-[#0B132B] rounded-lg border border-slate-800 overflow-hidden shadow-sm">
                  <pre className="p-4 h-full font-mono text-xs text-[#38BDF8] overflow-auto">
                    {JSON.stringify(requestPayloads[selectedEndpoint], null, 2)}
                  </pre>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleSendRequest}
                disabled={isLoading}
                className="mt-4 w-full bg-[#1A56DB] hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm shrink-0"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Executing Live Request...</span>
                  </>
                ) : (
                  <span>Send Production Request</span>
                )}
              </button>
            </div>

            {/* Response Console Panel */}
            <div className="col-span-6 bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col overflow-hidden max-h-full">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 shrink-0">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Response Console</h2>
                {responseStatus && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#EBF5FF] text-[#1A56DB] font-bold border border-blue-200">
                    {responseStatus.text}
                  </span>
                )}
              </div>

              <div className="flex-1 bg-[#0B132B] border border-slate-800 rounded-lg p-4 font-mono text-xs overflow-auto min-h-0 shadow-sm">
                {isLoading && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                    <div className="w-5 h-5 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting to Production API...</span>
                  </div>
                )}

                {!isLoading && !responseOutput && (
                  <div className="h-full flex items-center justify-center text-slate-500">
                    Click "Send Production Request" to execute live API call.
                  </div>
                )}

                {!isLoading && responseOutput && (
                  <pre className="text-[#38BDF8] whitespace-pre-wrap">
                    {JSON.stringify(responseOutput, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Production;