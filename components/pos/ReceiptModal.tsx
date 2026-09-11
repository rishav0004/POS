'use client';

import React from 'react';
import { Order } from '@/lib/types';
import { useUserStore } from '@/lib/store/user-store';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export default function ReceiptModal({ order, onClose }: ReceiptModalProps) {
  const { currentTenant } = useUserStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl relative text-white flex flex-col max-h-[90vh]">
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">Order Queued Successfully</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Paper Container */}
        <div className="flex-1 overflow-y-auto my-4 p-4 bg-white text-black font-mono rounded-xl shadow-inner text-xs leading-relaxed printable-receipt">
          <div className="text-center border-b border-dashed border-gray-400 pb-3 mb-3">
            <div className="text-base font-black uppercase tracking-wider">{currentTenant.name}</div>
            <div className="text-[10px] text-gray-600">Centralized Cloud POS Terminal</div>
            <div className="text-[10px] text-gray-500 mt-1">
              {new Date(order.created_at).toLocaleString()}
            </div>
          </div>

          {/* Big Daily Queue Number Token */}
          <div className="text-center py-2 bg-gray-100 rounded-lg my-2 border border-dashed border-gray-300">
            <div className="text-[10px] text-gray-600 font-bold uppercase">Queue Token Number</div>
            <div className="text-3xl font-black tracking-widest text-black">
              #{String(order.daily_queue_number).padStart(3, '0')}
            </div>
            <div className="text-[10px] text-gray-500 font-semibold">{order.order_number}</div>
          </div>

          {/* Customer & Type */}
          <div className="flex justify-between py-1 border-b border-gray-200 text-[11px]">
            <span>Type: <b>{order.order_type}</b></span>
            <span>Cashier: <b>{order.created_by_name || 'Staff'}</b></span>
          </div>
          {order.customer_name && (
            <div className="py-0.5 text-[11px]">
              Customer: <b>{order.customer_name}</b>
            </div>
          )}

          {/* Itemized Table */}
          <table className="w-full my-3 text-[11px]">
            <thead>
              <tr className="border-b border-black text-left">
                <th className="pb-1">Item</th>
                <th className="pb-1 text-center">Qty</th>
                <th className="pb-1 text-right">Amt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-1 pr-1">{item.product_name}</td>
                  <td className="py-1 text-center font-bold">x{item.quantity}</td>
                  <td className="py-1 text-right font-mono">
                    {currentTenant.currency}{item.subtotal.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary Math */}
          <div className="border-t border-dashed border-gray-400 pt-2 space-y-1 text-[11px]">
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span>-{currentTenant.currency}{order.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>GST / Tax ({currentTenant.tax_rate}%)</span>
              <span>{currentTenant.currency}{order.tax_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-black border-t border-black pt-1">
              <span>TOTAL PAID</span>
              <span>{currentTenant.currency}{order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-600 pt-0.5">
              <span>Mode: {order.payment_method}</span>
              <span>Status: {order.payment_status}</span>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-dashed border-gray-400 mt-3">
            <div className="text-[10px] font-bold">Please wait for your Queue Token on the TV screen!</div>
            <div className="text-[9px] text-gray-500 mt-1">Thank you for dining with us!</div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex space-x-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-2xl text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>PRINT THERMAL SLIP</span>
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-slate-300 font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
