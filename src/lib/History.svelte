<script lang="ts">
  import { formatCurrency } from '../lib/utils/currency';
  import type { HistoryEntry } from "../types";

  export let history: HistoryEntry[] = [];
</script>

<section id="history">
  <h2>Transaction History</h2>
  {#if history.length === 0}
    <p class="no-history">No transactions recorded</p>
  {:else}
    <ul>
      {#each history as { date, amount, repayment }}
        <li class="transaction {repayment ? 'repayment' : 'loan'}">
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
            <span class="amount">
              {formatCurrency(amount)}
            </span>
            <span class="type">
              {repayment ? 'Payment' : 'Loan Amount'}
            </span>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  #history {
    max-width: 1200px;
    margin: 4rem auto;
    padding: 0 2rem;
  }

  h2 {
    text-align: center;
    font-size: 2.4rem;
    margin-bottom: 2rem;
  }

  .no-history {
    text-align: center;
    font-style: italic;
    color: var(--clr-text);
    opacity: 0.7;
  }

  ul {
    list-style: none;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .transaction {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    border-radius: 0.8rem;
    background-color: var(--clr-primary);
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-0.25rem);
    }
  }

  .transaction-date {
    font-weight: bold;
    font-size: 1.6rem;
  }

  .transaction-details {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .amount {
    font-weight: bold;
    font-size: 1.6rem;
  }

  .type {
    font-size: 1.4rem;
    opacity: 0.8;
  }

  .repayment .icon {
    color: var(--clr-secondary);
  }

  .loan .icon {
    color: var(--clr-text);
  }
</style>
