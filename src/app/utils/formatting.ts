export const pct = (n: number, digits = 0) => `${n.toFixed(digits)}%`;
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
