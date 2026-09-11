# QueuePOS — Multi-Tenant SaaS POS & Order Queue System

QueuePOS is a cloud-native SaaS POS and centralized order queue system designed to eradicate order chaos in fast-food outlets, restaurants, cafés, and bakeries.

## 🚀 Key Highlights
- **Multi-Tenant SaaS Architecture:** Complete data isolation per business/shop using PostgreSQL Row-Level Security (RLS).
- **Sub-50ms Realtime KDS:** Kitchen Display System powered by Supabase Realtime WebSockets with FIFO queue enforcement and audio chime notifications.
- **Fast POS Cashier Terminal:** Designed for touchscreens and tablets, quick search, item add-ons, split payments, and instant token generation.
- **Role-Based Access Control:** Super Admin, Business Owner/Manager, Employee/Cashier (with quick 4-digit PIN switch), and Kitchen Staff.
- **Customer "Now Serving" TV Display:** Dedicated screen showing preparing and ready orders.
- **Manager & Employee Analytics:** Track sales by employee, gross/net margins, inventory deduction, and low-stock alerts.

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Styling & UI:** Tailwind CSS, Lucide React
- **Database & Realtime:** Supabase (PostgreSQL, Realtime Channels, RLS)
- **State Management:** Zustand
- **Hardware Integration:** Web Print API (80mm & 58mm Thermal Receipts)
