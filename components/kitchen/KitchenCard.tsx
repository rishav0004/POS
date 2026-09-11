'use client';

import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '@/lib/types';
import { usePosStore } from '@/lib/store/pos-store';
import { useUserStore } from '@/lib/store/user-store';
import {
  Clock,
  Play,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Check,
  Sparkles,
  ShoppingBag,
  UtensilsCrossed,
  Bike,
} from 'lucide-react';

interface KitchenCardProps {
  order: Order;
}

export default function KitchenCard({ order }: KitchenCardProps) {
  const { currentUser } = useUserStore();
  const { updateOrderStatus, setOrderPriority } = usePosStore();
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [priorityReason, setPriorityReason] = useState('');

  // Live timer calculation
  useEffect(() => {
    const calculateElapsed = () => {
      const createdTime = new Date(order.created_at).getTime();
      const now = Date.now();
      const diffMins = Math.floor((now - createdTime) / (1000 * 60));
      setElapsedMinutes(Math.max(0, diffMins));
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 30000); // update every 30s
    return () => clearInterval(interval);
  }, [order.created_at]);

  // Color coding by wait time
  let timerBadgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (elapsedMinutes >= 10) {
    timerBadgeColor = 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse';
  } else if (elapsedMinutes >= 5) {
    timerBadgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  }

  const isUrgent = order.priority === 'URGENT';

  return (
    <>
      <div
        className={`flex flex-col bg-slate-900 rounded-3xl border transition-all duration-200 shadow-xl overflow-hidden ${
          isUrgent
            ? 'border-red-500 ring-2 ring-red-500/30 shadow-red-500/20'
            : order.status === 'PREPARING'
            ? 'border-amber-500/50 shadow-amber-500/10'
            : order.status === 'READY'
            ? 'border-emerald-500/50 shadow-emerald-500/10'
            : 'border-slate-800'
        }`}
      >
        {/* Urgent Priority Top Ribbon */}
        {isUrgent && (
          <div className="bg-red-600 px-4 py-1.5 flex items-center justify-between text-white font-bold text-xs">
            <div className="flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>URGENT PRIORITY</span>
            </div>
            {order.priority_reason && (
              <span className="text-[10px] opacity-90 truncate max-w-[180px]">
                {order.priority_reason}
              </span>
            )}
          </div>
        )}

        {/* Card Header */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex flex-col items-center justify-center font-mono border border-orange-500/30">
              <span className="text-[9px] uppercase font-bold text-slate-400">Queue</span>
              <span className="text-xl font-black leading-none">
                #{String(order.daily_queue_number).padStart(3, '0')}
              </span>
            </div>
            <div>
              <div className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <span>{order.customer_name || 'Walk-in'}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-2 mt-0.5">
                <span>{order.order_number}</span>
                <span>•</span>
                <span className="capitalize">{order.order_type.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Elapsed Timer Badge */}
          <div
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-full border text-xs font-mono font-bold ${timerBadgeColor}`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{elapsedMinutes}m ago</span>
          </div>
        </div>

        {/* Items List for Kitchen */}
        <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-60">
          {order.items?.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex items-start justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/60"
            >
              <div className="flex-1 pr-2">
                <div className="text-sm font-semibold text-slate-100 flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-orange-400 font-black text-xs flex items-center justify-center">
                    {item.quantity}
                  </span>
                  <span>{item.product_name}</span>
                </div>
                {item.notes && (
                  <div className="text-xs text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded mt-1 font-medium">
                    ⚠️ Note: {item.notes}
                  </div>
                )}
              </div>
            </div>
          ))}

          {order.notes && (
            <div className="text-xs text-slate-400 italic bg-slate-800/40 p-2 rounded-lg">
              &quot;{order.notes}&quot;
            </div>
          )}
        </div>

        {/* Action Progression Footer */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center space-x-2">
          {order.status === 'QUEUED' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'PREPARING', currentUser)}
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Flame className="w-4 h-4" />
              <span>START PREPARING</span>
            </button>
          )}

          {order.status === 'PREPARING' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'READY', currentUser)}
              className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>MARK READY FOR PICKUP</span>
            </button>
          )}

          {order.status === 'READY' && (
            <button
              onClick={() => updateOrderStatus(order.id, 'COMPLETED', currentUser)}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 border border-slate-700 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>COMPLETE & SERVE</span>
            </button>
          )}

          {/* Manager Urgent Priority Trigger */}
          {['SUPER_ADMIN', 'BUSINESS_MANAGER'].includes(currentUser.role) && !isUrgent && order.status !== 'READY' && (
            <button
              onClick={() => setShowPriorityModal(true)}
              className="p-3 rounded-xl bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-slate-700/60 transition-colors"
              title="Manager Queue Priority Bump"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Manager Urgent Priority Reason Modal */}
      {showPriorityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-white">
            <h3 className="text-base font-bold flex items-center space-x-2 text-red-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Prioritize Order #{order.daily_queue_number}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Manager authorization required. Please log the reason for bumping queue position:
            </p>
            <input
              type="text"
              placeholder="e.g., Customer train departure / VIP guest"
              value={priorityReason}
              onChange={(e) => setPriorityReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500 mb-4"
            />
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  if (priorityReason.trim()) {
                    setOrderPriority(order.id, 'URGENT', priorityReason, currentUser);
                    setShowPriorityModal(false);
                  }
                }}
                disabled={!priorityReason.trim()}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl font-bold text-xs transition-colors"
              >
                Confirm Priority
              </button>
              <button
                onClick={() => setShowPriorityModal(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
