# CareConnect — MERN Emergency Help Platform

Connects people facing an emergency with nearby volunteers. Built with MongoDB, Express, React (Vite), and Node.js.

## Stack
- **Frontend:** React (Vite) + React Router, plain CSS (custom design system, no UI framework)
- **Backend:** Node.js + Express, session-based auth (`express-session`), password hashing (`bcrypt`)
- **Database:** MongoDB Atlas via Mongoose
- **Maps:** Google Maps JavaScript API (location picker + live request markers)

## Running it locally

You need **two terminals running at the same time.**

### 1. Backend
```bash
cd backend
npm install
node server.js
```
Should print:
```
MongoDB Atlas connected!
Server running at http://localhost:5000
```

Backend env vars live in `backend/.env`:
```
MONGO_URI=<your MongoDB Atlas connection string, including the database name>
SESSION_SECRET=<any random string>
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens at `http://localhost:5173`.

## Folder structure
```
backend/
  server.js            entry point
  config/db.js         MongoDB connection
  models/               Mongoose schemas (User, Request)
  routes/               Express routers (auth, requests)
  middleware/auth.js     session-check middleware
frontend/
  src/
    pages/               Landing, Login, Signup, RequestForm, Dashboard
    components/          Navbar, ProtectedRoute
    style.css            design system (CSS variables, components)
```

## Core flow
1. Sign up as either a **user** (needs help) or **volunteer** (responds to requests)
2. Log in — creates a server-side session, stored via a cookie
3. **User** → submit an emergency request with a location pin
4. **Volunteer** → sees all active requests on a dashboard map + list, can accept/decline

## Notable design decisions
- **Sessions over JWT** — simpler to reason about for a small app; the cookie is `httpOnly` by default via `express-session`
- **Mongoose schemas** enforce structure (required fields, enums) before anything reaches MongoDB
- **`requireAuth` middleware** centralizes the "is this user logged in" check instead of repeating it per-route
- **Client-side `ProtectedRoute`** improves UX (no flash of protected content) but isn't a security boundary on its own — the backend middleware is what actually protects the data
