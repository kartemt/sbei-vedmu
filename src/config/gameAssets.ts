export type GameAssetsCharacters = {
  messengerWitch: string;
  researcherWitch: string;
  mirageWitch: string;
  goldenMirageBoss: string;
  dealAnchor: string;
  dealRoute: string;
  dealMandate: string;
};

export type GameAssetsArtifacts = {
  ownerLens: string;
  nextStepCompass: string;
  buyingProcessSeal: string;
  budgetHook: string;
};

export type GameAssetsBackgrounds = {
  start: string;
  roundIntro: string;
  caseScreen: string;
  feedback: string;
  final: string;
};

export type GameAssetsConfig = {
  characters: GameAssetsCharacters;
  artifacts: GameAssetsArtifacts;
  backgrounds: GameAssetsBackgrounds;
};

export const gameAssets: GameAssetsConfig = {
  characters: {
    messengerWitch: "./assets/characters/witch_messenger.webp",
    researcherWitch: "./assets/characters/witch_researcher.webp",
    mirageWitch: "./assets/characters/witch_mirage.webp",
    goldenMirageBoss: "./assets/characters/boss_golden_mirage.webp",
    dealAnchor: "./assets/characters/deal_anchor.webp",
    dealRoute: "./assets/characters/deal_route.webp",
    dealMandate: "./assets/characters/deal_mandate.webp",
  },
  artifacts: {
    ownerLens: "./assets/artifacts/artifact_owner_lens.webp",
    nextStepCompass: "./assets/artifacts/artifact_next_step_compass.webp",
    buyingProcessSeal: "./assets/artifacts/artifact_buying_process_seal.webp",
    budgetHook: "./assets/artifacts/artifact_budget_hook.webp",
  },
  backgrounds: {
    start: "./assets/backgrounds/bg_start_screen.webp",
    roundIntro: "./assets/backgrounds/bg_round_intro.webp",
    caseScreen: "./assets/backgrounds/bg_case_screen.webp",
    feedback: "./assets/backgrounds/bg_feedback_screen.webp",
    final: "./assets/backgrounds/bg_final_screen.webp",
  },
};
