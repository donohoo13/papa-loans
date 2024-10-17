import Decimal from "decimal.js";
import dayjs from "dayjs";
import type { DailyBalance, HistoryEntry, LoanDetails } from "../../types";
import { calculateLoan } from ".";


const history: HistoryEntry[] = [
  {
    date: dayjs("10-10-2024", "MM-DD-YYYY"),
    amount: new Decimal(38_318),
    repayment: false,
  },
] as const;

export const tatumLoanDetails: LoanDetails = calculateLoan(history); 