'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { usePosStore } from '@/lib/store/pos-store';
import SalesChart from '@/components/manager/SalesChart';
import EmployeeLeaderboard from '@/components/manager/EmployeeLeaderboard';
import StockTable from '@/components/manager/StockTable';
import {
  BarChart3,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Users,
  Plus,
  PackagePlus,
  Sparkles,
} from 'lucide-react';

export default function ManagerDashboard() {
  const { currentTenant, currentUser } = useUserStore();
  const { orders, products, categories, addProduct } = usePosStore();
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New Product State
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState(149);
  const [prodCost, setProdCost] = useState(60);
  const [prodCategory, setProdCategory] = useState('');
  const [prodStock, setProdStock] = useState(50);
  const [prodImage, setProdImage] = useState('');

  const tenantOrders = orders.filter((o) => o.tenant_id === currentTenant.id);
  const tenantProducts = products.filter((p) => p.tenant_id === currentTenant.id);
  const tenantCategories = categories.filter((c) => c.tenant_id === currentTenant.id);

  // Metrics
  const totalSales = tenantOrders.reduce((acc, o) => acc + o.total_amount, 0);
  const totalOrders = tenantOrders.length;
  const avgTicket = totalOrders > 0 ? totalSales / totalOrders : 0;
  const activeQueueCount = tenantOrders.filter((o) => ['QUEUED', 'PREPARING'].includes(o.status)).length;
  const lowStockCount = tenantProducts.filter((p) => p.stock_quantity <= p.low_stock_threshold).length;

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) return;

    addProduct({
      tenant_id: currentTenant.id,
      category_id: prodCategory || tenantCategories[0]?.id || 'c1',
      name: prodName,
      sku: prodSku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      price: Number(prodPrice),
      cost_price: Number(prodCost),
      stock_quantity: Number(prodStock),
      low_stock_threshold: 10,
      is_available: true,
      image_url: prodImage || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    });

    setShowAddProductModal(false);
    setProdName('');
    setProdSku('');
  };

  return (
    <div className="flex-1 bg-slate-950 text-white p-4 lg:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Manager Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black">{currentTenant.name} — Store Analytics</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs font-mono">
                Manager Hub
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live sales performance, employee shift totals, and stock inventory tracking
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-2xl text-xs font-bold text-white flex items-center space-x-2 shadow-lg shadow-orange-500/20 transition-all hover:scale-105"
            >
              <PackagePlus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Today&apos;s Revenue</span>
              <DollarSign className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-black text-orange-400 font-mono">
              {currentTenant.currency}{totalSales.toFixed(2)}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% vs yesterday</span>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Orders Today</span>
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">{totalOrders}</div>
            <div className="text-[10px] text-slate-400 mt-1">Total orders processed</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Avg. Ticket Size</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-slate-100 font-mono">
              {currentTenant.currency}{avgTicket.toFixed(0)}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Per transaction</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Active in Kitchen</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">{activeQueueCount}</div>
            <div className="text-[10px] text-slate-400 mt-1">Queued + Cooking</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>Low Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400 font-mono">{lowStockCount}</div>
            <div className="text-[10px] text-red-400/80 mt-1">Items need restock</div>
          </div>
        </div>

        {/* Charts & Leaderboard */}
        <SalesChart />
        <EmployeeLeaderboard />
        <StockTable />
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <PackagePlus className="w-5 h-5 text-orange-400" />
              <span>Add New Menu Item</span>
            </h3>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Crispy Chicken Wrap"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={prodCost}
                    onChange={(e) => setProdCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500"
                  >
                    {tenantCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold text-xs text-white shadow-lg shadow-orange-500/20 transition-all"
                >
                  Create Product
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
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
