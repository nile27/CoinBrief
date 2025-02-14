import HeaderCoinBox from "./components/HeaderCoinBox";
import DetailCoin from "./components/DetailCoin";
import MycoinLoading from "./components/MycoinLoading";
import { sessionCheck } from "@/lib/auth";
import notFound from "@/app/not-found";

const Mycoin = async () => {
  const session = await sessionCheck();

  if (!session) {
    return notFound();
  }

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
