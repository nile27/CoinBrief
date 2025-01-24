import React from "react";

interface TopVolumeInterface {
  num: number;
  item: TrendingInterface;
}
interface TrendingInterface {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  data: {
    price: number;
    price_change_percentage_24h: { usd: string; krw: string };
  };
}

const TopVolumeList = ({ num, item }: TopVolumeInterface) => {
  const totalPrice = item.data.price
    .toFixed(3)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const hourCurrency: number = Number(
    parseInt(item.data.price_change_percentage_24h.usd).toFixed(2)
  );
  return (
    <div
      key={item.id}
      className=" w-full h-auto min-h-[65px] flex justify-between items-center px-3"
    >
      <div className=" w-auto h-auto flex justify-center items-center gap-2">
        <h2 className=" text-[28px] font-bold">{num}</h2>

        <img
          src={item.thumb}
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
        <span>${totalPrice}</span>
      </div>
    </div>
  );
};

export default TopVolumeList;
