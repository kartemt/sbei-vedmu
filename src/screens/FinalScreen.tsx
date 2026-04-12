import { useState } from "react";
import type { GameResults } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";
import { trackRating, trackContact, trackCta, trackCompletion } from "../utils/analytics";
import { sanitizeContact } from "../utils/sanitize";
import { useEffect } from "react";

type Props = {
  results: GameResults;
  caseResults: import("../types").CaseResult[];
  onRestart: () => void;
};

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

  const scoreLabel = getScoreLabel(results.correctAnswers, results.totalCases);
  const accuracy =
    results.totalCases > 0
      ? Math.round((results.correctAnswers / results.totalCases) * 100)
      : 0;

  useEffect(() => {
    trackCompletion(results, caseResults);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleRating(r: number) {
    setRating(r);
    trackRating(r as 1 | 2 | 3 | 4 | 5);
    setTimeout(() => setPhase("rating"), 300);
  }

  function handleHunterJoin() {
    const clean = sanitizeContact(contact);
    if (clean) {
      trackContact(clean);
      trackCta();
    }
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
            <button
              className="btn btn--primary btn--large"
              onClick={() => setPhase("hunter")}
            >
              Вступить в ряды охотников на ведьм
            </button>
            <button className="btn btn--secondary" onClick={onRestart}>
              Пройти заново
            </button>
          </div>
        )}

        {/* ── КОНТАКТ (охотники) ────────────── */}
        {phase === "hunter" && (
          <div className="final-screen__hunter">
            <p className="final-screen__hunter-text">
              Email или @telegram — пришлём следующий материал.
            </p>
            <input
              className="final-screen__contact-input"
              type="text"
              placeholder="email или @telegram"
              value={contact}
              maxLength={120}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleHunterJoin()}
              autoFocus
            />
            <div className="final-screen__hunter-btns">
              <button className="btn btn--primary" onClick={handleHunterJoin}>
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
