import { useState } from "react";
import type { GameResults } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";
import { trackRating, trackContact, trackCta } from "../utils/analytics";

type Props = {
  results: GameResults;
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

export function FinalScreen({ results, onRestart }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  const scoreLabel = getScoreLabel(results.correctAnswers, results.totalCases);
  const accuracy =
    results.totalCases > 0
      ? Math.round((results.correctAnswers / results.totalCases) * 100)
      : 0;

  function handleRating(r: number) {
    if (submitted) return;
    setRating(r);
    trackRating(r as 1 | 2 | 3 | 4 | 5);
  }

  function handleSubmit() {
    if (submitted) return;
    if (contact.trim()) trackContact(contact.trim());
    trackCta();
    setSubmitted(true);
  }

  return (
    <BackgroundScreen bgKey="final">
      <div className="final-screen">

        {/* ── ИТОГИ ───────────────────────────────── */}
        <div className="final-screen__header">
          <div className="final-screen__badge">Диагностика завершена</div>
          <h2 className="final-screen__title">{scoreLabel}</h2>
          <div className="final-screen__accuracy">{accuracy}% точность</div>
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

        {results.mainBlindSpot && (
          <div className="final-screen__diagnosis">
            <span className="final-screen__diagnosis-label">Слепой угол: </span>
            {results.mainBlindSpot}
          </div>
        )}

        {/* ── РЕЙТИНГ ─────────────────────────────── */}
        <div className="final-screen__rating-block">
          <div className="final-screen__rating-label">
            Насколько понравилось валить ведьм?
          </div>
          <div className="final-screen__stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`final-screen__star ${
                  (hovered ?? rating ?? 0) >= n ? "final-screen__star--active" : ""
                } ${submitted ? "final-screen__star--disabled" : ""}`}
                onClick={() => handleRating(n)}
                onMouseEnter={() => !submitted && setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                aria-label={`${n} из 5`}
              >
                ★
              </button>
            ))}
          </div>
          {rating && !submitted && (
            <div className="final-screen__rating-hint">
              {["", "Тяжело, но полезно", "Есть над чем работать", "Норм", "Понравилось", "Огонь"][rating]}
            </div>
          )}
        </div>

        {/* ── КОНТАКТ + CTA ───────────────────────── */}
        {!submitted ? (
          <div className="final-screen__cta-block">
            <div className="final-screen__cta-label">
              Хотите продолжить прокачку квалификации?
            </div>
            <input
              type="text"
              className="final-screen__contact-input"
              placeholder="Email или @telegram"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button className="btn btn--primary btn--large" onClick={handleSubmit}>
              Хочу продолжить путь
            </button>
            <button className="final-screen__skip" onClick={onRestart}>
              Пройти ещё раз без регистрации
            </button>
          </div>
        ) : (
          <div className="final-screen__thanks">
            <div className="final-screen__thanks-title">Отлично.</div>
            <p className="final-screen__thanks-text">
              Скоро пришлём следующий шаг. А пока — подумайте, какая сделка из вашего
              текущего pipeline выглядит как ведьма.
            </p>
            <div className="final-screen__motto">
              Не все тёплые сделки — живые.<br />
              Но и не все сложные сделки — ведьмы.
            </div>
            <button className="btn btn--primary" onClick={onRestart}>
              Пройти ещё раз
            </button>
          </div>
        )}

      </div>
    </BackgroundScreen>
  );
}
