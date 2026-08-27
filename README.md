# BestLinePicker

BestLinePicker is a sports odds comparison web app that helps users compare live sportsbook lines across supported leagues. The app shows available games, sportsbook odds, best-line highlights, payout calculations, snapshot history, and tracked lines.

The project uses a Next.js frontend, a Django backend, and The Odds API for odds data. The frontend communicates with the backend through Next.js API proxy routes so the browser does not call the Django API directly.

## Current Features

- Live odds comparison for supported sports
- Supported leagues: NFL, NBA, and MLB
- League-specific pages
- Game selector and game cards
- Market tabs for Moneyline, Spread, and Total
- Sportsbook odds comparison table
- Best odds / best line highlighting
- Stake calculator with implied probability, payout, profit, and best-line comparison
- Preferred sportsbook filtering through “My Books”
- Action Network-inspired odds settings filters
- Auto-refresh with last updated timestamp
- Snapshot saving and snapshot history (per-account, requires sign-in)
- Tracked lines page (per-account, requires sign-in)
- Lightweight line movement alerts/status indicators
- Guide / terminology page
- Earthy, Figma-inspired card-based UI
- Firebase Authentication (Google sign-in + email/password with email verification)

## Tech Stack

### Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Lucide React icons
- App Router
- Firebase (Authentication + Firestore client SDK)

### Backend

- Django
- Django REST Framework
- django-cors-headers
- requests
- python-dotenv
- firebase-admin

### Data / Storage

- The Odds API for sports odds
- Cloud Firestore for user-specific snapshots and tracked lines, written directly by the frontend via the Firebase client SDK, under `users/{uid}/snapshots` and `users/{uid}/trackedLines`
- SQLite for local Django development

> Note: `bestline-backend/api/services/firestore.py`, `snapshot_service.py`, and `tracking_service.py` also write to Firestore, via the Firebase **Admin** SDK, into flat top-level `snapshots` and `tracked_lines` collections. That path predates user accounts and is no longer called by the frontend — it's kept only because removing it wasn't required. The two paths use the same Firestore project but never the same documents.

## Project Structure

```txt
BestLinePicker/
├── firestore.rules              # Firestore security rules (paste into Firebase Console)
├── bestline-frontend/
│   ├── app/
│   │   ├── [league]/page.tsx
│   │   ├── api/
│   │   │   ├── odds/route.ts
│   │   │   ├── event-odds/route.ts
│   │   │   ├── snapshots/route.ts    # unused by the frontend now, kept intact
│   │   │   └── tracking/route.ts     # unused by the frontend now, kept intact
│   │   ├── guides/page.tsx
│   │   ├── history/page.tsx          # gated: sign-in + verified email required
│   │   ├── settings/page.tsx
│   │   ├── tracking/page.tsx         # gated: sign-in + verified email required
│   │   └── providers.tsx             # wraps children in <AuthProvider>
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthProvider.tsx      # Firebase auth state + actions (useAuth)
│   │   │   ├── AuthModal.tsx         # sign-in/verify dialog, opened from anywhere
│   │   │   ├── AuthForm.tsx          # Google + email/password form
│   │   │   ├── AuthGate.tsx          # full-page sign-in/verify gate
│   │   │   ├── VerifyEmailNotice.tsx # verification-required card
│   │   │   ├── UserMenu.tsx          # header avatar/email/sign-out
│   │   │   └── SignInButton.tsx      # header sign-in trigger
│   │   ├── guides/
│   │   ├── layout/
│   │   ├── odds/
│   │   ├── snapshots/
│   │   ├── tracking/
│   │   └── ui/
│   ├── lib/
│   │   ├── firebase.ts               # Firebase app/auth/Firestore init
│   │   ├── auth/
│   │   │   ├── validation.ts         # email/password client-side validation
│   │   │   ├── errors.ts             # Firebase error code -> friendly message
│   │   │   └── useRequireVerifiedUser.ts
│   │   └── firestore/
│   │       ├── snapshots.ts          # users/{uid}/snapshots CRUD
│   │       └── trackedLines.ts       # users/{uid}/trackedLines CRUD
│   ├── styles/
│   └── types/
│
└── bestline-backend/
    ├── api/
    │   ├── services/
    │   │   ├── odds_api.py
    │   │   ├── odds_cache.py
    │   │   ├── odds_normalizer.py
    │   │   ├── odds_service.py
    │   │   ├── snapshot_service.py
    │   │   └── tracking_service.py
    │   ├── urls.py
    │   └── views.py
    ├── config/
    │   ├── settings.py
    │   └── urls.py
    ├── manage.py
    └── requirements.txt
```

## Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/nfl` | NFL odds page |
| `/nba` | NBA odds page |
| `/mlb` | MLB odds page |
| `/guides` | Guides and terminology |
| `/history` | Snapshot history (sign-in + verified email required) |
| `/tracking` | Tracked lines (sign-in + verified email required) |
| `/settings` | App settings |
| `/calculator` | Calculator placeholder / mockup |
| `/arbitrage` | Arbitrage placeholder / mockup |

## API Proxy Routes

The frontend uses Next.js route handlers as proxy routes. These routes forward requests to the Django backend.

| Frontend Proxy Route | Django Backend Route | Purpose |
| --- | --- | --- |
| `/api/odds` | `/api/odds` | Fetch odds list |
| `/api/event-odds` | `/api/event-odds` | Fetch event-specific odds |
| `/api/snapshots` | `/api/snapshots` and `/api/snapshots/list` | Save and list snapshots |
| `/api/snapshots/[snapshotId]` | `/api/snapshots/<snapshot_id>` | Load snapshot detail |
| `/api/tracking` | `/api/tracking` | List and create tracked lines |
| `/api/tracking/[trackingId]` | `/api/tracking/<tracking_id>` | Delete tracked line |
| `/api/tracking/[trackingId]/stake` | `/api/tracking/<tracking_id>/stake` | Update tracked line stake |

## Backend API Routes

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/odds` | Fetch odds for supported sports and markets |
| `GET` | `/api/event-odds` | Fetch odds for a specific event |
| `POST` | `/api/snapshots` | Save a snapshot |
| `GET` | `/api/snapshots/list` | List saved snapshots |
| `GET` | `/api/snapshots/<snapshot_id>` | Load snapshot details |
| `POST` | `/api/best-price` | Calculate best price comparison for an event |
| `GET` | `/api/tracking` | List tracked lines |
| `POST` | `/api/tracking` | Create a tracked line |
| `DELETE` | `/api/tracking/<tracking_id>` | Delete a tracked line |
| `PATCH` | `/api/tracking/<tracking_id>/stake` | Update stake for a tracked line |

## Firebase Authentication & User Data

BestLinePicker uses Firebase Authentication and Cloud Firestore to make saved
snapshots and tracked lines private to each signed-in user, without touching
the existing odds pipeline:

```txt
Next.js frontend
    ↓
Next.js API proxy routes → Django → The Odds API      (odds, unchanged)

Next.js frontend
    ↓
Firebase Authentication → Cloud Firestore              (snapshots, tracked lines)
```

Django remains completely unaware of Firebase users — no Admin SDK token
verification, no custom claims, no user model. Auth and per-user persistence
live entirely in the frontend, talking to Firestore through the client SDK.

### Sign-in methods

- Google sign-in (popup)
- Email/password, with Firebase email verification required before a user's
  snapshots or tracked lines are written or read

### Firestore schema

```txt
users/{uid}/snapshots/{snapshotId}
users/{uid}/trackedLines/{trackedLineId}
```

Nesting documents under the owning user's UID means ownership is a property
of the *path*, not a field a query has to remember to filter on — a client
can't construct a request that reaches another user's subcollection, and the
security rule below is a single check instead of one repeated in every query.

### Security model

Four independent layers, each doing a different job:

| Layer | Responsibility |
| --- | --- |
| React form validation | UX — catches obviously bad input before a network call |
| Firebase Authentication | Identity — proves *which* account is making the request |
| Email verification | Proves the account owns the email address, not just that a password was set |
| Firestore Security Rules | Authorization — the actual boundary preventing User A from reading/writing User B's data |

Only the last layer is a real security boundary. Hiding a "Save Snapshot"
button from a signed-out user is a UX nicety, not protection — the security
rules are what actually reject the request if someone calls Firestore
directly. See [`firestore.rules`](firestore.rules) at the repo root for the
full rules; the core of it:

```js
match /users/{uid} {
  match /snapshots/{snapshotId} {
    allow read, write: if request.auth != null
      && request.auth.uid == uid
      && request.auth.token.email_verified == true;
  }
  match /trackedLines/{trackedLineId} {
    allow read, write: if request.auth != null
      && request.auth.uid == uid
      && request.auth.token.email_verified == true;
  }
}
```

`request.auth.token.email_verified` comes from the user's Firebase ID token
directly — Firebase sets it for both Google and verified email/password
accounts, so no Admin SDK or custom claims are needed to enforce
verification at the rules layer.

### Setting up Firebase (reuse the existing project)

`bestline-backend/.env`'s `FIREBASE_SERVICE_ACCOUNT_PATH` already points at a
live Firebase project used by the Admin SDK. Reuse that same project for
Authentication rather than creating a second one — open the
[Firebase Console](https://console.firebase.google.com), select that
project, then:

1. **Authentication → Sign-in method** → enable **Google** and
   **Email/Password**.
2. **Project settings → General → Your apps** → add a **Web app** (if one
   doesn't already exist) → copy the `firebaseConfig` values.
3. **Firestore Database** → if not already created, create it (production
   mode) → **Rules** tab → paste the contents of `firestore.rules` → **Publish**.
4. **Authentication → Settings → Authorized domains** → confirm `localhost`
   is present for local development, and add your production domain (e.g.
   `your-app.vercel.app` or a custom domain) before deploying.

### Environment variables

Add these to `bestline-frontend/.env.local` (see the table below) using the
values copied from step 2 above, and the same values as environment
variables in your Vercel project for production.

These are intentionally `NEXT_PUBLIC_` and shipped to the browser — that's
expected. Firebase's client config (API key, project ID, etc.) identifies
*which* Firebase project a request is for, the same way a public database
hostname would; it is not a secret and isn't how Firestore is secured.
Security comes from Firebase Authentication + the Firestore rules above, not
from hiding this config. What must never reach the frontend is the Admin SDK
**service account JSON** (`FIREBASE_SERVICE_ACCOUNT_PATH` in the backend) —
that key can bypass all security rules and belongs on the server only.

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repo-url>
cd BestLinePicker
```

### 2. Backend setup

```bash
cd bestline-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a backend `.env` file inside `bestline-backend/`:

```env
ODDS_API_KEY=your_odds_api_key_here
FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/firebase-service-account.json
```

Run database migrations:

```bash
python manage.py migrate
```

Start the Django server:

```bash
python manage.py runserver
```

By default, the backend runs at:

```txt
http://127.0.0.1:8000
```

### 3. Frontend setup

Open a second terminal:

```bash
cd bestline-frontend
npm install
```

Create a frontend `.env.local` file inside `bestline-frontend/`:

```env
DJANGO_API_BASE_URL=http://127.0.0.1:8000/api

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Fill in the `NEXT_PUBLIC_FIREBASE_*` values from the Firebase Console (see
[Firebase Authentication & User Data](#firebase-authentication--user-data)
above) before signing in will work.

Start the frontend development server:

```bash
npm run dev
```

By default, the frontend runs at:

```txt
http://localhost:3000
```

## Environment Variables

### Backend

| Variable | Required | Description |
| --- | --- | --- |
| `ODDS_API_KEY` | Yes | API key for The Odds API |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Yes for snapshots/tracking | Absolute path to the Firebase service account JSON file |

### Frontend

| Variable | Required | Description |
| --- | --- | --- |
| `DJANGO_API_BASE_URL` | Recommended | Backend API base URL used by Next.js proxy routes |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes, for auth | Firebase web app API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes, for auth | Firebase Auth domain (`<project>.firebaseapp.com`) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes, for auth | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes, for auth | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes, for auth | Firebase Cloud Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes, for auth | Firebase web app ID |

These are all safe to expose to the browser — see
[Firebase Authentication & User Data](#firebase-authentication--user-data)
for why. Without them, Firebase throws `auth/invalid-api-key` at module
load, which will fail `next build` entirely (not just sign-in at runtime) —
make sure they're set in every environment that runs a build, including
Vercel.

If `DJANGO_API_BASE_URL` is not set, the frontend proxy routes default to:

```txt
http://127.0.0.1:8000/api
```

## Supported Sports and Markets

### Sports

| App League | Odds API Sport Key |
| --- | --- |
| NFL | `americanfootball_nfl` |
| NBA | `basketball_nba` |
| MLB | `baseball_mlb` |

### Markets

| App Label | Odds API Market Key |
| --- | --- |
| Moneyline | `h2h` |
| Spread | `spreads` |
| Total | `totals` |

### Supported Sportsbooks

The backend currently supports these bookmaker keys:

- `draftkings`
- `fanduel`
- `betmgm`
- `caesars`
- `espnbet`
- `ballybet`

## Common Development Commands

### Frontend

```bash
cd bestline-frontend
npm run dev
npm run build
npm run start
npm run lint
```

### Backend

```bash
cd bestline-backend
source venv/bin/activate
python manage.py runserver
python manage.py migrate
python manage.py test
```

## Development Notes

- Keep the frontend API/proxy routes intact. The frontend should call `/api/...` routes, and those routes should forward to Django.
- Do not call The Odds API directly from client components.
- Keep odds fetching, filtering, calculator, snapshot, and tracking logic separated into reusable components and services.
- Avoid replacing live API-connected components with mock data.
- Keep large page components split into smaller pieces under `components/`.
- Use `sessionStorage` for settings that should persist only while the tab is open, such as temporary auto-refresh preferences.
- Snapshots and tracked lines are written directly by the frontend to Firestore (`lib/firestore/snapshots.ts`, `lib/firestore/trackedLines.ts`) under `users/{uid}/...`, gated by `AuthGate` / `useRequireVerifiedUser`. Don't route these through the Django proxy routes again — that path is legacy and unscoped by user.

## Troubleshooting

### `ODDS_API_KEY MISSING IN .env FILE`

Make sure `bestline-backend/.env` exists and includes:

```env
ODDS_API_KEY=your_odds_api_key_here
```

Then restart the Django server.

### Frontend cannot load odds

Check that:

1. The Django server is running at `http://127.0.0.1:8000`.
2. `bestline-frontend/.env.local` has the correct `DJANGO_API_BASE_URL`.
3. The backend `.env` file has a valid `ODDS_API_KEY`.
4. The browser is calling the Next.js proxy route, such as `/api/odds`, not the external API directly.

### Snapshots or tracking fail to save

Check that:

1. `FIREBASE_SERVICE_ACCOUNT_PATH` is set in `bestline-backend/.env`.
2. The path points to a valid Firebase service account JSON file.
3. Firestore is enabled for the Firebase project.
4. The Django server was restarted after changing `.env`.

### Sign-in fails with `auth/invalid-api-key` or the build fails on `/_not-found`

The `NEXT_PUBLIC_FIREBASE_*` environment variables are missing or empty.
Firebase validates its config as soon as the app initializes, so an empty
`NEXT_PUBLIC_FIREBASE_API_KEY` breaks every page, not just sign-in — set all
six variables in `.env.local` (and in Vercel for deployed environments).

### Save Snapshot / Track Line does nothing after signing in

Check that the signed-in email/password account has verified its email
(`user.emailVerified`). Both actions require a verified account by design —
Google accounts are verified automatically, but a fresh email/password
signup is not until the user clicks the link Firebase emails them. Use
"Resend Verification Email" from the verification card, then "I've Verified
My Email" after clicking the link.

### Firestore write fails with `permission-denied`

This means the security rules in `firestore.rules` haven't been published to
the Firebase project's Firestore Rules tab yet, or the signed-in user's
email isn't verified. Rules deny by default — an unpublished or
out-of-date ruleset, not a frontend bug, is the most common cause.

### CORS issues

The frontend should usually call the Next.js proxy routes, which then call Django. If calling Django directly during development, make sure the Django CORS settings include the frontend origin.

## Planned Improvements

- Improve dynamic search across currently loaded games
- Add persistent tab-session auto-refresh toggle
- Continue polishing guide page styling to match the rest of the app
- Expand supported leagues
- Improve tracked line movement alerts
- Add more robust empty, loading, and error states
- Continue splitting large components into smaller reusable components

## Status

BestLinePicker is currently a local development project with working frontend/backend integration, live odds fetching, backend caching, snapshot history, tracking, a redesigned card-based UI, and Firebase Authentication with per-user Firestore persistence for snapshots and tracked lines.
