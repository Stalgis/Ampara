// src/utils/callFilters.ts
export type CallItem = { date: string };
export type CallFilter = "Last 7 days" | "Last 30 days" | "All";

export function parseMDYTime(input: string): Date | null {
  const [datePartRaw, timePartRaw] = input.split(",").map((s) => s?.trim());
  if (!datePartRaw) return null;

  const [mm, dd, yyyy] = datePartRaw.split("/").map((n) => parseInt(n, 10));
  if (!(mm >= 1 && mm <= 12) || !(dd >= 1 && dd <= 31) || !yyyy) return null;

  let hours = 0,
    minutes = 0;
  if (timePartRaw) {
    const m = timePartRaw.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
    if (m) {
      hours = parseInt(m[1], 10) % 12;
      minutes = parseInt(m[2], 10);
      if (m[3].toUpperCase() === "PM") hours += 12;
    }
  }
  return new Date(yyyy, mm - 1, dd, hours, minutes);
}

export function daysBetween(a: Date, b: Date): number {
  const A = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const B = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.floor((A - B) / (1000 * 60 * 60 * 24));
}

export function filterCalls(
  calls: CallItem[],
  callFilter: CallFilter,
  now = new Date()
): CallItem[] {
  const limit =
    callFilter === "Last 7 days"
      ? 7
      : callFilter === "Last 30 days"
        ? 30
        : Infinity;

  return calls.filter((c) => {
    const d = parseMDYTime(c.date);
    if (!d) return false;
    const diff = daysBetween(now, d);
    return diff < limit;
  });
}
