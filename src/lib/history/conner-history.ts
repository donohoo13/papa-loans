import dayjs from "dayjs";
import Decimal from "decimal.js";
import { calculateLoan } from ".";
import type { HistoryEntry, LoanDetails } from "../../types";


const history: HistoryEntry[] = [
  {
    date: dayjs("10/01/2024"),
    amount: new Decimal(18_000),
    repayment: false,
  },
  {
    date: dayjs("10/18/2024"),
    amount: new Decimal(15_000),
    repayment: false,
  },
  {
    date: dayjs("11/01/2024"),
    amount: new Decimal(1_500),
    repayment: true,
  },
  {
    date: dayjs("03/22/2025"),
    amount: new Decimal(1_500),
    repayment: true,
  },
] as const;

export const connerLoanDetails: LoanDetails = calculateLoan(history); 