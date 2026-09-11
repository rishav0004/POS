'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/lib/store/user-store';
import { usePosStore } from '@/lib/store/pos-store';
import {
  ShoppingBag,
  ChefHat,
  Tv,
  Activity,
  BarChart3,
  ShieldAlert,
  KeyRound,
  Building2,
  Bell,
  Utensils,
  Layers,
  ChevronDown,
} from 'lucide-react';
import QuickPinModal from './pos/QuickPinModal';

export default function Navbar() {
  const pathname = usePathname();
  const { currentTenant, currentUser, tenants, setCurrentTenant } = useUserStore();
  const { orders } = usePosStore();
  const [showPinModal, setShowPinModal] = useState(false);
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);

  // Active queue counters for current tenant
  const tenantOrders = orders.filter((o) => o.tenant_id === currentTenant.id);
  const queuedCount = tenantOrders.filter((o) => o.status === 'QUEUED').length;
  const preparingCount = tenantOrders.filter((o) => o.status === 'PREPARING').length;
  const readyCount = tenantOrders.filter((o) => o.status === 'READY').length;

  const navLinks = [
    { href: '/pos', label: 'POS Terminal', icon: ShoppingBag, roles: ['SUPER_ADMIN', 'BUSINESS_MANAGER', 'EMPLOYEE'] },
    { href: '/kitchen', label: 'Kitchen KDS', icon: ChefHat, badge: queuedCount + preparingCount, roles: ['SUPER_ADMIN', 'BUSINESS_MANAGER', 'KITCHEN_STAFF'] },
    { href: '/live-queue', label: 'Now Serving TV', icon: Tv, badge: readyCount, roles: ['SUPER_ADMIN', 'BUSINESS_MANAGER', 'EMPLOYEE', 'KITCHEN_STAFF'] },
    { href: '/channel', label: 'Live Channel', icon: Activity, roles: ['SUPER_ADMIN', 'BUSINESS_MANAGER', 'EMPLOYEE', 'KITCHEN_STAFF'] },
    { href: '/dashboard', label: 'Manager Hub', icon: BarChart3, roles: ['SUPER_ADMIN', 'BUSINESS_MANAGER'] },
    { href: '/admin', label: 'SaaS Admin', icon: ShieldAlert, roles: ['SUPER_ADMIN'] },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Tenant Switcher */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                  <Utensils className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-black text-lg tracking-tight bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
                    QueuePOS
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono leading-none">
                    Multi-Tenant Cloud
                  </div>
                </div>
              </Link>

              {/* Tenant Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowTenantDropdown(!showTenantDropdown)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-200 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-orange-400" />
                  <span className="font-medium max-w-[120px] truncate">{currentTenant.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-orange-500/20 text-orange-300 font-mono">
                    {currentTenant.plan}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showTenantDropdown && (
                  <div className="absolute left-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50">
                    <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Switch Business Tenant
                    </div>
                    {tenants.map((tenant) => (
                      <button
                        key={tenant.id}
                        onClick={() => {
                          setCurrentTenant(tenant);
                          setShowTenantDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                          tenant.id === currentTenant.id ? 'bg-orange-500/10 text-orange-400 font-semibold' : 'text-slate-300'
                        }`}
                      >
                        <span className="truncate">{tenant.name}</span>
                        <span className="text-[10px] text-slate-500">{tenant.plan}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks
                .filter((link) => link.roles.includes(currentUser.role))
                .map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                      {link.badge !== undefined && link.badge > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                            isActive ? 'bg-white text-orange-600' : 'bg-orange-500 text-white animate-pulse'
                          }`}
                        >
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
            </nav>

            {/* User Profile & Quick 4-Digit PIN Switcher */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowPinModal(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition-all hover:scale-105 active:scale-95"
                title="Quick PIN Switcher"
              >
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight max-w-[110px] truncate">
                    {currentUser.name}
                  </div>
                  <div className="text-[9px] text-orange-400 font-mono">
                    {currentUser.role.replace('_', ' ')}
                  </div>
                </div>
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick PIN Switcher Modal */}
      {showPinModal && <QuickPinModal onClose={() => setShowPinModal(false)} />}
    </>
  );
}
