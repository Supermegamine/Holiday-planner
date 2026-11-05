"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useDemoData } from "@/lib/use-demo-data";
import { createDemoId } from "@/lib/demo-store";
import type { Activity, ActivityInput } from "@/lib/types";
import { formatDateRange, getMonthsInRange } from "@/lib/date";
import { useStoredName } from "@/app/components/NamePrompt";
import NamePrompt from "@/app/components/NamePrompt";
import CalendarMonth from "@/app/components/CalendarMonth";
import AgendaView from "@/app/components/AgendaView";
import DayDetailModal from "@/app/components/DayDetailModal";
import ActivityForm from "@/app/components/ActivityForm";

export default function HolidayPage() {
  const { data, loaded, update } = useDemoData();
  const { name, saveName } = useStoredName();
  const [holidayId, setHolidayId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<Activity | "new" | null>(
    null
  );

  useEffect(() => {
    setHolidayId(new URLSearchParams(window.location.search).get("id"));
  }, []);

  const holiday = data.holidays.find((item) => item.id === holidayId) ?? null;
  const activities = data.activities.filter(
    (activity) => activity.holiday_id === holidayId
  );

  const activitiesByDate = useMemo(() => {
    const grouped = new Map<string, Activity[]>();
    for (const activity of activities) {
      if (!activity.activity_date) continue;
      if (!grouped.has(activity.activity_date)) {
        grouped.set(activity.activity_date, []);
      }
      grouped.get(activity.activity_date)!.push(activity);
    }
    for (const dayActivities of grouped.values()) {
      dayActivities.sort((a, b) => {
        if (!a.activity_time) return 1;
        if (!b.activity_time) return -1;
        return a.activity_time.localeCompare(b.activity_time);
      });
    }
    return grouped;
  }, [activities]);

  function handleSave(input: ActivityInput) {
    update((current) => {
      if (editingActivity && editingActivity !== "new") {
        return {
          ...current,
          activities: current.activities.map((activity) =>
            activity.id === editingActivity.id
              ? {
                  ...activity,
                  title: input.title,
                  description: input.description || null,
                  activity_date: input.activity_date || null,
                  activity_time: input.activity_time || null,
                  location: input.location || null,
                  added_by: input.added_by,
                }
              : activity
          ),
        };
      }

      const activity: Activity = {
        id: createDemoId("activity"),
        title: input.title,
        description: input.description || null,
        activity_date: input.activity_date || null,
        activity_time: input.activity_time || null,
        location: input.location || null,
        added_by: input.added_by,
        holiday_id: input.holiday_id,
        created_at: new Date().toISOString(),
      };
      return { ...current, activities: [...current.activities, activity] };
    });

    setEditingActivity(null);
    setSelectedDate(null);
  }

  function handleDelete(activity: Activity) {
    if (!confirm(`Delete "${activity.title}"?`)) return;
    update((current) => ({
      ...current,
      activities: current.activities.filter((item) => item.id !== activity.id),
    }));
  }

  if (!loaded || holidayId === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500">
        Loading holiday…
      </div>
    );
  }

  if (!holiday) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4">
        <p className="text-center text-zinc-700">Holiday not found in this browser.</p>
        <Link href="/" className="mt-4 text-zinc-900 underline">
          Back to holidays
        </Link>
      </div>
    );
  }

  const months = getMonthsInRange(holiday.start_date, holiday.end_date);
  const selectedActivities = selectedDate
    ? activitiesByDate.get(selectedDate) ?? []
    : [];

  return (
    <div className="flex min-h-full flex-col bg-zinc-50">
      {!name && <NamePrompt onSave={saveName} />}

      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white px-4 py-3">
        <Link href="/" className="text-sm text-zinc-500 hover:underline">
          ← Holidays
        </Link>
        <h1 className="mt-1 text-lg font-semibold text-zinc-900">{holiday.title}</h1>
        <p className="text-sm text-zinc-500">
          {formatDateRange(holiday.start_date, holiday.end_date)}
        </p>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-4">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-zinc-900">Trip itinerary</h2>
          <p className="text-sm text-zinc-500">
            Select a day to add, edit, or remove activities.
          </p>
        </div>

        <div className="sm:hidden">
          <AgendaView
            rangeStart={holiday.start_date}
            rangeEnd={holiday.end_date}
            activitiesByDate={activitiesByDate}
            onDayClick={(dateStr) => setSelectedDate(dateStr)}
          />
        </div>

        <div className="hidden flex-col gap-6 sm:flex">
          {months.map(({ year, month }) => (
            <CalendarMonth
              key={`${year}-${month}`}
              year={year}
              month={month}
              rangeStart={holiday.start_date}
              rangeEnd={holiday.end_date}
              activitiesByDate={activitiesByDate}
              onDayClick={(dateStr) => setSelectedDate(dateStr)}
            />
          ))}
        </div>
      </main>

      {selectedDate && !editingActivity && (
        <DayDetailModal
          date={selectedDate}
          activities={selectedActivities}
          onClose={() => setSelectedDate(null)}
          onEdit={(activity) => setEditingActivity(activity)}
          onDelete={handleDelete}
          onAddNew={() => setEditingActivity("new")}
        />
      )}

      {editingActivity && name && selectedDate && (
        <ActivityForm
          key={editingActivity === "new" ? "new-activity" : editingActivity.id}
          activity={editingActivity === "new" ? undefined : editingActivity}
          defaultName={name}
          holidayId={holiday.id}
          initialDate={selectedDate}
          onSave={async (input) => handleSave(input)}
          onCancel={() => setEditingActivity(null)}
        />
      )}
    </div>
  );
}
