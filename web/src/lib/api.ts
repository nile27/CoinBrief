import { useAuthStore, useUserStore } from "@/store/store";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { credentials: "same-origin", ...init });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 401) {
      useAuthStore.getState().logout(); // 만료된 세션이면 어디서든 로그아웃 처리
      useUserStore.getState().deleteUser();
    }
    throw new ApiError(res.status, body?.message ?? body?.error ?? res.statusText);
  }
  return body as T;
}
