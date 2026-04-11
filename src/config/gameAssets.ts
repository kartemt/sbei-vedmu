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
    messengerWitch: "./assets/characters/witch_messenger.png",
    researcherWitch: "./assets/characters/witch_researcher.png",
    mirageWitch: "./assets/characters/witch_mirage.png",
    goldenMirageBoss: "./assets/characters/boss_golden_mirage.png",
    dealAnchor: "./assets/characters/deal_anchor.png",
    dealRoute: "./assets/characters/deal_route.png",
    dealMandate: "./assets/characters/deal_mandate.png",
  },
  artifacts: {
    ownerLens: "./assets/artifacts/artifact_owner_lens.png",
    nextStepCompass: "./assets/artifacts/artifact_next_step_compass.png",
    buyingProcessSeal: "./assets/artifacts/artifact_buying_process_seal.png",
    budgetHook: "./assets/artifacts/artifact_budget_hook.png",
  },
  backgrounds: {
    start: "./assets/backgrounds/bg_start_screen.png",
    roundIntro: "./assets/backgrounds/bg_round_intro.png",
    caseScreen: "./assets/backgrounds/bg_case_screen.png",
    feedback: "./assets/backgrounds/bg_feedback_screen.png",
    final: "./assets/backgrounds/bg_final_screen.png",
  },
};
