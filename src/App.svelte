<script lang="ts">
  import dayjs from "dayjs";
  import PapaLoans from "./assets/papa_loans_t.webp";
  import Tabs from "./components/Tabs.svelte";
  import type { ContentTab } from "./types";
  import LoanBreakdown from "./components/LoanBreakdown.svelte";
  import { connerLoanDetails } from "./lib/history/conner-history";
  import { tatumLoanDetails } from "./lib/history/tatum-history";

  const tabs: ContentTab[] = [
    { index: 0, label: "Conner" },
    { index: 1, label: "Tatum" },
  ];

  let currentDateTime = dayjs();
</script>

<main>
  <header>
    <img src={PapaLoans} width="500" height="500" alt="Papa Loans logo" />
    <h1 id="papa-loans">Papa Loans</h1>
    <time datetime={currentDateTime.format("YYYY-MM-DD")}
      >{currentDateTime.format("MMMM D, YYYY")}</time
    >
    <!-- <p>
      Loan interest breakdown (amortization schedule) for VW Westfalia Camper
      van.
    </p> -->
  </header>

  <Tabs {tabs} let:tabIndex>
    {#if tabIndex === 0}
      <LoanBreakdown loanDetails={connerLoanDetails} name="Conner" />
    {:else}
      <LoanBreakdown loanDetails={tatumLoanDetails} name="Tatum" />
    {/if}
  </Tabs>

  <!-- <Totals />

  <History />

  <HistoryChart /> -->
</main>

<style>
  img {
    filter: drop-shadow(0 0 0.5rem #fff);
    height: 250px;
    width: 250px;
  }

  header {
    text-align: center;

    & > h1 {
      font-size: 4rem;
      font-weight: bold;
      margin: 0;
    }

    & > time {
      display: block;
      font-size: 2rem;
      font-weight: semibold;
    }
  }
</style>
