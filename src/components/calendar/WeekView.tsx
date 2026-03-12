"use client";

import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  eachHourOfInterval,
  isSameDay,
  isToday,
  format,
  set,
} from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarEvent } from "@/types";
import { getEventTypeConfig } from "@/constants/eventTypes";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date) => void;
}

export default function WeekView({
  currentDate,
  events,
  onEventClick,
  onSlotClick,
}: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { locale: fr });
  const weekEnd = endOfWeek(currentDate, { locale: fr });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hours = eachHourOfInterval({
    start: set(currentDate, { hours: 7, minutes: 0, seconds: 0 }),
    end: set(currentDate, { hours: 22, minutes: 0, seconds: 0 }),
  });

  function getEventsForDayHour(day: Date, hour: number) {
    return events.filter((event) => {
      if (event.allDay) return false;
      const start = new Date(event.startDate);
      return isSameDay(start, day) && start.getHours() === hour;
    });
  }

  function getAllDayEvents(day: Date) {
    return events.filter((event) => {
      if (!event.allDay) return false;
      const start = new Date(event.startDate);
      const end = new Date(event.endDate);
      return day >= new Date(start.toDateString()) && day <= new Date(end.toDateString());
    });
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header jours */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-surface-200 dark:border-surface-800 sticky top-0 bg-white dark:bg-surface-900 z-10">
        <div className="py-2" />
        {days.map((day) => {
          const today = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className="py-2 text-center border-l border-surface-100 dark:border-surface-800/50"
            >
              <p className="text-xs text-surface-500 dark:text-surface-400 uppercase">
                {format(day, "EEE", { locale: fr })}
              </p>
              <p
                className={`text-lg font-semibold mt-0.5 ${
                  today
                    ? "text-brand-600 dark:text-brand-400"
                    : "text-surface-800 dark:text-surface-200"
                }`}
              >
                {format(day, "d")}
              </p>
            </div>
          );
        })}
      </div>

      {/* All-day events */}
      {days.some((d) => getAllDayEvents(d).length > 0) && (
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/20">
          <div className="p-1 text-xs text-surface-400 flex items-center justify-center">
            Journée
          </div>
          {days.map((day) => {
            const allDayEvts = getAllDayEvents(day);
            return (
              <div
                key={day.toISOString()}
                className="p-1 border-l border-surface-100 dark:border-surface-800/50 space-y-0.5"
              >
                {allDayEvts.map((event) => {
                  const config = getEventTypeConfig(event.type);
                  return (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left px-2 py-0.5 rounded text-xs font-medium truncate"
                      style={{
                        backgroundColor: `${config.color}20`,
                        color: config.color,
                      }}
                    >
                      {config.icon} {event.title}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Grille horaire */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {hours.map((hour) => (
            <div key={hour.toISOString()} className="contents">
              {/* Heure label */}
              <div className="h-16 flex items-start justify-end pr-2 pt-0 text-xs text-surface-400 dark:text-surface-500 font-medium">
                {format(hour, "HH:mm")}
              </div>

              {/* Cellules */}
              {days.map((day) => {
                const h = hour.getHours();
                const slotEvents = getEventsForDayHour(day, h);

                return (
                  <div
                    key={`${day.toISOString()}-${h}`}
                    onClick={() =>
                      onSlotClick(set(day, { hours: h, minutes: 0 }))
                    }
                    className="h-16 border-l border-t border-surface-100 dark:border-surface-800/50 p-0.5 cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors"
                  >
                    {slotEvents.map((event) => {
                      const config = getEventTypeConfig(event.type);
                      const start = new Date(event.startDate);
                      const end = new Date(event.endDate);
                      const durationHours =
                        (end.getTime() - start.getTime()) / 3600000;
                      const heightPx = Math.max(durationHours * 64, 24);

                      return (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className="w-full text-left px-1.5 py-0.5 rounded text-xs font-medium truncate"
                          style={{
                            backgroundColor: `${config.color}20`,
                            color: config.color,
                            borderLeft: `3px solid ${config.color}`,
                            height: `${heightPx}px`,
                          }}
                        >
                          {event.title}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
