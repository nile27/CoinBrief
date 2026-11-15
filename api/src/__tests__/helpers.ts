// 테스트용 인메모리 Firestore 대역. 네트워크/실제 Firebase 를 절대 사용하지 않는다.
export function createFakeFirebase() {
  const store = new Map<string, Record<string, any>>();
  const ref = (path: string) => ({
    path,
    get: async () => ({
      exists: store.has(path),
      data: () => store.get(path),
    }),
    set: async (d: any) => void store.set(path, d),
    update: async (d: any) => {
      const cur = { ...(store.get(path) ?? {}) };
      for (const [k, v] of Object.entries(d)) {
        cur[k] = v && (v as any).__inc !== undefined ? (cur[k] ?? 0) + (v as any).__inc : v;
      }
      store.set(path, cur);
    },
    delete: async () => void store.delete(path),
  });
  const db = {
    collection: (c: string) => ({
      doc: (id: string) => ref(`${c}/${id}`),
      where: () => ({
        where: () => ({ get: async () => ({ empty: true }) }),
        limit: () => ({ get: async () => ({ empty: true }) }),
      }),
    }),
    runTransaction: async (fn: any) =>
      fn({
        get: (r: any) => r.get(),
        set: (r: any, d: any) => r.set(d),
        update: (r: any, d: any) => r.update(d),
        delete: (r: any) => r.delete(),
      }),
  };
  const FieldValue = {
    increment: (n: number) => ({ __inc: n }),
    arrayUnion: (v: unknown) => ({ __union: v }),
    arrayRemove: (v: unknown) => ({ __remove: v }),
  };
  const Timestamp = { fromMillis: (ms: number) => ({ toMillis: () => ms }) };
  return { store, db, FieldValue, Timestamp, auth: {} as any };
}
