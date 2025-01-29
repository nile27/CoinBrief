"use client";
import { useEffect, useState } from "react";
import { useCoinStore, useCurrency } from "@/store/store";
import { TickerData } from "../../coinlist/utill/utill";
import { formatCurrency } from "@/utill/utill";

const CoinArticle = ({ coinData }: { coinData: TickerData }) => {
  const { exchange } = useCoinStore();
  const lastUpdated = new Date(Number(coinData.timestamp)).toLocaleString();
  const { currency } = useCurrency();
  const [currencyData, setCurrencyData] = useState({
    signed_change_price: 0,
    high_price: 0,
    low_price: 0,
    acc_trade_price_24h: 0,
    prev_closing_price: 0,
    lowest_52_week_price: 0,
    highest_52_week_price: 0,
  });

  useEffect(() => {
    setCurrencyData({
      signed_change_price: coinData.signed_change_price,
      high_price: coinData.high_price,
      low_price: coinData.low_price,
      acc_trade_price_24h: coinData.acc_trade_price_24h,
      prev_closing_price: coinData.prev_closing_price,
      lowest_52_week_price: coinData.lowest_52_week_price,
      highest_52_week_price: coinData.highest_52_week_price,
    });
  }, []);

  useEffect(() => {
    if (currency === "$") {
      setCurrencyData({
        signed_change_price: coinData.signed_change_price / exchange,
        high_price: coinData.high_price / exchange,
        low_price: coinData.low_price / exchange,
        acc_trade_price_24h: coinData.acc_trade_price_24h / exchange,
        prev_closing_price: coinData.prev_closing_price / exchange,
        lowest_52_week_price: coinData.lowest_52_week_price / exchange,
        highest_52_week_price: coinData.highest_52_week_price / exchange,
      });
    } else {
      setCurrencyData({
        signed_change_price: coinData.signed_change_price,
        high_price: coinData.high_price,
        low_price: coinData.low_price,
        acc_trade_price_24h: coinData.acc_trade_price_24h,
        prev_closing_price: coinData.prev_closing_price,
        lowest_52_week_price: coinData.lowest_52_week_price,
        highest_52_week_price: coinData.highest_52_week_price,
      });
    }
  }, [currency]);

  return (
    <article className="min-w-[350px] tablet:w-full tablet:min-w-[0px] h-auto flex flex-col  border-[1px] rounded-lg  dark:border-border-dark border-border">
      <div className="w-full flex flex-col gap-4   p-4">
        <div className="flex justify-between  py-2 dark:border-b-border-dark border-b-border border-b-2 px-2 ">
          <span className="text-right mobile:text-left dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            24시간 최고가
          </span>
          <span className="text-right mobile:text-left">
            {currency}
            {formatCurrency(
              Number(currencyData.high_price),
              currency as "₩" | "$"
            )}
          </span>
        </div>
        <div className="flex justify-between py-2 dark:border-b-border-dark border-b-border border-b-2 px-2 ">
          <span className="text-right mobile:text-left dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            24시간 최저가
          </span>
          <span className="text-right mobile:text-left">
            {currency}
            {formatCurrency(
              Number(currencyData.low_price),
              currency as "₩" | "$"
            )}
          </span>
        </div>
        <div className="flex justify-between py-2 dark:border-b-border-dark border-b-border border-b-2 px-2 ">
          <span className="text-right mobile:text-left dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            24시간 거래량
          </span>
          <span className="text-right mobile:text-left">
            {formatCurrency(
              Number(coinData.acc_trade_volume_24h.toFixed(0)),
              currency as "₩" | "$"
            )}
            BTC
          </span>
        </div>
        <div className="flex justify-between py-2 dark:border-b-border-dark border-b-border border-b-2 px-2 ">
          <span className="text-right mobile:text-left dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            24시간 거래 대금
          </span>
          <span className="text-right mobile:text-left">
            {currency}
            {formatCurrency(
              Number(currencyData.acc_trade_price_24h),
              currency as "₩" | "$"
            )}
          </span>
        </div>
        <div className="flex justify-between py-2 dark:border-b-border-dark border-b-border border-b-2 px-2 ">
          <span className="text-right mobile:text-left dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            52주 최고가
          </span>
          <span className="text-right mobile:text-left">
            {currency}
            {Number(currencyData.highest_52_week_price).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between py-2 dark:border-b-border-dark border-b-border border-b-2 px-2 ">
          <span className="text-right mobile:text-left dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            52주 최저가
          </span>
          <span className="text-right mobile:text-left">
            {currency}
            {Number(currencyData.lowest_52_week_price).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between py-2 dark:border-b-border-dark border-b-border border-b-2 px-2 ">
          <span className="text-right mobile:text-left dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            전일 종가
          </span>
          <span className="text-right mobile:text-left">
            {currency}
            {Number(currencyData.prev_closing_price).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between py-2 dark:border-b-border-dark border-b-border border-b-2 px-2 mobile:flex-col">
          <span className="text-right mobile:text-left dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
            Last Update
          </span>
          <span className="text-right mobile:text-left ">{lastUpdated}</span>
        </div>
      </div>
    </article>
  );
};

export default CoinArticle;
