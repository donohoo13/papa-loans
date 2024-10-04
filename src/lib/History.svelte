<script>
  import { history } from "./history";
</script>

<section id="history">
  <h2>History</h2>
  <ul>
    {#each history as { date, amount, repayment }}
      <li>
        <p style="font-weight: bold;">{date.format("MMMM D, YYYY")}</p>
        <p style="font-style:italic;">
          <span style="font-weight: bold; margin-right: 0.75rem;"
            ><i
              class="fa-solid fa-hand-holding-dollar fa-xl {repayment
                ? 'fa-flip-horizontal'
                : 'red'}"
              style="color:{repayment ? 'green' : 'red'};"
            ></i></span
          >
          {amount
            .toNumber()
            .toLocaleString("en-US", { style: "currency", currency: "USD" })}
        </p>
      </li>
    {/each}
  </ul>
</section>
