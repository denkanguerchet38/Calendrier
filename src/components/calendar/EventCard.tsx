"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarEvent } from "@/types";
import { getEventTypeConfig } from "@/constants/eventTypes";

interface EventCardProps {
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  compact?: boolean;
}

export default function EventCard({
  event,
  onClick,
  compact = false,
}: EventCardProps) {
  const typeConfig = getEventTypeConfig(event.type);

  if (compact) {
    return (
      <button
        onClick={() => onClick(event)}
        className="w-full text-left px-2 py-1 rounded-md text-xs font-medium truncate transition-all hover:opacity-80"
        style={{
          backgroundColor: `${typeConfig.color}20`,
          color: typeConfig.color,
          borderLeft: `3px solid ${typeConfig.color}`,
        }}
        title={event.title}
      >
        <span className="mr-1">{typeConfig.icon}</span>
        {event.title}
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(event)}
      className="w-full text-left p-3 rounded-xl border transition-all hover:shadow-md group"
      style={{
        backgroundColor: `${typeConfig.color}08`,
        borderColor: `${typeConfig.color}30`,
      }}
    >
      <div className="flex items-start gap-2">
        <span className="text-base mt-0.5">{typeConfig.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-surface-900 dark:text-surface-100 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {event.title}
          </p>
          {!event.allDay && (
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
              {format(new Date(event.startDate), "HH:mm", { locale: fr })}
              {event.endDate &&
                ` - ${format(new Date(event.endDate), "HH:mm", { locale: fr })}`}
            </p>
          )}
          {event.participants.length > 0 && (
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-1 truncate">
              {event.participants.join(", ")}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
