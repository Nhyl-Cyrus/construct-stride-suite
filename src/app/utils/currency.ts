const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const formatUSD = (n: number) => usd.format(n);
export const formatMillions = (n: number) => `$${(n / 1_000_000).toFixed(2)}M`;
