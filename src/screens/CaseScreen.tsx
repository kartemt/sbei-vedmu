import type { ActionType, GameCase } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";
import { CharacterImage } from "../components/CharacterImage";

type Props = {
  gameCase: GameCase;
  caseNumber: number;
  totalCases: number;
  onAction: (action: ActionType) => void;
};

const ACTION_LABELS: Record<ActionType, string> = {
  hit: "Сбить",
  pass: "Пропустить",
  probe: "Проверить вопросом",
};

const ACTION_DESCRIPTIONS: Record<ActionType, string> = {
  hit: "Это ведьма — убрать из pipeline",
  pass: "Это живая сделка — продолжать",
  probe: "Нужна квалификация — задать вопрос",
};

export function CaseScreen({
  gameCase,
  caseNumber,
  totalCases,
  onAction,
}: Props) {
  return (
    <BackgroundScreen bgKey="caseScreen">
      <div className="case-screen">
        <div className="case-screen__header">
          <span className="case-screen__round-badge">
            Раунд {gameCase.round}
          </span>
          <span className="case-screen__progress">
            {caseNumber} / {totalCases}
          </span>
        </div>

        <div className="case-screen__body">
          <div className="case-screen__character-area">
            <CharacterImage
              characterType={gameCase.characterType}
              className="case-screen__character-img"
            />
            <div className="case-screen__character-name">
              {gameCase.characterName}
            </div>
          </div>

          <div className="case-screen__signals">
            <div className="case-screen__signals-label">Сигналы:</div>
            <ul className="case-screen__signals-list">
              {gameCase.signals.map((signal, i) => (
                <li key={i} className="case-screen__signal-item">
                  <span className="case-screen__signal-bullet">—</span>
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="case-screen__actions">
          {gameCase.availableActions.map((action) => (
            <button
              key={action}
              className={`btn btn--action btn--action-${action}`}
              onClick={() => onAction(action)}
            >
              <span className="btn__label">{ACTION_LABELS[action]}</span>
              <span className="btn__desc">{ACTION_DESCRIPTIONS[action]}</span>
            </button>
          ))}
        </div>
      </div>
    </BackgroundScreen>
  );
}
