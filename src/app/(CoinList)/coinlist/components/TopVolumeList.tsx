import React from "react";
import { CoinList } from "../page";

interface TopVolumeInterface {
  num: number;
  item: CoinList;
}

const TopVolumeList = ({ num, item }: TopVolumeInterface) => {
  const totalVolume = item.total_volume
    .toFixed(2)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const hourCurrency = Number(
    item.price_change_percentage_1h_in_currency.toFixed(2)
  );
  return (
    <div
      key={item.id}
      className=" w-full h-auto min-h-[65px] flex justify-between items-center px-3"
    >
      <div className=" w-auto h-auto flex justify-center items-center gap-2">
        <h2 className=" text-[28px] font-bold">{num}</h2>

        <img
          src={item.image}
          alt={item.name}
          className="w-6 h-6 rounded-full"
        />
        <div className=" flex flex-col w-auto h-auto">
          <span>{item.name}</span>
          <span>{item.symbol}</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`${hourCurrency < 0 ? "text-red" : "text-green"}`}>
          {hourCurrency === 0 ? "0.00" : hourCurrency}%
        </span>
        <span>${totalVolume}</span>
      </div>
    </div>
  );
};

export default TopVolumeList;
