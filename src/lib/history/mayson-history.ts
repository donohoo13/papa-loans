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
  {
    date: dayjs("02/01/2025"),
    amount: new Decimal(758.33),
    repayment: true,
  },
  {
    date: dayjs("03/01/2025"),
    amount: new Decimal(758.33),
    repayment: true,
  },
  {
    date: dayjs("04/01/2025"),
    amount: new Decimal(758.33),
    repayment: true,
  },
  {
    date: dayjs("05/01/2025"),
    amount: new Decimal(758.33),
    repayment: true,
  },
  {
    date: dayjs("06/01/2025"),
    amount: new Decimal(758.33),
    repayment: true,
  },
  {
    date: dayjs("07/01/2025"),
    amount: new Decimal(758.33),
    repayment: true,
  },
] as const;

export const maysonLoanDetails: LoanDetails = calculateLoan(history);
