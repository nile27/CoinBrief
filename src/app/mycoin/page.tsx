import React from "react";

import MyCoinChart from "./components/MyCoinChart";
import CoinBoxList from "./components/CoinBoxList";
import AddCoinBox from "./components/AddCoinBox";
import DetailCoin from "./components/DetailCoin";

const Mycoin = () => {
  return (
    <main className="w-[100vw] h-auto p-4 flex flex-col justify-center items-center gap-10 ">
      <section className="w-full h-[auto] flex justify-center gap-10 items-center">
        <DetailCoin />
        {/* <MyCoinChart /> */}
      </section>
      <section className="w-full h-auto flex flex-col gap-3 justify-center items-center">
        <div className=" w-full h-[40px] flex justify-between items-center  px-10">
          <h1 className=" text-[24px] font-semibold w-full">내 코인 목록</h1>

          <AddCoinBox />
        </div>
        <CoinBoxList />
      </section>
    </main>
  );
};

export default Mycoin;
