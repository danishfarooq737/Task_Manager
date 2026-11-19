# 🚀 DF TaskManager — Dynamic Productivity & Task Tracking Suite (MERN)

> **Enterprise-Grade Full-Stack Task & Productivity Platform** built with the **MERN Stack** (MongoDB, Express, React, Node.js), featuring **zero-server localStorage persistence**, **Framer Motion spring physics**, and **Zero-Trust DevSecOps security**.

---

## 🛡️ Threat Model & OWASP Top 10 Security Architecture

Operating under a strict **Zero-Trust model**, the system treats every incoming network request as potentially hostile and enforces defensive layers across the transport, API, and persistence tiers:

| Attack Vector | Vulnerability Category | Mitigation Architecture |
|---|---|---|
| **NoSQL Injection** | OWASP A03: Injection | `express-mongo-sanitize` strips `$` operators and dots; inputs are strictly validated against strongly-typed **Zod** schemas before reaching Mongoose queries. |
| **Cross-Site Scripting (XSS)** | OWASP A03: Injection | Zero-Trust client and server sanitization stripping `<script>`, inline event handlers, and `javascript:` URIs; strict `Helmet.js` Content Security Policy (CSP). |
| **Credential Stuffing / Brute Force** | OWASP A07: Identification & Auth | Strict endpoint rate limiters (`authLimiter` allowing max 15 attempts / 15 mins) powered by `express-rate-limit`. |
| **Double-Click / Duplicate State Changes** | Concurrency & Race Conditions | **Idempotency Keys** (`Idempotency-Key` header with TTL cache) on backend; immediate submit button disabling and debouncing on frontend. |
| **Slow Network Drops & Hangs** | Network Resilience | AbortController request timeouts (default 8s); **Exponential Backoff and Retry** mechanism with jitter; UI loading skeletons. |
| **Denial of Service (DoS)** | OWASP A04: Insecure Design | 10kb request payload body limits; global API rate limiting (200 requests / 15 mins); connection pooling (max 20 pool size). |
| **Session Hijacking & XSS Token Theft** | OWASP A01: Broken Access Control | JWT tokens stored exclusively in `HttpOnly`, `SameSite=Strict`, `Secure` cookies with 12-round bcrypt password hashing. |
| **Data & Stack Trace Leakage** | OWASP A05: Security Misconfiguration | Production error middleware suppresses internal stack traces, DB schemas, and diagnostic data, returning generic, operational errors to clients. |

---

## 🏃 Agile Sprint Methodology Breakdown

```
[Sprint 1: Core Domain & Dual Persistence] ──► [Sprint 2: Zero-Trust Security & Idempotency]
                     │                                              │
                     ▼                                              ▼
[Sprint 3: Framer Motion Micro-Interactions] ──► [Sprint 4: Testing, Verification & CI/CD]
```

### 🔹 Sprint 1: Core Domain, State & Dual Persistence
- Designed single-responsibility MongoDB and Mongoose models (`Task`, `User`, `IdempotencyLog`).
- Built browser `localStorage` persistence layer (`saveToLocalStorage()` and `loadFromLocalStorage()`) ensuring **zero server dependencies** for standalone usage.
- Implemented complete CRUD capabilities: Title, Notes, Category, Priority, Due Dates, and Tags.

### 🔹 Sprint 2: Zero-Trust Security & Network Resilience
- Configured Helmet security headers, strict CORS, Zod schema validation, and rate limiters.
- Implemented **Idempotency Key** middleware to prevent duplicate task submissions from double-clicks.
- Integrated exponential backoff retry logic and network status monitoring (`useNetworkStatus`).

### 🔹 Sprint 3: UI/UX & Framer Motion Micro-Interactions
- Designed modern Obsidian Dark theme (`#0A0D14`) with glassmorphic cards and subtle drop-shadows.
- Created micro-interactions on buttons, checkboxes, category filters, and modal dialogs using `framer-motion`.
- Added task completion celebration confetti bursts (`canvas-confetti`).
- Implemented real-time Productivity Tracker dashboard with live completion percentages and category distributions.

### 🔹 Sprint 4: Testing, Verification & Production Packaging
- Automated unit tests for Zod schemas and JWT token generation using **Jest**.
- Integration tests verifying health check endpoints, security headers, and 404 handlers via **Supertest**.
- Created seamless deployment manifests for **Vercel** (`vercel.json`) and **Render** (`render.yaml`).

---

## 📂 Project Architecture

```
df-taskmanager/
├── backend/                        # Node.js + Express + MongoDB REST API
│   ├── .env                        # Local environment variables
│   ├── .env.example                # Example environment template
│   ├── .gitignore                  # Backend ignore rules
│   ├── package.json
│   ├── jest.config.js              # Jest test configuration
│   ├── src/
│   │   ├── app.js                  # Express middleware & security configuration
│   │   ├── server.js               # Server bootstrap & graceful shutdown
│   │   ├── config/                 # DB connection pooling & env validation
│   │   ├── constants/              # HTTP status mappings
│   │   ├── controllers/            # Thin HTTP controllers
│   │   ├── middleware/             # Rate limiting, auth, sanitization, idempotency
│   │   ├── models/                 # Mongoose schemas (Task, User, IdempotencyLog)
│   │   ├── routes/                 # Express API routes (/health, /auth, /tasks)
│   │   ├── seeds/                  # Seed script with production sample tasks
│   │   ├── services/               # Decoupled business logic
│   │   ├── utils/                  # Winston logger, AppError, ApiResponse
│   │   └── validators/             # Zod input schemas
│   └── tests/                      # Unit and integration test suites
│
├── frontend/                       # React 18 + Vite + Tailwind CSS + Framer Motion
│   ├── .env                        # Frontend environment variables
│   ├── .env.example                # Example environment template
│   ├── .gitignore                  # Frontend ignore rules
│   ├── package.json
│   ├── vite.config.js              # Vite bundler & reverse proxy setup
│   ├── tailwind.config.js          # Tailwind custom theme & color tokens
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                 # Main application view
│       ├── index.css               # Glassmorphism & custom utility classes
│       ├── components/
│       │   ├── common/             # Button, Badge, Modal, Toast
│       │   ├── layout/             # Navbar, Footer
│       │   └── tasks/              # TaskList, TaskItem, TaskInputBar, TaskFilterBar, Stats
│       ├── context/                # TaskContext (CRUD & Filters), AuthContext
│       ├── hooks/                  # useLocalStorage, useDebounce, useNetworkStatus
│       ├── services/               # Resilient API client & task service
│       └── utils/                  # Date helpers, sanitization, constants
│
├── package.json                    # Root monorepo orchestration scripts
├── .gitignore                      # Monorepo-wide gitignore
├── vercel.json                     # Vercel deployment manifest
├── render.yaml                     # Render cloud service manifest
└── README.md                       # Comprehensive documentation
```

---

## ⚡ Quick Start Guide (For Manager / Reviewer)

### Prerequisites
- **Node.js** v18+ (tested on v24)
- **npm** v9+
- *(Optional)* MongoDB instance running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI (if running backend in full cloud mode). **Note: The frontend runs immediately with zero server dependencies via browser localStorage!**

---

### Step 1: Install Dependencies
Open your terminal in the root directory:
```bash
# Install both backend and frontend dependencies in one command
npm run install:all
```
*(Or install individually: `cd backend && npm install`, then `cd ../frontend && npm install`)*

---

### Step 2: Run Automated Tests
```bash
# Run unit & integration test suites
npm test
```
*All 11 unit & integration tests will execute and pass via Jest & Supertest.*

---

### Step 3: Seed Database (Optional for Cloud Mode)
To populate MongoDB with realistic sample tasks and a demo SRE account:
```bash
npm run seed
```
**Demo Account Credentials:**
- **Email:** `demo@dftasks.com`
- **Password:** `Password123!`

---

### Step 4: Start Development Servers
```bash
# Run both Backend & Frontend concurrently
npm run dev
```
Or start each service separately:
- **Backend API:** `cd backend && npm run dev` *(Runs on http://localhost:5000)*
- **Frontend App:** `cd frontend && npm run dev` *(Runs on http://localhost:5173)*

Now open **http://localhost:5173** in your browser.

---

## 🌐 Deploying to Production

### Deploying Frontend to Vercel
1. Push repository to GitHub.
2. Import project into Vercel.
3. Vercel automatically detects `vercel.json` and builds `frontend/dist`.
4. Set environment variable: `VITE_API_URL=https://your-backend.onrender.com/api/v1`

### Deploying Backend to Render
1. Create a new Web Service on Render linked to your repository.
2. Select Root Directory: `backend`.
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add Environment Variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=your_mongodb_connection_string`
   - `JWT_SECRET=your_secure_random_key`
   - `CORS_ORIGIN=https://your-frontend.vercel.app`
