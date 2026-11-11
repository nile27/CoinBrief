import React, { useEffect, useState } from "react";
import { ProcessedCoin } from "@/type/type";
import { formatKRW } from "@/utill/utill";
import CoinImg from "@/components/CustomUI/CoinImg";
import { Link } from "react-router";

const CoinList = ({ getCoinList }: { getCoinList: ProcessedCoin[] }) => {
  const [coinList, setCoinList] = useState<ProcessedCoin[]>([]);

  useEffect(() => {
    setCoinList(getCoinList);
  }, [getCoinList]);

  const colHL = "w-28 shrink-0 text-right tabular-nums tablet:hidden";
  return (
    <div className="w-full text-sm">
      <div className="flex items-center gap-4 border-b border-border px-3 py-3 text-xs font-medium text-muted dark:border-border-dark dark:text-muted-dark">
        <div className="min-w-0 flex-1">코인</div>
        <div className="flex shrink-0 items-center gap-4">
          <span className="w-28 text-right mobile:hidden">현재 가격</span>
          <span className="w-16 text-right mobile:hidden">변화(24H)</span>
          <span className="hidden mobile:block">가격 / 변화</span>
        </div>
        <div className={colHL}>최고가</div>
        <div className={colHL}>최저가</div>
        <div className="w-28 shrink-0 text-right tabular-nums mobile:hidden">
          거래대금(24H)
        </div>
      </div>

      <ul className="divide-y divide-border dark:divide-border-dark">
        {coinList.map((coin) => (
          <li key={coin.symbol}>
            <Link
              to={`/detailcoin/${coin.symbol}/${encodeURIComponent(
                coin.korean_name
              )}`}
              className="flex min-h-[64px] items-center gap-4 px-3 py-2 transition-colors hover:bg-hover dark:hover:bg-hover-dark"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <CoinImg name={coin.korean_name} symbol={coin.symbol} />
                <div className="flex min-w-0 flex-col">
                  <span className="truncate font-medium text-ink dark:text-ink-dark">
                    {coin.korean_name}
                  </span>
                  <span className="text-xs text-muted dark:text-muted-dark">
                    {coin.symbol}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4 tabular-nums mobile:flex-col mobile:items-end mobile:gap-0">
                <span className="w-28 text-right mobile:w-auto">
                  ₩{formatKRW(coin.trade_price)}
                </span>
                <span
                  className={`w-16 text-right mobile:w-auto ${
                    coin.signed_change_rate < 0
                      ? "text-down"
                      : coin.signed_change_rate > 0
                      ? "text-up"
                      : "text-muted dark:text-muted-dark"
                  }`}
                >
                  {coin.signed_change_rate > 0 ? "+" : ""}
                  {(coin.signed_change_rate * 100).toFixed(2)}%
                </span>
              </div>
              <div className={colHL}>₩{formatKRW(coin.high_price)}</div>
              <div className={colHL}>₩{formatKRW(coin.low_price)}</div>
              <div className="w-28 shrink-0 text-right tabular-nums mobile:hidden">
                {formatKRW(Math.round(coin.acc_trade_price_24h))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoinList;
