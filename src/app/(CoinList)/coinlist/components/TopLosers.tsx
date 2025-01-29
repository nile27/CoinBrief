"use client";

import React from "react";
import CoinImg from "@/components/CustomUI/CoinImg";
import { ProcessedCoin } from "@/type/type";

const TopGainers = ({ coins }: { coins: ProcessedCoin[] }) => {
  const sortedCoins = [...coins]
    .sort((b, a) => Number(b.signed_change_rate) - Number(a.signed_change_rate))
    .slice(0, 3);

  return (
    <section className="w-[320px] h-auto max-h-[300px]  p-4 bg-container dark:bg-container-dark rounded-lg shadow-lg">
      <h2 className="text-smallHeader font-extrabold mb-4">
        🚀 가장 많이 하락한 코인(24H)
      </h2>
      <ul className="space-y-1 w-full h-full flex flex-col justify-start items-center gap-3">
        {sortedCoins.map((coin, index) => (
          <li
            key={coin.symbol}
            className="flex w-full items-center gap-4  last:border-none"
          >
            <span className="text-xl font-bold">{index + 1}</span>

            <CoinImg name={coin.korean_name} symbol={coin.symbol} />

            <div className="flex flex-col flex-1">
              <span className="text-base font-medium">{coin.korean_name}</span>
              <span className="text-sm text-gray-500">{coin.symbol}</span>
            </div>

            <span
              className={`text-sm font-semibold ${
                Number(coin.signed_change_rate) > 0 ? "text-green" : "text-red"
              }`}
            >
              {Number(coin.signed_change_rate).toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TopGainers;
