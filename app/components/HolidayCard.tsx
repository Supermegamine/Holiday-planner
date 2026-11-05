"use client";

import Link from "next/link";
import type { Holiday } from "@/lib/types";
import { formatDateRange } from "@/lib/date";

export default function HolidayCard({
  holiday,
  onEdit,
  onDelete,
}: {
  holiday: Holiday;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <Link href={`/holiday?id=${encodeURIComponent(holiday.id)}`} className="min-w-0 flex-1">
        <h3 className="font-medium text-zinc-900">{holiday.title}</h3>
        <p className="mt-0.5 text-sm text-zinc-500">
          {formatDateRange(holiday.start_date, holiday.end_date)}
        </p>
        <p className="mt-2 text-xs text-zinc-400">Added by {holiday.added_by}</p>
      </Link>
      <div className="flex shrink-0 gap-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            onEdit();
          }}
          aria-label="Edit holiday"
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
        >
          ✏️
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete();
          }}
          aria-label="Delete holiday"
          className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
