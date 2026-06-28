const longDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

export const formatDate = (d: Date | string) =>
  longDate.format(typeof d === "string" ? new Date(d) : d);

export const daysBetween = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / 86_400_000);
