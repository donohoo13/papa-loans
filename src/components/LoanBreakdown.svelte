<script lang="ts">
  import Totals from "../lib/Totals.svelte";
  import History from "../lib/History.svelte";
  import HistoryChart from "./HistoryChart.svelte";
  import type { LoanDetails } from "../types";
  import { onMount } from "svelte";

  export let loanDetails: LoanDetails;
  export let name: string;
  $: storageKey = `${name}-access`.toLowerCase();

  let password = "";
  let accessAllowed = false;

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
    <Totals {loanDetails} />

    <History history={loanDetails.history} />

    <HistoryChart dailyBalance={loanDetails.dailyBalance} key={name} />
  {:else}
    <div>
      <form on:submit={handleAccess}>
        <label for="password">Enter password to view loan details:</label>
        <input type="password" id="password" bind:value={password} />
        <button>Submit</button>
      </form>
    </div>
  {/if}
</div>

<style>
  h2 {
    text-align: center;
    font-size: 2.8rem;
    font-weight: bold;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2em;
    gap: 2rem;
  }

  label {
    font-size: 1.8rem;
    font-weight: bold;
  }

  input {
    font-size: 1.6rem;
    padding: 1rem;
  }

  button {
    font-size: 1.6rem;
    padding: 1rem 2rem;
    background-color: var(--clr-primary);
    color: var(--clr-white);
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }
</style>
