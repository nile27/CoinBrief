import CurrencyCalc from "../components/CurrencyCalc";
import TopVolumeList from "../components/TopVolumeList";
import CoinListTable from "../components/CoinListTable";
import SearchCoin from "../components/SearchCoin";
import Link from "next/link";

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
  market_cap_rank: number;
}

const CoinList = async ({ params }: { params: { page: string } }) => {
  const page = parseInt(params.page);
  const getCoinListFetch = async () => {
    const res = await fetch(
      // "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=1h,24h,7d"
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=${page}&sparkline=false&price_change_percentage=1h,24h,7d`
    );
    const data = await res.json();

    return data;
  };

  const getVolumnListFetch = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": `${process.env.COINGAKO_API_KEY}`,
      },
    };
    const res = await fetch(
      "https://api.coingecko.com/api/v3/search/trending",
      options
    );
    const data = await res.json();

    return data.coins.slice(0, 3);
  };
  const getCoinList: CoinList[] = await getCoinListFetch();
  const topVolumeCoin: [] = await getVolumnListFetch();

  return (
    <section className=" flex flex-col w-full h-full gap-10">
      <section className=" flex justify-center items-center w-full h-auto px-5 pt-5 gap-20">
        <section className=" bg-container dark:bg-container-dark w-[350px] min-h-[280px] py-3 h-auto flex flex-col justify-center items-start gap-3 border-2 border-border dark:border-border-dark rounded-[10px]">
          <h1 className=" text-smallHeader font-extrabold px-5">
            🔥 트렌드 TOP 3
          </h1>

          <div className=" w-full h-auto flex flex-col gap-3">
            {topVolumeCoin.map((item: any, key: number) => (
              <TopVolumeList
                key={item.item.id}
                num={key + 1}
                item={item.item}
              />
            ))}
          </div>
        </section>

        <CurrencyCalc />
      </section>
      <section className=" w-full h-auto px-5">
        <SearchCoin coinList={getCoinList} />
        <CoinListTable getCoinList={getCoinList} />
        <div className="w-full h-auto flex justify-center items-center gap-5 mt-5">
          {page != 1 ? (
            <Link href={`/coinlist/${page - 1}`}>
              <button>이전 페이지</button>
            </Link>
          ) : null}
          <div> {page}</div>

          <Link href={`/coinlist/${page + 1}`}>
            <button>다음 페이지</button>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default CoinList;
