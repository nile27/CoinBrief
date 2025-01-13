import React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import InputStyle from "@/components/CustomUI/InputStyle";
import { CoinList } from "../page";

const CoinListTable = async ({ getCoinList }: { getCoinList: CoinList[] }) => {
  return (
    <article className="w-full ">
      <div className="w-[400px] h-[40px] flex justify-start item-center ml-4 px-2 mb-2   bg-container dark:bg-container-dark rounded-[10px] ">
        <button className="w-[35px] h-[auto] rounded-lg bg-transparent hover:opacity-[0.7]">
          <Search className="w-[30px] h-[24px] text-text dark:text-text-dark" />
        </button>
        <InputStyle placeholder="코인 이름, 심볼로 검색해주세요." />
      </div>
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
          {getCoinList.map((coin: CoinList, index: number) => (
            <tr
              key={coin.id}
              className="border-b-2 border-border  dark:border-border-dark group "
            >
              <td className=" border-border dark:border-border-dark px-2 py-2 text-center">
                {index + 1}
              </td>

              <td className=" border-border dark:border-border-dark px-3 py-2 flex justify-start items-center dark:group-hover:bg-primary-dark group-hover:bg-primary-dark group-hover:text-text-dark">
                <Link
                  key={coin.id}
                  href={`/detailcoin/${coin.symbol.toUpperCase()}`}
                  className="w-full flex justify-start items-center gap-2"
                >
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full"
                  />

                  <span className="cursor-pointer">{coin.name}</span>
                  <span className="cursor-pointer">
                    {coin.symbol.toUpperCase()}
                  </span>
                </Link>
              </td>

              <td className=" border-border dark:border-border-dark px-4 py-2 text-right">
                ${coin.current_price.toLocaleString()}
              </td>
              <td
                className={` border-border dark:border-border-dark px-4 py-2 text-right ${
                  coin.price_change_percentage_1h_in_currency > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
              </td>
              <td
                className={` border-border dark:border-border-dark px-4 py-2 text-right ${
                  coin.price_change_percentage_24h > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td
                className={` border-border dark:border-border-dark px-4 py-2 text-right ${
                  coin.price_change_percentage_7d_in_currency > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
              </td>
              <td className=" border-border dark:border-border-dark px-4 py-2 text-right">
                ${coin.total_volume.toLocaleString()}
              </td>
              <td className=" border-border dark:border-border-dark px-4 py-2 text-right">
                ${coin.market_cap.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  );
};

export default CoinListTable;
