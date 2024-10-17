import Decimal from "decimal.js";
import dayjs from "dayjs";
import type { DailyBalance, HistoryEntry, LoanDetails } from "../../types";

const INTEREST_RATE = 0.05;
const TODAY = dayjs();
const DEFAULT_LOAN_DETAILS: LoanDetails = {
  history: [],
  totalInterestAccrued: new Decimal(0),
  totalRepayments: new Decimal(0),
  currentBalance: new Decimal(0),
  dailyBalance: [],
};

export function calculateLoan(history: HistoryEntry[]) {
  if (history.length === 0) {
    return DEFAULT_LOAN_DETAILS;
  }

  let totalInterestAccrued = new Decimal(0);
  let totalRepayments = new Decimal(0);
  let currentBalance = history[0].amount;
  let dailyBalance: DailyBalance[] = [
    {
      balance: currentBalance,
      interestAdded: new Decimal(0),
      date: history[0].date,
    },
  ];

  let startDate = history[0].date.add(1, "day"); // Interest starts accruing the day after the first loan
  while (startDate.isBefore(TODAY)) {
    const dailyInterest = currentBalance
      .times(INTEREST_RATE)
      .dividedBy(365);
    totalInterestAccrued =
      totalInterestAccrued.plus(dailyInterest);
    currentBalance = currentBalance.plus(dailyInterest);

    const daysActivity = history.filter((payment) =>
      payment.date.isSame(startDate)
    );

    if (daysActivity.length > 0) {
      for (const activity of daysActivity) {
        if (activity.repayment) {
          currentBalance = currentBalance.minus(
            activity.amount
          );
          totalRepayments = totalRepayments.plus(
            activity.amount
          );
        } else {
          currentBalance = currentBalance.plus(
            activity.amount
          );
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

  return {
    history,
    totalInterestAccrued,
    totalRepayments,
    currentBalance,
    dailyBalance,
    };
}
