"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const options = [
    { value: "light" as const, icon: Sun, label: "Clair" },
    { value: "dark" as const, icon: Moon, label: "Sombre" },
    { value: "system" as const, icon: Monitor, label: "Système" },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`p-2 rounded-lg transition-all duration-200 ${
            theme === value
              ? "bg-white dark:bg-surface-700 shadow-sm text-brand-600 dark:text-brand-400"
              : "text-surface-400 hover:text-surface-600 dark:hover:text-surface-300"
          }`}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
