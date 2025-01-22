import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Coin {
  id: string;
  symbol: string;
  name: string;
}
interface AuthState {
  isLogin: boolean;
  login: () => void;
  logout: () => void;
}

export interface Iuser {
  id: string;
  name: string;
  email: string;
  mycoin: { id: string; symbol: string; name: string }[];
  displayName: string;
}

interface UserState {
  user: Iuser;
  setUser: (user: Iuser) => void;
  deleteUser: () => void;
  Addcoin: (coin: Coin) => Promise<void>;
  deleteCoin: (idx: number) => void;
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
        id: "",
        name: "",
        email: "",
        mycoin: [],
        displayName: "",
      },
      setUser: (user) =>
        set(() => ({
          user,
        })),
      Addcoin: async (coin: Coin) => {
        const { id, mycoin } = useUserStore.getState().user;

        if (mycoin.some((c) => c.id === coin.id)) return;

        try {
          const res = await fetch("/api/addcoin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: id,
              coin,
            }),
          });

          if (!res.ok) {
            throw new Error("이미 등록된 정보입니다.");
          }

          set((state) => ({
            user: {
              ...state.user,
              mycoin: [...state.user.mycoin, coin],
            },
          }));
        } catch (error) {
          console.error("Error adding coin:", error);
        }
      },
      deleteCoin: async (idx: number) => {
        const { id, mycoin } = useUserStore.getState().user;

        // 삭제할 코인 정보 가져오기
        const coinToDelete = mycoin[idx];
        if (!coinToDelete) return;

        try {
          // Firebase에 삭제 요청
          const res = await fetch("/api/deletecoin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uid: id,
              coin: coinToDelete,
            }),
          });

          if (!res.ok) {
            throw new Error("Failed to delete coin from Firebase");
          }

          set((state) => ({
            user: {
              ...state.user,
              mycoin: state.user.mycoin.filter((_, index) => index !== idx),
            },
          }));
        } catch (error) {
          console.error("Error deleting coin:", error);
        }
      },

      deleteUser: () =>
        set(() => ({
          user: {
            id: "",
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
