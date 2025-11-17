// utils/shift.ts (bisa ditempatkan di helper / utils)
function parseIndoDate(dateStr: string): Date | null {
  // contoh: "17/11/2025, 08.40.28" atau "17/11/2025 08:40:28"
  if (!dateStr) return null;
  try {
    const parts = dateStr.split(",").map(p => p.trim());
    const datePart = parts[0];
    const timePart = parts[1] ?? "";

    const [dayStr, monthStr, yearStr] = datePart.split("/").map(s => s.trim());
    if (!dayStr || !monthStr || !yearStr) return null;

    // accept either dot or colon as separator for time
    const timeNormalized = timePart.replace(/\./g, ":").trim(); // "08.40.28" -> "08:40:28"
    const [h = "0", m = "0", s = "0"] = timeNormalized.split(":").map(s => s.trim());

    const day = Number(dayStr);
    const month = Number(monthStr);
    const year = Number(yearStr);
    const hour = Number(h);
    const minute = Number(m);
    const second = Number(s);

    if ([day, month, year].some(isNaN)) return null;

    return new Date(year, month - 1, day, hour || 0, minute || 0, second || 0);
  } catch {
    return null;
  }
}

function parseFlexibleDate(dateStr: string): Date | null {
  if (!dateStr) return null;

  // 1) Try native parse first (ISO or other browser-parseable)
  const maybe = new Date(dateStr);
  if (!isNaN(maybe.getTime())) return maybe;

  // 2) Try Indonesian localized parser
  const indo = parseIndoDate(dateStr);
  if (indo && !isNaN(indo.getTime())) return indo;

  return null;
}

/**
 * Hitung interval (start, end) untuk SHIFT saat ini berdasarkan waktu now.
 * - Shift 1: today 08:00 -> today 20:00
 * - Shift 2: today 20:00 -> tomorrow 08:00  (atau yesterday 20:00 -> today 08:00 bila now < 08:00)
 */
function getCurrentShiftInterval(now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();
  const hour = now.getHours();

  // helper to build Date at day with hh:mm:ss
  const at = (year: number, month: number, day: number, hh = 0, mm = 0, ss = 0) =>
    new Date(year, month, day, hh, mm, ss);

  if (hour >= 8 && hour < 20) {
    // SHIFT 1 -> today 08:00 - today 20:00
    const start = at(y, m, d, 8, 0, 0);
    const end = at(y, m, d, 20, 0, 0);
    return { shift: 1 as const, start, end };
  } else {
    // SHIFT 2 -> spans midnight
    if (hour >= 20) {
      // now is same day evening: shift2 = today 20:00 -> tomorrow 08:00
      const start = at(y, m, d, 20, 0, 0);
      const end = at(y, m, d + 1, 8, 0, 0);
      return { shift: 2 as const, start, end };
    } else {
      // now is after midnight before 08:00: shift2 = yesterday 20:00 -> today 08:00
      const start = at(y, m, d - 1, 20, 0, 0);
      const end = at(y, m, d, 8, 0, 0);
      return { shift: 2 as const, start, end };
    }
  }
}

/**
 * Cek apakah lastTimeStr (string) berada di dalam interval shift saat ini.
 * Mengembalikan objek { isInCurrentShift, shift, start, end, lastDate }
 */
export function isInCurrentShiftInterval(lastTimeStr: string | undefined | null) {
  if (!lastTimeStr) return { isInCurrentShift: false, reason: "no-last-time" };

  const last = parseFlexibleDate(lastTimeStr);
  if (!last) return { isInCurrentShift: false, reason: "unparseable" };

  const { shift, start, end } = getCurrentShiftInterval(new Date());

  // compare
  const isInCurrentShift = last.getTime() >= start.getTime() && last.getTime() < end.getTime();

  return { isInCurrentShift, shift, start, end, lastDate: last };
}
