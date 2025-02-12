"use client";
import { useCoinStore, useUserStore } from "@/store/store";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
interface UpbitData {
  market: string;
  trade_price: number;
  change_rate: number;
  acc_trade_price_24h: number;
  acc_trade_volume_24h: number;
  code: string;
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
  const [priceChange, setPriceChange] = useState<"up" | "down" | null>(null);
  const [realTimeData, setRealTimeData] = useState({
    trade_price: 0,
    change_rate: "",
  });
  const { setStaticData, staticData } = useCoinStore();

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);

    newSocket.on("connect", () => {
      newSocket.emit("subscribe", symbol);
    });

    newSocket.on("upbit_data", (message: UpbitData) => {
      if (message.code === `KRW-${symbol}`) {
        if (realTimeData.trade_price !== null) {
          setPriceChange(
            message.trade_price > realTimeData.trade_price ? "up" : "down"
          );

          setTimeout(() => setPriceChange(null), 1000);
        }
        setRealTimeData({
          trade_price: message.trade_price,
          change_rate: (message.change_rate * 100).toFixed(2),
        });

        if (!staticData[message.code.split("-")[1]]) {
          setStaticData(message.code.split("-")[1], {
            acc_trade_price_24h: message.acc_trade_price_24h,
            high_price: message.high_price,
            low_price: message.low_price,
            acc_trade_volume_24h: message.acc_trade_volume_24h,
          });
        }
      }
    });

    return () => {
      newSocket.emit("unsubscribe", symbol);
      newSocket.off("upbit_data");
      newSocket.disconnect();
    };
  }, [symbol]);

  return (
    <div className=" w-full h-[30px] flex flex-col tablet:h-full ">
      <div className=" w-full h-[30px] flex flex-col onlyMoblie:flex-row onlyTablet:flex-row  onlyMoblie:gap-8 onlyTablet:gap-8 onlyMoblie:items-center onlyTablet:items-center justify-center items-end gap-1 iphone:flex-col">
        <motion.span
          animate={{
            color:
              priceChange === "up"
                ? "#16a34a"
                : priceChange === "down"
                ? "#dc2626"
                : theme === "dark"
                ? "#F8F9FA"
                : theme === "light"
                ? "#181820"
                : systemTheme === "dark"
                ? "#F8F9FA"
                : "#181820",
          }}
          transition={{ duration: 0.5 }}
          className=" iphone:text-sm  block"
        >
          {realTimeData.trade_price
            ? `₩${realTimeData.trade_price.toLocaleString()}`
            : "Loading..."}
        </motion.span>
        <span
          className={`${
            Number(realTimeData.change_rate) >= 0 ? "text-green" : "text-red"
          } text-right iphone:text-sm  block`}
        >
          {realTimeData.change_rate}%
        </span>
      </div>
    </div>
  );
}
