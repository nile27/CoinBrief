import HeaderCoinBox from "./components/HeaderCoinBox";
import DetailCoin from "./components/DetailCoin";
import MycoinLoading from "./components/MycoinLoading";
import { sessionCheck } from "@/lib/auth";
import notFound from "@/app/not-found";
import ExchangeSync from "@/components/ExchangeSync";
import { getUsdKrw } from "@/lib/exchangeRate";

const Mycoin = async () => {
  const [session, usd] = await Promise.all([sessionCheck(), getUsdKrw()]);

  if (!session) {
    return notFound();
  }

  return (
    <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8">
      <ExchangeSync rate={usd?.rate ?? null} />
      <HeaderCoinBox />
      <main className="grid grid-cols-[minmax(0,340px)_minmax(0,1fr)] items-start gap-6 tablet:grid-cols-1">
        <DetailCoin />
        <MycoinLoading />
      </main>
    </section>
  );
};

export default Mycoin;
