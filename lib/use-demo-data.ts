"use client";

import { useCallback, useEffect, useState } from "react";
import {
  readDemoData,
  updateDemoData,
  type HolidayDemoData,
} from "@/lib/demo-store";

const EMPTY_DATA: HolidayDemoData = {
  holidays: [],
  activities: [],
  lastOpenedOn: "",
};

export function useDemoData() {
  const [data, setData] = useState<HolidayDemoData>(EMPTY_DATA);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setData(readDemoData());
    setLoaded(true);

    const sync = () => setData(readDemoData());
    window.addEventListener("holiday-planner-demo-updated", sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener("holiday-planner-demo-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback(
    (updater: (current: HolidayDemoData) => HolidayDemoData) => {
      const next = updateDemoData(updater);
      setData(next);
      return next;
    },
    []
  );

  return { data, loaded, update };
}
