# AGENTS.md — Repo guidance for coding agents

Purpose
- Short, actionable guidance for AI coding agents to work productively in this repo.

Quick start
- Backend (local dev):
  - `cd backend && npm install && npm run dev` — runs `server.js` (default port 9090). See [backend/server.js](backend/server.js).
- Frontend (local dev):
  - `cd frontend && npm install && npm run dev` — Next.js app (default port 3000). See [frontend/README.md](frontend/README.md) and pages under [frontend/src/pages](frontend/src/pages).

Key files & locations
- Backend entry: [backend/server.js](backend/server.js)
- Backend routes/controllers: [backend/routes](backend/routes), [backend/controllers](backend/controllers)
- Backend models: [backend/models](backend/models)
- Uploads: [backend/uploads](backend/uploads) (ensure it exists and is writable)
- Frontend pages: [frontend/src/pages](frontend/src/pages)
- Frontend API client: [frontend/src/config/index.jsx](frontend/src/config/index.jsx)
- Redux store: [frontend/src/config/redux/store.js](frontend/src/config/redux/store.js)

Project conventions & important notes
- Frontend: Next.js + React; state via Redux Toolkit (`frontend/src/config/redux`).
- Backend: Express + Mongoose; multer handles file uploads to `uploads/`.
- API base URL: frontend expects backend at `http://localhost:9090` (check [frontend/src/config/index.jsx](frontend/src/config/index.jsx)).
- Sensitive data: `backend/server.js` currently contains a hard-coded MongoDB connection string — replace with `process.env.MONGODB_URI` for safety.
- Known issues to watch for:
  - `backend/models/connections.model.js` contains a model registration bug (schema vs variable mismatch). Fix before running tests or deploying.
  - Mixed import styles and reducer property name mismatches exist in some frontend reducers/pages (may cause runtime errors).

Guidance for agents
- Link, don't duplicate: prefer linking to existing docs (`frontend/README.md`) and source files rather than copying large blocks.
- Minimal edits: when changing shared config (ports, DB URIs), update both code and documentation; prefer environment variables.
- When adding files, run frontend linter/build and start backend dev server locally if making runtime changes.

If you need me to also patch the small issues (model bug, reducer naming), say which area to fix first and I will create focused PR-style edits.
