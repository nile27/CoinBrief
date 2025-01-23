"use client";
import { useUserStore } from "@/store/store";
import MyCoinBox from "./MyCoinBox";
import { Coin } from "@/store/store";

const CoinBoxList = () => {
  const user = useUserStore((state) => state.user);

  return (
    <ul className="w-full h-[330px] border-border dark:border-border-dark border-[2px] rounded-[12px] pl-10  flex gap-10 justify-start items-center overflow-x-auto">
      {user.mycoin.length === 0
        ? "코인을 등록해주세요."
        : user.mycoin.map((item: Coin, idx: number) => (
            <MyCoinBox
              key={item.id}
              symbol={item.symbol}
              id={item.id}
              name={item.name}
              index={idx}
            />
          ))}
    </ul>
  );
};

export default CoinBoxList;
