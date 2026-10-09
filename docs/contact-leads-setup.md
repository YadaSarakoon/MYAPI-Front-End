# รับข้อมูลลูกค้าและแจ้งเตือนด้วย Supabase

## ระบบที่ย้ายแล้ว

- โปรเจกต์: `extension` (`znhevgidvrtidttdzhik`)
- Supabase Auth แทน Firebase Auth: ล็อกอิน/สมัครด้วยอีเมล, session, logout และ OAuth redirect
- Edge Function `myapi-submit-contact`: ตรวจข้อมูล, honeypot, ขนาด 16 KiB และจำกัด 5 คำขอต่อชั่วโมงต่อ IP ที่ hash ฝั่ง server
- ตาราง `public.myapi_contact_leads` และคิว `myapi_private.contact_outbox` ถูกสร้างพร้อมกันใน transaction เดียว การ retry UUID เดิมไม่สร้างข้อมูลซ้ำ; UUID เดิมกับข้อมูลต่างกันถูกปฏิเสธ
- `/admin/leads`: รายการเรียงใหม่ก่อน, แบ่งหน้า 25 รายการ, ค้นหาในรายการที่โหลด, สถานะและโน้ต, ป้องกันการเขียนทับข้อมูลที่ทีมแก้แล้ว
- Sidebar และหน้าแอดมินตรวจจำนวนคำขอสถานะ `new` ทุก 30 วินาทีขณะเปิดหน้าเว็บ เลือก “โหลดใหม่” เพื่อดูรายการล่าสุด; หากมีโน้ตหรือสถานะที่ยังไม่บันทึก ต้องบันทึกหรือกด “ยกเลิกการแก้ไข” ก่อนเปลี่ยนรายการหรือโหลดใหม่
- ข้อมูลลูกค้าอ่านได้เฉพาะสมาชิกใน `myapi_private.contact_admins` หรืออีเมลที่อนุญาตใน `myapi_private.contact_admin_emails` โดยทั้งสองกรณีต้องยืนยันอีเมลแล้วและไม่ถูกระงับ แอดมินแก้ได้เฉพาะสถานะ/โน้ต ไม่สามารถปลอมสถานะส่งอีเมล
- ไม่ใช้ตาราง/บทบาทแอดมินของแอปอื่นในโปรเจกต์เดียวกัน

## Frontend

ตั้งค่าจาก `.env.example` ในเครื่องและในผู้ให้บริการ hosting แล้ว build ใหม่:

```dotenv
VITE_SUPABASE_URL=https://znhevgidvrtidttdzhik.supabase.co
VITE_SUPABASE_ANON_KEY=<public legacy anon JWT จาก Project API Keys>
VITE_API_BASE_URL=<ค่าของ API เดิมถ้ามี>
```

ใช้ legacy **anon** key สำหรับ compatibility กับ JWT verification ของ Edge Function รับฟอร์ม (ยังเปิด `verify_jwt = true`) ไม่ใช่ service_role/secret key. คีย์นี้เป็น public key และไม่มีสิทธิ์อ่านข้อมูลลูกค้า ผู้ใช้ Supabase ที่ล็อกอินแล้วใช้ session ของตนกับ RLS ส่วน public intake ใช้ anon JWT เสมอ

ตั้ง Auth > URL Configuration ให้มี URL เว็บจริง และ redirect URLs `/dashboard`, `/admin/leads` รวมถึง localhost ที่ใช้พัฒนา โดยอย่าเปลี่ยนรายการของระบบอื่นในโปรเจกต์นี้

ตรวจเมื่อ 7 ต.ค. 2026: Email provider เปิดอยู่, Google provider ยังปิด หากต้องการ Google ให้ตั้ง OAuth client/secret ใน Supabase Auth > Providers > Google ก่อน ปุ่ม Google จะใช้ OAuth redirect แทน popup. การสมัครอีเมลที่ต้องยืนยันจะแสดงข้อความให้ตรวจอีเมล ไม่แสดงว่าล็อกอินแล้ว

## ให้สิทธิ์แอดมิน

กำหนด allowlist ฝั่งฐานข้อมูลสำหรับ `yada@myorder.ai` และ `sukanya@myorder.ai` ตามที่ผู้ใช้ยืนยันแล้ว เมื่อทั้งสองบัญชีสมัครและยืนยันอีเมลกับ Supabase จะได้สิทธิ์ MyAPI ทันทีหลังโหลดหน้าเว็บใหม่ การกรอกอีเมลในฟอร์มติดต่อหรือ metadata ไม่ให้สิทธิ์แอดมิน การเปลี่ยนผู้รับอีเมลแจ้งเตือนก็ไม่แก้ allowlist นี้

หากต้องการจัดการสิทธิ์ด้วย user ID เพิ่มเติม สามารถรันใน Supabase SQL Editor ด้วยสิทธิ์ผู้ดูแลโปรเจกต์:

```sql
insert into myapi_private.contact_admins(user_id)
select id from auth.users
where lower(email) in ('yada@myorder.ai', 'sukanya@myorder.ai')
  and email_confirmed_at is not null and deleted_at is null
  and (banned_until is null or banned_until < now())
on conflict do nothing;

select u.email from myapi_private.contact_admins a
join auth.users u on u.id = a.user_id;
```

ตรวจผลให้ได้บัญชีที่ต้องการจริง จากนั้นโหลดหน้าเว็บใหม่ ไม่มีการเชื่อถือ `user_metadata` หรือให้ผู้ใช้ยกระดับสิทธิ์ตนเอง

## เปิดอีเมลแจ้งเตือน (ยังต้องตั้งค่า)

ฟังก์ชัน `myapi-notify-contacts` ถูก deploy แล้ว แต่ยังไม่ส่งอีเมลเพราะไม่มีบริการ/ผู้ส่งและยังไม่ได้ตั้ง schedule. ฟอร์มยังบันทึกข้อมูลและคิวอีเมลได้ตามปกติ ข้อมูลที่รอส่งจะไม่ถูกนับเป็นส่งสำเร็จ

1. สมัคร Resend และ verify โดเมนผู้ส่ง
2. ตั้ง secrets เฉพาะ MyAPI ผ่าน Supabase Dashboard > Edge Functions > Secrets ตาม `supabase/functions/.env.example`:
   - `MYAPI_RESEND_API_KEY`: คีย์ Resend
   - `MYAPI_CONTACT_MAIL_FROM`: เช่น `MyAPI <contact@your-verified-domain>`
   - `MYAPI_CONTACT_MAIL_TO`: `yada@myorder.ai,sukanya@myorder.ai`
   - `MYAPI_CONTACT_SITE_URL`: HTTPS URL ของเว็บที่เผยแพร่จริง
   - `MYAPI_CONTACT_RATE_SALT`: ค่า random สำหรับ hash IP (ไม่บังคับ; ถ้าไม่ตั้งจะใช้ server-side service role key)
3. เก็บ legacy service_role JWT ของโปรเจกต์ใน Supabase Vault ชื่อ `myapi_worker_service_role` ผ่าน Dashboard ห้ามใส่ใน frontend, git หรือแชต
4. เปิด extensions `pg_cron`, `pg_net` ถ้ายังไม่เปิด และใช้ SQL ต่อไปนี้สร้าง job **ครั้งเดียว** หลังตั้ง secrets ครบ:

```sql
select cron.schedule(
  'myapi-contact-email-every-minute',
  '* * * * *',
  $job$
    select net.http_post(
      url := 'https://znhevgidvrtidttdzhik.supabase.co/functions/v1/myapi-notify-contacts',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret from vault.decrypted_secrets
          where name = 'myapi_worker_service_role'
        )
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 60000
    );
  $job$
);
```

worker ยอมรับเฉพาะ service_role JWT ตรงกับ server key; anon/สมาชิกทั่วไปเรียกไม่ได้ อ่านคิวครั้งละ 5 รายการโดย lock lease 3 นาที, retry แบบเพิ่มเวลาสูงสุด 10 ครั้ง ใช้ idempotency key เดิม และหยุดอัตโนมัติภายใน 23 ชั่วโมงจากความพยายามส่งครั้งแรก ป้องกันส่งซ้ำเกินอายุ idempotency 24 ชั่วโมงของ Resend. หากคีย์ไม่ครบจะคืน 503 โดยไม่ดึงงานออกจากคิว

ก่อนเปิด schedule ให้ตรวจจำนวนคิวค้าง เพราะคำขอที่รับไว้ก่อนตั้งค่าจะเริ่มส่งด้วย เมื่อเกิน retry window ให้ตรวจ Resend ก่อนดำเนินการส่งใหม่เองเพื่อหลีกเลี่ยงอีเมลซ้ำ ตรวจ Edge Function logs และ `myapi_private.contact_outbox` สำหรับ failed deliveries โดยไม่บันทึก payload ลูกค้าหรือ secrets ลง log

อีเมลมีข้อความว่ามีคำขอใหม่และลิงก์หลังบ้าน ไม่มีรายละเอียดส่วนตัวของลูกค้า

## ทดสอบและ deploy

```sh
npm test
npm run build
npm run lint
```

- `supabase/tests/contact.integration.sql`: transaction tests สำหรับข้อมูลซ้ำ/quota/RLS/column grants/การแก้ไขชนกัน/คิว retry ทุกข้อมูลทดสอบและสิทธิ์ชั่วคราว rollback; ใช้ SQL Editor หรือ Supabase MCP
- `node supabase/tests/smoke.mjs`: ส่งข้อมูลจำลองผ่าน API จริงสองครั้ง ตรวจ guest read และ worker authorization; สร้าง lead/คิวทดสอบจริง 1 รายการและพิมพ์ UUID ต้องลบข้อมูลทดสอบหลังตรวจโดยใช้ UUID นั้น **ห้ามรันเมื่อ worker อีเมลเปิดใช้งานอยู่** เพราะจะเกิดแจ้งเตือนจริง
- migration ใน repository ถูกใช้กับโปรเจกต์แล้ว ชื่อเวอร์ชันตรงกับ remote migration history. โปรเจกต์นี้มี migrations ของระบบอื่นอยู่ด้วย อย่า `db reset` หรือ push history ทั้งชุดจาก repo นี้โดยไม่ reconcile กับเจ้าของระบบ
- deploy เฉพาะ `myapi-submit-contact` และ `myapi-notify-contacts` ผ่าน Supabase MCP/CLI; อย่าปิด JWT verification

การทดสอบไม่แทนการรับอีเมลจริง ต้องตั้งค่าผู้ส่ง, schedule, บัญชีแอดมิน และ frontend hosting ให้ครบก่อนทดสอบ flow บนเว็บที่เผยแพร่จริง

## ขอบเขตการย้าย

ถอน Firebase SDK, config, Functions, Firestore rules และ test harness เดิมจากโปรเจกต์แล้ว ไม่ได้ลบ Firebase project บน cloud และไม่ได้คัดลอกบัญชี/ข้อมูลเก่าจาก Firebase เพราะยังไม่มีการเข้าถึงข้อมูลนั้น. เอกสารเก่าใน `docs/superpowers` เก็บเป็นประวัติ; คู่มือนี้ใช้แทนสำหรับระบบปัจจุบัน

อ้างอิง: [Supabase Auth events](https://supabase.com/docs/reference/javascript/auth-onauthstatechange), [Edge JWT compatibility](https://supabase.com/docs/guides/functions/auth-legacy-jwt), [Scheduled functions](https://supabase.com/docs/guides/functions/schedule-functions), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys)

## ผลตรวจครั้งนี้ (7 ต.ค. 2026)

- `npm test`: 16 frontend tests และ 4 server handler tests ผ่าน
- `npm run build` และ `npm run lint` ผ่าน; build ยังเตือน bundle เกิน 500 kB
- API ที่ deploy แล้ว: ส่งซ้ำ 2 ครั้งได้ lead 1 แถวและ outbox 1 แถว; guest อ่าน lead และเรียก worker ไม่ได้; ลบ smoke record แล้ว
- Database integration ชุดแรกผ่าน (atomicity, duplicate/conflict, quota, outbox retry, role/column grants, optimistic concurrency)
- หลังเพิ่ม email allowlist การรัน integration script ฉบับขยายผ่าน MCP ถูกยกเลิก 2 ครั้ง จึงไม่อ้างว่าฉบับขยายผ่านครบ ตรวจ grants แบบ read-only แล้ว guest อ่าน lead ไม่ได้, สมาชิกเพิ่มอีเมลแอดมินหรือเรียก worker ไม่ได้
- Security advisor แจ้ง private tables เปิด RLS แต่ไม่มี policy: เป็น deny-by-default โดยตั้งใจ ตารางเหล่านี้ไม่เปิดให้ client อ่าน/เขียน; มีเฉพาะ service role และ private function สำหรับตรวจสิทธิ์ อ้างอิง [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- ตรวจ dependency audit หลังถอด Firebase และอัปเดต source-map-js: ไม่พบ vulnerability
- ยังไม่ได้ทดสอบล็อกอินด้วยบัญชีแอดมินทั้งสองจริง (รอสมัคร/ยืนยัน), Google OAuth หรือรับอีเมลจริง (รอตั้งค่าบริการ). Frontend deployment ยังต้องนำ build/config ไปใช้กับ hosting ของเว็บ
