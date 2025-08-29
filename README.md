# University Canteen Meal Card — MERN

A simplified cashless canteen system with roles: **Admin, Manager, Cashier, Student**.

## Tech
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT
- **Frontend:** React (Vite), React Router
- **Optional Bonus:** Meals catalog, QR-ready field, weekly reports via aggregations

## Quick Start

### Backend
```bash
cd backend
cp .env.example .env
npm i
npm run seed   # seeds admin, manager, cashier, student + card + meals
npm run dev    # starts on http://localhost:4000
```

### Frontend
```bash
cd ../frontend
npm i
npm run dev    # starts on http://localhost:5173
```

Login with:
- Admin: `admin@uni.edu` / `admin123`
- Manager: `manager@uni.edu` / `manager123`
- Cashier: `cashier@uni.edu` / `cashier123`
- Student: `alice@student.edu` / `alice123`

> Set `REQUIRE_MANAGER_APPROVAL` in `backend/src/controllers/studentController.js` to `true` to switch to approval workflow.

## API Overview

- **Auth**
  - `POST /api/auth/login`
  - `POST /api/auth/register` (admin only)
- **Admin**
  - `GET /api/admin/dashboard` (stats + recent tx)
- **Manager**
  - `GET /api/manager/recharges` (list pending recharge tx)
  - `POST /api/manager/recharges/:id/approve`
- **Cashier**
  - `POST /api/cashier/purchase` (deduct balance, optional mealId)
- **Student**
  - `GET /api/student/card`
  - `GET /api/student/transactions`
  - `POST /api/student/recharge` (mock recharge; auto-credits unless approval is enabled)

## Data Modeling (Why this schema?)

### User
```
{ name, email, password(hash), role }
```
- One collection for **all roles** keeps auth simple and avoids duplication.
- Students get a MealCard on registration.

### MealCard
```
{ studentId(ref User), balance, status, qrToken }
```
- Balance & status live here, separate from User to keep financial aspects isolated and auditable.

### Transaction
```
{ cardId, type(recharge|purchase), amount, mealId?, approved, approvedBy?, requestId }
```
- Single **append-only** ledger for both **recharges** and **purchases**.
- `requestId` provides **idempotency** to prevent double processing.
- `approved` supports manager-approval mode.

### Meal (bonus)
```
{ name, price }
```
- Lets cashiers select items, allowing analysis by meal later.

## Business Rules & Edge Cases

- **Insufficient balance** → `/purchase` returns `400` and no transaction is recorded.
- **Duplicate recharge** → guarded by unique `requestId`. Client can reuse the same ID to ensure idempotency.
- **Approval vs Auto-credit** → toggle via `REQUIRE_MANAGER_APPROVAL`.  
  - **Auto-credit** is fastest for UX.  
  - **Approval** adds control against abuse; suitable if recharges are made with cash/UPI verification at counter.

## Dashboards — Why these stats?

- **Admin:** total students, staff, system-wide balance (liability), recent transactions → macro health & risk.
- **Manager:** queued recharges + timestamps → operational control & SLAs.
- **Cashier:** minimal, fast POS: cardId + amount; shows new balance → optimized for rush hours.
- **Student:** balance, recharge button (mock), full history → transparency.

## Assumptions

- One active card per student.
- Refunds/chargebacks not required for MVP.
- No real payment gateway; recharge button simulates success.
- Timezone not managed per user (demo purpose).

## Extending (Bonus)

- **QR flow:** generate `qrToken` on MealCard, display as QR in student UI; cashier scans and resolves card.
- **Weekly reports:** MongoDB `$match`, `$group` by week, top meals/spenders.
- **Tests:** Supertest + Jest for endpoints.
- **Docker:** add Dockerfile + docker-compose for Mongo + services.
