import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Product,
  Category,
  Order,
  OrderItem,
  OrderStatus,
  OrderPriority,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  OrderTimeline,
  InventoryLog,
  User,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_TIMELINE,
} from '../mock-data';
import { playSound } from '../sound';

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

interface PosState {
  // Data
  categories: Category[];
  products: Product[];
  orders: Order[];
  timeline: OrderTimeline[];
  inventoryLogs: InventoryLog[];

  // Active POS Cart
  cart: CartItem[];
  orderType: OrderType;
  customerName: string;
  orderNotes: string;
  discountAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;

  // Search & Filters
  selectedCategory: string | null;
  searchQuery: string;

  // Actions - POS Cart
  addToCart: (product: Product, notes?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setOrderType: (type: OrderType) => void;
  setCustomerName: (name: string) => void;
  setOrderNotes: (notes: string) => void;
  setDiscountAmount: (discount: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  clearCart: () => void;

  // Actions - Order Processing
  placeOrder: (tenantId: string, currentUser: User, taxRate: number) => Order;
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    currentUser: User,
    notes?: string
  ) => void;
  setOrderPriority: (
    orderId: string,
    priority: OrderPriority,
    reason: string,
    currentUser: User
  ) => void;

  // Actions - Product & Inventory Management
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>, currentUser: User) => void;
  adjustStock: (
    productId: string,
    delta: number,
    reason: string,
    currentUser: User
  ) => void;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;

  // Filters
  setSelectedCategory: (categoryId: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      timeline: INITIAL_TIMELINE,
      inventoryLogs: [],

      cart: [],
      orderType: 'DINE_IN',
      customerName: '',
      orderNotes: '',
      discountAmount: 0,
      paymentMethod: 'CASH',
      paymentStatus: 'PAID',

      selectedCategory: null,
      searchQuery: '',

      addToCart: (product, notes) => {
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + 1, notes: notes || item.notes }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { product, quantity: 1, notes }],
          };
        });
        playSound('beep');
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      setOrderType: (type) => set({ orderType: type }),
      setCustomerName: (name) => set({ customerName: name }),
      setOrderNotes: (notes) => set({ orderNotes: notes }),
      setDiscountAmount: (discount) => set({ discountAmount: Math.max(0, discount) }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),

      clearCart: () =>
        set({
          cart: [],
          customerName: '',
          orderNotes: '',
          discountAmount: 0,
          paymentMethod: 'CASH',
        }),

      placeOrder: (tenantId, currentUser, taxRate = 5.0) => {
        const {
          cart,
          orderType,
          customerName,
          orderNotes,
          discountAmount,
          paymentMethod,
          paymentStatus,
          orders,
        } = get();

        const subtotal = cart.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
        const taxableAmount = Math.max(0, subtotal - discountAmount);
        const taxAmount = (taxableAmount * taxRate) / 100;
        const totalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

        const tenantOrders = orders.filter((o) => o.tenant_id === tenantId);
        const nextDailyQueueNumber = tenantOrders.length + 1;
        const orderNumber = `ORD-${100 + nextDailyQueueNumber}`;
        const orderId = 'o' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

        const orderItems: OrderItem[] = cart.map((item) => ({
          id: 'i' + Math.random().toString(36).substring(2, 9),
          tenant_id: tenantId,
          order_id: orderId,
          product_id: item.product.id,
          product_name: item.product.name,
          unit_price: item.product.price,
          quantity: item.quantity,
          subtotal: item.product.price * item.quantity,
          notes: item.notes,
        }));

        const newOrder: Order = {
          id: orderId,
          tenant_id: tenantId,
          order_number: orderNumber,
          daily_queue_number: nextDailyQueueNumber,
          status: 'QUEUED',
          priority: 'NORMAL',
          order_type: orderType,
          total_amount: totalAmount,
          discount_amount: discountAmount,
          tax_amount: taxAmount,
          payment_method: paymentMethod,
          payment_status: paymentStatus,
          created_by_id: currentUser.id,
          created_by_name: currentUser.name,
          customer_name: customerName || `Customer #${nextDailyQueueNumber}`,
          notes: orderNotes,
          created_at: new Date().toISOString(),
          items: orderItems,
        };

        const timelineEntry: OrderTimeline = {
          id: 't' + Math.random().toString(36).substring(2, 9),
          tenant_id: tenantId,
          order_id: orderId,
          status: 'QUEUED',
          actor_id: currentUser.id,
          actor_name: currentUser.name,
          actor_role: currentUser.role,
          message: `Order #${nextDailyQueueNumber} (${orderNumber}) created and sent to kitchen queue`,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          timeline: [timelineEntry, ...state.timeline],
        }));

        // Audio & Cart cleanup
        playSound('cash_register');
        setTimeout(() => playSound('new_order'), 300);
        get().clearCart();

        return newOrder;
      },

      updateOrderStatus: (orderId, nextStatus, currentUser, notes) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;

        const now = new Date().toISOString();
        const updates: Partial<Order> = { status: nextStatus };

        if (nextStatus === 'PREPARING') {
          updates.started_at = now;
          updates.prepared_by_id = currentUser.id;
        } else if (nextStatus === 'READY') {
          updates.ready_at = now;
        } else if (nextStatus === 'COMPLETED') {
          updates.completed_at = now;

          // Automatically deduct inventory stock for finished orders
          if (order.items) {
            order.items.forEach((item) => {
              if (item.product_id) {
                get().adjustStock(
                  item.product_id,
                  -item.quantity,
                  `Order #${order.daily_queue_number} Completed`,
                  currentUser
                );
              }
            });
          }
        }

        const timelineEntry: OrderTimeline = {
          id: 't' + Math.random().toString(36).substring(2, 9),
          tenant_id: order.tenant_id,
          order_id: order.id,
          status: nextStatus,
          actor_id: currentUser.id,
          actor_name: currentUser.name,
          actor_role: currentUser.role,
          message:
            notes ||
            `Order #${order.daily_queue_number} (${order.order_number}) moved to ${nextStatus}`,
          created_at: now,
        };

        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, ...updates } : o)),
          timeline: [timelineEntry, ...state.timeline],
        }));

        if (nextStatus === 'READY') {
          playSound('order_ready');
        } else if (nextStatus === 'PREPARING') {
          playSound('beep');
        }
      },

      setOrderPriority: (orderId, priority, reason, currentUser) => {
        const order = get().orders.find((o) => o.id === orderId);
        if (!order) return;

        const timelineEntry: OrderTimeline = {
          id: 't' + Math.random().toString(36).substring(2, 9),
          tenant_id: order.tenant_id,
          order_id: order.id,
          status: order.status,
          actor_id: currentUser.id,
          actor_name: currentUser.name,
          actor_role: currentUser.role,
          message: `Priority changed to ${priority}. Reason: ${reason}`,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, priority, priority_reason: reason }
              : o
          ),
          timeline: [timelineEntry, ...state.timeline],
        }));

        playSound('urgent');
      },

      addProduct: (newProductData) => {
        const newProduct: Product = {
          ...newProductData,
          id: 'p' + Math.random().toString(36).substring(2, 9),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
      },

      updateProduct: (productId, updates, currentUser) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, ...updates } : p
          ),
        }));
      },

      adjustStock: (productId, delta, reason, currentUser) => {
        const product = get().products.find((p) => p.id === productId);
        if (!product) return;

        const newStock = Math.max(0, product.stock_quantity + delta);

        const log: InventoryLog = {
          id: 'inv' + Math.random().toString(36).substring(2, 9),
          tenant_id: product.tenant_id,
          product_id: productId,
          product_name: product.name,
          change_amount: delta,
          remaining_stock: newStock,
          reason,
          actor_name: currentUser.name,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, stock_quantity: newStock } : p
          ),
          inventoryLogs: [log, ...state.inventoryLogs],
        }));
      },

      addCategory: (newCategoryData) => {
        const newCategory: Category = {
          ...newCategoryData,
          id: 'c' + Math.random().toString(36).substring(2, 9),
          created_at: new Date().toISOString(),
        };
        set((state) => ({ categories: [...state.categories, newCategory] }));
      },

      setSelectedCategory: (categoryId) => set({ selectedCategory: categoryId }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'queuepos_pos_store',
    }
  )
);
