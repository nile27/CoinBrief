"use client";
import React, { useState, ChangeEvent } from "react";
import Dollar from "@/../public/Dollar.svg";
import { useCoinStore } from "@/store/store";

const CurrencyCalc = () => {
  const [usdValue, setUsdValue] = useState<string>("1");
  const [krwValue, setKrwValue] = useState<string>("");

  const { exchange } = useCoinStore.getState();

  const handleUsdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(rawValue))) {
      const format = Number(rawValue).toLocaleString();
      setUsdValue(format);
      const exchangeValue = (Number(rawValue) * exchange).toLocaleString();
      setKrwValue(exchangeValue);
    } else {
      setUsdValue("");
      setKrwValue("");
    }
  };

  const handleKRWChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(rawValue))) {
      const format = Number(rawValue).toLocaleString();
      setKrwValue(format);
      const exchangeValue = (Number(rawValue) / exchange).toLocaleString();
      setUsdValue(exchangeValue);
    } else {
      setUsdValue("");
      setKrwValue("");
    }
  };

  return (
    <section className=" tablet:hidden bg-container dark:bg-container-dark w-[200px] max-h-[300px] py-3 px-5 flex flex-col justify-start items-start gap-3 border-2 border-border dark:border-border-dark rounded-[10px]">
      <div className=" w-full h-auto flex  gap-5 items-center ">
        <Dollar />
        <h1 className=" text-smallHeader font-extrabold ">환율 계산기</h1>
      </div>

      <div className=" w-full h-full flex flex-col justify-between items-center gap-2">
        <div className="w-full h-auto flex flex-col items-start gap-2 ">
          <span className=" text-smallHeader block font-bold">KRW</span>
          <div className=" dark:border-secondary-dark border-secondary border-8 rounded-lg w-full h-auto flex">
            <div className=" dark:bg-secondary-dark bg-secondary  w-[26px] h-full text-smallHeader pl-1 pr-2">
              ₩
            </div>
            <input
              type="text"
              autoComplete="off"
              className=" w-full h-auto px-2 bg-transparent outline-none overflow-x-auto "
              value={krwValue}
              onChange={handleKRWChange}
            />
          </div>
        </div>
        <div className="w-full h-auto flex flex-col items-start gap-2 ">
          <span className=" text-smallHeader block font-bold">USD</span>
          <div className=" dark:border-secondary-dark border-secondary border-8 rounded-lg w-full h-auto flex">
            <div className=" dark:bg-secondary-dark bg-secondary w-[26px] h-full text-smallHeader pl-1 pr-2">
              $
            </div>

            <input
              type="text"
              autoComplete="off"
              className=" w-full h-auto px-2 bg-transparent outline-none overflow-x-auto "
              value={usdValue}
              onChange={handleUsdChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrencyCalc;
