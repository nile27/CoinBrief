import React from "react";
import CurrencyCalc from "./components/CurrencyCalc";
import TrendList from "./components/TrendList";
import CoinListTable from "./components/CoinListTable";

const CoinList = () => {
  const map = [1, 2, 3];
  return (
    <section className=" flex flex-col w-full h-full gap-10">
      <section className=" flex justify-center items-center w-full h-auto px-5 pt-5 gap-20">
        <section className=" bg-container dark:bg-container-dark w-[350px] min-h-[280px] py-3 h-auto flex flex-col justify-center items-start gap-3 border-2 border-border dark:border-border-dark rounded-[10px]">
          <h1 className=" text-smallHeader font-extrabold px-5">
            🔥 &nbsp;&nbsp;트렌드
          </h1>
          <div className=" w-full h-auto flex flex-col gap-3">
            {map.map((_, key) => (
              <TrendList key={key} num={key + 1} />
            ))}
          </div>
        </section>
        <CurrencyCalc />
      </section>
      <section className=" w-full h-auto px-5">
        <CoinListTable />
      </section>
    </section>
  );
};

export default CoinList;
