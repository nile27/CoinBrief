"use client";
import React from "react";
import { useRouter } from "next/navigation";

const CoinListTable = () => {
  const navi = useRouter();
  const coins = [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image:
        "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400", // 로고 URL
      current_price: 101715,
      price_change_percentage_1h_in_currency: 0.5,
      price_change_percentage_24h: 2.27,
      price_change_percentage_7d_in_currency: 10.5,
      total_volume: 52768841360,
      market_cap: 2014599100836,
    },
  ];
  const handleOnClick = () => {
    navi.push("/detailcoin");
  };
  return (
    <table className="w-full border-collapse border border-border dark:border-border-dark text-sm text-left">
      <thead className=" border-b-2 border-border dark:border-border-dark bg-gray-100 dark:bg-gray-800 text-text dark:text-text-dark">
        <tr className="">
          <th className="  px-2 py-2 text-center p-">순서</th>
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
        {coins.map((coin, index) => (
          <tr
            key={coin.id}
            className="border-b-2 border-border cursor-pointer dark:border-border-dark hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={handleOnClick}
          >
            <td className=" border-border dark:border-border-dark px-2 py-2 text-center">
              {index + 1}
            </td>
            <td className=" border-border dark:border-border-dark px-3 py-2 flex justify-start items-center gap-2">
              <img
                src={coin.image}
                alt={coin.name}
                className="w-6 h-6 rounded-full"
              />
              <span>{coin.name}</span>
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
  );
};

export default CoinListTable;
