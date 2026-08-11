# Metas Backend

A backend REST API for **Metas**, a partnership investment management platform where businesses can showcase their companies, publish investment opportunities, and manage partnerships.

> **Note:** This project is being built as a learning and portfolio project using modern backend development practices.

---

# 🚀 Tech Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL
- Prisma ORM
- Docker
- Zod
- JWT Authentication
- Yarn

---

# 📖 Features

## Authentication

- Account registration
- Secure login using JWT
- Role-based authorization

## Company Management

- Create and update companies
- Company ownership and membership
- Company profile management
- Soft delete support

## Financial Records

- Store company financial history
- Revenue and expense tracking
- Company valuation
- Assets, liabilities, and cash balance
- Financial record history

## Partnership Management _(In Progress)_

- Publish partnership opportunities
- Investor proposals
- Partnership ownership management

---

# 📁 Project Structure

```text
src/
├── config/
├── controllers/
├── errors/
├── lib/
├── middlewares/
├── routes/
├── services/
├── validators/
├── app.ts
└── server.ts

prisma/
├── migrations/
└── schema.prisma
```

---

# ⚙️ Getting Started

## Install dependencies

```bash
yarn install
```

## Configure environment

Create a `.env` file:

```env
DATABASE_URL=<your_postgresql_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=8000
```

## Run database migrations

```bash
npx prisma migrate dev
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Start the development server

```bash
yarn dev
```

## Build

```bash
yarn build
```

## Run production build

```bash
yarn start
```

---

# 🗄 Database

Current core entities:

- Account
- Company
- CompanyMember
- FinancialRecord
- PartnershipOffer _(In Progress)_

---

# 🎯 Roadmap

- [x] Project setup
- [x] TypeScript configuration
- [x] Express API
- [x] Docker & PostgreSQL
- [x] Prisma ORM integration
- [x] JWT Authentication
- [x] Company Management
- [x] Company Membership
- [x] Financial Records
- [ ] Partnership Offers
- [ ] Investment Proposals
- [ ] Partnership Approval Workflow
- [ ] Company Feed
- [ ] Notifications
- [ ] Reports & Analytics

---

# 📄 License

This project is licensed under the MIT License.
