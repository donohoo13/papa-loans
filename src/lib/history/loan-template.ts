import dayjs from 'dayjs';
import Decimal from 'decimal.js';
import type { HistoryEntry } from '../../types';

export function createLoanEntry(
  date: string, 
  amount: number, 
  isRepayment = false
): HistoryEntry {
  return {
    date: dayjs(date),
    amount: new Decimal(amount),
    repayment: isRepayment,
  };
}