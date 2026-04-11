import { useState } from "react";
import type { ReactNode } from "react";
import type { GameAssetsBackgrounds } from "../config/gameAssets";
import { gameAssets } from "../config/gameAssets";

type Props = {
  bgKey: keyof GameAssetsBackgrounds;
  children: ReactNode;
  overlay?: boolean;
  className?: string;
};

export function BackgroundScreen({
  bgKey,
  children,
  overlay = true,
  className,
}: Props) {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [bgError, setBgError] = useState(false);
  const src = gameAssets.backgrounds[bgKey];

  return (
    <div className={`bg-screen ${className ?? ""}`}>
      {!bgError && (
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className={`bg-screen__image ${bgLoaded ? "bg-screen__image--loaded" : ""}`}
          onLoad={() => setBgLoaded(true)}
          onError={() => setBgError(true)}
        />
      )}
      {overlay && <div className="bg-screen__overlay" />}
      <div className="bg-screen__content">{children}</div>
    </div>
  );
}
