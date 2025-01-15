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
import { useCurrency } from "@/store/store";

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

export default function DetailChart({ coinName }: { coinName: string }) {
  const [chartData, setChartData] = useState<ChartDataType | null>(null);
  const [changeData, setChangeData] = useState<boolean>(false);
  const [changeDate, setChangeDate] = useState<"1" | "7" | "31">("1");

  const { currency } = useCurrency();

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=${
            currency === "$" ? "usd" : "krw"
          }&days=${changeDate}`
        );
        const data = await res.json();

        const labels = data.prices.map((item: [number, number]) =>
          new Date(item[0]).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );
        const totalVolumnlabels = data.total_volumes.map(
          (item: [number, number]) =>
            new Date(item[0]).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
        );

        const prices = data.prices.map((item: [number, number]) => item[1]);
        const totalVolumes = data.total_volumes.map(
          (item: [number, number]) => item[1]
        );

        setChartData({
          labels: changeData ? totalVolumnlabels : labels,
          datasets: [
            {
              label: `${coinName} (${currency})`,
              data: changeData ? totalVolumes : prices,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              fill: true,
              tension: 0.3,
              pointRadius: 0,
              pointHoverRadius: 0,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchChartData();
  }, [currency, changeData, changeDate]);

  if (!chartData)
    return (
      <div className="w-full h-[full] flex justify-center items-center">
        Loading chart...
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
            const localeValue =
              currency === "$"
                ? `Price: ${value.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}`
                : `Price: ${value.toLocaleString("ko", {
                    style: "currency",
                    currency: "KRW",
                  })}`;
            return localeValue;
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
            return `${currency}${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <article className="w-full max-w-[800px] h-auto flex flex-col justify-center items-center ">
      <div className="w-full h-auto mb-2 flex justify-between px-2">
        <div className="w-[200px] rounded-md h-auto flex justify-center items-center gap-2 bg-[#f1f5f9] dark:bg-container-dark">
          <BtnStyle
            size="auto"
            children={"시세"}
            color="focus"
            onClick={() => setChangeData(false)}
            disabled={!changeData}
          />
          <BtnStyle
            size="auto"
            color="focus"
            children={"시가 총액"}
            onClick={() => setChangeData(true)}
            disabled={changeData}
          />
        </div>
        <div className="w-[250px] rounded-md h-auto py-1 flex justify-center items-center gap-2 bg-[#f1f5f9] dark:bg-container-dark">
          <BtnStyle
            size="auto"
            children={"24시간"}
            color="focus"
            disabled={changeDate === "1"}
            onClick={() => setChangeDate("1")}
          />
          <BtnStyle
            size="auto"
            children={"7일"}
            color="focus"
            disabled={changeDate === "7"}
            onClick={() => setChangeDate("7")}
          />
          <BtnStyle
            size="auto"
            children={"1개월"}
            color="focus"
            disabled={changeDate === "31"}
            onClick={() => setChangeDate("31")}
          />
        </div>
      </div>
      <div className="">
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

        <style jsx>{`
          div {
            width: 100%;
            min-width: 350px;
            min-height: 300px;
            max-width: 800px;
            height: 490px;
          }
          canvas {
            width: 100%;
            min-width: 350px;
          }
        `}</style>
      </div>
    </article>
  );
}
