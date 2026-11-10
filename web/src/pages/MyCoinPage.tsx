import HeaderCoinBox from "@/pages/mycoin/HeaderCoinBox";
import DetailCoin from "@/pages/mycoin/DetailCoin";
import MycoinLoading from "@/pages/mycoin/MycoinLoading";
import Loading from "@/components/Loading";
import { useExchange } from "@/lib/queries";

const MyCoinPage = () => {
  const exchange = useExchange();
  if (exchange.isPending) return <Loading />;
  if (exchange.isError)
    return (
      <p className="py-20 text-center text-muted dark:text-muted-dark">
        환율을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </p>
    );
  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8">
      <HeaderCoinBox />
      <main className="grid grid-cols-[minmax(0,340px)_minmax(0,1fr)] items-start gap-6 tablet:grid-cols-1">
        <DetailCoin />
        <MycoinLoading exchange={exchange.data.USD} />
      </main>
    </section>
  );
};

export default MyCoinPage;
