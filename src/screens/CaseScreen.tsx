import { useEffect, useRef, useState } from "react";
import type { ActionType, GameCase, RoundData } from "../types";
import { BackgroundScreen } from "../components/BackgroundScreen";
import { CharacterImage } from "../components/CharacterImage";

type Props = {
  gameCase: GameCase;
  roundData: RoundData;
  isFirstCaseOfRound: boolean;
  caseNumber: number;
  totalCases: number;
  onAction: (action: ActionType, wasTimeout?: boolean) => void;
};

type FlyState = "flying" | "exploding" | "done";

const ACTION_LABELS: Record<ActionType, string> = {
  hit: "Сбить",
  pass: "Пропустить",
  probe: "Задать вопрос",
};

export function CaseScreen({
  gameCase,
  roundData,
  isFirstCaseOfRound,
  caseNumber,
  totalCases,
  onAction,
}: Props) {
  const [flyState, setFlyState] = useState<FlyState>("flying");
  const [resolved, setResolved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const duration = roundData.flightDurationMs;

  // Auto-pass when flight ends
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      if (!resolved) handleAction("pass", true);
    }, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAction(action: ActionType, wasTimeout = false) {
    if (resolved) return;
    setResolved(true);
    if (timerRef.current) clearTimeout(timerRef.current);

    if (action === "hit" && !wasTimeout) {
      setFlyState("exploding");
      setTimeout(() => onAction(action, false), 550);
    } else if (action === "probe" && !wasTimeout) {
      setFlyState("done");
      onAction(action, false);
    } else {
      setFlyState("done");
      onAction(action, wasTimeout);
    }
  }

  const durationSec = `${duration / 1000}s`;

  return (
    <BackgroundScreen bgKey="caseScreen">
      <div className="case-screen">
        {/* ── HEADER ─────────────────────────────── */}
        <div className="case-screen__header">
          {isFirstCaseOfRound && (
            <div className="case-screen__round-intro">
              <span className="case-screen__round-title">{roundData.title}</span>
              <span className="case-screen__round-sub">{roundData.subtitle}</span>
            </div>
          )}
          <span className="case-screen__progress">{caseNumber} / {totalCases}</span>
        </div>

        {/* ── FLYING AREA ────────────────────────── */}
        <div className="case-screen__sky">
          <div
            className={`witch-wrapper ${flyState === "flying" ? "witch-wrapper--flying" : "witch-wrapper--paused"}`}
            style={{ "--flight-duration": durationSec } as React.CSSProperties}
          >
            <CharacterImage
              characterType={gameCase.characterType}
              className={`witch-img ${flyState === "exploding" ? "witch-img--exploding" : ""}`}
            />
          </div>

          {/* Timer bar */}
          <div className="case-screen__timer-bar">
            <div
              className="case-screen__timer-fill"
              style={{ animationDuration: durationSec }}
            />
          </div>
        </div>

        {/* ── SIGNALS ────────────────────────────── */}
        <ul className="case-screen__signals">
          {gameCase.signals.map((signal, i) => (
            <li key={i} className="case-screen__signal">
              <span className="case-screen__signal-dash">—</span>
              {signal}
            </li>
          ))}
        </ul>

        {/* ── ACTIONS ────────────────────────────── */}
        <div className="case-screen__actions">
          {gameCase.availableActions.map((action) => (
            <button
              key={action}
              className={`btn btn--action btn--action-${action}`}
              onClick={() => handleAction(action)}
              disabled={resolved}
            >
              {ACTION_LABELS[action]}
            </button>
          ))}
        </div>
      </div>
    </BackgroundScreen>
  );
}
