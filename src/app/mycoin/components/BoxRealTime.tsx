"use client";
import { useEffect, useState } from "react";
import { RealTimeData, useCoinStore } from "@/store/store";
interface IProps {
  rate: string;
  setRate: React.Dispatch<React.SetStateAction<string>>;
  symbol: string;
  index: number;
}

export default function BoxRealTime(props: IProps) {
  const { setRate, symbol, index, rate } = props;

  const { setRealTimeData, selectedCoin, setExchange, exchange } =
    useCoinStore();
  const [realKrw, setRealKrw] = useState<number>(0);
  const [realDallor, setRealDallor] = useState<string>();

  useEffect(() => {
    const socket = new WebSocket("wss://pubwss.bithumb.com/pub/ws");

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "ticker",
          symbols: [`${symbol}_KRW`],
          tickTypes: ["1M"],
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ticker" && data.content) {
          const price = parseFloat(data.content.closePrice);
          const rate = parseFloat(data.content.chgRate);
          setRealKrw(price);
          setRate(data.content.chgRate);
        }
      } catch (error) {
        console.error(error);
      }
    };

    socket.onerror = (error) => {
      console.error("웹소켓 에러", error);
    };

    socket.onclose = () => {
      console.log("웹소켓 종료");
    };

    const exChangeFetch = async () => {
      try {
        const res = await fetch(`/api/exchange`);

        const data = await res.json();
        setExchange(Number(data.data.KRW.replace(/,/g, "")));
      } catch (error) {
        console.log(error);
      }
    };
    exChangeFetch();
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (selectedCoin === index) {
      console.log("출력되는 index:", selectedCoin);
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
    <div className=" w-full h-auto flex flex-col ">
      <div className=" w-full h-auto flex justify-between items-center gap-5 ">
        <div className=" w-full h-auto flex justify-start items-center gap-5">
          <span className="w-[52px] h-auto font-semibold text-[20px] ">
            USD
          </span>
          <span className="w-auto h-auto text-[20px]">
            {realDallor ? `$${realDallor.toLocaleString()}` : "Loading..."}
          </span>
        </div>
      </div>
      <div className=" w-full h-auto flex justify-between items-center gap-5 ">
        <div className=" w-full h-auto flex justify-start items-center gap-5">
          <span className="w-[52px] h-auto font-semibold text-[19px]   ">
            KRW
          </span>
          <span className="w-auto h-auto text-[20px]">
            {realKrw ? `₩${realKrw.toLocaleString()}` : "Loading..."}
          </span>
        </div>
      </div>
    </div>
  );
}
