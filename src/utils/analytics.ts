/**
 * Analytics — localStorage-based, non-PII only.
 *
 * Contact collection has been moved to Supabase (src/utils/contactSubmit.ts).
 * Only anonymous aggregate metrics are stored here: visit counts, completion
 * counts, ratings, leaderboard scores. No email or personal data.
 */

import type { CaseResult, GameResults } from "../types";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config/supabase";

// ── Remote event ping (fire-and-forget) ──────────────────────────────────
function sendEvent(eventType: string, value = 1): void {
  fetch(`${SUPABASE_URL}/rest/v1/game_events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "return=minimal",
    },
    body: JSON.stringify({ game: "witch_hunt", event_type: eventType, value }),
  }).catch(() => { /* silent — metrics are best-effort */ });
}

// ── Admin access ──────────────────────────────────────────────────────────
// PIN protects the in-game metrics dashboard (non-PII data only).
// Contacts are stored in Supabase and accessible only via server-side dashboard.
export const ADMIN_PIN = "WH2026";

export function checkAdminPin(input: string): boolean {
  return input === ADMIN_PIN;
}

// ── Storage keys ──────────────────────────────────────────────────────────
const KEY_STORE = "wh_analytics";
const KEY_LEADERBOARD = "wh_leaderboard";
const KEY_SESSION = "wh_session";

// ── Types ─────────────────────────────────────────────────────────────────
export type RatingCounts = { 1: number; 2: number; 3: number; 4: number; 5: number };

export type LeaderEntry = {
  sessionId: string;
  score: number;
  total: number;
  pipelineSaved: number;
  accuracy: number;
  date: string;
};

type Store = {
  visits: number;
  screen3Visits: number;
  ctaClicks: number;
  completions: number;
  returns: number;
  lastVisitDate: string | null;
  ratings: RatingCounts;
};

// ── Helpers ───────────────────────────────────────────────────────────────
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function uid(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);
}

function defaultStore(): Store {
  return {
    visits: 0,
    screen3Visits: 0,
    ctaClicks: 0,
    completions: 0,
    returns: 0,
    lastVisitDate: null,
    ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  };
}

function load(): Store {
  try {
    const raw = localStorage.getItem(KEY_STORE);
    if (!raw) return defaultStore();
    return { ...defaultStore(), ...JSON.parse(raw) };
  } catch {
    return defaultStore();
  }
}

function save(store: Store): void {
  try {
    localStorage.setItem(KEY_STORE, JSON.stringify(store));
  } catch { /* storage full or unavailable */ }
}

function loadLeaderboard(): LeaderEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY_LEADERBOARD) ?? "[]");
  } catch {
    return [];
  }
}

function saveLeaderboard(entries: LeaderEntry[]): void {
  try {
    localStorage.setItem(KEY_LEADERBOARD, JSON.stringify(entries));
  } catch { /* silent */ }
}

// ── Public tracking API ───────────────────────────────────────────────────

export function trackVisit(): void {
  if (sessionStorage.getItem(KEY_SESSION)) return;
  sessionStorage.setItem(KEY_SESSION, uid());
  const store = load();
  store.visits += 1;
  const todayStr = today();
  if (store.lastVisitDate && store.lastVisitDate !== todayStr) {
    store.returns += 1;
  }
  store.lastVisitDate = todayStr;
  save(store);
  sendEvent("visit");
}

export function trackScreen3(): void {
  const key = "wh_s3_" + today();
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  const store = load();
  store.screen3Visits += 1;
  save(store);
  sendEvent("screen3");
}

export function trackCta(): void {
  const store = load();
  store.ctaClicks += 1;
  save(store);
  sendEvent("cta");
}

export function trackRating(rating: 1 | 2 | 3 | 4 | 5): void {
  const store = load();
  store.ratings[rating] += 1;
  save(store);
  sendEvent("rating", rating);
}

export function trackCompletion(
  results: GameResults,
  _caseResults: CaseResult[]
): void {
  const store = load();
  store.completions += 1;
  save(store);
  sendEvent("completion");

  const session = sessionStorage.getItem(KEY_SESSION) ?? uid();
  const entry: LeaderEntry = {
    sessionId: session,
    score: results.correctAnswers,
    total: results.totalCases,
    pipelineSaved: results.pipelineDaysSaved,
    accuracy:
      results.totalCases > 0
        ? Math.round((results.correctAnswers / results.totalCases) * 100)
        : 0,
    date: new Date().toLocaleString("ru-RU"),
  };
  const board = [entry, ...loadLeaderboard()].slice(0, 50);
  saveLeaderboard(board);
}

export function getCurrentSessionId(): string | null {
  return sessionStorage.getItem(KEY_SESSION);
}

// ── Admin-only read API ───────────────────────────────────────────────────

export function getAnalytics(): Store {
  return load();
}

export function getLeaderboard(): LeaderEntry[] {
  return loadLeaderboard();
}

export function resetAnalytics(): void {
  localStorage.removeItem(KEY_STORE);
  localStorage.removeItem(KEY_LEADERBOARD);
}

export function exportAnalytics(): void {
  const data = {
    metrics: load(),
    leaderboard: loadLeaderboard(),
    exportedAt: new Date().toISOString(),
    note: "Contacts are stored in Supabase, not here.",
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `witch_hunt_metrics_${today()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
