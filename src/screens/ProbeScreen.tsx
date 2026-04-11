import type { GameCase, ProbeOption } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";
import { CharacterImage } from "../components/CharacterImage";

type Props = {
  gameCase: GameCase;
  onProbeSelected: (option: ProbeOption) => void;
};

export function ProbeScreen({ gameCase, onProbeSelected }: Props) {
  const options = gameCase.probeOptions ?? [];

  return (
    <BackgroundScreen bgKey="caseScreen">
      <div className="probe-screen">
        <div className="probe-screen__header">
          <span className="case-screen__round-badge">Раунд {gameCase.round} — выбор вопроса</span>
        </div>

        <div className="probe-screen__body">
          <div className="probe-screen__character-area">
            <CharacterImage
              characterType={gameCase.characterType}
              className="probe-screen__character-img"
            />
          </div>

          <div className="probe-screen__question">
            <div className="probe-screen__label">
              Выберите сильный квалифицирующий вопрос:
            </div>
            <ul className="probe-screen__options">
              {options.map((opt) => (
                <li key={opt.id}>
                  <button
                    className="probe-screen__option-btn"
                    onClick={() => onProbeSelected(opt)}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </BackgroundScreen>
  );
}
