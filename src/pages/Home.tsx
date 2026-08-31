import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Component: MyAPI SVG Logo (ถอดแบบตามภาพที่ 2: ตัว A เส้นมนโค้ง + จุดกลมลอย) ---
const MyApiLogo: React.FC<{ className?: string }> = ({ className = "h-8" }) => (
  <svg
    viewBox="0 0 280 85"
    className={`${className} w-auto overflow-visible`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* คำว่า "My" สีน้ำเงินเข้มจัด */}
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

    {/* ไอคอนตัว A ทรงเส้นมนโค้ง (ตามภาพที่ 2) */}
    <g transform="translate(108, 14)">
      {/* โครงตัว A แบบเส้น Rounded Stroke */}
      <path
        d="M 10 52 L 35 8 C 38 3, 44 3, 47 8 L 72 52"
        fill="none"
        stroke="url(#myapi_cyan_gradient)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* จุดวงกลมตรงกลางล่าง */}
      <circle 
        cx="41" 
        cy="45" 
        r="7.5" 
        fill="url(#myapi_dot_gradient)" 
      />
    </g>

    {/* คำว่า "PI" สีฟ้าสด */}
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

    {/* ไล่เฉดสีตรงตามต้นฉบับ */}
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

// --- Interfaces & Types ---
interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type TabType = 'label' | 'tracking' | 'rate';
type DropdownType = 'products' | null;

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    q: 'MyAPI เชื่อมต่อกับระบบ MyOrder ได้อย่างไร?',
    a: 'MyAPI ออกแบบมาเพื่อทำงานร่วมกับ MyOrder โดยเฉพาะ คุณสามารถนำ API Key จากระบบ MyAPI ไปวางในเมนูตั้งค่า Integration ของ MyOrder เพื่อเปิดใช้อัตโนมัติได้ทันที',
  },
  {
    q: 'ใช้เวลานานเท่าไรในการทดสอบระบบ?',
    a: 'คุณสามารถสมัครสมาชิกและเริ่มทดสอบยิง API ในสภาพแวดล้อม Sandbox ได้ทันทีภายใน 5 นาที มีเอกสาร API Docs พร้อมตัวอย่างโค้ดให้คัดลอกได้ทันที',
  },
  {
    q: 'รองรับบริการใดของไปรษณีย์ไทยบ้าง?',
    a: 'รองรับทั้งบริการส่งด่วน EMS, พัสดุลงทะเบียน (Registered Mail) และบริการเก็บเงินปลายทาง (COD)',
  },
];

export const Home: React.FC = () => {
  // Navigation & Dropdown State
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  
  // Feature Tabs State
  const [activeTab, setActiveTab] = useState<TabType>('label');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact Form State
  const [contactForm, setContactForm] = useState<ContactFormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Form Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Contact Form Submitted:', contactForm);
    setContactSubmitted(true);

    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-['Prompt'] antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Import Google Fonts & Custom Keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap');

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: flex;
          width: 200%;
          animation: ticker 25s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* โลโก้ MyAPI */}
          <Link to="/" className="flex items-center">
            <MyApiLogo className="h-8" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {/* Products Dropdown */}
            <div
              className="relative py-2 cursor-pointer"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <span className={`hover:text-blue-600 transition-colors flex items-center gap-1 ${activeDropdown === 'products' ? 'text-blue-600' : ''}`}>
                ผลิตภัณฑ์ <span className="text-[10px]">▾</span>
              </span>

              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 grid gap-3 z-50">
                  <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Label Generator</div>
                      <div className="text-[11px] text-slate-400">สร้างใบปะหน้าและบาร์โค้ดพัสดุอัตโนมัติ</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Parcel Tracking API</div>
                      <div className="text-[11px] text-slate-400">ติดตามสถานะจัดส่งแบบ Real-time ทุกขนส่ง</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div>
                      <div className="text-xs font-bold text-slate-900">Rate Calculator</div>
                      <div className="text-[11px] text-slate-400">คำนวณและเปรียบเทียบค่าจัดส่งล่วงหน้า</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              ฟีเจอร์
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              คำถามที่พบบ่อย
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact-us')}
              className="hover:text-blue-600 transition-colors cursor-pointer text-blue-600 font-bold"
            >
              ติดต่อเรา
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg transition-colors">
            เข้าสู่ระบบ
          </Link>
          <Link to="/signup" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all">
            เริ่มต้นใช้งานฟรี
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-24 pb-16 px-6 lg:px-16 max-w-6xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.25] tracking-tight max-w-4xl mx-auto">
          โครงสร้างพื้นฐาน API จัดการพัสดุ <br />
          <span className="text-blue-600">ทรงพลัง และยืดหยุ่นที่สุด</span>
        </h1>

        <p className="text-base text-slate-500 max-w-4xl mx-auto leading-relaxed">
          เชื่อมต่อระบบจัดการคำสั่งซื้อของคุณกับไปรษณีย์ไทย สร้างใบปะหน้า ออกเลข Tracking และดึงสถานะ Real-time ได้ในทันที
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to="/signup" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-200 transition-all text-center">
            เริ่มต้นใช้งานฟรี
          </Link>
        </div>
      </section>

      {/* 3. PARTNER LOGOS SECTION */}
      <section className="py-8 relative overflow-hidden bg-white border-y border-slate-100">
        <div className="w-full">
          <div className="animate-ticker">
            {[1, 2].map((groupKey) => (
              <div key={groupKey} className="flex items-center justify-around w-1/2 shrink-0 gap-12 px-6">
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="w-20 h-9 mb-0.5">
                    <svg viewBox="0 0 160 80" className="w-full h-full drop-shadow-sm">
                      <path d="M 5 10 L 95 10 L 98 35 C 90 43, 75 43, 65 35 Z" fill="#0C2340" />
                      <path d="M 5 10 L 98 35 C 85 47, 65 45, 50 35 Z" fill="#152B68" />
                      <path d="M 95 10 L 155 10 C 130 20, 110 27, 98 35 Z" fill="#ED2124" />
                      <path d="M 98 35 L 155 10 C 130 45, 110 70, 103 80 Z" fill="#B0B5B9" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="font-black text-[#ED2124] text-sm leading-none">ไปรษณีย์ไทย</div>
                    <div className="font-extrabold text-[#0C2340] text-[10px] leading-tight tracking-wide">Thailand Post</div>
                  </div>
                </div>

                <div className="flex items-center justify-center shrink-0">
                  <img
                    src="https://storage.googleapis.com/jobfinfin_etl_image/1682051717535-9e7b730e-9fad-4c32-b41c-4ba0abbf5c2d.png"
                    alt="MY ORDER"
                    className="h-10 w-auto object-contain"
                  />
                </div>

                <div className="flex items-center shrink-0">
                  <svg viewBox="0 0 460 90" className="h-12 w-auto overflow-visible">
                    <path d="M 28 68 C 30 86 75 92 135 71 C 175 58 185 34 172 16 C 158 -2 108 1 68 26" fill="none" stroke="#F97316" strokeWidth="7" strokeLinecap="round" />
                    <path d="M 42 50 L 48 25 L 12 55 L 32 58 Z" fill="#EF4444" />
                    <path d="M 32 58 L 48 25 L 42 50 Z" fill="#B91C1C" />
                    <text x="60" y="62" fill="#4B52B4" fontSize="52" fontFamily="Prompt, sans-serif" fontWeight="900">M</text>
                    <text x="116" y="62" fill="#F97316" fontSize="52" fontFamily="Prompt, sans-serif" fontWeight="900">Y</text>
                    <text x="180" y="62" fill="#334155" fontSize="44" fontFamily="Prompt, sans-serif" fontWeight="900" letterSpacing="-0.5">EXPRESS</text>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CODE PREVIEW */}
      <section className="py-20 px-6 lg:px-16 max-w-6xl mx-auto">
        <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-blue-900/10 border border-slate-800 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 px-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-700 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-slate-700 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-slate-700 inline-block"></span>
              <span className="text-xs font-mono text-slate-400 ml-2">POST /v1/shipments/create</span>
            </div>
            <div className="text-[11px] font-mono bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/30">
              Response 200 OK
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-mono text-xs leading-relaxed">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="text-slate-500 text-[11px]">// Request Payload</div>
              <div><span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> myapi.shipments.create(&#123;</div>
              <div className="pl-4"><span className="text-slate-300">courier:</span> <span className="text-red-400">'THAILAND_POST'</span>,</div>
              <div className="pl-4"><span className="text-slate-300">order_id:</span> <span className="text-emerald-400">'MYORDER-9982'</span>,</div>
              <div className="pl-4"><span className="text-slate-300">recipient:</span> &#123;</div>
              <div className="pl-8"><span className="text-slate-300">name:</span> <span className="text-emerald-400">'แมค เวอร์ซัปเปิล'</span>,</div>
              <div className="pl-8"><span className="text-slate-300">phone:</span> <span className="text-emerald-400">'0812345678'</span></div>
              <div className="pl-4">&#125;,</div>
              <div className="pl-4"><span className="text-slate-300">weight_kg:</span> <span className="text-amber-400">1.2</span></div>
              <div>&#125;);</div>
            </div>

            <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800/80 space-y-1 text-slate-300">
              <div className="text-slate-500 text-[11px]">// Live JSON Response</div>
              <div>&#123;</div>
              <div className="pl-4"><span className="text-blue-400">"status"</span>: <span className="text-emerald-400">"success"</span>,</div>
              <div className="pl-4"><span className="text-blue-400">"tracking_number"</span>: <span className="text-amber-300">"EF889127394TH"</span>,</div>
              <div className="pl-4"><span className="text-blue-400">"label_pdf"</span>: <span className="text-emerald-400">"https://api.myapi.com/labels/EF88.pdf"</span>,</div>
              <div className="pl-4"><span className="text-blue-400">"est_delivery"</span>: <span className="text-emerald-400">"1-2 Days"</span></div>
              <div>&#125;</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES */}
      <section id="features" className="py-20 bg-slate-50/80 border-b border-slate-100 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              จุดเด่นของ MyAPI
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              ฟีเจอร์การใช้งานครบครัน ตอบโจทย์นักพัฒนา
            </h2>
          </div>

          <div className="flex justify-center gap-2 border-b border-slate-200 pb-4">
            <button
              type="button"
              onClick={() => setActiveTab('label')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'label'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              ระบบสร้างใบปะหน้าอัตโนมัติ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tracking')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              ระบบติดตามพัสดุ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rate')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'rate'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              ระบบคำนวณค่าจัดส่ง
            </button>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {activeTab === 'label' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">สร้างใบปะหน้าอัตโนมัติในรูปแบบ PDF</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    สร้างไฟล์ PDF ใบปะหน้าได้ทันทีเมื่อคุณสร้างออเดอร์
                  </p>
                </div>
                <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 font-mono text-xs">
                  <div className="bg-white p-4 rounded-xl border border-slate-300 space-y-2">
                    <div className="border-b pb-2 flex justify-between font-bold">
                      <span>PARCEL LABEL</span>
                      <span className="text-red-600">EMS THAILAND POST</span>
                    </div>
                    <div className="text-[10px] text-slate-500">Tracking: EF901239845TH</div>
                    <div className="h-10 bg-slate-900 text-white text-[10px] flex items-center justify-center tracking-widest">
                      ||||||||||||||||||||||||||||||
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'tracking' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">ติดตามพัสดุ Real-time จากไปรษณีย์ไทย</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    ระบบดึงสถานะพัสดุอัตโนมัติและแจ้งเตือนกลับผ่าน Webhooks เมื่อมีอัปเดต เช่น พัสดุเข้าระบบ, อยู่ระหว่างจัดส่ง, หรือจัดส่งสำเร็จ
                  </p>
                </div>
                <div className="bg-slate-900 text-white p-6 rounded-2xl font-mono text-xs space-y-2">
                  <div className="text-emerald-400">// Webhook Payload Sent</div>
                  <div>"event": "shipment.updated"</div>
                  <div>"courier": "THAILAND_POST"</div>
                  <div>"status": "DELIVERED"</div>
                  <div>"timestamp": "2026-08-25T10:00:00Z"</div>
                </div>
              </>
            )}

            {activeTab === 'rate' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">คำนวณและเปรียบเทียบประเภทบริการ</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    เปรียบเทียบตัวเลือกบริการของไปรษณีย์ไทย เช่น EMS ด่วนพิเศษ หรือ พัสดุลงทะเบียน เพื่อเลือกตัวเลือกที่เหมาะสมที่สุด
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <div className="bg-white p-3 rounded-xl border flex justify-between items-center text-xs">
                    <span className="font-bold text-red-600">EMS Express</span>
                    <span className="text-emerald-600 font-bold">1-2 Business Days</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Registered Mail</span>
                    <span className="text-emerald-600 font-bold">3-5 Business Days</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-20 px-6 lg:px-16 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">
            คำถามที่พบบ่อย
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((faq, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center font-bold text-sm text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-blue-600 font-mono text-lg">{openFaq === idx ? '−' : '+'}</span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-500 leading-relaxed border-t border-slate-200/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT US */}
      <section id="contact-us" className="py-20 px-6 lg:px-16 max-w-6xl mx-auto border-t border-slate-100">
        <div className="bg-slate-50/50 rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">
                <span>Contact & Support</span>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                มีข้อสงสัยหรือต้องการปรึกษา <br />
                <span className="text-blue-600">ทีมงาน MyAPI ยินดีช่วยเหลือ</span>
              </h2>

              <p className="text-sm text-slate-500 leading-relaxed">
                ไม่ว่าคุณจะมีคำถามเกี่ยวกับ API หรือการเชื่อมต่อระบบกับ MyOrder ส่งข้อความหาเราได้ทันที
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="text-xs font-bold text-slate-900">อีเมลแผนกสนับสนุน</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">yada@myorder.ai</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">sukanya@myorder.ai</div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-900">เบอร์โทรศัพท์ (ฝ่ายบริการ)</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">064-431-6254 (จันทร์ - ศุกร์ 09:00 - 16:00 น.)</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl shadow-slate-200/40 space-y-5">
              <h3 className="text-xl font-bold text-slate-900">ส่งข้อความถึงทีมงาน</h3>

              {contactSubmitted && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold text-center">
                  ✓ ส่งข้อความเรียบร้อยแล้ว! ทีมงานจะติดต่อกลับโดยเร็วที่สุด
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-slate-700">ชื่อของคุณ *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={handleInputChange}
                      placeholder="สมชาย ใจดี"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-slate-700">อีเมลสำหรับติดต่อกลับ *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={handleInputChange}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-bold text-slate-700">หัวข้อสอบถาม *</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    placeholder="เช่น สอบถามการเชื่อมต่อ MyOrder API"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-slate-700">รายละเอียดข้อความ *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder="พิมพ์รายละเอียดที่คุณต้องการสอบถาม..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all text-center cursor-pointer"
                >
                  ส่งข้อความ
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER BANNER */}
      <section className="py-16 px-6 lg:px-16 max-w-6xl mx-auto">
        <div className="bg-blue-600 rounded-3xl p-10 sm:p-14 text-white text-center space-y-6 shadow-xl shadow-blue-200">
          <h2 className="text-3xl sm:text-4xl font-extrabold">
            พร้อมเชื่อมต่อระบบของคุณแล้วหรือยัง?
          </h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
            สมัครสมาชิกวันนี้ ทดลองยิง API ในสภาพแวดล้อม Sandbox ฟรีทันที
          </p>
          <div>
            <Link to="/signup" className="inline-block px-8 py-3.5 bg-white hover:bg-slate-100 text-blue-900 font-bold text-sm rounded-xl shadow-md transition-all">
              ลงทะเบียนใช้งานฟรี
            </Link>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-xs leading-relaxed border-b border-slate-800 pb-12">
          <div className="space-y-4">
            {/* โลโก้ MyAPI ตรง Footer */}
            <Link to="/" className="inline-block">
              <MyApiLogo className="h-7" />
            </Link>
            <p className="text-slate-500">
              แพลตฟอร์มโครงสร้างพื้นฐาน Open API สำหรับเชื่อมต่อระบบจัดการพัสดุ Logistics ในไทยแบบไร้รอยต่อ
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-white font-bold text-sm">ผลิตภัณฑ์</div>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Label Generator</li>
              <li className="hover:text-white cursor-pointer">Tracking API</li>
              <li className="hover:text-white cursor-pointer">Rate Calculator</li>
              <li className="hover:text-white cursor-pointer">MyOrder Connector</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-white font-bold text-sm">นักพัฒนา</div>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">API Documentation</li>
              <li className="hover:text-white cursor-pointer">SDKs & Libraries</li>
              <li className="hover:text-white cursor-pointer">System Status</li>
              <li className="hover:text-white cursor-pointer">API Changelog</li>
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-white font-bold text-sm">ข้อกำหนดและนโยบาย</div>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
              <li className="hover:text-white cursor-pointer">Security Overview</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>© 2026 MyAPI Inc. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
};  