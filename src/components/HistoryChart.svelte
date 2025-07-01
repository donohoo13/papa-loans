<script lang="ts">
  import { Chart, type ChartConfiguration } from "chart.js/auto";
  import { onDestroy, onMount } from "svelte";
  import { formatCurrency } from "../lib/utils/currency";
  import { formatDate } from "../lib/utils/dates";
  import type { DailyBalance } from "../types";

  export let dailyBalance: DailyBalance[];
  export let repaymentDates: string[] = [];

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  const BRAND_COLOR = "hsl(23, 72%, 17%)";
  const BRAND_COLOR_TRANSPARENT = "hsl(23, 72%, 17%, 0.1)";

  // Memoize repayment dates set for faster lookups
  $: repaymentDatesSet = new Set(repaymentDates);
  
  // The dailyBalance data is now much sparser thanks to the new calculation engine.
  // This optimization function is kept for robustness in case of very frequent transactions.
  function optimizeDataPoints(data: DailyBalance[]): DailyBalance[] {
    if (data.length <= 150) return data; // Increased threshold

    const optimized: DailyBalance[] = [];
    // Sample down to ~100 points for very large datasets
    const samplingRate = Math.ceil(data.length / 100); 

    if (data.length === 0) return [];
    optimized.push(data[0]);

    for (let i = 1; i < data.length - 1; i++) {
      if (i % samplingRate === 0) {
        optimized.push(data[i]);
      }
    }
    optimized.push(data[data.length - 1]);
    return optimized;
  }

  $: chartPoints = optimizeDataPoints(dailyBalance);

  $: chartData = {
    labels: chartPoints.map(({ date }) => formatDate(date, "MMM D, YY")),
    datasets: [
      {
        label: "Balance",
        data: chartPoints.map((db) => +db.balance.toDecimalPlaces(2)),
        fill: {
          target: "origin",
          above: BRAND_COLOR_TRANSPARENT,
        },
        borderColor: BRAND_COLOR,
        backgroundColor: BRAND_COLOR,
        tension: 0.1,
        pointRadius: (ctx: { dataIndex: number }) => {
          const index = ctx.dataIndex;
          const pointDate = chartPoints[index]?.date;
          if (!pointDate) return 0;

          // Highlight points that are on a repayment date
          if (repaymentDatesSet.has(pointDate.format("YYYY-MM-DD"))) {
            return 4;
          }

          // Always show first and last points
          if (index === 0 || index === chartPoints.length - 1) return 3;

          return 0; // Hide intermediate points for a cleaner line
        },
        pointHoverRadius: 6,
      },
    ],
  };

  $: chartConfig = {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500, // Slightly faster animation
        easing: "easeOutCubic",
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        title: {
          display: true,
          text: "Loan Balance Over Time",
          color: "hsl(23 100% 98%)",
          font: {
            size: 16,
            weight: 500,
            family: "'Inter', system-ui, sans-serif",
          },
          padding: 20,
        },
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "hsl(23 12% 13% / 0.95)",
          titleColor: "hsl(23 30% 80%)",
          bodyColor: "hsl(23 100% 98%)",
          bodyFont: {
            size: 14,
            family: "'Inter', system-ui, sans-serif",
          },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context: { parsed: { y: number } }) => {
              return `Balance: ${formatCurrency(context.parsed.y)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: {
            maxTicksLimit: 10,
            maxRotation: 45,
            minRotation: 45,
            color: "hsl(23 30% 80%)",
          },
        },
        y: {
          beginAtZero: false,
          border: { display: false },
          ticks: {
            callback: (value: number) => formatCurrency(value),
            color: "hsl(23 30% 80%)",
          },
          grid: { color: "hsl(23 12% 13%)" },
        },
      },
    },
  } as ChartConfiguration;

  // This reactive statement efficiently updates the chart when its config changes,
  // avoiding the costly process of destroying and recreating the chart instance.
  $: if (chart && chartConfig) {
    chart.data = chartConfig.data;
    chart.options = chartConfig.options as any; // Type assertion to satisfy Chart.js types
    chart.update('none'); // 'none' prevents animation on data swap for a smoother feel
  }

  onMount(() => {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        chart = new Chart(ctx, chartConfig);
      }
    }
  });

  onDestroy(() => {
    chart?.destroy();
  });
</script>

<div class="chart-card" aria-label="Line chart showing loan balance over time">
  <canvas
    bind:this={canvas}
    role="img"
    aria-label="Loan balance trend chart"
  />
</div>

<style lang="css">
  .chart-card {
    position: relative;
    height: 400px;
    width: 100%;
    max-width: 1200px; 
    margin: 2rem auto;
    padding: 2.4rem;
    background-color: var(--clr-surface);
    border-radius: 1.2rem;
    transition: background-color 0.2s ease;
  } 

  .chart-card:hover {
    background-color: var(--clr-surface-hover);
  }

  @media (max-width: calc(var(--bkpt-tablet))) {
    .chart-card {
      height: 300px;
      padding: 1.6rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    :global(.chart-card *) {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
