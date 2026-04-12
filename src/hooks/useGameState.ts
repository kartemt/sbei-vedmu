import { useReducer } from "react";
import type {
  ActionType,
  CaseResult,
  GameState,
  OutcomeVariant,
} from "../types";
import { cases } from "../data/cases";
import { rounds } from "../data/rounds";
import { computeResults } from "../utils/results";

type GameAction =
  | { type: "START_GAME" }
  | { type: "PLAYER_ACTION"; action: ActionType; wasTimeout?: boolean }
  | { type: "PROBE_SELECTED"; probeId: string; isCorrect: boolean }
  | { type: "OUTCOME_DONE" }
  | { type: "ARTIFACT_SEEN" }
  | { type: "CONTACT_SUBMITTED" };

function getInitialState(): GameState {
  return {
    screen: "start",
    currentCaseIndex: 0,
    selectedAction: null,
    selectedProbeId: null,
    probeWasCorrect: null,
    outcomeVariant: null,
    caseResults: [],
    earnedArtifactIds: [],
    pendingArtifactId: null,
    justFinishedRound: null,
  };
}

function deriveOutcome(
  action: ActionType,
  _correctAction: ActionType,
  isWitch: boolean,
  wasTimeout: boolean,
  probeCorrect?: boolean
): OutcomeVariant {
  if (action === "probe") {
    return probeCorrect ? "correct_probe" : "wrong_probe";
  }
  if (wasTimeout) {
    return isWitch ? "timeout_witch" : "timeout_deal";
  }
  if (action === "hit") {
    return isWitch ? "correct_hit" : "wrong_hit";
  }
  // action === "pass"
  return !isWitch ? "correct_pass" : "wrong_pass";
}

const WITCH_TYPES = new Set([
  "messenger_witch",
  "researcher_witch",
  "mirage_witch",
  "golden_mirage_boss",
]);

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return { ...getInitialState(), screen: "case" };

    case "PLAYER_ACTION": {
      const currentCase = cases[state.currentCaseIndex];
      if (!currentCase) return state;

      // If probe with options → go to probe screen first
      if (
        action.action === "probe" &&
        !action.wasTimeout &&
        currentCase.probeOptions?.length
      ) {
        return { ...state, selectedAction: "probe", screen: "probe" };
      }

      const isWitch = WITCH_TYPES.has(currentCase.characterType);
      const playerAction = action.wasTimeout ? "pass" : action.action;
      const isCorrect = playerAction === currentCase.correctAction;

      const outcomeVariant = deriveOutcome(
        playerAction,
        currentCase.correctAction,
        isWitch,
        action.wasTimeout ?? false
      );

      const result: CaseResult = {
        caseId: currentCase.id,
        round: currentCase.round,
        characterType: currentCase.characterType,
        correctAction: currentCase.correctAction,
        playerAction,
        isCorrect,
        errorPatternKey: isCorrect ? "" : currentCase.errorPatternKey,
        pipelineDaysSaved: isCorrect ? currentCase.pipelineDaysSaved : undefined,
        pipelineDaysLost: !isCorrect ? currentCase.pipelineDaysSaved : undefined,
      };

      return {
        ...state,
        selectedAction: playerAction,
        outcomeVariant,
        screen: "outcome",
        caseResults: [...state.caseResults, result],
      };
    }

    case "PROBE_SELECTED": {
      const currentCase = cases[state.currentCaseIndex];
      if (!currentCase) return state;

      const isCorrect = action.isCorrect;
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
        selectedAction: "probe",
        outcomeVariant: isCorrect ? "correct_probe" : "wrong_probe",
        screen: "outcome",
        caseResults: [...state.caseResults, result],
      };
    }

    case "OUTCOME_DONE": {
      const currentCase = cases[state.currentCaseIndex];
      const nextIndex = state.currentCaseIndex + 1;
      const nextCase = cases[nextIndex];

      if (!nextCase) {
        // Final round done — show its artifact then final screen
        const finishedRoundData = rounds.find((r) => r.round === currentCase?.round);
        const artifactId = finishedRoundData?.artifactId ?? null;
        if (artifactId) {
          return {
            ...state,
            currentCaseIndex: cases.length, // out-of-bounds → ARTIFACT_SEEN → final
            selectedAction: null,
            selectedProbeId: null,
            probeWasCorrect: null,
            outcomeVariant: null,
            earnedArtifactIds: [...state.earnedArtifactIds, artifactId],
            pendingArtifactId: artifactId,
            justFinishedRound: currentCase?.round ?? null,
            screen: "artifact",
          };
        }
        return { ...state, screen: "final", selectedAction: null, outcomeVariant: null };
      }

      const justFinishedRound = currentCase?.round ?? null;
      const startingNewRound = nextCase.round !== currentCase?.round;

      if (startingNewRound) {
        const finishedRoundData = rounds.find((r) => r.round === justFinishedRound);
        const artifactId = finishedRoundData?.artifactId ?? null;
        return {
          ...state,
          currentCaseIndex: nextIndex,
          selectedAction: null,
          selectedProbeId: null,
          probeWasCorrect: null,
          outcomeVariant: null,
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
        outcomeVariant: null,
        screen: "case",
      };
    }

    case "ARTIFACT_SEEN": {
      const currentCase = cases[state.currentCaseIndex];
      if (!currentCase) {
        // Out of cases → go to final
        return { ...state, pendingArtifactId: null, screen: "final" };
      }

      // After round 2 artifact → contact gate before round 3
      if (state.justFinishedRound === 2) {
        return { ...state, pendingArtifactId: null, screen: "contact_gate" };
      }

      return { ...state, pendingArtifactId: null, screen: "case" };
    }

    case "CONTACT_SUBMITTED":
      return { ...state, screen: "case" };

    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(reducer, getInitialState());

  const currentCase = cases[state.currentCaseIndex] ?? null;
  const currentRound = currentCase?.round ?? 1;
  const currentRoundData =
    rounds.find((r) => r.round === currentRound) ?? rounds[0];

  const isFirstCaseOfRound =
    state.currentCaseIndex === 0 ||
    cases[state.currentCaseIndex - 1]?.round !== currentCase?.round;

  const gameResults =
    state.screen === "final" ? computeResults(state.caseResults) : null;

  return {
    state,
    currentCase,
    currentRoundData,
    isFirstCaseOfRound,
    gameResults,
    dispatch,
  };
}
