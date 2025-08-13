# Real-Time Inventory Dashboard (MERN)

A simplified real-time inventory dashboard inspired by a warehouse management system.

- Frontend: React + Redux Toolkit + Vite + Chart.js + Socket.io client
- Backend: Express + Socket.io + JWT (static token) + In-memory store
- Tests: Jest + Supertest (backend), Vitest + React Testing Library (frontend)

## Quick Start

### 1) Backend

```bash
cd backend
cp .env .env.local 2>/dev/null || true
# Env defaults already set in .env
npm install
npm run dev
```

Backend will start at http://localhost:4000

Auth token: `test-token` (configurable via `STATIC_TOKEN` in `.env`)

### 2) Frontend

Create a `.env.local` in `frontend/` (optional, defaults shown):

```
VITE_API_URL=http://localhost:4000
VITE_TOKEN=test-token
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

Open the shown URL (usually http://localhost:5173).

## Features

- Items table with inline quantity update and delete
- Add item form (name, quantity, category)
- Search by name or category (debounced)
- Real-time updates across clients via Socket.io
- Analytics chart (quantity per category)
- Basic JWT auth using a static token

## API

- `GET /items?q=<query>`
- `POST /items` body: `{ name, quantity, category }`
- `PUT /items/:id` body: partial `{ name?, quantity?, category? }`
- `DELETE /items/:id`

All endpoints require header: `Authorization: Bearer <STATIC_TOKEN>`

## Code Structure

- `backend/src/index.js`: Express + Socket.io server setup
- `backend/src/routes/items.js`: CRUD routes + broadcast events
- `backend/src/middleware/auth.js`: static token auth guard
- `backend/src/store/itemsStore.js`: in-memory items store
- `frontend/src/api/client.ts`: Axios client with token interceptor
- `frontend/src/slices/itemsSlice.ts`: Redux slice and thunks
- `frontend/src/socket.ts`: Socket.io client + Redux integration
- `frontend/src/components/`: UI components

## Tests

Backend:
```bash
cd backend
npm test
```

Frontend:
```bash
cd frontend
npm test
```

## Notes on Design Decisions

- Real-time: Socket.io chosen over polling for low-latency updates and simplicity
- Storage: In-memory for interview time constraints; could swap to MongoDB (Mongoose) and add indexes on `name`, `category`
- Performance: Limited fields returned by default (entire item is small). With MongoDB, would project needed fields and add indexes for search.
- Scaling to ~500 concurrent users: Can Use Node clustering or PM2, sticky sessions for Socket.io, Redis adapter for multi-instance pub/sub, .

## Commit Suggestions

- Setup Express server
- Add items routes and auth middleware
- Integrate Socket.io broadcasts
- Scaffold Vite React frontend
- Implement Redux, API client, Socket integration
- Add Inventory table, form, chart, search
- Add backend and frontend tests

## Security

- Static token for demo. In production, will use proper JWT issuance (login) and secure storage.
