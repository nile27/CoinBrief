import React from "react";
import CoinArticle from "../components/CoinArticle";
import DetailChart from "../components/DetailChart";
import DetailNews from "../components/DetailNews";
function DetailCoin() {
  return (
    <section className=" w-full h-full flex flex-col p-10 gap-10">
      <section className="w-full h-auto gap-10 flex justify-center px-8 py-5 border-border dark:border-border-dark border rounded-lg">
        <CoinArticle />

        <DetailChart />
      </section>
      <article className=" w-full h-auto gap-2 flex justify-start items-center overflow-y-auto px-8 py-5 border-border dark:border-border-dark border rounded-lg ">
        <DetailNews />
        <DetailNews />
        <DetailNews />
      </article>
    </section>
  );
}

export default DetailCoin;
