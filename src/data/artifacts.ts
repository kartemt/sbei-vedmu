import type { ArtifactData } from "../types";

export const artifacts: ArtifactData[] = [
  {
    id: "owner_lens",
    name: "Линза Owner'а",
    description:
      "Помогает видеть, есть ли внутри клиента реальный владелец инициативы. Тёплый контакт — не owner. Тёплый разговор — не сделка.",
    imageKey: "ownerLens",
  },
  {
    id: "next_step_compass",
    name: "Компас Следующего Шага",
    description:
      "Фиксирует идею встречного обязательства клиента. Если клиент не берёт следующий шаг — движения нет.",
    imageKey: "nextStepCompass",
  },
  {
    id: "buying_process_seal",
    name: "Печать Процесса Покупки",
    description:
      "Учит отличать активность от структуры покупки. Встречи и пилоты — не процесс. Процесс — это путь к оплате.",
    imageKey: "buyingProcessSeal",
  },
  {
    id: "budget_hook",
    name: "Крюк Бюджета",
    description:
      "Закрепляет главный урок: без пути к деньгам сделка может быть пустой. Торг — не бюджет. Интерес — не мандат.",
    imageKey: "budgetHook",
  },
];

export const artifactById: Record<string, ArtifactData> = Object.fromEntries(
  artifacts.map((a) => [a.id, a])
);
