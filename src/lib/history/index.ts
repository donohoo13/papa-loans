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
  if (!Array.isArray(history) || history.length === 0) {
    return DEFAULT_LOAN_DETAILS;
  }

  history.forEach(validateHistoryEntry);

  const sortedHistory = [...history].sort((a, b) => compareDates(a.date, b.date));

  let currentBalance = new Decimal(0);
  let totalInterestAccrued = new Decimal(0);
  let totalRepayments = new Decimal(0);
  const dailyBalance: DailyBalance[] = [];
  const dailyInterestRate = new Decimal(INTEREST_RATE).dividedBy(DAYS_IN_YEAR);

  // Group transactions by day to handle multiple events on the same day
  const transactionsByDate = new Map<string, HistoryEntry[]>();
  for (const entry of sortedHistory) {
    const dateKey = entry.date.format('YYYY-MM-DD');
    if (!transactionsByDate.has(dateKey)) {
      transactionsByDate.set(dateKey, []);
    }
    transactionsByDate.get(dateKey)!.push(entry);
  }

  const uniqueEventDates = Array.from(transactionsByDate.keys()).map(d => dayjs(d)).sort(compareDates);
  let lastEventDate = uniqueEventDates[0];

  // Process all transactions on the very first day to establish the initial balance.
  const firstDayTransactions = transactionsByDate.get(lastEventDate.format('YYYY-MM-DD'))!;
  for (const transaction of firstDayTransactions) {
    if (!transaction.repayment) {
      currentBalance = currentBalance.plus(transaction.amount);
    } else {
      console.warn("Repayment transaction encountered on the first day:", transaction);
    }
  }
  dailyBalance.push({ date: lastEventDate, balance: currentBalance, interestAdded: new Decimal(0) });

  // Iterate through the periods between transaction dates
  for (let i = 1; i < uniqueEventDates.length; i++) {
    const currentEventDate = uniqueEventDates[i];
    const daysBetween = currentEventDate.diff(lastEventDate, 'day');

    // If there's a gap between events, calculate and capitalize the interest for that period.
    if (daysBetween > 0) {
      const interestForPeriod = currentBalance.times(dailyInterestRate).times(daysBetween);
      totalInterestAccrued = totalInterestAccrued.plus(interestForPeriod);
      currentBalance = currentBalance.plus(interestForPeriod);
    }

    // Process all transactions for the current event date
    const todaysTransactions = transactionsByDate.get(currentEventDate.format('YYYY-MM-DD'))!;
    for (const transaction of todaysTransactions) {
      if (transaction.repayment) {
        totalRepayments = totalRepayments.plus(transaction.amount);
        currentBalance = currentBalance.minus(transaction.amount);
      } else {
        currentBalance = currentBalance.plus(transaction.amount);
      }
    }

    if (currentBalance.isNegative()) {
      currentBalance = new Decimal(0);
    }
    
    dailyBalance.push({ date: currentEventDate, balance: currentBalance, interestAdded: new Decimal(0) });
    lastEventDate = currentEventDate;
  }

  // After all transactions, calculate interest from the last event up to TODAY.
  if (lastEventDate.isBefore(TODAY, 'day')) {
    const finalDays = TODAY.diff(lastEventDate, 'day');
    if (finalDays > 0) { 
      const finalInterest = currentBalance.times(dailyInterestRate).times(finalDays);
      totalInterestAccrued = totalInterestAccrued.plus(finalInterest);
      currentBalance = currentBalance.plus(finalInterest);
    }
    // Add the final, up-to-date balance point.
    dailyBalance.push({ date: TODAY, balance: currentBalance, interestAdded: new Decimal(0) });
  }

  const finalCurrentBalance = currentBalance.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

  return {
    history: sortedHistory,
    totalInterestAccrued: totalInterestAccrued.toDecimalPlaces(2, Decimal.ROUND_HALF_UP),
    totalRepayments: totalRepayments.toDecimalPlaces(2, Decimal.ROUND_HALF_UP),
    currentBalance: finalCurrentBalance,
    // Ensure balance in daily history is also rounded for consistency
    dailyBalance: dailyBalance.map(d => ({ ...d, balance: d.balance.toDecimalPlaces(2, Decimal.ROUND_HALF_UP) })),
  };
}
