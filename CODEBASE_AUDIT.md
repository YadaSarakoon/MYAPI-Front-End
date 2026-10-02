# MyAPI Codebase Audit

Audit date: 2026-10-02

This audit records the repository state before the cleanup phase. No files were deleted during the audit. Existing local changes to `src/pages/Production.tsx` and the new `src/features/production/` files predate this audit and are retained.

## Findings

| File / Component | Issue | Reason | Recommended Action | Risk |
| --- | --- | --- | --- | --- |
| `src/App.tsx`, `src/config/routes.tsx` | Competing route definitions; config routes are unused and omit Production/Billing | `App.tsx` defines the active routes directly; no import of `appRoutes` exists | Make `config/routes.tsx` the single complete route registry and have `App.tsx` render it; preserve current URLs | Medium: missing or changed routes would break navigation |
| `src/features/{auth,docs,landing,sandbox}/*Page.tsx` and indexes | Feature entry points only re-export implementations from `src/pages` | The feature architecture is currently a thin alias layer | Keep as route boundaries for now; move page implementations incrementally when isolated | Low now; high if moved wholesale due to page size and imports |
| `src/components/DashboardLayout.tsx`, `src/features/dashboard/components/DashboardLayout.tsx` | Two different unused dashboard layouts | Neither has a reference from active routes or pages | Remove both unused layouts and the dashboard feature barrel after reference check | Low: no active callers found |
| `src/components/layout/AppLayout.tsx` | Unused layout wrapper | No route or feature imports it | Remove after full reference check | Low |
| `src/components/common/Modal.tsx`, `EmptyState.tsx` | Unused shared components | No active imports or dynamic references found | Remove unless a documented planned caller is identified | Low; future feature work may otherwise recreate them |
| `src/shared/components/Button.tsx`, `Logo.tsx` | Unused duplicate primitives; login/signup define their own logo markup | Active pages use `components/common/Button` or inline logos | Remove unused copies; do not alter current page markup during cleanup | Low |
| `src/hooks/useLocalStorage.ts` | Unused hook | No call sites found | Remove after checking global references | Low |
| `src/utils/postman-parser.ts`, `src/types/api.ts` | Unused parser and generic API types | No imports/call sites found; endpoint data is independently hardcoded in Docs and Sandbox | Preserve the Postman JSON; decide whether the parser is a future integration utility before removal. Remove only types verified as unused | Medium: parser may be intended for later spec-driven rendering |
| `src/services/api/client.ts` | Generic client is unused and has a fixed Production base URL; no timeout or token provider | No feature calls `request()` | Keep as integration foundation; make environment/config and request options explicit without adding endpoint contracts | Medium: changes can affect future consumers |
| `src/pages/ApiDocs.tsx`, `src/pages/Sandbox.tsx` | Large pages mix presentation with local endpoint definitions and sample schemas | The same MyExpress API is represented in both pages and a Postman collection | Extract feature-local types/data/services in small batches; compare examples with the collection and preserve rendered behavior | High: broad extraction can affect navigation and examples |
| `src/pages/Billing.tsx` | Billing history, payment/document data and calculations are embedded in the page | All data is local constants; document buttons show alerts | Extract typed mock data and calculation logic; do not invent a billing API | Medium |
| Production feature files | Page is already split into components, data, types and `useProductionDashboard` | This was an existing uncommitted refactor; it keeps visual classes in components | Retain; verify mock/secret values and imports during cleanup | Medium: current build inherits an unrelated TypeScript error in Home |
| `src/pages/Login.tsx`, `SignUp.tsx`, `config/firebase.ts` | Google popup uses Firebase; email/password login and signup only navigate; no app auth session/provider | Firebase is not connected to route protection or a backend token exchange | Preserve current mock behavior; isolate Firebase calls only if behavior remains identical; do not claim backend auth | Medium |
| `src/data/myexpress-open-api.json`, Production credentials | Credential-like sample values and bearer examples are stored in client source; Production displays hardcoded credential-like values | Values may be placeholders, but validity cannot be proven from source | Replace embedded credential/token examples with explicit non-secret placeholders; rotate/revoke externally if any value is live | High if any value is valid |
| `src/assets/{vite.svg,react.svg,pic4.png,intro.png}` | Likely unused assets | Active code imports other specific images; no references found for these candidates | Recheck references in HTML/CSS and generated content, then remove confirmed dead files | Low for template SVGs; medium for images |
| `public/icons.svg`, `public/favicon.svg` | No references found in application source/HTML | Public files can be addressed by URL without imports | Check direct URL/CSS references; retain favicon if linked by deployment tooling | Low to medium |
| `src/App.css`, `src/index.css` | Empty stylesheets; only `index.css` is imported | No CSS rules exist in either file | Remove empty CSS import/file after confirming no tooling relies on the path | Low |
| `package.json`, `package-lock.json` | `lucide-react` has no imports | Dependency is not used by application source | Remove dependency and update lockfile; retain React/Firebase/Router/Vite/tooling dependencies | Low |
| `Home.tsx` | `ContactFormState` is unused | Baseline TypeScript build fails with TS6196; lint reports the same warning | Remove unused interface | Low; baseline build blocker |
| `index.html` | Tailwind is loaded from CDN rather than built by a local Tailwind dependency | Runtime styling depends on external CDN and the config is not represented in package dependencies | Preserve for this cleanup; changing styling pipeline is a separate project-level decision | High: changing it can alter all styling |

## Baseline Validation

- `npm.cmd run build`: failed before cleanup at `src/pages/Home.tsx` with TS6196 for unused `ContactFormState`.
- `npm.cmd run lint`: completed with one unused-interface warning for the same declaration.
- `package.json` has no test script and no test files were found in the repository inventory.
- `lucide-react` is declared but has no source imports.

## Scope Notes

- The Postman collection is retained as the only supplied API specification. No endpoint or response schema is to be invented for Production or Billing.
- `.env` and `.env.local` are excluded from inspection and must remain untouched.
- Asset and component deletion requires the reference checks listed above; no deletion is justified by filename alone.

## Cleanup Completed

- Centralized all existing routes through `src/config/routes.tsx` and kept the existing paths. Fixed Billing navigation to point to its existing `/billing` route instead of the unregistered `/wallet` path.
- Removed verified unused layouts, common components, shared duplicates, a hook, generic types, the unused Postman parser, empty CSS files, unreferenced assets, and the unused `lucide-react` dependency. The Postman collection itself and assets used by Landing, Docs, Sandbox, and Sidebar remain.
- Removed the unused `ContactFormState` declaration that blocked the baseline build.
- Moved API Docs and Sandbox static catalogs/types into their feature folders. Moved Sandbox request simulation into an explicitly mock-only service. Moved Billing sample data and pure formatting/date helpers into its feature folder. Production's existing split is retained.
- Moved the Firebase Google popup call behind an auth feature service; email/password login and signup remain mock flows.
- Improved the generic API client with `VITE_API_BASE_URL`, request timeout and caller cancellation, optional Bearer token, FormData support, 204 handling, and a shared API error class. No endpoint or response contract was added.
- Replaced credential/token-like example literals in the Postman collection and Production UI with non-secret placeholders. External credential revocation/rotation cannot be performed from this frontend repository.

## Final Validation

- `npm.cmd run build`: passed. Vite reports the existing main JavaScript chunk is above 500 kB; route-level code splitting remains a possible follow-up.
- `npm.cmd run lint`: passed with no findings.
- `npm.cmd ls --depth=0`: passed; the unused `lucide-react` dependency is no longer present.
- `git diff --check`: passed. The existing Postman JSON still parses after sanitization.
- No test script or test files were found, so no automated tests were run.
- `.env` and `.env.local` were not opened or modified.

## Remaining Issues

- Production and Billing still have mock data and no confirmed Backend contracts. The API client is a foundation and is not currently called by those features.
- Email/password login, signup, route protection, Firebase session-to-Backend identity, and logout are not implemented as real authenticated flows.
- Production's Webhook action still targets `/webhook`, which is not an application route. No route was invented as part of cleanup.
- Tailwind remains loaded from the CDN. Replacing the styling pipeline would have broader visual risk and was left unchanged.
- Bundle output retains a >500 kB warning; code splitting is deferred to a separately verified performance change.
