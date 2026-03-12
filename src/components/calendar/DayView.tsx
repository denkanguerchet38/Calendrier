"use client";

import {
  eachHourOfInterval,
  isSameDay,
  format,
  set,
  isToday,
} from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarEvent } from "@/types";
import { getEventTypeConfig } from "@/constants/eventTypes";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date) => void;
}

export default function DayView({
  currentDate,
  events,
  onEventClick,
  onSlotClick,
}: DayViewProps) {
  const hours = eachHourOfInterval({
    start: set(currentDate, { hours: 7, minutes: 0, seconds: 0 }),
    end: set(currentDate, { hours: 22, minutes: 0, seconds: 0 }),
  });

  const dayEvents = events.filter((event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return (
      isSameDay(start, currentDate) ||
      isSameDay(end, currentDate) ||
      (start <= currentDate && end >= currentDate)
    );
  });

  const allDayEvents = dayEvents.filter((e) => e.allDay);
  const timedEvents = dayEvents.filter((e) => !e.allDay);

  function getEventsForHour(hour: number) {
    return timedEvents.filter((event) => {
      const start = new Date(event.startDate);
      return start.getHours() === hour;
    });
  }

  const today = isToday(currentDate);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center ${
              today
                ? "bg-brand-600 text-white"
                : "bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200"
            }`}
          >
            <span className="text-xs font-medium uppercase leading-none">
              {format(currentDate, "EEE", { locale: fr })}
            </span>
            <span className="text-xl font-bold leading-none mt-0.5">
              {format(currentDate, "d")}
            </span>
          </div>
          <div>
            <p className="font-display font-semibold text-surface-900 dark:text-surface-100 capitalize">
              {format(currentDate, "EEEE d MMMM", { locale: fr })}
            </p>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              {dayEvents.length} événement{dayEvents.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* All-day events */}
      {allDayEvents.length > 0 && (
        <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-800 bg-surface-50/50 dark:bg-surface-800/20 space-y-1">
          <p className="text-xs font-medium text-surface-400 uppercase tracking-wide mb-1">
            Toute la journée
          </p>
          {allDayEvents.map((event) => {
            const config = getEventTypeConfig(event.type);
            return (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-sm"
                style={{
                  backgroundColor: `${config.color}15`,
                  color: config.color,
                  borderLeft: `4px solid ${config.color}`,
                }}
              >
                <span className="mr-1.5">{config.icon}</span>
                {event.title}
                {event.participants.length > 0 && (
                  <span className="text-xs opacity-70 ml-2">
                    — {event.participants.join(", ")}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Grille horaire */}
      <div className="flex-1 overflow-y-auto">
        {hours.map((hour) => {
          const h = hour.getHours();
          const hourEvents = getEventsForHour(h);

          return (
            <div
              key={h}
              onClick={() =>
                onSlotClick(set(currentDate, { hours: h, minutes: 0 }))
              }
              className="flex border-b border-surface-100 dark:border-surface-800/50 min-h-[64px] cursor-pointer hover:bg-surface-50/50 dark:hover:bg-surface-800/20 transition-colors"
            >
              {/* Heure */}
              <div className="w-16 shrink-0 flex items-start justify-end pr-3 pt-1 text-xs text-surface-400 dark:text-surface-500 font-medium">
                {format(hour, "HH:mm")}
              </div>

              {/* Events */}
              <div className="flex-1 p-1 space-y-1">
                {hourEvents.map((event) => {
                  const config = getEventTypeConfig(event.type);
                  const start = new Date(event.startDate);
                  const end = new Date(event.endDate);

                  return (
                    <button
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="w-full text-left p-2.5 rounded-lg transition-all hover:shadow-md group"
                      style={{
                        backgroundColor: `${config.color}12`,
                        borderLeft: `4px solid ${config.color}`,
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm text-surface-900 dark:text-surface-100 group-hover:text-brand-600 dark:group-hover:text-brand-400">
                            <span className="mr-1">{config.icon}</span>
                            {event.title}
                          </p>
                          <p className="text-xs text-surface-500 mt-0.5">
                            {format(start, "HH:mm")} - {format(end, "HH:mm")}
                          </p>
                        </div>
                      </div>
                      {event.location && (
                        <p className="text-xs text-surface-400 mt-1">
                          📍 {event.location}
                        </p>
                      )}
                      {event.participants.length > 0 && (
                        <p className="text-xs text-surface-400 mt-0.5">
                          👥 {event.participants.join(", ")}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
