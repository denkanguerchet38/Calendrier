"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2, MapPin, AlignLeft, Users, Save, Plus } from "lucide-react";
import Modal from "@/components/ui/Modal";
import CommentSection from "@/components/calendar/CommentSection";
import { CalendarEvent, EventType } from "@/types";
import { EVENT_TYPES, getEventTypeConfig } from "@/constants/eventTypes";
import { FAMILY_MEMBERS } from "@/constants/members";
import { useMember } from "@/hooks/useMember";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: CalendarEvent | null;
  defaultDate?: Date;
  onSave: (data: Partial<CalendarEvent>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export default function EventModal({
  isOpen,
  onClose,
  event,
  defaultDate,
  onSave,
  onDelete,
}: EventModalProps) {
  const { currentMember } = useMember();
  const isEditing = !!event;

  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("sortie");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setType(event.type);
      setAllDay(event.allDay);
      setLocation(event.location || "");
      setDescription(event.description || "");
      setParticipants(event.participants || []);

      const start = new Date(event.startDate);
      setStartDate(format(start, "yyyy-MM-dd"));
      setStartTime(format(start, "HH:mm"));

      if (event.endDate) {
        const end = new Date(event.endDate);
        setEndDate(format(end, "yyyy-MM-dd"));
        setEndTime(format(end, "HH:mm"));
      }
    } else {
      const d = defaultDate || new Date();
      setTitle("");
      setType("sortie");
      setAllDay(false);
      setLocation("");
      setDescription("");
      setParticipants(currentMember ? [currentMember] : []);
      setStartDate(format(d, "yyyy-MM-dd"));
      setStartTime("10:00");
      setEndDate(format(d, "yyyy-MM-dd"));
      setEndTime("11:00");
      setConfirmDelete(false);
    }
  }, [event, defaultDate, isOpen, currentMember]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);

    const startISO = allDay
      ? new Date(`${startDate}T00:00:00`).toISOString()
      : new Date(`${startDate}T${startTime}:00`).toISOString();

    const endISO = allDay
      ? new Date(`${endDate || startDate}T23:59:59`).toISOString()
      : new Date(`${endDate || startDate}T${endTime || startTime}:00`).toISOString();

    await onSave({
      title: title.trim(),
      type,
      startDate: startISO,
      endDate: endISO,
      allDay,
      location: location.trim(),
      description: description.trim(),
      participants,
      createdBy: currentMember || "Anonyme",
    });

    setSaving(false);
    onClose();
  }

  async function handleDelete() {
    if (!event || !onDelete) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    await onDelete(event.id);
    onClose();
  }

  function toggleParticipant(label: string) {
    setParticipants((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Détail de l'événement" : "Nouvel événement"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Titre */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre de l'événement"
          className="input-field text-lg font-medium"
          required
          autoFocus
        />

        {/* Type d'événement */}
        <div className="flex flex-wrap gap-2">
          {EVENT_TYPES.map((t) => {
            const selected = type === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setType(t.id)}
                className={`event-badge ${
                  selected
                    ? "text-white shadow-sm"
                    : "bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700"
                }`}
                style={
                  selected
                    ? { backgroundColor: t.color, borderColor: t.color }
                    : undefined
                }
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Toute la journée */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-surface-300 dark:bg-surface-600 rounded-full peer-checked:bg-brand-600 transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-sm text-surface-700 dark:text-surface-300">
            Toute la journée
          </span>
        </label>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">
              Début
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field text-sm"
                required
              />
              {!allDay && (
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input-field text-sm w-28"
                />
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-surface-500 mb-1">
              Fin
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field text-sm"
              />
              {!allDay && (
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="input-field text-sm w-28"
                />
              )}
            </div>
          </div>
        </div>

        {/* Lieu */}
        <div className="relative">
          <MapPin
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lieu (optionnel)"
            className="input-field pl-9 text-sm"
          />
        </div>

        {/* Description */}
        <div className="relative">
          <AlignLeft
            size={16}
            className="absolute left-3 top-3 text-surface-400"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Notes (optionnel)"
            rows={2}
            className="input-field pl-9 text-sm resize-none"
          />
        </div>

        {/* Participants */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-medium text-surface-500 mb-2">
            <Users size={14} />
            Participants
          </label>
          <div className="flex flex-wrap gap-1.5">
            {FAMILY_MEMBERS.map((m) => {
              const selected = participants.includes(m.displayLabel);
              return (
                <button
                  key={m.displayLabel}
                  type="button"
                  onClick={() => toggleParticipant(m.displayLabel)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    selected
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-surface-50 dark:bg-surface-800 text-surface-500 border-surface-200 dark:border-surface-700 hover:border-brand-300"
                  }`}
                >
                  {m.displayLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-surface-200 dark:border-surface-800">
          {isEditing && onDelete ? (
            <button
              type="button"
              onClick={handleDelete}
              className={`text-sm font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                confirmDelete
                  ? "btn-danger"
                  : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
            >
              <Trash2 size={16} />
              {confirmDelete ? "Confirmer la suppression" : "Supprimer"}
            </button>
          ) : (
            <div />
          )}

          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-secondary text-sm">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="btn-primary text-sm">
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isEditing ? (
                <>
                  <Save size={16} />
                  Enregistrer
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Créer
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Commentaires (uniquement en mode édition) */}
      {isEditing && event && <CommentSection eventId={event.id} />}
    </Modal>
  );
}
