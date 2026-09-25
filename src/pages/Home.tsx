import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import myImage from '../assets/pic2.png'; 
import myImage3 from '../assets/pic3.png'; 
import logoLight from '../assets/logoLight.png';
import logoDark from '../assets/logoDark.png';
import printImg from '../assets/print.png'; 
import parcelImg from '../assets/parcel.png'; 
import trackingImg from '../assets/tracking.png'; 
import allImg from '../assets/all.png'; 

// --- Interfaces & Types ---
interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface RegisterFormState {
  company: string;
  fullName: string;
  phone: string;
  email: string;
  website: string;
  courier: string;
}

type TabType = 'label' | 'print' | 'tracking';

interface FAQItem {
  q: string;
  a: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    q: 'มีค่าใช้จ่ายในการสมัครหรือค่าแรกเข้าสำหรับใช้งาน API หรือไม่?',
    a: 'คุณสามารถสมัครสมาชิกและเริ่มใช้งาน MyAPI ได้ฟรี ไม่มีค่าใช้จ่ายแรกเข้า และไม่มีค่าธรรมเนียมรายเดือนจะเรียกเก็บค่าใช้จ่ายเมื่อเริ่มส่งพัสดุจริงเท่านั้น',
  },
  {
    q: 'สมัครใช้งานแล้ว สามารถเริ่มทดสอบระบบได้ทันทีเลยไหม?',
    a: 'เมื่อสมัครสมาชิกแล้ว คุณสามารถเริ่มทดสอบยิง API ในสภาพแวดล้อม Sandbox ได้ทันที มีเอกสาร API Docs พร้อมตัวอย่างโค้ดให้คัดลอกได้ทันที',
  },
  {
    q: 'ใช้เวลานานเท่าไรในการทดสอบระบบ?',
    a: 'คุณสามารถสมัครสมาชิกและเริ่มทดสอบยิง API ในสภาพแวดล้อม Sandbox ได้ทันทีภายใน 5 นาที ',
  },
  {
    q: 'ถ้ายังไม่มีระบบของตัวเอง สามารถใช้งาน MyAPI ผ่านหน้าเว็บไซต์ได้หรือไม่?',
    a: 'ไม่จำเป็นต้องมีหน้าเว็บไซต์ของตัวเองแต่แนะนำว่าควรมีระบบหลังบ้านไว้เชื่อมต่อกับ MyAPI เพื่อให้สามารถสร้างใบปะหน้าและติดตามพัสดุได้อย่างอัตโนมัติ',
  },
  {
    q: 'MyAPI รองรับขนส่งอะไรบ้าง?',
    a: 'MyAPI รองรับขนส่งชั้นนำของไทย เช่น ไปรษณีย์ไทย (Thailand Post), Kerry Express, Flash Express, Ninja Van, J&T Express ',
  }
];

export const Home: React.FC = () => {
  // Feature Tabs State
  const [activeTab, setActiveTab] = useState<TabType>('label');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Register Form State
  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    company: '',
    fullName: '',
    phone: '',
    email: '',
    website: '',
    courier: '',
  });

  const handleRegisterInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTimeout(() => {
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
    /*  เปลี่ยนฟอนต์ของทั้งหน้าเป็น Kanit ตรงนี้  */
    <div className="min-h-screen bg-white text-slate-800 font-['Kanit'] antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Import Google Fonts */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&family=Sarabun:wght@300;400;500;600;700&family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

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
      ` }} />

      {/* 1. TOP NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* โลโก้ MyAPI */}
          <Link to="/" className="flex items-center">
            <img src={logoDark} alt="MyAPI Logo" className="h-8 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
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
          <Link 
            to="/login" 
            className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 border border-blue-600 px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="pt-24 pb-16 px-6 lg:px-16 max-w-6xl mx-auto text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.25] tracking-tight max-w-4xl mx-auto">
          MyAPI ระบบ API จัดการและติดตามพัสดุอัตโนมัติ <br />
          <span className="text-blue-600">ทรงพลัง และยืดหยุ่นที่สุด</span>
        </h1>

        <p className="text-base text-slate-500 max-w-5xl mx-auto leading-relaxed">
          เชื่อมต่อระบบจัดการคำสั่งซื้อของคุณเข้ากับบริการขนส่ง ออกใบปะหน้า สร้างเลข Tracking และดึงสถานะ Real-time ครบจบในในที่เดียว
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link to="/register" className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all text-center">
            เริ่มต้นใช้งานฟรี
          </Link>
          <Link to="/docs" className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-50 text-blue-600 font-bold text-sm rounded-xl border border-slate-200 shadow-sm transition-all text-center">
            คู่มือการใช้งาน
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
                    <text x="60" y="62" fill="#4B52B4" fontSize="52" fontFamily="Kanit, sans-serif" fontWeight="900">M</text>
                    <text x="116" y="62" fill="#F97316" fontSize="52" fontFamily="Kanit, sans-serif" fontWeight="900">Y</text>
                    <text x="180" y="62" fill="#334155" fontSize="44" fontFamily="Kanit, sans-serif" fontWeight="900" letterSpacing="-0.5">EXPRESS</text>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. HIGHLIGHT SECTION */}
      <div className="py-12 px-6 lg:px-16 max-w-5xl mx-auto flex flex-col justify-center items-center gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 text-center">
          จุดเด่นของเรา
        </h2>

        <img 
          src={myImage} 
          alt="จุดเด่นของเรา" 
          className="w-full max-w-4xl h-auto rounded-3xl shadow-lg object-cover" 
        />
      </div>

      {/* 5. FEATURES */}
      <section id="features" className="py-20 bg-slate-50/80 border-b border-slate-100 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900">
              ฟีเจอร์การใช้งานครบครัน ตอบโจทย์นักพัฒนา
            </h2>
          </div>

          {/* TAB BUTTONS */}
          <div className="flex justify-center gap-2 border-b border-slate-200 pb-4 flex-wrap">
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
              onClick={() => setActiveTab('print')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'print'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            >
              พิมพ์ใบปะหน้าพัสดุ
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

          {/* TAB CONTENTS */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* TAB 1: CREATE LABEL */}
            {activeTab === 'label' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">สร้างใบปะหน้าอัตโนมัติในรูปแบบ PDF</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    สร้างไฟล์ PDF ใบปะหน้าได้ทันทีเมื่อคุณสร้างออเดอร์
                  </p>
                </div>

                <div className="flex justify-center items-center">
                  <img
                    src={parcelImg}
                    alt="สร้างใบปะหน้าอัตโนมัติ PDF"
                    className="w-full max-w-md h-auto rounded-2xl shadow-md border border-slate-100 object-cover"
                  />
                </div>
              </>
            )}

            {/* TAB 2: PRINT LABEL */}
            {activeTab === 'print' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">พิมพ์ใบปะหน้าพัสดุได้อย่างรวดเร็ว</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    รองรับการสั่งพิมพ์ใบปะหน้าโดยตรงไปยังเครื่องพิมพ์สติกเกอร์ หรือเครื่องพิมพ์ความร้อน (Thermal Printer) ได้หลากหลายขนาด เช่น A6 หรือ Sticker Roll
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={printImg}
                    alt="พิมพ์ใบปะหน้าพัสดุ"
                    className="w-full max-w-md h-auto rounded-2xl shadow-md border border-slate-100 object-cover"
                  />
                </div>
              </>
            )}

            {/* TAB 3: TRACKING */}
            {activeTab === 'tracking' && (
              <>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">ติดตามพัสดุ Real-time</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    ระบบดึงสถานะพัสดุอัตโนมัติและแจ้งเตือนกลับผ่าน Webhooks เมื่อมีอัปเดต เช่น พัสดุเข้าระบบ, อยู่ระหว่างจัดส่ง, หรือจัดส่งสำเร็จ
                  </p>
                </div>
                <div className="flex justify-center items-center">
                  <img
                    src={trackingImg}
                    alt="ติดตามพัสดุ Real-time"
                    className="w-full max-w-md h-auto rounded-2xl shadow-md border border-slate-100 object-cover"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 6. IMAGE SECTIONS */}
      <div className="py-8 px-6 lg:px-16 max-w-5xl mx-auto flex flex-col justify-center items-center gap-4">
        <div className="w-full flex flex-col justify-center items-center gap-3">
          <h2 className="text-lg md:text-2xl font-bold text-slate-800 text-center">
            ทำไมต้องเลือก MyAPI
          </h2>

          <img 
            src={myImage3} 
            alt="ทำไมต้องเลือก MyAPI" 
            className="w-full max-w-5xl h-auto rounded-3xl shadow-lg object-cover"
          />
        </div>
      </div>

      {/* 7. FAQ SECTION */}
      <section id="faq" className="pt-4 pb-16 px-6 lg:px-16 max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
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

     {/* ALL-IN-ONE IMAGE */}
<div className="py-8 px-6 lg:px-16 max-w-6xl mx-auto flex justify-center items-center">
  <img 
    src={allImg} 
    alt="MyAPI Overview" 
    className="w-full max-w-3xl h-auto rounded-3xl shadow-lg border border-slate-100 object-cover" 
  />
</div>

      {/* 8. CONTACT FORM */}
      <div id="contact-us" className="max-w-3xl mx-auto bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-100 mb-16">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            เริ่มเชื่อมต่อ API กับ MyAPI ตอนนี้
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            กรอกรายละเอียดข้อมูลของคุณ เพื่อให้เราติดต่อกลับหาคุณ
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="company"
              value={registerForm.company}
              onChange={handleRegisterInputChange}
              placeholder="ชื่อบริษัท (ไม่บังคับ)"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
            <input
              type="text"
              name="fullName"
              required
              value={registerForm.fullName}
              onChange={handleRegisterInputChange}
              placeholder="ชื่อ - นามสกุล"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="tel"
              name="phone"
              required
              value={registerForm.phone}
              onChange={handleRegisterInputChange}
              placeholder="เบอร์โทรติดต่อ"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
            <input
              type="email"
              name="email"
              required
              value={registerForm.email}
              onChange={handleRegisterInputChange}
              placeholder="อีเมล"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="url"
              name="website"
              value={registerForm.website}
              onChange={handleRegisterInputChange}
              placeholder="เว็บไซต์ของคุณ (ไม่บังคับ)"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
            <input
              type="text"
              name="courier"
              value={registerForm.courier}
              onChange={handleRegisterInputChange}
              placeholder="ขนส่งที่สนใจจะเปิดใช้งาน"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="px-10 py-3.5 bg-[#0099FF] hover:bg-sky-600 text-white font-bold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              ส่งข้อมูลให้ทีมงาน
            </button>
          </div>
        </form>
      </div>

      {/* 9. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 lg:px-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src={logoLight} alt="MyAPI Logo" className="h-6 w-auto object-contain" />
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