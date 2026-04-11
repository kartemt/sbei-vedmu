import type { GameResults } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";

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
  const scoreLabel = getScoreLabel(results.correctAnswers, results.totalCases);
  const accuracy =
    results.totalCases > 0
      ? Math.round((results.correctAnswers / results.totalCases) * 100)
      : 0;

  return (
    <BackgroundScreen bgKey="final">
      <div className="final-screen">
        <div className="final-screen__header">
          <div className="final-screen__badge">Диагностика завершена</div>
          <h2 className="final-screen__title">{scoreLabel}</h2>
          <div className="final-screen__accuracy">{accuracy}% точность</div>
        </div>

        <div className="final-screen__stats">
          <div className="final-screen__stat">
            <span className="final-screen__stat-value">
              {results.witchesHitCorrectly}
            </span>
            <span className="final-screen__stat-label">ведьм сбито верно</span>
          </div>
          <div className="final-screen__stat">
            <span className="final-screen__stat-value">
              {results.liveDealsSaved}
            </span>
            <span className="final-screen__stat-label">
              живых сделок сохранено
            </span>
          </div>
          <div className="final-screen__stat">
            <span className="final-screen__stat-value">
              {results.probeDecisionsCorrect}
            </span>
            <span className="final-screen__stat-label">
              верных решений через вопрос
            </span>
          </div>
          <div className="final-screen__stat final-screen__stat--highlight">
            <span className="final-screen__stat-value">
              {formatDays(results.pipelineDaysSaved)}
            </span>
            <span className="final-screen__stat-label">
              pipeline спасено
            </span>
          </div>
        </div>

        <div className="final-screen__diagnosis">
          {results.mainBlindSpot && (
            <div className="final-screen__blind-spot">
              <span className="final-screen__diagnosis-label">
                Слепой угол:
              </span>{" "}
              {results.mainBlindSpot}
            </div>
          )}

          {results.dominantErrorPattern && (
            <div className="final-screen__error-pattern">
              <span className="final-screen__diagnosis-label">
                Паттерн ошибки:
              </span>{" "}
              {results.dominantErrorPattern}
            </div>
          )}

          {results.mainRedFlag && (
            <div className="final-screen__red-flag">
              <span className="final-screen__diagnosis-label">
                Главный красный флаг:
              </span>{" "}
              {results.mainRedFlag}
            </div>
          )}

          {!results.mainBlindSpot &&
            !results.dominantErrorPattern &&
            !results.mainRedFlag && (
              <div className="final-screen__clean">
                Слепых углов не обнаружено. Вы различаете живые сделки от ведьм.
              </div>
            )}
        </div>

        <div className="final-screen__motto">
          Не все тёплые сделки — живые.
          <br />
          Но и не все сложные сделки — ведьмы.
        </div>

        <button className="btn btn--primary" onClick={onRestart}>
          Пройти ещё раз
        </button>
      </div>
    </BackgroundScreen>
  );
}
