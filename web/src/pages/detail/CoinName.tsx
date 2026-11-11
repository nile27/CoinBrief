
import { useCurrency } from "@/store/store";
import { formatCurrency } from "@/utill/utill";
import GreenArrow from "@/../public/GreenArrow.svg?react";
import RedArrow from "@/../public/RedArrow.svg?react";
import CoinImg from "@/components/CustomUI/CoinImg";
import BtnStyle from "@/components/CustomUI/BtnStyle";

interface Prop {
  price: {
    price: number;
    rate: number;
    prev_24H_price: number;
    prev_24H_rate: number;
  };
  change: string;
  id: string;
  name: string;
  exchange: number;
}

const CoinName = ({ price, id, name, change, exchange }: Prop) => {
  const { krw, usd, currency } = useCurrency();
  // 통화가 $ 이면 금액만 환율로 나눈다 (등락률은 그대로)
  const div = currency === "$" ? exchange : 1;
  const currencyData = {
    price: price.price / div,
    rate: price.rate,
    prev_24H_rate: price.prev_24H_rate,
    prev_24H_price: price.prev_24H_price / div,
  };

  const handleExchange = () => (currency === "$" ? krw() : usd());
  const dir = change === "FALL" ? -1 : change === "RISE" ? 1 : 0;
  const prevPrice = Number(currencyData.prev_24H_price);
  const prevRate = currencyData.prev_24H_rate * 100;
  const dirClass = (v: number) =>
    v < 0 ? "text-down" : v > 0 ? "text-up" : "text-muted dark:text-muted-dark";
  const Arrow = ({ v }: { v: number }) =>
    v < 0 ? (
      <RedArrow className={dirClass(v)} />
    ) : v > 0 ? (
      <GreenArrow className={dirClass(v)} />
    ) : null;
  return (
    <article className="flex w-full flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <CoinImg symbol={id} name={name} />
          <h1 className="truncate font-serif text-[28px] font-semibold text-ink dark:text-ink-dark mobile:text-[22px]">
            {name}
          </h1>
          <span className="text-sm text-muted dark:text-muted-dark">{id}</span>
        </div>
        <BtnStyle size="change" color="focus" onClick={handleExchange}>
          통화 변경({currency})
        </BtnStyle>
      </div>

      <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
        <div className="text-[32px] font-semibold tabular-nums text-ink dark:text-ink-dark mobile:text-[26px]">
          {currency}
          {Number(currencyData.price).toLocaleString()}
        </div>
        <div className={`flex items-center gap-2 pb-1 tabular-nums ${dirClass(dir)}`}>
          <Arrow v={dir} />
          <span>
            {dir < 0 ? "-" : dir > 0 ? "+" : ""}
            {(currencyData.rate * 100).toFixed(2)}%
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 mobile:grid-cols-1">
        <div className="rounded-md border border-border px-4 py-3 dark:border-border-dark">
          <dt className="text-xs text-muted dark:text-muted-dark">변동 금액 (어제)</dt>
          <dd className={`mt-1 flex items-center gap-2 tabular-nums ${dirClass(prevPrice)}`}>
            <Arrow v={prevPrice} />
            {formatCurrency(prevPrice, currency as "₩" | "$")}
            {currency}
          </dd>
        </div>
        <div className="rounded-md border border-border px-4 py-3 dark:border-border-dark">
          <dt className="text-xs text-muted dark:text-muted-dark">변동률 (어제)</dt>
          <dd className={`mt-1 flex items-center gap-2 tabular-nums ${dirClass(prevRate)}`}>
            <Arrow v={prevRate} />
            {prevRate > 0 ? "+" : ""}
            {prevRate.toFixed(2)}%
          </dd>
        </div>
      </dl>
    </article>
  );
};

export default CoinName;
