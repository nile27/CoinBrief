"use client";
import React, { useState, ChangeEvent, useEffect } from "react";
import Dollar from "@/../public/Dollar.svg";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import { useCoinStore } from "@/store/store";

interface ExchangeInterface {
  result: number;
  cur_unit: string; // 통화 단위 (예: USD)
  ttb: string; // 매입 환율 (은행이 구매할 때의 환율)
  tts: string; // 매도 환율 (은행이 판매할 때의 환율)
  deal_bas_r: string; // 기준 환율 (매입과 매도 환율의 평균)
  bkpr: string; // 현찰 기준 환율
  yy_efee_r: string; // 연간 수수료율 (사용되지 않는 경우 0)
  ten_dd_efee_r: string; // 10일 수수료율 (사용되지 않는 경우 0)
  kftc_bkpr: string; // KFTC(한국금융결제원) 현찰 기준 환율
  kftc_deal_bas_r: string; // KFTC 기준 환율
  cur_nm: string;
}

interface ExchangeFilter {
  KRW: ExchangeInterface;
  USD: ExchangeInterface;
}

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
    <section className=" bg-container dark:bg-container-dark w-[350px] py-3 px-5 min-h-[280px] flex flex-col justify-start items-start gap-3 border-2 border-border dark:border-border-dark rounded-[10px]">
      <div className=" w-full h-auto flex  gap-5 items-center pb-10">
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
              value={krwValue}
              onChange={handleKRWChange}
            />
          </div>
        </div>
        <div className="w-full h-[43px] flex justify-around items-center ">
          <span className=" text-smallHeader">USD</span>
          <div className=" dark:border-secondary-dark border-secondary border-8 rounded-lg w-[200px] h-auto flex">
            <div className=" dark:bg-secondary-dark bg-secondary w-[26px] h-full text-smallHeader pl-1 pr-2">
              $
            </div>

            <input
              type="text"
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
