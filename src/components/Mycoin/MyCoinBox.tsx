import React from "react";
import Ellipse from "@/../public/Ellipse.svg";
import GreenArrow from "@/../public/GreenArrow.svg";
import RedArrow from "@/../public/RedArrow.svg";

const MyCoinBox = () => {
  return (
    <div className=" relative w-auto h-[300px] flex items-end  hover:scale-105 duration-150  ">
      <Ellipse className="absolute z-10 top-0 left-10 " />
      <div className=" flex justify-start items-center flex-col py-2 px-4 w-[300px] h-auto border-2 border-btn dark:border-text-dark bg-container dark:bg-container-dark rounded-[5px]">
        <div className=" w-full h-auto px-6 py-2 flex justify-center items-end flex-col">
          <span className=" h-auto w-[70px] text-start text-[18px]">
            비트 코인
          </span>
          <span className="h-auto w-[70px] text-start text-[18px]">BTC</span>
          <span
            className={`h-auto w-[70px] text-start text-[18px] ${
              false ? "text-green" : "text-red"
            }`}
          >
            0.62%
          </span>
        </div>
        <div className=" w-full h-auto  py-2 flex justify-center items-start flex-col">
          <div className=" w-full h-auto flex justify-start items-center gap-5">
            <span className="w-auto h-auto font-semibold text-[24px] pl-2">
              USD
            </span>
            <span className="w-auto h-auto  text-[24px]">$95,502.99</span>
          </div>
          <div className=" w-full h-auto flex justify-start items-center gap-5">
            <span className="w-auto h-auto font-semibold text-[24px] pl-2">
              KRW
            </span>
            <span className="w-auto h-auto  text-[24px]">₩139,960,007</span>
          </div>
        </div>
        <div className=" w-full h-auto  py-2 flex justify-center items-start flex-col gap-2">
          <div className=" w-full h-auto flex justify-between items-center gap-5">
            <span className="w-auto h-auto font-semibold pl-2">24시간</span>
            <div className=" w-auto h-auto flex gap-2 items-center pr-1">
              <GreenArrow className=" text-green " />
              <span
                className={`w-auto h-auto ${true ? "text-green" : "text-red"}`}
              >
                2.1%
              </span>
            </div>
          </div>
          <div className=" w-full h-auto flex justify-between items-center gap-5">
            <span className="w-auto h-auto font-semibold  pl-2">7일</span>
            <div className=" w-auto h-auto flex gap-2 items-center pr-1">
              <RedArrow className="  " />
              <span
                className={`w-auto h-auto ${false ? "text-green" : "text-red"}`}
              >
                0.1%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCoinBox;
