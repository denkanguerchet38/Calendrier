"use client";

import { useState, useCallback } from "react";
import { Comment } from "@/types";

export function useComments(eventId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?eventId=${eventId}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComments(data);
    } catch {
      console.error("Erreur chargement commentaires");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const addComment = useCallback(
    async (author: string, text: string) => {
      try {
        const res = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, author, text }),
        });
        if (!res.ok) throw new Error();
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        return newComment;
      } catch {
        console.error("Erreur ajout commentaire");
        return null;
      }
    },
    [eventId]
  );

  const deleteComment = useCallback(
    async (commentId: string) => {
      try {
        const res = await fetch(
          `/api/comments?eventId=${eventId}&commentId=${commentId}`,
          { method: "DELETE" }
        );
        if (!res.ok) throw new Error();
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        return true;
      } catch {
        console.error("Erreur suppression commentaire");
        return false;
      }
    },
    [eventId]
  );

  return { comments, loading, fetchComments, addComment, deleteComment };
}
