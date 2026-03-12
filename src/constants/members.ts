import { FamilyMember } from "@/types";

export const FAMILY_MEMBERS: FamilyMember[] = [
  // Famille GUERCHET
  { name: "Papa", family: "GUERCHET", displayLabel: "Papa G." },
  { name: "Maman", family: "GUERCHET", displayLabel: "Maman G." },
  { name: "Hélora", family: "GUERCHET", displayLabel: "Hélora" },
  { name: "Kerwan", family: "GUERCHET", displayLabel: "Kerwan" },
  { name: "Denkan", family: "GUERCHET", displayLabel: "Denkan" },
  { name: "Meylina", family: "GUERCHET", displayLabel: "Meylina" },
  { name: "Camille", family: "GUERCHET", displayLabel: "Camille G." },
  { name: "Coline", family: "GUERCHET", displayLabel: "Coline" },

  // Famille VINEY
  { name: "Anne-Laure", family: "VINEY", displayLabel: "Anne-Laure" },
  { name: "Patrice", family: "VINEY", displayLabel: "Patrice" },
  { name: "Nowlan", family: "VINEY", displayLabel: "Nowlan" },
  { name: "Nathanaël", family: "VINEY", displayLabel: "Nathanaël" },
  { name: "Maëlys", family: "VINEY", displayLabel: "Maëlys" },
  { name: "Camille", family: "VINEY", displayLabel: "Camille V." },

  // Famille JUSZCZAK
  { name: "Lydia Isabelle", family: "JUSZCZAK", displayLabel: "Lydia Isabelle" },
];

export const FAMILY_COLORS: Record<string, string> = {
  GUERCHET: "#4c6ef5",
  VINEY: "#10B981",
  JUSZCZAK: "#F59E0B",
};

export function getMemberByDisplayLabel(label: string): FamilyMember | undefined {
  return FAMILY_MEMBERS.find((m) => m.displayLabel === label);
}
