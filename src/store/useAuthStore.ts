import { create } from 'zustand';
import { User } from 'firebase/auth';
import { api } from '../lib/api';
import { handleFirestoreError, OperationType } from '../lib/firebase';

interface AuthState {
  user: User | null;
  userData: any | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUserData: (uid: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userData: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  fetchUserData: async (uid: string) => {
    try {
      const data = await api.get(`/api/users/${uid}`);
      if (data && !data.error) {
        set({ userData: data });
      } else {
        set({ userData: null });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    }
  },
}));
