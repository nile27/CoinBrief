"use client";
import { useState } from "react";

import GreenArrow from "@/../public/GreenArrow.svg";
import RedArrow from "@/../public/RedArrow.svg";
import BoxRealTime from "@/app/mycoin/components/BoxRealTime";
import { useCoinStore } from "@/store/store";
import { Coin } from "@/store/store";

const MyCoinBox = ({ id, symbol, name, index }: Coin & { index: number }) => {
  const [realRate, setRate] = useState("");
  const { setSelectedCoin, setCoinId } = useCoinStore();

  const handleOnClick = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    e.preventDefault;
    setSelectedCoin(index);
    setCoinId(id);
  };

  return (
    <li
      onClick={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) =>
        handleOnClick(e)
      }
      className={` cursor-pointer relative max-w-[280px] w-[280px] h-[220px] max-h-[220px] flex items-center  duration-150  ${
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

      <div className=" flex justify-between items-center flex-col pt-2 pb-4 px-4 w-[280px] h-[200px] border-2 border-btn dark:border-text-dark bg-container dark:bg-container-dark rounded-[5px]">
        <div className=" w-full h-auto px-9 py-2 flex justify-center items-end flex-col">
          <span className=" h-auto w-[70px] text-start text-[16px] font-bold whitespace-nowrap">
            {name}
          </span>
          <span className="h-auto w-[70px] text-start text-[16px] font-bold">
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
        <BoxRealTime
          setRate={setRate}
          symbol={symbol}
          index={index}
          rate={realRate}
        />
      </div>
    </li>
  );
};

export default MyCoinBox;
