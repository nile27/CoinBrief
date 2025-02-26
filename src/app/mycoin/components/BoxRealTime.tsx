"use client";
import { useCoinStore } from "@/store/store";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

import { useTheme } from "next-themes";
interface UpbitData {
  market: string;
  trade_price: number;
  change_rate: number;
  acc_trade_price_24h: number;
  acc_trade_volume_24h: number;
  code: string;
  change: string;
  high_price: number;
  low_price: number;
}
export interface StaticData {
  acc_trade_volume_24h: number;
  acc_trade_price_24h: number;
  high_price: number;
  low_price: number;
}

export default function BoxRealTime({ symbol }: { symbol: string }) {
  const { theme, systemTheme } = useTheme();
  const tradePriceRef = useRef<number>(0);
  const changeRateRef = useRef<string>("EVEN");
  const changeRef = useRef<string>("");
  const currentSymbol = useRef<string>("");
  const firstUpdateDone = useRef<boolean>(false);
  const [tradePrice, setTradePrice] = useState<number>(0);
  const [changeRate, setChangeRate] = useState<string>("");

  const { setStaticData } = useCoinStore();

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

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

  return (
    <div className=" w-full h-[30px] flex flex-col tablet:h-full ">
      <div className=" w-full h-[30px] flex flex-col onlyMoblie:flex-row onlyTablet:flex-row  onlyMoblie:gap-8 onlyTablet:gap-8 onlyMoblie:items-center onlyTablet:items-center justify-center items-end gap-1 iphone:flex-col">
        <span
          style={{
            color:
              theme === "dark"
                ? "#F8F9FA"
                : theme === "light"
                ? "#181820"
                : systemTheme === "dark"
                ? "#F8F9FA"
                : "#181820",
          }}
          className="iphone:text-sm block"
        >
          {tradePrice ? `₩${tradePrice.toLocaleString()}` : "Loading..."}
        </span>
        <span
          className={`${
            changeRef.current === "FALL" ? "text-red" : "text-green"
          } text-right iphone:text-sm block`}
        >
          {changeRate}%
        </span>
      </div>
    </div>
  );
}
