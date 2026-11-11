import Skeleton from "@/components/Skeleton";

const card = "rounded-[10px] border border-border bg-container p-5 dark:border-border-dark dark:bg-container-dark";

const TopCardSkeleton = () => (
  <section className={card}>
    <h2 className="mb-4 text-[15px] font-semibold">
      <Skeleton className="w-44" />
    </h2>
    <ul className="flex w-full flex-col gap-3">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex h-9 w-full items-center gap-4">
          <Skeleton className="w-4 text-sm" />
          <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Skeleton className="w-24 text-sm" />
            <Skeleton className="w-10 text-xs" />
          </div>
          <Skeleton className="w-16 text-sm" />
        </li>
      ))}
    </ul>
  </section>
);

// 환율 계산기 카드 자리 (입력 두 개)
export const CalcSkeleton = () => (
  <section className={`flex flex-col gap-4 tablet:hidden ${card}`}>
    <h2 className="text-[15px] font-semibold">
      <Skeleton className="w-24" />
    </h2>
    <Skeleton className="block h-10 w-full" />
    <Skeleton className="block h-10 w-full" />
  </section>
);

const CoinListSkeleton = () => (
  <div aria-busy="true" className="flex flex-col gap-8">
    <section className="grid grid-cols-3 items-stretch gap-4 tablet:grid-cols-1">
      <TopCardSkeleton />
      <TopCardSkeleton />
      <CalcSkeleton />
    </section>
    <Skeleton className="block h-10 w-[320px] max-w-full mobile:w-full" />
    <div className="w-full">
      <div className="border-b border-border px-3 py-3 text-xs dark:border-border-dark">
        <Skeleton className="w-12" />
      </div>
      <ul className="divide-y divide-border dark:divide-border-dark">
        {Array.from({ length: 10 }).map((_, i) => (
          <li key={i} className="flex min-h-[64px] items-center gap-3 px-3 py-2">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <Skeleton className="w-28" />
              <Skeleton className="w-10 text-xs" />
            </div>
            <Skeleton className="w-24" />
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default CoinListSkeleton;
