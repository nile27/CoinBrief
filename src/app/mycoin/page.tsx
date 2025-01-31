"use client";
import React from "react";
import HeaderCoinBox from "./components/HeaderCoinBox";
import DetailCoin from "./components/DetailCoin";
import MyCoinChart from "./components/MyCoinChart";

const Mycoin = () => {
  return (
    <section className="w-[100vw] h-auto p-4 flex flex-col justify-center items-center gap-10 ">
      <HeaderCoinBox />
      <main className="flex gap-6 tablet:flex-col w-full px-6">
        <DetailCoin />
        <section className="flex-1 flex flex-col gap-6">
          <MyCoinChart symbol="XRP" />
        </section>
      </main>
    </section>
  );
};

export default Mycoin;
