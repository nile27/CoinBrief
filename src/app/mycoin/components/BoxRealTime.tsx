"use client";
import { useCoinStore } from "@/store/store";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
interface UpbitData {
  market: string;
  trade_price: number;
  change_rate: number;
  acc_trade_price_24h: number;
  code: string;
}
interface IProps {
  symbol: string;
  index: number;
}

export default function BoxRealTime(props: IProps) {
  const { symbol, index } = props;
  const [rate, setRate] = useState("");
  const { theme } = useTheme();

  const [priceChange, setPriceChange] = useState<"up" | "down" | null>(null);
  const { setRealTimeData, selectedCoin, exchange } = useCoinStore();
  const [realKrw, setRealKrw] = useState<number>(0);
  const [realDallor, setRealDallor] = useState<string>();

  useEffect(() => {
    const newSocket = io("http://localhost:4000");

    newSocket.on("connect", () => {
      console.log("✅ Socket.io 연결됨");
      newSocket.emit("subscribe", symbol);
    });

    newSocket.on("upbit_data", (message: UpbitData) => {
      console.log(message);
      if (message.code === `KRW-${symbol}`) {
        if (realKrw !== null) {
          setPriceChange(message.trade_price > realKrw ? "up" : "down");

          setTimeout(() => setPriceChange(null), 1000);
        }

        setRealKrw(message.trade_price);
        setRate((message.change_rate * 100).toFixed(2));
      }
    });

    return () => {
      newSocket.emit("unsubscribe", [symbol]);
      newSocket.disconnect();
    };
  }, [symbol]);

  useEffect(() => {
    if (selectedCoin === index) {
      setRealTimeData({
        realKrw: realKrw,
        realRate: rate,
      });
    }
  }, [selectedCoin, rate]);

  useEffect(() => {
    if (realKrw) {
      const dollar = Number((realKrw / exchange).toFixed(2)).toLocaleString();
      setRealDallor(dollar);
    }
  }, [realKrw]);

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
                : theme === "light"
                ? "#000000"
                : "#ffffff",
          }}
          transition={{ duration: 0.5 }}
          className=" iphone:text-sm  block"
        >
          {realKrw ? `₩${realKrw.toLocaleString()}` : "Loading..."}
        </motion.span>
        <span
          className={`${
            Number(rate) >= 0 ? "text-green" : "text-red"
          } text-right iphone:text-sm  block`}
        >
          {rate}%
        </span>
      </div>
    </div>
  );
}
