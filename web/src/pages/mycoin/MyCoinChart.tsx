import { useMemo } from "react";
import ApexChart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { apiFetch } from "@/lib/api";
import { useCoinStore, useCurrency, useUserStore } from "@/store/store";
import { formatCurrency } from "@/utill/utill";
import { chartTheme } from "@/lib/chartTheme";

interface IKlineChart {
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
}

export default function MyCoinChart({ exchange }: { exchange: number }) {
  const { theme, systemTheme } = useTheme();
  const { mycoin } = useUserStore().user;
  const { currency } = useCurrency();
  const { selectedCoin } = useCoinStore();
  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  const coinSymbol = mycoin[selectedCoin]?.symbol;
  const t = chartTheme(isDark);

  // 상세 차트와 같은 쿼리 키(['upbit','kline',심볼,'days'])라 캐시를 공유한다
  const kline = useQuery({
    queryKey: ["upbit", "kline", coinSymbol, "days"],
    queryFn: () =>
      apiFetch<IKlineChart[]>(`/api/upbit/kline?market=KRW-${coinSymbol}&interval=days&count=30`),
    enabled: !!coinSymbol,
    staleTime: 30_000,
  });
  const loading = kline.isPending;
  const div = currency === "$" ? exchange : 1;

  const klineData = useMemo(
    () =>
      (kline.data ?? []).flatMap((k) =>
        k.candle_date_time_kst && k.opening_price && k.high_price && k.low_price && k.trade_price
          ? [
              {
                x: new Date(k.candle_date_time_kst),
                y: [k.opening_price, k.high_price, k.low_price, k.trade_price].map((v) => v / div),
              },
            ]
          : []
      ),
    [kline.data, div]
  );

  const series = [
    {
      name: `${coinSymbol} Price`,
      data: klineData,
    },
  ];

  return (
    <>
      {loading || mycoin.length === 0 ? (
        <div className="flex h-[400px] w-full items-center justify-center text-muted dark:text-muted-dark">
          불러오는 중...
        </div>
      ) : (
        <section className="w-full flex tablet:flex-col rounded-[10px] border border-border dark:border-border-dark p-4 tablet:gap-3">
          <div className=" w-auto flex justify-end items-center h-full pt-10 tablet:pt-1">
            <div className=" flex flex-col tablet:flex-row rounded-md  w-auto  tablet:w-auto   justify-start items-center gap-2 bg-secondary dark:bg-container-dark"></div>
          </div>
          <div className="w-full h-[400px]">
            <ApexChart
              options={{
                chart: {
                  type: "candlestick",
                  ...t.chart,
                  animations: {
                    enabled: false,
                  },
                  zoom: {
                    enabled: false,
                  },
                },
                theme: t.theme,
                grid: t.grid,
                plotOptions: t.plotOptions,
                title: {
                  text: `${coinSymbol}: days Candlestick Chart`,
                  align: "center",
                  style: t.title,
                },
                xaxis: {
                  type: "datetime",
                  tickAmount: 6,
                  axisBorder: t.axis,
                  axisTicks: t.axis,
                  labels: {
                    formatter: (
                      value: string,
                      timestamp?: number,
                      opts?: any
                    ) => {
                      const date = new Date(timestamp || 0);
                      const options: Intl.DateTimeFormatOptions = {
                        month: "short",
                        day: "numeric",
                      };
                      return date.toLocaleDateString("en-US", options);
                    },
                  },
                },
                yaxis: {
                  labels: {
                    formatter: (value) =>
                      currency === "$"
                        ? `$${formatCurrency(value, "$")}`
                        : `₩${formatCurrency(value, "₩")}`,
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
                tooltip: {
                  custom: ({ seriesIndex, dataPointIndex, w }) => {
                    const seriesData =
                      w.config.series[seriesIndex].data[dataPointIndex];

                    const { y } = seriesData;

                    const open = y[0].toLocaleString();
                    const high = y[1].toLocaleString();
                    const low = y[2].toLocaleString();
                    const close = y[3].toLocaleString();

                    return `
                  <div style="
                    padding: 10px; 
                    background:${t.chart.background} ; 
                    border: 1px solid ${t.tooltipBorder}; 
                    border-radius: 6px; 
                    height: auto;
                    font-size: 12px; 
                    color:${t.title.color} ;
                  ">
                    <div><strong>Open:</strong> ${currency}${open}</div>
                    <div><strong>High:</strong> ${currency}${high}</div>
                    <div><strong>Low:</strong> ${currency}${low}</div>
                    <div><strong>Close:</strong> ${currency}${close}</div>
                  </div>
                `;
                  },
                },
              }}
              series={series}
              type="candlestick"
              height={400}
            />
          </div>
        </section>
      )}
    </>
  );
}
