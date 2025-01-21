"use client";
import RedArrow from "@/../public/RedArrow.svg";
import GreenArrow from "@/../public/GreenArrow.svg";

import { useEffect, useState } from "react";

export default function RealTimePrice() {
  const [realKrw, setRealKrw] = useState<number | null>(null);
  const [realDallor, setRealDallor] = useState<string>();
  const [realRate, setRate] = useState("");
  const [exchange, setExchange] = useState<number>(0);
  useEffect(() => {
    const socket = new WebSocket("wss://pubwss.bithumb.com/pub/ws");

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "ticker",
          symbols: ["BTC_KRW"],
          tickTypes: ["1M"],
        })
      );
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ticker" && data.content) {
          const price = parseFloat(data.content.closePrice);
          console.log(data);
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
    if (realKrw)
      setRealDallor(Number((realKrw / exchange).toFixed(2)).toLocaleString());
  }, [realKrw]);

  return (
    <div className=" w-full h-auto flex flex-col ">
      <div className=" w-full h-auto flex justify-between items-center gap-5 ">
        <div className=" w-full h-auto flex justify-start items-center gap-5">
          <span className="w-[52px] h-auto font-semibold text-[24px] ">
            USD
          </span>
          <span className="w-auto h-auto text-[24px]">
            {realDallor ? `$${realDallor.toLocaleString()}` : "Loading..."}
          </span>
        </div>
        <div className=" w-auto h-auto flex gap-2 items-center pr-1">
          {Number(realRate) >= 0 ? (
            <GreenArrow className="text-green" />
          ) : (
            <RedArrow className="text-red" />
          )}
          <span
            className={`w-auto h-auto ${
              Number(realRate) >= 0 ? "text-green" : "text-red"
            }`}
          >
            {realRate}%
          </span>
        </div>
      </div>
      <div className=" w-full h-auto flex justify-between items-center gap-5 ">
        <div className=" w-full h-auto flex justify-start items-center gap-5">
          <span className="w-[52px] h-auto font-semibold text-[23px]   ">
            KRW
          </span>
          <span className="w-auto h-auto text-[24px]">
            {realKrw ? `₩${realKrw.toLocaleString()}` : "Loading..."}
          </span>
        </div>
        <div className=" w-auto h-auto flex gap-2 items-center pr-1">
          {Number(realRate) >= 0 ? (
            <GreenArrow className=" text-green " />
          ) : (
            <RedArrow className="text-red  " />
          )}

          <span
            className={`w-auto h-auto ${
              Number(realRate) >= 0 ? "text-green" : "text-red"
            }`}
          >
            {realRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
