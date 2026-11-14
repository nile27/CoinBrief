import { useCallback, useEffect, useState } from "react";

/** 초 단위 카운트다운. start(60) 후 매초 줄어 0 이 되면 멈춘다. (종료 시각 기준이라 탭이 느려져도 어긋나지 않는다) */
export function useCountdown() {
  const [endAt, setEndAt] = useState(0);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!endAt) return;
    const tick = () => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) clearInterval(id);
    };
    const id = setInterval(tick, 250);
    tick();
    return () => clearInterval(id);
  }, [endAt]);

  const start = useCallback((seconds: number) => {
    setRemaining(seconds);
    setEndAt(Date.now() + seconds * 1000);
  }, []);

  return { remaining, start };
}
