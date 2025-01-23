"use client";
import { useEffect, useState } from "react";
import Ellipse from "@/../public/Ellipse.svg";
import GreenArrow from "@/../public/GreenArrow.svg";
import RedArrow from "@/../public/RedArrow.svg";
import BoxRealTime from "@/app/mycoin/components/BoxRealTime";

import { Coin } from "@/store/store";

const MyCoinBox = ({ id, symbol, name }: Coin) => {
  const [realRate, setRate] = useState("");

  return (
    <div
      className={` relative max-w-[280px] w-[280px] h-[220px] flex items-center  duration-150  ${
        true ? "scale-110" : " hover:scale-105"
      }`}
    >
      <div className=" bg-container rounded-full border border-border dark p-2 flex justify-center items-center  dark:bg-container-dark absolute z-10 top-0 left-10 w-[70px] h-[70px]">
        <img
          src={`https://coinpaprika.com/coin/${id}/logo.png`}
          alt={name}
          className="w-full h-full"
        />
      </div>

      <div className=" flex justify-start items-center flex-col py-2 px-4 w-[280px] h-auto border-2 border-btn dark:border-text-dark bg-container dark:bg-container-dark rounded-[5px]">
        <div className=" w-full h-auto px-6 py-2 flex justify-center items-end flex-col">
          <span className=" h-auto w-[70px] text-start text-[18px] font-bold">
            {name}
          </span>
          <span className="h-auto w-[70px] text-start text-[18px] font-bold">
            {symbol}
          </span>
          <div className=" w-auto h-auto flex gap-1 items-center justify-start">
            {Number(realRate) >= 0 ? (
              <GreenArrow className="text-green" />
            ) : (
              <RedArrow className="text-red" />
            )}
            <span
              className={`w-auto min-w-[50px] h-auto text-start ${
                Number(realRate) >= 0 ? "text-green" : "text-red"
              }`}
            >
              {realRate}%
            </span>
          </div>
        </div>
        <BoxRealTime setRate={setRate} realRate={realRate} symbol={symbol} />
      </div>
    </div>
  );
};

export default MyCoinBox;
