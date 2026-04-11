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
    messengerWitch: "./src/assets/characters/witch_messenger.png",
    researcherWitch: "./src/assets/characters/witch_researcher.png",
    mirageWitch: "./src/assets/characters/witch_mirage.png",
    goldenMirageBoss: "./src/assets/characters/boss_golden_mirage.png",
    dealAnchor: "./src/assets/characters/deal_anchor.png",
    dealRoute: "./src/assets/characters/deal_route.png",
    dealMandate: "./src/assets/characters/deal_mandate.png",
  },
  artifacts: {
    ownerLens: "./src/assets/artifacts/artifact_owner_lens.png",
    nextStepCompass: "./src/assets/artifacts/artifact_next_step_compass.png",
    buyingProcessSeal: "./src/assets/artifacts/artifact_buying_process_seal.png",
    budgetHook: "./src/assets/artifacts/artifact_budget_hook.png",
  },
  backgrounds: {
    start: "./src/assets/backgrounds/bg_start_screen.png",
    roundIntro: "./src/assets/backgrounds/bg_round_intro.png",
    caseScreen: "./src/assets/backgrounds/bg_case_screen.png",
    feedback: "./src/assets/backgrounds/bg_feedback_screen.png",
    final: "./src/assets/backgrounds/bg_final_screen.png",
  },
};
