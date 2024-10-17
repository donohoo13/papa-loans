import Decimal from "decimal.js";
import dayjs from "dayjs";
import type {  HistoryEntry, LoanDetails } from "../../types";
import { calculateLoan } from ".";


const history: HistoryEntry[] = [
  {
    date: dayjs("09/30/2024"),
    amount: new Decimal(18_000),
    repayment: false,
  },
] as const;

export const connerLoanDetails: LoanDetails = calculateLoan(history); 