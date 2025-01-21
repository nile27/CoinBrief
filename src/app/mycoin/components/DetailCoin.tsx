import React from "react";
import RedArrow from "@/../public/RedArrow.svg";
import GreenArrow from "@/../public/GreenArrow.svg";
import Ellipse from "@/../public/Ellipse.svg";
import BtnStyle from "@/components/CustomUI/BtnStyle";

import RealTimePrice from "./RealTimePrice";

const DetailCoin = () => {
  return (
    <section className=" w-[370px] h-auto rounded-[12px] flex flex-col gap-4 justify-start items-center py-6 px-4 border-[1px] border-border dark:border-border-dark">
      <div className=" w-full h-auto flex justify-start items-center gap-5 ">
        <Ellipse className=" w-[32px] h-[32px] overflow-contain overflow-visible aspect-square" />
        <span className=" text-smallHeader font-bold">BTC</span>
        <span className=" text-smallHeader font-bold">비트 코인</span>
      </div>
      <RealTimePrice />

      <div className="w-full h-auto flex flex-col gap-3">
        <div className=" w-full h-auto flex justify-between items-center ">
          <span className="w-auto h-auto  ">24시간</span>
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
          <span className="w-auto h-auto  ">7일</span>
          <div className=" w-auto h-auto flex gap-2 items-center pr-1">
            <GreenArrow className=" text-green " />
            <span
              className={`w-auto h-auto ${true ? "text-green" : "text-red"}`}
            >
              2.1%
            </span>
          </div>
        </div>
      </div>

      <div className=" w-full h-auto flex flex-col justify-start items-start gap-1">
        <span className="w-auto h-auto font-semibold ">시가총액</span>
        <div className=" w-full h-auto flex justify-start items-center gap-5 ">
          <span className="w-auto h-auto text-[18px]  ">USD</span>
          <span className="w-auto h-auto text-[18px] ">$1,901,732,884,178</span>
        </div>
      </div>
      <BtnStyle size="medium">자세히 보기</BtnStyle>
    </section>
  );
};

export default DetailCoin;
