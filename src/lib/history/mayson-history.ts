import Decimal from "decimal.js";
import dayjs from "dayjs";
import type {  HistoryEntry, LoanDetails } from "../../types";
import { calculateLoan } from ".";


const history: HistoryEntry[] = [
  {
    date: dayjs("11/01/2024"),
    amount: new Decimal(182_000),
    repayment: false,
  },
] as const;

export const maysonLoanDetails: LoanDetails = calculateLoan(history); 