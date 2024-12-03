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
  {
    date: dayjs("10/31/2024"),
    amount: new Decimal(832),
    repayment: true,
  },
  {
    date: dayjs("11/30/2024"),
    amount: new Decimal(832),
    repayment: true,
  },
] as const;

export const greggLoanDetails: LoanDetails = calculateLoan(history); 