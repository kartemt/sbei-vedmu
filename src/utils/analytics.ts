/**
 * Analytics — localStorage-based.
 *
 * SECURITY NOTE: This is a static frontend app. All data is stored in
 * localStorage and is accessible to anyone with access to the browser.
 * The admin PIN below is obfuscation, NOT true authentication.
 * Do not store highly sensitive information here. For production-grade
 * security, migrate contact storage to a backend/serverless endpoint.
 */

import type { CaseResult, GameResults } from "../types";

// ── Admin access ──────────────────────────────────────────────────────────
// Change this PIN before deploying. Share only with team members.
export const ADMIN_PIN = "WH2026";

export function checkAdminPin(input: string): boolean {
  return input === ADMIN_PIN;
}

// ── Storage keys ──────────────────────────────────────────────────────────
const KEY_STORE = "wh_analytics";
const KEY_LEADERBOARD = "wh_leaderboard";
const KEY_SESSION = "wh_session";

// ── Types ─────────────────────────────────────────────────────────────────
export type ContactEntry = { value: string; date: string };
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
  contacts: ContactEntry[];
};

// ── Helpers ───────────────────────────────────────────────────────────────
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10);
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
    contacts: [],
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
}

export function trackScreen3(): void {
  const key = "wh_s3_" + today();
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  const store = load();
  store.screen3Visits += 1;
  save(store);
}

export function trackCta(): void {
  const store = load();
  store.ctaClicks += 1;
  save(store);
}

export function trackRating(rating: 1 | 2 | 3 | 4 | 5): void {
  const store = load();
  store.ratings[rating] += 1;
  save(store);
}

/** Sanitized contact — caller is responsible for sanitizing before this. */
export function trackContact(sanitizedValue: string): void {
  if (!sanitizedValue) return;
  const store = load();
  store.contacts = [
    { value: sanitizedValue, date: new Date().toLocaleString("ru-RU") },
    ...store.contacts,
  ].slice(0, 100); // keep last 100
  save(store);
}

export function trackCompletion(
  results: GameResults,
  _caseResults: CaseResult[]
): void {
  const store = load();
  store.completions += 1;
  save(store);

  // Save to leaderboard
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
    // SECURITY NOTE: contacts are included in this export.
    // Share only with authorized team members.
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
