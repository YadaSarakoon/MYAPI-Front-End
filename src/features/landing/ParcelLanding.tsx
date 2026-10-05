import { useLandingLanguage } from './landing-language-context';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Box, CodeXml, KeyRound, Menu, UserRound, X } from 'lucide-react';
import logo from '../../assets/logoDark.png';
import journey from '../../assets/landing/shipping-journey.png';
import connection from '../../assets/landing/api-connection.png';
import './parcel-landing.css';

const benefits = [
  ['สร้างใบปะหน้า', 'สร้างและพิมพ์ใบปะหน้าพัสดุ', 'ผ่าน API ได้ง่าย'],
  ['พิมพ์และจัดส่ง', 'นำใบปะหน้าไปพิมพ์และจัดส่ง', 'กับขนส่งที่คุณใช้งาน'],
  ['ติดตามสถานะ', 'ตรวจสอบสถานะพัสดุ', 'และรับข้อมูลผ่าน Webhook'],
];

const steps = [
  { icon: UserRound, title: 'สมัครใช้งาน', detail: 'สร้างบัญชี MyAPI สำหรับทีมของคุณ', color: 'mint', to: '/signup' },
  { icon: KeyRound, title: 'รับ API Key', detail: 'ตั้งค่าการเชื่อมต่อกับระบบของคุณ', color: 'lilac', to: '/docs' },
  { icon: CodeXml, title: 'ทดสอบ Sandbox', detail: 'ทดลองให้พร้อมก่อนเริ่มใช้งานจริง', color: 'peach', to: '/sandbox' },
  { icon: Box, title: 'เริ่มจัดส่ง', detail: 'เชื่อมต่อระบบและสร้างใบปะหน้า', color: 'ice', to: '/docs' },
];

export function ParcelLanding() {
  const { t, language, setLanguage } = useLandingLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return <div className="parcel-landing">
    <a className="parcel-skip" href="#parcel-main">{t("ข้ามไปเนื้อหา")}</a>
    <header className="parcel-header">
      <Link to="/" aria-label={t("MyAPI หน้าแรก")}><img className="parcel-logo" src={logo} alt="MyAPI" width="160" height="64" /></Link>
      <nav className="parcel-desktop-nav" aria-label={t("เมนูหลัก")}>
        <a href="#features">{t("ฟีเจอร์")}</a><a href="#workflow">{t("วิธีใช้งาน")}</a><Link to="/docs">{t("เอกสาร API")}</Link>
      </nav>
      <div className="parcel-header-actions">
        <div className="parcel-language" role="group" aria-label={language === "th" ? "เลือกภาษา" : "Select language"}>{(["th", "en"] as const).map((value) => <button key={value} type="button" aria-pressed={language === value} onClick={() => setLanguage(value)}>{value.toUpperCase()}</button>)}</div>
        <Link className="parcel-login" to="/login">{t("เข้าสู่ระบบ")}</Link>
        <Link className="parcel-button parcel-header-cta" to="/signup">{t("เริ่มใช้งานฟรี")}<ArrowRight size={18} aria-hidden="true" /></Link>
        <button className="parcel-menu-toggle" type="button" aria-label={t(menuOpen ? 'ปิดเมนู' : 'เปิดเมนู')} aria-expanded={menuOpen} aria-controls="parcel-mobile-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
      {menuOpen && <nav id="parcel-mobile-nav" className="parcel-mobile-nav" aria-label={t("เมนูมือถือ")} onKeyDown={(event) => { if (event.key === 'Escape') closeMenu(); }}>
        <a href="#features" onClick={closeMenu}>{t("ฟีเจอร์")}</a><a href="#workflow" onClick={closeMenu}>{t("วิธีใช้งาน")}</a><Link to="/docs" onClick={closeMenu}>{t("เอกสาร API")}</Link><Link to="/login" onClick={closeMenu}>{t("เข้าสู่ระบบ")}</Link>
      </nav>}
    </header>

    <section className="parcel-hero" id="parcel-main" aria-labelledby="parcel-title">
      <div className="parcel-hero-copy">
        <h1 id="parcel-title">{t("เรื่องส่งของ")}<br /><span>{t("ให้ MyAPI จัดการ")}</span></h1>
        <p>{t("สร้างใบปะหน้า ติดตามพัสดุ เชื่อมต่อระบบของคุณได้ง่าย")}</p>
        <Link className="parcel-button parcel-hero-cta" to="/docs">{t("เอกสาร API")}<ArrowRight size={24} aria-hidden="true" /></Link>
        <a className="parcel-how" href="#workflow">{t("ดูวิธีใช้งาน")}</a>
      </div>
      <img className="parcel-journey" src={journey} alt={t("สร้างใบปะหน้าด้วยเครื่องพิมพ์ จัดส่งพัสดุ และติดตามสถานะจนจัดส่งสำเร็จ")} width="1440" height="460" fetchPriority="high" />
      <div className="parcel-benefits" id="shipping-features">
        {benefits.map(([title, first, second], index) => <article key={t(title)}>
          <span className="parcel-number" aria-hidden="true">{index + 1}</span>
          <div><h2>{t(title)}</h2><p>{t(first)}<br />{t(second)}</p></div>
        </article>)}
      </div>
    </section>

    <section className="parcel-connect" aria-labelledby="parcel-connect-title">
      <div className="parcel-connect-inner">
        <div className="parcel-connect-copy">
          <h2 id="parcel-connect-title">{t("จากระบบของคุณ")}<br />{t("ถึงทุกปลายทาง")}</h2>
          <p>{t("เชื่อมต่อระบบของคุณกับ MyAPI ผ่าน API และ Webhook")}<br className="parcel-desktop-break" />{t("จัดการการส่งพัสดุได้ครบ จบในที่เดียว")}</p>
          <div className="parcel-connect-actions"><Link className="parcel-button parcel-button-cyan" to="/signup">{t("เริ่มใช้งานฟรี")}<ArrowRight size={20} aria-hidden="true" /></Link><Link className="parcel-docs-link" to="/docs"><BookOpen size={24} aria-hidden="true" />{t("ดูเอกสาร API")}</Link></div>
        </div>
        <img src={connection} alt={t("เชื่อมระบบของคุณกับการจัดส่งผ่าน API และ Webhook")} width="800" height="420" loading="lazy" />
      </div>
    </section>

    <section className="parcel-workflow" id="workflow" aria-label={t("เริ่มต้นใช้งานใน 4 ขั้นตอน")}>
      <ol>{steps.map(({ icon: Icon, title, detail, color, to }, index) => <li key={t(title)}>
        <Link to={to} className="parcel-step"><span className={`parcel-step-icon ${color}`}><Icon size={32} strokeWidth={1.7} aria-hidden="true" /></span><span><span className="parcel-step-title">{t(title)}</span><span className="parcel-step-detail">{t(detail)}</span></span></Link>
        {index < steps.length - 1 && <ArrowRight className="parcel-step-arrow" size={24} strokeWidth={1.5} aria-hidden="true" />}
      </li>)}</ol>
    </section>
  </div>;
}
