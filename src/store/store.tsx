import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isLogin: boolean;
  login: () => void;
  logout: () => void;
}

export interface Iuser {
  name: string;
  email: string;
  mycoin: string[];
  displayName: string;
}

interface UserState {
  user: Iuser;
  setUser: (user: Iuser) => void;
  deleteUser: () => void;
}

interface ICurrency {
  currency: string;
  krw: () => void;
  usd: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLogin: true,
      login: () => set({ isLogin: true }),
      logout: () => set({ isLogin: false }),
    }),
    {
      name: "login-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        name: "",
        email: "",
        mycoin: [],
        displayName: "",
      },
      setUser: (user) =>
        set(() => ({
          user,
        })),
      deleteUser: () =>
        set(() => ({
          user: {
            name: "",
            email: "",
            mycoin: [],
            displayName: "",
          },
        })),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
export const useCurrency = create<ICurrency>((set) => ({
  currency: "$",
  krw: () => set({ currency: "₩" }),
  usd: () => set({ currency: "$" }),
}));
