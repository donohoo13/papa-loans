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
] as const;

export const erikLoanDetails: LoanDetails = calculateLoan(history); 