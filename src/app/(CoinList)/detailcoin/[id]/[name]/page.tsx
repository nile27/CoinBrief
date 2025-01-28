import CoinArticle from "../../components/CoinArticle";
import DetailChart from "../../components/DetailChart";
import CoinName from "../../components/CoinName";

export interface DetailCoinData {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: string;
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

async function DetailCoin({
  params,
}: {
  params: { id: string; name: string };
}) {
  const { id, name } = params;

  const coinDataResponse = await fetch(
    `https://api.bithumb.com/v1/ticker?markets=KRW-${id.toUpperCase()}`,
    { headers: { "Cache-Control": "no-cache" } }
  );
  const coinDataJson: DetailCoinData[] = await coinDataResponse.json();

  return (
    <section className=" w-full h-auto flex flex-col p-10 gap-10">
      <div className="w-full  gap-5 flex tablet:flex-col   justify-center items-start px-8 py-5  rounded-lg">
        <div className="w-full flex flex-col">
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
