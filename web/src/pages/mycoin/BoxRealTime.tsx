import { useCoinStore } from "@/store/store";
import { useEffect, useState, useRef } from "react";
import { formatKRWPrice } from "@/utils/utils";
import io from "socket.io-client";
import Skeleton from "@/components/Skeleton";
import type { UpbitData } from "@/type/type";

export default function BoxRealTime({ symbol }: { symbol: string }) {
  const tradePriceRef = useRef<number>(0);
  const changeRateRef = useRef<string>("EVEN");
  const changeRef = useRef<string>("");
  const currentSymbol = useRef<string>("");
  const firstUpdateDone = useRef<boolean>(false);
  const [tradePrice, setTradePrice] = useState<number>(0);
  const [changeRate, setChangeRate] = useState<string>("");

  const { setStaticData } = useCoinStore();

  useEffect(() => {
    const newSocket = io(`${import.meta.env.VITE_WEBSOCKET_URL}`);

    newSocket.on("connect", () => {
      newSocket.emit("subscribe", symbol);
    });

    newSocket.on("upbit_data", (message: UpbitData) => {
      const messageSymbol = message.code.slice(4);
      if (messageSymbol === symbol) {
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

    return () => {
      clearInterval(updateInterval);
      newSocket.emit("unsubscribe", symbol);
      newSocket.off("upbit_data");
      newSocket.disconnect();
    };
  }, [symbol]);

  const dir = changeRef.current;
  return (
    <div className="flex flex-col items-end gap-0.5 text-sm tabular-nums">
      <span className="font-medium text-ink dark:text-ink-dark">
        {tradePrice ? `₩${formatKRWPrice(tradePrice)}` : <Skeleton className="w-20" />}
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
        {changeRate ? `${dir === "FALL" ? "-" : dir === "RISE" ? "+" : ""}${changeRate}%` : <Skeleton className="w-12" />}
      </span>
    </div>
  );
}
