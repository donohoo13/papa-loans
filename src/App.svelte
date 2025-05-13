
<script lang="ts">
  import dayjs from "dayjs";
  import PapaLoans from "./assets/papa_loans_t.webp";
  import Tabs from "./components/Tabs.svelte";
  import type { ContentTab } from "./types";
  import LoanBreakdown from "./components/LoanBreakdown.svelte";
  import { connerLoanDetails } from "./lib/history/conner-history";
  import { tatumLoanDetails } from "./lib/history/tatum-history";
  import { greggLoanDetails } from "./lib/history/gregg-history";
  import { erikLoanDetails } from "./lib/history/erik-history";
  import { maysonLoanDetails } from "./lib/history/mayson-history";

  const tabs: ContentTab[] = [
    { index: 0, label: "Mayson" },
    { index: 1, label: "Conner" },
    { index: 2, label: "Gregg" },
    { index: 3, label: "Erik" },
    { index: 4, label: "Tatum" },
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
      <LoanBreakdown loanDetails={maysonLoanDetails} name="Mayson" />
    {:else if tabIndex === 1}
      <LoanBreakdown loanDetails={connerLoanDetails} name="Conner" />
    {:else if tabIndex === 2}
      <LoanBreakdown loanDetails={greggLoanDetails} name="Gregg" />
    {:else if tabIndex === 3}
      <LoanBreakdown loanDetails={erikLoanDetails} name="Erik" />
    {:else if tabIndex === 4}
      <LoanBreakdown loanDetails={tatumLoanDetails} name="Tatum" />
    {/if}
  </Tabs>
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
    