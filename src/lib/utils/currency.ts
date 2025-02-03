import Decimal from 'decimal.js';

export function formatCurrency(amount: Decimal | number): string {
  const value = new Decimal(amount);
  return value.toNumber().toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function parseAmount(amount: string): Decimal {
  const cleanAmount = amount.replace(/[^0-9.-]/g, '');
  return new Decimal(cleanAmount);
}