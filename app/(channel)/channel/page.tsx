'use client';

import React from 'react';
import { usePosStore } from '@/lib/store/pos-store';
import { useUserStore } from '@/lib/store/user-store';
import { Activity, Clock, ShieldAlert, Sparkles, User } from 'lucide-react';

export default function ChannelPage() {
  const { currentTenant } = useUserStore();
  const { timeline } = usePosStore();

  const tenantTimeline = timeline.filter((t) => t.tenant_id === currentTenant.id);

  return (
    <div className="flex-1 bg-slate-950 text-white p-4 lg:p-8 flex flex-col overflow-hidden">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        {/* Header */}
        <div className="pb-6 border-b border-slate-800 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold flex items-center space-x-2">
                <span>Internal Order Activity Channel</span>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-xs font-mono">
                  Live Audit Stream
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Single source of truth for all cashier & kitchen actions in {currentTenant.name}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Log Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {tenantTimeline.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm">
              No activity logs recorded yet today.
            </div>
          ) : (
            tenantTimeline.map((entry) => {
              const timeString = new Date(entry.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              });

              let roleBadgeColor = 'bg-slate-800 text-slate-300';
              if (entry.actor_role === 'EMPLOYEE') roleBadgeColor = 'bg-orange-500/20 text-orange-400';
              if (entry.actor_role === 'KITCHEN_STAFF') roleBadgeColor = 'bg-amber-500/20 text-amber-400';
              if (entry.actor_role === 'BUSINESS_MANAGER') roleBadgeColor = 'bg-purple-500/20 text-purple-400';
              if (entry.actor_role === 'SUPER_ADMIN') roleBadgeColor = 'bg-red-500/20 text-red-400';

              return (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex items-start space-x-3 hover:border-slate-700 transition-colors"
                >
                  <div className="text-xs font-mono text-slate-500 pt-0.5 whitespace-nowrap">
                    {timeString}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-200">{entry.actor_name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${roleBadgeColor}`}>
                        {entry.actor_role.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1">{entry.message}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
