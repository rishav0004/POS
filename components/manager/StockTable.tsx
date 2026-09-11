'use client';

import React, { useState } from 'react';
import { usePosStore } from '@/lib/store/pos-store';
import { useUserStore } from '@/lib/store/user-store';
import { Product } from '@/lib/types';
import { Package, AlertCircle, Plus, Check, Search, TrendingUp } from 'lucide-react';

export default function StockTable() {
  const { currentTenant, currentUser } = useUserStore();
  const { products, adjustStock } = usePosStore();
  const [search, setSearch] = useState('');
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(25);

  const tenantProducts = products.filter((p) => p.tenant_id === currentTenant.id);
  const filtered = tenantProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
            <Package className="w-5 h-5 text-orange-400" />
            <span>Product Inventory & Profit Margins</span>
          </h3>
          <p className="text-xs text-slate-400">Live stock counts with automatic order deduction</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stock..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="pb-3 font-semibold">Product</th>
              <th className="pb-3 font-semibold">Selling Price</th>
              <th className="pb-3 font-semibold">Cost Price</th>
              <th className="pb-3 font-semibold">Margin</th>
              <th className="pb-3 font-semibold text-center">Stock Level</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((product) => {
              const margin = product.price > 0 ? ((product.price - product.cost_price) / product.price) * 100 : 0;
              const isLow = product.stock_quantity <= product.low_stock_threshold;
              const isOut = product.stock_quantity <= 0;

              return (
                <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 pr-3">
                    <div className="font-semibold text-slate-200">{product.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{product.sku}</div>
                  </td>
                  <td className="py-3.5 font-mono text-slate-200">
                    {currentTenant.currency}{product.price.toFixed(2)}
                  </td>
                  <td className="py-3.5 font-mono text-slate-400">
                    {currentTenant.currency}{product.cost_price.toFixed(2)}
                  </td>
                  <td className="py-3.5 font-mono text-emerald-400">
                    {margin.toFixed(1)}%
                  </td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono ${
                        isOut
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : isLow
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {product.stock_quantity} in stock
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setRestockProduct(product)}
                      className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white font-semibold text-xs transition-colors inline-flex items-center space-x-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Restock</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Restock Modal */}
      {restockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-white">
            <h3 className="text-base font-bold mb-2">Restock {restockProduct.name}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Current stock: <b>{restockProduct.stock_quantity}</b> units
            </p>
            <div className="flex items-center space-x-2 mb-6">
              {[10, 25, 50, 100].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setRestockQty(qty)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    restockQty === qty
                      ? 'bg-orange-500 border-orange-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  +{qty}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  adjustStock(restockProduct.id, restockQty, 'Manual Inventory Restock', currentUser);
                  setRestockProduct(null);
                }}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold text-xs text-white transition-colors"
              >
                Confirm Restock (+{restockQty})
              </button>
              <button
                onClick={() => setRestockProduct(null)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
