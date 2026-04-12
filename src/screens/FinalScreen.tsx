import { useState, useEffect } from "react";
import type { GameResults, CaseResult } from "../types";
import type { LeaderEntry } from "../utils/analytics";
import { BackgroundScreen } from "../components/BackgroundScreen";
import {
  trackRating,
  trackCta,
  trackCompletion,
  getLeaderboard,
  getCurrentSessionId,
} from "../utils/analytics";
import { submitContact } from "../utils/contactSubmit";

type Props = {
  results: GameResults;
  caseResults: CaseResult[];
  onRestart: () => void;
};

// ── Fantasy hunter names for other leaderboard entries ────────────────────
const HUNTER_NAMES = [
  "Одинокий монах",
  "Странствующий всадник",
  "Тёмный охотник",
  "Серебряный следопыт",
  "Ночной страж",
  "Лесной дозорный",
  "Железный инквизитор",
  "Потерянный рыцарь",
  "Бродячий маг",
  "Серый пилигрим",
  "Безымянный следопыт",
  "Хромой провидец",
  "Последний вестник",
  "Слепой пророк",
];

function hunterName(index: number): string {
  return HUNTER_NAMES[index % HUNTER_NAMES.length];
}

function formatDays(days: number): string {
  if (days === 0) return "0 дней";
  if (days % 10 === 1 && days % 100 !== 11) return `${days} день`;
  if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100))
    return `${days} дня`;
  return `${days} дней`;
}

function getScoreLabel(correct: number, total: number): string {
  const pct = total > 0 ? correct / total : 0;
  if (pct >= 0.9) return "Сильный квалификатор";
  if (pct >= 0.7) return "Хороший старт";
  if (pct >= 0.5) return "Есть над чем работать";
  return "Нужна практика";
}

type Phase = "results" | "rating" | "hunter" | "done";

export function FinalScreen({ results, caseResults, onRestart }: Props) {
  const [phase, setPhase] = useState<Phase>("results");
  const [rating, setRating] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [contact, setContact] = useState("");
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [mySessionId, setMySessionId] = useState<string | null>(null);

  const scoreLabel = getScoreLabel(results.correctAnswers, results.totalCases);
  const accuracy =
    results.totalCases > 0
      ? Math.round((results.correctAnswers / results.totalCases) * 100)
      : 0;

  useEffect(() => {
    const sessionId = getCurrentSessionId();
    setMySessionId(sessionId);
    trackCompletion(results, caseResults);
    setLeaderboard(getLeaderboard());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRating(r: number) {
    setRating(r);
    trackRating(r as 1 | 2 | 3 | 4 | 5);
    setTimeout(() => setPhase("rating"), 300);
  }

  async function handleHunterJoin() {
    const result = await submitContact(contact);
    if (result === "ok") trackCta();
    setPhase("done");
  }

  return (
    <BackgroundScreen bgKey="final">
      <div className="final-screen">

        {/* ── ИТОГИ ─────────────────────────── */}
        <div className="final-screen__header">
          <div className="final-screen__badge">Охота завершена</div>
          <h2 className="final-screen__title">{scoreLabel}</h2>
          <div className="final-screen__accuracy">{accuracy}%</div>
        </div>

        <div className="final-screen__stats">
          <div className="final-screen__stat">
            <span className="final-screen__stat-value">{results.witchesHitCorrectly}</span>
            <span className="final-screen__stat-label">ведьм сбито</span>
          </div>
          <div className="final-screen__stat">
            <span className="final-screen__stat-value">{results.liveDealsSaved}</span>
            <span className="final-screen__stat-label">сделок сохранено</span>
          </div>
          <div className="final-screen__stat final-screen__stat--highlight">
            <span className="final-screen__stat-value">{formatDays(results.pipelineDaysSaved)}</span>
            <span className="final-screen__stat-label">pipeline спасено</span>
          </div>
        </div>

        {/* ── РЕЙТИНГ ───────────────────────── */}
        {phase === "results" && (
          <div className="final-screen__rating-block">
            <div className="final-screen__rating-label">Насколько понравилось?</div>
            <div className="final-screen__stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`final-screen__star ${(hovered ?? 0) >= n || (rating ?? 0) >= n ? "final-screen__star--active" : ""}`}
                  onClick={() => handleRating(n)}
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(null)}
                  aria-label={`${n} из 5`}
                >★</button>
              ))}
            </div>
          </div>
        )}

        {/* ── ДВЕ КНОПКИ ────────────────────── */}
        {(phase === "results" || phase === "rating") && (
          <div className="final-screen__cta-block">
            <div className="final-screen__hunter-cta">
              <button
                className="btn btn--primary btn--large"
                onClick={() => setPhase("hunter")}
              >
                Вступить в ряды охотников на ведьм
              </button>
              <span className="final-screen__cta-hint">E-mail или контакт в соцсетях</span>
            </div>
            <button className="btn btn--secondary" onClick={onRestart}>
              Пройти заново
            </button>
          </div>
        )}

        {/* ── ТАБЛИЦА ЛИДЕРОВ ───────────────── */}
        {leaderboard.length > 0 && (
          <div className="final-leaderboard">
            <div className="final-leaderboard__title">Таблица охотников</div>
            <div className="final-leaderboard__list">
              {leaderboard.map((entry, i) => {
                const isMe = entry.sessionId === mySessionId;
                const name = isMe ? "Я" : hunterName(i);
                return (
                  <div
                    key={entry.sessionId + i}
                    className={`final-leaderboard__row ${isMe ? "final-leaderboard__row--me" : ""}`}
                  >
                    <span className="final-leaderboard__rank">#{i + 1}</span>
                    <span className="final-leaderboard__name">{name}</span>
                    <span className="final-leaderboard__score">{entry.score}/{entry.total}</span>
                    <span className="final-leaderboard__accuracy">{entry.accuracy}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── КОНТАКТ (охотники) ────────────── */}
        {phase === "hunter" && (
          <div className="final-screen__hunter">
            <p className="final-screen__hunter-text">
              Куда прислать приглашение?<br />
              E-mail или контакт в соцсетях.
            </p>
            <input
              className="final-screen__contact-input"
              type="text"
              placeholder="E-mail или контакт в соцсетях"
              value={contact}
              maxLength={120}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleHunterJoin()}
              autoFocus
            />
            <div className="final-screen__hunter-btns">
              <button className="btn btn--primary btn--large" onClick={handleHunterJoin}>
                Вступить
              </button>
              <button className="btn btn--secondary" onClick={onRestart}>
                Пройти заново
              </button>
            </div>
          </div>
        )}

        {/* ── СПАСИБО ───────────────────────── */}
        {phase === "done" && (
          <div className="final-screen__thanks">
            <div className="final-screen__thanks-title">Записано.</div>
            <p className="final-screen__thanks-text">
              Думайте: какая сделка из вашего pipeline сейчас ведьма?
            </p>
            <button className="btn btn--primary" onClick={onRestart}>
              Пройти заново
            </button>
          </div>
        )}

      </div>
    </BackgroundScreen>
  );
}
