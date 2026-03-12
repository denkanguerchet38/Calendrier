export type EventType = "sport" | "anniversaire" | "vacances" | "sortie" | "poste_secours";

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  startDate: string; // ISO string
  endDate: string; // ISO string
  allDay: boolean;
  location?: string;
  description?: string;
  participants: string[];
  rsvp: string[]; // Membres qui ont confirmé leur présence
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  eventId: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface FamilyMember {
  name: string;
  family: "GUERCHET" | "VINEY" | "JUSZCZAK";
  displayLabel: string;
}

export type CalendarViewMode = "day" | "week" | "month";

export interface EventTypeConfig {
  id: EventType;
  label: string;
  color: string;
  bgLight: string;
  bgDark: string;
  icon: string;
}
