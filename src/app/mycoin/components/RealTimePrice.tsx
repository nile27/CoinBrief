"use client";
import RedArrow from "@/../public/RedArrow.svg";
import GreenArrow from "@/../public/GreenArrow.svg";

import { useCoinStore } from "@/store/store";
import { useEffect, useState } from "react";

export default function RealTimePrice() {
  const { realTimeData, exchange } = useCoinStore();
  const [dallor, setDallor] = useState("");

  useEffect(() => {
    if (realTimeData.realKrw) {
      const dollar = Number(
        (realTimeData.realKrw / exchange).toFixed(2)
      ).toLocaleString();
      setDallor(dollar);
    }
  }, [realTimeData.realKrw]);

  return (
    <div className=" w-full h-auto flex flex-col ">
      <div className=" w-full h-auto flex justify-between items-center gap-5 ">
        <div className=" w-full h-auto flex justify-start items-center gap-5">
          <span className="w-[52px] h-auto font-semibold text-[24px] ">
            USD
          </span>
          <span className="w-auto h-auto text-[24px]">
            {dallor ? `$${dallor.toLocaleString()}` : "Loading..."}
          </span>
        </div>
        <div className=" w-auto h-auto flex gap-2 items-center pr-1">
          {Number(realTimeData.realRate) >= 0 ? (
            <GreenArrow className="text-green" />
          ) : (
            <RedArrow className="text-red" />
          )}
          <span
            className={`w-auto h-auto ${
              Number(realTimeData.realRate) >= 0 ? "text-green" : "text-red"
            }`}
          >
            {realTimeData.realRate}%
          </span>
        </div>
      </div>
      <div className=" w-full h-auto flex justify-between items-center gap-5 ">
        <div className=" w-full h-auto flex justify-start items-center gap-5">
          <span className="w-[52px] h-auto font-semibold text-[23px]   ">
            KRW
          </span>
          <span className="w-auto h-auto text-[24px]">
            {realTimeData.realKrw
              ? `₩${realTimeData.realKrw.toLocaleString()}`
              : "Loading..."}
          </span>
        </div>
        <div className=" w-auto h-auto flex gap-2 items-center pr-1">
          {Number(realTimeData.realRate) >= 0 ? (
            <GreenArrow className=" text-green " />
          ) : (
            <RedArrow className="text-red  " />
          )}

          <span
            className={`w-auto h-auto ${
              Number(realTimeData.realRate) >= 0 ? "text-green" : "text-red"
            }`}
          >
            {realTimeData.realRate}%
          </span>
        </div>
      </div>
    </div>
  );
}
