'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { usePosStore } from '@/lib/store/pos-store';
import {
  ShieldAlert,
  Building2,
  Users,
  CreditCard,
  Plus,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function SuperAdminPage() {
  const { tenants, users, addTenant, updateTenantStatus, setCurrentTenant } = useUserStore();
  const { orders } = usePosStore();

  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantSlug, setTenantSlug] = useState('');
  const [tenantPlan, setTenantPlan] = useState<'Starter' | 'Business' | 'Enterprise'>('Business');
  const [taxRate, setTaxRate] = useState(5.0);

  // Global Platform Metrics
  const totalBusinesses = tenants.length;
  const activeBusinesses = tenants.filter((t) => t.status === 'ACTIVE').length;
  const totalOrdersPlatform = orders.length;
  const totalPlatformGMV = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const activeEmployeesPlatform = users.filter((u) => u.role !== 'SUPER_ADMIN').length;

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName || !tenantSlug) return;

    const newTenant = addTenant({
      name: tenantName,
      slug: tenantSlug.toLowerCase().replace(/\s+/g, '-'),
      plan: tenantPlan,
      status: 'ACTIVE',
      currency: '₹',
      tax_rate: Number(taxRate),
    });

    setCurrentTenant(newTenant);
    setShowAddTenantModal(false);
    setTenantName('');
    setTenantSlug('');
  };

  return (
    <div className="flex-1 bg-slate-950 text-white p-4 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Super Admin Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Super Admin SaaS Control Portal</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Ecosystem overview, multi-tenant billing, and platform health
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddTenantModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-2xl text-xs font-bold text-white flex items-center space-x-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard New Tenant</span>
          </button>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Total Businesses</span>
              <Building2 className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black font-mono text-slate-100">{totalBusinesses}</div>
            <div className="text-[10px] text-emerald-400 mt-1">{activeBusinesses} Active Accounts</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Global Orders</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black font-mono text-blue-400">{totalOrdersPlatform}</div>
            <div className="text-[10px] text-slate-400 mt-1">Across all shops</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Platform GMV</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              ₹{totalPlatformGMV.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">Gross sales volume</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Active Staff</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black font-mono text-purple-400">{activeEmployeesPlatform}</div>
            <div className="text-[10px] text-slate-400 mt-1">Cashiers & cooks</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="text-xs text-slate-400 mb-1 flex items-center justify-between">
              <span>Subscription MRR</span>
              <CreditCard className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-400">₹1,498/mo</div>
            <div className="text-[10px] text-emerald-400 mt-1">Recurring SaaS revenue</div>
          </div>
        </div>

        {/* Tenants Management Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold">Registered Business Tenants</h2>
              <p className="text-xs text-slate-400">Isolated database partitions per shop</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Tenant Name</th>
                  <th className="pb-3 font-semibold">Subdomain Slug</th>
                  <th className="pb-3 font-semibold">Plan Tier</th>
                  <th className="pb-3 font-semibold">Tax Rate</th>
                  <th className="pb-3 font-semibold text-center">Status</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tenants.map((tenant) => {
                  const isActive = tenant.status === 'ACTIVE';
                  return (
                    <tr key={tenant.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 pr-3">
                        <div className="font-bold text-slate-100">{tenant.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{tenant.id}</div>
                      </td>
                      <td className="py-4 font-mono text-slate-300">
                        {tenant.slug}.queuepos.io
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 font-semibold font-mono text-[11px]">
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-slate-300">{tenant.tax_rate}%</td>
                      <td className="py-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {tenant.status}
                        </span>
                      </td>
                      <td className="py-4 text-right space-x-2">
                        <button
                          onClick={() => setCurrentTenant(tenant)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs transition-colors"
                        >
                          Switch Context
                        </button>
                        <button
                          onClick={() =>
                            updateTenantStatus(
                              tenant.id,
                              isActive ? 'SUSPENDED' : 'ACTIVE'
                            )
                          }
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white'
                              : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white'
                          }`}
                        >
                          {isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Onboard New Tenant Modal */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-orange-400" />
              <span>Onboard New Tenant Business</span>
            </h3>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Domino's Pizza Counter"
                  value={tenantName}
                  onChange={(e) => {
                    setTenantName(e.target.value);
                    if (!tenantSlug) {
                      setTenantSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Subdomain Slug
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="dominos"
                    value={tenantSlug}
                    onChange={(e) => setTenantSlug(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-l-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                  <span className="bg-slate-800 px-3 py-2 text-xs text-slate-400 border border-l-0 border-slate-800 rounded-r-xl font-mono">
                    .queuepos.io
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">SaaS Plan</label>
                  <select
                    value={tenantPlan}
                    onChange={(e) =>
                      setTenantPlan(e.target.value as 'Starter' | 'Business' | 'Enterprise')
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500"
                  >
                    <option value="Starter">Starter (₹499/mo)</option>
                    <option value="Business">Business (₹999/mo)</option>
                    <option value="Enterprise">Enterprise (Custom)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold text-xs text-white shadow-lg shadow-orange-500/20 transition-all"
                >
                  Create & Activate Tenant
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTenantModal(false)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
