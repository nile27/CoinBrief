"use client";
import { useCoinStore, useUserStore } from "@/store/store";
import BoxRealTime from "./BoxRealTime";
import MyCoinImg from "./MyCoinImg";
import { useEffect, useState } from "react";

interface mycoin {
  id: string;
  symbol: string;
  name: string;
}
[];

const DetailCoin = () => {
  const [myCoinArr, setMyCoinArr] = useState<mycoin[]>([]);
  const { mycoin } = useUserStore().user;
  const { setSelectedCoin, selectedCoin } = useCoinStore();

  useEffect(() => {
    setMyCoinArr(mycoin);
  }, [mycoin]);

  return (
    <section className="w-1/3 bg-container max-h-[400px] overflow-y-scroll dark:bg-container-dark p-4 rounded shadow-lg tablet:w-full">
      <div className=" flex w-full justify-between items-center">
        <h2 className="text-lg font-semibold mb-4">내 코인 목록</h2>
        <span>{mycoin.length}/4</span>
      </div>
      {myCoinArr.length === 0 ? (
        <div className="h-[200px] w-full flex justify-center items-center">
          코인을 등록해주세요.
        </div>
      ) : (
        <ul className="space-y-3 w-full h-auto">
          {mycoin.map((item, idx) => (
            <li
              key={idx}
              className={`flex rounde-md items-center cursor-pointer justify-between p-3 min-h-[56px]  rounded shadow  tablet:items-start tablet:gap-3 ${
                selectedCoin === idx
                  ? " transform scale-105 transition-all duration-200 border border-border dark:border-border-dark"
                  : "bg-gray-100 dark:bg-gray-800"
              }`}
              onClick={() => setSelectedCoin(idx)}
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
                <BoxRealTime symbol={item.symbol} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default DetailCoin;
