"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut } from "lucide-react";
import MemberSelector from "@/components/ui/MemberSelector";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { useMember } from "@/hooks/useMember";

export default function ProfilPage() {
  const router = useRouter();
  const { currentMember } = useMember();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-lg mx-auto px-4 flex items-center h-14">
          <button
            onClick={() => router.push("/")}
            className="p-2 -ml-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="ml-2 font-display font-semibold text-surface-900 dark:text-surface-100">
            Profil
          </h1>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-6">
        {/* Membre actuel */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-3">
            Membre actuel
          </h2>
          {currentMember ? (
            <p className="text-lg font-display font-bold text-surface-900 dark:text-surface-100">
              {currentMember}
            </p>
          ) : (
            <p className="text-sm text-surface-400 italic">Aucun membre sélectionné</p>
          )}
        </div>

        {/* Changer de membre */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-3">
            Changer de membre
          </h2>
          <MemberSelector />
        </div>

        {/* Thème */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide mb-3">
            Apparence
          </h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-surface-700 dark:text-surface-300">
              Mode d&apos;affichage
            </span>
            <ThemeToggle />
          </div>
        </div>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium"
        >
          <LogOut size={18} />
          Se déconnecter
        </button>

        <p className="text-center text-xs text-surface-400 dark:text-surface-600">
          Notre Famille v1.0 · Guerchet · Viney · Juszczak
        </p>
      </div>
    </div>
  );
}
