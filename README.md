# MyAPI Developer Portal

React, TypeScript, and Vite frontend for the MyAPI developer portal.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Setup

```sh
npm install
```

Copy `.env.example` to `.env.local`, then set the Firebase project values. Firebase Email/Password and Google sign-in providers must be enabled in Firebase Authentication. Do not commit `.env.local`.

`VITE_API_BASE_URL` is intentionally explicit. The example uses the documented Development API base URL. The frontend API client refuses to send requests when this value is missing and does not default to Production.

## Run and verify

```sh
npm run dev
npm run build
npm run lint
```

## Backend integration status

Only Firebase Authentication is currently connected to a live service (email/password and Google sign-in). The MyExpress API client is a shared transport utility, but no portal feature calls it yet. Do not treat any portal metrics, credentials, or delivery records as live account data.

| Feature | Data source today | Live Backend connection |
| --- | --- | --- |
| Sign in / sign up / session | Firebase Authentication | Yes |
| Account profile in the console header and Settings | Current Firebase user | Yes, Firebase Auth only |
| Landing page and API Docs | Local content and documented Postman collection | No |
| Dashboard metrics, chart, activity, and checklist | `features/dashboard/data.ts` via `demoDashboardService` | No |
| Sandbox credentials and API responses | Local generation and `mockSandboxService` simulation | No MyExpress request is sent |
| Production access, credentials, usage, and activity | Static/demo values and local state | No |
| Webhook endpoints, settings, tests, and delivery logs | `features/webhook/data.ts` via `demoWebhookService` | No; test action sends no request |
| Billing history, payments, and documents | Local sample data via `demoBillingService` | No; document actions are unavailable |
| Settings preferences | Component-local state | No persistence service |

The mock implementations are isolated by feature under `features/<feature>/data.ts` and `features/<feature>/services/`. Firebase operations are isolated under `features/auth/services/`. Production access, dashboard analytics, webhook management, billing/payment, and preference API adapters must wait for confirmed Backend contracts.

The `src/data/myexpress-open-api.json` Postman collection is the current source for the public shipping API examples. It does not define the portal's Production access, dashboard analytics, webhook management, billing/payment, or user preference APIs. No portal endpoints or response envelopes are assumed by this frontend.

## Security

- Never place a MyExpress `client_secret` or service `access_token` in frontend code or Vite environment variables.
- Firebase web configuration identifies the Firebase project; access control must still be enforced by Firebase Authentication and Backend authorization.
- Keep real secrets in an approved server-side secret store.
