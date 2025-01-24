import CoinListTable from "../components/CoinListTable";
import Link from "next/link";
import CurrencyCalc from "../components/CurrencyCalc";

export interface CoinList {
  id: string;
  symbol: string;
  name: string;
  quotes: {
    USD: {
      price: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      market_cap: number;
      volume_24h: number;
    };
  };

  market_cap: number;
  rank: number;
}

const CoinList = async ({ params }: { params: { page: string } }) => {
  const page = parseInt(params.page);
  const itemsPerPage = 50;

  const getCoinListFetch = async () => {
    const res = await fetch("https://api.coinpaprika.com/v1/tickers");
    const data = await res.json();
    return data;
  };

  const getCoinList = await getCoinListFetch();

  const paginatedData = getCoinList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const totalPages = Math.ceil(getCoinList.length / itemsPerPage);

  return (
    <section className="flex flex-col w-full h-full gap-10">
      <section className=" flex justify-center gap-10 mt-7">
        <CurrencyCalc />
      </section>
      <section className="w-full h-auto px-5">
        <CoinListTable getCoinList={paginatedData} />
        <div className="w-full h-auto flex justify-center items-center gap-2 mt-5 border-border dark:border-border-dark">
          <Link href={`/coinlist/1`}>
            <button className="px-4 py-2 mr-7 bg-gray-200 dark:bg-gray-700 rounded-md">
              1
            </button>
          </Link>
          {page >= 5 && <>...</>}
          {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => {
            const pageStart = Math.max(1, page - 3);

            const pageNum = pageStart + i;
            if (pageNum > totalPages) return null;

            return (
              <Link key={pageNum} href={`/coinlist/${pageNum}`}>
                <button
                  className={`px-4 py-2 rounded-md ${
                    pageNum === page
                      ? "bg-primary text-white"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              </Link>
            );
          })}
          {page <= 38 && <>...</>}
          <Link href={`/coinlist/40`}>
            <button className="px-4 py-2 ml-7 bg-gray-200 dark:bg-gray-700 rounded-md">
              last page
            </button>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default CoinList;
