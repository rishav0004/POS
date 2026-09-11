import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Tenant, User, UserRole } from '../types';
import { INITIAL_TENANTS, INITIAL_USERS } from '../mock-data';

interface UserState {
  currentTenant: Tenant;
  currentUser: User;
  tenants: Tenant[];
  users: User[];
  setCurrentTenant: (tenant: Tenant) => void;
  setCurrentUser: (user: User) => void;
  switchUserByPin: (pin: string) => { success: boolean; user?: User; error?: string };
  addTenant: (tenant: Omit<Tenant, 'id' | 'created_at'>) => Tenant;
  updateTenantStatus: (tenantId: string, status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED') => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      currentTenant: INITIAL_TENANTS[0],
      currentUser: INITIAL_USERS[2], // Default to Rahul Sharma (Cashier 1)
      tenants: INITIAL_TENANTS,
      users: INITIAL_USERS,

      setCurrentTenant: (tenant: Tenant) => {
        // When tenant switches, switch default user to that tenant's manager or employee
        const tenantUsers = get().users.filter((u) => u.tenant_id === tenant.id);
        const nextUser = tenantUsers[0] || get().currentUser;
        set({ currentTenant: tenant, currentUser: nextUser });
      },

      setCurrentUser: (user: User) => {
        set({ currentUser: user });
      },

      switchUserByPin: (pin: string) => {
        const { users, currentTenant } = get();
        // Match user within current tenant or Super Admin (pin 9999)
        const matched = users.find(
          (u) =>
            u.pin_code === pin &&
            u.is_active &&
            (u.tenant_id === currentTenant.id || u.role === 'SUPER_ADMIN')
        );

        if (matched) {
          set({ currentUser: matched });
          return { success: true, user: matched };
        }
        return { success: false, error: 'Invalid 4-digit PIN for this shop.' };
      },

      addTenant: (newTenantData) => {
        const id = 'a' + Math.random().toString(36).substring(2, 9) + '-0000-0000-0000-000000000000';
        const newTenant: Tenant = {
          ...newTenantData,
          id,
          created_at: new Date().toISOString(),
        };

        const defaultManager: User = {
          id: 'u' + Math.random().toString(36).substring(2, 9),
          tenant_id: id,
          name: `${newTenant.name} Manager`,
          email: `manager@${newTenant.slug}.com`,
          role: 'BUSINESS_MANAGER',
          pin_code: '1234',
          is_active: true,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          tenants: [...state.tenants, newTenant],
          users: [...state.users, defaultManager],
        }));

        return newTenant;
      },

      updateTenantStatus: (tenantId, status) => {
        set((state) => ({
          tenants: state.tenants.map((t) =>
            t.id === tenantId ? { ...t, status } : t
          ),
          currentTenant:
            state.currentTenant.id === tenantId
              ? { ...state.currentTenant, status }
              : state.currentTenant,
        }));
      },
    }),
    {
      name: 'queuepos_user_store',
    }
  )
);
