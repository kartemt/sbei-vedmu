import { useState, useEffect } from "react";
import {
  getAnalytics,
  resetAnalytics,
  exportAnalytics,
} from "../utils/analytics";
import type { ContactEntry, RatingCounts } from "../utils/analytics";

type Metrics = {
  visits: number;
  screen3Visits: number;
  ctaClicks: number;
  returns: number;
  ratings: RatingCounts;
  contacts: ContactEntry[];
};

function ratingTotal(r: RatingCounts): number {
  return Object.values(r).reduce((a, b) => a + b, 0);
}

function ratingAvg(r: RatingCounts): string {
  const total = ratingTotal(r);
  if (total === 0) return "—";
  const sum = ([1, 2, 3, 4, 5] as const).reduce((a, n) => a + n * r[n], 0);
  return (sum / total).toFixed(1);
}

export function DashboardScreen() {
  const [data, setData] = useState<Metrics>(() => {
    const a = getAnalytics();
    return {
      visits: a.visits,
      screen3Visits: a.screen3Visits,
      ctaClicks: a.ctaClicks,
      returns: a.returns,
      ratings: a.ratings,
      contacts: a.contacts,
    };
  });
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const a = getAnalytics();
      setData({
        visits: a.visits,
        screen3Visits: a.screen3Visits,
        ctaClicks: a.ctaClicks,
        returns: a.returns,
        ratings: a.ratings,
        contacts: a.contacts,
      });
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function handleReset() {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetAnalytics();
    setConfirmReset(false);
    const a = getAnalytics();
    setData({ visits: a.visits, screen3Visits: a.screen3Visits, ctaClicks: a.ctaClicks, returns: a.returns, ratings: a.ratings, contacts: a.contacts });
  }

  const metrics = [
    {
      label: "Посетители",
      value: data.visits,
      desc: "Уникальных сессий (зашедших на страницу)",
    },
    {
      label: "Пользователи",
      value: data.screen3Visits,
      desc: "Прошедших до Экрана 3 (кейсы)",
    },
    {
      label: "Ключевое действие",
      value: data.ctaClicks,
      desc: "Кликнувших «Хочу продолжить путь»",
    },
    {
      label: "Возвраты",
      value: data.returns,
      desc: "Пользователей, зашедших на следующий день",
    },
    {
      label: "Оценок получено",
      value: ratingTotal(data.ratings),
      desc: `Средняя оценка: ${ratingAvg(data.ratings)} / 5`,
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1 className="dashboard__title">Дашборд — Сбей ведьму</h1>
        <a href="./" className="dashboard__back">← Назад к игре</a>
      </div>

      {/* ── ОСНОВНЫЕ МЕТРИКИ ──────────────────────── */}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Метрики</h2>
        <div className="dashboard__metrics-grid">
          {metrics.map((m) => (
            <div key={m.label} className="dashboard__metric-card">
              <div className="dashboard__metric-value">{m.value}</div>
              <div className="dashboard__metric-label">{m.label}</div>
              <div className="dashboard__metric-desc">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── РЕЙТИНГИ ─────────────────────────────── */}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Распределение оценок</h2>
        <div className="dashboard__ratings">
          {([1, 2, 3, 4, 5] as const).map((n) => {
            const count = data.ratings[n];
            const total = ratingTotal(data.ratings);
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

      {/* ── ПОСЛЕДНИЕ КОНТАКТЫ ───────────────────── */}
      <section className="dashboard__section">
        <h2 className="dashboard__section-title">Последние 5 контактов</h2>
        {data.contacts.length === 0 ? (
          <div className="dashboard__empty">Контактов пока нет</div>
        ) : (
          <table className="dashboard__contacts-table">
            <thead>
              <tr>
                <th>Контакт</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {data.contacts.slice(0, 5).map((c, i) => (
                <tr key={i}>
                  <td>{c.value}</td>
                  <td>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
          {confirmReset ? "Подтвердить сброс" : "Сбросить все метрики"}
        </button>
      </section>

      <div className="dashboard__refresh-note">
        Данные обновляются автоматически каждые 5 секунд
      </div>
    </div>
  );
}
