import { EventTypeConfig } from "@/types";

export const EVENT_TYPES: EventTypeConfig[] = [
  {
    id: "sport",
    label: "Sport",
    color: "#3B82F6",
    bgLight: "bg-blue-100 text-blue-800 border-blue-200",
    bgDark: "dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    icon: "⚽",
  },
  {
    id: "anniversaire",
    label: "Anniversaire / Fête",
    color: "#EC4899",
    bgLight: "bg-pink-100 text-pink-800 border-pink-200",
    bgDark: "dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800",
    icon: "🎂",
  },
  {
    id: "vacances",
    label: "Vacances / Voyage",
    color: "#10B981",
    bgLight: "bg-emerald-100 text-emerald-800 border-emerald-200",
    bgDark: "dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    icon: "✈️",
  },
  {
    id: "sortie",
    label: "Sortie / Loisir",
    color: "#8B5CF6",
    bgLight: "bg-violet-100 text-violet-800 border-violet-200",
    bgDark: "dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
    icon: "🎭",
  },
];

export function getEventTypeConfig(typeId: string): EventTypeConfig {
  return (
    EVENT_TYPES.find((t) => t.id === typeId) || EVENT_TYPES[0]
  );
}
