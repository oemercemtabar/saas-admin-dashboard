# OpsPulse — SaaS Admin Dashboard (Frontend)

A modern **SaaS Admin Dashboard** built with **React + TypeScript + Vite + TailwindCSS**, featuring **mocked APIs with MSW**, protected routes, KPI dashboard charts, users management with a drawer, ticket workflow, and system health + settings pages.

---

## Screenshots
<p align="center">
  <img src="docs/screenshots/login.jpeg" width="220" alt="Login" />
  <img src="docs/screenshots/dashboard.jpeg" width="220" alt="Dashboard" />
  <img src="docs/screenshots/users.jpeg" width="220" alt="Users" />
  <img src="docs/screenshots/user-drawer.jpeg" width="220" alt="User Drawer" />
</p>

<p align="center">
  <img src="docs/screenshots/tickets.jpeg" width="220" alt="Tickets" />
  <img src="docs/screenshots/health.jpeg" width="220" alt="Health" />
  <img src="docs/screenshots/settings.jpeg" width="220" alt="Settings" />
</p>
![Login](docs/screenshots/login.jpeg)
![Dashboard](docs/screenshots/dashboard.jpeg)
![Users](docs/screenshots/users.jpeg)
![User Drawer](docs/screenshots/user-drawer.jpeg)
![Tickets](docs/screenshots/tickets.jpeg)
![Health](docs/screenshots/health.jpeg)
![Settings](docs/screenshots/settings.jpeg)

---

## Features

### Auth & Routing
- Login page with token-based session (mocked)
- Protected routes (redirects to `/login` when not authenticated)
- Logout clears session and redirects

### Dashboard
- KPI cards (Active Users, Sessions, Crashes, Conversion)
- Trend charts (Line + Bar) using Recharts
- Range selector (7d / 14d / 30d)
- Recent activity feed
- Loading skeletons + error states

### Users
- Search + role filtering + pagination
- Row click opens a **User Drawer**
- Drawer supports:
  - Close via overlay click
  - Close via **Esc**
  - Body scroll lock
  - Sessions list per user

### Tickets
- Search + status filter + pagination
- Status update actions (`pending` → `in progress` → `resolved`)
- Toast feedback after actions

### System Health & Settings
- Simple data pages with consistent UX patterns
- Loading + error states

---

## Tech Stack

- **React + TypeScript**
- **Vite**
- **TailwindCSS**
- **React Router**
- **@tanstack/react-query**
- **@tanstack/react-table**
- **Recharts**
- **MSW (Mock Service Worker)** for API mocking in development

---

## Getting Started

### Install
```bash
npm install
```

---
### Run (dev)
```bash
npm run dev
```
App runs on:
•	http://localhost:5173

---

## Demo Login (MSW)
Use these credentials:
•	Email: admin@opspulse.dev
•	Password: admin123

Auth & APIs are mocked using MSW handlers during development.

---

## Project Structure (high level)
```txt
src/
  api/                 # API client + MSW worker bootstrap
  app/
    layouts/           # AppShell, layout-level UI
    pages/             # Route pages: Dashboard, Users, Tickets, Health, Settings, Login
    router.tsx         # Route definitions + protected routing
  components/          # Reusable UI components (Skeleton, etc.)
  features/            # Feature modules (dashboard/users/tickets/health/settings/auth)
  mock/                # MSW handlers
```

---

## Notes
•	This project uses MSW to simulate a real backend and API flows (auth, lists, detail views, updates).
•	Designed to be easily swapped to a real backend by replacing the API client + removing MSW.

---

## Roadmap / Next Ideas
•	Persist filters in URL query params
•	Add sorting to Users/Tickets tables
•	Add ticket detail drawer
•	Add health “status chips” + incident log
•	Add dark mode theme toggle
•	Replace MSW with real API (Rails / Node / etc.)