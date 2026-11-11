import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useUserStore, type Coin } from "@/store/store";

const post = (path: string, body: unknown) =>
  apiFetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export const useAddCoin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (coin: Coin) => post("/api/addcoin", { uid: useUserStore.getState().user.id, coin }),
    onSuccess: (_d, coin) => {
      useUserStore.getState().addCoin(coin);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => console.error("추가 코인 에러:", e),
  });
};

export const useDeleteCoin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ coin }: { coin: Coin; idx: number }) =>
      post("/api/deletecoin", { uid: useUserStore.getState().user.id, coin }),
    onSuccess: (_d, { idx }) => {
      useUserStore.getState().removeCoin(idx);
      qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e) => console.error("Error deleting coin:", e),
  });
};
