"use client";
import React, { useEffect } from "react";
import { ProcessedCoin } from "@/type/type";
import { formatKRW } from "@/utill/utill";
import CoinImg from "../../../../components/CustomUI/CoinImg";
import Link from "next/link";

const CoinList = ({ getCoinList }: { getCoinList: ProcessedCoin[] }) => {
  useEffect(() => {
    console.log(
      "📦 받아온 코인 리스트:",
      getCoinList.map((c) => c.symbol)
    );
    console.log(
      "👻 PUNDIX 포함 여부:",
      getCoinList.some((c) => c.symbol === "PUNDIX")
    );
  }, [getCoinList]);
  return (
    <div className="w-full px-10 mobile:px-0 tablet:px-0 text-sm text-right">
      <div className="flex items-center bg-gray-100 dark:bg-gray-800 border-b-2 border-border dark:border-border-dark text-text dark:text-text-dark py-2 px-4">
        <div className="w-[20%] text-left text-medium font-bold">코인</div>
        <div className=" w-[25%] mr-[5%] flex tablet:justify-center mobile:flex-col text-medium font-bold ">
          <span className="text-right w-[50%] tablet:w-auto tablet:text-center text-medium font-bold">
            현재 가격
          </span>
          <span className="hidden  onlyTablet:block  ">/</span>
          <span className="text-right w-[50%] tablet:w-auto tablet:text-center text-[15px] font-bold">
            변화량(24H)
          </span>
        </div>

        <div className="  w-[25%] mr-[5%] flex tablet:justify-center mobile:flex-col  text-medium font-bold ">
          <span className="text-right w-[50%] tablet:w-auto tablet:text-center text-medium font-bold ">
            최고가
          </span>
          <span className="hidden  onlyTablet:block  ">/</span>
          <span className="text-right w-[50%] tablet:w-auto tablet:text-center text-medium font-bold ">
            최저가
          </span>
        </div>

        <div className=" w-[20%]  text-right text-medium font-bold ">
          거래량(24H)
        </div>
      </div>

      <ul className=" divide-border dark:divide-border-dark">
        {getCoinList.map((coin) => (
          <li
            key={coin.symbol}
            className="flex w-full items-center h-[80px] hover:bg-container hover:dark:bg-container-dark cursor-pointer px-4"
          >
            <Link
              href={`/detailcoin/${coin.symbol}/${encodeURIComponent(
                coin.korean_name
              )}`}
              className="flex items-center w-full"
            >
              <div className="w-[20%] flex items-center gap-4">
                <CoinImg name={coin.korean_name} symbol={coin.symbol} />
                <div className="flex flex-col">
                  <span className="text-left text-medium">
                    {coin.korean_name}
                  </span>
                  <span className="text-left text-medium">{coin.symbol}</span>
                </div>
              </div>
              <div className=" w-[25%] mr-[5%] justify-start flex tablet:justify-center tablet:flex-col  ">
                <span className="text-right w-[50%] tablet:w-auto tablet:text-center text-medium ">
                  ₩{formatKRW(coin.trade_price)}
                </span>

                <span
                  className={`text-right w-[50%] tablet:w-auto tablet:text-center text-medium ${
                    coin.signed_change_rate < 0 ? "text-red" : "text-green"
                  }`}
                >
                  {coin.signed_change_rate.toFixed(2)}%
                </span>
              </div>

              <div className=" mr-[5%] w-[25%] flex justify-start tablet:justify-center tablet:flex-col">
                <span className="text-right w-[50%] tablet:w-auto tablet:text-center text-medium">
                  ₩{formatKRW(coin.high_price)}
                </span>

                <span className="text-right w-[50%] tablet:w-auto tablet:text-center text-medium">
                  ₩{formatKRW(coin.low_price)}
                </span>
              </div>

              <div className="w-[20%] text-right text-medium">
                {formatKRW(coin.acc_trade_price_24h)}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinList;
