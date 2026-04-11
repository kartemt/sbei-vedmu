import type { CharacterData, CharacterType } from "../types";

export const characters: CharacterData[] = [
  {
    type: "messenger_witch",
    name: "Ведьма-посланница",
    archetype: "champion без денег / тёплый контакт без полномочий",
    imageKey: "messengerWitch",
  },
  {
    type: "researcher_witch",
    name: "Ведьма-исследовательница",
    archetype: "сборщик информации",
    imageKey: "researcherWitch",
  },
  {
    type: "mirage_witch",
    name: "Ведьма-мираж",
    archetype: "no decision / почти-сделка без структуры покупки",
    imageKey: "mirageWitch",
  },
  {
    type: "golden_mirage_boss",
    name: "Золотой мираж",
    archetype: "идеальная ложная сделка",
    imageKey: "goldenMirageBoss",
  },
  {
    type: "deal_anchor",
    name: "Сделка-опора",
    archetype: "живая сделка с болью и owner'ом",
    imageKey: "dealAnchor",
  },
  {
    type: "deal_route",
    name: "Сделка-маршрут",
    archetype: "живая сделка с оформленным process",
    imageKey: "dealRoute",
  },
  {
    type: "deal_mandate",
    name: "Сделка-мандат",
    archetype: "живая сделка с бюджетом и authority",
    imageKey: "dealMandate",
  },
];

export const characterByType: Record<CharacterType, CharacterData> =
  Object.fromEntries(characters.map((c) => [c.type, c])) as Record<
    CharacterType,
    CharacterData
  >;
