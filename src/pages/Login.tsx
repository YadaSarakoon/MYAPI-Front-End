import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

import { auth } from '../config/firebase';

// --- Component: MyAPI SVG Logo ---
const MyApiLogo: React.FC<{ className?: string }> = ({
  className = 'h-8',
}) => (
  <svg
    viewBox="0 0 280 85"
    className={`${className} w-auto overflow-visible`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* My */}
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

    {/* A */}
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

    {/* PI */}
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

    {/* Gradients */}
    <defs>
      <linearGradient
        id="myapi_cyan_gradient_login"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#00E5FF" />
        <stop offset="100%" stopColor="#0088FF" />
      </linearGradient>

      <linearGradient
        id="myapi_dot_gradient_login"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
      >
        <stop offset="0%" stopColor="#00B2FF" />
        <stop offset="100%" stopColor="#0055FF" />
      </linearGradient>

      <linearGradient
        id="myapi_pi_gradient_login"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
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

  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  // ==========================================
  // Login ด้วย Email / Password
  // ==========================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ตอนนี้ยังเป็น Mock Login
    // สามารถเชื่อม Backend จริงภายหลังได้
    navigate('/docs');
  };

  // ==========================================
  // Login ด้วย Google
  // ==========================================
  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError('');

      // สร้าง Google Provider
      const provider = new GoogleAuthProvider();

      // เปิด Google Login Popup
      const result = await signInWithPopup(auth, provider);

      // ข้อมูล User ที่ Login สำเร็จ
      const user = result.user;

      console.log('Google Login สำเร็จ');
      console.log('User:', user);
      console.log('Email:', user.email);
      console.log('Name:', user.displayName);
      console.log('Photo:', user.photoURL);

      // Login สำเร็จ → ไปหน้า Docs
      navigate('/docs');

    } catch (error) {
      console.error('Google Login Error:', error);

      setGoogleError(
        'ไม่สามารถเข้าสู่ระบบด้วย Google ได้ กรุณาลองใหม่อีกครั้ง'
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Prompt'] flex flex-col justify-between antialiased selection:bg-blue-600 selection:text-white">

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&family=Prompt:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* ==========================================
          Top Header
      ========================================== */}
      <header className="p-6 max-w-7xl w-full mx-auto flex justify-between items-center">

        <Link to="/" className="flex items-center">
          <MyApiLogo className="h-8" />
        </Link>

        <span className="text-xs font-semibold text-slate-400">
          ยังไม่มีบัญชีผู้ใช้?{' '}

          <Link
            to="/signup"
            className="text-blue-600 font-bold hover:underline ml-1"
          >
            สมัครสมาชิก
          </Link>
        </span>

      </header>

      {/* ==========================================
          Main Login
      ========================================== */}
      <main className="flex-1 flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-6">

          {/* Title */}
          <div className="space-y-1 text-center">

            <h1 className="text-2xl font-black text-slate-900">
              ยินดีต้อนรับกลับมา
            </h1>

            <p className="text-xs text-slate-400">
              เข้าสู่ระบบเพื่อจัดการ API Key และบริการขนส่งของคุณ
            </p>

          </div>

          {/* ==========================================
              Email / Password Login
          ========================================== */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Email */}
            <div className="space-y-1.5">

              <label className="text-xs font-bold text-slate-700">
                อีเมล (Email)
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />

            </div>

            {/* Password */}
            <div className="space-y-1.5">

              <div className="flex justify-between items-center">

                <label className="text-xs font-bold text-slate-700">
                  รหัสผ่าน (Password)
                </label>

                <a
                  href="#"
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  ลืมรหัสผ่าน?
                </a>

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

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all text-center mt-2 cursor-pointer"
            >
              เข้าสู่ระบบ
            </button>

          </form>

          {/* ==========================================
              Divider
          ========================================== */}
          <div className="relative flex items-center justify-center my-4">

            <div className="border-t border-slate-100 w-full" />

            <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider absolute">
              หรือ
            </span>

          </div>

          {/* ==========================================
              Google Error
          ========================================== */}
          {googleError && (
            <div className="text-center text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {googleError}
            </div>
          )}

          {/* ==========================================
              Google Login
          ========================================== */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className={`w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-3 transition-colors ${
              googleLoading
                ? 'opacity-60 cursor-not-allowed'
                : 'cursor-pointer'
            }`}
          >

            {googleLoading ? (
              <>
                {/* Loading Spinner */}
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >

                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="opacity-25"
                  />

                  <path
                    d="M21 12a9 9 0 0 1-9 9"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                </svg>

                กำลังเข้าสู่ระบบ...
              </>

            ) : (

              <>
                {/* Google Logo */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >

                  <path
                    fill="#4285F4"
                    d="M21.35 12.23c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.6z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M6.54 13.7a5.86 5.86 0 0 1 0-3.73V7.44H3.3a9.75 9.75 0 0 0 0 8.78l3.24-2.52z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 5.94c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.02 14.62 2.1 12 2.1a9.75 9.75 0 0 0-8.7 5.34l3.24 2.53C7.31 7.66 9.46 5.94 12 5.94z"
                  />

                </svg>

                เข้าสู่ระบบด้วย Google Account
              </>

            )}

          </button>

        </div>

      </main>

      {/* ==========================================
          Footer
      ========================================== */}
      <footer className="py-6 text-center text-xs text-slate-400">
        © 2026 MyAPI Inc. All rights reserved.
      </footer>

    </div>
  );
};