import CurrencyCalc from "./components/CurrencyCalc";
import TopVolumeList from "./components/TopVolumeList";
import CoinListTable from "./components/CoinListTable";

export interface CoinList {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  total_volume: number;
  market_cap: number;
}

const CoinList = async () => {
  const getCoinListFetch = async () => {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d"
    );
    const data = await res.json();
    return data;
  };
  const getCoinList: CoinList[] = await getCoinListFetch();
  const topVolumeCoin = [...getCoinList]
    .sort((a: CoinList, b: CoinList) => b.total_volume - a.total_volume)
    .slice(0, 3);

  return (
    <section className=" flex flex-col w-full h-full gap-10">
      <section className=" flex justify-center items-center w-full h-auto px-5 pt-5 gap-20">
        <section className=" bg-container dark:bg-container-dark w-[350px] min-h-[280px] py-3 h-auto flex flex-col justify-center items-start gap-3 border-2 border-border dark:border-border-dark rounded-[10px]">
          <h1 className=" text-smallHeader font-extrabold px-5">
            🔥 &nbsp;&nbsp;거래량 TOP 3
          </h1>

          <div className=" w-full h-auto flex flex-col gap-3">
            {topVolumeCoin.map((item: CoinList, key: number) => (
              <TopVolumeList key={item.id} num={key + 1} item={item} />
            ))}
          </div>
        </section>

        <CurrencyCalc />
      </section>
      <section className=" w-full h-auto px-5">
        <CoinListTable getCoinList={getCoinList} />
      </section>
    </section>
  );
};

export default CoinList;
