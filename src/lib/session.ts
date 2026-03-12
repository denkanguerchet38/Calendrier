import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "nf_session";
const MEMBER_COOKIE_NAME = "nf_member";
const THEME_COOKIE_NAME = "nf_theme";
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 jours en secondes

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET manquant ou trop court (min 32 caractères)."
    );
  }
  return secret;
}

function signToken(payload: string): string {
  const secret = getSessionSecret();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const signature = hmac.digest("hex");
  return `${payload}.${signature}`;
}

function verifyToken(token: string): string | null {
  const secret = getSessionSecret();
  const lastDot = token.lastIndexOf(".");
  if (lastDot === -1) return null;

  const payload = token.substring(0, lastDot);
  const signature = token.substring(lastDot + 1);

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(payload);
  const expected = hmac.digest("hex");

  if (signature !== expected) return null;
  return payload;
}

export async function createSession(): Promise<void> {
  const timestamp = Date.now().toString();
  const token = signToken(timestamp);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyToken(token) !== null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(MEMBER_COOKIE_NAME);
}

export async function setMemberCookie(memberLabel: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(MEMBER_COOKIE_NAME, memberLabel, {
    httpOnly: false, // Accessible côté client pour l'affichage
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getMemberCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(MEMBER_COOKIE_NAME)?.value || null;
}

export async function setThemeCookie(theme: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}
