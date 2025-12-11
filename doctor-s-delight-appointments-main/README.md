Modex Ticket Booking System
Backend — Node.js, Express, PostgreSQL
Frontend — React.js, TypeScript
Deployed on Vercel & Render
📌 Overview

The Ticket Booking System is a full-stack application inspired by platforms like RedBus, BookMyShow, and Doctor Appointment Booking.
It enables:

Admins to create Shows / Trips / Slots

Users to book one or more seats

Real-time availability checks

Concurrency-safe booking (no overbooking)

Booking status: PENDING → CONFIRMED / FAILED

Special focus was given to:

✔ Scalable architecture
✔ Concurrency handling
✔ Database transactions
✔ Clean code structure
✔ Production-grade deployment
✔ Healthcare-friendly system design

🚀 Live Deployment
Component	URL
Frontend (Vercel)	https://your-frontend-url.vercel.app

Backend (Render/Railway)	https://your-backend-url.onrender.com

Postman Collection	https://…

🔁 Update URLs after deployment.

🏗️ Tech Stack
Backend

Node.js

Express.js

PostgreSQL

pg / pg-pool

Redis (optional for caching & locking)

Transaction-level concurrency control

UUID-based record IDs

Frontend

React.js

TypeScript

React Router DOM

Context API (Global State)

Axios

Deployment

Backend → Render / Railway

Frontend → Vercel

📦 Folder Structure
modex-ticket-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   └── app.js
│   ├── dist/
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
│
└── README.md

🗄️ Database Schema
1. shows
Field	Type
id	UUID (PK)
name	TEXT
start_time	TIMESTAMP
total_seats	INT
2. seats
Field	Type
id	UUID
show_id	UUID (FK)
seat_number	INT
is_booked	BOOLEAN
3. bookings
Field	Type
id	UUID
show_id	UUID
seat_numbers	INT[]
status	ENUM(PENDING, CONFIRMED, FAILED)
created_at	TIMESTAMP
🔒 Concurrency Handling

✔ Serializable Transactions
✔ SELECT … FOR UPDATE (row-level locking)
✔ Prevents:

Overbooking

Race conditions

Dirty reads

Flow:

Start transaction

Lock seats with FOR UPDATE

Check availability

Mark as booked

Commit transaction

Update booking → CONFIRMED

If seats are unavailable → ROLLBACK → FAILED

💡 Optional Bonus (Implemented / Optional)
Booking Expiry

A cron job or setTimeout marks PENDING bookings as FAILED after 2 minutes.

🔌 API Documentation
✔ /api/admin/shows

Create a show/trip

✔ /api/shows

Get all shows/trips

✔ /api/book

Book one or more seats

✔ /api/book/:id/status

Check booking status

Full Postman collection included in repo.

▶️ Running the Project Locally
1. Clone Repo
git clone https://github.com/yourname/modex-ticket-system.git
cd modex-ticket-system

🛠️ Backend Setup
cd backend
npm install

Create .env file
PORT=5000
DATABASE_URL=postgresql://username:password@host:5432/dbname
REDIS_URL=redis://localhost:6379   (optional)

Run migrations
npm run migrate

Start backend
npm start

💻 Frontend Setup
cd frontend
npm install

Create .env
VITE_API_BASE_URL=https://your-backend.onrender.com

Run frontend
npm run dev

☁️ Deployment Guide
Backend Deployment (Render / Railway)
Steps:

Create new Web Service

Select GitHub repo

Add env variables

Set build command:

npm install && npm run build


Set start command:

npm start


Connect to managed PostgreSQL

Deploy

Test APIs (Postman/browser)

Frontend Deployment (Vercel)
Steps:

New → Import GitHub Repo

Select frontend/ folder

Add Environment Variable:

VITE_API_BASE_URL = <backend-production-url>


Build command:

npm run build


Output:

dist


Deploy

🧠 Architecture Overview
✔ Modular MVC architecture
✔ Service layer to separate business logic
✔ Database consistency using locking
✔ Context API to manage global UI state
✔ Efficient re-render prevention
✔ Optimized API calls with memoization
🎨 Frontend Features
For Admin

Create shows/trips

List all shows

Basic form validation

For Users

View all shows

Select seats visually

Book seats

Realtime availability updates

Error handling for invalid seat selections

🔍 Known Limitations

No authentication (as per assignment rules)

WebSockets not implemented (optional bonus)

Admin panel is basic but functional

🧪 Testing

Load testing with parallel booking using Postman Runner

Verified row-level locks to prevent overbooking

Validated seat status updates

Verified API errors & frontend UI errors
