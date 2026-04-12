import { useState, useEffect } from "react";
import {
  getAnalytics,
  getLeaderboard,
  resetAnalytics,
  exportAnalytics,
  checkAdminPin,
} from "../utils/analytics";
import type { LeaderEntry, RatingCounts } from "../utils/analytics";

// ── Types ─────────────────────────────────────────────────────────────────
type Metrics = {
  visits: number;
  screen3Visits: number;
  ctaClicks: number;
  completions: number;
  returns: number;
  ratings: RatingCounts;
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
    },
    leaderboard: getLeaderboard(),
  };
}

// ── PIN Gate ──────────────────────────────────────────────────────────────
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;
    if (checkAdminPin(pin)) {
      onUnlock();
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setError(true);
      setPin("");
      setTimeout(() => setError(false), 2000);
      // Lock out after 5 failed attempts for 60 seconds
      if (next >= 5) {
        setLocked(true);
        setTimeout(() => { setLocked(false); setAttempts(0); }, 60_000);
      }
    }
  }

  return (
    <div className="dashboard dashboard--gate">
      <div className="dashboard__gate-card">
        <div className="dashboard__gate-icon">🔒</div>
        <h2 className="dashboard__gate-title">Дашборд</h2>
        <p className="dashboard__gate-sub">
          {locked
            ? "Слишком много попыток. Подождите 60 секунд."
            : "Введите PIN для доступа"}
        </p>
        <form onSubmit={handleSubmit} className="dashboard__gate-form">
          <input
            className={`dashboard__gate-input ${error ? "dashboard__gate-input--error" : ""}`}
            type="password"
            placeholder="PIN"
            value={pin}
            maxLength={20}
            autoFocus
            disabled={locked}
            onChange={(e) => setPin(e.target.value)}
            aria-label="Admin PIN"
          />
          <button type="submit" className="btn btn--primary" disabled={locked}>
            Войти
          </button>
        </form>
        {error && !locked && <div className="dashboard__gate-error">Неверный PIN</div>}
        <p className="dashboard__gate-note">
          Контакты игроков хранятся в Supabase.<br />
          Для их просмотра используйте серверный дашборд.
        </p>
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
    { label: "Посетители",       value: metrics.visits,       desc: "Уникальных сессий" },
    { label: "До игры",          value: metrics.screen3Visits, desc: "Дошли до кейсов" },
    { label: "Прошли полностью", value: metrics.completions,  desc: "Завершили все раунды" },
    { label: "CTA-клики",        value: metrics.ctaClicks,    desc: "«Вступить в охотники»" },
    { label: "Возвраты",         value: metrics.returns,      desc: "Зашли на следующий день" },
    { label: "Оценок",           value: ratingTotal(metrics.ratings), desc: `Средняя: ${ratingAvg(metrics.ratings)} / 5` },
  ];

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
        <h2 className="dashboard__section-title">Метрики (этот браузер)</h2>
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

      {/* ── КОНТАКТЫ — только через серверный дашборд ── */}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Контакты охотников</h2>
        <div className="dashboard__info-note">
          Контакты игроков хранятся в Supabase и доступны только через
          серверный дашборд на Beget. Откройте его по адресу, указанному
          при деплое.
        </div>
      </section>

      {/* ── ДЕЙСТВИЯ ────────────────────────────── */}
      <section className="dashboard__section dashboard__actions">
        <button className="btn btn--export" onClick={exportAnalytics}>
          Экспорт метрик в JSON
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
