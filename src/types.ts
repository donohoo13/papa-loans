import type { Dayjs } from "dayjs";
import type Decimal from "decimal.js";

export type HistoryEntry = {
  date: Dayjs;
  amount: Decimal;
  repayment: boolean;
};

export type DailyBalance = {
  balance: Decimal;
  interestAdded: Decimal;
  date: Dayjs;
};

export type LoanDetails = {
    history: HistoryEntry[];
    totalInterestAccrued: Decimal;
    totalRepayments: Decimal;
    currentBalance: Decimal;
    dailyBalance: DailyBalance[];
}

export type ContentTab = {
    index: number;
    label: string;
}