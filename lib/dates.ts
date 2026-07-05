/** Date helpers for "YYYY-MM-DD" strings (no timezone surprises: all math is
    done in UTC on the date part only). */

export function toDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function parseKey(key: string): Date {
  return new Date(`${key}T00:00:00Z`);
}

/** Inclusive list of date keys from start to end. Empty if range is invalid.
    Capped at 60 days to keep trips (and the UI) sane. */
export function dateRange(startDate: string, endDate: string): string[] {
  const start = parseKey(startDate);
  const end = parseKey(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) return [];
  const out: string[] = [];
  const cur = new Date(start);
  while (cur <= end && out.length < 60) {
    out.push(toDateKey(cur));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

const DAY_FMT = new Intl.DateTimeFormat("en-PH", {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

const RANGE_FMT = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

/** "Sat · Jul 5" */
export function formatDay(key: string): string {
  const parts = DAY_FMT.formatToParts(parseKey(key));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("weekday")} · ${get("month")} ${get("day")}`;
}

/** "Jul 5 to Jul 9" (single date if same day) */
export function formatRange(startDate: string, endDate: string): string {
  const s = RANGE_FMT.format(parseKey(startDate));
  const e = RANGE_FMT.format(parseKey(endDate));
  return s === e ? s : `${s} to ${e}`;
}
