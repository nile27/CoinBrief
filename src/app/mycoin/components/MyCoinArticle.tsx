"use client";
import { useCoinStore, useUserStore } from "@/store/store";
import { formatKRW } from "@/utill/utill";

const MyCoinArticle = () => {
  const user = useUserStore((state) => state.user);
  const { staticData, selectedCoin } = useCoinStore();

  if (user.mycoin.length === 0) {
    return (
      <span className="text-smallHeader font-bold">코인을 등록해주세요.</span>
    );
  }

  const coinSymbol = user.mycoin[selectedCoin]?.symbol;

  if (!coinSymbol || !staticData[coinSymbol]) {
    return (
      <div className="flex justify-center items-center w-full h-[150px]">
        <p className="text-gray-500">📡 데이터 로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 tablet:flex-col tablet:gap-2">
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
          className="flex-1  bg-container dark:bg-container-dark p-4 rounded shadow-lg flex flex-col items-center justify-center tablet:flex-row tablet:justify-between tablet:items-center"
        >
          <p className="font-bold tablet:w-1/2 tablet:text-left text-[14px]">
            {item.title}
          </p>
          <p className="text-lg tablet:w-1/2 tablet:text-right text-[14px]">
            {formatKRW(item.value)} {item.currency}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyCoinArticle;
