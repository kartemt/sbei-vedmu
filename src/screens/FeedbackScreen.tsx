import type { ActionType, CaseFeedback, GameCase } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";
import { CharacterImage } from "../components/CharacterImage";

type Props = {
  gameCase: GameCase;
  playerAction: ActionType;
  probeWasCorrect: boolean | null;
  onNext: () => void;
};

function getFeedback(
  gameCase: GameCase,
  playerAction: ActionType
): CaseFeedback & { isCorrect: boolean } {
  const isCorrect = playerAction === gameCase.correctAction;

  if (isCorrect) return { ...gameCase.feedbackCorrect, isCorrect: true };

  if (playerAction === "hit" && gameCase.feedbackWrongHit)
    return { ...gameCase.feedbackWrongHit, isCorrect: false };
  if (playerAction === "pass" && gameCase.feedbackWrongPass)
    return { ...gameCase.feedbackWrongPass, isCorrect: false };
  if (playerAction === "probe" && gameCase.feedbackWrongProbe)
    return { ...gameCase.feedbackWrongProbe, isCorrect: false };

  return { ...gameCase.feedbackCorrect, isCorrect };
}

function getProbeMessage(
  gameCase: GameCase,
  playerAction: ActionType,
  probeWasCorrect: boolean | null
): string | null {
  if (playerAction !== "probe" || probeWasCorrect === null) return null;
  if (probeWasCorrect) return `Сильный вопрос: «${gameCase.strongQuestion}»`;
  return `Слабый вопрос. Сильный был бы: «${gameCase.strongQuestion}»`;
}

export function FeedbackScreen({
  gameCase,
  playerAction,
  probeWasCorrect,
  onNext,
}: Props) {
  const feedback = getFeedback(gameCase, playerAction);
  const probeMsg = getProbeMessage(gameCase, playerAction, probeWasCorrect);

  return (
    <BackgroundScreen bgKey="feedback">
      <div className="feedback-screen">
        <div
          className={`feedback-screen__verdict ${
            feedback.isCorrect
              ? "feedback-screen__verdict--correct"
              : "feedback-screen__verdict--wrong"
          }`}
        >
          <span className="feedback-screen__verdict-icon">
            {feedback.isCorrect ? "✓" : "✗"}
          </span>
          <span className="feedback-screen__verdict-title">
            {feedback.verdictTitle}
          </span>
        </div>

        <div className="feedback-screen__body">
          <div className="feedback-screen__character-area">
            <CharacterImage
              characterType={gameCase.characterType}
              className="feedback-screen__character-img"
            />
            <div className="feedback-screen__character-name">
              {gameCase.characterName}
            </div>
          </div>

          <div className="feedback-screen__details">
            {probeMsg && (
              <div
                className={`feedback-screen__probe-result ${
                  probeWasCorrect
                    ? "feedback-screen__probe-result--correct"
                    : "feedback-screen__probe-result--wrong"
                }`}
              >
                {probeMsg}
              </div>
            )}

            <p className="feedback-screen__explanation">
              {feedback.shortExplanation}
            </p>

            {feedback.errorPattern && (
              <div className="feedback-screen__pattern">
                <span className="feedback-screen__pattern-label">
                  Паттерн ошибки:
                </span>{" "}
                {feedback.errorPattern}
              </div>
            )}

            <div className="feedback-screen__impact">{feedback.pipelineImpact}</div>
          </div>
        </div>

        <button className="btn btn--primary" onClick={onNext}>
          Следующий кейс
        </button>
      </div>
    </BackgroundScreen>
  );
}
