"use client";
import BtnStyle from "@/components/CustomUI/BtnStyle";
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

import { useCurrency, useCoinStore } from "@/store/store";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [changeDate, setChangeDate] = useState<"1d" | "1w" | "1M">("1d");
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const { currency } = useCurrency();
  const { exchange } = useCoinStore();
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const symbol =
          coinName.toUpperCase() + (currency === "$" ? "USDT" : "BUSD");

        const res = await fetch(
          `/api/klines?symbol=${symbol}&interval=${changeDate}&limit=50`
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

        const prices = data.map((item: any) =>
          currency === "₩"
            ? parseFloat(item[4]) * exchange
            : parseFloat(item[4])
        );

        const volumes = data.map((item: any) =>
          currency === "₩"
            ? parseFloat(item[5]) * exchange
            : parseFloat(item[5])
        );

        setChartData({
          labels,
          datasets: [
            {
              label: showVolume
                ? `${coinName} Volume (${currency})`
                : `${coinName} Price (${currency})`,
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
        console.log({
          labels,
          datasets: [
            {
              label: showVolume
                ? `${coinName} Volume (${currency})`
                : `${coinName} Price (${currency})`,
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

    fetchChartData();
  }, [currency, changeDate, coinName, showVolume]);

  if (isLoading)
    return (
      <div className="max-w-[800px] w-full h-[full] flex justify-center items-center">
        Loading chart...
      </div>
    );

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
              ? `${value.toLocaleString()} `
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

  const plugins = [
    {
      id: "verticalLine",
      afterDraw: (chart: { tooltip?: any; scales?: any; ctx?: any }) => {
        if (chart.tooltip._active && chart.tooltip._active.length) {
          const activePoint = chart.tooltip._active[0];
          const { ctx } = chart;
          const { x } = activePoint.element;
          const topY = chart.scales.y.top;
          const bottomY = chart.scales.y.bottom;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, topY);
          ctx.lineTo(x, bottomY);
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = "#A593E0";
          ctx.stroke();
          ctx.restore();
        }
      },
    },
  ];
  return (
    <article className="w-full max-w-[800px] h-auto flex flex-col justify-center items-center  ">
      <div className="w-full h-auto mb-2 flex justify-between px-2">
        <div className="w-[250px] rounded-md h-auto py-1 flex justify-center items-center gap-2 bg-[#f1f5f9] dark:bg-container-dark">
          <BtnStyle
            size="auto"
            color="focus"
            disabled={!showVolume}
            onClick={() => setShowVolume(false)}
          >
            Price
          </BtnStyle>
          <BtnStyle
            size="auto"
            color="focus"
            disabled={showVolume}
            onClick={() => setShowVolume(true)}
          >
            Volume
          </BtnStyle>
        </div>
        <div className="w-[250px] rounded-md h-auto py-1 flex justify-center items-center gap-2 bg-[#f1f5f9] dark:bg-container-dark">
          <BtnStyle
            size="auto"
            color="focus"
            disabled={changeDate === "1d"}
            onClick={() => setChangeDate("1d")}
          >
            24시간
          </BtnStyle>

          <BtnStyle
            size="auto"
            color="focus"
            disabled={changeDate === "1w"}
            onClick={() => setChangeDate("1w")}
          >
            7일
          </BtnStyle>
          <BtnStyle
            size="auto"
            color="focus"
            disabled={changeDate === "1M"}
            onClick={() => setChangeDate("1M")}
          >
            1개월
          </BtnStyle>
        </div>
      </div>
      <div className="w-[800px] h-[350px] flex justify-center items-center">
        {chartData && (
          <Line data={chartData} options={options} plugins={plugins} />
        )}
      </div>
    </article>
  );
}
