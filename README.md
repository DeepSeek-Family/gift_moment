# Gift Moment — Backend

Production-grade Node.js backend for the Gift Moment platform. Handles authentication, gift cards, occasions, bookings, subscriptions, real-time chat, notifications, and payments. Built with Express, TypeScript, MongoDB, Redis, BullMQ, Socket.io, Stripe, and Firebase.

---

## Features

- **Authentication & Authorization** — JWT (access + refresh), bcrypt, OAuth (Google, Facebook)
- **Gift & Cards** — Occasions, card catalog, send-gift flow, booked cards
- **Subscriptions & Packages** — Stripe subscriptions with webhook handlers
- **Real-Time** — Socket.io for chat and live notifications
- **Payments** — Stripe integration and webhook handling
- **Background Jobs** — BullMQ with Redis (email worker, gift worker)
- **Search** — MeiliSearch for full-text search
- **Notifications** — Firebase Cloud Messaging, in-app notifications
- **Communications** — Nodemailer for email, Twilio for SMS
- **File Uploads** — Multer for secure uploads
- **Logging** — Winston with daily log rotation
- **Validation** — Zod for request validation
- **Security** — CORS, env-based config, structured error handling

---

## Tech Stack

| Layer          | Technology          |
|----------------|---------------------|
| Runtime        | Node.js 16+         |
| Framework      | Express.js          |
| Language       | TypeScript          |
| Database       | MongoDB + Mongoose  |
| Cache/Queue    | Redis + BullMQ      |
| Auth           | JWT, Passport       |
| Payment        | Stripe              |
| Real-Time      | Socket.io           |
| Notifications  | Firebase Admin SDK  |
| Email/SMS      | Nodemailer, Twilio  |
| Logging        | Winston             |
| Validation     | Zod                 |

---

## Prerequisites

- **Node.js** 16 or higher
- **MongoDB** 4.0+ (local or Atlas)
- **Redis** 6.0+
- **MeiliSearch** (optional, for search)
- **Docker & Docker Compose** (optional, for running services)

---

## Project Structure

```text
gift-moment/
├── src/
│   ├── app.ts                    # Express app setup
│   ├── server.ts                 # Entry point, DB/Redis/Socket/workers
│   ├── config/                   # Env, Redis, BullMQ, Stripe, Passport
│   ├── app/
│   │   ├── modules/              # Feature modules
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── banner/
│   │   │   ├── occasions/
│   │   │   ├── cards/
│   │   │   ├── sendgift/
│   │   │   ├── bookedcard/
│   │   │   ├── chat/
│   │   │   ├── message/
│   │   │   ├── notification/
│   │   │   ├── package/
│   │   │   ├── subscription/
│   │   │   └── rule/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── constant/
│   ├── handlers/                 # Stripe/subscription event handlers
│   ├── helpers/                  # Socket, email, Firebase, MeiliSearch, etc.
│   ├── shared/                   # Logger, response, validation, upload
│   ├── services/                 # Email and other shared services
│   ├── worker/                   # BullMQ workers (email, gift)
│   ├── DB/                       # DB connection and seed (super admin)
│   ├── errors/                   # Custom errors and error handlers
│   ├── types/                    # TypeScript types
│   └── util/
├── tests/
├── tsconfig.json
├── package.json
└── README.md
```

---

## Quick Start

### 1. Install Dependencies

```bash
git clone <repository-url>
cd gift-moment
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root with at least:

```env
# Server
PORT=5000
NODE_ENV=development
IP=0.0.0.0

# Database
DATABASE_URL=mongodb://localhost:27017/gift_moment_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
JWT_ISSUER=your_issuer
JWT_AUDIENCE=your_audience
tokenVersion=1

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Redis / BullMQ
BULLMQIP=localhost
BULLMQPORT=6379

# Stripe
STRIPE_API_SECRET=sk_...
WEBHOOK_SECRET=whsec_...

# Email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password
EMAIL_FROM=noreply@example.com

# Admin seed (optional)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password

# MeiliSearch (optional)
MEILI_HOST=http://localhost:7700
MEILI_API_KEY=your_key
INDEX=your_index

# OAuth (optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...

# Twilio (optional)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_NUMBER=...
```

### 3. Run Redis (and optionally MongoDB/MeiliSearch via Docker)

```bash
# Example: start Redis only
docker run -d -p 6379:6379 redis:7-alpine
```

### 4. Development

```bash
npm run dev
```

Server runs at `http://localhost:5000` (or the configured `PORT`). BullMQ workers (email, gift) start with the server.

### 5. Production Build and Run

```bash
npm run build
npm start
```

---

## Scripts

| Command              | Description                                |
|----------------------|--------------------------------------------|
| `npm run dev`        | Start dev server with hot reload           |
| `npm run build`      | Compile TypeScript to `dist/`              |
| `npm start`          | Run production server (`dist/server.js`)   |
| `npm run test`       | Run test suite                             |
| `npm run test:watch` | Run tests in watch mode                    |
| `npm run create-module` | Generate new module (via `gm.ts`)      |

---

## API Documentation

Base URL: `http://localhost:5000/api/v1`  
Stripe Webhook URL: `http://localhost:5000/api/stripe/webhook`

### Authentication

Most protected endpoints require:

```http
Authorization: Bearer <access_token>
```

Role guards are applied per route (for example: `USER`, `ADMIN`, `SUPER_ADMIN`).

Mongoose schema notes:

- Collection: `SendGift`
- Has `timestamps: true`
- `status` default: `"pending"`

---

## Production Notes

- Set `NODE_ENV=production` and use strong, unique secrets for JWT and Stripe.
- Ensure MongoDB and Redis are secured and backed up; use connection strings and Redis URLs appropriate for your host.
- Workers (email, gift) run in the same process; for scaling, consider running workers in separate processes or containers.
- Configure CORS and `IP`/`PORT` for your deployment environment.
- Logs are written by Winston; ensure `logs/` (or your configured path) is writable and rotated/archived as needed.
- Uncaught exceptions and unhandled rejections trigger process exit after logging; use a process manager (e.g. PM2) for restarts.

---

## Logging

Structured logging is provided by Winston. Typical layout:

```
logs/
├── success/
│   └── YYYY-MM-DD.log
└── error/
    └── YYYY-MM-DD.log
```

Use your deployment or monitoring tools to tail and aggregate these files.

---

## Error Handling

Errors are normalized and returned with appropriate HTTP status codes. Validation errors use Zod and are returned in a consistent format for client consumption.

---

## License

ISC

---

## Author

Abdur Razzak
