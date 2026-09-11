'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { usePosStore } from '@/lib/store/pos-store';
import { useUserStore } from '@/lib/store/user-store';

export default function SalesChart() {
  const { currentTenant } = useUserStore();
  const { orders } = usePosStore();

  const tenantOrders = orders.filter((o) => o.tenant_id === currentTenant.id);

  // Hourly / Recent Sales distribution
  const hourlyData = [
    { time: '10 AM', sales: 1240, orders: 8 },
    { time: '11 AM', sales: 2850, orders: 15 },
    { time: '12 PM', sales: 6420, orders: 32 },
    { time: '1 PM', sales: 8900, orders: 44 },
    { time: '2 PM', sales: 5120, orders: 26 },
    { time: '3 PM', sales: 3400, orders: 18 },
    { time: '4 PM', sales: 4100, orders: 22 },
  ];

  // Payment Methods Breakdown
  const paymentCounts: Record<string, number> = { CASH: 0, UPI_QR: 0, CARD: 0 };
  tenantOrders.forEach((o) => {
    if (paymentCounts[o.payment_method] !== undefined) {
      paymentCounts[o.payment_method] += o.total_amount;
    }
  });

  const pieData = [
    { name: 'UPI / QR', value: paymentCounts.UPI_QR || 2450, color: '#f97316' },
    { name: 'Cash', value: paymentCounts.CASH || 1820, color: '#10b981' },
    { name: 'Card', value: paymentCounts.CARD || 1200, color: '#3b82f6' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hourly Sales Bar Chart */}
      <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-slate-100">Hourly Sales Velocity</h3>
            <p className="text-xs text-slate-400">Peak ordering trends for today</p>
          </div>
          <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-mono font-bold">
            Live Stream
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val) => [`₹${Number(val).toLocaleString()}`, 'Sales']}
              />
              <Bar dataKey="sales" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Method Split Pie Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-100">Payment Modes</h3>
          <p className="text-xs text-slate-400">Cash vs UPI vs Card revenue</p>
        </div>

        <div className="h-52 w-full my-2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val) => [`₹${Number(val).toFixed(2)}`, 'Revenue']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800">
          {pieData.map((item) => (
            <div key={item.name} className="p-1 rounded-lg bg-slate-950/60">
              <div className="text-[10px] text-slate-400 font-medium">{item.name}</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5" style={{ color: item.color }}>
                ₹{item.value.toFixed(0)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
