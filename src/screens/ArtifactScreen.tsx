import { useState } from "react";
import type { ArtifactData } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";
import { gameAssets } from "../config/gameAssets";

type Props = {
  artifact: ArtifactData;
  roundNumber: number;
  isFinalRound?: boolean;
  onContinue: () => void;
};

export function ArtifactScreen({ artifact, roundNumber, isFinalRound, onContinue }: Props) {
  const [imgError, setImgError] = useState(false);
  const src = gameAssets.artifacts[artifact.imageKey];

  return (
    <BackgroundScreen bgKey="roundIntro">
      <div className="artifact-screen">
        <div className="artifact-screen__header">
          <div className="artifact-screen__round-complete">
            Раунд {roundNumber} завершён
          </div>
          <div className="artifact-screen__reward-label">Артефакт получен</div>
        </div>

        <div className="artifact-screen__artifact">
          {imgError ? (
            <div className="artifact-screen__img-fallback">
              <span className="artifact-screen__img-fallback-icon">⚔️</span>
            </div>
          ) : (
            <img
              src={src}
              alt={artifact.name}
              className="artifact-screen__img"
              onError={() => setImgError(true)}
            />
          )}
          <h3 className="artifact-screen__name">{artifact.name}</h3>
          <p className="artifact-screen__description">{artifact.description}</p>
        </div>

        <button className="btn btn--primary" onClick={onContinue}>
          {isFinalRound ? "Финальная аналитика" : "Следующий раунд"}
        </button>
      </div>
    </BackgroundScreen>
  );
}
