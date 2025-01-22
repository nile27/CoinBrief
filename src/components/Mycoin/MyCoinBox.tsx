"use client";
import { useState } from "react";
import Ellipse from "@/../public/Ellipse.svg";
import GreenArrow from "@/../public/GreenArrow.svg";
import RedArrow from "@/../public/RedArrow.svg";
import BoxRealTime from "@/app/mycoin/components/BoxRealTime";
const MyCoinBox = ({ bool }: { bool: boolean }) => {
  const [realRate, setRate] = useState("");

  return (
    <div
      className={` relative max-w-[280px] w-[280px] h-[220px] flex items-center  duration-150  ${
        bool ? "scale-110" : " hover:scale-105"
      }`}
    >
      <Ellipse className="absolute z-10 top-0 left-10 w-[70px] h-[70px]" />
      <div className=" flex justify-start items-center flex-col py-2 px-4 w-[280px] h-auto border-2 border-btn dark:border-text-dark bg-container dark:bg-container-dark rounded-[5px]">
        <div className=" w-full h-auto px-6 py-2 flex justify-center items-end flex-col">
          <span className=" h-auto w-[70px] text-start text-[18px] font-bold">
            비트 코인
          </span>
          <span className="h-auto w-[70px] text-start text-[18px] font-bold">
            BTC
          </span>
          <div className=" w-auto h-auto flex gap-1 items-center justify-start">
            {Number(realRate) >= 0 ? (
              <GreenArrow className="text-green" />
            ) : (
              <RedArrow className="text-red" />
            )}
            <span
              className={`w-auto min-w-[50px] h-auto text-start ${
                Number(realRate) >= 0 ? "text-green" : "text-red"
              }`}
            >
              {realRate}%
            </span>
          </div>
        </div>
        <BoxRealTime setRate={setRate} realRate={realRate} />
      </div>
    </div>
  );
};

export default MyCoinBox;
