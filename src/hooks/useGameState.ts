import { useReducer } from "react";
import type { ActionType, CaseResult, GameState, Screen } from "../types";
import { cases } from "../data/cases";
import { rounds } from "../data/rounds";
import { computeResults } from "../utils/results";

type GameAction =
  | { type: "START_GAME" }
  | { type: "ROUND_INTRO_DONE" }
  | { type: "PLAYER_ACTION"; action: ActionType }
  | { type: "PROBE_SELECTED"; probeId: string; isCorrect: boolean }
  | { type: "NEXT_CASE" }
  | { type: "ARTIFACT_SEEN" };

function getInitialState(): GameState {
  return {
    screen: "start",
    currentCaseIndex: 0,
    selectedAction: null,
    selectedProbeId: null,
    probeWasCorrect: null,
    caseResults: [],
    earnedArtifactIds: [],
    pendingArtifactId: null,
    justFinishedRound: null,
  };
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return { ...getInitialState(), screen: "round_intro" };

    case "ROUND_INTRO_DONE":
      return { ...state, screen: "case" };

    case "PLAYER_ACTION": {
      const currentCase = cases[state.currentCaseIndex];
      if (!currentCase) return state;

      if (
        action.action === "probe" &&
        currentCase.probeOptions &&
        currentCase.probeOptions.length > 0
      ) {
        return {
          ...state,
          selectedAction: "probe",
          screen: "probe",
        };
      }

      const isCorrect = action.action === currentCase.correctAction;
      const result: CaseResult = {
        caseId: currentCase.id,
        round: currentCase.round,
        characterType: currentCase.characterType,
        correctAction: currentCase.correctAction,
        playerAction: action.action,
        isCorrect,
        errorPatternKey: isCorrect ? "" : currentCase.errorPatternKey,
        pipelineDaysSaved: isCorrect ? currentCase.pipelineDaysSaved : undefined,
        pipelineDaysLost: !isCorrect ? currentCase.pipelineDaysSaved : undefined,
      };

      return {
        ...state,
        selectedAction: action.action,
        screen: "feedback",
        caseResults: [...state.caseResults, result],
      };
    }

    case "PROBE_SELECTED": {
      const currentCase = cases[state.currentCaseIndex];
      if (!currentCase) return state;

      const isCorrect = action.isCorrect;
      const finalAction: ActionType =
        isCorrect && currentCase.ifProbeLeadsToFinalHit ? "hit" : "probe";
      const caseIsCorrect = currentCase.correctAction === "probe";

      const result: CaseResult = {
        caseId: currentCase.id,
        round: currentCase.round,
        characterType: currentCase.characterType,
        correctAction: currentCase.correctAction,
        playerAction: "probe",
        probeCorrect: isCorrect,
        isCorrect: caseIsCorrect,
        errorPatternKey: caseIsCorrect ? "" : currentCase.errorPatternKey,
        pipelineDaysSaved: caseIsCorrect ? currentCase.pipelineDaysSaved : undefined,
        pipelineDaysLost: !caseIsCorrect ? currentCase.pipelineDaysSaved : undefined,
      };

      return {
        ...state,
        selectedProbeId: action.probeId,
        probeWasCorrect: isCorrect,
        selectedAction: finalAction,
        screen: "feedback",
        caseResults: [...state.caseResults, result],
      };
    }

    case "NEXT_CASE": {
      const currentCase = cases[state.currentCaseIndex];
      const nextIndex = state.currentCaseIndex + 1;
      const nextCase = cases[nextIndex];

      if (!nextCase) {
        // Game over — but first show the final round's artifact if any
        const finishedRoundData = rounds.find((r) => r.round === currentCase?.round);
        const artifactId = finishedRoundData?.artifactId ?? null;
        if (artifactId) {
          return {
            ...state,
            selectedAction: null,
            selectedProbeId: null,
            probeWasCorrect: null,
            earnedArtifactIds: [...state.earnedArtifactIds, artifactId],
            pendingArtifactId: artifactId,
            justFinishedRound: (currentCase?.round ?? null) as number | null,
            screen: "artifact",
          };
        }
        return {
          ...state,
          screen: "final",
          selectedAction: null,
          selectedProbeId: null,
          probeWasCorrect: null,
        };
      }

      const justFinishedRound = currentCase?.round ?? null;
      const startingNewRound = nextCase.round !== currentCase?.round;

      if (startingNewRound) {
        const finishedRoundData = rounds.find(
          (r) => r.round === justFinishedRound
        );
        const artifactId = finishedRoundData?.artifactId ?? null;

        return {
          ...state,
          currentCaseIndex: nextIndex,
          selectedAction: null,
          selectedProbeId: null,
          probeWasCorrect: null,
          earnedArtifactIds: artifactId
            ? [...state.earnedArtifactIds, artifactId]
            : state.earnedArtifactIds,
          pendingArtifactId: artifactId,
          justFinishedRound: justFinishedRound as number,
          screen: "artifact",
        };
      }

      return {
        ...state,
        currentCaseIndex: nextIndex,
        selectedAction: null,
        selectedProbeId: null,
        probeWasCorrect: null,
        screen: "case",
      };
    }

    case "ARTIFACT_SEEN": {
      // If there are no more cases to play, go to final
      const currentCase = cases[state.currentCaseIndex];
      if (!currentCase) {
        return { ...state, pendingArtifactId: null, screen: "final" };
      }

      // currentCaseIndex already points to the first case of the next round
      const prevCase = cases[state.currentCaseIndex - 1];
      const isFirstCaseOfNewRound = prevCase?.round !== currentCase.round;

      return {
        ...state,
        pendingArtifactId: null,
        screen: isFirstCaseOfNewRound ? "round_intro" : "case",
      };
    }

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const currentCase = cases[state.currentCaseIndex] ?? null;
  const currentRound = currentCase?.round ?? 1;
  const currentRoundData = rounds.find((r) => r.round === currentRound) ?? rounds[0];
  const gameResults = state.screen === "final" ? computeResults(state.caseResults) : null;

  return {
    state,
    currentCase,
    currentRoundData,
    gameResults,
    dispatch,
  };
}
