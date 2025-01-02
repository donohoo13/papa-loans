<script lang="ts">
  import { Chart, type ChartConfiguration } from "chart.js/auto";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import type { DailyBalance } from "../types";

  export let dailyBalance: DailyBalance[];
  export let key: string;

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  // only display totals for every 5 days
  $: filteredDailyBalance =
    dailyBalance.length > 25 ? dailyBalance.filter((_, index) => index % 5 === 0) : dailyBalance;

  $: chartData = {
    labels: filteredDailyBalance.map(({ date }) => date.format("MM-DD-YYYY")),
    datasets: [
      {
        label: "Daily Balance",
        data: filteredDailyBalance.map((db) => +db.balance.toDecimalPlaces(2)),
        fill: false,
        borderColor: "hsl(20, 50%, 30%)",
        backgroundColor: "hsl(20, 50%, 30%)",
        tension: 0.5,
      },
    ],
  };

  $: chartConfig = {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  } as ChartConfiguration;

  function createChart() {
    if (canvas && !chart) {
      chart = new Chart(canvas, chartConfig);
    }
  }

  function updateChart() {
    if (chart) {
      chart.data = chartData;
      chart.update();
    }
  }

  onMount(createChart);

  afterUpdate(updateChart);

  onDestroy(() => {
    if (chart) {
      chart.destroy();
    }
  });
</script>

<section id="{key}-history-chart" aria-details="{key} history totals chart">
  <canvas bind:this={canvas} width={400} height={400}></canvas>
</section>

<style>
  canvas {
    max-width: 100%;
    height: auto;
  }
</style>
