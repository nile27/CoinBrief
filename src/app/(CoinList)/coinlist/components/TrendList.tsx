import React from "react";
import Ellipse from "@/../public/Ellipse.svg";

interface TrendInterface {
  num: number;
}

const TrendList = ({ num }: TrendInterface) => {
  return (
    <div className=" w-full h-auto min-h-[65px] flex justify-between items-center px-3">
      <div className=" w-auto h-auto flex justify-center items-center gap-2">
        <h2 className=" text-[28px] font-bold">{num}</h2>
        <Ellipse className=" w-[32px] h-[32px]" />
        <div className=" flex flex-col w-auto h-auto">
          <span>BTC</span>
          <span>비트코인</span>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className={`${true ? "text-red" : "text-green"}`}>-2.1%</span>
        <span className={``}>139,960,007원</span>
      </div>
    </div>
  );
};

export default TrendList;
