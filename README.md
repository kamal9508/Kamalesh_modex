# Doctor Slot Booking System

**Live Demo:** [https://doctor-booking-170.web.app/](https://doctor-booking-170.web.app/)

A full-stack healthcare appointment booking system that allows users to view available doctor slots, book appointments, and manage bookings efficiently. The system prevents overbooking using concurrency-safe operations and provides real-time booking updates.

---

## Features

### Admin
- Add new doctors
- Create and manage slots
- View all doctors and slots

### User
- Browse doctors
- View available slots
- Book slots with real-time status (`PENDING`, `CONFIRMED`, `FAILED`)
- Handles booking conflicts gracefully

### Technical
- Concurrency-safe booking operations
- Optional booking expiry (auto-fail after 2 mins)
- Context API for global state management
- Responsive UI design

---

## Tech Stack

- **Frontend:** React.js, TypeScript, Context API
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Firebase Hosting (frontend), Supabase/Render (backend)

---

## Architecture

[React Frontend] <--REST API--> [Node.js/Express Backend] <--SQL Queries--> [Supabase PostgreSQL DB]

yaml
Copy code

- Admin & user actions trigger REST API calls
- Supabase handles data storage with atomic operations to prevent overbooking
- Firebase Hosting serves the frontend SPA

---

## Setup Instructions

### Backend
1. Clone the repo: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Create `.env` with:
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
PORT=5000

markdown
Copy code
4. Run server: `npm start`
5. Test APIs via Postman

### Frontend
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Create `.env` with:
REACT_APP_API_URL=<backend-deployed-url>

yaml
Copy code
4. Start dev server: `npm start`
5. Build for production: `npm run build`
6. Deploy using Firebase: `firebase deploy`

---

## API Endpoints

- `GET /doctors` → Get all doctors
- `POST /doctors` → Add new doctor
- `GET /slots/:doctorId` → Get slots for a doctor
- `POST /booking` → Book a slot
- `GET /booking/:id` → Check booking status

---

## Concurrency Handling

- Atomic database operations ensure no two users can book the same slot simultaneously.
- PENDING bookings auto-fail if not confirmed within 2 minutes.

---

## Future Enhancements

- WebSocket-based live slot updates
- Notifications for booking confirmation
- Analytics dashboard for admins
- Multi-clinic and multi-doctor support

---
