import dayjs from "dayjs";
import Decimal from "decimal.js";
import { calculateLoan } from ".";
import type { HistoryEntry, LoanDetails } from "../../types";


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
  {
    date: dayjs("12/31/2024"),
    amount: new Decimal(832),
    repayment: true,
  },
] as const;

export const greggLoanDetails: LoanDetails = calculateLoan(history); 