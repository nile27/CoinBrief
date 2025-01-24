import React from "react";
import Link from "next/link";

import { CoinList } from "../[page]/page";
import CoinImg from "./CoinImg";

const CoinListTable = async ({ getCoinList }: { getCoinList: CoinList[] }) => {
  return (
    <article className="w-full ">
      <table className="w-full border-collapse border border-border dark:border-border-dark text-sm text-left">
        <thead className=" border-b-2 border-border dark:border-border-dark bg-gray-100 dark:bg-gray-800 text-text dark:text-text-dark">
          <tr className="">
            <th className="  px-2 py-2 text-center ">순서</th>
            <th className="   px-4 py-2 text-left">코인</th>
            <th className="  px-4 py-2 text-right">시세</th>
            <th className="  px-4 py-2 text-right">1시간</th>
            <th className="  px-4 py-2 text-right">24시간</th>
            <th className="  px-4 py-2 text-right">7일</th>
            <th className="   px-4 py-2 text-right">거래량</th>
            <th className="  px-4 py-2 text-right">시가총액</th>
          </tr>
        </thead>
        <tbody>
          {getCoinList.map((coin: CoinList) => (
            <tr
              key={coin.id}
              className="border-b-2 border-border  dark:border-border-dark group "
            >
              <td className=" border-border dark:border-border-dark px-2 py-2 text-center">
                {coin.rank}
              </td>

              <td className=" border-border dark:border-border-dark px-3 py-2 flex justify-start items-center dark:group-hover:bg-primary-dark group-hover:bg-primary-dark group-hover:text-text-dark">
                <Link
                  key={coin.id}
                  href={`/detailcoin/${coin.id}`}
                  className="w-full flex justify-start items-center gap-2"
                >
                  <CoinImg name={coin.name} id={coin.id} />

                  <span className="cursor-pointer">{coin.name}</span>
                  <span className="cursor-pointer">
                    {coin.symbol.toUpperCase()}
                  </span>
                </Link>
              </td>

              <td className=" border-border dark:border-border-dark px-4 py-2 text-right">
                ${coin.quotes.USD.price.toLocaleString()}
              </td>
              <td
                className={` border-border dark:border-border-dark px-4 py-2 text-right ${
                  coin.quotes.USD.percent_change_1h > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.quotes.USD.percent_change_1h?.toFixed(2)}%
              </td>
              <td
                className={` border-border dark:border-border-dark px-4 py-2 text-right ${
                  coin.quotes.USD.percent_change_24h > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.quotes.USD.percent_change_24h?.toFixed(2)}%
              </td>
              <td
                className={` border-border dark:border-border-dark px-4 py-2 text-right ${
                  coin.quotes.USD.percent_change_7d > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.quotes.USD.percent_change_7d?.toFixed(2)}%
              </td>
              <td className=" border-border dark:border-border-dark px-4 py-2 text-right">
                ${coin.quotes.USD.volume_24h.toLocaleString()}
              </td>
              <td className=" border-border dark:border-border-dark px-4 py-2 text-right">
                ${coin.quotes.USD.volume_24h.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};

export default CoinListTable;
