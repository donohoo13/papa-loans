import dayjs from "dayjs";
import Decimal from "decimal.js";
import { calculateLoan } from ".";
import type { HistoryEntry, LoanDetails } from "../../types";

const history: HistoryEntry[] = [
  {
    date: dayjs("10/18/2024"),
    amount: new Decimal(110_616),
    repayment: false,
  },
  {
    date: dayjs("10/31/2024"),
    amount: new Decimal(981),
    repayment: true,
  },
  {
    date: dayjs("11/30/2024"),
    amount: new Decimal(981),
    repayment: true,
  },
  {
    date: dayjs("12/31/2024"),
    amount: new Decimal(981),
    repayment: true,
  },
  {
    date: dayjs("01/31/2025"),
    amount: new Decimal(981),
    repayment: true,
  },
  {
    date: dayjs("02/28/2025"),
    amount: new Decimal(981),
    repayment: true,
  },
  {
    date: dayjs("03/31/2025"),
    amount: new Decimal(981),
    repayment: true,
  },
  {
    date: dayjs("05/01/2025"),
    amount: new Decimal(981),
    repayment: true,
  },
  {
    date: dayjs("05/31/2025"),
    amount: new Decimal(931),
    repayment: true,
  },
] as const;

export const erikLoanDetails: LoanDetails = calculateLoan(history);
