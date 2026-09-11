-- ====================================================================
-- QueuePOS — Multi-Tenant Seed Data
-- ====================================================================

-- 1. Insert Tenants
INSERT INTO tenants (id, name, slug, plan, status, currency, tax_rate) VALUES
('a0000000-0000-0000-0000-000000000001', 'Burger Queen Hub', 'burger-queen', 'Business', 'ACTIVE', '₹', 5.00),
('a0000000-0000-0000-0000-000000000002', 'Crispy Crust Pizza', 'crispy-crust', 'Starter', 'ACTIVE', '₹', 5.00)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Users for Burger Queen Hub
INSERT INTO users (id, tenant_id, name, email, role, pin_code, is_active) VALUES
-- Super Admin (No tenant bound)
('u0000000-0000-0000-0000-000000000001', NULL, 'SaaS Super Admin', 'admin@queuepos.io', 'SUPER_ADMIN', '9999', TRUE),
-- Burger Queen Staff
('u0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Rishav (Store Manager)', 'manager@burgerqueen.com', 'BUSINESS_MANAGER', '1111', TRUE),
('u0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Rahul Sharma (Cashier 1)', 'rahul@burgerqueen.com', 'EMPLOYEE', '1234', TRUE),
('u0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Priya Patel (Cashier 2)', 'priya@burgerqueen.com', 'EMPLOYEE', '2345', TRUE),
('u0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Chef Amit (Kitchen Display)', 'kitchen@burgerqueen.com', 'KITCHEN_STAFF', '3456', TRUE)
ON CONFLICT (id) DO NOTHING;

-- 3. Categories for Burger Queen Hub
INSERT INTO categories (id, tenant_id, name, icon, sort_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Burgers', 'Beef', 1),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Sides & Fries', 'Drumstick', 2),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Beverages', 'CupSoda', 3),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Meal Combos', 'UtensilsCrossed', 4),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Desserts', 'IceCream', 5)
ON CONFLICT (id) DO NOTHING;

-- 4. Products for Burger Queen Hub
INSERT INTO products (id, tenant_id, category_id, name, sku, price, cost_price, stock_quantity, low_stock_threshold, is_available, image_url) VALUES
('p0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Classic Crispy Chicken Burger', 'BQ-CK-01', 149.00, 65.00, 64, 15, TRUE, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80'),
('p0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Double Smash Cheeseburger', 'BQ-SM-02', 199.00, 90.00, 42, 10, TRUE, 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&q=80'),
('p0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Spicy Paneer Tikka Burger', 'BQ-VG-03', 139.00, 55.00, 38, 12, TRUE, 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80'),
('p0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'Peri Peri French Fries (L)', 'BQ-SD-01', 99.00, 30.00, 85, 20, TRUE, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=400&q=80'),
('p0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002', 'Crispy Onion Rings', 'BQ-SD-02', 89.00, 28.00, 30, 10, TRUE, 'https://images.unsplash.com/photo-1639024471287-03c085021dbd?w=400&q=80'),
('p0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', 'Chilled Cold Coffee', 'BQ-BV-01', 119.00, 35.00, 50, 15, TRUE, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80'),
('p0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000003', 'Fountain Coke (500ml)', 'BQ-BV-02', 59.00, 15.00, 120, 25, TRUE, 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80'),
('p0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000004', 'Mega Burger Combo (Burger+Fries+Drink)', 'BQ-CM-01', 269.00, 110.00, 45, 10, TRUE, 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80'),
('p0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000005', 'Hot Chocolate Brownie w/ Ice Cream', 'BQ-DS-01', 129.00, 45.00, 8, 10, TRUE, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- 5. Initial Active Queue Orders (Demonstrating FIFO queue state)
INSERT INTO orders (id, tenant_id, order_number, daily_queue_number, status, priority, order_type, total_amount, discount_amount, tax_amount, payment_method, payment_status, created_by_id, customer_name, created_at, started_at) VALUES
('o0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'ORD-101', 1, 'READY', 'NORMAL', 'DINE_IN', 308.00, 0.00, 14.67, 'UPI_QR', 'PAID', 'u0000000-0000-0000-0000-000000000003', 'Vikram S.', NOW() - INTERVAL '12 minutes', NOW() - INTERVAL '9 minutes'),
('o0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'ORD-102', 2, 'PREPARING', 'NORMAL', 'TAKEAWAY', 269.00, 0.00, 12.81, 'CASH', 'PAID', 'u0000000-0000-0000-0000-000000000004', 'Ananya G.', NOW() - INTERVAL '7 minutes', NOW() - INTERVAL '4 minutes'),
('o0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'ORD-103', 3, 'QUEUED', 'NORMAL', 'DINE_IN', 417.00, 20.00, 18.90, 'CARD', 'PAID', 'u0000000-0000-0000-0000-000000000003', 'Karan M.', NOW() - INTERVAL '3 minutes', NULL)
ON CONFLICT (id) DO NOTHING;

-- Order Items
INSERT INTO order_items (id, tenant_id, order_id, product_id, product_name, unit_price, quantity, subtotal) VALUES
('i0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'p0000000-0000-0000-0000-000000000001', 'Classic Crispy Chicken Burger', 149.00, 2, 298.00),
('i0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000002', 'p0000000-0000-0000-0000-000000000008', 'Mega Burger Combo (Burger+Fries+Drink)', 269.00, 1, 269.00),
('i0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000002', 'Double Smash Cheeseburger', 199.00, 1, 199.00),
('i0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000006', 'Chilled Cold Coffee', 119.00, 1, 119.00),
('i0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000003', 'p0000000-0000-0000-0000-000000000004', 'Peri Peri French Fries (L)', 99.00, 1, 99.00)
ON CONFLICT (id) DO NOTHING;

-- Order Timeline Log
INSERT INTO order_timeline (id, tenant_id, order_id, status, actor_name, actor_role, message, created_at) VALUES
('t0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'QUEUED', 'Rahul Sharma', 'EMPLOYEE', 'Order #101 created and entered queue', NOW() - INTERVAL '12 minutes'),
('t0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'PREPARING', 'Chef Amit', 'KITCHEN_STAFF', 'Kitchen started preparing Order #101', NOW() - INTERVAL '9 minutes'),
('t0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000001', 'READY', 'Chef Amit', 'KITCHEN_STAFF', 'Order #101 marked READY for pickup', NOW() - INTERVAL '3 minutes'),
('t0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000002', 'QUEUED', 'Priya Patel', 'EMPLOYEE', 'Order #102 created and entered queue', NOW() - INTERVAL '7 minutes'),
('t0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000002', 'PREPARING', 'Chef Amit', 'KITCHEN_STAFF', 'Kitchen started preparing Order #102', NOW() - INTERVAL '4 minutes'),
('t0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'o0000000-0000-0000-0000-000000000003', 'QUEUED', 'Rahul Sharma', 'EMPLOYEE', 'Order #103 created and entered queue', NOW() - INTERVAL '3 minutes')
ON CONFLICT (id) DO NOTHING;
