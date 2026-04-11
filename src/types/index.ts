export type ActionType = "hit" | "pass" | "probe";

export type CharacterType =
  | "messenger_witch"
  | "researcher_witch"
  | "mirage_witch"
  | "golden_mirage_boss"
  | "deal_anchor"
  | "deal_route"
  | "deal_mandate";

export type CaseFeedback = {
  verdictTitle: string;
  shortExplanation: string;
  errorPattern: string;
  pipelineImpact: string;
};

export type ProbeOption = {
  id: string;
  label: string;
  isCorrect: boolean;
};

export type GameCase = {
  id: string;
  round: 1 | 2 | 3 | 4;
  characterType: CharacterType;
  characterName: string;
  signals: string[];
  availableActions: ActionType[];
  correctAction: ActionType;
  strongQuestion?: string;
  probeOptions?: ProbeOption[];
  ifProbeLeadsToFinalHit?: boolean;
  feedbackCorrect: CaseFeedback;
  feedbackWrongHit?: CaseFeedback;
  feedbackWrongPass?: CaseFeedback;
  feedbackWrongProbe?: CaseFeedback;
  tags: string[];
  errorPatternKey: string;
  pipelineDaysSaved?: number;
  pipelineDaysLost?: number;
};

export type RoundData = {
  round: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  introText: string;
  artifactId?: string;
};

export type ArtifactData = {
  id: string;
  name: string;
  description: string;
  imageKey: keyof import("../config/gameAssets").GameAssetsArtifacts;
};

export type CharacterData = {
  type: CharacterType;
  name: string;
  archetype: string;
  imageKey: keyof import("../config/gameAssets").GameAssetsCharacters;
};

export type CaseResult = {
  caseId: string;
  round: 1 | 2 | 3 | 4;
  characterType: CharacterType;
  correctAction: ActionType;
  playerAction: ActionType;
  probeCorrect?: boolean;
  isCorrect: boolean;
  errorPatternKey: string;
  pipelineDaysSaved?: number;
  pipelineDaysLost?: number;
};

export type GameResults = {
  totalCases: number;
  correctAnswers: number;
  witchesHitCorrectly: number;
  liveDealsSaved: number;
  probeDecisionsCorrect: number;
  pipelineDaysSaved: number;
  pipelineDaysLost: number;
  dominantErrorPattern?: string;
  mainBlindSpot?: string;
  mainRedFlag?: string;
};

export type Screen =
  | "start"
  | "round_intro"
  | "case"
  | "probe"
  | "feedback"
  | "artifact"
  | "final";

export type GameState = {
  screen: Screen;
  currentCaseIndex: number;
  selectedAction: ActionType | null;
  selectedProbeId: string | null;
  probeWasCorrect: boolean | null;
  caseResults: CaseResult[];
  earnedArtifactIds: string[];
  pendingArtifactId: string | null;
  justFinishedRound: number | null;
};
