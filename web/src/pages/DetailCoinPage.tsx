import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import CoinArticle from "@/pages/detail/CoinArticle";
import DetailChart from "@/pages/detail/DetailChart";
import CoinName from "@/pages/detail/CoinName";
import Loading from "@/components/Loading";
import { apiFetch } from "@/lib/api";
import { useExchange } from "@/lib/queries";
import type { TickerData } from "@/type/type";

const DetailCoinPage = () => {
  const { id = "", name = "" } = useParams();
  const ticker = useQuery({
    queryKey: ["upbit", "detailcoin", id],
    queryFn: () => apiFetch<TickerData[]>(`/api/upbit/detailcoin?id=${id}`),
    staleTime: 30_000,
  });
  const exchange = useExchange();

  if (ticker.isPending || exchange.isPending) return <Loading />;
  const coin = ticker.data?.[0];
  if (!coin || exchange.isError)
    return (
      <p className="py-20 text-center text-muted dark:text-muted-dark">
        코인 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </p>
    );
  const rate = exchange.data.USD;

  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8">
      <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6 tablet:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-6">
          <CoinName
            price={{
              price: coin.trade_price,
              rate: coin.change_rate,
              prev_24H_price: coin.signed_change_price,
              prev_24H_rate: coin.signed_change_rate,
            }}
            change={coin.change}
            name={decodeURIComponent(name)}
            id={id}
            exchange={rate}
          />
          <DetailChart symbol={id} exchange={rate} />
        </div>
        <CoinArticle coinData={coin} exchange={rate} />
      </div>
    </section>
  );
};

export default DetailCoinPage;
