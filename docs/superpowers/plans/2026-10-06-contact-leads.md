> Historical Firebase implementation plan. Superseded by [Supabase setup](../../contact-leads-setup.md) on 2026-10-07.

# Contact leads implementation plan

> **For agentic workers:** Use superpowers:executing-plans to implement task by task.

**Goal:** Persist contact requests, give authorized staff a lead inbox, and queue email notifications independently of form submission.
**Architecture:** Existing Firebase Auth plus callable Functions, Firestore rules and an asynchronous Resend email worker. Public form retains its layout. Admin claims are provisioned by an operator, never by the client.
**Tech Stack:** React, TypeScript, Firebase, Node test runner.
**Spec:** ../specs/2026-10-06-contact-leads-design.md

## Global constraints
- No success before durable persistence; failed notification must not lose leads.
- Only verified admin-claim accounts can read customer data.
- Recipients: yada@myorder.ai and sukanya@myorder.ai, configured on the server.
- Keep credentials out of source and logs; deploy only after project configuration is established.

## Review focus
- Lost responses and concurrent duplicate requests must not duplicate leads.
- Invalid, oversized and injected input must be rejected server side.
- Guests and ordinary members cannot read or mutate leads.
- Failed/repeated notifications must preserve data and reuse an idempotency key.
- Logout/account switches must clear private data; edits must not overwrite another lead.

## Tasks
- [x] 1. Write Node tests for payload validation, rate limiting, deduplication and notification outcomes. Add `functions/contact-core.mjs`, `functions/index.mjs`, configuration, rules and operator script. Verify with Node tests and Emulator integration tests.
- [x] 2. Add `src/features/contact/ContactRequestForm.tsx`, Firebase client services and submit UI tests. Replace the placeholder handler in PastelSections. Verify retained input, success response, retry and pending state.
- [x] 3. Add `/admin/leads` and claim guard, paginated inbox/detail editor with search, statuses, notes, notification states and error handling. Add navigation and access tests.
- [x] 4. Add deployment guide and env examples; run build, lint, tests, security review and browser checks. Record unverified infrastructure requirements separately.

## Execution record
- 2026-10-06: User repeated instruction to implement after receiving spec; continue inline within the existing dev checkout. Do not request approval again for the agreed feature. No production credentials or Firebase CLI found so far; source implementation and local verification proceed independently of deployment.
- Validation: `npm test` passed (8 UI/access tests + 7 server unit tests). Firestore Emulator passed 4 integration tests including real server transaction and notification retries with a fake provider. Build and lint passed; Vite reports a large bundle warning. Browser checked form layout at mobile/default and 1280px, missing-configuration failure preserving inputs, and redirect from admin URL to login.
- Independent reviewer found no critical/important bug. Its missing-test observations were addressed with actual claim/account-switch tests and full trigger integration tests.
- Production remains pending: Firebase CLI `projects:list` returned authentication required. App Check site key is absent; no cloud deployment, real account claim grant or real email was performed. User confirmed Firebase exists but no email provider. Guide supports deploying intake first, then enabling Resend when sender/key are ready.
