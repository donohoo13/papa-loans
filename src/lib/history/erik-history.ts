import Decimal from "decimal.js";
import dayjs from "dayjs";
import type {  HistoryEntry, LoanDetails } from "../../types";
import { calculateLoan } from ".";


const history: HistoryEntry[] = [
  {
    date: dayjs("10/18/2024"),
    amount: new Decimal(110_616),
    repayment: false,
  },
  {
    date: dayjs("10/31/2024"),
    amount: new Decimal(981),
    repayment: true,
  },
  {
    date: dayjs("11/30/2024"),
    amount: new Decimal(981),
    repayment: true,
  },
] as const;

export const erikLoanDetails: LoanDetails = calculateLoan(history); 