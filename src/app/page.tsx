"use client";

import { useState, useEffect, useCallback } from "react";
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  startOfMonth,
  endOfMonth,
  subWeeks as subW,
  addWeeks as addW,
} from "date-fns";
import { Plus } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CalendarView from "@/components/calendar/CalendarView";
import EventModal from "@/components/calendar/EventModal";
import MemberSelector from "@/components/ui/MemberSelector";
import { CalendarEvent, CalendarViewMode } from "@/types";
import { useEvents } from "@/hooks/useEvents";
import { useMember } from "@/hooks/useMember";

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [slotDate, setSlotDate] = useState<Date | undefined>();
  const [showMemberPicker, setShowMemberPicker] = useState(false);

  const { events, loading, fetchEvents, createEvent, updateEvent, deleteEvent } =
    useEvents();
  const { currentMember, isLoaded } = useMember();

  // Charger les événements pour la plage visible
  const loadEvents = useCallback(() => {
    const start = subW(startOfMonth(currentDate), 1).toISOString();
    const end = addW(endOfMonth(currentDate), 1).toISOString();
    fetchEvents(start, end);
  }, [currentDate, fetchEvents]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Afficher le sélecteur de membre au premier chargement si pas de membre sélectionné
  useEffect(() => {
    if (isLoaded && !currentMember) {
      setShowMemberPicker(true);
    }
  }, [isLoaded, currentMember]);

  function handleNavigate(direction: "prev" | "next" | "today") {
    if (direction === "today") {
      setCurrentDate(new Date());
      return;
    }

    const isPrev = direction === "prev";
    switch (viewMode) {
      case "month":
        setCurrentDate((d) => (isPrev ? subMonths(d, 1) : addMonths(d, 1)));
        break;
      case "week":
        setCurrentDate((d) => (isPrev ? subWeeks(d, 1) : addWeeks(d, 1)));
        break;
      case "day":
        setCurrentDate((d) => (isPrev ? subDays(d, 1) : addDays(d, 1)));
        break;
    }
  }

  function handleEventClick(event: CalendarEvent) {
    setSelectedEvent(event);
    setSlotDate(undefined);
    setShowEventModal(true);
  }

  function handleSlotClick(date: Date) {
    setSelectedEvent(null);
    setSlotDate(date);
    setShowEventModal(true);
  }

  function handleNewEvent() {
    setSelectedEvent(null);
    setSlotDate(new Date());
    setShowEventModal(true);
  }

  async function handleSaveEvent(data: Partial<CalendarEvent>) {
    if (selectedEvent) {
      await updateEvent(selectedEvent.id, data);
    } else {
      await createEvent(data);
    }
  }

  async function handleDeleteEvent(id: string) {
    await deleteEvent(id);
  }

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-surface-950">
      <Navbar
        currentDate={currentDate}
        viewMode={viewMode}
        onViewChange={setViewMode}
        onNavigate={handleNavigate}
      />

      {/* Contenu principal */}
      <main className="flex-1 overflow-hidden relative">
        {loading && events.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-surface-400">Chargement...</p>
            </div>
          </div>
        ) : (
          <CalendarView
            viewMode={viewMode}
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
          />
        )}
      </main>

      {/* FAB — Nouveau événement */}
      <button
        onClick={handleNewEvent}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-30 active:scale-95"
        title="Nouvel événement"
      >
        <Plus size={24} />
      </button>

      {/* Modal événement */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        defaultDate={slotDate}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Modal sélection membre (premier accès) */}
      {showMemberPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />
          <div className="relative card p-6 w-full max-w-md animate-modal-in">
            <h2 className="text-xl font-display font-bold text-surface-900 dark:text-surface-100 mb-1">
              Bienvenue ! 👋
            </h2>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
              Qui es-tu ? Choisis ton prénom pour personnaliser ton expérience.
            </p>
            <MemberSelector
              onSelect={() => setShowMemberPicker(false)}
            />
            <button
              onClick={() => setShowMemberPicker(false)}
              className="btn-secondary w-full mt-4 text-sm"
            >
              Passer pour le moment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
