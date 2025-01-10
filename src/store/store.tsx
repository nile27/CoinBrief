import { create } from "zustand";

interface AuthState {
  isLogin: boolean;
  login: () => void;
  logout: () => void;
}

interface UserState {
  email: string;
  mycoin: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogin: true,
  login: () => set({ isLogin: true }),
  logout: () => set({ isLogin: false }),
}));
