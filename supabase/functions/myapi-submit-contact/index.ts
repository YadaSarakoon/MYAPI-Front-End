import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { handleIntake } from '../_shared/handlers.mjs';
const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const db = createClient(Deno.env.get('SUPABASE_URL')!, key, { auth: { persistSession: false, autoRefreshToken: false } });
Deno.serve((req: Request) => handleIntake(req, { db, rateSalt: Deno.env.get('MYAPI_CONTACT_RATE_SALT') || key }));
