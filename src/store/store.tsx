import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  isLogin: boolean;
  login: () => void;
  logout: () => void;
}

interface Iuser {
  email: string;
  mycoin: string[];
  nickname: string;
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
        email: "",
        mycoin: [],
        nickname: "",
      },
      setUser: (user) =>
        set(() => ({
          user,
        })),
      deleteUser: () =>
        set(() => ({
          user: {
            email: "",
            mycoin: [],
            nickname: "",
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
