<script lang="ts">
  import Decimal from "decimal.js";
  import { INTEREST_RATE } from "../lib/config/constants";
  import type { LoanDetails } from "../types";

  export let loanDetails: LoanDetails;

  // Formatter for currency values
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Formatter for percentages
  const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

  // Helper function to format Decimal objects as currency
  const formatCurrency = (amount: Decimal) => currencyFormatter.format(amount.toNumber());

  // Calculate total principal (original loan amounts)
  $: totalPrincipal = loanDetails.history
    .filter(entry => !entry.repayment)
    .reduce((sum, entry) => sum.plus(entry.amount), new Decimal(0));

  // Calculate current principal vs interest split
  $: currentInterest = loanDetails.currentBalance.minus(totalPrincipal);

  // Calculate monthly interest based on current balance
  $: monthlyInterest = loanDetails.currentBalance
    .times(INTEREST_RATE)
    .dividedBy(12)
    .toDecimalPlaces(2);

  // Calculate percentage of payments going to interest vs principal
  $: interestToPaymentRatio = loanDetails.totalRepayments.isZero() 
    ? new Decimal(0)
    : loanDetails.totalInterestAccrued
        .dividedBy(loanDetails.totalRepayments)
        .times(1) // Convert to decimal for percentage formatting
        .toDecimalPlaces(3);

  // Calculate average monthly payment (if any payments made)
  $: averageMonthlyPayment = (() => {
    if (loanDetails.history.length <= 1) return new Decimal(0);
    
    const firstDate = loanDetails.history[0].date;
    const lastDate = loanDetails.history[loanDetails.history.length - 1].date;
    const monthsDiff = lastDate.diff(firstDate, 'month', true);
    
    return monthsDiff <= 0 
      ? new Decimal(0)
      : loanDetails.totalRepayments.dividedBy(monthsDiff).toDecimalPlaces(2);
  })();
</script>

<div class="metrics-container">
  <h3>Loan Metrics</h3>
  
  <div class="metrics-grid">
    <div class="metric">
      <label>Total Principal Borrowed</label>
      <span class="amount">{formatCurrency(totalPrincipal)}</span>
    </div>

    <div class="metric">
      <label>Balance Breakdown</label>
      <div class="breakdown">
        <div class="breakdown-item">
          <span class="breakdown-label">Principal</span>
          <span class="amount">{formatCurrency(totalPrincipal)}</span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">Interest</span>
          <span class="amount" class:negative={currentInterest.isNegative()}>
            {formatCurrency(currentInterest)}
          </span>
        </div>
      </div>
    </div>

    <div class="metric">
      <label>Monthly Interest</label>
      <span class="amount accent">{formatCurrency(monthlyInterest)}<small>/month</small></span>
    </div>

    <div class="metric">
      <label>Interest/Payment Ratio</label>
      <span class="amount">{percentFormatter.format(interestToPaymentRatio.toNumber())}<small>&nbsp;to&nbsp;interest</small></span>
    </div>

    {#if !averageMonthlyPayment.isZero()}
      <div class="metric">
        <label>Average Monthly Payment</label>
        <span class="amount accent">{formatCurrency(averageMonthlyPayment)}<small>/month</small></span>
      </div>
    {/if}
  </div>
</div>

<style>
  .metrics-container {
    margin: 3rem 0;
    padding: 2rem;
    background-color: hsl(23 10% 8%);
    border-radius: 1.2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }

  h3 {
    text-align: center;
    font-size: 2.2rem;
    margin-bottom: 2.5rem;
    font-weight: 600;
    color: var(--clr-secondary);
  }

  .metrics-grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  }

  .metric {
    padding: 1.8rem;
    background-color: hsl(23 8% 12%);
    border-radius: 1rem;
    transition: transform 0.2s ease;
  }

  .metric:hover {
    transform: translateY(-2px);
  }

  label {
    display: block;
    font-weight: 500;
    font-size: 1.4rem;
    color: hsl(23 30% 80%);
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .amount {
    display: block;
    font-size: 2.4rem;
    font-weight: 600;
    color: var(--clr-text);
  }

  .amount.accent {
    color: var(--clr-secondary);
  }

  .amount small {
    font-size: 1.4rem;
    opacity: 0.8;
    font-weight: normal;
  }

  .breakdown {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .breakdown-item .amount {
    font-size: 1.8rem;
  }

  .breakdown-label {
    font-size: 1.4rem;
    color: hsl(23 30% 80%);
  }

  .negative {
    color: hsl(0 80% 60%);
  }

  @media (max-width: 600px) {
    .metrics-container {
      padding: 1.5rem;
      margin: 2rem 0;
    }

    .metrics-grid {
      gap: 1.5rem;
    }

    .metric {
      padding: 1.5rem;
    }

    .amount {
      font-size: 2rem;
    }
  }
</style> 