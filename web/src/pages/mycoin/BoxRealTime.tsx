import { useCoinStore } from "@/store/store";
import { useEffect, useState, useRef } from "react";
import { formatKRWPrice } from "@/utils/utils";
import io from "socket.io-client";
import Skeleton from "@/components/Skeleton";
import type { UpbitData } from "@/type/type";

// 이 시간 동안 시세가 한 번도 오지 않으면 "지연"으로 본다.
// 업비트 ticker 는 체결이 있을 때만 push 하므로 거래가 뜸한 코인은 정상적으로도 조용할 수 있다.
// 그래서 오탐을 피하도록 넉넉하게 잡았다. 실측값이 아니라 판단에 의한 값이다.
const STALE_MS = 30_000;
const STALE_CHECK_MS = 1000;

export default function BoxRealTime({ symbol }: { symbol: string }) {
  const tradePriceRef = useRef<number>(0);
  const changeRateRef = useRef<string>("EVEN");
  const changeRef = useRef<string>("");
  const currentSymbol = useRef<string>("");
  const firstUpdateDone = useRef<boolean>(false);
  const [tradePrice, setTradePrice] = useState<number>(0);
  const [changeRate, setChangeRate] = useState<string>("");

  const [disconnected, setDisconnected] = useState<boolean>(false);
  // 지연 상태면 마지막 수신 후 경과 초(수신 이력이 없으면 -1), 아니면 null
  const [staleSec, setStaleSec] = useState<number | null>(null);

  const { setStaticData } = useCoinStore();

  useEffect(() => {
    // 릴레이↔업비트 구간이 죽어도 브라우저 소켓은 연결된 채로 남으므로 수신 시각으로 직접 감지한다.
    let lastMessageAt = 0;
    const startedAt = Date.now();
    setStaleSec(null);
    const newSocket = io(`${import.meta.env.VITE_WEBSOCKET_URL}`);

    // connect 는 최초 연결뿐 아니라 자동 재연결 시에도 발생하므로 매번 다시 구독한다.
    newSocket.on("connect", () => {
      setDisconnected(false);
      newSocket.emit("subscribe", symbol);
    });
    newSocket.on("disconnect", () => setDisconnected(true));
    newSocket.on("connect_error", () => setDisconnected(true));

    newSocket.on("upbit_data", (message: UpbitData) => {
      const messageSymbol = message.code.slice(4);
      if (messageSymbol === symbol) {
        lastMessageAt = Date.now();
        setStaleSec(null);
        tradePriceRef.current = message.trade_price;
        changeRateRef.current = (message.change_rate * 100).toFixed(2);
        changeRef.current = message.change;
        if (
          messageSymbol !== currentSymbol.current &&
          !firstUpdateDone.current
        ) {
          currentSymbol.current = messageSymbol;
          firstUpdateDone.current = true;

          setTradePrice(tradePriceRef.current);
          setChangeRate(changeRateRef.current);
          setStaticData(message.code.split("-")[1], {
            acc_trade_price_24h: message.acc_trade_price_24h,
            high_price: message.high_price,
            low_price: message.low_price,
            acc_trade_volume_24h: message.acc_trade_volume_24h,
          });
        }
      }
    });
    const updateInterval = setInterval(() => {
      setTradePrice(tradePriceRef.current);
      setChangeRate(changeRateRef.current);
    }, 6000);

    const staleInterval = setInterval(() => {
      const now = Date.now();
      if (now - (lastMessageAt || startedAt) < STALE_MS) return;
      setStaleSec(lastMessageAt ? Math.floor((now - lastMessageAt) / 1000) : -1);
    }, STALE_CHECK_MS);

    return () => {
      clearInterval(updateInterval);
      clearInterval(staleInterval);
      newSocket.emit("unsubscribe", symbol);
      newSocket.off("upbit_data");
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("connect_error");
      newSocket.disconnect();
    };
  }, [symbol]);

  const stale = !disconnected && staleSec !== null;
  const dir = changeRef.current;
  return (
    <div className="flex flex-col items-end gap-0.5 text-sm tabular-nums">
      <span className="font-medium text-ink dark:text-ink-dark">
        {tradePrice ? `₩${formatKRWPrice(tradePrice)}` : disconnected || stale ? "—" : <Skeleton className="w-20" />}
      </span>
      <span
        className={
          dir === "FALL"
            ? "text-down"
            : dir === "RISE"
            ? "text-up"
            : "text-muted dark:text-muted-dark"
        }
      >
        {changeRate ? `${dir === "FALL" ? "-" : dir === "RISE" ? "+" : ""}${changeRate}%` : disconnected || stale ? "—" : <Skeleton className="w-12" />}
      </span>
      {disconnected && (
        <span className="text-xs text-down" role="status">
          실시간 연결 끊김 · 재연결 중
        </span>
      )}
      {stale && (
        <span className="text-xs text-muted dark:text-muted-dark" role="status">
          {staleSec! >= 0 ? `시세 지연 · ${staleSec}초 전 기준` : "시세 지연 · 수신 없음"}
        </span>
      )}
    </div>
  );
}
