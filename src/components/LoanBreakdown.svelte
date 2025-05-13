
<script lang="ts">
  import { onMount } from "svelte";
  import History from "../lib/History.svelte";
  import LoanOverview from "../lib/LoanOverview.svelte";
  import type { LoanDetails } from "../types";
  import HistoryChart from "./HistoryChart.svelte";

  export let loanDetails: LoanDetails;
  export let name: string;
  $: storageKey = `${name}-access`.toLowerCase();

  let password = "";
  let accessAllowed = false;

  // Extract repayment dates (as strings for easier comparison in chart)
  $: repaymentDates = loanDetails.history
    .filter(entry => entry.repayment)
    .map(entry => entry.date.format('YYYY-MM-DD')); // Format consistently

  function handleAccess(e: SubmitEvent) {
    e.preventDefault();
    if (password.toLowerCase() === name.toLowerCase()) {
      accessAllowed = true;
      sessionStorage.setItem(storageKey, JSON.stringify(accessAllowed));
    }
  }

  onMount(() => {
    const savedAccess = sessionStorage.getItem(storageKey);
    if (savedAccess) {
      accessAllowed = JSON.parse(savedAccess);
    }
  });
</script>

<div class="loan-breakdown">
  <h2>{name}</h2>
  {#if accessAllowed}
    <div class="loan-breakdown-container">
      <div>

        <LoanOverview {loanDetails} />
      </div>
      <div>

        <HistoryChart 
          dailyBalance={loanDetails.dailyBalance} 
          repaymentDates={repaymentDates} 
          key={name} 
        />
      </div>
      <div>
        <History history={loanDetails.history} />
      </div>
    </div>
    {:else}
    <div class="access-form-container">
      <form on:submit={handleAccess} class="access-form">
        <label for="password-{name}" class="access-label">Enter password to view loan details:</label>
        <input type="password" id="password-{name}" bind:value={password} class="access-input" />
        <button type="submit" class="access-button">Submit</button>
      </form>
    </div>
  {/if}
</div>

<style>
  h2 {
    text-align: center;
    font-size: 2.8rem;
    font-weight: bold;
    margin-bottom: 2rem; /* Added margin for better spacing with form */
  }

  .loan-breakdown-container {
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    gap: 4rem;

    & > div {
      width: 100%;
    }
  }

  .access-form-container {
    display: flex;
    justify-content: center;
    margin-top: 2em;
  }

  .access-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem; /* Adjusted gap */
    padding: 2rem;
    background-color: var(--clr-surface);
    border-radius: 1rem;
    max-width: 400px;
    width: 100%;
  }

  .access-label {
    font-size: 1.6rem; /* Adjusted font size */
    font-weight: 500; /* Adjusted font weight */
    color: var(--clr-muted);
    text-align: center;
  }

  .access-input {
    font-size: 1.6rem;
    padding: 1rem 1.5rem;
    border-radius: 0.6rem;
    border: 1px solid var(--clr-surface-hover);
    background-color: var(--clr-bg); /* Match app background or a slightly lighter shade */
    color: var(--clr-text);
    width: 100%;
    box-sizing: border-box; /* Ensure padding doesn't expand width */
  }

  .access-input:focus {
    outline: none;
    border-color: var(--clr-primary);
    box-shadow: 0 0 0 2px hsla(var(--clr-primary-hsl), 0.3); /* Using HSL for primary if available, or a generic shadow */
  }
  
  /* Assuming --clr-primary-hsl is defined, if not, a simpler shadow is fine.
     Example: box-shadow: 0 0 0 2px var(--clr-primary);
     For now, let's use a direct hsla based on --clr-primary: hsl(23 72% 17%)
  */
  .access-input:focus {
    outline: none;
    border-color: var(--clr-primary);
    box-shadow: 0 0 0 2px hsla(23, 72%, 17%, 0.3);
  }


  .access-button {
    font-size: 1.6rem;
    padding: 1rem 2rem;
    background-color: var(--clr-primary);
    color: var(--clr-text); /* Ensure good contrast, var(--clr-text) is usually light */
    border: none;
    border-radius: 0.6rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
    font-weight: 500;
  }

  .access-button:hover {
    background-color: hsl(23, 72%, 22%); /* Slightly darker shade of primary */
  }
</style>
    