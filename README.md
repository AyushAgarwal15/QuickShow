# QuickShow  
**A full-stack movie ticket booking platform built with React, Node.js & MongoDB**

---

> Book cinema tickets in seconds, manage shows in real-time, and get delightful insights – all from one lightning-fast web app.

---

## ✨ Features

* Public pages
  * Browse now-playing movies fetched live from **The Movie Database (TMDB)**.
  * Detailed movie page with trailer, cast, synopsis and upcoming show-times.
  * Interactive seat layout – select seats, checkout with **Stripe** and receive e-mails via **Brevo / SMTP**.
* Authentication & authorisation
  * Secure JWT auth with hashed passwords (bcrypt).
  * Persistent sessions stored in `localStorage` for the SPA.
  * Role based access (User & Admin).
* Admin dashboard
  * Add new shows (multiple date & time slots in one go).
  * List / delete shows and see real-time seat occupancy.
  * View all bookings & revenue statistics.
* Extra goodies
  * Favourites list for logged-in users.
  * Toast notifications, skeleton loaders and responsive Tailwind UI.
  * Deployed **serverless** on Vercel (both client & API) – zero-config CI/CD.

---

## 🏗️ Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 19, Vite, React-Router v7, Tailwind CSS, Lucide-React Icons, React-Hot-Toast |
| Backend   | Node.js 20, Express 5, MongoDB 8 (Mongoose 8), Stripe SDK, Cloudinary, Axios |
| Auth      | JSON Web Tokens (JWT), bcryptjs |
| Dev Tools | ESLint, Nodemon, Vercel, GitHub Actions (optional) |

---

## 📂 Repository Layout

```
.
├── client/          # React SPA (Vite)
│   └── src/
│       ├── pages/          # Route components
│       ├── components/     # Reusable UI pieces
│       ├── context/        # React Context for global state
│       └── assets/
├── server/          # REST API
│   ├── controllers/ # Route handlers / business logic
│   ├── routes/      # Express routers
│   ├── models/      # Mongoose schemas
│   ├── configs/     # DB & mailer setup
│   └── server.js    # App entry-point
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites

* Node.js ≥ 20.x
* npm ≥ 10.x (comes with Node)
* MongoDB Atlas cluster **or** local MongoDB instance
* TMDB, Stripe & Brevo accounts for API keys (free tiers supported)

### 2. Clone & install

```bash
# clone
$ git clone https://github.com/<your-username>/quickshow.git
$ cd quickshow

# install root dependencies (none) – then for each package:
$ cd server && npm install && cd ..
$ cd client && npm install && cd ..
```

### 3. Configure environment variables

Create two files, one for each package. You can copy the examples below:

<details>
<summary>server/.env</summary>

```dotenv
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net

# JWT
JWT_SECRET=super-secret-jwt-string

# TMDB (v4 Bearer token **or** v3 API key works)
TMDB_API_KEY=<tmdb-token>

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# E-mail (Brevo / SMTP)
SMTP_USER=<smtp-user>
SMTP_PASS=<smtp-pass>
SENDER_EMAIL="QuickShow <noreply@quickshow.com>"
```
</details>

<details>
<summary>client/.env</summary>

```dotenv
# Base URL that axios points to (make sure to include "/api" proxy when using Vercel)
VITE_BASE_URL=http://localhost:3000

# TMDB image host – change if you prefer proxying
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/w500

# Currency symbol shown in the UI
VITE_CURRENCY=$
```
</details>

### 4. Run locally

In two separate terminals or via a process manager:

```bash
# Terminal ① – API
$ cd server
$ npm run server        # starts nodemon on http://localhost:3000

# Terminal ② – SPA
$ cd client
$ npm run dev           # Vite dev server on http://localhost:5173
```

The React dev server proxies `/api/*` requests to `localhost:3000` so CORS issues are avoided.

---

## 📡 Production / Vercel deployment

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Set the **Build Command** & **Output Directory**:
   * Client: `npm run build` → `client/dist`
   * Server: Set as **Serverless Functions** (Vercel auto-detects).  
4. Define the same environment variables in Vercel dashboard.
5. Trigger a deploy – your API will be available at `/api/*` paths and the static site at the root URL.

_(Not using Vercel?  Any Node hosting (Render, Fly.io, Railway, Heroku) + static hosting (Netlify, S3) works just as well.)_

---

## 🔌 API Overview

All routes are prefixed with `/api`.

| Method | Route | Description |
|--------|-------|-------------|
| GET    | `/show/now-playing` | Fetch list of current movies from TMDB |
| POST   | `/booking/create`   | Create a booking & Stripe checkout session |
| POST   | `/auth/login`       | Email & password login |
| POST   | `/auth/register`    | Create account |
| GET    | `/admin/dashboard`  | Revenue & bookings stats (admin only) |

_See `/server/routes/*.js` for the full, self-documenting set._

---

## 🙌 Contributing

1. Fork the repo & create a new branch (`feat/my-feature`).
2. Commit your changes with clear messages.
3. Open a Pull Request describing **what** & **why**.
4. Make sure all linting (`npm run lint`) and tests (coming soon) pass.

### Code Style

* 2-space indentation.
* Follow ESLint rules – auto-fix with `npm run lint -- --fix`.
* Use semantic commit messages (`feat:`, `fix:`, `docs:` …).

---

## 📃 License

Distributed under the **MIT License**.  Feel free to use, modify & distribute.

---

> Made with ☕ + 🍿  – enjoy your movie night!
