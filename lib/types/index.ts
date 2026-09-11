export type UserRole = 'SUPER_ADMIN' | 'BUSINESS_MANAGER' | 'EMPLOYEE' | 'KITCHEN_STAFF';

export type OrderStatus = 'DRAFT' | 'QUEUED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export type OrderPriority = 'NORMAL' | 'URGENT';

export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';

export type PaymentMethod = 'CASH' | 'UPI_QR' | 'CARD' | 'SPLIT' | 'UNPAID';

export type PaymentStatus = 'PAID' | 'PENDING' | 'REFUNDED';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'Starter' | 'Business' | 'Enterprise';
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED';
  currency: string;
  tax_rate: number;
  created_at: string;
}

export interface User {
  id: string;
  tenant_id: string | null;
  name: string;
  email: string;
  role: UserRole;
  pin_code: string;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  tenant_id: string;
  name: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  tenant_id: string;
  category_id: string;
  name: string;
  sku: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  low_stock_threshold: number;
  is_available: boolean;
  image_url: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  tenant_id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  notes?: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  order_number: string;
  daily_queue_number: number;
  status: OrderStatus;
  priority: OrderPriority;
  priority_reason?: string;
  order_type: OrderType;
  total_amount: number;
  discount_amount: number;
  tax_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  created_by_id: string;
  created_by_name?: string;
  prepared_by_id?: string;
  customer_name?: string;
  notes?: string;
  created_at: string;
  started_at?: string;
  ready_at?: string;
  completed_at?: string;
  items?: OrderItem[];
}

export interface OrderTimeline {
  id: string;
  tenant_id: string;
  order_id: string;
  status: OrderStatus;
  actor_id?: string;
  actor_name: string;
  actor_role: UserRole;
  message: string;
  created_at: string;
}

export interface InventoryLog {
  id: string;
  tenant_id: string;
  product_id: string;
  product_name?: string;
  change_amount: number;
  remaining_stock: number;
  reason: string;
  actor_name: string;
  created_at: string;
}
