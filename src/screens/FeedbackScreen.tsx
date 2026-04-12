import type { GameCase, OutcomeVariant } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";

type Props = {
  gameCase: GameCase;
  variant: OutcomeVariant;
  onNext: () => void;
};

function daysToMonths(days: number | undefined): string {
  if (!days) return "";
  const m = Math.round(days / 30);
  return m >= 1 ? `${m} мес` : `${days} дн`;
}

type OutcomeConfig = {
  emoji: string;
  headline: string;
  sub: string;
  colorClass: string;
};

function getOutcome(variant: OutcomeVariant, gameCase: GameCase): OutcomeConfig {
  const saved = daysToMonths(gameCase.pipelineDaysSaved);

  switch (variant) {
    case "correct_hit":
      return {
        emoji: "💥",
        headline: `Поздравляю! +${saved || "pipeline"} жизни`,
        sub: "Это была ведьма. Правильно.",
        colorClass: "outcome--win",
      };
    case "wrong_hit":
      return {
        emoji: "💀",
        headline: `Увы — убита живая сделка${saved ? ` −${saved}` : ""}`,
        sub: "Это была живая сделка.",
        colorClass: "outcome--lose",
      };
    case "correct_pass":
      return {
        emoji: "✅",
        headline: `Ура! Живая сделка${saved ? ` +${saved}` : ""}`,
        sub: "Правильно пропущена.",
        colorClass: "outcome--win",
      };
    case "wrong_pass":
    case "timeout_witch":
      return {
        emoji: "🧙",
        headline: `Ведьма ушла${saved ? ` −${saved} жизни` : ""}`,
        sub: "Это была ведьма.",
        colorClass: "outcome--lose",
      };
    case "timeout_deal":
      return {
        emoji: "✅",
        headline: `Живая сделка${saved ? ` +${saved}` : ""}`,
        sub: "Пропущена — правильно.",
        colorClass: "outcome--win",
      };
    case "correct_probe":
      return {
        emoji: "🎯",
        headline: "Сильный вопрос. Сделка вскрыта.",
        sub: gameCase.strongQuestion
          ? `«${gameCase.strongQuestion}»`
          : "Квалификация прошла.",
        colorClass: "outcome--win",
      };
    case "wrong_probe":
      return {
        emoji: "❓",
        headline: "Слабый вопрос.",
        sub: gameCase.strongQuestion
          ? `Сильный: «${gameCase.strongQuestion}»`
          : "Нужен более точный вопрос.",
        colorClass: "outcome--neutral",
      };
  }
}

export function FeedbackScreen({ gameCase, variant, onNext }: Props) {
  const outcome = getOutcome(variant, gameCase);

  return (
    <BackgroundScreen bgKey="feedback" overlay={false}>
      <div className={`outcome ${outcome.colorClass}`} onClick={onNext}>
        <div className="outcome__content">
          <div className="outcome__emoji">{outcome.emoji}</div>
          <div className="outcome__headline">{outcome.headline}</div>
          <div className="outcome__sub">{outcome.sub}</div>
          <div className="outcome__tap">нажмите, чтобы продолжить</div>
        </div>
      </div>
    </BackgroundScreen>
  );
}
