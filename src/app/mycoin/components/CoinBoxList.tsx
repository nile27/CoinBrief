"use client";

import { useUserStore } from "@/store/store";
import MyCoinBox from "./MyCoinBox";

const CoinBoxList = () => {
  const user = useUserStore((state) => state.user);
  return (
    <ul className="w-full h-[330px] border-border dark:border-border-dark border-[2px] rounded-[12px] pl-10  flex gap-10 justify-center items-center overflow-x-auto">
      {user.mycoin.map((item) => (
        <MyCoinBox key={item.symbol} symbol={item.symbol} />
      ))}
    </ul>
  );
};

export default CoinBoxList;
