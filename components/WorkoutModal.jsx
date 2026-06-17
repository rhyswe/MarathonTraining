"use client";

import { useState } from "react";
import { format } from "date-fns";
import { hmToMinutes, minutesToHM } from "../lib/format";
import { saveWorkoutSection } from "../lib/workouts";

export default function WorkoutModal({ date, section, initialData, onClose, onSaved }) {
  const isPlanned = section === "planned";
  const startHM = minutesToHM(initialData?.durationMin);

  const [type, setType] = useState(initialData?.type || "run");
  const [workoutName, setWorkoutName] = useState(initialData?.workoutName || "");
  const [distanceMi, setDistanceMi] = useState(initialData?.distanceMi ?? "");
  const [hours, setHours] = useState(startHM.hours);
  const [minutes, setMinutes] = useState(startHM.minutes);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const durationMin = hmToMinutes(hours, minutes);
      const row = await saveWorkoutSection(date, section, {
        type,
        workoutName: type === "other" ? workoutName.trim() || null : null,
        distanceMi: type === "run" && distanceMi !== "" ? Number(distanceMi) : null,
        durationMin,
        notes: notes.trim() || null,
      });
      onSaved(row);
      onClose();
    } catch (err) {
      setError(err.message || "Something went wrong saving this entry.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-sm bg-surface p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="font-display text-xl text-ink">
            {isPlanned ? "Plan" : "Log"}
            <span className="ml-2 font-mono text-sm text-ink-soft">
              {format(date, "EEE, MMM d")}
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-ink-soft hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="type"
                value="run"
                checked={type === "run"}
                onChange={() => setType("run")}
                className={isPlanned ? "accent-bib" : "accent-trail"}
              />
              Run
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="type"
                value="other"
                checked={type === "other"}
                onChange={() => setType("other")}
                className={isPlanned ? "accent-bib" : "accent-trail"}
              />
              Other
            </label>
          </div>

          {type === "other" && (
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
                Workout name
              </label>
              <input
                type="text"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                placeholder="Strength, bike, yoga..."
                className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm"
              />
            </div>
          )}

          {type === "run" && (
            <div>
              <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
                Distance (miles)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={distanceMi}
                onChange={(e) => setDistanceMi(e.target.value)}
                placeholder="0.0"
                className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm font-mono"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
              Duration
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm font-mono"
                />
                <span className="mt-1 block text-xs text-ink-soft">hours</span>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm font-mono"
                />
                <span className="mt-1 block text-xs text-ink-soft">minutes</span>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wide text-ink-soft">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="How it felt, weather, route..."
              className="w-full rounded-sm border border-line bg-surface px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm text-bib">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm px-4 py-2 text-sm text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`rounded-sm px-4 py-2 text-sm font-medium text-white ${
                isPlanned ? "bg-bib" : "bg-trail"
              } disabled:opacity-50`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
