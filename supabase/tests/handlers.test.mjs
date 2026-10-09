import test from 'node:test';
import assert from 'node:assert/strict';
import { handleIntake, handleNotifications } from '../functions/_shared/handlers.mjs';
const input = { submissionId: '68a28df3-1e11-488a-8e0a-871fe1faf1a7', fullName: ' สมชาย ใจดี ', phone: '0812345678', email: 'person@example.com', company: '', website: '', courier: '', trap: '' };
const request = (body = input) => new Request('https://test.example', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.10' }, body: JSON.stringify(body) });
test('intake persists normalized data before acknowledging; database failures stay failures', async () => {
  let saved;
  const db = { rpc: async (name, args) => { assert.equal(name, 'myapi_submit_contact'); saved = args; return { data: { accepted: true }, error: null }; } };
  const response = await handleIntake(request(), { db, rateSalt: 'test-salt' });
  assert.equal(response.status, 200); assert.deepEqual(await response.json(), { accepted: true });
  assert.equal(saved.p_payload.fullName, 'สมชาย ใจดี'); assert.equal(saved.p_client_key.length, 64); assert.ok(!JSON.stringify(saved).includes('192.0.2.10'));
  const failed = await handleIntake(request(), { db: { rpc: async () => ({ error: { message: 'offline' } }) }, rateSalt: 'test-salt' });
  assert.equal(failed.status, 503);
});
test('invalid and oversized submissions cannot reach persistence; rate limit is HTTP 429', async () => {
  const db = { rpc: async () => { throw new Error('must not persist'); } };
  for (const body of [{ ...input, trap: 'bot' }, { ...input, status: 'closed' }, { ...input, email: 'bad' }, { ...input, website: 'javascript:alert(1)' }, { ...input, fullName: 'x'.repeat(17000) }]) {
    const response = await handleIntake(request(body), { db, rateSalt: 'test' });
    assert.ok([400, 413].includes(response.status));
  }
  const limited = await handleIntake(request(), { db: { rpc: async () => ({ error: { message: 'rate-limit' } }) }, rateSalt: 'test' });
  assert.equal(limited.status, 429);
});
const env = { serviceKey: 'server-only', apiKey: 'email-secret', from: 'MyAPI <contact@example.com>', to: 'yada@myorder.ai,sukanya@myorder.ai', siteUrl: 'https://myapi.example' };
const workerRequest = (key = env.serviceKey) => new Request('https://test.example', { method: 'POST', headers: { Authorization: `Bearer ${key}` } });
test('email worker rejects non-service callers and missing configuration does not consume pending jobs', async () => {
  const db = { rpc: async () => { throw new Error('must not claim'); } };
  assert.equal((await handleNotifications(workerRequest('anon'), { db, ...env })).status, 401);
  assert.equal((await handleNotifications(workerRequest(), { db, ...env, apiKey: '' })).status, 503);
});
test('email failures preserve leads and retries use the same provider idempotency key', async () => {
  const recorded = []; const keys = []; let succeeds = false;
  const db = { rpc: async (name, args) => {
    if (name === 'myapi_claim_notifications') return { data: [{ lead_id: input.submissionId, lock_token: 'lease-1' }], error: null };
    assert.equal(name, 'myapi_finish_notification'); recorded.push(args); return { error: null };
  } };
  const send = async (_url, options) => { keys.push(options.headers['Idempotency-Key']); return new Response(JSON.stringify(succeeds ? { id: 'mail-1' } : {}), { status: succeeds ? 200 : 500 }); };
  const first = await handleNotifications(workerRequest(), { db, ...env, send });
  assert.deepEqual(await first.json(), { sent: 0, failed: 1 }); assert.equal(recorded[0].p_provider_id, null);
  succeeds = true;
  const second = await handleNotifications(workerRequest(), { db, ...env, send });
  assert.deepEqual(await second.json(), { sent: 1, failed: 0 }); assert.equal(recorded[1].p_provider_id, 'mail-1');
  assert.equal(keys[0], keys[1]); assert.equal(recorded[1].p_token, 'lease-1');
});
