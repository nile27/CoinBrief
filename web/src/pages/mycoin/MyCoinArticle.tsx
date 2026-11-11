import { useCoinStore, useUserStore } from "@/store/store";
import { formatKRW } from "@/utils/utils";
import Skeleton from "@/components/Skeleton";

const MyCoinArticle = () => {
  const user = useUserStore((state) => state.user);
  const { staticData, selectedCoin } = useCoinStore();

  if (user.mycoin.length === 0) {
    return (
      <span className="flex h-[200px] w-full items-center justify-center text-muted dark:text-muted-dark">
        코인을 등록해주세요.
      </span>
    );
  }

  const coinSymbol = user.mycoin[selectedCoin]?.symbol;

  if (!coinSymbol || !staticData[coinSymbol]) {
    return (
      <div aria-busy="true" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex min-w-0 flex-col gap-1 rounded-[10px] border border-border bg-container p-4 dark:border-border-dark dark:bg-container-dark"
          >
            <p className="text-xs"><Skeleton className="w-14" /></p>
            <p className="text-[15px]"><Skeleton className="w-24" /></p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {[
        {
          title: "최고가",
          value: staticData[coinSymbol].high_price,
          currency: "₩",
        },
        {
          title: "최저가",
          value: staticData[coinSymbol].low_price,
          currency: "₩",
        },
        {
          title: "거래량(24H)",
          value: Number(staticData[coinSymbol].acc_trade_volume_24h.toFixed(0)),
          currency: coinSymbol,
        },
        {
          title: "거래대금(24H)",
          value: staticData[coinSymbol].acc_trade_price_24h,
          currency: "₩",
        },
      ].map((item, idx) => (
        <div
          key={idx}
          className="flex min-w-0 flex-col gap-1 rounded-[10px] border border-border bg-container p-4 dark:border-border-dark dark:bg-container-dark"
        >
          <p className="text-xs text-muted dark:text-muted-dark">{item.title}</p>
          <p className="break-words text-[15px] font-medium tabular-nums text-ink dark:text-ink-dark">
            {formatKRW(item.value)} {item.currency}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyCoinArticle;
