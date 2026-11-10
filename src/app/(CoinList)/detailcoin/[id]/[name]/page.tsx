import CoinArticle from "../../components/CoinArticle";
import DetailChart from "../../components/DetailChart";
import CoinName from "../../components/CoinName";
import { TickerData } from "@/type/type";
import { sessionCheck } from "@/lib/auth";
import notFound from "@/app/not-found";
import ExchangeSync from "@/components/ExchangeSync";
import { getUsdKrw } from "@/lib/exchangeRate";
async function DetailCoin(props: {
  params: Promise<{ id: string; name: string }>;
}) {
  const { id, name } = await props.params;

  const coinDataResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/upbit/detailcoin?id=${id}`
  );
  const coinDataJson: TickerData[] = await coinDataResponse.json();
  const [session, usd] = await Promise.all([sessionCheck(), getUsdKrw()]);
  if (!session) {
    return notFound();
  }
  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8">
      <ExchangeSync rate={usd?.rate ?? null} />
      <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6 tablet:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-6">
          <CoinName
            price={{
              price: coinDataJson[0].trade_price,

              rate: coinDataJson[0].change_rate,
              prev_24H_price: coinDataJson[0].signed_change_price,
              prev_24H_rate: coinDataJson[0].signed_change_rate,
            }}
            change={coinDataJson[0].change}
            name={decodeURIComponent(name)}
            id={id}
          />
          <DetailChart symbol={id} />
        </div>
        <CoinArticle coinData={coinDataJson[0]} />
      </div>
    </section>
  );
}

export default DetailCoin;
