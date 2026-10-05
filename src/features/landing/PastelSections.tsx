import { useLandingLanguage } from './landing-language-context';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import logo from '../../assets/logoDark.png';
import labelArt from '../../assets/landing/feature-label.png';
import printArt from '../../assets/landing/feature-print.png';
import trackingArt from '../../assets/landing/feature-track.png';
import bubbles from '../../assets/landing/faq-bubbles.png';
import './pastel-sections.css';

const features = [
  { title: 'สร้างใบปะหน้า', image: labelArt, description: 'สร้างและพิมพ์ใบปะหน้าได้ทันทีผ่าน API ได้ง่าย ช่วยลดขั้นตอนการทำงาน' },
  { title: 'พิมพ์เอกสาร', image: printArt, description: 'เตรียมเอกสารการจัดส่งและใบปะหน้าให้พร้อมสำหรับทีมแพ็กสินค้า' },
  { title: 'ติดตามพัสดุ', image: trackingArt, description: 'ตรวจสอบสถานะพัสดุจากระบบของคุณ และรับข้อมูลผ่าน Webhook' },
];
const questions = [
  ['MyAPI คืออะไร?', 'แพลตฟอร์ม API สำหรับเชื่อมต่อและจัดการงานขนส่ง ช่วยสร้างรายการจัดส่ง ใบปะหน้า และติดตามสถานะจากระบบของคุณเอง'],
  ['เริ่มทดสอบได้เลยหรือไม่?', 'ได้หลังสมัครใช้งานและรับข้อมูลสำหรับทดสอบ คุณสามารถทดลองการเชื่อมต่อใน Sandbox ก่อนใช้งานจริง'],
  ['เชื่อมต่อกับระบบเดิมได้หรือไม่?', 'ได้ MyAPI ออกแบบเป็น REST API เพื่อให้ทีมพัฒนานำไปต่อยอดกับเว็บไซต์ ระบบหลังบ้าน หรือแพลตฟอร์มของคุณ'],
  ['ต้องการคำแนะนำก่อนเริ่มใช้งานทำอย่างไร?', 'ศึกษาวิธีเริ่มต้นได้จากเอกสาร API และเตรียมรายละเอียดระบบของคุณ เพื่อให้ทีมงานช่วยแนะนำแนวทางการเชื่อมต่อที่เหมาะสม'],
];
const fields = [
  { name: 'company', label: 'ชื่อบริษัท (ไม่บังคับ)', placeholder: 'เช่น บริษัท ตัวอย่าง จำกัด', type: 'text', autoComplete: 'organization', required: false },
  { name: 'fullName', label: 'ชื่อ - นามสกุล', placeholder: 'เช่น สมชาย ใจดี', type: 'text', autoComplete: 'name', required: true },
  { name: 'phone', label: 'เบอร์โทรติดต่อ', placeholder: 'เช่น 081 234 5678', type: 'tel', autoComplete: 'tel', required: true },
  { name: 'email', label: 'อีเมล', placeholder: 'เช่น name@company.com', type: 'email', autoComplete: 'email', required: true },
  { name: 'website', label: 'เว็บไซต์ (ไม่บังคับ)', placeholder: 'เช่น https://www.example.com', type: 'url', autoComplete: 'url', required: false },
  { name: 'courier', label: 'ขนส่งที่สนใจ', placeholder: 'ระบุขนส่งที่สนใจ', type: 'text', autoComplete: 'off', required: false },
];

export function PastelSections() {
  const { t } = useLandingLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactNotice, setContactNotice] = useState(false);
  return <div className="pastel-sections">
    <section id="features" className="pastel-features" aria-labelledby="pastel-feature-title"><div className="pastel-container">
      <h2 id="pastel-feature-title">{t("จัดส่งได้ครบ")}<span>{t("ทุกจังหวะของธุรกิจ")}</span></h2>
      <p className="pastel-subtitle">{t("เครื่องมือที่ทีมปฏิบัติการและทีมพัฒนาใช้ร่วมกันได้")}</p>
      <div className="pastel-feature-grid">{features.map(({ title, image, description }) => <article key={t(title)}>
        <img src={image} alt={t(title)} width="600" height="450" loading="lazy" />
        <div className="pastel-feature-copy"><h3>{t(title)}</h3><p>{t(description)}</p><Link to="/docs" aria-label={`${t("ดูรายละเอียด")} ${t(title)}`}>{t("ดูรายละเอียด")}<ArrowRight size={20} aria-hidden="true" /></Link></div>
      </article>)}</div>
    </div></section>
    <section id="faq" className="pastel-faq" aria-labelledby="pastel-faq-title"><div className="pastel-faq-inner">
      <div className="pastel-faq-heading"><h2 id="pastel-faq-title">{t("คำถามที่พบบ่อย")}</h2><p className="pastel-subtitle">{t("ยังมีข้อสงสัยอยู่? ทีมของเราพร้อมช่วยคุณวางแผนการจัดส่ง")}</p><img src={bubbles} alt="" width="600" height="400" loading="lazy" /></div>
      <div className="pastel-questions">{questions.map(([question, answer], index) => <div className="pastel-question" key={t(question)}>
        <h3><button type="button" id={`question-${index}`} aria-expanded={openFaq === index} aria-controls={`answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{t(question)}</span><ChevronDown className={openFaq === index ? 'is-open' : ''} size={22} aria-hidden="true" /></button></h3>
        <div id={`answer-${index}`} role="region" aria-labelledby={`question-${index}`} hidden={openFaq !== index}><p>{t(answer)}</p></div>
      </div>)}</div>
    </div></section>
    <section id="contact-us" className="pastel-contact" aria-labelledby="pastel-contact-title"><div className="pastel-contact-inner">
      <h2 id="pastel-contact-title">{t("พร้อมยกระดับ")}<br /><span>{t("การจัดส่งของคุณแล้วหรือยัง?")}</span></h2>
      <p className="pastel-subtitle">{t("เล่าให้เราฟังว่าธุรกิจของคุณทำงานอย่างไร เราจะช่วยแนะนำแนวทางเชื่อมต่อที่เหมาะสม")}</p>
      <form onSubmit={(event) => { event.preventDefault(); setContactNotice(true); }}>
        <div className="pastel-form-grid">{fields.map(({ name, label, ...props }) => <label key={name} htmlFor={`contact-${name}`}><span>{t(label)}</span><input id={`contact-${name}`} name={name} {...props} placeholder={t(props.placeholder)} /></label>)}</div>
        <button className="pastel-submit" type="submit">{t("ให้ทีมงานติดต่อกลับ")}</button>
        {contactNotice && <p className="pastel-form-notice" role="status">{t("ขณะนี้ยังส่งคำขอติดต่อผ่านหน้าเว็บไซต์ไม่ได้ ข้อมูลของคุณยังไม่ได้ถูกส่ง กรุณาลองใหม่ภายหลัง")}</p>}
      </form>
    </div></section>
    <footer className="pastel-footer"><div className="pastel-container"><Link to="/" aria-label={t("MyAPI หน้าแรก")}><img src={logo} width="130" height="45" alt="MyAPI" /></Link><nav aria-label={t("เมนูท้ายเว็บไซต์")}><a href="#features">{t("ฟีเจอร์")}</a><a href="#workflow">{t("วิธีใช้งาน")}</a><Link to="/docs">{t("เอกสาร API")}</Link><a href="#contact-us">{t("ติดต่อเรา")}</a></nav><p>© {new Date().getFullYear()} MyAPI</p></div></footer>
  </div>;
}

