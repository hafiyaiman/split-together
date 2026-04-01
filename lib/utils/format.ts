const amountFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatAmount(value: number) {
  return amountFormatter.format(value);
}

export function formatSignedAmount(value: number) {
  if (value === 0) {
    return "0.00";
  }

  const sign = value > 0 ? "+" : "-";
  return `${sign}${formatAmount(Math.abs(value))}`;
}
