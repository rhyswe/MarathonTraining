import { supabase } from "./supabaseClient";
import { isoDate } from "./format";

// Fetch all workout rows whose date falls within [startDate, endDate], inclusive.
export async function fetchWorkoutsInRange(startDate, endDate) {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .gte("date", isoDate(startDate))
    .lte("date", isoDate(endDate));

  if (error) throw error;

  // Index by date string for O(1) lookup when rendering the grid.
  const byDate = {};
  for (const row of data) {
    byDate[row.date] = row;
  }
  return byDate;
}

// Upserts one half (planned or actual) of a single day's workout.
// `section` is "planned" or "actual". `fields` is the partial set of
// columns for that section, e.g. { type, workout_name, distance_mi, duration_min, notes }.
export async function saveWorkoutSection(date, section, fields) {
  const prefix = section === "planned" ? "planned_" : "actual_";

  const payload = {
    date: isoDate(date),
    [`${prefix}type`]: fields.type ?? null,
    [`${prefix}workout_name`]: fields.workoutName ?? null,
    [`${prefix}distance_mi`]: fields.distanceMi ?? null,
    [`${prefix}duration_min`]: fields.durationMin ?? null,
    [`${prefix}notes`]: fields.notes ?? null,
  };

  const { data, error } = await supabase
    .from("workouts")
    .upsert(payload, { onConflict: "date" })
    .select()
    .single();

  if (error) throw error;
  return data;
}
