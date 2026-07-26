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
- Snapshot saving and snapshot history
- Tracked lines page
- Lightweight line movement alerts/status indicators
- Guide / terminology page
- Earthy, Figma-inspired card-based UI

## Tech Stack

### Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS
- Lucide React icons
- App Router

### Backend

- Django
- Django REST Framework
- django-cors-headers
- requests
- python-dotenv
- firebase-admin

### Data / Storage

- The Odds API for sports odds
- Firebase / Firestore for snapshots and tracked lines
- SQLite for local Django development

## Project Structure

```txt
BestLinePicker/
├── bestline-frontend/
│   ├── app/
│   │   ├── [league]/page.tsx
│   │   ├── api/
│   │   │   ├── odds/route.ts
│   │   │   ├── event-odds/route.ts
│   │   │   ├── snapshots/route.ts
│   │   │   └── tracking/route.ts
│   │   ├── guides/page.tsx
│   │   ├── history/page.tsx
│   │   ├── settings/page.tsx
│   │   └── tracking/page.tsx
│   ├── components/
│   │   ├── guides/
│   │   ├── layout/
│   │   ├── odds/
│   │   ├── snapshots/
│   │   ├── tracking/
│   │   └── ui/
│   ├── lib/
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
| `/history` | Snapshot history |
| `/tracking` | Tracked lines |
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
```

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
- Use Firebase / Firestore-backed services for snapshots and tracked lines.

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

BestLinePicker is currently a local development project with working frontend/backend integration, live odds fetching, backend caching, snapshot history, tracking, and a redesigned card-based UI.
