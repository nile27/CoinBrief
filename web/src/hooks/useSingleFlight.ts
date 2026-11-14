import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 비동기 함수를 한 번에 하나만 실행한다.
 * disabled/isPending 은 리렌더 이후에야 반영되므로, 같은 tick 의 두 번째 클릭은 막지 못한다.
 * ref 는 동기적으로 갱신되므로 실행 중 재호출은 즉시 무시(undefined 반환)하고, finally 에서 잠금을 푼다.
 */
export function useSingleFlight<A extends unknown[], R>(fn: (...args: A) => Promise<R>) {
  const locked = useRef(false);
  const latest = useRef(fn);
  latest.current = fn;
  const alive = useRef(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const run = useCallback(async (...args: A): Promise<R | undefined> => {
    if (locked.current) return undefined;
    locked.current = true;
    setPending(true);
    try {
      return await latest.current(...args);
    } finally {
      locked.current = false;
      if (alive.current) setPending(false);
    }
  }, []);

  return { run, pending };
}
