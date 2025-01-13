import React from "react";
import { CoinList } from "../page";

interface TopVolumeInterface {
  num: number;
  item: CoinList;
}

const TrendList = ({ num, item }: TopVolumeInterface) => {
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
        <span className={`${true ? "text-red" : "text-green"}`}>-2.1%</span>
        <span>${(1 / item.current_price).toFixed(2)}</span>
      </div>
    </div>
  );
};

export default TrendList;
