import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // เมื่อสมัครสมาชิกสำเร็จ ให้พาไปหน้า Docs
    navigate('/docs');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between antialiased">
      
      {/* Top Header */}
      <header className="p-6 max-w-7xl w-full mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm">
            M
          </div>
          <span className="font-extrabold text-xl text-blue-900 tracking-tight">
            MyAPI
          </span>
        </Link>
        <span className="text-xs font-semibold text-slate-400">
          มีบัญชีผู้ใช้อยู่แล้ว?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            เข้าสู่ระบบ
          </Link>
        </span>
      </header>

      {/* Main Form Box */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/50 space-y-6">
          
          <div className="space-y-1 text-center">
            <h1 className="text-2xl font-black text-slate-900">สร้างบัญชีผู้ใช้ใหม่</h1>
            <p className="text-xs text-slate-400">เริ่มใช้งานฟรี รับ 1,000 API Credits ทันที</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">ชื่อ - นามสกุล หรือชื่อบริษัท</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>

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
              <label className="text-xs font-bold text-slate-700">รหัสผ่าน (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 8 ตัวอักษร"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all text-center mt-2"
            >
              ลงทะเบียนใช้งานฟรี
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
            className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <span>🌐</span> สมัครด้วย Google
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