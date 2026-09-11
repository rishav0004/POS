'use client';

import React, { useState } from 'react';
import { useUserStore } from '@/lib/store/user-store';
import { X, Delete, Check, KeyRound, ShieldCheck, User } from 'lucide-react';

interface QuickPinModalProps {
  onClose: () => void;
}

export default function QuickPinModal({ onClose }: QuickPinModalProps) {
  const { currentTenant, users, switchUserByPin, setCurrentUser } = useUserStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const tenantUsers = users.filter(
    (u) => u.tenant_id === currentTenant.id || u.role === 'SUPER_ADMIN'
  );

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError(null);

      // Auto-submit on 4th digit
      if (nextPin.length === 4) {
        const res = switchUserByPin(nextPin);
        if (res.success) {
          onClose();
        } else {
          setError(res.error || 'Incorrect PIN code');
          setTimeout(() => setPin(''), 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-white">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold">Quick Cashier Switch</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter 4-digit PIN for {currentTenant.name}
          </p>
        </div>

        {/* PIN Indicators */}
        <div className="flex justify-center space-x-4 mb-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                pin.length > index
                  ? 'bg-orange-500 scale-110 shadow-lg shadow-orange-500/50'
                  : 'bg-slate-800 border border-slate-700'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="text-xs text-red-400 text-center font-medium mb-4 animate-shake">
            {error}
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-orange-500 active:text-white border border-slate-700/60 text-xl font-semibold transition-all"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="h-14 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 text-xs font-semibold text-slate-400 transition-all"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-orange-500 active:text-white border border-slate-700/60 text-xl font-semibold transition-all"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-red-500/40 border border-slate-700/60 flex items-center justify-center text-slate-300 transition-all"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Quick-Switch Helper Chips */}
        <div className="border-t border-slate-800 pt-4">
          <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2">
            Demo Cashier PINs (Click to switch)
          </div>
          <div className="grid grid-cols-2 gap-2">
            {tenantUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  setCurrentUser(user);
                  onClose();
                }}
                className="flex items-center space-x-2 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 text-left transition-all text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="font-medium text-slate-200 truncate">{user.name}</div>
                  <div className="text-[9px] text-orange-400 font-mono">PIN: {user.pin_code}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
