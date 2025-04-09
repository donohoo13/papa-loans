<script lang="ts">
  import Decimal from "decimal.js";
  import { INTEREST_RATE } from "../lib/config/constants";
  import type { LoanDetails } from "../types";

  export let loanDetails: LoanDetails;

  const currencyFormatter = new Intl.NumberFormat('en-US', { 
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  const formatCurrency = (amount: Decimal) => currencyFormatter.format(amount.toNumber());

  $: totalPrincipal = loanDetails.history
    .filter(entry => !entry.repayment)
    .reduce((sum, entry) => sum.plus(entry.amount), new Decimal(0));

  $: monthlyInterest = loanDetails.currentBalance
    .times(INTEREST_RATE)
    .dividedBy(12)
    .toDecimalPlaces(2);

  $: interestToPaymentRatio = loanDetails.totalRepayments.isZero() 
    ? new Decimal(0)
    : loanDetails.totalInterestAccrued
        .dividedBy(loanDetails.totalRepayments)
        .toDecimalPlaces(3);

  $: averageMonthlyPayment = (() => {
    if (loanDetails.history.length <= 1) return new Decimal(0);
    const firstDate = loanDetails.history[0].date;
    const monthsDiff = loanDetails.history[loanDetails.history.length - 1].date.diff(firstDate, 'month', true);
    return monthsDiff <= 0 
      ? new Decimal(0)
      : loanDetails.totalRepayments.dividedBy(monthsDiff).toDecimalPlaces(2);
  })();

  $: shouldShowCapitalizationNote = 
    loanDetails.currentBalance.greaterThan(totalPrincipal) && 
    loanDetails.totalRepayments.greaterThan(0);
</script>

<section class="loan-overview">
  <!-- Primary Metrics -->
  <div class="primary-metrics">
    <div class="metric-card primary">
      <h3>Current Balance</h3>
      <p class="amount">{formatCurrency(loanDetails.currentBalance)}</p>
      {#if shouldShowCapitalizationNote}
        <p class="info-subtle">
          Note: The balance can increase if payments made do not fully cover the interest accrued in a period (interest capitalization).
        </p>
      {/if}
    </div>
    
    <div class="metric-card">
      <h3>Total Interest Accrued</h3>
      <p class="amount subtle-red">{formatCurrency(loanDetails.totalInterestAccrued)}</p>
    </div>
    
    <div class="metric-card">
      <h3>Total Repayments</h3>
      <p class="amount subtle-green">{formatCurrency(loanDetails.totalRepayments)}</p>
    </div>
  </div>

  <!-- Secondary Metrics -->
  <div class="secondary-metrics">
    <div class="metric-card">
      <h3>Principal Borrowed</h3>
      <p class="amount">{formatCurrency(totalPrincipal)}</p>
    </div>

    <div class="metric-card">
      <h3>Est. Current Monthly Interest</h3>
      <p class="amount">
        {formatCurrency(monthlyInterest)}
        <span class="suffix">/month</span>
      </p>
    </div>

    <div class="metric-card">
      <h3>
        Interest/Payment Ratio
        <span 
          class="info-icon" 
          title="Shows the ratio of total accrued interest to total payments made. A value over 100% indicates that accumulated interest has historically exceeded payments."
        >
          ℹ️
        </span>
      </h3>
      <p class="amount">
        {percentFormatter.format(interestToPaymentRatio.toNumber())}
        <span class="suffix">of payments to interest</span>
      </p>
    </div>

    {#if !averageMonthlyPayment.isZero()}
      <div class="metric-card">
        <h3>Average Payment</h3>
        <p class="amount">
          {formatCurrency(averageMonthlyPayment)}
          <span class="suffix">/month</span>
        </p>
      </div>
    {/if}
  </div>
</section>

<style>
  .loan-overview {
  }

  .primary-metrics {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .secondary-metrics {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .metric-card {
    background-color: var(--clr-surface);
    padding: 2rem;
    border-radius: 1rem;
    transition: transform 0.2s ease, background-color 0.2s ease;
  }

  .metric-card:hover {
    transform: translateY(-2px);
    background-color: var(--clr-surface-hover);
  }

  .metric-card.primary {
    background-color: var(--clr-surface-hover);
    position: relative;
    overflow: hidden;
  }

  .metric-card.primary::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      hsla(23, 72%, 17%, 0.08) 0%,
      transparent 60%
    );
    pointer-events: none;
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--clr-muted);
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .amount {
    font-size: 2.4rem;
    font-weight: 600;
    margin: 0;
    line-height: 1.2;
    color: var(--clr-text);
  }

  .primary .amount {
    font-size: 3rem;
  }

  .suffix {
    font-size: 1.4rem;
    opacity: 0.7;
    font-weight: normal;
  }

  .subtle-red {
    color: hsl(0 70% 65%);
  }

  .subtle-green {
    color: hsl(120 30% 60%);
  }

  .info-icon {
    font-size: 1.2rem;
    margin-left: 0.5em;
    cursor: help;
    vertical-align: middle;
    opacity: 0.7;
  }

  .info-subtle {
    font-size: 1.2rem;
    color: var(--clr-muted);
    margin-top: 1rem;
    font-style: italic;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    .metric-card {
      padding: 1.5rem;
    }

    .amount {
      font-size: 2.2rem;
    }

    .primary .amount {
      font-size: 2.6rem;
    }

    h3 {
      font-size: 1.3rem;
    }
  }
</style> 