<script>
  import {
    totalInterestAccrued,
    totalRepayments,
    currentBalance,
  } from "./history";
</script>

<section id="totals" aria-details="balance totals">
  <div class="breakdown">
    <div class="total-interest">
      <h3>Total Interest Accrued</h3>
      <p>
        {totalInterestAccrued
          .toNumber()
          .toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </p>
    </div>

    <div class="current-balance">
      <h3>Current Balance</h3>
      <p>
        {currentBalance
          .toNumber()
          .toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </p>
    </div>

    <div class="total-repayments">
      <h3>Total Repayments</h3>
      <p>
        {totalRepayments
          .toNumber()
          .toLocaleString("en-US", { style: "currency", currency: "USD" })}
      </p>
    </div>
  </div>
</section>

<style>
  #totals > .breakdown {
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    text-align: center;

    & p {
      font-size: 1.5em;
      font-weight: bold;
    }
  }
  .current-balance {
    & > h3 {
      font-size: 2em;
      line-height: 1;
      margin: 1.5rem;
    }
    & > p {
      color: #f00;
    }
  }

  h3 > span {
    font-size: 0.75em;
    font-style: italic;
  }
</style>
