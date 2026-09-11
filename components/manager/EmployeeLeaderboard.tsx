'use client';

import React from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { usePosStore } from '@/lib/store/pos-store';
import { Trophy, TrendingUp, Award, UserCheck } from 'lucide-react';

export default function EmployeeLeaderboard() {
  const { currentTenant, users } = useUserStore();
  const { orders } = usePosStore();

  const tenantUsers = users.filter(
    (u) => u.tenant_id === currentTenant.id && ['EMPLOYEE', 'BUSINESS_MANAGER'].includes(u.role)
  );

  const tenantOrders = orders.filter((o) => o.tenant_id === currentTenant.id);

  // Compute stats per employee
  const employeeStats = tenantUsers.map((user) => {
    const userOrders = tenantOrders.filter((o) => o.created_by_id === user.id);
    const totalSales = userOrders.reduce((sum, o) => sum + o.total_amount, 0);
    const avgTicket = userOrders.length > 0 ? totalSales / userOrders.length : 0;

    return {
      user,
      orderCount: userOrders.length,
      totalSales,
      avgTicket,
    };
  });

  // Sort by total sales descending
  employeeStats.sort((a, b) => b.totalSales - a.totalSales);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100">Employee Sales Leaderboard</h3>
            <p className="text-xs text-slate-400">Track individual cashier performance & ticket size</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono">Today&apos;s Shift</span>
      </div>

      <div className="divide-y divide-slate-800/80">
        {employeeStats.map((stat, idx) => {
          let rankBadge = 'bg-slate-800 text-slate-300';
          if (idx === 0) rankBadge = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
          if (idx === 1) rankBadge = 'bg-slate-400/20 text-slate-200 border border-slate-400/30';
          if (idx === 2) rankBadge = 'bg-orange-600/20 text-orange-400 border border-orange-600/30';

          return (
            <div key={stat.user.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono ${rankBadge}`}
                >
                  #{idx + 1}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200 flex items-center space-x-1.5">
                    <span>{stat.user.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">PIN: {stat.user.pin_code}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {stat.orderCount} orders punched • Avg. {currentTenant.currency}{stat.avgTicket.toFixed(0)} / order
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-bold text-orange-400 font-mono">
                  {currentTenant.currency}{stat.totalSales.toFixed(2)}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium flex items-center justify-end space-x-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>Active</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
