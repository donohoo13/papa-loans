import dayjs from "dayjs";
import Decimal from "decimal.js";
import { calculateLoan } from ".";
import type { DailyBalance, HistoryEntry, LoanDetails } from "../../types";


const history: HistoryEntry[] = [
  {
    date: dayjs("10/10/2024"),
    amount: new Decimal(38_318),
    repayment: false,
  },
  {
    date: dayjs("11/15/2024"),
    amount: new Decimal(778.47),
    repayment: true,
  },
  {
    date: dayjs("12/16/2024"),
    amount: new Decimal(760.17),
    repayment: true,
  },
] as const;

export const tatumLoanDetails: LoanDetails = calculateLoan(history); 