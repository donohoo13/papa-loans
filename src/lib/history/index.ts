import dayjs from "dayjs";
import Decimal from "decimal.js";
import type { DailyBalance, HistoryEntry, LoanDetails } from "../../types";
import {
    DAYS_IN_YEAR,
    INTEREST_RATE,
    TODAY
} from '../config/constants';
import { compareDates } from '../utils/dates';

const DEFAULT_LOAN_DETAILS: LoanDetails = {
  history: [],
  totalInterestAccrued: new Decimal(0),
  totalRepayments: new Decimal(0),
  currentBalance: new Decimal(0),
  dailyBalance: [],
};

function validateHistoryEntry(entry: HistoryEntry) {
  if (!entry.date || !entry.amount) {
    throw new Error('Invalid history entry: date and amount are required');
  }
  if (entry.amount.isNegative()) {
    throw new Error('Invalid history entry: amount cannot be negative');
  }
}

export function calculateLoan(history: HistoryEntry[]): LoanDetails {
  if (!Array.isArray(history)) {
    throw new Error('History must be an array');
  }

  if (history.length === 0) {
    return DEFAULT_LOAN_DETAILS;
  }

  history.forEach(validateHistoryEntry);

  const sortedHistory = [...history].sort((a, b) => compareDates(a.date, b.date));

  let totalInterestAccrued = new Decimal(0);
  let totalRepayments = new Decimal(0);
  let currentBalance = new Decimal(0);
  let unpaidAccruedInterest = new Decimal(0);
  let dailyBalance: DailyBalance[] = [];

  const firstDate = sortedHistory[0].date;
  let lastProcessedDate = firstDate.subtract(1, "day");

  let historyIndex = 0;
  while (historyIndex < sortedHistory.length && sortedHistory[historyIndex].date.isSame(firstDate, 'day')) {
    const transaction = sortedHistory[historyIndex];
    if (!transaction.repayment) {
      currentBalance = currentBalance.plus(transaction.amount);
    } else {
      console.warn("Repayment transaction encountered on the first day:", transaction);
    }
    historyIndex++;
  }

  dailyBalance.push({
    balance: currentBalance,
    interestAdded: new Decimal(0),
    date: firstDate,
  });

  let currentDate = firstDate.add(1, "day");

  while (currentDate.isBefore(TODAY) || currentDate.isSame(TODAY, 'day')) {
    const dailyInterest = currentBalance
      .times(INTEREST_RATE)
      .dividedBy(DAYS_IN_YEAR)
      .toDecimalPlaces(10);

    totalInterestAccrued = totalInterestAccrued.plus(dailyInterest);
    unpaidAccruedInterest = unpaidAccruedInterest.plus(dailyInterest);

    while (historyIndex < sortedHistory.length && sortedHistory[historyIndex].date.isSame(currentDate, 'day')) {
      const transaction = sortedHistory[historyIndex];
      if (transaction.repayment) {
        let paymentAmount = transaction.amount;
        totalRepayments = totalRepayments.plus(paymentAmount);

        const interestPaid = Decimal.min(paymentAmount, unpaidAccruedInterest);
        unpaidAccruedInterest = unpaidAccruedInterest.minus(interestPaid);

        const principalPaid = paymentAmount.minus(interestPaid);
        currentBalance = currentBalance.minus(principalPaid);

      } else {
        currentBalance = currentBalance.plus(transaction.amount);
      }
      historyIndex++;
    }

    currentBalance = currentBalance.plus(unpaidAccruedInterest);
    const capitalizedInterest = unpaidAccruedInterest;
    unpaidAccruedInterest = new Decimal(0);

    if (currentBalance.isNegative()) {
      console.warn(`Balance went negative on ${currentDate.format('YYYY-MM-DD')}, capping at 0. Original: ${currentBalance.toFixed(2)}`);
      currentBalance = new Decimal(0);
    }

    dailyBalance.push({
      balance: currentBalance,
      interestAdded: capitalizedInterest,
      date: currentDate,
    });

    lastProcessedDate = currentDate;
    currentDate = currentDate.add(1, "day");
  }

  const calculatedPrincipal = sortedHistory.reduce((sum, entry) => {
    return entry.repayment ? sum : sum.plus(entry.amount);
  }, new Decimal(0));

  const expectedBalance = calculatedPrincipal
    .plus(totalInterestAccrued)
    .minus(totalRepayments);

  const tolerance = new Decimal(0.01);
  const difference = currentBalance.minus(expectedBalance).abs();

  if (difference.greaterThan(tolerance)) {
    console.error("Loan Calculation Consistency Check Failed!");
    console.error(`  Current Balance (Loop):  ${currentBalance.toFixed(4)}`);
    console.error(`  Expected Balance (P+I-R): ${expectedBalance.toFixed(4)}`);
    console.error(`  Difference:               ${difference.toFixed(4)}`);
    console.error(`  Tolerance:                ${tolerance.toFixed(4)}`);
    console.error(`  Total Principal Borrowed: ${calculatedPrincipal.toFixed(4)}`);
    console.error(`  Total Interest Accrued:   ${totalInterestAccrued.toFixed(4)}`);
    console.error(`  Total Repayments:         ${totalRepayments.toFixed(4)}`);
  }

  const finalCurrentBalance = currentBalance.toDecimalPlaces(2);

  return {
    history: sortedHistory,
    totalInterestAccrued: totalInterestAccrued.toDecimalPlaces(2),
    totalRepayments: totalRepayments.toDecimalPlaces(2),
    currentBalance: finalCurrentBalance,
    dailyBalance: dailyBalance.map(d => ({ ...d, balance: d.balance.toDecimalPlaces(2) })),
  };
}
