<script lang="ts">
  import { dailyBalance } from "./history";
  import { Line } from "svelte-chartjs";
  import "chart.js/auto";
</script>

<section id="history-chart" aria-details="history totals chart">
  <Line
    width={400}
    height={400}
    options={{
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    }}
    data={{
      labels: dailyBalance.map(({ date }) => date.format("MM-DD-YYYY")),
      datasets: [
        {
          label: "Daily Balance",
          data: dailyBalance.map((db) => +db.balance.toDecimalPlaces(2)),
          fill: false,
          borderColor: "hsl(20, 50%, 30%)",
          backgroundColor: "hsl(20, 50%, 30%)",
          tension: 0.5,
        },
      ],
    }}
  />
</section>

<style>
</style>
