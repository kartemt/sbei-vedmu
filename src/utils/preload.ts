/**
 * Programmatic image preloading.
 *
 * Strategy:
 * - Critical (start screen bg) → preloaded via <link rel="preload"> in index.html
 * - Round 1 assets → preloaded immediately when game starts (START_GAME action)
 * - Round N assets → preloaded when round N-1 artifact screen appears
 *
 * Using new Image() + src assignment: the browser adds to disk cache, so by
 * the time the real <img> element needs the URL it's already available locally.
 */
import { gameAssets } from "../config/gameAssets";

function preloadUrl(url: string): void {
  const img = new Image();
  img.src = url;
}

function preloadAll(urls: string[]): void {
  urls.forEach(preloadUrl);
}

// Called right after START_GAME — loads everything needed for round 1 gameplay
export function preloadRound1(): void {
  preloadAll([
    gameAssets.backgrounds.caseScreen,
    gameAssets.backgrounds.feedback,
    gameAssets.characters.messengerWitch,
    gameAssets.characters.researcherWitch,
    gameAssets.characters.mirageWitch,
    gameAssets.characters.dealAnchor,
    gameAssets.characters.dealRoute,
    gameAssets.characters.dealMandate,
    gameAssets.characters.goldenMirageBoss,
    gameAssets.artifacts.ownerLens,   // round 1 artifact
  ]);
}

// Called when round 1 artifact screen shows — loads round 2+ assets
export function preloadRemaining(): void {
  preloadAll([
    gameAssets.backgrounds.roundIntro,
    gameAssets.backgrounds.final,
    gameAssets.artifacts.nextStepCompass,
    gameAssets.artifacts.buyingProcessSeal,
    gameAssets.artifacts.budgetHook,
  ]);
}
