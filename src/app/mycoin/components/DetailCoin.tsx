"use client";
import CoinImg from "@/components/CustomUI/CoinImg";
import { useCoinStore, useUserStore } from "@/store/store";
import React, { useEffect, useState } from "react";
import { formatKRW } from "@/utill/utill";
import BoxRealTime from "./BoxRealTime";
import MyCoinImg from "./MyCoinImg";

const DetailCoin = () => {
  const { mycoin } = useUserStore().user;

  return (
    <section className="w-1/3 bg-container max-h-[400px] overflow-y-scroll dark:bg-container-dark p-4 rounded shadow-lg tablet:w-full">
      <div className=" flex w-full justify-between items-center">
        <h2 className="text-lg font-semibold mb-4">내 코인 목록</h2>
        <span>{mycoin.length}/4</span>
      </div>
      {mycoin.length === 0 ? (
        <div className="h-[200px] w-full flex justify-center items-center">
          코인을 등록해주세요.
        </div>
      ) : (
        <ul className="space-y-3 w-full h-auto">
          {mycoin.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between p-3 min-h-[56px] bg-gray-100 dark:bg-gray-800 rounded shadow  tablet:items-start tablet:gap-3"
            >
              <div className="flex items-center gap-3 ">
                <MyCoinImg symbol={item.symbol} name={item.name} />

                <div className="  tablet:flex items-center gap-6  ">
                  <p className="font-medium">{item.symbol}</p>
                  <p className="text-gray-500 text-sm iphone:hidden">
                    {item.name}
                  </p>
                </div>
              </div>
              <div className="h-auto w-auto min-h-[30px] text-right  tablet:h-full">
                <BoxRealTime symbol={item.symbol} index={idx} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default DetailCoin;
