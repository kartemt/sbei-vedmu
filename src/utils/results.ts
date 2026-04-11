import type { CaseResult, GameResults } from "../types";

const ERROR_PATTERN_LABELS: Record<string, string> = {
  warm_contact_vs_authority: "тёплый контакт вместо authority",
  activity_vs_progress: "активность вместо прогресса",
  pilot_vs_purchase_mechanism: "пилот вместо механизма покупки",
  document_vs_commitment: "документ вместо обязательства",
  complexity_vs_emptiness: "сложность вместо пустоты",
  engagement_vs_intent: "вопросы вместо намерения купить",
  interest_vs_owner: "интерес вместо owner'а",
};

const BLIND_SPOTS: Record<string, string> = {
  messenger_witch:
    "Вы переоцениваете тёплого чемпиона без authority и бюджета.",
  researcher_witch:
    "Вы принимаете вопросы, демо и интерес к материалам за намерение купить.",
  mirage_witch:
    "Вы путаете активность сделки с прогрессом покупки.",
  live_deals:
    "Вы начали защищать pipeline слишком грубо и режете сложные, но живые opportunity.",
};

const RED_FLAG_LABELS: Record<string, string> = {
  warm_contact_vs_authority: "тёплый контакт без authority",
  activity_vs_progress: "активность без owner'а",
  pilot_vs_purchase_mechanism: "пилот без механизма покупки",
  document_vs_commitment: "документ без встречного обязательства",
  complexity_vs_emptiness: "сложность вместо пустоты",
  engagement_vs_intent: "интерес без намерения купить",
  interest_vs_owner: "интерес без owner'а",
};

export function computeResults(caseResults: CaseResult[]): GameResults {
  const totalCases = caseResults.length;
  const correctAnswers = caseResults.filter((r) => r.isCorrect).length;

  const witchTypes = ["messenger_witch", "researcher_witch", "mirage_witch", "golden_mirage_boss"];
  const witchesHitCorrectly = caseResults.filter(
    (r) => witchTypes.includes(r.characterType) && r.isCorrect
  ).length;

  const liveTypes = ["deal_anchor", "deal_route", "deal_mandate"];
  const liveDealsSaved = caseResults.filter(
    (r) => liveTypes.includes(r.characterType) && r.isCorrect
  ).length;

  const probeDecisionsCorrect = caseResults.filter(
    (r) => r.correctAction === "probe" && r.isCorrect
  ).length;

  const pipelineDaysSaved = caseResults.reduce(
    (acc, r) => acc + (r.pipelineDaysSaved ?? 0),
    0
  );
  const pipelineDaysLost = caseResults.reduce(
    (acc, r) => acc + (r.pipelineDaysLost ?? 0),
    0
  );

  // Dominant error pattern
  const errorCounts: Record<string, number> = {};
  for (const r of caseResults) {
    if (!r.isCorrect && r.errorPatternKey) {
      errorCounts[r.errorPatternKey] = (errorCounts[r.errorPatternKey] ?? 0) + 1;
    }
  }
  const dominantErrorKey = Object.entries(errorCounts).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];

  // Blind spot: based on which character type causes most errors
  const characterErrorCounts: Record<string, number> = {};
  for (const r of caseResults) {
    if (!r.isCorrect) {
      characterErrorCounts[r.characterType] =
        (characterErrorCounts[r.characterType] ?? 0) + 1;
    }
  }
  const dominantErrorChar = Object.entries(characterErrorCounts).sort(
    ([, a], [, b]) => b - a
  )[0]?.[0];

  let mainBlindSpot: string | undefined;
  if (dominantErrorChar) {
    if (liveTypes.includes(dominantErrorChar)) {
      mainBlindSpot = BLIND_SPOTS["live_deals"];
    } else {
      mainBlindSpot = BLIND_SPOTS[dominantErrorChar];
    }
  }

  const dominantErrorPattern = dominantErrorKey
    ? ERROR_PATTERN_LABELS[dominantErrorKey]
    : undefined;

  const mainRedFlag = dominantErrorKey
    ? RED_FLAG_LABELS[dominantErrorKey]
    : undefined;

  return {
    totalCases,
    correctAnswers,
    witchesHitCorrectly,
    liveDealsSaved,
    probeDecisionsCorrect,
    pipelineDaysSaved,
    pipelineDaysLost,
    dominantErrorPattern,
    mainBlindSpot,
    mainRedFlag,
  };
}
