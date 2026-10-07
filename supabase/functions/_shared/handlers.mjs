import { createHmac } from 'node:crypto';
import { ContactError, validateSubmission } from './contact-core.mjs';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
async function readBody(req) {
  if (!req.body) throw new ContactError('invalid-argument', 'Missing body');
  const reader = req.body.getReader();
  const chunks = []; let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16384) { await reader.cancel(); throw new ContactError('too-large', 'Too large'); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const body = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  try { return JSON.parse(new TextDecoder().decode(body)); }
  catch { throw new ContactError('invalid-argument', 'Invalid JSON'); }
}
export async function handleIntake(req, { db, rateSalt }) {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method-not-allowed' }, 405);
  try {
    const payload = validateSubmission(await readBody(req));
    // Use the last proxy-provided address rather than trusting a prepended client value.
    const ip = req.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim();
    if (!ip || !rateSalt) return json({ error: 'intake-unavailable' }, 503);
    const clientKey = createHmac('sha256', rateSalt).update(ip).digest('hex');
    const { data, error } = await db.rpc('myapi_submit_contact', { p_payload: payload, p_client_key: clientKey });
    if (error) {
      if (error.message === 'rate-limit') return json({ error: 'resource-exhausted' }, 429);
      if (error.message === 'submission-conflict') return json({ error: 'submission-conflict' }, 409);
      return json({ error: 'save-failed' }, 503);
    }
    if (data?.accepted !== true) return json({ error: 'save-failed' }, 503);
    return json({ accepted: true });
  } catch (error) {
    if (error instanceof ContactError) return json({ error: error.code }, error.code === 'too-large' ? 413 : 400);
    return json({ error: 'intake-unavailable' }, 503);
  }
}
export async function handleNotifications(req, { db, serviceKey, apiKey, from, to, siteUrl, send = fetch }) {
  if (req.method !== 'POST') return json({ error: 'method-not-allowed' }, 405);
  if (!serviceKey || req.headers.get('authorization') !== `Bearer ${serviceKey}`) return json({ error: 'unauthorized' }, 401);
  let base;
  try { base = new URL(siteUrl); } catch { return json({ error: 'email-not-configured' }, 503); }
  const recipients = to?.split(',').map(value => value.trim()).filter(Boolean);
  if (!apiKey || !from || !recipients?.length || base.protocol !== 'https:' || base.username || base.password) return json({ error: 'email-not-configured' }, 503);
  try {
    const { data: jobs, error } = await db.rpc('myapi_claim_notifications');
    if (error) return json({ error: 'queue-unavailable' }, 503);
    let sent = 0; let failed = 0;
    for (const job of jobs) {
      let providerId = null;
      try {
        const response = await send('https://api.resend.com/emails', {
          method: 'POST', signal: AbortSignal.timeout(10_000),
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `myapi-contact/${job.lead_id}` },
          body: JSON.stringify({ from, to: recipients, subject: 'MyAPI: มีคำขอติดต่อใหม่',
            text: `มีลูกค้าส่งคำขอติดต่อใหม่ เปิดดูข้อมูลในหลังบ้าน:\n${new URL('/admin/leads', base).href}\nเลขคำขอ: ${job.lead_id}` }),
        });
        if (response.ok) {
          const body = await response.json();
          if (typeof body.id === 'string' && body.id) providerId = body.id;
        }
      } catch { /* Preserve the lead and retry the queued email with its original key. */ }
      const { error: saveError } = await db.rpc('myapi_finish_notification', { p_id: job.lead_id, p_token: job.lock_token, p_provider_id: providerId });
      if (saveError) return json({ error: 'queue-update-failed' }, 503);
      if (providerId) sent++; else failed++;
    }
    return json({ sent, failed });
  } catch { return json({ error: 'notification-unavailable' }, 503); }
}
