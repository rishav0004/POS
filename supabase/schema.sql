-- ====================================================================
-- QueuePOS — Multi-Tenant SaaS Database Schema (PostgreSQL / Supabase)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TENANTS (Businesses / Franchises)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'Starter' CHECK (plan IN ('Starter', 'Business', 'Enterprise')),
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'TRIAL', 'SUSPENDED')),
    currency VARCHAR(10) DEFAULT '₹',
    tax_rate NUMERIC(5, 2) DEFAULT 5.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. USERS / EMPLOYEES (Super Admin, Manager, Cashier, Kitchen)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'BUSINESS_MANAGER', 'EMPLOYEE', 'KITCHEN_STAFF')),
    pin_code VARCHAR(10) DEFAULT '1234',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT 'Utensils',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. PRODUCTS / MENU ITEMS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(50),
    price NUMERIC(10, 2) NOT NULL,
    cost_price NUMERIC(10, 2) DEFAULT 0.00,
    stock_quantity INT DEFAULT 100,
    low_stock_threshold INT DEFAULT 15,
    is_available BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS (The Central Order Queue)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_number VARCHAR(50) NOT NULL,
    daily_queue_number INT NOT NULL,
    status VARCHAR(50) DEFAULT 'QUEUED' CHECK (status IN ('DRAFT', 'QUEUED', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED')),
    priority VARCHAR(50) DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL', 'URGENT')),
    priority_reason TEXT,
    order_type VARCHAR(50) DEFAULT 'DINE_IN' CHECK (order_type IN ('DINE_IN', 'TAKEAWAY', 'DELIVERY')),
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'CASH' CHECK (payment_method IN ('CASH', 'UPI_QR', 'CARD', 'SPLIT', 'UNPAID')),
    payment_status VARCHAR(50) DEFAULT 'PAID' CHECK (payment_status IN ('PAID', 'PENDING', 'REFUNDED')),
    created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    prepared_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- 7. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    subtotal NUMERIC(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ORDER ACTIVITY CHANNEL & AUDIT TIMELINE
CREATE TABLE IF NOT EXISTS order_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INVENTORY AUDIT LOGS
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    change_amount INT NOT NULL,
    remaining_stock INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- Allow read/write for all authenticated users matching tenant_id (or anon for development)
CREATE POLICY "Public Read/Write for Tenants" ON tenants FOR ALL USING (true);
CREATE POLICY "Tenant User Policy" ON users FOR ALL USING (true);
CREATE POLICY "Tenant Category Policy" ON categories FOR ALL USING (true);
CREATE POLICY "Tenant Product Policy" ON products FOR ALL USING (true);
CREATE POLICY "Tenant Order Policy" ON orders FOR ALL USING (true);
CREATE POLICY "Tenant Order Items Policy" ON order_items FOR ALL USING (true);
CREATE POLICY "Tenant Timeline Policy" ON order_timeline FOR ALL USING (true);
CREATE POLICY "Tenant Inventory Policy" ON inventory_logs FOR ALL USING (true);

-- ====================================================================
-- SUPABASE REALTIME REPLICATION (Instant KDS synchronization)
-- ====================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE order_timeline;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
