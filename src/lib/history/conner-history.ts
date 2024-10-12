import Decimal from "decimal.js";
import dayjs from "dayjs";
import type { DailyBalance, HistoryEntry, LoanDetails } from "../../types";
import { calculateLoan } from ".";


const history: HistoryEntry[] = [
  {
    date: dayjs("9-30-2024", "M-D-YYYY", true),
    amount: new Decimal(18_000),
    repayment: false,
  },
] as const;

export const connerLoanDetails: LoanDetails = calculateLoan(history); 