"use client";

import { CalendarEvent, CalendarViewMode } from "@/types";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";

interface CalendarViewProps {
  viewMode: CalendarViewMode;
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date) => void;
}

export default function CalendarView({
  viewMode,
  currentDate,
  events,
  onEventClick,
  onSlotClick,
}: CalendarViewProps) {
  switch (viewMode) {
    case "month":
      return (
        <MonthView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onDayClick={onSlotClick}
        />
      );
    case "week":
      return (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      );
    case "day":
      return (
        <DayView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      );
  }
}
