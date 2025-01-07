import React from "react";

const DetailNews = () => {
  return (
    <div className="w-[320px] h-[302px] flex flex-col gap-2 border-border dark:border-border-dark border p-2 rounded-[10px] ">
      <p className=" text-right w-full h-auto text-small dark:text-[rgba(228,228,235,0.59)] text-[rgba(113,113,113,0.59)]">
        00일보 2시간 전
      </p>
      <div className=" bg-slate-400 w-[300px] h-[200px] rounded-[10px]"></div>
      <h1 className="font-semibold text-smallHeader dark:text-text-dark text-text px-1 ">
        "산유국 되나" 尹 한 마디에 한국 석유 또 '上'…석유주 훨훨
      </h1>
    </div>
  );
};

export default DetailNews;
