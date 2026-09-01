import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// --- Component: MyAPI SVG Logo ---
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

    {/* ไอคอนตัว A ทรงเส้นมนโค้ง */}
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

// --- Visual components for the API ecosystem section ---
const WorkflowIcon: React.FC<{ type: 'link' | 'bot' | 'chart' | 'code' }> = ({ type }) => {
  const drawings = {
    link: <><path d="M9 15l-2 2a4 4 0 005.7 5.6l2-2"/><path d="M15 9l2-2a4 4 0 00-5.7-5.6l-2 2"/><path d="M8 16l8-8"/></>,
    bot: <><rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 4v4M8.5 13h.01M15.5 13h.01M9 17h6"/></>,
    chart: <><path d="M5 19V10M12 19V5M19 19v-7"/><path d="M3 21h18"/></>,
    code: <><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14"/></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{drawings[type]}</svg>;
};

const FeatureTile: React.FC<{ title: string; copy: string; icon: 'link' | 'bot' | 'chart' | 'code'; reverse?: boolean }> = ({ title, copy, icon, reverse }) => (
  <article className={`flex items-center gap-4 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${reverse ? 'xl:flex-row-reverse xl:text-right' : ''}`}>
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-500"><WorkflowIcon type={icon} /></div>
    <div><h3 className="font-bold text-slate-800">{title}</h3><p className="mt-1 text-xs leading-relaxed text-slate-500">{copy}</p></div>
  </article>
);

const ShipmentAutomationArt: React.FC = () => (
  <svg viewBox="0 0 640 440" className="w-full" role="img" aria-label="ภาพประกอบระบบจัดส่งอัตโนมัติ">
    <defs>
      <linearGradient id="artBlue" x1="210" y1="60" x2="430" y2="360" gradientUnits="userSpaceOnUse"><stop stopColor="#38BDF8"/><stop offset="1" stopColor="#2563EB"/></linearGradient>
      <linearGradient id="artBox" x1="78" y1="150" x2="180" y2="250" gradientUnits="userSpaceOnUse"><stop stopColor="#FCD34D"/><stop offset="1" stopColor="#FB923C"/></linearGradient>
      <filter id="artShadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#1D4ED8" floodOpacity=".16"/></filter>
    </defs>
    <rect width="640" height="440" rx="42" fill="#F3FAFF"/>
    <circle cx="82" cy="72" r="58" fill="#DBF1FF"/><circle cx="570" cy="370" r="76" fill="#DBF1FF"/>
    <path d="M155 190C218 87 300 88 365 152C429 216 500 164 554 113" stroke="#93DDFE" strokeWidth="5" strokeDasharray="3 15" strokeLinecap="round"/>
    <path d="M164 246C238 356 326 348 401 290C462 244 519 275 560 322" stroke="#B7E5FF" strokeWidth="5" strokeDasharray="3 15" strokeLinecap="round"/>
    <g filter="url(#artShadow)">
      <rect x="205" y="70" width="236" height="255" rx="28" fill="white"/>
      <path d="M205 98a28 28 0 0128-28h180a28 28 0 0128 28v45H205V98Z" fill="url(#artBlue)"/>
      <circle cx="239" cy="106" r="7" fill="white" fillOpacity=".8"/><circle cx="262" cy="106" r="7" fill="white" fillOpacity=".5"/><circle cx="285" cy="106" r="7" fill="white" fillOpacity=".3"/>
      <rect x="230" y="167" width="187" height="57" rx="15" fill="#EFF9FF"/><rect x="250" y="187" width="68" height="9" rx="4.5" fill="#69C9F6"/><rect x="250" y="205" width="90" height="7" rx="3.5" fill="#BDDFF2"/>
      <path d="M370 190l10 10 19-21" stroke="#2587E5" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="230" y="240" width="187" height="61" rx="15" fill="#F8FBFE"/><rect x="250" y="260" width="40" height="23" rx="7" fill="#DDF3FF"/><path d="M260 272h20M270 262v20" stroke="#269BE8" strokeWidth="3.5" strokeLinecap="round"/>
      <rect x="307" y="258" width="78" height="8" rx="4" fill="#70C9F4"/><rect x="307" y="276" width="55" height="6" rx="3" fill="#C7E3F4"/>
    </g>
    <g filter="url(#artShadow)"><rect x="48" y="148" width="121" height="113" rx="22" fill="white"/><rect x="68" y="171" width="81" height="48" rx="12" fill="url(#artBox)"/><path d="M68 187l40 18 41-18M108 205v14" stroke="white" strokeWidth="4" strokeLinejoin="round"/><rect x="68" y="234" width="50" height="6" rx="3" fill="#9AD4F1"/></g>
    <g filter="url(#artShadow)"><rect x="480" y="116" width="112" height="95" rx="22" fill="white"/><rect x="498" y="140" width="76" height="41" rx="10" fill="#EAF8FF"/><path d="M510 169c7-19 21-26 34-16 10 7 10 19 20 11" stroke="#32A6EE" strokeWidth="4.5" strokeLinecap="round"/><circle cx="510" cy="169" r="5" fill="#258FE5"/><circle cx="564" cy="164" r="5" fill="#258FE5"/></g>
    <g filter="url(#artShadow)"><circle cx="118" cy="349" r="53" fill="white"/><circle cx="118" cy="349" r="34" fill="#E8F7FF"/><circle cx="118" cy="329" r="12" fill="#FFB64C"/><path d="M96 366c0-15 10-26 22-26s22 11 22 26" fill="#2498EA"/></g>
    <g fill="#2B9CEB"><circle cx="171" cy="190" r="7"/><circle cx="470" cy="146" r="7"/><circle cx="179" cy="266" r="7"/></g>
  </svg>
);

// --- Interfaces & Types ---
interface RegisterFormState {
  company: string;
  fullName: string;
  phone: string;
  email: string;
  website: string;
  courier: string;
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

  // Form Tab State ('contact' | 'register')
  const [activeFormTab, setActiveFormTab] = useState<'contact' | 'register'>('contact');

  // Goship Register Form State
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    company: '',
    fullName: '',
    phone: '',
    email: '',
    website: '',
    courier: '',
  });
  const [registerSubmitted, setRegisterSubmitted] = useState<boolean>(false);

  // Form Handlers
  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterSubmitted(true);
    setTimeout(() => {
      setRegisterSubmitted(false);
      setRegisterForm({
        company: '',
        fullName: '',
        phone: '',
        email: '',
        website: '',
        courier: '',
      });
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

      {/* 4. SHIPPING AUTOMATION VISUAL */}
      <section className="px-6 py-14 lg:px-16">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 shadow-xl shadow-sky-100/60">
          <div className="grid items-center gap-8 p-7 md:p-10 lg:grid-cols-[.88fr_1.12fr] lg:p-14">
            <div className="space-y-5">
              <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-600">SMART SHIPPING PLATFORM</span>
              <h2 className="text-3xl font-extrabold leading-tight text-slate-900">ทุกสถานะจัดส่ง<br /><span className="text-sky-500">เห็นภาพในที่เดียว</span></h2>
              <p className="text-sm leading-relaxed text-slate-500">เชื่อมออเดอร์ ตรวจสอบสถานะ และส่งข้อมูลให้ทีมงานหรือลูกค้าได้แบบอัตโนมัติ</p>
              <Link to="/signup" className="inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700">เริ่มเชื่อมต่อระบบ</Link>
            </div>
            <ShipmentAutomationArt />
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

      {/* API OPEN & AUTOMATION SECTION */}
      <section className="px-6 py-20 lg:px-16">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sky-500">OPEN API ECOSYSTEM</span>
            <h2 className="text-3xl font-extrabold text-slate-900">ยกระดับธุรกิจและระบบจัดส่งด้วย<br /><span className="text-sky-500">MyAPI Open API</span></h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-500">เชื่อมต่อทุกข้อมูลการจัดส่งสู่ระบบที่คุณใช้อยู่ได้อย่างเป็นหนึ่งเดียว</p>
          </div>

          <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1.05fr_1fr] xl:gap-8">
            <div className="space-y-4">
              <FeatureTile reverse title="เชื่อมต่อแบบไร้รอยต่อ" copy="เชื่อมต่อระบบอัตโนมัติ n8n, Make และขนส่งของคุณได้อย่างสมบูรณ์แบบ" icon="link" />
              <FeatureTile reverse title="สาย No-Code ก็ใช้ได้" copy="ตั้งค่าระบบอัตโนมัติได้รวดเร็ว โดยไม่ต้องพึ่งการเขียนโค้ดที่ซับซ้อน" icon="bot" />
            </div>
            <div className="relative mx-auto flex h-64 w-64 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-sky-400 to-blue-600 shadow-2xl shadow-blue-200/80 ring-8 ring-sky-50">
              <div className="absolute inset-5 rounded-[1.8rem] border border-white/30" />
              <span className="relative text-5xl font-black tracking-tight text-white">API</span>
              <span className="absolute -bottom-5 -right-5 grid h-16 w-16 place-items-center rounded-2xl bg-amber-300 text-2xl shadow-lg">⚙</span>
            </div>
            <div className="space-y-4">
              <FeatureTile title="รวมข้อมูลไว้ที่เดียว" copy="จัดการข้อมูลการจัดส่งแบบ Real-time เพิ่มประสิทธิภาพและลดต้นทุน" icon="chart" />
              <FeatureTile title="เป็นมิตรกับนักพัฒนา" copy="เชื่อมต่อง่ายด้วย RESTful API และ Webhook พร้อมเอกสารเริ่มต้นใช้งาน" icon="code" />
            </div>
          </div>

          <div className="grid items-center gap-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-8 lg:grid-cols-2 lg:p-12">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-blue-600 shadow-sm"><span className="grid h-5 w-5 place-items-center rounded-full bg-blue-100">✦</span> Automation ready</span>
              <h3 className="text-3xl font-extrabold text-blue-950">Connect API <span className="text-sky-500">→</span> AI Chat Agent</h3>
              <p className="text-sm leading-relaxed text-slate-600">เชื่อม MyAPI เข้ากับ AI Chat Agent ผ่าน n8n หรือ Make ให้ตอบคำถามลูกค้าและดึงข้อมูลหลังบ้านแบบ Real-time</p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-slate-700">n8n Automation</span>
                <span className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-slate-700">Make Drag & Drop</span>
                <span className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-bold text-slate-700">Live Tracking</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 shadow-xl shadow-blue-200">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-sky-400/20 blur-2xl" />
              <div className="relative space-y-3 text-sm">
                <div className="ml-auto w-[82%] rounded-2xl rounded-tr-sm bg-blue-500 px-4 py-3 text-white">พัสดุของฉันอยู่ที่ไหน?</div>
                <div className="w-[90%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-slate-700 shadow-sm"><p>กำลังนำจ่ายวันนี้</p><p className="mt-1 text-xs text-slate-400">Tracking: EF889127394TH</p></div>
                <div className="flex items-center gap-2 pl-1 text-xs text-sky-300"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />ดึงข้อมูลจาก MyAPI สำเร็จ</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHIPPING API GATEWAY & 8 CARDS GRID */}
      <section className="py-20 bg-slate-50/50 border-y border-slate-100 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="text-xs font-bold text-red-600 uppercase tracking-widest">
              ยกระดับระบบขนส่งออนไลน์
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              เชื่อมต่อขนส่งมากที่สุดในประเทศไทย
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              ให้คุณเชื่อมต่อกับทุกขนส่งได้ง่าย ผ่าน API Shipping Gateway ของเรา ได้รวบรวมทุกขนส่งในราคาพิเศษมาให้เรียบร้อยแล้ว <br />
              มี API Documentation พร้อมใช้งาน ใช้งานง่าย ลดความผิดพลาด ไม่ต้องสร้างรายการ หรือ Import Export ไฟล์ให้เสียเวลา <br />
              นอกจากนี้ ยังรองรับ ระบบแสดงสถานะการจัดส่งอัตโนมัติ ระบบแจ้งเตือน ระบบตรวจสอบการจัดส่ง พร้อมรายงานอย่างครบถ้วน
            </p>
            <div className="text-sm font-bold text-red-600 pt-2">
              เพียงเชื่อมต่อ API MyAPI สมัครใช้บริการได้แล้ว วันนี้!! พร้อมให้คำแนะนำตลอดการใช้งาน
            </div>
          </div>

          {/* Grid 8 Card Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-bold text-xl">
                ⚖️
              </div>
              <h3 className="font-bold text-slate-900 text-xs">
                เปรียบเทียบค่าจัดส่ง เช็คราคาขนส่งทั่วไทย
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                เช็คราคาได้ทุกขนส่งเลือกบริการที่ต้องการ รองรับบริการทุกขนส่งทั่วไทย
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xl">
                📋
              </div>
              <h3 className="font-bold text-slate-900 text-xs">
                สร้างรายการเรียกรถเข้ารับพัสดุ
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                สร้างรายการจัดส่ง สร้างใบปะหน้าและบาร์โค้ด และสร้างบุ๊คกิ้งเรียกรถเข้ารับได้ทันที
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl">
                🔍
              </div>
              <h3 className="font-bold text-slate-900 text-xs">
                ติดตามพัสดุ ได้ตลอด 24 ชั่วโมง
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                มีระบบติดตามพัสดุอัปเดตสถานะแบบ Real-time แจ้งเตือนสถานะพัสดุตรงเข้าสู่ระบบของคุณ
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold text-xl">
                💰
              </div>
              <h3 className="font-bold text-slate-900 text-xs">
                บริการเก็บเงินปลายทาง (COD)
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                รองรับระบบ COD โอนเงินเข้าบัญชีอย่างรวดเร็ว พร้อมรายงานสรุปยอดชัดเจน
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 font-bold text-xl">
                🏷️
              </div>
              <h3 className="font-bold text-slate-900 text-xs">
                พิมพ์ใบปะหน้ามาตรฐาน
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                รองรับการพิมพ์ใบปะหน้าทุกขนาด ทั้งกระดาษสติ๊กเกอร์ A4, A6 และเครื่องพิมพ์ความร้อน
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 font-bold text-xl">
                ⚡
              </div>
              <h3 className="font-bold text-slate-900 text-xs">
                Webhooks แจ้งเตือนทันที
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                ส่งข้อมูลสถานะพัสดุกลับไปยัง Server ของคุณโดยอัตโนมัติเมื่อมีการเปลี่ยนแปลง
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                🛡️
              </div>
              <h3 className="font-bold text-slate-900 text-xs">
                ระบบปลอดภัยมาตรฐานสูง
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                รักษาความปลอดภัยด้วย API Key, Token Authentication และการเข้ารหัสข้อมูล SSL
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-sky-200 shadow-sm text-center space-y-3 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-bold text-xl">
                🎧
              </div>
              <h3 className="font-bold text-slate-900 text-xs">
                ทีมงานดูแลและให้คำปรึกษา
              </h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                มีทีมซัพพอร์ตผู้เชี่ยวชาญพร้อมคอยช่วยเหลือตอบคำถามการเชื่อมต่อตลอดเวลาทำการ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 px-6 lg:px-16 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="text-xs font-bold text-blue-600 uppercase tracking-widest">
            FAQ
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            คำถามที่พบบ่อย
          </h2>
        </div>

        <div className="space-y-4">
          {FAQ_DATA.map((item, index) => (
            <div
              key={index}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full text-left p-5 font-bold text-sm text-slate-900 flex justify-between items-center bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <span>{item.q}</span>
                <span className="text-blue-600 font-bold text-lg">
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>
              {openFaq === index && (
                <div className="p-5 pt-0 text-xs text-slate-500 leading-relaxed bg-white border-t border-slate-100">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* COMBINED CONTACT & REGISTER SECTION */}
      <section id="contact-us" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans">
        <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* ฝั่งซ้าย: ข้อมูลติดต่อ & จุดเด่นระบบ */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold">
                <span>Contact & Support</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                มีข้อสงสัยหรือต้องการ <br className="hidden sm:inline" />
                ปรึกษา <span className="text-blue-600">ทีมงาน MyAPI ยินดีช่วยเหลือ</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                ไม่ว่าคุณจะมีคำถามเกี่ยวกับ API หรือการเชื่อมต่อระบบกับ MyOrder ส่งข้อความหาเราได้ทันที
              </p>

              {/* ข้อมูลการติดต่อ */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-900">อีเมลแผนกสนับสนุน</div>
                  <div className="text-xs text-slate-500 mt-1">yada@myorder.ai</div>
                  <div className="text-xs text-slate-500">sukanya@myorder.ai</div>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-900">เบอร์โทรศัพท์ (ฝ่ายบริการ)</div>
                  <div className="text-xs text-slate-500 mt-1">
                    064-431-6254 (จันทร์ - ศุกร์ 09:00 - 16:00 น.)
                  </div>
                </div>
              </div>

              {/* ฟีเจอร์หลัก (ขนส่ง) */}
              <div className="pt-4 border-t border-slate-200 space-y-2.5">
                <div className="text-xs font-bold text-blue-600 mb-2">รองรับทุกฟังก์ชันขนส่ง</div>
                {[
                  'สามารถเชื่อมต่อคำสั่งซื้อได้ไม่จำกัดรายการ',
                  'สามารถใช้ Sandbox เพื่อทดลองการเชื่อมต่อระบบได้ฟรี',
                  'Sandbox Key',
                  'Production Key',
                  'Postman Collection (JSON Document API)',
                  'ตัวอย่างการเชื่อมต่อ Postman',
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <span className="text-blue-500 font-bold">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ฝั่งขวา: TAB SWITCHER สลับฟอร์ม */}
            <div className="lg:col-span-7">
              
              {/* Tab Controls */}
              <div className="flex bg-slate-200/80 p-1.5 rounded-2xl mb-4 gap-1">
               
                <button
                  type="button"
                  onClick={() => setActiveFormTab('register')}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                    activeFormTab === 'register'
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  สมัครใช้บริการ API
                </button>
              </div>
              {/* FORM 2: สมัครใช้บริการ API Goship | Gosell */}
              {activeFormTab === 'register' && (
                <div className="bg-[#00A3E0] rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold">
                      สมัครใช้บริการ API Goship | Gosell
                    </h3>
                    <p className="text-[11px] text-sky-100">
                      ยกระดับการทำงานรวมเป็นหนึ่งเดียว ด้วย API กับเรา ตอบสนองรวดเร็ว
                    </p>
                  </div>

                  {registerSubmitted && (
                    <div className="p-3 bg-amber-400 text-slate-900 rounded-xl text-xs font-bold text-center">
                      ✓ ส่งข้อมูลสมัครเรียบร้อยแล้ว! เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="company"
                        value={registerForm.company}
                        onChange={handleRegisterInputChange}
                        placeholder="ชื่อบริษัท (ไม่บังคับ)"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={registerForm.fullName}
                        onChange={handleRegisterInputChange}
                        placeholder="ชื่อ - นามสกุล *"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={registerForm.phone}
                        onChange={handleRegisterInputChange}
                        placeholder="เบอร์โทร *"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs focus:outline-none"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        value={registerForm.email}
                        onChange={handleRegisterInputChange}
                        placeholder="อีเมล *"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="url"
                        name="website"
                        value={registerForm.website}
                        onChange={handleRegisterInputChange}
                        placeholder="เว็บไซต์ของคุณ (ไม่บังคับ)"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs focus:outline-none"
                      />
                      <input
                        type="text"
                        name="courier"
                        value={registerForm.courier}
                        onChange={handleRegisterInputChange}
                        placeholder="ขนส่งที่สนใจเปิดใช้งาน"
                        className="w-full px-3.5 py-2.5 bg-white text-slate-800 placeholder-slate-400 rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div className="pt-2 flex justify-center">
                      <button
                        type="submit"
                        className="w-full sm:w-auto px-10 py-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
                      >
                        ยืนยันส่งข้อมูล
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 lg:px-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <MyApiLogo className="h-6" />
            <span className="text-xs text-slate-500">© 2026 MyAPI. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-xs">
            <a href="#features" className="hover:text-white transition-colors">ฟีเจอร์</a>
            <a href="#faq" className="hover:text-white transition-colors">คำถามที่พบบ่อย</a>
            <a href="#contact-us" className="hover:text-white transition-colors">ติดต่อเรา</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home; 

