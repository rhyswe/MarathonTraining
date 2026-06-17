// All durations are stored in the database as total minutes (integer).
// The UI splits that into hours + minutes for entry and display.

export function hmToMinutes(hours, minutes) {
  const h = Number(hours) || 0;
  const m = Number(minutes) || 0;
  const total = h * 60 + m;
  return total > 0 ? total : null;
}

export function minutesToHM(totalMinutes) {
  if (totalMinutes === null || totalMinutes === undefined) {
    return { hours: "", minutes: "" };
  }
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return { hours: h || "", minutes: m || "" };
}

export function formatDuration(totalMinutes) {
  if (!totalMinutes) return null;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function formatDistance(distanceMi) {
  if (!distanceMi) return null;
  // Trim trailing .0 but keep one decimal for fractional miles.
  const rounded = Math.round(distanceMi * 10) / 10;
  return `${rounded} mi`;
}

// Returns pace in minutes-per-mile as a float, or null if it can't be computed.
export function calculatePaceMinPerMile(distanceMi, durationMin) {
  if (!distanceMi || !durationMin || distanceMi <= 0) return null;
  return durationMin / distanceMi;
}

export function formatPace(paceMinPerMile) {
  if (!paceMinPerMile) return null;
  const totalSeconds = Math.round(paceMinPerMile * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")} /mi`;
}

export function isoDate(date) {
  // Local-date safe YYYY-MM-DD (avoids UTC off-by-one issues from toISOString).
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}
