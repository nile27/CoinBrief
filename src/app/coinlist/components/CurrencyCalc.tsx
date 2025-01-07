"use client";
import React, { useState, ChangeEvent } from "react";
import Dollar from "@/../public/Dollar.svg";
import BtnStyle from "@/components/CustomUI/BtnStyle";

const CurrencyCalc = () => {
  const [inputValue, setInputValue] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(rawValue))) {
      setInputValue(Number(rawValue).toLocaleString());
    }
  };

  return (
    <section className=" bg-container dark:bg-container-dark w-[350px] py-3 px-5 min-h-[280px] flex flex-col justify-between items-start gap-3 border-2 border-border dark:border-border-dark rounded-[10px]">
      <div className=" w-full h-auto flex  gap-5 items-center ">
        <Dollar />
        <h1 className=" text-smallHeader font-extrabold ">환율 계산기</h1>
      </div>

      <div className=" w-full h-auto flex flex-col justify-between gap-12">
        <div className="w-full h-[43px] flex justify-around items-center ">
          <span className=" text-smallHeader">KRW</span>
          <div className=" dark:border-secondary-dark border-secondary border-8 rounded-lg w-[200px] h-auto flex">
            <div className=" dark:bg-secondary-dark bg-secondary  w-[26px] h-full text-smallHeader pl-1 pr-2">
              ₩
            </div>
            <input
              type="text"
              className=" w-full h-auto px-2 bg-transparent outline-none overflow-x-auto "
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="w-full h-[43px] flex justify-around items-center ">
          <span className=" text-smallHeader">USD</span>
          <div className=" dark:border-secondary-dark border-secondary border-8 rounded-lg w-[200px] h-auto flex">
            <div className=" dark:bg-secondary-dark bg-secondary w-[26px] h-full text-smallHeader pl-1 pr-2">
              $
            </div>
            <div className=" w-full h-auto px-2 bg-transparent outline-none overflow-x-auto "></div>
          </div>
        </div>
      </div>
      <BtnStyle size="calc"> 계산하기</BtnStyle>
    </section>
  );
};

export default CurrencyCalc;
