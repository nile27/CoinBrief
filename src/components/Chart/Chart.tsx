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
  ChartData,
} from "chart.js";

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

export default function Chart() {
  const [chartData, setChartData] = useState<ChartDataType | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7"
        );
        const data = await res.json();

        const labels = data.prices.map((item: [number, number]) =>
          new Date(item[0]).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );
        const prices = data.prices.map((item: [number, number]) => item[1]);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Bitcoin Price (USD)",
              data: prices,
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
  }, []);

  if (!chartData) return <div>Loading chart...</div>;

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
            return `Price: ${value.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}`;
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
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h1>Bitcoin Price Chart (7 Days)</h1>
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
          max-width: 800px;
          height: 300px;
          margin: auto;
        }
      `}</style>
    </div>
  );
}
