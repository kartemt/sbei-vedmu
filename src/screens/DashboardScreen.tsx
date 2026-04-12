import { useState, useEffect } from "react";
import {
  getAnalytics,
  getLeaderboard,
  resetAnalytics,
  exportAnalytics,
  checkAdminPin,
} from "../utils/analytics";
import type { ContactEntry, LeaderEntry, RatingCounts } from "../utils/analytics";

// ── Types ─────────────────────────────────────────────────────────────────
type Metrics = {
  visits: number;
  screen3Visits: number;
  ctaClicks: number;
  completions: number;
  returns: number;
  ratings: RatingCounts;
  contacts: ContactEntry[];
};

// ── Helpers ───────────────────────────────────────────────────────────────
function ratingTotal(r: RatingCounts): number {
  return Object.values(r).reduce((a, b) => a + b, 0);
}

function ratingAvg(r: RatingCounts): string {
  const total = ratingTotal(r);
  if (total === 0) return "—";
  const sum = ([1, 2, 3, 4, 5] as const).reduce((a, n) => a + n * r[n], 0);
  return (sum / total).toFixed(1);
}

function loadData(): { metrics: Metrics; leaderboard: LeaderEntry[] } {
  const a = getAnalytics();
  return {
    metrics: {
      visits: a.visits,
      screen3Visits: a.screen3Visits,
      ctaClicks: a.ctaClicks,
      completions: a.completions,
      returns: a.returns,
      ratings: a.ratings,
      contacts: a.contacts,
    },
    leaderboard: getLeaderboard(),
  };
}

// ── PIN Gate ──────────────────────────────────────────────────────────────
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (checkAdminPin(pin)) {
      onUnlock();
    } else {
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
    }
  }

  return (
    <div className="dashboard dashboard--gate">
      <div className="dashboard__gate-card">
        <div className="dashboard__gate-icon">🔒</div>
        <h2 className="dashboard__gate-title">Дашборд</h2>
        <p className="dashboard__gate-sub">Введите PIN для доступа</p>
        <form onSubmit={handleSubmit} className="dashboard__gate-form">
          <input
            className={`dashboard__gate-input ${error ? "dashboard__gate-input--error" : ""}`}
            type="password"
            placeholder="PIN"
            value={pin}
            maxLength={20}
            autoFocus
            onChange={(e) => setPin(e.target.value)}
            aria-label="Admin PIN"
          />
          <button type="submit" className="btn btn--primary">
            Войти
          </button>
        </form>
        {error && <div className="dashboard__gate-error">Неверный PIN</div>}
        <a href="./" className="dashboard__back dashboard__back--gate">← К игре</a>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export function DashboardScreen() {
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState(loadData);
  const [confirmReset, setConfirmReset] = useState(false);
  const [showAllContacts, setShowAllContacts] = useState(false);

  useEffect(() => {
    if (!unlocked) return;
    const id = setInterval(() => setData(loadData()), 5000);
    return () => clearInterval(id);
  }, [unlocked]);

  if (!unlocked) {
    return <PinGate onUnlock={() => setUnlocked(true)} />;
  }

  const { metrics, leaderboard } = data;

  const mainMetrics = [
    {
      label: "Посетители",
      value: metrics.visits,
      desc: "Уникальных сессий",
    },
    {
      label: "До игры",
      value: metrics.screen3Visits,
      desc: "Дошли до кейсов",
    },
    {
      label: "Прошли полностью",
      value: metrics.completions,
      desc: "Завершили все раунды",
    },
    {
      label: "CTA-клики",
      value: metrics.ctaClicks,
      desc: "«Вступить в охотники» / контакт-гейт",
    },
    {
      label: "Возвраты",
      value: metrics.returns,
      desc: "Зашли на следующий день",
    },
    {
      label: "Оценок",
      value: ratingTotal(metrics.ratings),
      desc: `Средняя: ${ratingAvg(metrics.ratings)} / 5`,
    },
  ];

  // Contacts from "hunters" — those collected via FinalScreen CTA
  // All contacts come from the same trackContact() function; we show all of them
  const hunterContacts = metrics.contacts;

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetAnalytics();
    setConfirmReset(false);
    setData(loadData());
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Дашборд — Сбей ведьму</h1>
        <a href="./" className="dashboard__back">← Назад к игре</a>
      </div>

      {/* ── МЕТРИКИ ─────────────────────────────── */}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Метрики</h2>
        <div className="dashboard__metrics-grid">
          {mainMetrics.map((m) => (
            <div key={m.label} className="dashboard__metric-card">
              <div className="dashboard__metric-value">{m.value}</div>
              <div className="dashboard__metric-label">{m.label}</div>
              <div className="dashboard__metric-desc">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── РЕЙТИНГИ ────────────────────────────── */}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Распределение оценок</h2>
        <div className="dashboard__ratings">
          {([5, 4, 3, 2, 1] as const).map((n) => {
            const count = metrics.ratings[n];
            const total = ratingTotal(metrics.ratings);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={n} className="dashboard__rating-row">
                <span className="dashboard__rating-star">{"★".repeat(n)}{"☆".repeat(5 - n)}</span>
                <div className="dashboard__rating-bar-wrap">
                  <div className="dashboard__rating-bar" style={{ width: `${pct}%` }} />
                </div>
                <span className="dashboard__rating-count">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── ТАБЛИЦА ЛИДЕРОВ ─────────────────────── */}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Таблица лидеров</h2>
        {leaderboard.length === 0 ? (
          <div className="dashboard__empty">Прохождений пока нет</div>
        ) : (
          <div className="dashboard__table-wrap">
            <table className="dashboard__table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Правильно</th>
                  <th>Точность</th>
                  <th>Pipeline спасено</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((e, i) => (
                  <tr key={e.sessionId + i} className={i === 0 ? "dashboard__table-top" : ""}>
                    <td>{i + 1}</td>
                    <td>{e.score} / {e.total}</td>
                    <td>{e.accuracy}%</td>
                    <td>{e.pipelineSaved} дн</td>
                    <td>{e.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── КОНТАКТЫ ОХОТНИКОВ ──────────────────── */}
      <section className="dashboard__section">
        <div className="dashboard__section-header">
          <h2 className="dashboard__section-title">Охотники (контакты)</h2>
          {hunterContacts.length > 5 && (
            <button
              className="btn btn--secondary btn--sm"
              onClick={() => setShowAllContacts(!showAllContacts)}
            >
              {showAllContacts ? "Свернуть" : `Все ${hunterContacts.length}`}
            </button>
          )}
        </div>
        {hunterContacts.length === 0 ? (
          <div className="dashboard__empty">Контактов пока нет</div>
        ) : (
          <div className="dashboard__table-wrap">
            <table className="dashboard__table dashboard__contacts-table">
              <thead>
                <tr>
                  <th>Контакт</th>
                  <th>Дата</th>
                </tr>
              </thead>
              <tbody>
                {(showAllContacts ? hunterContacts : hunterContacts.slice(0, 5)).map((c, i) => (
                  <tr key={i}>
                    <td>{c.value}</td>
                    <td>{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── ДЕЙСТВИЯ ────────────────────────────── */}
      <section className="dashboard__section dashboard__actions">
        <button className="btn btn--export" onClick={exportAnalytics}>
          Экспорт в JSON
        </button>
        <button
          className={`btn btn--reset ${confirmReset ? "btn--reset-confirm" : ""}`}
          onClick={handleReset}
          onBlur={() => setConfirmReset(false)}
        >
          {confirmReset ? "Подтвердить сброс" : "Сбросить все данные"}
        </button>
      </section>

      <div className="dashboard__refresh-note">
        Данные обновляются автоматически каждые 5 секунд
      </div>
    </div>
  );
}
