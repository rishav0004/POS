'use client';

import React from 'react';
import MenuGrid from '@/components/pos/MenuGrid';
import CartDrawer from '@/components/pos/CartDrawer';
import { useUserStore } from '@/lib/store/user-store';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function PosPage() {
  const { currentUser } = useUserStore();

  const isAllowed = ['SUPER_ADMIN', 'BUSINESS_MANAGER', 'EMPLOYEE'].includes(currentUser.role);

  if (!isAllowed) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950 p-6 text-center text-white">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Access Restricted</h2>
          <p className="text-xs text-slate-400 mt-2">
            The POS terminal requires Cashier, Manager, or Admin privileges. Current role: <b>{currentUser.role}</b>
          </p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-xl text-xs font-bold transition-colors"
          >
            Switch User on Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-950">
      <MenuGrid />
      <CartDrawer />
    </div>
  );
}
