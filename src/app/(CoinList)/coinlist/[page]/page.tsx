import CurrencyCalc from "../components/CurrencyCalc";
import TopVolume from "../components/TopVolume";
import CoinListTable from "../components/CoinListTable";
import SearchCoin from "../components/SearchCoin";
import TopLosers from "../components/TopLosers";
import { sessionCheck } from "@/lib/auth";

import Link from "next/link";
import notFound from "../../../not-found";
import { ProcessedCoin } from "@/type/type";

const CoinList = async ({ params }: { params: Promise<{ page: string }> }) => {
  const { page: pageParam } = await params;
  const page = Number(pageParam);
  const itemsPerPage = 50;
  const session = await sessionCheck();

  const upbitCoins = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/upbit/coins`,
    {
      method: "GET",
    }
  );
  const allCoins: ProcessedCoin[] = await upbitCoins.json();

  const totalPages = Math.ceil(allCoins.length / itemsPerPage);
  const sortedCoins: ProcessedCoin[] = allCoins
    .filter((coin) => coin && coin.symbol)
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  const paginatedCoins = sortedCoins.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (!session) {
    return notFound();
  }

  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-4 py-8 tablet:px-4">
      <h1 className="font-serif text-[32px] font-semibold text-ink dark:text-ink-dark mobile:text-[26px]">
        코인리스트
      </h1>
      <section className="grid grid-cols-3 items-stretch gap-4 tablet:grid-cols-1">
        <TopVolume coins={allCoins} />
        <TopLosers coins={allCoins} />
        <CurrencyCalc />
      </section>
      <SearchCoin allCoins={allCoins} />
      <CoinListTable getCoinList={paginatedCoins} />

      <nav
        aria-label="페이지"
        className="flex flex-wrap justify-center gap-2"
      >
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageIndex = index + 1;
          return (
            <Link
              key={pageIndex}
              href={`/coinlist/${pageIndex}`}
              className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm tabular-nums transition-colors ${
                pageIndex === page
                  ? "bg-btn text-btn-ink dark:bg-btn-dark dark:text-btn-ink-dark border-transparent"
                  : "bg-container dark:bg-container-dark border-border dark:border-border-dark hover:bg-hover dark:hover:bg-hover-dark"
              }`}
            >
              {pageIndex}
            </Link>
          );
        })}
      </nav>
    </section>
  );
};

export default CoinList;
