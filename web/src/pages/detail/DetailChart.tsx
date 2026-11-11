
import BtnStyle from "@/components/CustomUI/BtnStyle";
import { useMemo, useState } from "react";
import ApexChart from "react-apexcharts";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { useTheme } from "next-themes";
import { ChartSkeleton } from "@/pages/detail/DetailSkeleton";
import { useCurrency } from "@/store/store";
import { formatCurrency } from "@/utils/utils";
import { chartTheme } from "@/lib/chartTheme";
import type { KlineCandle } from "@/type/type";

export default function KlineChart({ symbol, exchange }: { symbol: string; exchange: number }) {
  const [changeDate, setChangeDate] = useState<"days" | "weeks" | "months">(
    "days"
  );
  const { theme, systemTheme } = useTheme();
  const { currency } = useCurrency();

  const isDark =
    theme === "dark" || (theme === "system" && systemTheme === "dark");
  const t = chartTheme(isDark);

  const kline = useQuery({
    queryKey: ["upbit", "kline", symbol, changeDate],
    queryFn: () =>
      apiFetch<KlineCandle[]>(
        `/api/upbit/kline?market=KRW-${symbol}&interval=${changeDate}&count=30`
      ),
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
      name: `${symbol} Price`,
      data: klineData,
    },
  ];

  return (
    <>
      {loading ? (
        <ChartSkeleton />
      ) : (
        <section className="w-full flex tablet:flex-col rounded-[10px] border border-border dark:border-border-dark p-4 tablet:gap-3">
          <div className=" w-auto flex justify-end items-center h-full pt-10 tablet:pt-1">
            <div className=" flex flex-col tablet:flex-row rounded-md  w-auto  tablet:w-auto   justify-start items-center gap-2 bg-secondary dark:bg-container-dark">
              <BtnStyle
                size="auto"
                color="focus"
                disabled={changeDate === "days"}
                onClick={() => setChangeDate("days")}
              >
                1일
              </BtnStyle>

              <BtnStyle
                size="auto"
                color="focus"
                disabled={changeDate === "weeks"}
                onClick={() => setChangeDate("weeks")}
              >
                7일
              </BtnStyle>
              <BtnStyle
                size="auto"
                color="focus"
                disabled={changeDate === "months"}
                onClick={() => setChangeDate("months")}
              >
                1달
              </BtnStyle>
            </div>
          </div>
          <div className="w-full h-auto">
            <ApexChart
              options={{
                chart: {
                  type: "candlestick",
                  ...t.chart,
                  zoom: {
                    enabled: false,
                  },
                },
                theme: t.theme,
                grid: t.grid,
                plotOptions: t.plotOptions,
                title: {
                  text: `${symbol}: ${changeDate} Candlestick Chart`,
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

                    const open = formatCurrency(y[0], currency as "$" | "₩");
                    const high = formatCurrency(y[1], currency as "$" | "₩");
                    const low = formatCurrency(y[2], currency as "$" | "₩");
                    const close = formatCurrency(y[3], currency as "$" | "₩");

                    return `
                  <div style="
                    padding: 10px; 
                    background:${t.chart.background} ; 
                    border: 1px solid ${t.tooltipBorder}; 
                    border-radius: 6px; 
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
