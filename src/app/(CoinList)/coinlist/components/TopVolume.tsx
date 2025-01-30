import CoinImg from "@/components/CustomUI/CoinImg";
import { ProcessedCoin } from "@/type/type";
import { formatKRW } from "@/utill/utill";
import Link from "next/link";
const TopCoinList = ({ coins }: { coins: ProcessedCoin[] }) => {
  const sortedCoins = [...coins]
    .sort(
      (a, b) => Number(b.acc_trade_volume_24h) - Number(a.acc_trade_volume_24h)
    )
    .slice(0, 3);
  return (
    <section className="w-[320px] h-auto max-h-[300px]  p-4 bg-container dark:bg-container-dark rounded-lg shadow-lg">
      <h2 className="text-smallHeader font-extrabold mb-4">
        🔥 가장 많이 거래된 코인 (24H)
      </h2>
      <ul className="space-y-1 w-full h-full flex flex-col justify-start items-center gap-3">
        {sortedCoins.map((coin, index) => (
          <Link
            key={coin.symbol}
            href={`/detailcoin/${coin.symbol}/${encodeURIComponent(
              coin.korean_name
            )}`}
            className="w-full h-auto"
          >
            <li className="flex w-full items-center gap-4 last:border-none">
              <span className="text-xl font-bold ">{index + 1}</span>

              <CoinImg name={coin.korean_name} symbol={coin.symbol} />

              <div className="flex flex-col flex-1">
                <span className="text-base font-medium">
                  {coin.korean_name}
                </span>
                <span className="text-sm text-gray-500">{coin.symbol}</span>
              </div>

              <span className="text-sm font-semibold">
                ₩{formatKRW(Number(coin.acc_trade_volume_24h)).toLocaleString()}
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </section>
  );
};

export default TopCoinList;
