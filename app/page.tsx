"use client";

import { useState } from "react";
import { useDemoData } from "@/lib/use-demo-data";
import { createDemoId } from "@/lib/demo-store";
import type { Holiday, HolidayInput } from "@/lib/types";
import NamePrompt, { useStoredName } from "./components/NamePrompt";
import HolidayForm from "./components/HolidayForm";
import HolidayCard from "./components/HolidayCard";

export default function Home() {
  const { name, saveName, loaded: nameLoaded } = useStoredName();
  const { data, loaded, update } = useDemoData();
  const holidays = [...data.holidays].sort((a, b) =>
    a.start_date.localeCompare(b.start_date)
  );
  const [editingHoliday, setEditingHoliday] = useState<Holiday | "new" | null>(
    null
  );

  async function handleSave(input: HolidayInput) {
    update((current) => {
      if (editingHoliday && editingHoliday !== "new") {
        return {
          ...current,
          holidays: current.holidays.map((holiday) =>
            holiday.id === editingHoliday.id ? { ...holiday, ...input } : holiday
          ),
        };
      }

      const holiday: Holiday = {
        id: createDemoId("holiday"),
        ...input,
        created_at: new Date().toISOString(),
      };
      return { ...current, holidays: [...current.holidays, holiday] };
    });

    setEditingHoliday(null);
  }

  function handleDelete(holiday: Holiday) {
    if (!confirm(`Delete "${holiday.title}" and all its activities?`)) return;
    update((current) => ({
      ...current,
      holidays: current.holidays.filter((item) => item.id !== holiday.id),
      activities: current.activities.filter(
        (activity) => activity.holiday_id !== holiday.id
      ),
    }));
  }

  if (!nameLoaded || !loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Loading your holiday planner…
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      {!name && <NamePrompt onSave={saveName} />}

      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-3">
        <h1 className="text-lg font-semibold text-zinc-900">
          🏖️ Family Holiday Planner
        </h1>
        <p className="mt-0.5 text-xs text-zinc-500">
          Plan trips and organise family activities together
        </p>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">Your holidays</h2>
            <p className="text-sm text-zinc-500">
              {holidays.length} {holidays.length === 1 ? "trip" : "trips"} planned
            </p>
          </div>
          <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600">
            Sample workspace
          </span>
        </div>

        {holidays.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-5 py-12 text-center">
            <p className="font-medium text-zinc-800">No holidays yet</p>
            <p className="mt-1 text-sm text-zinc-500">
              Add your first trip to start planning activities.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {holidays.map((holiday) => (
              <HolidayCard
                key={holiday.id}
                holiday={holiday}
                onEdit={() => setEditingHoliday(holiday)}
                onDelete={() => handleDelete(holiday)}
              />
            ))}
          </div>
        )}
      </main>

      <button
        onClick={() => setEditingHoliday("new")}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-900 text-2xl text-white shadow-lg transition hover:bg-zinc-700"
        aria-label="Add holiday"
      >
        +
      </button>

      {editingHoliday && name && (
        <HolidayForm
          holiday={editingHoliday === "new" ? undefined : editingHoliday}
          defaultName={name}
          onSave={handleSave}
          onCancel={() => setEditingHoliday(null)}
        />
      )}
    </div>
  );
}
