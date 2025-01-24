"use client";

import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import BtnStyle from "@/components/CustomUI/BtnStyle";
import { useCoinStore, useCurrency, useUserStore } from "@/store/store";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

interface ChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
  fill: boolean;
  tension: number;
  pointRadius: number;
  pointHoverRadius: number;
}

interface ChartDataType {
  labels: string[];
  datasets: ChartDataset[];
}

export default function DetailChart() {
  const { selectedCoin } = useCoinStore();
  const { mycoin } = useUserStore.getState().user;
  const [coinSymbol, setCoinSymbol] = useState("");
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [changeDate, setChangeDate] = useState<"1d" | "1w" | "1M">("1d");
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const { currency } = useCurrency();

  if (mycoin.length === 0) {
    return (
      <section className=" w-[800px] h-[300px] rounded-[12px] flex flex-col gap-4 justify-center items-center py-6 px-4 border-[1px] border-border dark:border-border-dark">
        <div className="w-full h-auto mb-2 flex justify-between px-2">
          <div className="w-[250px] rounded-md h-auto py-1 flex justify-center items-center gap-2 bg-[#f1f5f9] dark:bg-container-dark">
            <BtnStyle size="auto" children={"Price"} color="focus" disabled />
            <BtnStyle size="auto" children={"Volume"} color="focus" disabled />
          </div>
          <div className="w-[250px] rounded-md h-auto py-1 flex justify-center items-center gap-2 bg-[#f1f5f9] dark:bg-container-dark">
            <BtnStyle size="auto" children={"24시간"} color="focus" disabled />
            <BtnStyle size="auto" children={"7일"} color="focus" disabled />
            <BtnStyle size="auto" children={"1개월"} color="focus" disabled />
          </div>
        </div>
        <div className="w-full h-full flex justify-center items-center  text-smallHeader font-bold">
          코인을 등록해주세요.
        </div>
      </section>
    );
  }

  useEffect(() => {
    const mySymbol = mycoin[selectedCoin]?.symbol || "";
    setCoinSymbol(mySymbol);
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const symbol =
          mySymbol.toUpperCase() + (currency === "$" ? "USDT" : "BUSD");

        const res = await fetch(
          `/api/klines?symbol=${symbol}&interval=${changeDate}&limit=100`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch chart data.");
        }

        const data = await res.json();

        const labels = data.map((item: any) =>
          new Date(item[0]).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );

        const prices = data.map((item: any) => parseFloat(item[4]));
        const volumes = data.map((item: any) => parseFloat(item[5]));

        setChartData({
          labels,
          datasets: [
            {
              label: showVolume
                ? `${mySymbol} Volume (${currency})`
                : `${mySymbol} Price (${currency})`,
              data: showVolume ? volumes : prices,
              borderColor: showVolume
                ? "rgba(255, 99, 132, 1)"
                : "rgba(75, 192, 192, 1)",
              backgroundColor: showVolume
                ? "rgba(255, 99, 132, 0.2)"
                : "rgba(75, 192, 192, 0.2)",
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 0,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setError("Failed to load chart data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (mySymbol) fetchChartData();
  }, [currency, changeDate, showVolume, selectedCoin]);

  if (error)
    return (
      <div className="max-w-[800px] w-full h-[full] flex justify-center items-center text-red-500">
        {error}
      </div>
    );

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const value = context.raw as number;
            return showVolume
              ? `${value.toLocaleString()} units`
              : `${currency}${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: function (value) {
            return showVolume
              ? `${value.toLocaleString()}`
              : `${currency}${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <article className="w-full max-w-[900px] h-auto flex flex-col justify-center items-center">
      <div className="w-full h-auto mb-2 flex justify-between px-2">
        <div className="w-[250px] rounded-md h-auto py-1 flex justify-center items-center gap-2 bg-[#f1f5f9] dark:bg-container-dark">
          <BtnStyle
            size="auto"
            children={"Price"}
            color="focus"
            disabled={!showVolume}
            onClick={() => setShowVolume(false)}
          />
          <BtnStyle
            size="auto"
            children={"Volume"}
            color="focus"
            disabled={showVolume}
            onClick={() => setShowVolume(true)}
          />
        </div>
        <div className="w-[250px] rounded-md h-auto py-1 flex justify-center items-center gap-2 bg-[#f1f5f9] dark:bg-container-dark">
          <BtnStyle
            size="auto"
            children={"24시간"}
            color="focus"
            disabled={changeDate === "1d"}
            onClick={() => setChangeDate("1d")}
          />
          <BtnStyle
            size="auto"
            children={"7일"}
            color="focus"
            disabled={changeDate === "1w"}
            onClick={() => setChangeDate("1w")}
          />
          <BtnStyle
            size="auto"
            children={"1개월"}
            color="focus"
            disabled={changeDate === "1M"}
            onClick={() => setChangeDate("1M")}
          />
        </div>
      </div>
      <div className="w-full min-h-[400px] ">
        {chartData && (
          <Line
            data={chartData}
            options={options}
            plugins={[
              {
                id: "verticalLine",
                afterDraw: (chart) => {
                  if (
                    Array.isArray(chart.tooltip?.active) &&
                    chart.tooltip?.active?.length
                  ) {
                    const ctx = chart.ctx;
                    const activePoint = chart.tooltip.active[0];
                    const x = activePoint.element.x;
                    const topY = chart.scales.y.top;
                    const bottomY = chart.scales.y.bottom;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, topY);
                    ctx.lineTo(x, bottomY);
                    ctx.lineWidth = 1.5;
                    ctx.strokeStyle = "#8E7CC3";
                    ctx.stroke();
                    ctx.restore();
                  }
                },
              },
            ]}
          />
        )}
      </div>
    </article>
  );
}
