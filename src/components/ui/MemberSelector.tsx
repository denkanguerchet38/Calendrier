"use client";

import { FAMILY_MEMBERS, FAMILY_COLORS } from "@/constants/members";
import { useMember } from "@/hooks/useMember";

interface MemberSelectorProps {
  compact?: boolean;
  onSelect?: (member: string) => void;
}

export default function MemberSelector({ compact = false, onSelect }: MemberSelectorProps) {
  const { currentMember, selectMember } = useMember();

  function handleSelect(label: string) {
    selectMember(label);
    onSelect?.(label);
  }

  if (compact) {
    return (
      <select
        value={currentMember || ""}
        onChange={(e) => handleSelect(e.target.value)}
        className="input-field text-sm py-1.5 px-3"
      >
        <option value="" disabled>
          Qui es-tu ?
        </option>
        {(["GUERCHET", "VINEY", "JUSZCZAK"] as const).map((family) => (
          <optgroup key={family} label={`Famille ${family}`}>
            {FAMILY_MEMBERS.filter((m) => m.family === family).map((m) => (
              <option key={m.displayLabel} value={m.displayLabel}>
                {m.displayLabel}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    );
  }

  return (
    <div className="space-y-4">
      {(["GUERCHET", "VINEY", "JUSZCZAK"] as const).map((family) => {
        const members = FAMILY_MEMBERS.filter((m) => m.family === family);
        const color = FAMILY_COLORS[family];
        return (
          <div key={family}>
            <h3
              className="text-sm font-semibold mb-2 uppercase tracking-wide"
              style={{ color }}
            >
              Famille {family}
            </h3>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => (
                <button
                  key={m.displayLabel}
                  onClick={() => handleSelect(m.displayLabel)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    currentMember === m.displayLabel
                      ? "text-white shadow-sm"
                      : "bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-surface-400 dark:hover:border-surface-500"
                  }`}
                  style={
                    currentMember === m.displayLabel
                      ? { backgroundColor: color, borderColor: color }
                      : undefined
                  }
                >
                  {m.displayLabel}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
