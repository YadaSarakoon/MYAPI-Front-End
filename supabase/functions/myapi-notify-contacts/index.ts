import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { handleNotifications } from '../_shared/handlers.mjs';
const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const db = createClient(Deno.env.get('SUPABASE_URL')!, key, { auth: { persistSession: false, autoRefreshToken: false } });
Deno.serve((req: Request) => handleNotifications(req, {
  db, serviceKey: key, apiKey: Deno.env.get('MYAPI_RESEND_API_KEY'), from: Deno.env.get('MYAPI_CONTACT_MAIL_FROM'),
  to: Deno.env.get('MYAPI_CONTACT_MAIL_TO') || 'yada@myorder.ai,sukanya@myorder.ai', siteUrl: Deno.env.get('MYAPI_CONTACT_SITE_URL'),
}));
