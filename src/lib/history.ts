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
export let dailyBalance: {
  balance: Decimal;
  interestAdded: Decimal;
  date: dayjs.Dayjs;
}[] = [{
    balance: currentBalance,
    interestAdded: new Decimal(0),
    date: history[0].date,
}];

const today = dayjs();
let startDate = history[0].date.add(1, "day"); // Interest starts accruing the day after the first loan
while (startDate.isBefore(today)) {
  const dailyInterest = currentBalance.times(INTEREST_RATE).dividedBy(365);
  totalInterestAccrued = totalInterestAccrued.plus(dailyInterest);
  currentBalance = currentBalance.plus(dailyInterest);

  const daysActivity = history.filter((payment) =>
    payment.date.isSame(startDate)
  );

  if (daysActivity.length > 0) {
    for (const activity of daysActivity) {
      if (activity.repayment) {
        currentBalance = currentBalance.minus(activity.amount);
        totalRepayments = totalRepayments.plus(activity.amount);
      } else {
        currentBalance = currentBalance.plus(activity.amount);
      }
    }
  }

  dailyBalance.push({
    balance: currentBalance,
    interestAdded: dailyInterest,
    date: startDate,
  });
  startDate = startDate.add(1, "day");
}
