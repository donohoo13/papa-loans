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
  let currentBalance = sortedHistory[0].amount;
  let accruedInterest = new Decimal(0);
  let dailyBalance: DailyBalance[] = [{
    balance: currentBalance,
    interestAdded: new Decimal(0),
    date: sortedHistory[0].date,
  }];

  let currentDate = sortedHistory[0].date.add(1, "day");

  while (currentDate.isBefore(TODAY) || currentDate.isSame(TODAY, 'day')) {
    const dailyInterest = currentBalance
      .times(INTEREST_RATE)
      .dividedBy(DAYS_IN_YEAR)
      .toDecimalPlaces(6);

    totalInterestAccrued = totalInterestAccrued.plus(dailyInterest);
    accruedInterest = accruedInterest.plus(dailyInterest);
    currentBalance = currentBalance.plus(dailyInterest);

    const daysTransactions = sortedHistory.filter(entry => 
      entry.date.isSame(currentDate, 'day')
    );

    for (const transaction of daysTransactions) {
      if (transaction.repayment) {
        let remainingPayment = transaction.amount;
        
        if (accruedInterest.greaterThan(0)) {
          const interestPayment = Decimal.min(remainingPayment, accruedInterest);
          accruedInterest = accruedInterest.minus(interestPayment);
          remainingPayment = remainingPayment.minus(interestPayment);
        }
        
        currentBalance = currentBalance.minus(remainingPayment);
        totalRepayments = totalRepayments.plus(transaction.amount);
      } else {
        currentBalance = currentBalance.plus(transaction.amount);
      }
    }

    dailyBalance.push({
      balance: currentBalance,
      interestAdded: dailyInterest,
      date: currentDate,
    });

    currentDate = currentDate.add(1, "day");
  }

  return {
    history: sortedHistory,
    totalInterestAccrued,
    totalRepayments,
    currentBalance,
    dailyBalance,
  };
}
