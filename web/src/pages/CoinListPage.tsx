import { Link, useParams } from "react-router";
import CurrencyCalc from "@/coinlist/CurrencyCalc";
import TopVolume from "@/coinlist/TopVolume";
import CoinListTable from "@/coinlist/CoinListTable";
import SearchCoin from "@/coinlist/SearchCoin";
import TopLosers from "@/coinlist/TopLosers";
import CoinListSkeleton, { CalcSkeleton } from "@/coinlist/CoinListSkeleton";
import { useExchange, useUpbitCoins } from "@/lib/queries";

const ITEMS_PER_PAGE = 50;

const CoinListPage = () => {
  const page = Number(useParams().page) || 1;
  const coins = useUpbitCoins();
  const exchange = useExchange();
  const allCoins = coins.data ?? [];

  const totalPages = Math.ceil(allCoins.length / ITEMS_PER_PAGE);
  const paginated = allCoins
    .filter((c) => c && c.symbol)
    .sort((a, b) => a.symbol.localeCompare(b.symbol))
    .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <section className="mx-auto flex w-full max-w-[1100px] flex-col gap-8 px-4 py-8 tablet:px-4">
      <h1 className="font-serif text-[32px] font-semibold text-ink dark:text-ink-dark mobile:text-[26px]">
        코인리스트
      </h1>
      {coins.isError ? (
        <p className="py-20 text-center text-muted dark:text-muted-dark">
          코인 목록을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
        </p>
      ) : coins.isPending ? (
        <CoinListSkeleton />
      ) : (
        <>
          <section className="grid grid-cols-3 items-stretch gap-4 tablet:grid-cols-1">
            <TopVolume coins={allCoins} />
            <TopLosers coins={allCoins} />
            {exchange.isPending ? (
              <CalcSkeleton />
            ) : exchange.isError ? (
              <p className="text-sm text-muted tablet:hidden dark:text-muted-dark">
                환율을 불러오지 못했습니다.
              </p>
            ) : (
              <CurrencyCalc rate={exchange.data.USD} />
            )}
          </section>
          <SearchCoin allCoins={allCoins} />
          <CoinListTable getCoinList={paginated} />
          <nav aria-label="페이지" className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageIndex = index + 1;
              return (
                <Link
                  key={pageIndex}
                  to={`/coinlist/${pageIndex}`}
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
        </>
      )}
    </section>
  );
};

export default CoinListPage;
