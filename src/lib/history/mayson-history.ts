import dayjs from "dayjs";
import Decimal from "decimal.js";
import { calculateLoan } from ".";
import type { HistoryEntry, LoanDetails } from "../../types";


const history: HistoryEntry[] = [
  {
    date: dayjs("11/01/2024"),
    amount: new Decimal(182_000),
    repayment: false,
  },
  {
    date: dayjs("01/02/2025"),
    amount: new Decimal(1_552.23),
    repayment: true,
  },
] as const;

export const maysonLoanDetails: LoanDetails = calculateLoan(history); 