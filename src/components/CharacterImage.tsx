import { useState } from "react";
import type { CharacterType } from "../types";
import { gameAssets } from "../config/gameAssets";
import { characterByType } from "../data/characters";

const CHARACTER_KEY_MAP: Record<
  CharacterType,
  keyof typeof gameAssets.characters
> = {
  messenger_witch: "messengerWitch",
  researcher_witch: "researcherWitch",
  mirage_witch: "mirageWitch",
  golden_mirage_boss: "goldenMirageBoss",
  deal_anchor: "dealAnchor",
  deal_route: "dealRoute",
  deal_mandate: "dealMandate",
};

type Props = {
  characterType: CharacterType;
  className?: string;
};

export function CharacterImage({ characterType, className }: Props) {
  const [hasError, setHasError] = useState(false);
  const imageKey = CHARACTER_KEY_MAP[characterType];
  const src = gameAssets.characters[imageKey];
  const character = characterByType[characterType];

  const isWitch = [
    "messenger_witch",
    "researcher_witch",
    "mirage_witch",
    "golden_mirage_boss",
  ].includes(characterType);

  if (hasError) {
    return (
      <div
        className={`character-fallback ${isWitch ? "character-fallback--witch" : "character-fallback--deal"} ${className ?? ""}`}
        aria-label={character?.name}
      >
        <span className="character-fallback__icon">{isWitch ? "🧙" : "✅"}</span>
        <span className="character-fallback__name">{character?.name}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={character?.name ?? characterType}
      className={`character-image ${className ?? ""}`}
      onError={() => setHasError(true)}
    />
  );
}
