import CoinListTable from "../components/CoinListTable";
import Link from "next/link";

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
      <section className="w-full h-auto px-5">
        <CoinListTable getCoinList={paginatedData} />
        <div className="w-full h-auto flex justify-center items-center gap-5 mt-5">
          {totalPages >= 6 && <>...</>}
          {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => {
            const pageStart = Math.max(1, page - 3); // 현재 페이지 기준 시작 범위
            const pageEnd = Math.min(totalPages, pageStart + 5); // 범위 끝 계산

            const pageNum = pageStart + i; // 동적으로 페이지 번호 계산
            if (pageNum > totalPages) return null; // 범위 초과 시 생략

            return (
              <Link key={pageNum} href={`/coinlist/${pageNum}`}>
                <button
                  className={`px-4 py-2 ${
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
          .....
        </div>
      </section>
    </section>
  );
};

export default CoinList;
