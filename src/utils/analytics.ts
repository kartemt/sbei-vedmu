const STORAGE_KEY = "sbei_vedmu_analytics";
const SESSION_KEY = "sbei_vedmu_session";

export type ContactEntry = { value: string; date: string };

export type RatingCounts = { 1: number; 2: number; 3: number; 4: number; 5: number };

type Store = {
  visits: number;
  screen3Visits: number;
  ctaClicks: number;
  returns: number;
  lastVisitDate: string | null;
  ratings: RatingCounts;
  contacts: ContactEntry[];
};

function defaultStore(): Store {
  return {
    visits: 0,
    screen3Visits: 0,
    ctaClicks: 0,
    returns: 0,
    lastVisitDate: null,
    ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    contacts: [],
  };
}

function load(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStore();
    return { ...defaultStore(), ...JSON.parse(raw) };
  } catch {
    return defaultStore();
  }
}

function save(store: Store): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage unavailable — silent fail
  }
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Called once per page load */
export function trackVisit(): void {
  const alreadyTracked = sessionStorage.getItem(SESSION_KEY);
  if (alreadyTracked) return;
  sessionStorage.setItem(SESSION_KEY, "1");

  const store = load();
  store.visits += 1;

  const todayStr = today();
  if (store.lastVisitDate && store.lastVisitDate !== todayStr) {
    store.returns += 1;
  }
  store.lastVisitDate = todayStr;

  save(store);
}

/** Called when player reaches the case screen for the first time */
export function trackScreen3(): void {
  const key = "sbei_s3_" + today();
  if (sessionStorage.getItem(key)) return;
  sessionStorage.setItem(key, "1");
  const store = load();
  store.screen3Visits += 1;
  save(store);
}

/** Called when player clicks «Хочу продолжить путь» */
export function trackCta(): void {
  const store = load();
  store.ctaClicks += 1;
  save(store);
}

/** Called when player selects a rating */
export function trackRating(rating: 1 | 2 | 3 | 4 | 5): void {
  const store = load();
  store.ratings[rating] += 1;
  save(store);
}

/** Called when player submits contact */
export function trackContact(value: string): void {
  const store = load();
  const entry: ContactEntry = { value, date: new Date().toLocaleString("ru-RU") };
  store.contacts = [entry, ...store.contacts].slice(0, 50);
  save(store);
}

export function getAnalytics(): Store {
  return load();
}

export function resetAnalytics(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportAnalytics(): void {
  const data = load();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sbei_vedmu_metrics_${today()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
