<script lang="ts">
  import dayjs from "dayjs";
  import History from "./lib/History.svelte";
  import Totals from "./lib/Totals.svelte";
  import PapaLoans from "./assets/papa_loans_t.webp";
  import HistoryChart from "./lib/HistoryChart.svelte";

  let currentDateTime = dayjs().format("MMMM D, YYYY h:mm:ss A");

  setInterval(() => {
    currentDateTime = dayjs().format("MMMM D, YYYY h:mm:ss A");
  }, 1000);
</script>

<main>
  <header aria-labelledby="papa-loans">
    <h1 id="papa-loans">Papa Loans</h1>
    <img src={PapaLoans} width="500" height="500" alt="Papa Loans logo" />
    <h3>{currentDateTime}</h3>
    <p>
      Loan interest breakdown (amortization schedule) for VW Westfalia Camper
      van.
    </p>
  </header>

  <Totals />

  <History />

  <HistoryChart />
</main>

<style>
  img {
    filter: drop-shadow(0 0 0.5rem #fff);
    height: 250px;
    width: 250px;
    margin-bottom: -4rem;
  }

  header {
    text-align: center;
    & > h1 {
      display: none;
    }
  }
</style>
