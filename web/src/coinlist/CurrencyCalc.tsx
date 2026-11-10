import React, { useState, ChangeEvent } from "react";

const CurrencyCalc = ({ rate }: { rate: number }) => {
  const exchange = rate;
  const [usdValue, setUsdValue] = useState<string>("1");
  const [krwValue, setKrwValue] = useState<string>(exchange.toLocaleString());

  const handleUsdChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(rawValue))) {
      const format = Number(rawValue).toLocaleString();
      setUsdValue(format);
      const exchangeValue = (Number(rawValue) * exchange).toLocaleString();
      setKrwValue(exchangeValue);
    } else {
      setUsdValue("");
      setKrwValue("");
    }
  };

  const handleKRWChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(Number(rawValue))) {
      const format = Number(rawValue).toLocaleString();
      setKrwValue(format);
      const exchangeValue = (Number(rawValue) / exchange).toLocaleString();
      setUsdValue(exchangeValue);
    } else {
      setUsdValue("");
      setKrwValue("");
    }
  };

  return (
    <section className="flex flex-col gap-4 rounded-[10px] border border-border bg-container p-5 tablet:hidden dark:border-border-dark dark:bg-container-dark">
      <h2 className="text-[15px] font-semibold text-ink dark:text-ink-dark">
        환율 계산기
      </h2>
      <div className="flex flex-col gap-3">
        <label className="flex w-full flex-col gap-1.5">
          <span className="text-xs font-medium text-muted dark:text-muted-dark">USD</span>
          <div className="flex h-10 w-full items-center rounded-md border border-border bg-background px-3 focus-within:border-ink dark:border-border-dark dark:bg-background-dark dark:focus-within:border-ink-dark">
            <span className="mr-2 text-sm text-muted dark:text-muted-dark">$</span>
            <input
              type="text"
              autoComplete="off"
              inputMode="decimal"
              className="w-full min-w-0 bg-transparent text-sm tabular-nums outline-none"
              value={usdValue}
              onChange={handleUsdChange}
            />
          </div>
        </label>
        <label className="flex w-full flex-col gap-1.5">
          <span className="text-xs font-medium text-muted dark:text-muted-dark">KRW</span>
          <div className="flex h-10 w-full items-center rounded-md border border-border bg-background px-3 focus-within:border-ink dark:border-border-dark dark:bg-background-dark dark:focus-within:border-ink-dark">
            <span className="mr-2 text-sm text-muted dark:text-muted-dark">₩</span>
            <input
              type="text"
              autoComplete="off"
              inputMode="decimal"
              className="w-full min-w-0 bg-transparent text-sm tabular-nums outline-none"
              value={krwValue}
              onChange={handleKRWChange}
            />
          </div>
        </label>
      </div>
    </section>
  );
};

export default CurrencyCalc;
