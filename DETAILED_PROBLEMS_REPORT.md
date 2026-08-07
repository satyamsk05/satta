# Detailed Technical Problems Report
## Matka Betting Application (mbot)

| Field | Details |
|-------|---------|
| **Repository** | https://github.com/satyamsk05/mbot |
| **Application Name** | matka |
| **Frontend** | Flutter (Dart) |
| **Backend** | Node.js + Express + MongoDB + Socket.io |
| **Report Date** | August 2026 |
| **Review Type** | Full Source Code Review |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview & Problems](#2-architecture-overview--problems)
3. [Security Vulnerabilities](#3-security-vulnerabilities)
4. [Frontend (Flutter) Issues](#4-frontend-flutter-issues)
5. [Backend (Node.js) Issues](#5-backend-nodejs-issues)
6. [UI / UX Problems](#6-ui--ux-problems)
7. [Business Logic & Game Design Flaws](#7-business-logic--game-design-flaws)
8. [Code Quality & Repository Hygiene](#8-code-quality--repository-hygiene)
9. [Legal & Compliance Risks](#9-legal--compliance-risks)
10. [Priority Matrix](#10-priority-matrix)
11. [Recommended Remediation Plan](#11-recommended-remediation-plan)

---

## 1. Executive Summary

This application is a hybrid of two loosely related systems:

- A **Flutter mobile client** designed as a full Matka/Satta style betting app (markets like DESAWAR, GALI, FARIDABAD, bank details, deposit/withdraw flows).
- A **Node.js backend** implementing a simple 0–9 random number prediction game with 1-minute rounds and 9x payout.

**Core Finding:** The two systems are **not properly integrated**. The Flutter app operates almost entirely offline using `SharedPreferences`, while the backend runs an independent game loop. This results in a non-functional multi-user product in its current state.

Additionally, the application contains multiple **critical security vulnerabilities**, weak authentication, unprotected admin endpoints, and local data storage that can be easily manipulated by end users.

**Overall Risk Rating: CRITICAL**

---

## 2. Architecture Overview & Problems

### 2.1 Current Architecture

```
┌─────────────────────────────┐       ┌─────────────────────────────┐
│     Flutter Mobile App      │       │      Node.js Backend        │
│                             │       │                             │
│  • SharedPreferences        │       │  • Express + MongoDB        │
│  • Local Auth (phone+pass)  │       │  • JWT Auth (username)      │
│  • Local Wallet             │  ✗    │  • 0-9 Prediction Game      │
│  • Hardcoded Markets        │ No    │  • Socket.io Events         │
│  • External Result Scraping │ Real  │  • Admin APIs (unprotected) │
│  • Bank Details (local)     │ Link  │  • Auto Round Engine        │
└─────────────────────────────┘       └─────────────────────────────┘
```

### 2.2 Problem: Complete Disconnect Between Client and Server

| Component | Flutter Behavior | Backend Behavior | Impact |
|-----------|------------------|------------------|--------|
| Authentication | Phone + Password stored in SharedPreferences (plain text) | Username + hashed password in MongoDB | Users registered on one side do not exist on the other |
| Wallet | Local double value, default ₹25,000 | MongoDB `walletBalance`, default 500 | Balance is not synchronized |
| Betting | Saved only in local history | Predictions stored in MongoDB with round linkage | Bets placed in app never reach the game engine |
| Results | Scraped from satta-king-fast.com | Random 0-9 generated every ~60 seconds | Completely different result systems |
| Admin | Local user list from SharedPreferences | Unprotected REST APIs + EJS dashboard | Two separate admin surfaces |

**Evidence (Flutter):**
- `lib/models/app_data.dart` – All user data, balance, bets, and bank details are read/written via `SharedPreferences`.
- Only external HTTP call is for result scraping via `api.allorigins.win`.

**Evidence (Backend):**
- `server.js` exposes `/api/auth`, `/api/users`, `/api/game`, `/api/admin`.
- No corresponding API client exists in the Flutter codebase.

### 2.3 Live Results Dependency

```dart
// lib/models/app_data.dart
final url = Uri.parse(
  'https://api.allorigins.win/get?url=${Uri.encodeComponent('https://satta-king-fast.com/')}'
);
```

**Problems:**
- Relies on a third-party CORS proxy.
- Depends on the HTML structure of an external website remaining stable.
- No fallback mechanism.
- No caching strategy.
- Introduces latency and single point of failure.

### 2.4 Unused Real-time Infrastructure

Backend emits:
- `new_round`
- `round_closed`
- `balance_updated`

Flutter does not connect to Socket.io at all. Real-time features are effectively dead code.

---

## 3. Security Vulnerabilities

### 3.1 Unprotected Admin Endpoints (CRITICAL)

**Location:** `admin/adminController.js`

All routes under `/api/admin` lack authentication middleware:

| Endpoint | Method | Capability |
|----------|--------|------------|
| `/api/admin/rounds` | POST | Force start new round (closes existing active rounds) |
| `/api/admin/rounds/:id/close` | POST | Manually declare any winning number |
| `/api/admin/users/:id/wallet` | POST | Add/subtract any amount from any user’s wallet |
| `/api/admin/users/:id` | DELETE | Permanently delete user + all their predictions |
| `/api/admin/system/reset` | POST | Wipe all predictions & rounds, reset all wallets to 1000 |

**Also unprotected:**
- `GET /admin` – Full EJS dashboard showing users, rounds, recent predictions.

**Impact:** Any internet user who discovers the API can take complete control of the system, steal balances, declare fake winners, or destroy data.

### 3.2 Hardcoded JWT Secret (HIGH)

```js
// auth/authController.js & auth/authMiddleware.js
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkeyjwt12345';
```

- Fallback secret is weak and public.
- If `JWT_SECRET` environment variable is not set, the weak secret is used.
- Tokens can be forged offline.

### 3.3 Weak Password Security

**Backend:**
```js
const hashedPassword = await bcrypt.hash(password, 8); // rounds = 8
```
Recommended minimum is 10–12. Lower cost factor makes brute-force easier.

**Frontend:**
```dart
// lib/models/app_data.dart
await _prefs!.setString('user_${phone}_password', password); // plain text
```
Passwords are stored in clear text on the device. Anyone with physical or ADB access can extract them.

### 3.4 Client-Side Wallet (HIGH)

```dart
_walletBalance = _prefs!.getDouble('user_${_currentUserPhone}_balance') ?? 25000.0;
```

- Balance lives entirely on the device.
- Can be modified with any SharedPreferences editor or by reverse-engineering the app.
- Default starting balance of ₹25,000 encourages abuse.

### 3.5 Race Conditions in Betting (HIGH)

**Backend (`games/gamesController.js`):**
```js
user.walletBalance -= points;
await user.save();
// ... later create prediction
```

No MongoDB session/transaction is used. Concurrent requests can overdraw the wallet.

### 3.6 Missing Security Headers & Protections

- No `helmet` middleware.
- No rate limiting on auth or betting endpoints.
- CORS is fully open (`app.use(cors())`).
- No request size limits beyond Express defaults.
- No input sanitization library.

### 3.7 Sensitive Data on Device

Bank account number, IFSC, holder name, and UPI ID are stored in SharedPreferences without encryption.

---

## 4. Frontend (Flutter) Issues

### 4.1 Authentication Model Mismatch

| Flutter | Backend |
|---------|---------|
| Phone number as identity | Username as identity |
| Plain-text password | bcrypt hashed password |
| No JWT handling | Issues JWT on login |

Login/Register flows in `auth_screen.dart` never call the backend.

### 4.2 God Object – AppData

`lib/models/app_data.dart` (365+ lines) is a singleton that manages:
- Auth state
- Wallet
- Bet history
- Markets
- Themes
- Bank details
- Live result scraping
- Admin user listing

This violates single-responsibility principle and makes testing/maintenance difficult.

### 4.3 Oversized Screen Files

| File | Approximate Lines | Responsibility |
|------|-------------------|----------------|
| `utility_screens.dart` | 1191 | Deposit, Withdraw, Bank, Profile, multiple helpers |
| `theme_settings_screen.dart` | 649 | Theme selection UI |
| `place_bet_screen.dart` | 600 | Betting interface + number grids |
| `auth_screen.dart` | 453 | Splash + Login/Signup |
| `dashboard_screen.dart` | 391 | Home + market cards |

These files should be split into smaller widgets and feature modules.

### 4.4 Hardcoded Market Data

```dart
final List<Market> _markets = [
  Market(id: '1', title: 'DESAWAR', openTime: '10:00 PM', ...),
  Market(id: '2', title: 'DELHI BAZAR', ...),
  // ...
];
```

Markets cannot be managed from the backend or admin panel.

### 4.5 Theme System Fragility

Theme is controlled via a static variable:
```dart
AppTheme.activeTheme = appData.currentTheme;
```
This can cause inconsistent theming across the widget tree and makes reactive updates harder.

### 4.6 Missing Error & Loading States

Many network and async operations lack:
- Proper loading indicators
- User-friendly error messages
- Retry mechanisms
- Offline detection

---

## 5. Backend (Node.js) Issues

### 5.1 Project Structure

```
server.js
auth/
database/
games/
rounds/
users/
admin/
views/
```

Structure is reasonable, but:
- No `routes/` separation from controllers in some places.
- `node_modules` is committed (see section 8).
- No environment configuration module.

### 5.2 Game Engine Design

**File:** `games/gameEngine.js`

- Polls every 5 seconds to check if an active round has expired.
- Creates a new 60-second round when none is active.
- Picks winner with `Math.floor(Math.random() * 10)`.
- Pays 9× points to winners.

**Issues:**
- Polling-based instead of precise timers (can drift).
- No locking; theoretical possibility of multiple active rounds under high load.
- Random number generation is not cryptographically secure (acceptable for a demo, not for real money).

### 5.3 Missing Features

- No user role system (admin vs player).
- No bet cancellation window.
- No maximum bet limits.
- No daily loss limits.
- No audit logging of admin actions.
- No pagination on history endpoints.

### 5.4 Package.json Deficiencies

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1"
}
```
- No `start` or `dev` script.
- `main` field points to non-existent `index.js`.

---

## 6. UI / UX Problems

### 6.1 Positive Observations
- Modern dark splash with “GO MATKA” branding.
- Multiple theme presets (Royal Light, Neon Cyber, Royal Gold, Amethyst).
- Glassmorphism-style cards attempted.
- Clear navigation structure (Dashboard, Live Results, etc.).

### 6.2 Issues

| Area | Problem |
|------|---------|
| Auth | Phone-based identity does not match backend username model |
| Consistency | Mix of light and dark design tokens across screens |
| Feedback | Insufficient loading/error states |
| Accessibility | Limited consideration for larger fonts / contrast in some themes |
| Admin Panel (Flutter) | Exists but operates only on local SharedPreferences data |
| Deposit/Withdraw | UI exists but performs only local balance mutation |

### 6.3 Place Bet Screen Complexity
- Supports Jodi (00–99) and Harup (0–9 Ander/Bahar).
- Number grid generation is dynamic.
- However, submitted bets never reach the backend game engine.

---

## 7. Business Logic & Game Design Flaws

### 7.1 Dual Game Systems

1. **Backend:** Simple single-digit (0–9) prediction, 9x payout, 1-minute rounds.
2. **Frontend:** Multi-market Matka style (Jodi, Harup) with external result scraping.

These two systems do not interact.

### 7.2 Economic Model

- Backend house edge ≈ 10% (fair random + 9x payout).
- Frontend gives ₹25,000 starting balance with no real money flow.
- No responsible gaming limits.

### 7.3 Settlement

- Backend settles correctly for its own predictions.
- Frontend bets remain in “Pending” status indefinitely (no settlement logic).

### 7.4 Payment Flows

Deposit and Withdraw only modify the local `double` balance. No payment gateway, no webhook, no admin approval workflow.

---

## 8. Code Quality & Repository Hygiene

### 8.1 Critical Repository Issues

| Issue | Severity | Details |
|-------|----------|---------|
| `node_modules` committed | High | Thousands of files; repo is bloated; security risk |
| Empty / default README | Medium | Only Flutter template text |
| No `.env.example` | High | Developers cannot know required variables |
| `Scene.json` (≈400 KB) | Low | Purpose unclear; possible leftover |
| Flutter SDK constraint `^3.12.2` | Medium | May not match current stable releases |

### 8.2 .gitignore Gaps
`node_modules` was either never ignored or was force-added. Platform build folders are partially present.

### 8.3 Testing
- Almost no unit or integration tests.
- Only a default Flutter `widget_test.dart` exists.

### 8.4 Dependency Hygiene
- Both `ejs` and `express-handlebars` are listed; only EJS is used.
- Some packages have very recent major versions that may introduce breaking changes.

---

## 9. Legal & Compliance Risks

- Application uses real Matka market names (DESAWAR, GALI, FARIDABAD, etc.).
- Includes bank account / UPI collection UI.
- Designed as an online betting platform.
- In most Indian states, Matka and online satta are illegal.
- Deploying this application in production carries significant legal risk for the operator.

**Recommendation:** Treat the current codebase strictly as a technical demo / learning project. Do not process real money or real user bank details without proper licensing and legal clearance.

---

## 10. Priority Matrix

| Priority | Issue | Category | Effort to Fix |
|----------|-------|----------|---------------|
| P0 | Admin routes + dashboard have no authentication | Security | Medium |
| P0 | Frontend completely disconnected from backend | Architecture | High |
| P0 | Passwords stored in plain text on device | Security | Low–Medium |
| P0 | Client-side wallet can be freely modified | Security | High (requires architecture change) |
| P1 | Hardcoded JWT fallback secret | Security | Low |
| P1 | Race conditions on wallet deduction | Backend | Medium |
| P1 | `node_modules` committed to repo | Repo | Low |
| P1 | External scraping as sole result source | Reliability | High |
| P2 | Oversized Dart files | Maintainability | Medium |
| P2 | Missing rate limiting & security headers | Security | Low–Medium |
| P2 | No proper README / .env.example | Documentation | Low |
| P2 | Socket.io not used by client | Architecture | Medium |
| P3 | Theme system implementation | UI | Low |
| P3 | Unused / mixed dependencies | Code quality | Low |

---

## 11. Recommended Remediation Plan

### Phase 1 – Immediate Security Hardening (1–3 days)
1. Add JWT + role-based middleware to every `/api/admin` route.
2. Protect the `/admin` EJS dashboard with authentication.
3. Remove hardcoded JWT secret; require strong `JWT_SECRET` from environment.
4. Increase bcrypt rounds to at least 12.
5. Add basic rate limiting on auth endpoints.
6. Remove `node_modules` from git history and update `.gitignore`.

### Phase 2 – Architecture Unification (1–2 weeks)
1. Decide on a single source of truth (recommend: Backend + MongoDB).
2. Replace all SharedPreferences-based auth/wallet/bet logic with real API calls.
3. Implement proper JWT storage (secure storage plugin) on Flutter.
4. Connect Flutter to Socket.io for live round and balance updates.
5. Move market configuration to the backend.

### Phase 3 – Code Quality & UX (Ongoing)
1. Split large screen files into feature modules and smaller widgets.
2. Add loading, error, and empty states consistently.
3. Write a proper README with setup instructions and environment variables.
4. Introduce unit tests for critical paths (auth, betting, wallet).
5. Add MongoDB transactions for balance mutations.

### Phase 4 – Product Decisions
1. Clarify whether the product is a demo or a real money application.
2. If real money is intended, obtain legal advice and implement licensed payment gateways + responsible gaming features.
3. Replace external scraping with an owned or licensed result source.

---

## Appendix – Key File References

| Area | Path |
|------|------|
| Server entry | `server.js` |
| Auth controller | `auth/authController.js` |
| Auth middleware | `auth/authMiddleware.js` |
| Admin controller | `admin/adminController.js` |
| Game engine | `games/gameEngine.js` |
| Prediction model | `games/Prediction.js` |
| Round model | `rounds/Round.js` |
| User model | `users/User.js` |
| Flutter state | `lib/models/app_data.dart` |
| Auth UI | `lib/screens/auth_screen.dart` |
| Dashboard | `lib/screens/dashboard_screen.dart` |
| Place bet | `lib/screens/place_bet_screen.dart` |
| Theme | `lib/theme.dart` |

---

**End of Detailed Report**

*This report is based on static analysis of the repository source code. Runtime behavior, production environment configuration, and any private branches were not examined.*
