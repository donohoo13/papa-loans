<script lang="ts">
  import dayjs from "dayjs";
  import PapaLoans from "./assets/papa_loans_t.webp";
  import LoanBreakdown from "./components/LoanBreakdown.svelte";
  import Tabs from "./components/Tabs.svelte";
  import { connerLoanDetails } from "./lib/history/conner-history";
  import { erikLoanDetails } from "./lib/history/erik-history";
  import { greggLoanDetails } from "./lib/history/gregg-history";
  import { maysonLoanDetails } from "./lib/history/mayson-history";
  import { tatumLoanDetails } from "./lib/history/tatum-history";
  import type { ContentTab, LoanDetails } from "./types";

  // A single, data-driven array to manage all loan information.
  // This makes adding, removing, or reordering loans trivial.
  const loans: { name: string; details: LoanDetails }[] = [
    { name: "Mayson", details: maysonLoanDetails },
    { name: "Conner", details: connerLoanDetails },
    { name: "Gregg", details: greggLoanDetails },
    { name: "Erik", details: erikLoanDetails },
    { name: "Tatum", details: tatumLoanDetails },
  ];

  // Derive the tabs directly from the loans array.
  const tabs: ContentTab[] = loans.map((loan, index) => ({
    index: index,
    label: loan.name,
  }));

  let activeTab = 0;
  let currentDateTime = dayjs();
</script>

<main>
  <header>
    <img src={PapaLoans} width="500" height="500" alt="Papa Loans logo" />
    <h1 id="papa-loans">Papa Loans</h1>
    <time datetime={currentDateTime.format("YYYY-MM-DD")}
      >{currentDateTime.format("MMMM D, YYYY")}</time
    >
  </header>

  <!-- The Tabs component now controls a single LoanBreakdown instance -->
  <!-- which is dynamically updated, improving maintainability and performance. -->
  <Tabs {tabs} bind:activeTab>
    <LoanBreakdown
      loanDetails={loans[activeTab].details}
      name={loans[activeTab].name}
    />
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
