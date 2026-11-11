import CoinImg from "@/components/CustomUI/CoinImg";
import type { ProcessedCoin } from "@/type/type";
import { formatKRW } from "@/utils/utils";
import { Link } from "react-router";
const TopCoinList = ({ coins }: { coins: ProcessedCoin[] }) => {
  const sortedCoins = [...coins]
    .sort(
      (a, b) => Number(b.acc_trade_price_24h) - Number(a.acc_trade_price_24h)
    )
    .slice(0, 3);
  return (
    <section className="rounded-[10px] border border-border bg-container p-5 dark:border-border-dark dark:bg-container-dark">
      <h2 className="mb-4 text-[15px] font-semibold text-ink dark:text-ink-dark">
        가장 많이 거래된 코인 (24H)
      </h2>
      <ul className="flex w-full flex-col gap-3">
        {sortedCoins.map((coin, index) => (
          <Link
            key={coin.symbol}
            to={`/detailcoin/${coin.symbol}/${encodeURIComponent(
              coin.korean_name
            )}`}
            className="w-full h-auto"
          >
            <li className="flex w-full items-center gap-4 last:border-none">
              <span className="w-4 text-sm font-semibold text-muted dark:text-muted-dark tabular-nums">{index + 1}</span>

              <CoinImg name={coin.korean_name} symbol={coin.symbol} />

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-ink dark:text-ink-dark">
                  {coin.korean_name}
                </span>
                <span className="text-xs text-muted dark:text-muted-dark">{coin.symbol}</span>
              </div>

              <span className="whitespace-nowrap text-sm font-medium tabular-nums">
                ₩{formatKRW(Number(coin.acc_trade_price_24h))}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </section>
  );
};

export default TopCoinList;
