# QueuePOS — SaaS POS & Real-Time Order Queue System
## Complete Product Specification & Technical Architecture

QueuePOS is a cloud-based, multi-tenant SaaS Point of Sale (POS) and centralized Order Queue Management platform designed for small-to-medium food outlets, fast-food counters, cafés, restaurants, bakeries, and cloud kitchens.

---

## 1. Problem Statement & Core Value Proposition
- **The Problem:** In fast-paced food counters, multiple cashiers punch orders simultaneously. Without a single coordinated queue, verbal instructions and paper slips cause missed orders, skipped customers, out-of-order cooking, duplicate meals, kitchen chaos, and untracked employee sales.
- **The Solution:** A centralized, real-time deterministic queue (`FIFO`) linking Cashiers -> Kitchen Display System (KDS) -> Manager Analytics -> Customer Status Screens.

---

## 2. Technology Stack

- **Frontend & App Framework:** Next.js 15 (App Router, React 19, TypeScript, Tailwind CSS, Lucide Icons)
- **Database & Auth:** Supabase (PostgreSQL with Row-Level Security, Supabase Auth, Triggers)
- **Real-Time Synchronization:** Supabase Realtime Channels (WebSockets for sub-50ms KDS ticket updates)
- **State Management:** Zustand (Client-side fast cart state, optimistic updates, sound alert triggers)
- **Printing Engine:** Web Print API + ESC/POS raw parser for 80mm & 58mm thermal receipts & KOTs

---

## 3. SaaS Multi-Tenant Hierarchy

```
                    SUPER ADMIN (Platform Owner)
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
     Tenant: "Burger Hut"                  Tenant: "Pizza Mania"
            │                                     │
   ┌────────┼────────┐                   ┌────────┼────────┐
   ▼        ▼        ▼                   ▼        ▼        ▼
Manager  Cashier  Kitchen              Manager  Cashier  Kitchen
(Shop)   (POS)     (KDS)               (Shop)   (POS)     (KDS)
```

- **Row-Level Tenant Isolation:** Every database table (`orders`, `products`, `users`, `inventory`, `audit_logs`) has a `tenant_id` column protected by PostgreSQL Row-Level Security (RLS) policies.
- **Subdomain / Tenant Switcher:** Support for custom tenant workspaces.

---

## 4. User Roles & Permission Matrix

1. **Super Admin (Platform Owner)**
   - SaaS Dashboard (Total businesses, active subscriptions, global orders & GMV).
   - Tenant onboarding, plan limits (Starter, Business, Enterprise), subscription status (Active, Trial, Suspended).
2. **Business Manager / Shop Owner**
   - Live Shop Dashboard & real-time analytics.
   - Menu & Catalog Management (Categories, Products, Add-ons, Pricing, Out-of-Stock toggle).
   - Inventory & Stock Management (Stock levels, low-stock threshold alerts, cost price vs selling price).
   - Employee Sales Tracking (Sales by cashier, orders punched, average ticket size, discount logs).
   - Queue Override (Mark order `URGENT` with mandatory reason prompt and audit trail).
3. **Employee / Cashier**
   - High-speed Touch POS terminal with quick search and category filtering.
   - Quick 4-digit PIN cashier switcher.
   - Instant cart calculations (Taxes, discounts, payment mode: Cash / UPI QR / Card / Split).
   - 1-click **Place Order & Print Token** (#001, #002).
4. **Kitchen / Chef (KDS)**
   - Minimalist, high-contrast Kitchen Display.
   - Real-time sound notification when new orders are placed.
   - Order timers (Green < 5m, Yellow 5-10m, Red > 10m delayed).
   - Status actions: `[START PREPARING]`, `[MARK READY]`.
5. **Customer (Now Serving TV)**
   - Public split-screen TV display for dining hall/counter (`Preparing` vs `Ready for Pickup`).

---

## 5. Order State Machine & Lifecycle

```
[ DRAFT ] (Cashier adding items)
    ↓
[ QUEUED ] (Assigned Daily Token #001, sent to Kitchen KDS)
    ↓
[ PREPARING ] (Kitchen clicks "Start")
    ↓
[ READY ] (Kitchen clicks "Ready" -> Chime sounds, Customer TV flashes)
    ↓
[ COMPLETED ] (Customer collects order & payment verified)

* Optional / Controlled States:
- [ CANCELLED ] (Manager authorization required + reason logged)
- [ URGENT ] (Manager priority bump with audit trail)
```

---

## 6. Supabase Database Schema Plan

- `tenants` (id, name, slug, plan, status, tax_rate, currency, created_at)
- `users` (id, tenant_id, name, email, role, pin_code, is_active, created_at)
- `categories` (id, tenant_id, name, icon, sort_order)
- `products` (id, tenant_id, category_id, name, sku, price, cost_price, stock_quantity, low_stock_threshold, is_available, image_url)
- `orders` (id, tenant_id, order_number, daily_queue_number, status, priority, order_type, total_amount, discount_amount, tax_amount, payment_method, payment_status, created_by_id, created_at, prepared_at, ready_at, completed_at)
- `order_items` (id, order_id, tenant_id, product_id, product_name, unit_price, quantity, subtotal, notes)
- `order_timeline` (id, tenant_id, order_id, status, actor_id, actor_name, actor_role, message, created_at)
- `inventory_logs` (id, tenant_id, product_id, change_amount, reason, actor_id, created_at)

---

## 7. Step-by-Step Implementation Roadmap

1. **Commit 1:** Initial Blueprint & Project Architecture (`PLAN.md`, `README.md`, Git remote config).
2. **Commit 2:** Next.js 15 Project Setup with TypeScript, Tailwind CSS, Lucide Icons, and Supabase client configuration.
3. **Commit 3:** Supabase SQL Schema Migrations & RLS Policies (`supabase/schema.sql` and seed data generator).
4. **Commit 4:** Multi-Role Authentication, Tenant Context, and Quick 4-Digit PIN Cashier Switcher.
5. **Commit 5:** High-Speed Employee POS Terminal (Category filters, item search, cart drawer, discount/tax calculations, payment modal, thermal receipt generator).
6. **Commit 6:** Real-Time Kitchen Display System (KDS) (Supabase Realtime subscriptions, FIFO queue, order timers, audio chime alerts, status transitions).
7. **Commit 7:** Live Order Activity Channel & Customer "Now Serving" TV Display.
8. **Commit 8:** Manager Dashboard & Analytics (Live revenue metrics, payment method breakdown, employee sales leaderboard, inventory alerts).
9. **Commit 9:** Menu & Inventory Management (Product/Category CRUD, stock update modals, cost vs margin calculation).
10. **Commit 10:** Super Admin SaaS Control Portal (Tenant management, subscription plans, platform overview).
11. **Commit 11:** Final verification, production build check, and Supabase environment configuration documentation.
