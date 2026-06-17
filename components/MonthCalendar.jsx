"use client";

import { useEffect, useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
} from "date-fns";
import DayCell from "./DayCell";
import WorkoutModal from "./WorkoutModal";
import { fetchWorkoutsInRange } from "../lib/workouts";
import { isoDate } from "../lib/format";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthCalendar() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));
  const [workoutsByDate, setWorkoutsByDate] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState(null); // { date, section, initialData }

  const gridStart = useMemo(() => startOfWeek(startOfMonth(currentMonth)), [currentMonth]);
  const gridEnd = useMemo(() => endOfWeek(endOfMonth(currentMonth)), [currentMonth]);
  const days = useMemo(() => eachDayOfInterval({ start: gridStart, end: gridEnd }), [gridStart, gridEnd]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchWorkoutsInRange(gridStart, gridEnd)
      .then((data) => {
        if (!cancelled) setWorkoutsByDate(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Couldn't load workouts.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [gridStart, gridEnd]);

  function openPlannedEditor(date) {
    const workout = workoutsByDate[isoDate(date)];
    setModalState({
      date,
      section: "planned",
      initialData: {
        type: workout?.planned_type || "run",
        workoutName: workout?.planned_workout_name || "",
        distanceMi: workout?.planned_distance_mi ?? "",
        durationMin: workout?.planned_duration_min ?? null,
        notes: workout?.planned_notes || "",
      },
    });
  }

  function openActualEditor(date) {
    const workout = workoutsByDate[isoDate(date)];
    setModalState({
      date,
      section: "actual",
      initialData: {
        type: workout?.actual_type || "run",
        workoutName: workout?.actual_workout_name || "",
        distanceMi: workout?.actual_distance_mi ?? "",
        durationMin: workout?.actual_duration_min ?? null,
        notes: workout?.actual_notes || "",
      },
    });
  }

  function handleSaved(row) {
    setWorkoutsByDate((prev) => ({ ...prev, [row.date]: row }));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">{format(currentMonth, "MMMM yyyy")}</h1>
        <div className="flex items-center gap-2 font-mono text-sm">
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="rounded-sm border border-line px-3 py-1.5 hover:bg-surface-muted"
          >
            ← Prev
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth(startOfMonth(new Date()))}
            className="rounded-sm border border-line px-3 py-1.5 hover:bg-surface-muted"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="rounded-sm border border-line px-3 py-1.5 hover:bg-surface-muted"
          >
            Next →
          </button>
        </div>
      </div>

      {error && (
        <p className="mb-4 rounded-sm border border-bib-soft bg-bib-soft/30 px-3 py-2 text-sm text-bib">
          {error}
        </p>
      )}

      <div className="grid grid-cols-7 border-l border-t border-line text-xs">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="border-b border-r border-line bg-surface-muted px-2 py-1.5 font-mono uppercase tracking-wide text-ink-soft"
          >
            {label}
          </div>
        ))}

        {days.map((date) => {
          const key = isoDate(date);
          return (
            <DayCell
              key={key}
              date={date}
              dayNumber={format(date, "d")}
              isCurrentMonth={isSameMonth(date, currentMonth)}
              isToday={isSameDay(date, new Date())}
              workout={workoutsByDate[key]}
              onEditPlanned={openPlannedEditor}
              onEditActual={openActualEditor}
            />
          );
        })}
      </div>

      {loading && <p className="mt-3 text-xs text-ink-soft">Loading...</p>}

      <div className="mt-4 flex gap-4 font-mono text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-bib" /> planned
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-trail" /> actual
        </span>
      </div>

      {modalState && (
        <WorkoutModal
          date={modalState.date}
          section={modalState.section}
          initialData={modalState.initialData}
          onClose={() => setModalState(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
