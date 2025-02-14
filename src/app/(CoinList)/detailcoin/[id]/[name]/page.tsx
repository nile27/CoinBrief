import CoinArticle from "../../components/CoinArticle";
import DetailChart from "../../components/DetailChart";
import CoinName from "../../components/CoinName";
import { TickerData } from "@/type/type";
import { sessionCheck } from "@/lib/auth";
import notFound from "@/app/not-found";
async function DetailCoin({
  params,
}: {
  params: { id: string; name: string };
}) {
  const { id, name } = params;

  const coinDataResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/upbit/detailcoin?id=${id}`
  );
  const coinDataJson: TickerData[] = await coinDataResponse.json();
  const session = await sessionCheck();
  if (!session) {
    return notFound();
  }
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
