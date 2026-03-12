"use client";

import { useState, useEffect } from "react";
import { Send, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useComments } from "@/hooks/useComments";
import { useMember } from "@/hooks/useMember";

interface CommentSectionProps {
  eventId: string;
}

export default function CommentSection({ eventId }: CommentSectionProps) {
  const { comments, loading, fetchComments, addComment, deleteComment } =
    useComments(eventId);
  const { currentMember } = useMember();
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !currentMember) return;

    setSending(true);
    await addComment(currentMember, text.trim());
    setText("");
    setSending(false);
  }

  return (
    <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-800">
      <h4 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">
        Commentaires {comments.length > 0 && `(${comments.length})`}
      </h4>

      {/* Liste des commentaires */}
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {loading && (
          <p className="text-xs text-surface-400">Chargement...</p>
        )}
        {!loading && comments.length === 0 && (
          <p className="text-xs text-surface-400 dark:text-surface-500 italic">
            Aucun commentaire pour le moment.
          </p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="flex items-start gap-2 p-2.5 rounded-lg bg-surface-50 dark:bg-surface-800/50 animate-fade-in"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                  {comment.author}
                </span>
                <span className="text-xs text-surface-400">
                  {format(new Date(comment.createdAt), "d MMM à HH:mm", {
                    locale: fr,
                  })}
                </span>
              </div>
              <p className="text-sm text-surface-600 dark:text-surface-300 mt-0.5">
                {comment.text}
              </p>
            </div>
            {currentMember === comment.author && (
              <button
                onClick={() => deleteComment(comment.id)}
                className="p-1 rounded text-surface-300 hover:text-red-500 dark:text-surface-600 dark:hover:text-red-400 transition-colors shrink-0"
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Formulaire d'ajout */}
      {currentMember ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Écrire en tant que ${currentMember}...`}
            className="input-field text-sm py-2"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="btn-primary px-3 py-2 shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      ) : (
        <p className="text-xs text-surface-400 italic">
          Sélectionne ton prénom dans le menu pour commenter.
        </p>
      )}
    </div>
  );
}
