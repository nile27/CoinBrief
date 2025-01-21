import React from "react";
import Chart from "@/components/Chart/Chart";
import MyCoinBox from "@/components/Mycoin/MyCoinBox";

import { CirclePlus, CircleX } from "lucide-react";
import DetailCoin from "./components/DetailCoin";

const Mycoin = () => {
  let coinBoxArr = [true, false, false];

  return (
    <main className="w-[100vw] h-auto p-4 flex flex-col justify-center items-center gap-10 ">
      <section className="w-full h-[auto] flex justify-center gap-10 items-center">
        <DetailCoin />
        <Chart />
      </section>
      <section className="w-full h-auto flex flex-col gap-3 justify-center items-center">
        <div className=" w-full h-[40px] flex justify-between items-center  px-10">
          <h1 className=" text-[24px] font-semibold w-full">내 코인 목록</h1>
          <div className=" w-auto h-full flex justify-center items-center  gap-5">
            <button className=" flex gap-2 w-auto h-full items-center  rounded-full border border-green px-2">
              <CirclePlus className=" text-green " />
              <span className=" whitespace-nowrap">코인 등록</span>
            </button>
            <button className=" flex gap-2 w-auto h-full items-center  rounded-full border border-[#DF4646] px-2">
              <CircleX className=" text-[#DF4646] " />
              <span className=" whitespace-nowrap">코인 삭제</span>
            </button>
          </div>
        </div>
        <div className="w-full h-[370px] border-border dark:border-border-dark border-[2px] rounded-[12px] pl-10  flex gap-10 justify-start items-center overflow-x-auto">
          {/* 내 코인을 등록해주세요. */}
          {coinBoxArr.map((items: boolean, idx) => {
            return <MyCoinBox key={idx} bool={items} />;
          })}
        </div>
      </section>
    </main>
  );
};

export default Mycoin;
