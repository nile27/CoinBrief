"use client";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useCoinStore, useCurrency, useUserStore } from "@/store/store";
import { formatCurrency } from "@/utill/utill";

const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface IKlineChart {
  candle_date_time_kst: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
}

export default function MyCoinChart() {
  const [klineData, setKlineData] = useState<any[]>([]);
  const [originalData, setOriginalData] = useState<IKlineChart[]>([]);
  const [changeDate, setChangeDate] = useState<"minutes/1" | "days">(
    "minutes/1"
  );
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const { mycoin } = useUserStore().user;
  const { currency } = useCurrency();
  const { exchange, selectedCoin } = useCoinStore();
  const isDark = theme === "dark";

  const coinSymbol = mycoin[selectedCoin]?.symbol;

  useEffect(() => {
    if (!coinSymbol) return;
    const fetchKlines = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/upbit/kline?market=KRW-${coinSymbol}&interval=${changeDate}&count=30`
        );
        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("유효하지 않은 데이터입니다.");
        }

        setOriginalData(data);
      } catch (error) {
        console.error("데이터를 불러오는데 실패하였습니다.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKlines();
  }, [selectedCoin, changeDate, coinSymbol]);

  useEffect(() => {
    if (originalData.length === 0) return;

    const formattedData = originalData
      .map((kline: IKlineChart) => {
        if (
          !kline.candle_date_time_kst ||
          !kline.opening_price ||
          !kline.high_price ||
          !kline.low_price ||
          !kline.trade_price
        ) {
          console.warn("유효하지 않는 데이터 입니다.", kline);
          return null;
        }
        return {
          x: new Date(kline.candle_date_time_kst),
          y:
            currency === "$"
              ? [
                  kline.opening_price / exchange,
                  kline.high_price / exchange,
                  kline.low_price / exchange,
                  kline.trade_price / exchange,
                ]
              : [
                  kline.opening_price,
                  kline.high_price,
                  kline.low_price,
                  kline.trade_price,
                ],
        };
      })
      .filter(Boolean);

    setKlineData(formattedData);
  }, [currency, exchange, originalData]);

  const series = [
    {
      name: `${coinSymbol} Price`,
      data: klineData,
    },
  ];

  return (
    <>
      {loading || mycoin.length === 0 ? (
        <div className="w-full h-[400px] flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <section className="w-full flex tablet:flex-col border-t-2 border-border dark:border-border-dark pt-4 tablet:gap-3">
          <div className=" w-auto flex justify-end items-center h-full pt-10 tablet:pt-1">
            <div className=" flex flex-col tablet:flex-row rounded-md  w-auto  tablet:w-auto   justify-start items-center gap-2 bg-[#f1f5f9] dark:bg-container-dark">
              <BtnStyle
                size="auto"
                color="focus"
                disabled={changeDate === "minutes/1"}
                onClick={() => setChangeDate("minutes/1")}
              >
                1M
              </BtnStyle>
              <BtnStyle
                size="auto"
                color="focus"
                disabled={changeDate === "days"}
                onClick={() => setChangeDate("days")}
              >
                1D
              </BtnStyle>
            </div>
          </div>
          <div className="w-full h-[400px]">
            <ApexChart
              options={{
                chart: {
                  type: "candlestick",
                  background: isDark ? "#181820" : "#F8F9FA",
                  zoom: {
                    enabled: false,
                  },
                },
                theme: {
                  mode: isDark ? "dark" : "light",
                },
                title: {
                  text: `${coinSymbol}: ${changeDate} Candlestick Chart`,
                  align: "center",
                },
                xaxis: {
                  type: "datetime",
                  tickAmount: 6,
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
                    background:${theme === "dark" ? "#181820" : "#F8F9FA"} ; 
                    border: 1px solid #ccc; 
                    border-radius: 8px; 
                    height: 400px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    font-size: 12px; 
                    color:${theme === "dark" ? "#F8F9FA" : "#181820"} ;
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
