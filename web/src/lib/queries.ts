import { queryOptions, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ProcessedCoin } from "@/type/type";

export const meQuery = queryOptions({
    queryKey: ["me"],
    queryFn: () => apiFetch<{ uid: string; email: string; displayName: string }>("/api/me"),
    staleTime: 5 * 60_000,
    retry: false,
});
export const useMe = () => useQuery(meQuery);

export const exchangeQuery = queryOptions({
    queryKey: ["exchange"],
    queryFn: () => apiFetch<{ USD: number; date: string }>("/api/exchange"),
    staleTime: 60 * 60_000,
});
export const useExchange = () => useQuery(exchangeQuery);

export const coinsQuery = queryOptions({
    queryKey: ["upbit", "coins"],
    queryFn: () => apiFetch<ProcessedCoin[]>("/api/upbit/coins"),
    staleTime: 30_000,
});
export const useUpbitCoins = () => useQuery(coinsQuery);

export interface PopularCoin {
  market: string;
  symbol: string;
  koreanName: string;
  price: number;
  changePercent: number;
}

export const popularQuery = queryOptions({
    queryKey: ["upbit", "popular"],
    queryFn: () => apiFetch<{ coins: PopularCoin[]; fetchedAt: number | null }>("/api/upbit/popular"),
    staleTime: 60_000,
  });
export const usePopularCoins = () => useQuery(popularQuery);
