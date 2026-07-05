# Tap Savvy Networks — Backend API

> **Project Code:** TSN-2026-001 &nbsp;|&nbsp; **Issued By:** Dishant Aarak (CTO) &nbsp;|&nbsp; **Deadline:** 5 July 2026

A professional networking platform enabling users to create digital identity cards, manage connections, and leverage AI-powered lead management tools. This repository contains the entire server-side infrastructure built with **Node.js / Express.js**, **MongoDB (Mongoose)**, and **REST APIs**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [API Modules](#api-modules)
- [Git Workflow](#git-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Code Standards](#code-standards)
- [Weekly Reporting](#weekly-reporting)
- [Deliverables Checklist](#deliverables-checklist)
- [Timeline](#timeline)
- [Contact & Support](#contact--support)

---

## Project Overview

Tap Savvy Networks is an NFC-based digital networking platform. This backend project covers:

- Digital Profile management (Personal & Business)
- AI Data Scanner for lead extraction via OCR/Vision
- CRM / Lead Management
- Network Book (public business directory)
- Networking Teams
- Admin Panel APIs with Role-Based Access Control (RBAC)
- Multilingual support (EN / HI / MR)

> **Important:** Frontend and mobile development are **out of scope** for this assignment. Build APIs only.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Auth | JWT (Access + Refresh Tokens) |
| File Uploads | Multer + Cloudinary / AWS S3 |
| AI / OCR | Google Vision API / OpenAI Vision / Tesseract |
| Testing | Jest / Mocha |
| API Docs | Swagger / Postman Collection |

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** v18 or above
- **npm** v9 or above
- **MongoDB** (local instance or MongoDB Atlas)
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/tapsavvynetwork/tsn-backend.git
cd tsn-backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Fill in all required values in .env

# 4. Start the development server
npm run dev
```

The server will start at `http://localhost:5000` by default.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values. **Never commit `.env` to the repository.**

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/tapsavvy

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AI / OCR
OPENAI_API_KEY=
GOOGLE_VISION_KEY=

# Admin
SUPER_ADMIN_EMAIL=admin@tapsavvynetwork.com
```

---

## Folder Structure

```
tsn-backend/
├── src/
│   ├── config/           # DB connection, environment config
│   ├── middlewares/      # Auth, RBAC, language, error handler
│   ├── models/           # Mongoose schemas
│   ├── modules/
│   │   ├── auth/         # Register, login, JWT, logout
│   │   ├── profile/      # Normal & Business profile APIs
│   │   ├── connections/  # Connection requests & management
│   │   ├── leads/        # CRM + AI Scanner
│   │   ├── network-book/ # Public directory
│   │   ├── teams/        # Networking Team stubs
│   │   ├── admin/        # Admin panel APIs
│   │   └── locale/       # Multilingual support
│   ├── utils/            # Helpers, validators, response builder
│   └── app.js            # Express app entry point
├── tests/                # Unit & integration tests
├── postman/              # Postman collection export
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## API Modules

| Module | Base Route | Status |
|---|---|---|
| Auth | `/auth` | Existing — extend only |
| Normal Profile | `/profiles` | Existing — extend only |
| Business Profile | `/business-profiles` | Existing — extend only |
| Connections | `/connections` | Existing — extend only |
| Leads / CRM | `/leads` | To be built |
| AI Scanner | `/leads/scan` | To be built |
| Network Book | `/network-book` | To be built |
| Admin | `/admin` | To be built |
| Locale | `/locale` | To be built |
| Teams | `/teams` | Stubs only |

> ⚠️ **Do not redesign or rename existing endpoints without explicit written approval from the Technical POC.**

---

## Git Workflow

This project follows the **Feature Branch Workflow**. All work is done on dedicated branches and merged into `main` via reviewed Pull Requests.

```
main                  ← protected, production-ready code only
└── dev               ← integration branch (merge PRs here first)
    ├── feature/...   ← new feature development
    ├── fix/...       ← bug fixes
    ├── chore/...     ← config, deps, refactoring
    └── test/...      ← test additions or fixes
```

### Rules

- **Never push directly to `main` or `dev`.** All changes go through a Pull Request.
- Always branch off from `dev`, not `main`.
- Keep branches short-lived — one branch per feature/fix.
- Delete your branch after the PR is merged.

---

## Branch Naming Convention

Use the format: `type/short-description`

| Type | When to use | Example |
|---|---|---|
| `feature/` | New feature or module | `feature/leads-crud-api` |
| `fix/` | Bug fix | `fix/jwt-refresh-token-expiry` |
| `chore/` | Config, deps, refactor | `chore/add-eslint-config` |
| `test/` | Tests only | `test/auth-unit-tests` |
| `docs/` | Documentation only | `docs/swagger-leads-module` |

**Examples:**

```bash
git checkout dev
git pull origin dev
git checkout -b feature/network-book-api
```

---

## Commit Message Guidelines

Follow the **Conventional Commits** standard:

```
type(scope): short description
```

| Type | Usage |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `chore` | Maintenance, config, dependency updates |
| `docs` | Documentation changes |
| `test` | Adding or updating tests |
| `refactor` | Code restructure without behavior change |

**Examples:**

```bash
git commit -m "feat(leads): add POST /leads/scan AI scanner endpoint"
git commit -m "fix(auth): resolve refresh token expiry edge case"
git commit -m "chore(deps): upgrade mongoose to v8"
git commit -m "docs(swagger): add Network Book API documentation"
```

**Rules:**
- Use present tense ("add feature" not "added feature")
- Keep the subject line under 72 characters
- Reference issue/task numbers where applicable: `feat(profile): add cover image upload (#12)`

---

## Pull Request Guidelines

### Before Opening a PR

- [ ] Your branch is up to date with `dev` (`git pull origin dev`)
- [ ] Code runs locally without errors (`npm run dev`)
- [ ] All new endpoints are tested via Postman
- [ ] No `.env` files, secrets, or `node_modules` are committed
- [ ] Relevant tests added (for auth & profile modules)
- [ ] Code follows the project's ESLint rules (`npm run lint`)

### PR Title Format

```
[Module] Brief description of change
```

Examples:
- `[Leads] Add CRM CRUD endpoints with status tracking`
- `[Auth] Fix token refresh race condition`
- `[Admin] Implement RBAC middleware for admin routes`

### PR Description Template

When opening a PR, fill in the following:

```markdown
## Summary
What does this PR do? Why?

## Changes Made
- Added `POST /leads/scan` endpoint
- Created Lead Mongoose schema with status field
- Integrated OpenAI Vision for OCR

## How to Test
1. Start the server with `npm run dev`
2. Send a POST request to `/leads/scan` with a base64 image
3. Verify the returned Lead document contains extracted fields

## Checklist
- [ ] Code tested locally
- [ ] Postman collection updated
- [ ] No secrets committed
- [ ] PR is targeted at `dev`, not `main`
```

### Review Process

- Every PR requires **at least 1 approval** from the Technical POC before merging.
- Address all review comments before requesting a re-review.
- Do not merge your own PR.
- Squash commits on merge to keep `dev` history clean.

---

## Code Standards

- Use **ES Modules** (`import`/`export`) or **CommonJS** consistently — do not mix.
- All API responses must follow the standard response structure:
  ```json
  {
    "success": true,
    "message": "Profile fetched successfully",
    "data": { }
  }
  ```
- All errors must be handled via the global error handler middleware — never use `res.status(500).send("error")` directly.
- Use `async/await` with proper `try/catch` — no raw Promise chains.
- Sensitive fields (`passwordHash`, tokens) must **never** be returned in API responses.
- All routes must be validated using a validation middleware (e.g. `express-validator` or `Joi`) before reaching the controller.
- MongoDB queries on frequently filtered fields must use **indexed fields** (see schema notes in the Project Assignment doc).

---

## Weekly Reporting

- Submit a progress update **every Monday by 10:00 AM** via the agreed communication channel.
- Update format:

```
Week X Update — [Your Name]

✅ Completed this week:
- ...

🔄 In progress:
- ...

❌ Blockers / Questions:
- ...

📅 Plan for next week:
- ...
```

- Any scope changes or questions must be raised with the Technical POC in writing **before** implementation begins.

---

## Deliverables Checklist

| # | Deliverable | Priority | Status |
|---|---|---|---|
| 1 | Mongoose schemas: Normal User, Business User, Admin, Lead, Team | High | ⬜ |
| 2 | Auth module: register, login, JWT, refresh, logout, RBAC | High | ⬜ |
| 3 | Profile CRUD APIs — personal + business (with image upload) | High | ⬜ |
| 4 | Connections API: send, accept/reject, block, remove | High | ⬜ |
| 5 | Network Book API: paginated directory with filters | High | ⬜ |
| 6 | AI Scanner endpoint: image → Lead document | Medium | ⬜ |
| 7 | CRM / Leads module: CRUD + status + team assignment | Medium | ⬜ |
| 8 | Admin API endpoints: user management, analytics, reports | Medium | ⬜ |
| 9 | Multilingual: locale endpoint + Accept-Language middleware | Medium | ⬜ |
| 10 | Networking Team stubs | Low | ⬜ |
| 11 | Unit/integration tests for auth and profile modules | Medium | ⬜ |
| 12 | README + Swagger/Postman collection + `.env.example` | High | ⬜ |

---

## Timeline

| Week | Phase | Focus |
|---|---|---|
| Week 1 | Setup & Auth | Repo setup, MongoDB connection, full auth module + RBAC |
| Week 2 | Profiles & Uploads | Normal & Business profile APIs, image upload |
| Week 3 | Connections & Network Book | Connections API, paginated directory endpoint |
| Week 4 | AI Scanner & CRM | OCR integration, Leads schema + CRUD, team assignment |
| Week 5 | Admin & Multilingual | Admin endpoints, locale API, Accept-Language middleware |
| Week 6 | Tests & Handoff | Team stubs, tests, Swagger docs, README, code review |

---

## Contact & Support

| Role | Name | Contact |
|---|---|---|
| CTO / Issuing Authority | Dishant Aarak | *(via agreed channel)* |
| Technical POC | *(assigned at onboarding)* | *(via agreed channel)* |
| Platform | [tapsavvynetwork.com](https://tapsavvynetwork.com) | — |

> All communication regarding this project must go through official channels only. Do not share project details, source code, or business logic with third parties — refer to the signed NDA (TSN-2026-001).

---

*Tap Savvy Networks © 2026 — All work product is the exclusive intellectual property of Tap Savvy Networks.*