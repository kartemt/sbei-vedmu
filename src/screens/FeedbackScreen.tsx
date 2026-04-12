import { useEffect } from "react";
import type { CaseFeedback, GameCase, OutcomeVariant } from "../types";
import { gameAssets } from "../config/gameAssets";

type Props = {
  gameCase: GameCase;
  variant: OutcomeVariant;
  onNext: () => void;
};

type OutcomeConfig = {
  emoji: string;
  headline: string;
  colorClass: string;
};

function daysToMonths(days: number | undefined): string {
  if (!days) return "";
  const m = Math.round(days / 30);
  return m >= 1 ? `${m} мес` : `${days} дн`;
}

function getOutcome(variant: OutcomeVariant, gameCase: GameCase): OutcomeConfig {
  const saved = daysToMonths(gameCase.pipelineDaysSaved);

  switch (variant) {
    case "correct_hit":
      return { emoji: "💥", headline: `Поздравляю! +${saved || "pipeline"} жизни`, colorClass: "outcome--win" };
    case "wrong_hit":
      return { emoji: "💀", headline: `Убита живая сделка${saved ? ` −${saved}` : ""}`, colorClass: "outcome--lose" };
    case "correct_pass":
      return { emoji: "✅", headline: `Живая сделка${saved ? ` +${saved}` : ""}`, colorClass: "outcome--win" };
    case "wrong_pass":
    case "timeout_witch":
      return { emoji: "🧙", headline: `Ведьма ушла${saved ? ` −${saved} жизни` : ""}`, colorClass: "outcome--lose" };
    case "timeout_deal":
      return { emoji: "✅", headline: `Живая сделка${saved ? ` +${saved}` : ""}`, colorClass: "outcome--win" };
    case "correct_probe":
      return { emoji: "🎯", headline: "Сильный вопрос. Сделка вскрыта.", colorClass: "outcome--win" };
    case "wrong_probe":
      return { emoji: "❓", headline: "Слабый вопрос.", colorClass: "outcome--neutral" };
  }
}

function getFeedback(variant: OutcomeVariant, gameCase: GameCase): CaseFeedback | null {
  switch (variant) {
    case "correct_hit":
    case "correct_pass":
    case "timeout_deal":
    case "correct_probe":
      return gameCase.feedbackCorrect;
    case "wrong_hit":
      return gameCase.feedbackWrongHit ?? null;
    case "wrong_pass":
    case "timeout_witch":
      return gameCase.feedbackWrongPass ?? null;
    case "wrong_probe":
      return gameCase.feedbackWrongProbe ?? null;
    default:
      return null;
  }
}

const AUTO_ADVANCE_MS = 4000;

export function FeedbackScreen({ gameCase, variant, onNext }: Props) {
  const outcome = getOutcome(variant, gameCase);
  const feedback = getFeedback(variant, gameCase);

  useEffect(() => {
    const timer = setTimeout(onNext, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`outcome ${outcome.colorClass}`} onClick={onNext}>
      {/* Background image from feedback/final screen */}
      <img
        src={gameAssets.backgrounds.feedback}
        alt=""
        aria-hidden="true"
        className="outcome__bg"
      />

      <div className="outcome__content">
        <div className="outcome__emoji">{outcome.emoji}</div>
        <div className="outcome__headline">{outcome.headline}</div>

        {feedback && (
          <div className="outcome__feedback">
            <p className="outcome__explanation">{feedback.shortExplanation}</p>
            {feedback.errorPattern && (
              <p className="outcome__pattern">
                <span className="outcome__pattern-label">Паттерн:</span> {feedback.errorPattern}
              </p>
            )}
            {feedback.pipelineImpact && (
              <p className="outcome__pipeline">{feedback.pipelineImpact}</p>
            )}
          </div>
        )}

        {gameCase.strongQuestion && (variant === "correct_probe" || variant === "wrong_probe") && (
          <div className="outcome__strong-q">
            Сильный вопрос: «{gameCase.strongQuestion}»
          </div>
        )}

        <div className="outcome__tap">нажмите, чтобы продолжить</div>
      </div>
    </div>
  );
}
