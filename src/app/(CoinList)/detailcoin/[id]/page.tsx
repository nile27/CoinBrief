import CoinArticle from "../components/CoinArticle";
import DetailChart from "../components/DetailChart";
import DetailNews from "../components/DetailNews";
import DetailNewsList from "../components/DetailNewsList";
async function DetailCoin({ params }: { params: { id: string } }) {
  const coinSymbol: string = params.id;

  const coinData = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinSymbol}`
  );
  const jsonData = await coinData.json();

  return (
    <section className=" w-full h-full flex flex-col p-10 gap-10">
      <section className="w-full h-auto gap-10 flex justify-between px-8 py-5 border-border dark:border-border-dark border rounded-lg">
        <CoinArticle coinData={jsonData} />

        <DetailChart
          coinName={
            jsonData.localization.ko.length !== 0
              ? jsonData.localization.ko
              : jsonData.localization.en
          }
        />
      </section>
      <DetailNewsList />
    </section>
  );
}

export default DetailCoin;
