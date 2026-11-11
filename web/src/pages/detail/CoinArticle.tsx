import { useCurrency } from "@/store/store";
import type { TickerData } from "@/type/type";
import { formatCurrency, formatKRW } from "@/utill/utill";

const CoinArticle = ({ coinData, exchange }: { coinData: TickerData; exchange: number }) => {
  const lastUpdated = new Date(Number(coinData.timestamp)).toLocaleString(
    "ko-KR",
    { timeZone: "Asia/Seoul" }
  );
  const { currency } = useCurrency();
  const div = currency === "$" ? exchange : 1;
  const currencyData = {
    high_price: coinData.high_price / div,
    low_price: coinData.low_price / div,
    acc_trade_price_24h: coinData.acc_trade_price_24h / div,
    prev_closing_price: coinData.prev_closing_price / div,
    lowest_52_week_price: coinData.lowest_52_week_price / div,
    highest_52_week_price: coinData.highest_52_week_price / div,
  };

  return (
    <article className="h-auto w-full rounded-[10px] border border-border bg-container px-5 py-2 dark:border-border-dark dark:bg-container-dark">
      <dl className="flex flex-col">
        <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0 dark:border-border-dark">
          <dt className="text-sm text-muted dark:text-muted-dark">24시간 최고가</dt>
          <dd className="text-right text-sm tabular-nums text-ink dark:text-ink-dark">
              {currency}
              {formatCurrency(Number(currencyData.high_price), currency as "₩" | "$")}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0 dark:border-border-dark">
          <dt className="text-sm text-muted dark:text-muted-dark">24시간 최저가</dt>
          <dd className="text-right text-sm tabular-nums text-ink dark:text-ink-dark">
              {currency}
              {formatCurrency(Number(currencyData.low_price), currency as "₩" | "$")}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0 dark:border-border-dark">
          <dt className="text-sm text-muted dark:text-muted-dark">24시간 거래량</dt>
          <dd className="text-right text-sm tabular-nums text-ink dark:text-ink-dark">
              {coinData.market.split("-")[1]} {formatKRW(Number(coinData.acc_trade_volume_24h.toFixed(0)))}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0 dark:border-border-dark">
          <dt className="text-sm text-muted dark:text-muted-dark">24시간 거래대금</dt>
          <dd className="text-right text-sm tabular-nums text-ink dark:text-ink-dark">
              {currency}
              {formatCurrency(Number(currencyData.acc_trade_price_24h), currency as "₩" | "$")}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0 dark:border-border-dark">
          <dt className="text-sm text-muted dark:text-muted-dark">52주 최고가</dt>
          <dd className="text-right text-sm tabular-nums text-ink dark:text-ink-dark">
              {currency}
              {Number(currencyData.highest_52_week_price).toLocaleString()}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0 dark:border-border-dark">
          <dt className="text-sm text-muted dark:text-muted-dark">52주 최저가</dt>
          <dd className="text-right text-sm tabular-nums text-ink dark:text-ink-dark">
              {currency}
              {Number(currencyData.lowest_52_week_price).toLocaleString()}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0 dark:border-border-dark">
          <dt className="text-sm text-muted dark:text-muted-dark">전일 종가</dt>
          <dd className="text-right text-sm tabular-nums text-ink dark:text-ink-dark">
              {currency}
              {Number(currencyData.prev_closing_price).toLocaleString()}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-b border-border py-3 last:border-b-0 dark:border-border-dark">
          <dt className="text-sm text-muted dark:text-muted-dark">Last Update</dt>
          <dd className="text-right text-sm tabular-nums text-ink dark:text-ink-dark">
              {lastUpdated}
          </dd>
        </div>
      </dl>
    </article>
  );
};

export default CoinArticle;
