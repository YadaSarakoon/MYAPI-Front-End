import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 px-6 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm">
              M
            </div>
            <span className="font-extrabold text-xl text-blue-900 tracking-tight">
              MyAPI
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-blue-600 transition-colors">ผลิตภัณฑ์</a>
            <a href="#solutions" className="hover:text-blue-600 transition-colors">โซลูชัน</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">ราคาบริการ</a>
            <Link to="/docs" className="hover:text-blue-600 transition-colors">นักพัฒนา (API)</Link>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all"
          >
            เริ่มต้นใช้งานฟรี
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold">
              <span>●</span>
              <span>Open API Platform for Logistics</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
              เชื่อมต่อทุกระบบจัดส่งพัสดุ <br />
              <span className="text-blue-600">ครบจบใน API เดียว</span>
            </h1>

            <p className="text-base text-slate-500 leading-relaxed max-w-xl font-normal">
              แพลตฟอร์มจัดการขนส่งไร้รอยต่อ ช่วยให้ธุรกิจ E-Commerce และนักพัฒนายึดโยงระบบขนส่ง สร้างใบลาเบล ติดตามสถานะ และคำนวณค่าบริการได้อย่างแม่นยำด้วยมาตรฐานความปลอดภัยระดับสูง
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all text-center"
              >
                สมัครใช้งานฟรี
              </Link>
              <Link
                to="/docs"
                className="w-full sm:w-auto px-7 py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl transition-all text-center"
              >
                ดูเอกสาร API Docs
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-100 max-w-md">
              <div>
                <div className="text-2xl font-extrabold text-blue-900">99.9%</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Uptime SLA</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-blue-600">&lt; 100ms</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Response Time</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-blue-900">10M+</div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">Shipments/Mo</div>
              </div>
            </div>
          </div>

          {/* Right Mobile UI Mockup Card (Flat Blue Style) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm bg-blue-600 rounded-[32px] p-6 text-white shadow-2xl shadow-blue-200 border-4 border-blue-500 space-y-5">
              
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-2 border-b border-blue-500/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center font-bold text-xs">
                    M
                  </div>
                  <span className="font-bold text-sm">Dashboard</span>
                </div>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium">Live</span>
              </div>

              {/* Mockup Card Component */}
              <div className="bg-white text-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">ภาพรวมวันนี้</div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-extrabold text-blue-900">1,480 พัสดุ</div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12.5%</span>
                </div>
                {/* Visual Bar Chart Mock */}
                <div className="flex items-end gap-1.5 h-16 pt-2">
                  <div className="flex-1 bg-blue-100 rounded-t h-[40%]"></div>
                  <div className="flex-1 bg-blue-100 rounded-t h-[65%]"></div>
                  <div className="flex-1 bg-blue-100 rounded-t h-[45%]"></div>
                  <div className="flex-1 bg-blue-600 rounded-t h-[100%]"></div>
                  <div className="flex-1 bg-blue-100 rounded-t h-[75%]"></div>
                  <div className="flex-1 bg-blue-100 rounded-t h-[55%]"></div>
                </div>
              </div>

              {/* Mockup Mini Items */}
              <div className="space-y-2">
                <div className="bg-blue-700/60 rounded-xl p-3 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>EX12345678TH</span>
                  </div>
                  <span className="text-blue-100">ส่งสำเร็จแล้ว</span>
                </div>
                <div className="bg-blue-700/60 rounded-xl p-3 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>EX87654321TH</span>
                  </div>
                  <span className="text-blue-100">กำลังจัดส่ง</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Features Grid (Clean Flat Cards) */}
      <section id="features" className="py-16 bg-slate-50 border-y border-slate-100 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              คุณสมบัติหลัก
            </h2>
            <p className="text-2xl md:text-3xl font-extrabold text-slate-900">
              ออกแบบเพื่อความเสถียร ใช้งานง่าย และปลอดภัย
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-extrabold">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">สร้างใบปะหน้าอัตโนมัติ</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                สร้างและพิมพ์ Tracking Number พร้อมบาร์โค้ดมาตรฐานได้ทันที รองรับเครื่องพิมพ์ความร้อนทุกรุ่น
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-extrabold">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">ระบบ Webhook แจ้งเตือน</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                ส่งสถานะการจัดส่งพัสดุตรงเข้าเซิร์ฟเวอร์ของคุณแบบ Real-time ไม่ต้องเขียนระบบดึงข้อมูลซ้ำซ้อน
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-extrabold">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">เปรียบเทียบค่าจัดส่ง</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                คำนวณและเลือกบริษัทขนส่งที่ให้ราคาและระยะเวลาคุ้มค่าที่สุดได้ทันทีก่อนกดยืนยันออเดอร์
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Simple Clean Footer */}
      <footer className="py-10 px-6 lg:px-16 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">
            M
          </div>
          <span className="font-bold text-slate-700">MyAPI Open API Platform</span>
        </div>
        <div>
          © 2026 MyAPI Inc. All rights reserved.
        </div>
      </footer>

    </div>
  );
};