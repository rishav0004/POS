'use client';

import React from 'react';
import Link from 'next/link';
import { useUserStore } from '@/lib/store/user-store';
import { usePosStore } from '@/lib/store/pos-store';
import {
  ShoppingBag,
  ChefHat,
  Tv,
  Activity,
  BarChart3,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Users,
  Layers,
} from 'lucide-react';

export default function HomePage() {
  const { currentTenant, currentUser, setCurrentUser, users } = useUserStore();
  const { orders } = usePosStore();

  const tenantOrders = orders.filter((o) => o.tenant_id === currentTenant.id);
  const queuedCount = tenantOrders.filter((o) => o.status === 'QUEUED').length;
  const preparingCount = tenantOrders.filter((o) => o.status === 'PREPARING').length;
  const readyCount = tenantOrders.filter((o) => o.status === 'READY').length;

  const modules = [
    {
      title: 'Employee Touch POS',
      href: '/pos',
      description: 'High-speed order punching, quick product search, modifier add-ons, split payments, and instant token generation.',
      icon: ShoppingBag,
      color: 'from-orange-500 to-amber-500',
      badge: 'Cashier Terminal',
    },
    {
      title: 'Kitchen Display (KDS)',
      href: '/kitchen',
      description: 'Centralized FIFO queue, elapsed order timers, sound chimes, and 1-click status transitions (Start -> Ready -> Serve).',
      icon: ChefHat,
      color: 'from-amber-500 to-yellow-600',
      badge: `${queuedCount + preparingCount} Active in Kitchen`,
    },
    {
      title: 'Now Serving TV Screen',
      href: '/live-queue',
      description: 'Split-screen customer display for dining halls showing "Preparing" vs "Ready for Pickup" with chime alerts.',
      icon: Tv,
      color: 'from-emerald-500 to-teal-600',
      badge: `${readyCount} Ready for Pickup`,
    },
    {
      title: 'Live Order Channel',
      href: '/channel',
      description: 'Real-time audit log stream tracking every order event, cashier action, priority bump, and preparation milestone.',
      icon: Activity,
      color: 'from-blue-500 to-indigo-600',
      badge: 'Audit Stream',
    },
    {
      title: 'Manager Dashboard',
      href: '/dashboard',
      description: 'Sales velocity charts, payment method breakdown, individual employee sales ranking, and stock deduction alerts.',
      icon: BarChart3,
      color: 'from-purple-500 to-pink-600',
      badge: 'Analytics & Stock',
    },
    {
      title: 'Super Admin SaaS',
      href: '/admin',
      description: 'Multi-tenant franchise onboarding, subscription plans (Starter/Business/Enterprise), and global platform revenue metrics.',
      icon: ShieldAlert,
      color: 'from-rose-500 to-red-600',
      badge: 'Platform Owner',
    },
  ];

  return (
    <div className="flex-1 bg-slate-950 text-white overflow-y-auto">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-Tenant SaaS POS & Centralized Order Queue</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Eradicate Order Chaos.{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
              Speed Up Your Kitchen.
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Employees punch orders simultaneously, while the kitchen follows a deterministic FIFO queue.
            Instant token generation, real-time KDS audio chimes, and automatic inventory deduction.
          </p>

          {/* Quick Active Shop Context Bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs">
            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2">
              <span className="text-slate-500">Active Tenant:</span>
              <span className="font-bold text-orange-400">{currentTenant.name}</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center space-x-2">
              <span className="text-slate-500">Logged in as:</span>
              <span className="font-bold text-slate-200">{currentUser.name}</span>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-mono text-[10px]">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono text-[10px] font-semibold">
                      {mod.badge}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-100 group-hover:text-orange-400 transition-colors">
                    {mod.title}
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center text-xs font-bold text-orange-400 space-x-1.5 group-hover:translate-x-1 transition-transform">
                  <span>Open Module</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Role Switcher for Testing */}
        <div className="mt-16 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-orange-400" />
              <h3 className="font-bold text-sm text-slate-200">Instant Demo Role Switcher</h3>
            </div>
            <span className="text-[11px] text-slate-500">Switch user context to test role permissions</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {users.map((user) => {
              const isCurrent = user.id === currentUser.id;
              return (
                <button
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    isCurrent
                      ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/25 scale-105'
                      : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{user.name}</div>
                  <div
                    className={`text-[10px] font-mono mt-0.5 truncate ${
                      isCurrent ? 'text-orange-100' : 'text-slate-400'
                    }`}
                  >
                    {user.role.replace('_', ' ')}
                  </div>
                  <div
                    className={`text-[9px] font-mono mt-1 ${
                      isCurrent ? 'text-white/80' : 'text-orange-400'
                    }`}
                  >
                    PIN: {user.pin_code}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
