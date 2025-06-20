import dayjs from "dayjs";
import Decimal from "decimal.js";
import { calculateLoan } from ".";
import type { HistoryEntry, LoanDetails } from "../../types";

const history: HistoryEntry[] = [
  {
    date: dayjs("10/10/2024"),
    amount: new Decimal(38_318),
    repayment: false,
  },
  {
    date: dayjs("11/15/2024"),
    amount: new Decimal(778.47),
    repayment: true,
  },
  {
    date: dayjs("12/16/2024"),
    amount: new Decimal(760.17),
    repayment: true,
  },
  {
    date: dayjs("01/15/2025"),
    amount: new Decimal(752.54),
    repayment: true,
  },
  {
    date: dayjs("03/18/2025"),
    amount: new Decimal(752.54),
    repayment: true,
  },
  {
    date: dayjs("04/16/2025"),
    amount: new Decimal(740.3),
    repayment: true,
  },
  {
    date: dayjs("05/15/2025"),
    amount: new Decimal(737.92),
    repayment: true,
  },
  {
    date: dayjs("06/17/2025"),
    amount: new Decimal(754.23),
    repayment: true,
  },
] as const;

export const tatumLoanDetails: LoanDetails = calculateLoan(history);
