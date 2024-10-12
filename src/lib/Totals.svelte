<script lang="ts">
  import type { LoanDetails } from "../types";

  export let loanDetails: LoanDetails;
</script>

<section id="totals" aria-details="balance totals">
  <div class="breakdown">
    <div class="current-balance">
      <h3>Current Balance</h3>
      <p>
        {loanDetails.currentBalance
          .toNumber()
          .toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </p>
    </div>

    <div class="total-interest">
      <h3>Total Interest Accrued</h3>
      <p>
        {loanDetails.totalInterestAccrued
          .toNumber()
          .toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </p>
    </div>

    <div class="total-repayments">
      <h3>Total Repayments</h3>
      <p>
        {loanDetails.totalRepayments
          .toNumber()
          .toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </p>
    </div>
  </div>
</section>

<style>
  #totals {
    max-width: 1000px;
    margin-inline: auto;
  }
  #totals > .breakdown {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    @media screen and (min-width: 768px) {
      flex-direction: row;
    }

    & p {
      font-size: 1.5em;
      font-weight: bold;
    }
  }

  .current-balance {
    order: 1;
    flex: 1;
    & > h3 {
      font-size: 2em;
      line-height: 1;
      margin: 1.5rem;
    }
    & > p {
      color: #f00;
    }
    @media screen and (min-width: 768px) {
      order: 2;
    }
  }

  .total-interest {
    order: 2;
    & > h3 {
      font-size: 1.25em;
      line-height: 1;
    }
    @media screen and (min-width: 768px) {
      order: 1;
    }
  }

  .total-repayments {
    order: 3;
    & > h3 {
      font-size: 1.25em;
      line-height: 1;
    }
    @media screen and (min-width: 768px) {
      order: 3;
    }
  }
</style>
