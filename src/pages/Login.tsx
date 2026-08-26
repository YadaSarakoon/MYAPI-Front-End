import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- Component: MyAPI SVG Logo (ใช้ตัว A ทรงเส้นมนโค้งตรงตามหน้าแรก) ---
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
        stroke="url(#myapi_cyan_gradient_login)"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle 
        cx="41" 
        cy="45" 
        r="7.5" 
        fill="url(#myapi_dot_gradient_login)" 
      />
    </g>

    {/* คำว่า "PI" สีฟ้าสด */}
    <text
      x="196"
      y="64"
      fill="url(#myapi_pi_gradient_login)"
      fontSize="66"
      fontFamily="Inter, system-ui, -apple-system, sans-serif"
      fontWeight="900"
      letterSpacing="-0.5"
    >
      PI
    </text>

    {/* ไล่เฉดสี */}
    <defs>
      <linearGradient id="myapi_cyan_gradient_login" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#0088FF" />
      </linearGradient>

      <linearGradient id="myapi_dot_gradient_login" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#00B2FF" />
        <stop offset="100%" stopColor="#0055FF" />
      </linearGradient>

      <linearGradient id="myapi_pi_gradient_login" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0077FF" />
        <stop offset="100%" stopColor="#0044CC" />
      </linearGradient>
    </defs>
  </svg>
);

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // เมื่อเข้าสู่ระบบสำเร็จ ให้พาไปหน้า Docs
    navigate('/docs');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Prompt'] flex flex-col justify-between antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Import Google Fonts ให้ตรงกับหน้าแรก */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Top Header */}
      <header className="p-6 max-w-7xl w-full mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <MyApiLogo className="h-8" />
        </Link>
        
        <span className="text-xs font-semibold text-slate-400">
          ยังไม่มีบัญชีผู้ใช้?{' '}
          <Link to="/signup" className="text-blue-600 font-bold hover:underline ml-1">
            สมัครสมาชิก
          </Link>
        </span>
      </header>

      {/* Main Form Box */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-6">
          
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-black text-slate-900">ยินดีต้อนรับกลับมา</h1>
            <p className="text-xs text-slate-400">เข้าสู่ระบบเพื่อจัดการ API Key และบริการขนส่งของคุณ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">อีเมล (Email)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700">รหัสผ่าน (Password)</label>
                <a href="#" className="text-[11px] font-semibold text-blue-600 hover:underline">ลืมรหัสผ่าน?</a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all text-center mt-2 cursor-pointer"
            >
              เข้าสู่ระบบ
            </button>
          </form>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-100 w-full"></div>
            <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider absolute">
              หรือ
            </span>
          </div>

          <button
            type="button"
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span></span> เข้าสู่ระบบด้วย Google Account
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-slate-400">
        © 2026 MyAPI Inc. All rights reserved.
      </footer>

    </div>
  );
};