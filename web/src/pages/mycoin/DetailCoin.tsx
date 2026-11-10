import { useCoinStore, useUserStore } from "@/store/store";
import BoxRealTime from "./BoxRealTime";
import CoinImg from "@/components/CustomUI/CoinImg";
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
    <section className="max-h-[440px] overflow-y-auto rounded-[10px] border border-border bg-container p-4 dark:border-border-dark dark:bg-container-dark">
      <div className="mb-3 flex w-full items-baseline justify-between">
        <h2 className="text-[15px] font-semibold text-ink dark:text-ink-dark">
          내 코인 목록
        </h2>
        <span className="text-sm tabular-nums text-muted dark:text-muted-dark">
          {mycoin.length}/4
        </span>
      </div>
      {myCoinArr.length === 0 ? (
        <div className="flex h-[200px] w-full items-center justify-center text-muted dark:text-muted-dark">
          코인을 등록해주세요.
        </div>
      ) : (
        <ul className="flex w-full flex-col gap-2">
          {mycoin.map((item, idx) => (
            <li
              key={idx}
              className={`flex min-h-[60px] cursor-pointer items-center justify-between gap-3 rounded-md border p-3 transition-colors ${
                selectedCoin === idx
                  ? "border-ink bg-background dark:border-ink-dark dark:bg-background-dark"
                  : "border-transparent bg-secondary hover:bg-hover dark:bg-secondary-dark dark:hover:bg-hover-dark"
              }`}
              onClick={() => setSelectedCoin(idx)}
            >
              <div className="flex min-w-0 items-center gap-3">
                <CoinImg symbol={item.symbol} name={item.name} />
                <p className="font-medium text-ink dark:text-ink-dark">{item.symbol}</p>
              </div>
              <BoxRealTime symbol={item.symbol} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default DetailCoin;
