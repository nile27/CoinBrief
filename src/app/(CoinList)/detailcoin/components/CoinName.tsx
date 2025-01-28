"use client";

import { useEffect, useState } from "react";
import { useCoinStore, useCurrency } from "@/store/store";
import { formatCurrency } from "@/utill/utill";
import GreenArrow from "@/../public/GreenArrow.svg";
import RedArrow from "@/../public/RedArrow.svg";
import CoinImg from "@/components/CustomUI/CoinImg";
import BtnStyle from "@/components/CustomUI/BtnStyle";

interface Prop {
  price: {
    price: number;
    rate: number;
    prev_24H_price: number;
    prev_24H_rate: number;
  };
  change: string;
  id: string;
  name: string;
}

const CoinName = ({ price, id, name, change }: Prop) => {
  const { exchange } = useCoinStore();
  const { krw, usd, currency } = useCurrency();
  const [currencyData, setCurrencyData] = useState({
    price: 0,
    rate: 0,
    prev_24H_price: 0,
    prev_24H_rate: 0,
  });

  const handleExchange = () => {
    currency === "$" ? krw() : usd();
    if (currency === "₩") {
      usd();
      setCurrencyData({
        price: price.price / exchange,
        rate: price.rate,
        prev_24H_rate: price.prev_24H_rate,
        prev_24H_price: price.prev_24H_price / exchange,
      });
    } else if (currency === "$") {
      krw();
      setCurrencyData({
        price: price.price,
        rate: price.rate,
        prev_24H_rate: price.prev_24H_rate,
        prev_24H_price: price.prev_24H_price,
      });
    }
  };

  useEffect(() => {
    setCurrencyData({
      price: price.price,
      rate: price.rate,
      prev_24H_rate: price.prev_24H_rate,
      prev_24H_price: price.prev_24H_price,
    });
  }, []);
  return (
    <article className="flex w-full justify-start items-center gap-[90px]">
      <div className="w-auto flex flex-col tablet:w-full">
        <div className="w-auto tablet:w-full tablet:justify-between flex items-center justify-start gap-5">
          <div className=" w-auto  flex gap-4 items-center">
            <CoinImg symbol={id} name={name} />
            <div className=" flex gap-3 items-center">
              <h1 className="text-xl font-bold">{name}</h1>
              <h1 className="text-xl font-bold">{id}</h1>
            </div>
          </div>
          <BtnStyle size="change" onClick={handleExchange}>
            통화 변경({currency})
          </BtnStyle>
        </div>
        <div className="my-3 text-[30px] font-bold flex items-center gap-4">
          {currency}
          {Number(currencyData.price).toLocaleString()}

          <div className=" w-auto flex gap-3 justify-end items-center text-smallHeader">
            {change === "FALL" ? (
              <RedArrow className={"text-red"} />
            ) : (
              <GreenArrow className={"text-green"} />
            )}
            <span
              className={`py-2 text-right ${
                change === "FALL" ? "text-red" : "text-green"
              }`}
            >
              {(currencyData.rate * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-auto flex-col  justify-center items-start tablet:hidden">
        <span className=" whitespace-nowrap ">변동 금액 (어제)</span>

        <div className=" w-auto flex gap-3  items-center">
          {Number(currencyData.prev_24H_price) < 0 ? (
            <RedArrow className={"text-red"} />
          ) : (
            <GreenArrow className={"text-green"} />
          )}
          <span
            className={`py-2 ${
              Number(currencyData.prev_24H_price) < 0
                ? "text-red"
                : "text-green"
            }`}
          >
            {formatCurrency(
              Number(currencyData.prev_24H_price),
              currency as "₩" | "$"
            )}
            {currency}
          </span>
        </div>

        <div className=" w-auto flex gap-3  items-center">
          {Number(currencyData.prev_24H_rate) < 0 ? (
            <RedArrow className={"text-red"} />
          ) : (
            <GreenArrow className={"text-green"} />
          )}
          <span
            className={`py-2  ${
              Number(currencyData.prev_24H_rate) < 0 ? "text-red" : "text-green"
            }`}
          >
            {currencyData.prev_24H_rate.toFixed(3)}%
          </span>
        </div>
      </div>
    </article>
  );
};

export default CoinName;
