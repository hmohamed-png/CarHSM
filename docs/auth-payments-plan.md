# Authentication & Payments – Implementation Plan

This document outlines the scope, architecture, and incremental rollout for bringing real authentication and payment flows to UCarX while keeping the current Prisma + Express stack intact.

---

## 1. Objectives

- **Authentication**
  - Allow users to sign up and log in with phone + OTP (email/password optional).
  - Persist user sessions securely (HTTP-only cookies).
  - Expose role-aware APIs (owner vs. read-only guest) ready for future enterprise plans.
  - Enforce auth guards on sensitive endpoints (vehicles, maintenance, notifications, AI assistant).

- **Payments**
  - Simulate the Fawry bill-payment experience end-to-end.
  - Track pending/settled fines and maintenance invoices.
  - Provide a swappable adapter for a real PSP (Fawry, Paymob, Stripe).

---

## 2. Data Model Changes

| Model | Change | Notes |
| ----- | ------ | ----- |
| `User` | Add `phoneVerifiedAt`, `emailVerifiedAt`, `passwordHash`, `role` (enum), `lastLoginAt`, `otpSecret` (nullable) | OTP secret used to store last 6-digit code hash + expiry. |
| `Session` (new) | `id`, `userId`, `createdAt`, `expiresAt`, `revokedAt`, `ip`, `userAgent`, `refreshTokenHash` | Enables cookie-based sessions + refresh flow. |
| `OTPLog` (new) | `id`, `userId`, `channel`, `codeHash`, `expiresAt`, `consumedAt`, `meta` (JSON) | Audit trail, rate limiting. |
| `Payment` (new) | `id`, `userId`, `targetType`, `targetId`, `amount`, `currency`, `status`, `provider`, `reference`, `expiresAt`, `payload` (JSON) | Generic ledger for fines, maintenance invoices, marketplace boosts. |
| `TrafficFine` | Add `paymentStatus`, `paymentId` (FK) | Links to payment records. |
| `Maintenance` | Add `invoiceAmount`, `paymentStatus`, `paymentId` | Optional future monetisation (e.g., service center booking). |

Prisma migrations:
- `0002_add_auth_tables.sql` – new tables/columns for auth.
- `0003_add_payment_tables.sql` – payments & associations.

---

## 3. Server Architecture

### 3.1 Dependencies
- `argon2` (password hashing)
- `zod` (payload validation)
- `jsonwebtoken` (optionally, if going with stateless JWT access tokens)
- `uuid` (OTP/session IDs)
- `date-fns` (expiry calculations)

### 3.2 Auth Flow
1. **Sign Up**
   - `POST /api/auth/register`
   - Body: `{ phone, email?, password?, displayName }`
   - Create user record, hash password, send OTP (mock provider).
   - Return: `201` + message to verify.

2. **Send OTP**
   - `POST /api/auth/otp/send`
   - Create `OTPLog`, store hashed code + expiry (default 5 mins).
   - Mock provider returns `referenceId` (for tracing).

3. **Verify OTP / Login**
   - `POST /api/auth/otp/verify`
   - Validate code, mark user `phoneVerifiedAt`, issue session.

4. **Password Login** (optional fallback)
   - `POST /api/auth/login`
   - Validate credentials, issue session + refresh token.

5. **Session Management**
   - `POST /api/auth/logout` – revoke session.
   - `POST /api/auth/refresh` – issue new access token from refresh.

6. **Current User**
   - `GET /api/auth/me` – returns profile + scoped data (vehicles count, pending payments).

### 3.3 Middleware

| Middleware | Purpose |
| ---------- | ------- |
| `authRequired` | Checks for valid session (cookie `ucarx.sid`), attaches user to `req.context`. |
| `roleRequired(['owner'])` | Guards owner-only resources (payments, vehicle management). |
| `otpRateLimiter` | Prevents brute force (max 5 OTPs/hour per phone). |

### 3.4 Session Strategy
- **Access Token**: Signed JWT (15 min) sent as `Authorization: Bearer`.
- **Refresh Token**: Stored in `Session.refreshTokenHash`, issued via HTTP-only cookie (`ucarx.sid`, 30 days).
- Session revocation: set `revokedAt`, rotate refresh tokens on every login.

---

## 4. Payment Flow (Fawry Simulation)

### 4.1 Endpoints
1. `POST /api/payments/initiate`
   - Body: `{ targetType, targetId }`
   - Creates `Payment` with status `pending`, generates `reference`.
   - Returns mock Fawry instructions (reference number, expiry, amount).

2. `POST /api/payments/confirm`
   - Body: `{ reference, otpCode? }`
   - Marks payment `paid`, updates linked fine/invoice.
   - For sandbox: require OTP or mock success code.

3. `GET /api/payments/:id`
   - Returns status, receipt data, audit history.

4. Webhook simulator (future): `POST /api/payments/webhook/fawry`.

### 4.2 Frontend Integration
- Vehicles > Traffic Fines: “Pay via Fawry” button opens modal with instructions and OTP input.
- Maintenance timeline: show payment status; let owner mark service as paid.
- Dashboard: Payment summary widget (pending vs. completed).

### 4.3 Provider Abstraction

Create `server/providers/payments/fawry.js` with interface:
```js
async function initiatePayment({ user, amount, metadata }) { ... }
async function confirmPayment({ reference, otpCode }) { ... }
```
Switchable via `PAYMENT_PROVIDER=fawry` env var.

---

## 5. Frontend Work Streams

1. **Auth UI**
   - Replace static `LoginPage`/`RegisterPage` with real forms (phone, password/OTP).
   - Add OTP modal component (countdown, resend, error states).
   - Store auth state in context or React Query.
   - Protect routes using `RequireAuth` wrapper + fallback to `/login`.

2. **Profile & Settings**
   - Show verification status, allow OTP resend.
   - Toggle notifications, dark mode (persist to server).

3. **Payments UI**
   - New `PaymentModal` for Fawry instructions.
   - Update `TrafficFinesPage`, `MaintenanceTimeline` to show status tags.
   - Add `PaymentsPage` (history, receipts).

---

## 6. Rollout Strategy

1. **Phase A (Backend foundations)**
   - Prisma migrations (`User`, `Session`, `OTPLog`, `Payment`).
   - Implement auth endpoints + middleware.
   - Seed with demo user + pending fine payments.

2. **Phase B (Frontend auth)**
   - Wire login/register/OTP flows.
   - Protect routes, show user avatar/info.

3. **Phase C (Payments)**
   - Build payment endpoints & provider.
   - Update UI for fines + maintenance.

4. **Phase D (Polish & Testing)**
   - Add integration tests (Jest / Playwright) for auth + payment flows.
   - Update CI to run Prisma migrations + tests with seeded data.

---

## 7. Open Questions / Risks

- **SMS Provider**: currently mock; decide between AWS SNS, Twilio, local providers later.
- **Email Support**: optional pipeline; decide if we need email verification in v1.
- **Multi-device Sessions**: allow multiple concurrent refresh tokens or single-session policy?
- **Payment Settlement**: need cron/worker to expire unpaid references?
- **Compliance**: storing phone numbers + OTPs may require extra encryption at rest; consider using KMS.

---

## 8. Immediate Next Tasks

1. Generate Prisma migration `0002_auth_and_payments`.
2. Install auth dependencies (`argon2`, `jsonwebtoken`, `zod`, `uuid`, `date-fns`).
3. Implement `/api/auth/*` endpoints + session middleware.
4. Replace login/register UI with real forms and state handling.
5. Build payment initiation/confirmation endpoints + mock UI integration.

This plan keeps the system deployable without external services while leaving clear seams for real OTP and payment gateways later.
