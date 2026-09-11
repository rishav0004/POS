'use client';

import React, { useState } from 'react';
import { usePosStore } from '@/lib/store/pos-store';
import { useUserStore } from '@/lib/store/user-store';
import { OrderType, PaymentMethod, Order } from '@/lib/types';
import {
  Trash2,
  Plus,
  Minus,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Banknote,
  QrCode,
  CreditCard,
  Printer,
  Sparkles,
  User,
  FileText,
  Percent,
} from 'lucide-react';
import ReceiptModal from './ReceiptModal';

export default function CartDrawer() {
  const { currentTenant, currentUser } = useUserStore();
  const {
    cart,
    orderType,
    customerName,
    orderNotes,
    discountAmount,
    paymentMethod,
    setOrderType,
    setCustomerName,
    setOrderNotes,
    setDiscountAmount,
    setPaymentMethod,
    updateQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
  } = usePosStore();

  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * currentTenant.tax_rate) / 100;
  const totalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const createdOrder = placeOrder(currentTenant.id, currentUser, currentTenant.tax_rate);
    setActiveReceiptOrder(createdOrder);
  };

  return (
    <>
      <div className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-full text-white shadow-2xl">
        {/* Cart Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-sm">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </div>
            <div>
              <div className="font-bold text-sm">Current Order</div>
              <div className="text-[10px] text-slate-400 font-mono">Cashier: {currentUser.name}</div>
            </div>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Order Type Selector (Dine-in / Takeaway / Delivery) */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="grid grid-cols-3 gap-2">
            {[
              { type: 'DINE_IN' as OrderType, label: 'Dine-In', icon: UtensilsCrossed },
              { type: 'TAKEAWAY' as OrderType, label: 'Takeaway', icon: ShoppingBag },
              { type: 'DELIVERY' as OrderType, label: 'Delivery', icon: Bike },
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`flex flex-col items-center justify-center py-2 rounded-xl text-xs font-semibold transition-all ${
                  orderType === type
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/40'
                }`}
              >
                <Icon className="w-4 h-4 mb-1" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Customer & Table Info */}
        <div className="p-3 border-b border-slate-800/80 space-y-2 bg-slate-900/50">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Customer Name / Token Tag (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <ShoppingBag className="w-12 h-12 mb-3 text-slate-700" />
              <div className="text-sm font-medium text-slate-400">Cart is empty</div>
              <div className="text-xs text-slate-500 mt-1">Tap menu items to add to order</div>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3 flex flex-col space-y-2 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <div className="text-xs font-semibold text-slate-200">{item.product.name}</div>
                    <div className="text-[11px] text-orange-400 font-mono mt-0.5">
                      {currentTenant.currency}{item.product.price.toFixed(2)} × {item.quantity} = {currentTenant.currency}
                      {(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-500 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <div className="text-[10px] text-slate-400">Qty</div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-orange-500 text-white flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-xs w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-orange-500 text-white flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation & Payment Mode */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-3">
            {/* Discount and Totals */}
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono">{currentTenant.currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Percent className="w-3 h-3" />
                  <span>Discount</span>
                </span>
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={discountAmount || ''}
                  onChange={(e) => setDiscountAmount(Number(e.target.value))}
                  placeholder="0"
                  className="w-20 px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-right text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST / Tax ({currentTenant.tax_rate}%)</span>
                <span className="font-mono">{currentTenant.currency}{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Due</span>
                <span className="text-orange-400 font-mono">
                  {currentTenant.currency}{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Modes */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { method: 'CASH' as PaymentMethod, label: 'Cash', icon: Banknote },
                { method: 'UPI_QR' as PaymentMethod, label: 'UPI / QR', icon: QrCode },
                { method: 'CARD' as PaymentMethod, label: 'Card', icon: CreditCard },
              ].map(({ method, label, icon: Icon }) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                    paymentMethod === method
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Submit Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm tracking-wide shadow-xl shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              <span>PLACE ORDER & PRINT TOKEN</span>
            </button>
          </div>
        )}
      </div>

      {/* Printable Receipt Preview Modal */}
      {activeReceiptOrder && (
        <ReceiptModal
          order={activeReceiptOrder}
          onClose={() => setActiveReceiptOrder(null)}
        />
      )}
    </>
  );
}
