<script lang="ts">
  import { formatCurrency } from '../lib/utils/currency';
  import type { HistoryEntry } from "../types";

  export let history: HistoryEntry[] = [];
</script>

<section id="history" class="history-section">
  <h2>Transaction History</h2>
  {#if history.length === 0}
    <p class="no-history">No transactions recorded</p>
  {:else}
    <ul>
      {#each history as { date, amount, repayment }}
        <li class="transaction-card {repayment ? 'repayment' : 'loan'}">
          <div class="transaction-date">
            {date.format("MMMM D, YYYY")}
          </div>
          <div class="transaction-details">
            <span class="icon">
              <i
                class="fa-solid fa-hand-holding-dollar fa-xl {repayment ? 'fa-flip-horizontal' : ''}"
                aria-hidden="true"
              />
            </span>
            <div class="transaction-info">
              <span class="amount">{formatCurrency(amount)}</span>
              <span class="type">{repayment ? 'Payment' : 'Loan Amount'}</span>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .history-section {
    max-width: 1200px;
    margin: 4rem auto;
    padding: 0 2rem;
  }

  h2 {
    text-align: center;
    font-size: 2.4rem;
    margin-bottom: 2.5rem;
    color: var(--clr-text);
    font-weight: 500;
  }

  .no-history {
    text-align: center;
    font-style: italic;
    color: var(--clr-muted);
  }

  ul {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .transaction-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.8rem;
    border-radius: 1rem;
    background-color: var(--clr-surface);
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  .transaction-card:hover {
    transform: translateY(-2px);
    background-color: var(--clr-surface-hover);
  }

  .transaction-date {
    font-size: 1.4rem;
    color: var(--clr-muted);
    letter-spacing: 0.05em;
  }

  .transaction-details {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .transaction-info {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .amount {
    font-size: 1.8rem;
    font-weight: 600;
    color: var(--clr-text);
  }

  .type {
    font-size: 1.3rem;
    color: var(--clr-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4rem;
    height: 4rem;
    border-radius: 0.8rem;
    background-color: var(--clr-surface-hover);
  }

  .repayment .icon {
    color: var(--clr-secondary);
  }

  .loan .icon {
    color: var(--clr-text);
  }
</style>
