'use client';

import React from 'react';
import { usePosStore } from '@/lib/store/pos-store';
import { useUserStore } from '@/lib/store/user-store';
import { Tv, Flame, BellRing, Sparkles, Utensils } from 'lucide-react';

export default function LiveQueuePage() {
  const { currentTenant } = useUserStore();
  const { orders } = usePosStore();

  const tenantOrders = orders.filter((o) => o.tenant_id === currentTenant.id);

  const preparingOrders = tenantOrders
    .filter((o) => ['QUEUED', 'PREPARING'].includes(o.status))
    .slice(0, 12);

  const readyOrders = tenantOrders
    .filter((o) => o.status === 'READY')
    .slice(0, 12);

  return (
    <div className="flex-1 bg-slate-950 text-white flex flex-col p-6 lg:p-10 overflow-hidden">
      {/* TV Screen Top Bar */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-xl shadow-orange-500/20">
            <Utensils className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
              {currentTenant.name}
            </h1>
            <p className="text-xs text-orange-400 font-mono tracking-wider uppercase">
              Live Order Status Screen
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      {/* Split Screen Columns */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 overflow-hidden">
        {/* PREPARING COLUMN */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl">
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wide uppercase text-amber-400">
                Preparing Now
              </h2>
              <p className="text-xs text-slate-400">Our chefs are cooking your meals</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {preparingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <div className="text-base font-medium text-slate-400">No orders currently cooking</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {preparingOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center flex flex-col items-center justify-center shadow-lg"
                  >
                    <div className="text-3xl sm:text-4xl font-black font-mono text-slate-200">
                      #{String(order.daily_queue_number).padStart(3, '0')}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold mt-1 uppercase">
                      {order.status === 'PREPARING' ? 'In Kitchen' : 'In Queue'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* READY FOR PICKUP COLUMN */}
        <div className="bg-slate-900/60 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wide uppercase text-emerald-400">
                Ready for Pickup
              </h2>
              <p className="text-xs text-slate-400">Please collect your meal at the counter</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {readyOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
                <div className="text-base font-medium text-slate-400">No orders ready yet</div>
                <div className="text-xs text-slate-600 mt-1">Orders ready for pickup will appear here</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {readyOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500 text-center flex flex-col items-center justify-center shadow-xl shadow-emerald-500/10 animate-pulse-subtle"
                  >
                    <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                      #{String(order.daily_queue_number).padStart(3, '0')}
                    </div>
                    <div className="text-[10px] text-emerald-300 font-bold mt-1 uppercase tracking-wider">
                      Please Collect
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
