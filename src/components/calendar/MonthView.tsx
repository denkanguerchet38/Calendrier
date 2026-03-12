"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarEvent } from "@/types";
import EventCard from "./EventCard";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

export default function MonthView({
  currentDate,
  events,
  onEventClick,
  onDayClick,
}: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: fr });
  const calendarEnd = endOfWeek(monthEnd, { locale: fr });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  function getEventsForDay(day: Date) {
    return events.filter((event) => {
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return day >= new Date(start.toDateString()) && day <= new Date(end.toDateString());
    });
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header jours */}
      <div className="grid grid-cols-7 border-b border-surface-200 dark:border-surface-800">
        {dayNames.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Grille */}
      <div className="grid grid-cols-7 flex-1 auto-rows-fr">
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const today = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDayClick(day)}
              className={`min-h-[80px] sm:min-h-[100px] p-1 sm:p-1.5 border-b border-r border-surface-100 dark:border-surface-800/50 cursor-pointer transition-colors hover:bg-surface-50 dark:hover:bg-surface-800/30 ${
                !isCurrentMonth ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs sm:text-sm font-medium w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${
                    today
                      ? "bg-brand-600 text-white"
                      : "text-surface-600 dark:text-surface-300"
                  }`}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-0.5">
                {dayEvents.slice(0, 3).map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                    compact
                  />
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-xs text-surface-400 px-1">
                    +{dayEvents.length - 3} autre{dayEvents.length - 3 > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
