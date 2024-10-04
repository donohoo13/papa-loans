import Decimal from "decimal.js";
import dayjs from "dayjs";

const INTEREST_RATE = 0.05;
const FIRST_LOAN_AMOUNT = 18_000;

export const history = [
  {
    date: dayjs("9-30-2024"),
    amount: new Decimal(18_000),
    repayment: false,
  },
] as const;

export let totalInterestAccrued = new Decimal(0);
export let totalRepayments = new Decimal(0);
export let currentBalance = new Decimal(FIRST_LOAN_AMOUNT);


let startDate = history[0].date.add(2, "month").startOf("month");
while (startDate.isBefore(dayjs())) {
  const monthlyInterest = currentBalance.times(INTEREST_RATE).dividedBy(12);
  totalInterestAccrued = totalInterestAccrued.plus(monthlyInterest);
  currentBalance = currentBalance.plus(monthlyInterest);

  const monthsActivity = history.filter(
    (payment) =>
      payment.date.isSame(startDate, "month") &&
      payment.date.isSame(startDate, "year")
  );

  if (monthsActivity.length > 0) {
    for (const activity of monthsActivity) {
      if (activity.repayment) {
        currentBalance = currentBalance.minus(activity.amount);
        totalRepayments = totalRepayments.plus(activity.amount);
      } else {
        currentBalance = currentBalance.plus(activity.amount);
      }
    }
  }

  startDate = startDate.add(1, "month");
}

console.log(
  `currentBalance :>>`,
  currentBalance.toDecimalPlaces(2).toString(),
  totalInterestAccrued.toDecimalPlaces(2).toString(),
  totalRepayments.toDecimalPlaces(2).toString()
);
