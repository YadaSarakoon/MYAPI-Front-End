import { useEffect, useState } from 'react';
import { LanguageContext } from './landing-language-context';
import type { Language } from './landing-language-context';
import type { ReactNode } from 'react';

const english: Record<string, string> = {
'ฟีเจอร์':'Features','วิธีใช้งาน':'How it works','เอกสาร API':'API Docs','เข้าสู่ระบบ':'Log in','เริ่มใช้งานฟรี':'Start for free','ดูวิธีใช้งาน':'How it works','ดูเอกสาร API':'API Docs','ดูรายละเอียด':'Learn more','ติดต่อเรา':'Contact us',
'เรื่องส่งของ':'Shipping made simple.','ให้ MyAPI จัดการ':'Let MyAPI handle it.','สร้างใบปะหน้า ติดตามพัสดุ เชื่อมต่อระบบของคุณได้ง่าย':'Create labels, track parcels, and connect your systems with ease.',
'ข้ามไปเนื้อหา':'Skip to content','MyAPI หน้าแรก':'MyAPI home','เมนูหลัก':'Main navigation','เมนูมือถือ':'Mobile navigation','เมนูท้ายเว็บไซต์':'Footer navigation','ปิดเมนู':'Close menu','เปิดเมนู':'Open menu',
'สร้างใบปะหน้า':'Create labels','สร้างและพิมพ์ใบปะหน้าพัสดุ':'Create and print shipping labels','ผ่าน API ได้ง่าย':'with a simple API.','พิมพ์และจัดส่ง':'Print and ship','นำใบปะหน้าไปพิมพ์และจัดส่ง':'Print your labels and ship','กับขนส่งที่คุณใช้งาน':'with your preferred carrier.','ติดตามสถานะ':'Track deliveries','ตรวจสอบสถานะพัสดุ':'Follow every parcel','และรับข้อมูลผ่าน Webhook':'and receive webhook updates.',
'สมัครใช้งาน':'Sign up','สร้างบัญชี MyAPI สำหรับทีมของคุณ':'Create a MyAPI account for your team.','รับ API Key':'Get your API key','ตั้งค่าการเชื่อมต่อกับระบบของคุณ':'Set up access for your system.','ทดสอบ Sandbox':'Try the sandbox','ทดลองให้พร้อมก่อนเริ่มใช้งานจริง':'Test your integration before going live.','เริ่มจัดส่ง':'Start shipping','เชื่อมต่อระบบและสร้างใบปะหน้า':'Connect your system and create labels.','เริ่มต้นใช้งานใน 4 ขั้นตอน':'Get started in four steps',
'จากระบบของคุณ':'From your system','ถึงทุกปลายทาง':'to every destination.','เชื่อมต่อระบบของคุณกับ MyAPI ผ่าน API และ Webhook':'Connect your system to MyAPI through APIs and webhooks.','จัดการการส่งพัสดุได้ครบ จบในที่เดียว':'Manage your shipping in one place.',
'สร้างใบปะหน้าด้วยเครื่องพิมพ์ จัดส่งพัสดุ และติดตามสถานะจนจัดส่งสำเร็จ':'Print shipping labels, ship parcels, and track deliveries.','เชื่อมระบบของคุณกับการจัดส่งผ่าน API และ Webhook':'Connect your system to shipping through APIs and webhooks.',
'จัดส่งได้ครบ':'Built for ','ทุกจังหวะของธุรกิจ':'every stage of shipping','เครื่องมือที่ทีมปฏิบัติการและทีมพัฒนาใช้ร่วมกันได้':'Tools that bring your operations and development teams together.',
'พิมพ์เอกสาร':'Print documents','ติดตามพัสดุ':'Track parcels','สร้างและพิมพ์ใบปะหน้าได้ทันทีผ่าน API ได้ง่าย ช่วยลดขั้นตอนการทำงาน':'Create and print labels through one simple API, with fewer manual steps.','เตรียมเอกสารการจัดส่งและใบปะหน้าให้พร้อมสำหรับทีมแพ็กสินค้า':'Prepare shipping documents and labels for your packing team.','ตรวจสอบสถานะพัสดุจากระบบของคุณ และรับข้อมูลผ่าน Webhook':'Track parcels from your own system and receive webhook updates.',
'คำถามที่พบบ่อย':'Frequently asked questions','ยังมีข้อสงสัยอยู่? ทีมของเราพร้อมช่วยคุณวางแผนการจัดส่ง':'Have questions? Our team can help you plan your shipping workflow.',
'MyAPI คืออะไร?':'What is MyAPI?','แพลตฟอร์ม API สำหรับเชื่อมต่อและจัดการงานขนส่ง ช่วยสร้างรายการจัดส่ง ใบปะหน้า และติดตามสถานะจากระบบของคุณเอง':'MyAPI connects shipping to your existing systems. Create shipments, generate labels, and track deliveries through an API.',
'เริ่มทดสอบได้เลยหรือไม่?':'Can I start testing right away?','ได้หลังสมัครใช้งานและรับข้อมูลสำหรับทดสอบ คุณสามารถทดลองการเชื่อมต่อใน Sandbox ก่อนใช้งานจริง':'After signing up and receiving test credentials, you can try your integration in the sandbox before going live.',
'เชื่อมต่อกับระบบเดิมได้หรือไม่?':'Can I connect my existing system?','ได้ MyAPI ออกแบบเป็น REST API เพื่อให้ทีมพัฒนานำไปต่อยอดกับเว็บไซต์ ระบบหลังบ้าน หรือแพลตฟอร์มของคุณ':'Yes. MyAPI uses a REST API so your developers can integrate it with your website, back office, or platform.',
'ต้องการคำแนะนำก่อนเริ่มใช้งานทำอย่างไร?':'How can I get help before starting?','ศึกษาวิธีเริ่มต้นได้จากเอกสาร API และเตรียมรายละเอียดระบบของคุณ เพื่อให้ทีมงานช่วยแนะนำแนวทางการเชื่อมต่อที่เหมาะสม':'Start with the API documentation and prepare details about your system so our team can recommend the right integration approach.',
'พร้อมยกระดับ':'Ready to upgrade','การจัดส่งของคุณแล้วหรือยัง?':'your shipping?','เล่าให้เราฟังว่าธุรกิจของคุณทำงานอย่างไร เราจะช่วยแนะนำแนวทางเชื่อมต่อที่เหมาะสม':'Tell us how your business works. We can help you find the right integration approach.',
'ชื่อบริษัท (ไม่บังคับ)':'Company (optional)','ชื่อ - นามสกุล':'Full name','เบอร์โทรติดต่อ':'Phone number','อีเมล':'Email','เว็บไซต์ (ไม่บังคับ)':'Website (optional)','ขนส่งที่สนใจ':'Preferred carrier',
'เช่น บริษัท ตัวอย่าง จำกัด':'e.g. Example Co., Ltd.','เช่น สมชาย ใจดี':'e.g. Alex Smith','เช่น 081 234 5678':'e.g. 081 234 5678','เช่น name@company.com':'e.g. name@company.com','เช่น https://www.example.com':'e.g. https://www.example.com','ระบุขนส่งที่สนใจ':'Enter your preferred carrier','ให้ทีมงานติดต่อกลับ':'Request a callback',
'ขณะนี้ยังส่งคำขอติดต่อผ่านหน้าเว็บไซต์ไม่ได้ ข้อมูลของคุณยังไม่ได้ถูกส่ง กรุณาลองใหม่ภายหลัง':'Contact requests are not available on this website yet. Your information has not been sent. Please try again later.'
};

export function LandingLanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem('myapi-language') === 'en' ? 'en' : 'th'; } catch { return 'th'; }
  });
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = language;
    try { localStorage.setItem('myapi-language', language); } catch { /* Storage may be unavailable. */ }
    return () => { document.documentElement.lang = previous; };
  }, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t: (text) => language === 'en' ? english[text.trim()] ?? text : text }}>{children}</LanguageContext.Provider>;
}

