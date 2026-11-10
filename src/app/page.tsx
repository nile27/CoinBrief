import LoginMain from "@/components/Main/LoginMain";
import { getPopularCoins } from "@/lib/popularCoins";
import { getUsdKrw } from "@/lib/exchangeRate";

// 60초마다 재생성(ISR). 요청별 동적 렌더링을 쓰지 않는다.
export const revalidate = 60;

export default async function Home() {
  const [{ coins, fetchedAt }, usd] = await Promise.all([
    getPopularCoins(4),
    getUsdKrw(),
  ]);
  return (
    <main className="w-full">
      <LoginMain coins={coins} fetchedAt={fetchedAt} usd={usd} />
    </main>
  );
}
