import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { ProcessedCoin } from "@/type/type";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch<{ uid: string; email: string; displayName: string }>("/api/me"),
    staleTime: 5 * 60_000,
    retry: false,
  });

export const useExchange = () =>
  useQuery({
    queryKey: ["exchange"],
    queryFn: () => apiFetch<{ USD: number; date: string }>("/api/exchange"),
    staleTime: 60 * 60_000,
  });

export const useUpbitCoins = () =>
  useQuery({
    queryKey: ["upbit", "coins"],
    queryFn: () => apiFetch<ProcessedCoin[]>("/api/upbit/coins"),
    staleTime: 30_000,
  });
