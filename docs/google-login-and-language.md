# Google login และภาษาไทย–อังกฤษ

## สถานะ

โค้ดหน้า Login และ Sign up ใช้ Supabase Google OAuth และกลับมาที่ `/auth/callback` ก่อนเปิดหน้าที่ผู้ใช้ต้องการ ระบบจำภาษาที่เลือกใน `localStorage` ชื่อ `myapi-language` และใช้ร่วมกันทุก route

คืนการเชื่อมต่อไปยังโปรเจกต์เดิม `znhevgidvrtidttdzhik` เพื่อใช้บัญชีและสิทธิ์แอดมินเดิม โปรเจกต์ใหม่ไม่ได้ย้ายบัญชีหรือฐานข้อมูลมาให้ ต้องเปิด Google provider ในโปรเจกต์เดิมและตั้ง callback ของ OAuth Client ให้ตรงตามขั้นตอนด้านล่าง

## เปิด Google login

1. เข้า [Google Auth Platform — Clients](https://console.cloud.google.com/auth/clients) แล้วเลือก Google Cloud project ของเว็บ ตรวจว่ามี OAuth Client ประเภท **Web application** อยู่แล้วหรือไม่ ใช้ตัวเดิมถ้าเป็นของเว็บนี้
2. ถ้ายังไม่มี ให้ตั้งค่า Branding, Audience และข้อมูลติดต่อก่อน แล้วสร้าง OAuth Client ประเภท Web application หาก Audience อยู่ในโหมด Testing ให้เพิ่มบัญชีผู้ทดสอบด้วย
3. ใน Authorized JavaScript origins ใส่ origin ของเว็บ เช่น `http://localhost:5173` สำหรับ Vite และ origin HTTPS ของเว็บจริง
4. ใน **Authorized redirect URIs** ใส่ URL นี้ให้ตรงทุกตัวอักษร:

   ```text
   https://znhevgidvrtidttdzhik.supabase.co/auth/v1/callback
   ```

5. เข้า [Supabase — Google provider](https://supabase.com/dashboard/project/znhevgidvrtidttdzhik/auth/providers?provider=Google) เปิด Google แล้วกรอก Client ID และ Client Secret จาก OAuth Client ข้างต้น กด Save
6. เข้า [Supabase — URL Configuration](https://supabase.com/dashboard/project/znhevgidvrtidttdzhik/auth/url-configuration) ตั้ง Site URL เป็น URL เว็บจริง และ **เพิ่ม** Redirect URLs ของเว็บนี้โดยรักษารายการของระบบอื่นในโปรเจกต์เดียวกันไว้:

   ```text
   http://localhost:5173/auth/callback**
   https://YOUR_WEB_DOMAIN/auth/callback**
   ```

   เปลี่ยน `YOUR_WEB_DOMAIN` เป็นโดเมนจริง ส่วน `**` รองรับ query `?next=...` ที่แอปใช้กลับหน้าที่ต้องการ ถ้าใช้พอร์ตอื่นหรือ `127.0.0.1` ให้เพิ่ม origin ที่ตรงกับ URL ที่เปิดเว็บด้วย หน้า callback ของ Google ในข้อ 4 เป็นคนละ URL กับ callback ของแอปในข้อนี้

7. Hosting ต้องส่ง `index.html` ของ SPA เมื่อเปิด `/auth/callback` และ routes อื่นโดยตรง อย่าให้ URL นี้ตอบ 404

Client Secret เก็บใน Supabase เท่านั้น ไม่ใส่ `VITE_*`, Git หรือแชต Frontend ใช้ `VITE_SUPABASE_URL` และ public `VITE_SUPABASE_PUBLISHABLE_KEY` (รองรับ `VITE_SUPABASE_ANON_KEY` สำหรับระบบเดิมด้วย)

อ้างอิง: [Supabase Google login](https://supabase.com/docs/guides/auth/social-login/auth-google), [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)

## ตรวจใช้งานหลังเปิด provider

- เปิด `/login` กดเข้าสู่ระบบด้วย Google และเลือกบัญชี ต้องกลับ `/dashboard` พร้อมชื่อหรืออีเมลจริง
- ออกจากระบบแล้วเปิด `/billing` เข้าผ่าน Google ต้องกลับ `/billing` รีเฟรชแล้วสถานะล็อกอินยังอยู่
- กดยกเลิกที่ Google ต้องกลับหน้า callback พร้อมข้อความให้ลองใหม่ ไม่แสดงว่าล็อกอินสำเร็จ
- เลือก EN แล้วเข้าสู่ระบบ เปลี่ยนหน้า และรีเฟรช ภาษาต้องเป็นอังกฤษต่อเนื่อง สลับ TH ได้จากทุกหน้า
- การใช้ Google ไม่เพิ่มสิทธิ์แอดมิน บัญชีต้องผ่าน allowlist/RLS เดิมจึงเข้า `/admin/leads` ได้

หาก provider ยังปิด แอปจะแสดงข้อความให้ติดต่อผู้ดูแล ไม่ส่งผู้ใช้ไปยังหน้าข้อผิดพลาดของ Supabase

## โครงสร้างภาษาและการตรวจโค้ด

- `src/i18n/LanguageProvider.tsx` จัดการสถานะภาษาและการจำค่า
- `src/i18n/language.ts` ให้ `useLanguage()` และ `t()` สำหรับ UI
- `src/i18n/messages.ts` เก็บคำแปลที่ย้ายมาจากระบบเดิม และ `extraMessages.ts` เก็บคำแปลเพิ่มเติม
- ข้อความใน UI รวมถึงหน้ารายละเอียด Endpoint แปลตามภาษาที่เลือก ส่วนชื่อผู้ใช้ ข้อมูลลูกค้า API field names, URLs และ JSON/code examples คงข้อมูลต้นฉบับ
- เพิ่มคำแปล UI ใหม่ให้ทั้งสองภาษา ไม่ใช้ข้อความที่แปลแล้วเป็นค่า API หรือค่าที่ส่งให้ Backend

รัน `npm test`, `npm run lint`, `npm run build` การทดสอบ OAuth อัตโนมัติจำลองขอบเขตบริการภายนอก ไม่ทดแทนการล็อกอิน Google จริงหลังตั้งค่าเสร็จ
