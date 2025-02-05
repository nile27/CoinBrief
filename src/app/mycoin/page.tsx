import HeaderCoinBox from "./components/HeaderCoinBox";
import DetailCoin from "./components/DetailCoin";
import MyCoinChart from "./components/MyCoinChart";
import MyCoinArticle from "./components/MyCoinArticle";
import MycoinLoading from "./components/MycoinLoading";

const Mycoin = () => {
  return (
    <section className="w-[100vw] h-auto p-4 flex flex-col justify-center items-center gap-10 ">
      <HeaderCoinBox />
      <main className="flex gap-6 tablet:flex-col w-full px-6">
        <DetailCoin />
        <MycoinLoading />
      </main>
    </section>
  );
};

export default Mycoin;
