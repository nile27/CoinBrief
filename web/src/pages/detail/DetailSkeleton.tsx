import Skeleton from "@/components/Skeleton";

// 차트 자리: 실제 차트 섹션(border + p-4 + 400px)과 같은 높이
export const ChartSkeleton = () => (
  <section
    aria-busy="true"
    className="w-full rounded-[10px] border border-border p-4 dark:border-border-dark"
  >
    <Skeleton className="block h-[400px] w-full" />
  </section>
);

const infoBox = "rounded-md border border-border px-4 py-3 dark:border-border-dark";

const DetailSkeleton = () => (
  <section
    aria-busy="true"
    className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 py-8"
  >
    <div className="grid grid-cols-[minmax(0,1fr)_360px] items-start gap-6 tablet:grid-cols-1">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex w-full flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="w-40 text-[28px] mobile:text-[22px]" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <div className="text-[32px] mobile:text-[26px]">
            <Skeleton className="w-56" />
          </div>
          <div className="grid grid-cols-2 gap-3 mobile:grid-cols-1">
            {[0, 1].map((i) => (
              <div key={i} className={infoBox}>
                <div className="text-xs"><Skeleton className="w-24" /></div>
                <div className="mt-1"><Skeleton className="w-28" /></div>
              </div>
            ))}
          </div>
        </div>
        <ChartSkeleton />
      </div>
      <article className="w-full rounded-[10px] border border-border bg-container px-5 py-2 dark:border-border-dark dark:bg-container-dark">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-baseline justify-between gap-4 py-3 text-sm">
            <Skeleton className="w-24" />
            <Skeleton className="w-28" />
          </div>
        ))}
      </article>
    </div>
  </section>
);

export default DetailSkeleton;
