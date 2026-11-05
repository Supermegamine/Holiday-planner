import type { Activity, Holiday } from "@/lib/types";

export type HolidayDemoData = {
  holidays: Holiday[];
  activities: Activity[];
  lastOpenedOn: string;
};

const STORAGE_KEY = "family-holiday-planner-demo-v1";

export function localDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateString: string, days: number): string {
  const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.slice(0, 10).split("-").map(Number);
  const [ty, tm, td] = to.slice(0, 10).split("-").map(Number);
  return Math.round(
    (Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86400000
  );
}

export function createDemoId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createDemoData(): HolidayDemoData {
  const today = localDateString();
  const holidays: Holiday[] = [
    {
      id: "holiday-copenhagen",
      title: "Long weekend in Copenhagen",
      start_date: addDays(today, 18),
      end_date: addDays(today, 21),
      added_by: "Alex",
      created_at: new Date().toISOString(),
    },
    {
      id: "holiday-crete",
      title: "Summer by the sea in Crete",
      start_date: addDays(today, 42),
      end_date: addDays(today, 48),
      added_by: "Sam",
      created_at: new Date().toISOString(),
    },
    {
      id: "holiday-alps",
      title: "Family adventure in the Alps",
      start_date: addDays(today, 92),
      end_date: addDays(today, 98),
      added_by: "Alex",
      created_at: new Date().toISOString(),
    },
  ];

  const [copenhagen, crete, alps] = holidays;
  const activity = (
    id: string,
    holiday: Holiday,
    dayOffset: number | null,
    title: string,
    time: string | null,
    location: string | null,
    description: string,
    addedBy = "Alex"
  ): Activity => ({
    id,
    title,
    description,
    activity_date: dayOffset === null ? null : addDays(holiday.start_date, dayOffset),
    activity_time: time,
    location,
    added_by: addedBy,
    holiday_id: holiday.id,
    created_at: new Date().toISOString(),
  });

  const activities: Activity[] = [
    activity("activity-cph-1", copenhagen, 0, "Arrive & settle in", "14:00", "Copenhagen Central Station", "Check in, unpack, and take an easy first walk."),
    activity("activity-cph-2", copenhagen, 0, "Dinner at the food market", "19:00", "Torvehallerne", "Try a few local favourites and keep the first evening relaxed.", "Sam"),
    activity("activity-cph-3", copenhagen, 1, "Explore the old harbour", "10:00", "Nyhavn", "Walk along the colourful waterfront and take family photos."),
    activity("activity-cph-4", copenhagen, 1, "Canal boat tour", "13:30", "Ved Stranden", "See the city from the water. Book tickets ahead."),
    activity("activity-cph-5", copenhagen, 2, "Botanical Garden", "10:30", "Botanical Garden", "A gentle morning among the glasshouses and gardens."),
    activity("activity-cph-6", copenhagen, 3, "Brunch & departure", "09:00", "Vesterbro", "Enjoy a slow breakfast before heading home."),
    activity("activity-cph-7", copenhagen, null, "Look up family bike rental", null, null, "Compare child seats and helmets before the trip.", "Sam"),

    activity("activity-crete-1", crete, 0, "Arrive in Chania", "12:30", "Chania Airport", "Pick up the rental car and check in to the apartment."),
    activity("activity-crete-2", crete, 0, "Sunset in the old harbour", "19:30", "Venetian Harbour", "Easy stroll and dinner by the water."),
    activity("activity-crete-3", crete, 1, "Beach day", "10:00", "Agioi Apostoloi", "Pack snacks, sun cream, and beach games.", "Sam"),
    activity("activity-crete-4", crete, 2, "Visit a mountain village", "09:30", "Theriso", "Scenic drive and a long lunch in the village."),
    activity("activity-crete-5", crete, 3, "Boat trip", "11:00", "Kissamos Port", "A day on the water. Check sea conditions the evening before."),
    activity("activity-crete-6", crete, 4, "Free afternoon & ice cream", "16:00", "Chania Old Town", "Keep the afternoon flexible for everyone."),
    activity("activity-crete-7", crete, 5, "Family cooking class", "17:00", "Chania", "Make a few Cretan dishes together."),
    activity("activity-crete-8", crete, 6, "Pack and head home", "08:30", "Chania", "Allow time for the airport and rental car return."),

    activity("activity-alps-1", alps, 0, "Arrive at the chalet", "15:00", "Annecy", "Unpack, explore nearby, and pick up groceries."),
    activity("activity-alps-2", alps, 1, "Lakeside cycle", "09:30", "Lake Annecy", "Easy family route with a picnic stop."),
    activity("activity-alps-3", alps, 2, "Mountain cable car", "10:00", "La Clusaz", "Check the weather and bring warm layers."),
    activity("activity-alps-4", alps, 3, "Rest day & board games", "14:00", "The chalet", "A flexible day in case everyone needs a slower pace."),
    activity("activity-alps-5", alps, 4, "Farm visit", "11:00", "Local alpine farm", "Meet the animals and try regional cheese."),
    activity("activity-alps-6", alps, 5, "Short family hike", "09:00", "Semnoz", "Choose a trail based on the weather and the kids' energy."),
    activity("activity-alps-7", alps, 6, "Breakfast & departure", "08:00", "Annecy", "Pack up and start the journey home."),
  ];

  return { holidays, activities, lastOpenedOn: today };
}

function rebaseData(data: HolidayDemoData, today: string): HolidayDemoData {
  const previousDate = data.lastOpenedOn || today;
  const elapsedDays = daysBetween(previousDate, today);
  if (elapsedDays === 0 && data.lastOpenedOn === today) return data;

  return {
    ...data,
    lastOpenedOn: today,
    holidays: data.holidays.map((holiday) => ({
      ...holiday,
      start_date: addDays(holiday.start_date, elapsedDays),
      end_date: addDays(holiday.end_date, elapsedDays),
    })),
    activities: data.activities.map((activity) => ({
      ...activity,
      activity_date: activity.activity_date
        ? addDays(activity.activity_date, elapsedDays)
        : null,
    })),
  };
}

function notifyUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("holiday-planner-demo-updated"));
  }
}

export function readDemoData(): HolidayDemoData {
  if (typeof window === "undefined") return createDemoData();

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as HolidayDemoData;
      const rebased = rebaseData(parsed, localDateString());
      if (rebased !== parsed) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rebased));
      }
      return rebased;
    }
  } catch {
    // Replace malformed or inaccessible storage with the built-in sample data.
  }

  const initial = createDemoData();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // The demo remains usable in memory if browser storage is unavailable.
  }
  return initial;
}

export function updateDemoData(
  updater: (current: HolidayDemoData) => HolidayDemoData
): HolidayDemoData {
  const next = updater(readDemoData());
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Keep the current session interactive if storage is blocked.
    }
    notifyUpdate();
  }
  return next;
}

export function resetDemoData(): void {
  const fresh = createDemoData();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Reloading restores the built-in sample dataset.
    }
    notifyUpdate();
  }
}
