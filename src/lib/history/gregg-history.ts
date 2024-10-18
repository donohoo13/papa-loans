import Decimal from "decimal.js";
import dayjs from "dayjs";
import type {  HistoryEntry, LoanDetails } from "../../types";
import { calculateLoan } from ".";


const history: HistoryEntry[] = [
  {
    date: dayjs("10/01/2024"),
    amount: new Decimal(200_000),
    repayment: false,
  },
] as const;

export const greggLoanDetails: LoanDetails = calculateLoan(history); 