import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
export interface Coin {
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

interface SearchDate {
  id: string;
  symbol: string;
}
interface SearchState {
  data: SearchDate[];
  fetchCoins: () => Promise<void>;
}
export interface RealTimeData {
  realKrw: number;
  realRate: string;
}

interface CoinState {
  selectedCoin: number;
  realTimeData: RealTimeData;
  exchange: number;
  coinId: string;

  setCoinId: (coin: string) => void;
  setSelectedCoin: (coin: number) => void;
  setRealTimeData: (data: RealTimeData) => void;
  setExchange: (exchange: number) => void;
}

export const useCoinStore = create<CoinState>((set) => ({
  selectedCoin: 0,
  realTimeData: { realKrw: 0, realRate: "" },
  exchange: 1400,
  coinId: "",

  setCoinId: (coin) => set({ coinId: coin }),
  setSelectedCoin: (coin) => set({ selectedCoin: coin }),
  setRealTimeData: (data) => set({ realTimeData: data }),
  setExchange: (exchange) => set({ exchange: exchange }),
}));

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

export const useSearchData = create<SearchState>()(
  persist(
    (set) => ({
      data: [],
      fetchCoins: async () => {
        try {
          const coinsCollection = collection(firestore, "coinSymbol");
          const snapshot = await getDocs(coinsCollection);

          const coins = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as SearchDate[];

          set({ data: coins });
        } catch (error) {
          console.error(
            "Firebase에서 CoinSymbol 데이터를 가져오는 데 실패했습니다.",
            error
          );
        }
      },
    }),
    {
      name: "search-storage",
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
          console.error("추가 코인 에러:", error);
        }
      },
      deleteCoin: async (idx: number) => {
        const { id, mycoin } = useUserStore.getState().user;

        const coinToDelete = mycoin[idx];
        if (!coinToDelete) return;

        try {
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
            throw new Error("코인 삭제에 실패하였습니다.");
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
  currency: "₩",
  krw: () => set({ currency: "₩" }),
  usd: () => set({ currency: "$" }),
}));
