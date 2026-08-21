import { useState } from 'react';

export const ApiDocs = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'sandbox'>('docs');

  const endpoints = [
    { method: 'POST', name: 'Create Shipment', path: '/v1/shipments', active: true },
    { method: 'GET', name: 'Get Tracking Info', path: '/v1/shipments/:id', active: false },
    { method: 'POST', name: 'Calculate Freight', path: '/v1/rates/calculate', active: false },
    { method: 'GET', name: 'Get Wallet Balance', path: '/v1/wallet/balance', active: false },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* 1. Left Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600"></span>
            <h1 className="font-bold text-sm text-slate-900 tracking-wide font-mono">
              MyAPI Open API
            </h1>
          </div>
          <span className="text-[10px] bg-sky-50 text-sky-700 font-semibold px-2 py-0.5 rounded border border-sky-200">
            v1.0.0
          </span>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100">
          <input
            type="text"
            placeholder="Search API..."
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:bg-white focus:border-blue-500 transition-colors placeholder:text-slate-400"
          />
        </div>

        {/* Endpoint Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            Shipment Service
          </div>
          {endpoints.map((ep, idx) => (
            <button
              key={idx}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded text-xs font-medium transition-all ${
                ep.active
                  ? 'bg-blue-50 text-blue-900 font-semibold border-l-2 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    ep.method === 'POST'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {ep.method}
                </span>
                <span className="truncate">{ep.name}</span>
              </div>
            </button>
          ))}
        </nav>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="text-slate-900 font-semibold">Docs</span>
            <span>/</span>
            <span>Shipment Service</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Create Shipment</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'docs'
                  ? 'bg-white text-blue-700 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Documentation
            </button>
            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-white text-blue-700 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              API Console (Sandbox)
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full space-y-8">
          
          {/* Title & Endpoint Header */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">Create Shipment</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              สร้างรายการจัดส่งพัสดุใหม่ในระบบ ระบบจะคืนค่า Tracking Number พร้อมราคาสุทธิกลับมาให้อัตโนมัติ
            </p>
            
            {/* Endpoint Box */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 font-mono text-xs shadow-sm">
              <span className="bg-blue-600 text-white font-bold px-2.5 py-1 rounded">
                POST
              </span>
              <span className="text-slate-700 font-semibold">
                https://api.myapi.com/v1/shipments
              </span>
            </div>
          </div>

          {/* Request Headers */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Headers</h3>
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono">
                    <th className="p-3">KEY</th>
                    <th className="p-3">TYPE</th>
                    <th className="p-3">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="p-3 font-semibold text-blue-600">Authorization</td>
                    <td className="p-3 text-slate-400">string</td>
                    <td className="p-3 text-slate-600 font-sans">Bearer Token (API Key ของผู้ใช้งาน)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-blue-600">Content-Type</td>
                    <td className="p-3 text-slate-400">string</td>
                    <td className="p-3 text-slate-600 font-sans">application/json</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Request Body & Response Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Request Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Request Body (JSON)
                </h3>
                <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">json</span>
              </div>
              <div className="bg-[#0F172A] text-slate-200 p-4 rounded-lg font-mono text-xs overflow-x-auto shadow-md border border-slate-800 leading-relaxed">
                <pre>{`{
  "sender": {
    "name": "John Doe",
    "phone": "0812345678"
  },
  "recipient": {
    "name": "Jane Smith",
    "phone": "0898765432",
    "address": "123 Sukhumvit Rd, Bangkok"
  },
  "parcel": {
    "weight_kg": 1.5,
    "size_cm": "20x30x10"
  }
}`}</pre>
              </div>
            </div>

            {/* Response Example */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
                  Response Example
                </h3>
                <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded font-mono">
                  200 OK
                </span>
              </div>
              <div className="bg-[#0F172A] text-sky-300 p-4 rounded-lg font-mono text-xs overflow-x-auto shadow-md border border-slate-800 leading-relaxed">
                <pre>{`{
  "status": "success",
  "data": {
    "tracking_number": "EX12345678TH",
    "fee": 45.00,
    "estimated_delivery": "2026-08-22"
  }
}`}</pre>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};