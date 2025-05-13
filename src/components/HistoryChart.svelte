<script lang="ts">
  import { Chart, type ChartConfiguration } from "chart.js/auto";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { formatCurrency } from "../lib/utils/currency";
  import { formatDate } from "../lib/utils/dates";
  import type { DailyBalance } from "../types";

  export let dailyBalance: DailyBalance[];
  export let repaymentDates: string[] = [];
  export let key: string;

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  // Add brand color constant
  const BRAND_COLOR = "hsl(23, 72%, 17%)";
  const BRAND_COLOR_TRANSPARENT = "hsl(23, 72%, 17%, 0.1)";

  // Memoize repayment dates set for faster lookups
  $: repaymentDatesSet = new Set(repaymentDates);

  // Optimize data points for large datasets, ensuring repayment dates are included
  function optimizeDataPoints(
    data: DailyBalance[],
    datesToKeep: Set<string>
  ): DailyBalance[] {
    if (data.length <= 50) return data;

    const optimized: DailyBalance[] = [];
    const samplingRate = Math.ceil(data.length / 75);
    const dataLength = data.length;

    if (dataLength === 0) return [];

    // Always include the first point
    optimized.push(data[0]);

    for (let i = 1; i < dataLength - 1; i++) {
      const currentDateStr = data[i].date.format("YYYY-MM-DD");
      if (datesToKeep.has(currentDateStr) || i % samplingRate === 0) {
        optimized.push(data[i]);
      }
    }

    // Always include the last point (if not already included)
    if (
      dataLength > 1 &&
      (!optimized.length ||
        optimized[optimized.length - 1] !== data[dataLength - 1])
    ) {
      optimized.push(data[dataLength - 1]);
    }

    return optimized;
  }

  $: filteredDailyBalance = optimizeDataPoints(dailyBalance, repaymentDatesSet);

  $: chartData = {
    labels: filteredDailyBalance.map(({ date }) => formatDate(date, "MMM D")),
    datasets: [
      {
        label: "Balance",
        data: filteredDailyBalance.map((db) => +db.balance.toDecimalPlaces(2)),
        fill: {
          target: "origin",
          above: BRAND_COLOR_TRANSPARENT,
        },
        borderColor: BRAND_COLOR,
        backgroundColor: BRAND_COLOR,
        tension: 0.2,
        pointRadius: (ctx: {
          dataIndex: number;
          dataset: { data: number[] };
        }) => {
          const index = ctx.dataIndex;
          const pointDate = filteredDailyBalance[index]?.date;
          if (!pointDate) return 0;

          if (repaymentDatesSet.has(pointDate.format("YYYY-MM-DD"))) {
            return 4;
          }

          if (index === 0 || index === filteredDailyBalance.length - 1)
            return 4;

          const currentValue = ctx.dataset.data[index];
          const prevValue = ctx.dataset.data[index - 1];
          const change = Math.abs((currentValue - prevValue) / prevValue);

          return change > 0.05 ? 4 : 0;
        },
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
        duration: 750,
        easing: "easeInOutQuart",
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
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            maxTicksLimit: 12,
            maxRotation: 45,
            minRotation: 45,
            color: "hsl(23 30% 80%)",
            font: {
              size: 12,
              family: "'Inter', system-ui, sans-serif",
            },
          },
        },
        y: {
          beginAtZero: false,
          border: {
            display: false,
          },
          ticks: {
            callback: (value: number) => formatCurrency(value),
            color: "hsl(23 30% 80%)",
            font: {
              size: 12,
              family: "'Inter', system-ui, sans-serif",
            },
          },
          grid: {
            color: "hsl(23 12% 13%)",
            lineWidth: 1,
          },
        },
      },
    },
  } as ChartConfiguration;

  function initChart() {
    if (canvas) {
      chart?.destroy();
      const ctx = canvas.getContext("2d");
      if (ctx) {
        chart = new Chart(ctx, chartConfig);
      }
    }
  }

  onMount(() => {
    initChart();
  });

  afterUpdate(() => {
    initChart();
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
    id="chart-{key}"
  />
  <div class="chart-summary" aria-live="polite"></div>
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

  .chart-summary {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid hsla(23, 30%, 80%, 0.1);
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
