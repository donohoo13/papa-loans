<script lang="ts">
  import { formatCurrency } from '../lib/utils/currency';
  import type { LoanDetails } from "../types";

  export let loanDetails: LoanDetails;
</script>

<section id="totals" aria-details="balance totals">
  <div class="totals-grid">
    <div class="total-card current-balance">
      <div class="content">
        <h3>Current Balance</h3>
        <p class="amount">{formatCurrency(loanDetails.currentBalance)}</p>
      </div>
      <div class="card-decoration"></div>
    </div>

    <div class="total-card total-interest">
      <div class="content">
        <h3>Total Interest Accrued</h3>
        <p class="amount">{formatCurrency(loanDetails.totalInterestAccrued)}</p>
      </div>
    </div>

    <div class="total-card total-repayments">
      <div class="content">
        <h3>Total Repayments</h3>
        <p class="amount">{formatCurrency(loanDetails.totalRepayments)}</p>
      </div>
    </div>
  </div>
</section>

<style>
  #totals {
    max-width: 1200px;
    margin-inline: auto;
    padding: 1rem;
  }

  .totals-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
    
    @media screen and (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .total-card {
    position: relative;
    padding: 2.4rem;
    background-color: hsl(23 10% 8%);
    border-radius: 1.2rem;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  .total-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
                0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  .content {
    position: relative;
    z-index: 1;
  }

  h3 {
    font-size: 1.6rem;
    font-weight: 500;
    color: hsl(23 30% 80%);
    margin-bottom: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .amount {
    font-size: 3.2rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.2;
  }

  .current-balance {
    background-color: hsl(23 12% 10%);
    
    & .amount {
      color: var(--clr-secondary);
      font-size: 3.6rem;
    }

    & .card-decoration {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        135deg,
        hsla(23, 72%, 17%, 0.1) 0%,
        hsla(23, 72%, 17%, 0) 60%
      );
      pointer-events: none;
    }
  }

  .total-interest .amount {
    color: hsl(0 80% 60%);
  }

  .total-repayments .amount {
    color: hsl(120 40% 50%);
  }

  @media screen and (max-width: 768px) {
    .total-card {
      padding: 2rem;
    }

    .amount {
      font-size: 2.8rem;
    }

    .current-balance .amount {
      font-size: 3.2rem;
    }

    h3 {
      font-size: 1.4rem;
    }
  }
</style>
