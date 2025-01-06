import React from "react";
import Chart from "@/components/Chart/Chart";
import MyCoinBox from "@/components/Mycoin/MyCoinBox";
import RedArrow from "@/../public/RedArrow.svg";
import GreenArrow from "@/../public/GreenArrow.svg";
import Ellipse from "@/../public/Ellipse.svg";
import { CirclePlus, CircleX } from "lucide-react";

import BtnStyle from "@/components/CustomUI/BtnStyle";

const Mycoin = () => {
  let coinBoxArr = [true, false, false];

  return (
    <main className="w-[100vw] h-auto p-4 flex flex-col justify-center items-center gap-10 ">
      <section className="w-full h-[auto] flex justify-center gap-10 items-center">
        <section className=" w-[370px] h-auto rounded-[12px] flex flex-col gap-4 justify-start items-center py-6 px-4 border-[1px] border-border dark:border-border-dark">
          {/* 코인을 등록해주세요. */}
          <div className=" w-full h-auto flex justify-start items-center gap-5 ">
            <Ellipse className=" w-[32px] h-[32px] overflow-contain overflow-visible aspect-square" />
            <span className=" text-smallHeader font-bold">BTC</span>
            <span className=" text-smallHeader font-bold">비트 코인</span>
          </div>
          <div className=" w-full h-auto flex flex-col ">
            <div className=" w-full h-auto flex justify-between items-center gap-5 ">
              <div className=" w-full h-auto flex justify-start items-center gap-5">
                <span className="w-[52px] h-auto font-semibold text-[24px] ">
                  USD
                </span>
                <span className="w-auto h-auto text-[24px] ">$95,502.99</span>
              </div>
              <div className=" w-auto h-auto flex gap-2 items-center pr-1">
                <RedArrow className="  " />
                <span
                  className={`w-auto h-auto ${
                    false ? "text-green" : "text-red"
                  }`}
                >
                  0.1%
                </span>
              </div>
            </div>
            <div className=" w-full h-auto flex justify-between items-center gap-5 ">
              <div className=" w-full h-auto flex justify-start items-center gap-5">
                <span className="w-[52px] h-auto font-semibold text-[23px]   ">
                  KRW
                </span>
                <span className="w-auto h-auto text-[24px] ">₩139,960,007</span>
              </div>
              <div className=" w-auto h-auto flex gap-2 items-center pr-1">
                <RedArrow className="  " />
                <span
                  className={`w-auto h-auto ${
                    false ? "text-green" : "text-red"
                  }`}
                >
                  0.1%
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-auto flex flex-col gap-3">
            <div className=" w-full h-auto flex justify-between items-center ">
              <span className="w-auto h-auto  ">24시간</span>
              <div className=" w-auto h-auto flex gap-2 items-center pr-1">
                <GreenArrow className=" text-green " />
                <span
                  className={`w-auto h-auto ${
                    true ? "text-green" : "text-red"
                  }`}
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
                  className={`w-auto h-auto ${
                    true ? "text-green" : "text-red"
                  }`}
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
              <span className="w-auto h-auto text-[18px] ">
                $1,901,732,884,178
              </span>
            </div>
          </div>
          <BtnStyle size="medium">자세히 보기</BtnStyle>
        </section>
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
