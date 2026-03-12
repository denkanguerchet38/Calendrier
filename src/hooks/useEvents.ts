"use client";

import { useState, useCallback } from "react";
import { CalendarEvent } from "@/types";

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (start?: string, end?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (start) params.set("start", start);
      if (end) params.set("end", end);

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error("Erreur de chargement");

      const data = await res.json();
      setEvents(data);
      return data;
    } catch (err) {
      setError("Impossible de charger les événements.");
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(
    async (eventData: Partial<CalendarEvent>) => {
      setError(null);
      try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
        if (!res.ok) throw new Error("Erreur de création");

        const newEvent = await res.json();
        setEvents((prev) =>
          [...prev, newEvent].sort(
            (a, b) =>
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
        );
        return newEvent;
      } catch (err) {
        setError("Impossible de créer l'événement.");
        console.error(err);
        return null;
      }
    },
    []
  );

  const updateEvent = useCallback(
    async (id: string, eventData: Partial<CalendarEvent>) => {
      setError(null);
      try {
        const res = await fetch(`/api/events/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        });
        if (!res.ok) throw new Error("Erreur de modification");

        const updated = await res.json();
        setEvents((prev) =>
          prev
            .map((e) => (e.id === id ? updated : e))
            .sort(
              (a, b) =>
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime()
            )
        );
        return updated;
      } catch (err) {
        setError("Impossible de modifier l'événement.");
        console.error(err);
        return null;
      }
    },
    []
  );

  const deleteEvent = useCallback(async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur de suppression");

      setEvents((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err) {
      setError("Impossible de supprimer l'événement.");
      console.error(err);
      return false;
    }
  }, []);

  const patchEvent = useCallback(
    (id: string, patch: Partial<CalendarEvent>) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
      );
    },
    []
  );

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    patchEvent,
  };
}
