"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import ThemeToggle from "@/components/ui/ThemeToggle";
import MemberSelector from "@/components/ui/MemberSelector";
import { CalendarViewMode } from "@/types";

interface NavbarProps {
  currentDate: Date;
  viewMode: CalendarViewMode;
  onViewChange: (mode: CalendarViewMode) => void;
  onNavigate: (direction: "prev" | "next" | "today") => void;
}

export default function Navbar({
  currentDate,
  viewMode,
  onViewChange,
  onNavigate,
}: NavbarProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const viewLabels: Record<CalendarViewMode, string> = {
    day: "Jour",
    week: "Semaine",
    month: "Mois",
  };

  function getDateLabel() {
    switch (viewMode) {
      case "day":
        return format(currentDate, "EEEE d MMMM yyyy", { locale: fr });
      case "week":
        return format(currentDate, "MMMM yyyy", { locale: fr });
      case "month":
        return format(currentDate, "MMMM yyyy", { locale: fr });
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Ligne principale */}
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Users size={16} />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block text-surface-900 dark:text-surface-100">
              Notre Famille
            </span>
          </div>

          {/* Navigation date — centré */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("prev")}
              className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => onNavigate("today")}
              className="px-3 py-1 rounded-lg text-sm font-medium hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-200 transition-colors"
            >
              <span className="hidden sm:inline capitalize">{getDateLabel()}</span>
              <span className="sm:hidden">
                <CalendarIcon size={16} />
              </span>
            </button>

            <button
              onClick={() => onNavigate("next")}
              className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Actions droite */}
          <div className="flex items-center gap-2">
            {/* View switcher */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-surface-100 dark:bg-surface-800 rounded-xl">
              {(["day", "week", "month"] as CalendarViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => onViewChange(mode)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    viewMode === mode
                      ? "bg-white dark:bg-surface-700 shadow-sm text-brand-600 dark:text-brand-400"
                      : "text-surface-500 hover:text-surface-700 dark:hover:text-surface-300"
                  }`}
                >
                  {viewLabels[mode]}
                </button>
              ))}
            </div>

            <ThemeToggle />

            {/* Menu profil */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors"
              >
                <Users size={18} />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 card p-4 z-50 animate-modal-in">
                    <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-3">
                      Qui es-tu ?
                    </p>
                    <MemberSelector compact onSelect={() => setShowMenu(false)} />
                    <hr className="my-3 border-surface-200 dark:border-surface-800" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Vue switcher mobile */}
        <div className="flex sm:hidden items-center justify-between pb-2">
          <p className="text-sm font-medium capitalize text-surface-700 dark:text-surface-200">
            {getDateLabel()}
          </p>
          <div className="flex items-center gap-1 p-0.5 bg-surface-100 dark:bg-surface-800 rounded-lg">
            {(["day", "week", "month"] as CalendarViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onViewChange(mode)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  viewMode === mode
                    ? "bg-white dark:bg-surface-700 shadow-sm text-brand-600 dark:text-brand-400"
                    : "text-surface-500"
                }`}
              >
                {viewLabels[mode]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
