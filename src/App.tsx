import { useEffect } from "react";
import { useGameState } from "./hooks/useGameState";
import { StartScreen } from "./screens/StartScreen";
import { CaseScreen } from "./screens/CaseScreen";
import { ProbeScreen } from "./screens/ProbeScreen";
import { FeedbackScreen } from "./screens/FeedbackScreen";
import { ArtifactScreen } from "./screens/ArtifactScreen";
import { ContactGateScreen } from "./screens/ContactGateScreen";
import { FinalScreen } from "./screens/FinalScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
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
  const {
    state,
    currentCase,
    currentRoundData,
    isFirstCaseOfRound,
    gameResults,
    dispatch,
  } = useGameState();

  useEffect(() => {
    if (state.screen === "case") trackScreen3();
  }, [state.screen]);

  switch (state.screen) {
    case "start":
      return <StartScreen onStart={() => dispatch({ type: "START_GAME" })} />;

    case "case":
      if (!currentCase || !currentRoundData) return null;
      return (
        <CaseScreen
          gameCase={currentCase}
          roundData={currentRoundData}
          isFirstCaseOfRound={isFirstCaseOfRound}
          caseNumber={state.currentCaseIndex + 1}
          totalCases={9} // 3 rounds × 3 cases
          onAction={(action, wasTimeout) =>
            dispatch({ type: "PLAYER_ACTION", action, wasTimeout })
          }
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

    case "outcome":
      if (!currentCase || !state.outcomeVariant) return null;
      return (
        <FeedbackScreen
          gameCase={currentCase}
          variant={state.outcomeVariant}
          onNext={() => dispatch({ type: "OUTCOME_DONE" })}
        />
      );

    case "artifact": {
      const artifact = state.pendingArtifactId ? artifactById[state.pendingArtifactId] : null;
      if (!artifact || !state.justFinishedRound) return null;
      return (
        <ArtifactScreen
          artifact={artifact}
          roundNumber={state.justFinishedRound}
          isFinalRound={state.justFinishedRound === 3}
          onContinue={() => dispatch({ type: "ARTIFACT_SEEN" })}
        />
      );
    }

    case "contact_gate":
      return (
        <ContactGateScreen
          onContinue={() => dispatch({ type: "CONTACT_SUBMITTED" })}
        />
      );

    case "final":
      if (!gameResults) return null;
      return (
        <FinalScreen
          results={gameResults}
          caseResults={state.caseResults}
          onRestart={() => dispatch({ type: "START_GAME" })}
        />
      );

    default:
      return null;
  }
}
