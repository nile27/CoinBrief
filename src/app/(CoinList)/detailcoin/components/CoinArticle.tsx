"use client";
import GreenArrow from "@/../public/GreenArrow.svg";
import RedArrow from "@/../public/RedArrow.svg";
import BtnStyle from "@/components/CustomUI/BtnStyle";

import { formatNumber, formatDate } from "../../coinlist/utill/utill";
import { useEffect, useState } from "react";
import { useCoinStore, useCurrency } from "@/store/store";

const CoinArticle = ({ coinData }: { coinData: any }) => {
  const { krw, usd, currency } = useCurrency();
  const { exchange } = useCoinStore();

  const [coinDetailData, setCoinDetailData] = useState({
    current_price: coinData.quotes.USD.price,

    total_volume: coinData.quotes.USD.market_cap,
  });
  const lastDate: string = formatDate(coinData.last_updated);
  const imgSrc = `https://static.coinpaprika.com/coin/${coinData.id}/logo.png`;

  useEffect(() => {
    const newDetailData = {
      current_price:
        currency === "$"
          ? Number(coinData.quotes.USD.price)
          : Number(coinData.quotes.USD.price) * exchange,

      total_volume:
        currency === "$"
          ? Number(coinData.quotes.USD.market_cap)
          : Number(coinData.quotes.USD.market_cap) * exchange,
    };
    console.log(coinData, exchange, currency);
    setCoinDetailData(newDetailData);
  }, [currency]);

  return (
    <article className="w-[400px] h-auto flex flex-col gap-4  ">
      <div className=" w-full h-auto flex justify-between items-center">
        <div className=" w-auto h-auto flex justify-start items-center gap-4">
          {imgSrc && (
            <img src={imgSrc} alt="코인 로고" className=" w-[32px] h-[32px]" />
          )}
          <span className=" font-semibold text-smallHeader">
            {coinData.symbol.toUpperCase()}
          </span>
          <span className=" font-semibold text-smallHeader">
            {coinData.name}
          </span>
        </div>

        <BtnStyle
          size="change"
          onClick={() => {
            currency === "$" ? krw() : usd();
          }}
        >
          통화 변경({currency})
        </BtnStyle>
      </div>
      <div className=" w-full h-auto flex justify-between items-center">
        <div className=" w-auto h-auto flex justify-start items-center gap-4">
          <span className=" font-semibold text-[24px]">
            {currency}
            {currency === "$"
              ? formatNumber(coinDetailData.current_price, 2)
              : formatNumber(coinDetailData.current_price)}
          </span>
        </div>

        <div className=" w-auto h-auto flex gap-2 items-center pr-1">
          {coinData.quotes.USD.percent_change_1h >= 0 ? (
            <GreenArrow className=" text-green " />
          ) : (
            <RedArrow className=" text-red " />
          )}

          <span
            className={`w-auto h-auto ${
              coinData.quotes.USD.percent_change_1h >= 0
                ? "text-green"
                : "text-red"
            }`}
          >
            {formatNumber(coinData.quotes.USD.percent_change_1h, 2)}%
          </span>
        </div>
      </div>
      <div className="w-full h-auto flex flex-col gap-2">
        <div className=" w-full h-auto flex justify-between items-center">
          <span>1시간</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            {coinData.quotes.USD.percent_change_1h >= 0 ? (
              <GreenArrow className=" text-green " />
            ) : (
              <RedArrow className=" text-red " />
            )}
            <span
              className={`w-auto h-auto ${
                coinData.quotes.USD.percent_change_1h >= 0
                  ? "text-green"
                  : "text-red"
              }`}
            >
              {formatNumber(coinData.quotes.USD.percent_change_1h, 2)}%
            </span>
          </div>
        </div>
        <div className=" w-full h-auto flex justify-between items-center">
          <span>24시간</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            {coinData.quotes.USD.percent_change_24h >= 0 ? (
              <GreenArrow className=" text-green " />
            ) : (
              <RedArrow className=" text-red " />
            )}
            <span
              className={`w-auto h-auto ${
                coinData.quotes.USD.percent_change_24h >= 0
                  ? "text-green"
                  : "text-red"
              }`}
            >
              {formatNumber(
                coinData.quotes.USD.percent_change_24h,

                2
              )}
              %
            </span>
          </div>
        </div>
        <div className=" w-full h-auto flex justify-between items-center">
          <span>7일</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            {coinData.quotes.USD.percent_change_7d >= 0 ? (
              <GreenArrow className=" text-green " />
            ) : (
              <RedArrow className=" text-red " />
            )}
            <span
              className={`w-auto h-auto ${
                coinData.quotes.USD.percent_change_7d >= 0
                  ? "text-green"
                  : "text-red"
              }`}
            >
              {formatNumber(coinData.quotes.USD.percent_change_7d, 2)}%
            </span>
          </div>
        </div>
      </div>

      <table className="w-full h-auto pt-3 ">
        <tbody className="w-full h-auto pt-3 flex flex-col gap-3">
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>시가 총액</td>
            <td>
              {currency}
              {formatNumber(coinDetailData.total_volume)}
            </td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>최고가(24H)</td>
            <td>
              {/* {currency}
              {formatNumber(coinDetailData.high_24h)} */}
            </td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>최저가 (24H)</td>
            <td>
              {/* {currency}
              {formatNumber(coinDetailData.low_24h)} */}
            </td>
          </tr>

          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>총 공급량</td>
            <td>{formatNumber(coinData.total_supply || 0)}</td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>최대 공급량</td>
            <td>
              {coinData.max_supply
                ? formatNumber(coinData.max_supply || 0)
                : "-"}
            </td>
          </tr>
        </tbody>
      </table>
      <span className=" w-full text-right">Last Update: {lastDate}</span>
    </article>
  );
};

export default CoinArticle;
