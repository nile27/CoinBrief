import CurrencyCalc from "../components/CurrencyCalc";
import TopVolume from "../components/TopVolume";
import CoinListTable from "../components/CoinListTable";
import { getCoinData } from "../utill/utill";
import SearchCoin from "../components/SearchCoin";
import TopLosers from "../components/TopLosers";

import Link from "next/link";

const CoinList = async ({ params }: { params: { page: string } }) => {
  const page = Number(params.page);
  const itemsPerPage = 50;

  const upbitCoins = await fetch("http://localhost:3000/api/upbit/coins", {
    method: "GET",
  });
  const allCoins = await upbitCoins.json();

  const totalPages = Math.ceil(allCoins.length / itemsPerPage);

  const paginatedCoins = allCoins.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <section className="flex flex-col w-full h-full gap-1">
      <section className=" flex w-full px-5 justify-center gap-5 mt-7 mb-5 tablet:flex-col items-center ">
        <TopVolume coins={allCoins} />
        <TopLosers coins={allCoins} />
        <CurrencyCalc />
      </section>
      <section className="w-full h-auto px-20 flex justify-start">
        <SearchCoin allCoins={allCoins} />
      </section>
      <section className="w-full h-auto px-5 ">
        <CoinListTable getCoinList={paginatedCoins} />
      </section>

      <section className="flex justify-center gap-4 mt-5">
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageIndex = index + 1;
          return (
            <Link
              key={pageIndex}
              href={`/coinlist/${pageIndex}`}
              className={`px-4 py-2 border rounded ${
                pageIndex === page
                  ? "dark:bg-hover-dark bg-hover text-white hover:bg-hover dark:hover:bg-hover-dark "
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-hover dark:hover:bg-hover-dark"
              }`}
            >
              {pageIndex}
            </Link>
          );
        })}
      </section>
    </section>
  );
};

export default CoinList;
