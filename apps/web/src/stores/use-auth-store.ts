import { create } from 'zustand';
import { User } from '@/types';
import { mockUser } from '@/lib/api-client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  login: async (email: string) => {
    set({ isLoading: true });
    // Simulate login API call
    setTimeout(() => {
      set({
        user: { ...mockUser, email },
        isAuthenticated: true,
        isLoading: false,
      });
    }, 400);
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
  updateUser: (data) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
}));
