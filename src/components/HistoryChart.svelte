<script lang="ts">
  import { Chart, type ChartConfiguration } from "chart.js/auto";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { COLORS } from "../lib/config/constants";
  import { formatCurrency } from "../lib/utils/currency";
  import { formatDate } from "../lib/utils/dates";
  import type { DailyBalance } from "../types";

  export let dailyBalance: DailyBalance[];
  export let key: string;

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  // Add brand color constant
  const BRAND_COLOR = 'hsl(23, 72%, 17%)';
  const BRAND_COLOR_TRANSPARENT = 'hsl(23, 72%, 17%, 0.1)';

  // Optimize data points for large datasets
  function optimizeDataPoints(data: DailyBalance[]): DailyBalance[] {
    if (data.length <= 50) return data;

    // For larger datasets, sample points based on total length
    const samplingRate = Math.ceil(data.length / 50);
    return data.filter((_, index) => index % samplingRate === 0);
  }

  $: filteredDailyBalance = optimizeDataPoints(dailyBalance);

  $: chartData = {
    labels: filteredDailyBalance.map(({ date }) => formatDate(date, "MMM D")),
    datasets: [
      {
        label: "Balance",
        data: filteredDailyBalance.map((db) => +db.balance.toDecimalPlaces(2)),
        fill: {
          target: 'origin',
          above: BRAND_COLOR_TRANSPARENT,
        },
        borderColor: BRAND_COLOR,
        backgroundColor: BRAND_COLOR,
        tension: 0.2,
        pointRadius: (ctx: { dataIndex: number; dataset: { data: number[] } }) => {
          // Show points only for start, end, and significant changes
          const index = ctx.dataIndex;
          if (index === 0 || index === filteredDailyBalance.length - 1) return 4;
          
          const currentValue = ctx.dataset.data[index];
          const prevValue = ctx.dataset.data[index - 1];
          const change = Math.abs((currentValue - prevValue) / prevValue);
          
          return change > 0.05 ? 4 : 0; // Show point if change > 5%
        },
      }
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
        easing: 'easeInOutQuart'
      },
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        title: {
          display: true,
          text: 'Loan Balance Over Time',
          color: 'hsl(23 100% 98%)',
          font: {
            size: 16,
            weight: 500,
            family: "'Inter', system-ui, sans-serif"
          },
          padding: 20
        },
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'hsl(23 12% 13% / 0.95)',
          titleColor: 'hsl(23 30% 80%)',
          bodyColor: 'hsl(23 100% 98%)',
          bodyFont: {
            size: 14,
            family: "'Inter', system-ui, sans-serif"
          },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context: { parsed: { y: number } }) => {
              return `Balance: ${formatCurrency(context.parsed.y)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          border: {
            display: false
          },
          ticks: {
            maxTicksLimit: 12,
            maxRotation: 45,
            minRotation: 45,
            color: 'hsl(23 30% 80%)',
            font: {
              size: 12,
              family: "'Inter', system-ui, sans-serif"
            }
          }
        },
        y: {
          beginAtZero: false,
          border: {
            display: false
          },
          ticks: {
            callback: (value: number) => formatCurrency(value),
            color: 'hsl(23 30% 80%)',
            font: {
              size: 12,
              family: "'Inter', system-ui, sans-serif"
            }
          },
          grid: {
            color: 'hsl(23 12% 13%)',
            lineWidth: 1
          }
        }
      }
    },
  } as ChartConfiguration;

  function initChart() {
    if (canvas) {
      chart?.destroy();
      const ctx = canvas.getContext('2d');
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
  <div class="chart-summary" aria-live="polite">
  </div>
</div>

<style>
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

  @media (max-width: 768px) {
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
