'use client';

import React, { useState } from 'react';
import { usePosStore } from '@/lib/store/pos-store';
import { useUserStore } from '@/lib/store/user-store';
import { OrderStatus } from '@/lib/types';
import KitchenCard from '@/components/kitchen/KitchenCard';
import { playSound } from '@/lib/sound';
import {
  ChefHat,
  Volume2,
  Clock,
  CheckCircle2,
  Flame,
  Layers,
  Inbox,
  Sparkles,
} from 'lucide-react';

export default function KitchenPage() {
  const { currentTenant } = useUserStore();
  const { orders } = usePosStore();
  const [filter, setFilter] = useState<'ACTIVE' | OrderStatus>('ACTIVE');

  const tenantOrders = orders.filter((o) => o.tenant_id === currentTenant.id);

  // Sorting: URGENT first, then oldest createdAt first (Strict FIFO queue!)
  const sortedOrders = [...tenantOrders].sort((a, b) => {
    if (a.priority === 'URGENT' && b.priority !== 'URGENT') return -1;
    if (b.priority === 'URGENT' && a.priority !== 'URGENT') return 1;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const activeOrders = sortedOrders.filter((o) => ['QUEUED', 'PREPARING', 'READY'].includes(o.status));
  const queuedOrders = sortedOrders.filter((o) => o.status === 'QUEUED');
  const preparingOrders = sortedOrders.filter((o) => o.status === 'PREPARING');
  const readyOrders = sortedOrders.filter((o) => o.status === 'READY');
  const completedOrders = [...sortedOrders]
    .filter((o) => o.status === 'COMPLETED')
    .reverse(); // most recent completed first

  let displayedOrders = activeOrders;
  if (filter === 'QUEUED') displayedOrders = queuedOrders;
  if (filter === 'PREPARING') displayedOrders = preparingOrders;
  if (filter === 'READY') displayedOrders = readyOrders;
  if (filter === 'COMPLETED') displayedOrders = completedOrders;

  return (
    <div className="flex-1 bg-slate-950 text-white p-4 lg:p-6 flex flex-col overflow-hidden">
      {/* KDS Header & Stats Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 shadow-lg shadow-orange-500/10">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold flex items-center space-x-2">
              <span>Kitchen Display System (KDS)</span>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono">
                FIFO Queue
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict order progression for {currentTenant.name}
            </p>
          </div>
        </div>

        {/* Audio Sound Test Button & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => playSound('new_order')}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-center space-x-1.5 transition-colors"
            title="Test KDS Chime Audio"
          >
            <Volume2 className="w-4 h-4 text-orange-400" />
            <span>Test Chime</span>
          </button>

          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
            {[
              { id: 'ACTIVE', label: 'Active Queue', count: activeOrders.length, icon: Layers },
              { id: 'QUEUED', label: 'Queued', count: queuedOrders.length, icon: Clock },
              { id: 'PREPARING', label: 'Cooking', count: preparingOrders.length, icon: Flame },
              { id: 'READY', label: 'Ready', count: readyOrders.length, icon: CheckCircle2 },
              { id: 'COMPLETED', label: 'Served', count: completedOrders.length, icon: Inbox },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as 'ACTIVE' | OrderStatus)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ticket Cards Grid */}
      <div className="flex-1 overflow-y-auto">
        {displayedOrders.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
            <ChefHat className="w-16 h-16 mb-4 text-slate-800" />
            <div className="text-base font-semibold text-slate-400">All caught up in the kitchen!</div>
            <div className="text-xs text-slate-500 mt-1">
              New orders punched at the POS will appear here instantly.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {displayedOrders.map((order) => (
              <KitchenCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
