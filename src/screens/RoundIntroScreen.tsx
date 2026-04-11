import type { RoundData } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";

type Props = {
  roundData: RoundData;
  caseNumber: number;
  totalCases: number;
  onContinue: () => void;
};

export function RoundIntroScreen({
  roundData,
  caseNumber,
  totalCases,
  onContinue,
}: Props) {
  return (
    <BackgroundScreen bgKey="roundIntro">
      <div className="round-intro">
        <div className="round-intro__number">Раунд {roundData.round} из 4</div>
        <h2 className="round-intro__title">{roundData.title}</h2>
        <p className="round-intro__subtitle">{roundData.subtitle}</p>
        <div className="round-intro__text">{roundData.introText}</div>
        <div className="round-intro__progress">
          Кейс {caseNumber} из {totalCases}
        </div>
        <button className="btn btn--primary" onClick={onContinue}>
          Вперёд
        </button>
      </div>
    </BackgroundScreen>
  );
}
