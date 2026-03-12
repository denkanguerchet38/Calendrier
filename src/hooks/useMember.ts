"use client";

import { useState, useEffect, useCallback } from "react";

const MEMBER_COOKIE = "nf_member";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

export function useMember() {
  const [currentMember, setCurrentMember] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = getCookie(MEMBER_COOKIE);
    setCurrentMember(saved);
    setIsLoaded(true);
  }, []);

  const selectMember = useCallback((memberLabel: string) => {
    setCookie(MEMBER_COOKIE, memberLabel);
    setCurrentMember(memberLabel);
  }, []);

  const clearMember = useCallback(() => {
    document.cookie = `${MEMBER_COOKIE}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    setCurrentMember(null);
  }, []);

  return { currentMember, isLoaded, selectMember, clearMember };
}
