import { useEffect } from "react";
import { useGameState } from "./hooks/useGameState";
import { StartScreen } from "./screens/StartScreen";
import { RoundIntroScreen } from "./screens/RoundIntroScreen";
import { CaseScreen } from "./screens/CaseScreen";
import { ProbeScreen } from "./screens/ProbeScreen";
import { FeedbackScreen } from "./screens/FeedbackScreen";
import { ArtifactScreen } from "./screens/ArtifactScreen";
import { FinalScreen } from "./screens/FinalScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { cases } from "./data/cases";
import { artifactById } from "./data/artifacts";
import { trackVisit, trackScreen3 } from "./utils/analytics";
import type { ProbeOption } from "./types";

const isDashboard = new URLSearchParams(window.location.search).has("dashboard");

export function App() {
  useEffect(() => { trackVisit(); }, []);

  if (isDashboard) return <DashboardScreen />;

  return <Game />;
}

function Game() {
  const { state, currentCase, currentRoundData, gameResults, dispatch } =
    useGameState();

  // Track reaching the case screen (Screen 3) once per session
  useEffect(() => {
    if (state.screen === "case") trackScreen3();
  }, [state.screen]);

  const caseNumber = state.currentCaseIndex + 1;
  const totalCases = cases.length;

  switch (state.screen) {
    case "start":
      return <StartScreen onStart={() => dispatch({ type: "START_GAME" })} />;

    case "round_intro":
      if (!currentRoundData) return null;
      return (
        <RoundIntroScreen
          roundData={currentRoundData}
          caseNumber={caseNumber}
          totalCases={totalCases}
          onContinue={() => dispatch({ type: "ROUND_INTRO_DONE" })}
        />
      );

    case "case":
      if (!currentCase) return null;
      return (
        <CaseScreen
          gameCase={currentCase}
          caseNumber={caseNumber}
          totalCases={totalCases}
          onAction={(action) => dispatch({ type: "PLAYER_ACTION", action })}
        />
      );

    case "probe":
      if (!currentCase) return null;
      return (
        <ProbeScreen
          gameCase={currentCase}
          onProbeSelected={(opt: ProbeOption) =>
            dispatch({ type: "PROBE_SELECTED", probeId: opt.id, isCorrect: opt.isCorrect })
          }
        />
      );

    case "feedback": {
      if (!currentCase || !state.selectedAction) return null;
      return (
        <FeedbackScreen
          gameCase={currentCase}
          playerAction={state.selectedAction}
          probeWasCorrect={state.probeWasCorrect}
          onNext={() => dispatch({ type: "NEXT_CASE" })}
        />
      );
    }

    case "artifact": {
      const artifact = state.pendingArtifactId ? artifactById[state.pendingArtifactId] : null;
      if (!artifact || !state.justFinishedRound) return null;
      const isFinalRound = state.justFinishedRound === 4;
      return (
        <ArtifactScreen
          artifact={artifact}
          roundNumber={state.justFinishedRound}
          isFinalRound={isFinalRound}
          onContinue={() => dispatch({ type: "ARTIFACT_SEEN" })}
        />
      );
    }

    case "final":
      if (!gameResults) return null;
      return (
        <FinalScreen
          results={gameResults}
          onRestart={() => dispatch({ type: "START_GAME" })}
        />
      );

    default:
      return null;
  }
}
