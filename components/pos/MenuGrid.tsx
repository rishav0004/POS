'use client';

import React from 'react';
import { usePosStore } from '@/lib/store/pos-store';
import { useUserStore } from '@/lib/store/user-store';
import { Product } from '@/lib/types';
import { Search, Plus, Utensils, AlertCircle } from 'lucide-react';

export default function MenuGrid() {
  const { currentTenant } = useUserStore();
  const {
    products,
    categories,
    selectedCategory,
    searchQuery,
    setSelectedCategory,
    setSearchQuery,
    addToCart,
  } = usePosStore();

  const tenantCategories = categories.filter((c) => c.tenant_id === currentTenant.id);
  const tenantProducts = products.filter((p) => p.tenant_id === currentTenant.id);

  const filteredProducts = tenantProducts.filter((product) => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 p-4 lg:p-6">
      {/* Search & Category Filter Bar */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search items by name or SKU... (or scan barcode)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
              selectedCategory === null
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>All Items ({tenantProducts.length})</span>
          </button>

          {tenantCategories.map((cat) => {
            const count = tenantProducts.filter((p) => p.category_id === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25 scale-105'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Card Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500">
            <AlertCircle className="w-12 h-12 mb-3 text-slate-600" />
            <div className="text-base font-medium text-slate-400">No items found</div>
            <div className="text-xs mt-1">Try adjusting your search or category filter</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const isOutOfStock = product.stock_quantity <= 0;
              const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold;

              return (
                <button
                  key={product.id}
                  disabled={isOutOfStock}
                  onClick={() => addToCart(product)}
                  className={`group relative flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden text-left transition-all hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/10 active:scale-95 disabled:opacity-50 disabled:pointer-events-none`}
                >
                  {/* Product Image */}
                  <div className="relative h-32 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={product.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {/* Stock Badges */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="px-2.5 py-1 rounded-md bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {isLowStock && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/90 text-black font-bold text-[9px] uppercase">
                          Low Stock: {product.stock_quantity}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="p-3.5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-100 line-clamp-2 group-hover:text-orange-400 transition-colors">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {product.sku}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
                      <div className="text-base font-bold text-orange-400">
                        {currentTenant.currency}{product.price.toFixed(2)}
                      </div>
                      <div className="w-7 h-7 rounded-xl bg-orange-500/20 text-orange-400 group-hover:bg-orange-500 group-hover:text-white flex items-center justify-center transition-colors">
                        <Plus className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
