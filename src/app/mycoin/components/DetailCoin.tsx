"use client";
import React, { useEffect, useState } from "react";
import GreenArrow from "@/../public/GreenArrow.svg";
import RedArrow from "@/../public/RedArrow.svg";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import RealTimePrice from "./RealTimePrice";

import { useCoinStore, useUserStore } from "@/store/store";
import Link from "next/link";

const DetailCoin = () => {
  const { coinId, selectedCoin, setCoinId } = useCoinStore();
  const { mycoin } = useUserStore.getState().user;
  const [coinData, setCoinData] = useState<any>({});

  if (mycoin.length === 0) {
    return (
      <section className=" text-smallHeader font-bold w-[400px] h-[460px] rounded-[12px] flex flex-col gap-4 justify-center items-center py-6 px-4 border-[1px] border-border dark:border-border-dark">
        <div>코인을 등록해주세요..</div>
      </section>
    );
  }

  useEffect(() => {
    setCoinId(mycoin[selectedCoin].id);

    const coinDataFetch = async () => {
      try {
        if (!mycoin[selectedCoin].id) {
          throw new Error("잘못된 코인 정보입니다.");
        }

        const response = await fetch(
          `https://api.coinpaprika.com/v1/tickers/${mycoin[selectedCoin].id}`
        );

        if (!response.ok) {
          throw new Error("코인파프리카 매핑 실패.");
        }

        const data = await response.json();

        setCoinData(data);
      } catch (error) {
        console.error("코인파프리카 검색 에러:", error);
      }
    };
    coinDataFetch();
  }, [selectedCoin]);

  return (
    <section className=" w-[370px] h-auto rounded-[12px] flex flex-col gap-4 justify-start items-center py-6 px-4 border-[1px] border-border dark:border-border-dark">
      <div className=" w-full h-auto flex justify-start items-center gap-5 ">
        <img
          src={`https://coinpaprika.com/coin/${coinId}/logo.png`}
          alt={coinId}
          className="w-[40px] h-[40px]"
        />
        <span className=" text-smallHeader font-bold">{coinData.symbol}</span>
        <span className=" text-smallHeader font-bold">{coinData.name}</span>
      </div>
      <RealTimePrice />

      <div className="w-full h-auto flex flex-col gap-3">
        <div className=" w-full h-auto flex justify-between items-center ">
          <span className="w-auto h-auto  ">24시간</span>

          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            {!coinData || !coinData.quotes || !coinData.quotes.USD ? (
              <span className="text-gray-500">Loading...</span>
            ) : (
              <>
                {coinData.quotes.USD.percent_change_24h >= 0 ? (
                  <GreenArrow className="text-green" />
                ) : (
                  <RedArrow className="text-red" />
                )}
                <span
                  className={`w-[40px] h-auto text-right ${
                    coinData.quotes.USD.percent_change_24h >= 0
                      ? "text-green"
                      : "text-red"
                  }`}
                >
                  {`${coinData.quotes.USD.percent_change_24h}%`}
                </span>
              </>
            )}
          </div>
        </div>
        <div className=" w-full h-auto flex justify-between items-center gap-5">
          <span className="w-auto h-auto  ">7일</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            {!coinData || !coinData.quotes || !coinData.quotes.USD ? (
              <span className="text-gray-500">Loading...</span>
            ) : (
              <>
                {coinData.quotes.USD.percent_change_7d >= 0 ? (
                  <GreenArrow className="text-green" />
                ) : (
                  <RedArrow className="text-red" />
                )}
                <span
                  className={`w-[40px] h-auto text-right ${
                    coinData.quotes.USD.percent_change_7d >= 0
                      ? "text-green"
                      : "text-red"
                  }`}
                >
                  {`${coinData.quotes.USD.percent_change_7d}%`}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className=" w-full h-auto flex flex-col justify-start items-start gap-1">
        <span className="w-auto h-auto font-semibold ">시가총액</span>
        <div className=" w-full h-auto flex justify-between items-center gap-5 ">
          <span className="w-auto h-auto text-[18px]  ">USD</span>
          <span className="w-auto h-auto text-[18px] ">
            {!coinData || !coinData.quotes || !coinData.quotes.USD ? (
              <span className="text-gray-500">Loading...</span>
            ) : (
              `$ ${coinData.quotes.USD.market_cap.toLocaleString()}`
            )}
          </span>
        </div>
      </div>
      <Link href={`detailcoin/${coinData.id}`} className="w-full h-auto">
        <BtnStyle size="medium">자세히 보기</BtnStyle>
      </Link>
    </section>
  );
};

export default DetailCoin;
