"use client";
import MyCoinArticle from "./MyCoinArticle";
import MyCoinChart from "./MyCoinChart";
import { useUserStore } from "@/store/store";
const MycoinLoading = () => {
  const { mycoin } = useUserStore().user;
  return (
    <section className="flex-1 flex flex-col gap-6">
      {mycoin.length === 0 ? (
        <div className=" flex justify-center items-center w-full h-[370px]">
          코인을 등록해주세요.
        </div>
      ) : (
        <>
          <MyCoinChart />
          <MyCoinArticle />
        </>
      )}
    </section>
  );
};

export default MycoinLoading;
