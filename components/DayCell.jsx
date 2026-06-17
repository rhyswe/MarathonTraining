"use client";

import {
  calculatePaceMinPerMile,
  formatDistance,
  formatDuration,
  formatPace,
} from "../lib/format";

function plannedSummary(workout) {
  if (!workout?.planned_type) return null;
  const label = workout.planned_type === "run" ? "Run" : workout.planned_workout_name || "Other";
  const distance = formatDistance(workout.planned_distance_mi);
  const duration = formatDuration(workout.planned_duration_min);
  return { label, distance, duration };
}

function actualSummary(workout) {
  if (!workout?.actual_type) return null;
  const label = workout.actual_type === "run" ? "Run" : workout.actual_workout_name || "Other";
  const distance = formatDistance(workout.actual_distance_mi);
  const duration = formatDuration(workout.actual_duration_min);
  const pace =
    workout.actual_type === "run"
      ? formatPace(calculatePaceMinPerMile(workout.actual_distance_mi, workout.actual_duration_min))
      : null;
  return { label, distance, duration, pace };
}

export default function DayCell({ date, dayNumber, isCurrentMonth, isToday, workout, onEditPlanned, onEditActual }) {
  const planned = plannedSummary(workout);
  const actual = actualSummary(workout);

  return (
    <div
      className={`flex h-32 flex-col border-b border-r border-line ${
        isCurrentMonth ? "bg-surface" : "bg-surface-muted"
      }`}
    >
      <div className="flex items-center justify-between px-2 pt-1.5">
        <span
          className={`font-mono text-xs ${
            isToday
              ? "rounded-full bg-bib px-1.5 py-0.5 font-medium text-white"
              : isCurrentMonth
              ? "text-ink-soft"
              : "text-ink-soft/40"
          }`}
        >
          {dayNumber}
        </span>
      </div>

      <button
        type="button"
        onClick={() => onEditPlanned(date)}
        className="flex-1 px-2 py-1 text-left hover:bg-bib-soft/30"
      >
        {planned ? (
          <div className="text-xs">
            <div className="font-medium text-bib">{planned.label}</div>
            <div className="font-mono text-ink-soft">
              {[planned.distance, planned.duration].filter(Boolean).join(" · ") || "—"}
            </div>
          </div>
        ) : (
          isCurrentMonth && <div className="text-xs italic text-ink-soft/60">+ plan</div>
        )}
      </button>

      <div className="split-line mx-2" />

      <button
        type="button"
        onClick={() => onEditActual(date)}
        className="flex-1 px-2 py-1 text-left hover:bg-trail-soft/30"
      >
        {actual ? (
          <div className="text-xs">
            <div className="font-medium text-trail">{actual.label}</div>
            <div className="font-mono text-ink-soft">
              {[actual.distance, actual.duration, actual.pace].filter(Boolean).join(" · ")}
            </div>
          </div>
        ) : (
          isCurrentMonth && (
            <div className="text-xs italic text-ink-soft/60">
              {planned ? "log run" : ""}
            </div>
          )
        )}
      </button>
    </div>
  );
}
