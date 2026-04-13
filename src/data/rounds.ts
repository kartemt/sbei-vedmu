import type { RoundData } from "../types";

export const rounds: RoundData[] = [
  {
    round: 1,
    title: "Раунд 1",
    subtitle: "Есть ли путь к деньгам?",
    introText: "Смотрите только на два сигнала: есть ли путь к деньгам и есть ли следующий шаг.",
    flightDurationMs: 10500,
    artifactId: "owner_lens",
  },
  {
    round: 2,
    title: "Раунд 2",
    subtitle: "Один зелёный сигнал не спасает",
    introText: "Тёплый контакт без структуры покупки — не opportunity.",
    flightDurationMs: 9000,
    artifactId: "next_step_compass",
  },
  {
    round: 3,
    title: "Раунд 3",
    subtitle: "Смотрите не на активность, а на структуру покупки",
    introText: "Пилот, торг, встречи — это ещё не покупка.",
    flightDurationMs: 8250,
    artifactId: "buying_process_seal",
  },
  {
    round: 4,
    title: "Раунд 4",
    subtitle: "Есть ли реальный механизм покупки?",
    introText: "Финальный противник. Всё выглядит как почти-закрытая сделка.",
    flightDurationMs: 7500,
    artifactId: "budget_hook",
  },
];
