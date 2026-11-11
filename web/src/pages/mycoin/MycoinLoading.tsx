import MyCoinArticle from "./MyCoinArticle";
import MyCoinChart from "./MyCoinChart";
import { useUserStore } from "@/store/store";
const MycoinLoading = ({ exchange }: { exchange: number }) => {
  const { mycoin } = useUserStore().user;
  return (
    <section className="flex min-w-0 flex-col gap-6">
      {mycoin.length === 0 ? (
        <div className="flex h-[370px] w-full items-center justify-center text-muted dark:text-muted-dark">
          코인을 등록해주세요.
        </div>
      ) : (
        <>
          <MyCoinChart exchange={exchange} />
          <MyCoinArticle />
        </>
      )}
    </section>
  );
};

export default MycoinLoading;
