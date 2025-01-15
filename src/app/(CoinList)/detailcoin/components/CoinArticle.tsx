"use client";
import GreenArrow from "@/../public/GreenArrow.svg";
import RedArrow from "@/../public/RedArrow.svg";
import BtnStyle from "@/components/CustomUI/BtnStyle";

import { formatNumber, formatDate } from "../../coinlist/utill/utill";
import { useEffect, useState } from "react";

const CoinArticle = ({ coinData }: { coinData: any }) => {
  const [changeDallor, setChangeDallor] = useState("usd");
  const [currency, setCurrency] = useState("$");
  const [coinDetailData, setCoinDetailData] = useState({
    current_price: 0,
    price_change_1h: 0,
    price_change_24h: 0,
    price_change_7d: 0,
    total_volume: 0,
    high_24h: 0,
    low_24h: 0,
  });
  const lastDate: string = formatDate(coinData.last_updated);

  useEffect(() => {
    const newDetailData = {
      current_price: coinData.market_data.current_price[changeDallor],
      price_change_1h:
        coinData.market_data.price_change_percentage_1h_in_currency[
          changeDallor
        ],
      price_change_24h:
        coinData.market_data.price_change_percentage_24h_in_currency[
          changeDallor
        ],
      price_change_7d:
        coinData.market_data.price_change_percentage_7d_in_currency[
          changeDallor
        ],
      total_volume: coinData.market_data.total_volume[changeDallor],
      high_24h: coinData.market_data.high_24h[changeDallor],
      low_24h: coinData.market_data.low_24h[changeDallor],
    };

    setCoinDetailData(newDetailData);
    setCurrency(changeDallor === "usd" ? "$" : "₩");
  }, [changeDallor]);

  return (
    <article className="w-[390px] h-auto flex flex-col gap-4 basis-1/3 ">
      <div className=" w-full h-auto flex justify-between items-center">
        <div className=" w-auto h-auto flex justify-start items-center gap-4">
          <img
            src={coinData.image.small}
            alt="코인 로고"
            className=" w-[32px] h-[32px]"
          />
          <span className=" font-semibold text-smallHeader">
            {coinData.symbol.toUpperCase()}
          </span>
          <span className=" font-semibold text-smallHeader">
            {coinData.localization.ko}
          </span>
        </div>

        <BtnStyle
          size="change"
          onClick={() => {
            changeDallor === "usd"
              ? setChangeDallor("krw")
              : setChangeDallor("usd");
          }}
        >
          통화 변경({currency === "$" ? "₩" : "$"})
        </BtnStyle>
      </div>
      <div className=" w-full h-auto flex justify-between items-center">
        <div className=" w-auto h-auto flex justify-start items-center gap-4">
          <span className=" font-semibold text-[24px]">
            {changeDallor.toUpperCase()}
          </span>
          <span className=" font-semibold text-[24px]">
            {currency}
            {currency === "$"
              ? formatNumber(coinDetailData.current_price, 2)
              : formatNumber(coinDetailData.current_price)}
          </span>
        </div>

        <div className=" w-auto h-auto flex gap-2 items-center pr-1">
          {coinDetailData.price_change_1h >= 0 ? (
            <GreenArrow className=" text-green " />
          ) : (
            <RedArrow className=" text-red " />
          )}

          <span
            className={`w-auto h-auto ${
              coinDetailData.price_change_1h >= 0 ? "text-green" : "text-red"
            }`}
          >
            {formatNumber(coinDetailData.price_change_1h, 2)}%
          </span>
        </div>
      </div>
      <div className="w-full h-auto flex flex-col gap-2">
        <div className=" w-full h-auto flex justify-between items-center">
          <span>1시간</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            {coinDetailData.price_change_1h >= 0 ? (
              <GreenArrow className=" text-green " />
            ) : (
              <RedArrow className=" text-red " />
            )}
            <span
              className={`w-auto h-auto ${
                coinDetailData.price_change_1h >= 0 ? "text-green" : "text-red"
              }`}
            >
              {formatNumber(coinDetailData.price_change_1h, 2)}%
            </span>
          </div>
        </div>
        <div className=" w-full h-auto flex justify-between items-center">
          <span>24시간</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            {coinDetailData.price_change_24h >= 0 ? (
              <GreenArrow className=" text-green " />
            ) : (
              <RedArrow className=" text-red " />
            )}
            <span
              className={`w-auto h-auto ${
                coinDetailData.price_change_24h >= 0 ? "text-green" : "text-red"
              }`}
            >
              {formatNumber(
                coinDetailData.price_change_24h,

                2
              )}
              %
            </span>
          </div>
        </div>
        <div className=" w-full h-auto flex justify-between items-center">
          <span>7일</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            {coinDetailData.price_change_7d >= 0 ? (
              <GreenArrow className=" text-green " />
            ) : (
              <RedArrow className=" text-red " />
            )}
            <span
              className={`w-auto h-auto ${
                coinDetailData.price_change_7d >= 0 ? "text-green" : "text-red"
              }`}
            >
              {formatNumber(coinDetailData.price_change_7d, 2)}%
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
              {currency}
              {formatNumber(coinDetailData.high_24h)}
            </td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>최저가 (24H)</td>
            <td>
              {currency}
              {formatNumber(coinDetailData.low_24h)}
            </td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>유통량</td>
            <td>
              {currency}
              {formatNumber(coinData.market_data.circulating_supply)}
            </td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>총 공급량</td>
            <td>{formatNumber(coinData.market_data.total_supply)}</td>
          </tr>
          <tr className=" pb-1 w-full h-auto border-b border-border dark:border-border-dark flex justify-between items-center">
            <td>최대 공급량</td>
            <td>{formatNumber(coinData.market_data.max_supply)}</td>
          </tr>
        </tbody>
      </table>
      <span className=" w-full text-right">Last Update: {lastDate}</span>
    </article>
  );
};

export default CoinArticle;
