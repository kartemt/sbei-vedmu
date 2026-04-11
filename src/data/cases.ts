import type { GameCase } from "../types";

export const cases: GameCase[] = [
  // ─── РАУНД 1 — только очевидные ведьмы ────────────────────────────────────
  {
    id: "R1-1",
    round: 1,
    characterType: "messenger_witch",
    characterName: "Ведьма-посланница",
    signals: [
      "Контакт отвечает за исследование рынка",
      "Бюджет на проект не подтверждён",
    ],
    availableActions: ["hit", "pass"],
    correctAction: "hit",
    tags: ["no_budget", "no_authority"],
    errorPatternKey: "warm_contact_vs_authority",
    pipelineDaysSaved: 14,
    feedbackCorrect: {
      verdictTitle: "Правильно — это была ведьма",
      shortExplanation:
        "Вовлечённый контакт не контролирует деньги. Тёплый контакт — не authority.",
      errorPattern: "тёплый контакт вместо authority",
      pipelineImpact: "Спасено 14 дней pipeline",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили ведьму",
      shortExplanation:
        "Это была ложная сделка. Контакт был тёплым, но не контролировал деньги и решение. Интерес со стороны роли ещё не означает готовность компании купить.",
      errorPattern: "тёплый контакт вместо authority",
      pipelineImpact: "Потеряно 14 дней pipeline",
    },
  },
  {
    id: "R1-2",
    round: 1,
    characterType: "researcher_witch",
    characterName: "Ведьма-исследовательница",
    signals: [
      "Просит демо и 3 кейса",
      "Не готов описать, как сейчас решают проблему",
    ],
    availableActions: ["hit", "pass"],
    correctAction: "hit",
    tags: ["no_intent", "info_gathering"],
    errorPatternKey: "engagement_vs_intent",
    pipelineDaysSaved: 10,
    feedbackCorrect: {
      verdictTitle: "Правильно — это была ведьма",
      shortExplanation:
        "Клиент собирал информацию, а не проходил процесс покупки.",
      errorPattern: "вовлечённость вместо намерения",
      pipelineImpact: "Спасено 10 дней pipeline",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили ведьму",
      shortExplanation:
        "Это была ложная сделка. Клиент собирал информацию, а не проходил процесс покупки. Вы приняли вопросы и вовлечённость за коммерческое намерение.",
      errorPattern: "вовлечённость вместо намерения",
      pipelineImpact: "Потеряно 10 дней pipeline",
    },
  },
  {
    id: "R1-3",
    round: 1,
    characterType: "mirage_witch",
    characterName: "Ведьма-мираж",
    signals: ["Было уже 4 встречи", "Следующий шаг не зафиксирован"],
    availableActions: ["hit", "pass"],
    correctAction: "hit",
    tags: ["no_next_step", "activity_illusion"],
    errorPatternKey: "activity_vs_progress",
    pipelineDaysSaved: 21,
    feedbackCorrect: {
      verdictTitle: "Правильно — это была ведьма",
      shortExplanation: "Встречи были, движения не было. Активность — не прогресс покупки.",
      errorPattern: "активность вместо прогресса",
      pipelineImpact: "Спасено 21 день pipeline",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили ведьму",
      shortExplanation:
        "Это была ложная сделка. Встречи были, движения не было. Количество касаний не создаёт сделку.",
      errorPattern: "активность вместо прогресса",
      pipelineImpact: "Потеряно 21 день pipeline",
    },
  },
  {
    id: "R1-4",
    round: 1,
    characterType: "messenger_witch",
    characterName: "Ведьма-посланница",
    signals: [
      "«Нам это очень интересно»",
      "Доступа к утверждающему лицу нет",
    ],
    availableActions: ["hit", "pass"],
    correctAction: "hit",
    tags: ["no_authority", "interest_only"],
    errorPatternKey: "interest_vs_owner",
    pipelineDaysSaved: 14,
    feedbackCorrect: {
      verdictTitle: "Правильно — это была ведьма",
      shortExplanation:
        "Интерес без доступа к решению не превращает контакт в opportunity.",
      errorPattern: "интерес вместо owner'а",
      pipelineImpact: "Спасено 14 дней pipeline",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили ведьму",
      shortExplanation:
        "Это была ложная сделка. Интерес без доступа к решению не превращает контакт в opportunity. Интерес вместо структуры покупки.",
      errorPattern: "интерес вместо owner'а",
      pipelineImpact: "Потеряно 14 дней pipeline",
    },
  },
  {
    id: "R1-5",
    round: 1,
    characterType: "researcher_witch",
    characterName: "Ведьма-исследовательница",
    signals: [
      "Просит коммерческое предложение",
      "Не готов брать встречное обязательство по сроку встречи",
    ],
    availableActions: ["hit", "pass"],
    correctAction: "hit",
    tags: ["no_commitment", "document_request"],
    errorPatternKey: "document_vs_commitment",
    pipelineDaysSaved: 12,
    feedbackCorrect: {
      verdictTitle: "Правильно — это была ведьма",
      shortExplanation:
        "Коммерческое предложение без встречного шага — это не прогресс покупки.",
      errorPattern: "документ вместо обязательства",
      pipelineImpact: "Спасено 12 дней pipeline",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили ведьму",
      shortExplanation:
        "Это была ложная сделка. Запрос КП — не встречное обязательство. Документ вместо обязательства.",
      errorPattern: "документ вместо обязательства",
      pipelineImpact: "Потеряно 12 дней pipeline",
    },
  },

  // ─── РАУНД 2 — смешанные сигналы ───────────────────────────────────────────
  {
    id: "R2-1",
    round: 2,
    characterType: "messenger_witch",
    characterName: "Ведьма-посланница",
    signals: [
      "Контакт активно вовлечён",
      "Говорит, что решение принимает директор",
      "На встречу с директором пока не выводит",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "probe",
    strongQuestion:
      "Кто внутри компании может провести решение до утверждения и когда мы можем подключить этого человека?",
    tags: ["no_authority_access", "champion_only"],
    errorPatternKey: "warm_contact_vs_authority",
    feedbackCorrect: {
      verdictTitle: "Правильно — вопрос вскрывает ситуацию",
      shortExplanation:
        "Сигналов интереса недостаточно. Нужно вскрыть доступ к authority и внутреннего owner'а.",
      errorPattern: "преждевременная квалификация",
      pipelineImpact: "Можно спасти 2–4 недели pipeline",
    },
    feedbackWrongHit: {
      verdictTitle: "Неверно — вы срубили слишком рано",
      shortExplanation:
        "Сигналов для отказа недостаточно. Здесь нужно было задать квалифицирующий вопрос, чтобы понять, есть ли доступ к authority.",
      errorPattern: "срезание без квалификации",
      pipelineImpact: "Вы могли сохранить реальную opportunity",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили без проверки",
      shortExplanation:
        "Это не живая сделка по умолчанию. Нет доступа к authority — нужно было задать квалифицирующий вопрос.",
      errorPattern: "тёплый контакт вместо authority",
      pipelineImpact: "Потеряны недели без результата",
    },
  },
  {
    id: "R2-2",
    round: 2,
    characterType: "deal_anchor",
    characterName: "Сделка-опора",
    signals: [
      "Клиент подтвердил последствия бездействия",
      "Есть человек, который ведёт проект внутри",
      "Назначен следующий шаг на следующую неделю",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "pass",
    tags: ["confirmed_pain", "has_owner", "next_step"],
    errorPatternKey: "none",
    pipelineDaysSaved: 0,
    feedbackCorrect: {
      verdictTitle: "Правильно — это живая сделка",
      shortExplanation:
        "Есть боль, owner и движение. Это реальная opportunity, которую стоит вести.",
      errorPattern: "",
      pipelineImpact: "Сохранена живая opportunity",
    },
    feedbackWrongHit: {
      verdictTitle: "Неверно — вы срубили живую сделку",
      shortExplanation:
        "Это была живая сделка. Здесь были боль, owner и зафиксированный следующий шаг. Вы отсекли сделку, в которой уже была внутренняя опора.",
      errorPattern: "недоверие к ранней живой сделке",
      pipelineImpact: "Потеряна реальная opportunity",
    },
    feedbackWrongProbe: {
      verdictTitle: "Почти — но вопрос здесь лишний",
      shortExplanation:
        "Сигналы уже дают достаточно информации. Боль подтверждена, owner есть, следующий шаг зафиксирован. Лишний вопрос замедляет живую сделку.",
      errorPattern: "избыточная квалификация живой сделки",
      pipelineImpact: "Сделка сохранена, но с потерей темпа",
    },
  },
  {
    id: "R2-3",
    round: 2,
    characterType: "researcher_witch",
    characterName: "Ведьма-исследовательница",
    signals: [
      "Просит показать демо",
      "Избегает ответа, как сейчас принимаются такие решения",
      "Не может назвать срок следующего шага",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "hit",
    tags: ["no_process", "no_next_step", "demo_request"],
    errorPatternKey: "engagement_vs_intent",
    pipelineDaysSaved: 14,
    feedbackCorrect: {
      verdictTitle: "Правильно — это была ведьма",
      shortExplanation:
        "Контур покупки отсутствует уже на базовом уровне. Демо — не сделка.",
      errorPattern: "демо вместо квалификации",
      pipelineImpact: "Спасено 14 дней pipeline",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили ведьму",
      shortExplanation:
        "Это ложная сделка. Контур покупки отсутствует. Избегание вопросов о процессе — красный флаг.",
      errorPattern: "демо вместо квалификации",
      pipelineImpact: "Потеряно 14 дней pipeline",
    },
    feedbackWrongProbe: {
      verdictTitle: "Неверно — здесь уже всё ясно",
      shortExplanation:
        "Вопрос не поможет. Клиент уже избегает ответов на базовую квалификацию. Это ведьма.",
      errorPattern: "демо вместо квалификации",
      pipelineImpact: "Потеряно 14 дней pipeline",
    },
  },
  {
    id: "R2-4",
    round: 2,
    characterType: "deal_route",
    characterName: "Сделка-маршрут",
    signals: [
      "Клиент назвал обязательные этапы закупки",
      "Есть контрольная дата внутреннего комитета",
      "Готов прислать состав участников следующей встречи",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "pass",
    tags: ["defined_process", "committee_date", "next_step"],
    errorPatternKey: "none",
    feedbackCorrect: {
      verdictTitle: "Правильно — это живая сделка",
      shortExplanation:
        "Процесс покупки не быстрый, но оформленный. Есть путь к решению.",
      errorPattern: "",
      pipelineImpact: "Сохранён шанс на предсказуемую сделку",
    },
    feedbackWrongHit: {
      verdictTitle: "Неверно — вы срубили живую сделку",
      shortExplanation:
        "Это живая сделка. Клиент показал не только интерес, но и реальный путь принятия решения. Сложный, но оформленный процесс — не пустая бюрократия.",
      errorPattern: "сложность принята за пустоту",
      pipelineImpact: "Потеряна предсказуемая opportunity",
    },
    feedbackWrongProbe: {
      verdictTitle: "Почти — сигналы уже достаточны",
      shortExplanation:
        "Клиент уже показал процесс, дату и готовность к следующему шагу. Дополнительный вопрос замедляет темп.",
      errorPattern: "избыточная квалификация",
      pipelineImpact: "Сделка сохранена, но с потерей темпа",
    },
  },
  {
    id: "R2-5",
    round: 2,
    characterType: "mirage_witch",
    characterName: "Ведьма-мираж",
    signals: [
      "Команда клиента активна в переписке",
      "Обсуждают пилот",
      "Кто утвердит покупку после пилота, неясно",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "probe",
    strongQuestion:
      "Если пилот подтвердит ценность, кто и по какому механизму примет решение о закупке?",
    tags: ["no_buyer", "pilot_only", "activity"],
    errorPatternKey: "pilot_vs_purchase_mechanism",
    feedbackCorrect: {
      verdictTitle: "Правильно — вопрос вскрывает пустоту",
      shortExplanation:
        "Пока это не живое движение, а красивый риск. Вопрос покажет, есть ли механизм покупки.",
      errorPattern: "пилот принят за доказательство сделки",
      pipelineImpact: "Можно спасти до 1 месяца pipeline",
    },
    feedbackWrongHit: {
      verdictTitle: "Поторопились — здесь можно было проверить",
      shortExplanation:
        "Есть шанс вскрыть ситуацию вопросом. Возможно, механизм покупки есть — просто не обозначен.",
      errorPattern: "срезание без проверки",
      pipelineImpact: "Возможно потеряна живая сделка",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили без проверки",
      shortExplanation:
        "Активность и пилот — не покупка. Нужно было задать вопрос о механизме решения.",
      errorPattern: "пилот принят за доказательство сделки",
      pipelineImpact: "Мираж остался в pipeline",
    },
  },
  {
    id: "R2-6",
    round: 2,
    characterType: "deal_mandate",
    characterName: "Сделка-мандат",
    signals: [
      "Клиент знает, из какого бюджета может оплатить решение",
      "Известен человек, утверждающий расход",
      "Контакт готов организовать совместную встречу",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "pass",
    tags: ["has_budget", "has_authority", "next_step"],
    errorPatternKey: "none",
    feedbackCorrect: {
      verdictTitle: "Правильно — это живая сделка",
      shortExplanation: "Есть путь к деньгам и authority. Это зрелый шанс.",
      errorPattern: "",
      pipelineImpact: "Сохранена зрелая opportunity",
    },
    feedbackWrongHit: {
      verdictTitle: "Неверно — вы срубили живую сделку",
      shortExplanation:
        "Это живая сделка. Внутри сделки уже был путь к бюджету и authority. Осторожная квалифицированная сделка — не ведьма.",
      errorPattern: "осторожная сделка принята за слабую",
      pipelineImpact: "Упущен зрелый шанс",
    },
    feedbackWrongProbe: {
      verdictTitle: "Почти — но вопрос здесь лишний",
      shortExplanation:
        "Путь к деньгам уже показан. Лишний вопрос замедляет закрытие.",
      errorPattern: "избыточная квалификация",
      pipelineImpact: "Сделка сохранена, но с потерей темпа",
    },
  },

  // ─── РАУНД 3 — дорогие ложноположительные ──────────────────────────────────
  {
    id: "R3-1",
    round: 3,
    characterType: "mirage_witch",
    characterName: "Ведьма-мираж",
    signals: [
      "Обсуждают пилот на 2 месяца",
      "Клиент просит скидку",
      "После пилота решение «будут смотреть внутри»",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "hit",
    tags: ["pilot_illusion", "bargaining", "no_mechanism"],
    errorPatternKey: "pilot_vs_purchase_mechanism",
    pipelineDaysSaved: 45,
    feedbackCorrect: {
      verdictTitle: "Правильно — это была ведьма",
      shortExplanation:
        "Торг и пилот не заменяют механизма покупки. Внешний прогресс — не структура.",
      errorPattern: "внешний прогресс вместо структуры",
      pipelineImpact: "Спасено 45 дней pipeline",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили ведьму",
      shortExplanation:
        "Это ложная сделка. Торг и пилот — не механизм покупки. Вы переоценили внешний прогресс.",
      errorPattern: "внешний прогресс вместо структуры",
      pipelineImpact: "Потеряно 45 дней pipeline",
    },
    feedbackWrongProbe: {
      verdictTitle: "Неверно — здесь уже всё ясно",
      shortExplanation:
        "Механизм покупки после пилота неизвестен — это уже приговор. Вопрос не спасёт эту ведьму.",
      errorPattern: "внешний прогресс вместо структуры",
      pipelineImpact: "Потеряно 45 дней pipeline",
    },
  },
  {
    id: "R3-2",
    round: 3,
    characterType: "deal_route",
    characterName: "Сделка-маршрут",
    signals: [
      "Пилот нужен как обязательный этап закупки",
      "Известно, кто оценивает пилот и кто утверждает закупку",
      "Есть дата решения после пилота",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "pass",
    tags: ["structured_pilot", "known_decision_maker", "deadline"],
    errorPatternKey: "none",
    feedbackCorrect: {
      verdictTitle: "Правильно — это живая сделка",
      shortExplanation:
        "Пилот встроен в процесс покупки, а не заменяет его. Это оформленный путь к решению.",
      errorPattern: "",
      pipelineImpact: "Сохранена зрелая opportunity",
    },
    feedbackWrongHit: {
      verdictTitle: "Неверно — вы срубили живую сделку",
      shortExplanation:
        "Это живая сделка. Пилот встроен в процесс покупки. Вы автоматически признали пилот ведьмой.",
      errorPattern: "пилот автоматически признан ведьмой",
      pipelineImpact: "Потеряна зрелая opportunity",
    },
    feedbackWrongProbe: {
      verdictTitle: "Почти — сигналов уже достаточно",
      shortExplanation:
        "Оценщик и дата решения уже известны. Лишний вопрос создаёт трение в хорошей сделке.",
      errorPattern: "избыточная квалификация",
      pipelineImpact: "Сделка сохранена, темп снижен",
    },
  },
  {
    id: "R3-3",
    round: 3,
    characterType: "messenger_witch",
    characterName: "Ведьма-посланница",
    signals: [
      "Контакт очень активен и сам продаёт идею внутри",
      "Говорит, что бюджет «должны найти»",
      "Встречу с authority откладывает третий раз",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "hit",
    tags: ["no_budget", "no_authority_access", "champion_without_mandate"],
    errorPatternKey: "warm_contact_vs_authority",
    pipelineDaysSaved: 30,
    feedbackCorrect: {
      verdictTitle: "Правильно — это была ведьма",
      shortExplanation:
        "Энтузиазм чемпиона без денег и доступа не удерживает сделку. Бюджет «должны найти» — не бюджет.",
      errorPattern: "вера во внутреннего адвоката без мандата",
      pipelineImpact: "Спасено 30 дней pipeline",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили ведьму",
      shortExplanation:
        "Это ложная сделка. Энтузиазм чемпиона без денег и доступа к authority не удерживает сделку.",
      errorPattern: "вера во внутреннего адвоката без мандата",
      pipelineImpact: "Потеряно 30 дней pipeline",
    },
    feedbackWrongProbe: {
      verdictTitle: "Неверно — здесь вопрос не поможет",
      shortExplanation:
        "Встречу с authority откладывают третий раз. Вопросы не откроют закрытую дверь.",
      errorPattern: "вера во внутреннего адвоката без мандата",
      pipelineImpact: "Потеряно 30 дней pipeline",
    },
  },
  {
    id: "R3-4",
    round: 3,
    characterType: "deal_anchor",
    characterName: "Сделка-опора",
    signals: [
      "Команда клиента активно сравнивает варианты",
      "Owner подтвердил, что без решения цель квартала сорвётся",
      "Следующий шаг закреплён за обеими сторонами",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "pass",
    tags: ["confirmed_pain", "has_owner", "mutual_next_step"],
    errorPatternKey: "none",
    feedbackCorrect: {
      verdictTitle: "Правильно — это живая сделка",
      shortExplanation:
        "Есть реальная цена бездействия и понятное движение. Scrutiny — не ведьма.",
      errorPattern: "",
      pipelineImpact: "Сохранена реальная сделка с болью",
    },
    feedbackWrongHit: {
      verdictTitle: "Неверно — вы срубили живую сделку",
      shortExplanation:
        "Это живая сделка. Есть реальная цена бездействия и понятное движение. Здоровый scrutiny принят за шум.",
      errorPattern: "здоровый scrutiny принят за шум",
      pipelineImpact: "Потеряна реальная сделка с болью",
    },
    feedbackWrongProbe: {
      verdictTitle: "Почти — лишний вопрос тормозит",
      shortExplanation:
        "Owner уже подтвердил критичность. Следующий шаг зафиксирован. Вопрос создаёт ненужное трение.",
      errorPattern: "избыточная квалификация",
      pipelineImpact: "Сделка сохранена, темп снижен",
    },
  },
  {
    id: "R3-5",
    round: 3,
    characterType: "researcher_witch",
    characterName: "Ведьма-исследовательница",
    signals: [
      "Было 5 содержательных встреч",
      "Клиент просит дополнительные материалы для команды",
      "Не может сказать, кто владеет инициативой внутри",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "hit",
    tags: ["no_owner", "many_meetings", "material_request"],
    errorPatternKey: "activity_vs_progress",
    pipelineDaysSaved: 28,
    feedbackCorrect: {
      verdictTitle: "Правильно — это была ведьма",
      shortExplanation:
        "Количество касаний не создаёт owner'а. Объём коммуникации — не внутренняя опора.",
      errorPattern: "объём коммуникации вместо внутренней опоры",
      pipelineImpact: "Спасено 28 дней pipeline",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили ведьму",
      shortExplanation:
        "Это ложная сделка. 5 встреч не создают owner'а. Без внутреннего владельца инициативы сделки нет.",
      errorPattern: "объём коммуникации вместо внутренней опоры",
      pipelineImpact: "Потеряно 28 дней pipeline",
    },
    feedbackWrongProbe: {
      verdictTitle: "Неверно — вопрос не исправит ситуацию",
      shortExplanation:
        "5 встреч и клиент всё ещё не знает, кто владеет инициативой. Это уже приговор.",
      errorPattern: "объём коммуникации вместо внутренней опоры",
      pipelineImpact: "Потеряно 28 дней pipeline",
    },
  },
  {
    id: "R3-6",
    round: 3,
    characterType: "deal_mandate",
    characterName: "Сделка-мандат",
    signals: [
      "Идёт обсуждение условий оплаты",
      "Economic buyer уже подключён",
      "Клиент называет, что нужно для финального согласования",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "pass",
    tags: ["payment_terms", "economic_buyer", "final_steps"],
    errorPatternKey: "none",
    feedbackCorrect: {
      verdictTitle: "Правильно — это живая сделка",
      shortExplanation:
        "Торг идёт внутри реального контура утверждения. Economic buyer в процессе.",
      errorPattern: "",
      pipelineImpact: "Сохранена почти закрытая opportunity",
    },
    feedbackWrongHit: {
      verdictTitle: "Неверно — вы срубили живую сделку",
      shortExplanation:
        "Это живая сделка. Торг идёт внутри реального контура утверждения. Торг — не ведьма, если есть economic buyer.",
      errorPattern: "торг автоматически прочитан как мираж",
      pipelineImpact: "Упущена почти закрытая реальная сделка",
    },
    feedbackWrongProbe: {
      verdictTitle: "Почти — здесь уже всё ясно",
      shortExplanation:
        "Economic buyer подключён, условия оговариваются. Лишний вопрос создаёт трение на финальном этапе.",
      errorPattern: "избыточная квалификация",
      pipelineImpact: "Сделка сохранена, но темп снижен",
    },
  },

  // ─── РАУНД 4 — босс ─────────────────────────────────────────────────────────
  {
    id: "R4-1",
    round: 4,
    characterType: "golden_mirage_boss",
    characterName: "Золотой мираж",
    signals: [
      "2 месяца обсуждают пилот и коммерческие условия",
      "Клиент просит финальную скидку",
      "Решение зависит от внутреннего согласования, кто owner — неясно",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "probe",
    strongQuestion:
      "Если мы согласуем условия сегодня, кто внутри компании принимает окончательное решение, из какого бюджета и какой следующий формальный шаг ведёт к оплате?",
    probeOptions: [
      {
        id: "q1",
        label: "Как вам в целом пилот?",
        isCorrect: false,
      },
      {
        id: "q2",
        label:
          "Кто внутри компании принимает окончательное решение, из какого бюджета и какой формальный шаг ведёт к оплате?",
        isCorrect: true,
      },
      {
        id: "q3",
        label: "Нужна ли вам ещё одна презентация для команды?",
        isCorrect: false,
      },
    ],
    ifProbeLeadsToFinalHit: true,
    tags: ["boss", "no_mechanism", "all_illusions"],
    errorPatternKey: "pilot_vs_purchase_mechanism",
    feedbackCorrect: {
      verdictTitle: "Правильно — вопрос вскрыл золотой мираж",
      shortExplanation:
        "Это идеальная ложная сделка. Внешне всё выглядело как финальный этап, но внутри не было механизма покупки. Вопрос показал пустоту.",
      errorPattern: "поздний самообман на красивой активности",
      pipelineImpact: "Спасено 2–3 месяца pipeline",
    },
    feedbackWrongHit: {
      verdictTitle: "Интуиция верна, но метод важнее",
      shortExplanation:
        "Это действительно ведьма. Но правильный путь — сначала задать вопрос, который это доказывает. Слепое срезание не тренирует квалификацию.",
      errorPattern: "срезание без вскрытия",
      pipelineImpact: "Ведьма сбита, но навык не закреплён",
    },
    feedbackWrongPass: {
      verdictTitle: "Неверно — вы пропустили золотого миража",
      shortExplanation:
        "Это была идеальная ложная сделка. 2 месяца активности без механизма покупки. Вы влюбились в красивую картинку.",
      errorPattern: "поздний самообман на красивой активности",
      pipelineImpact: "Потеряно 2–3 месяца pipeline",
    },
  },
  {
    id: "R4-2",
    round: 4,
    characterType: "deal_mandate",
    characterName: "Сделка-мандат",
    signals: [
      "Пилот завершает обязательный этап внутренней оценки",
      "Economic buyer подключён на финальную встречу",
      "Клиент называет дату комитета и список документов на оплату",
    ],
    availableActions: ["hit", "pass", "probe"],
    correctAction: "pass",
    tags: ["structured_pilot", "economic_buyer", "payment_committee"],
    errorPatternKey: "none",
    feedbackCorrect: {
      verdictTitle: "Правильно — это живая сложная сделка",
      shortExplanation:
        "Она выглядит осторожной, но внутри есть путь к решению и деньгам. Осторожность — не ведьма.",
      errorPattern: "",
      pipelineImpact: "Сохранена зрелая opportunity",
    },
    feedbackWrongHit: {
      verdictTitle: "Неверно — вы срубили живую сложную сделку",
      shortExplanation:
        "Это живая сложная сделка. Она выглядела осторожной, но внутри был путь к решению и деньгам. Вы стали резать всё подряд.",
      errorPattern: "всё сложное признано ведьмой",
      pipelineImpact: "Потеряна реальная зрелая opportunity",
    },
    feedbackWrongProbe: {
      verdictTitle: "Почти — но сигналов уже достаточно",
      shortExplanation:
        "Дата комитета и список документов — это финальные сигналы. Лишний вопрос создаёт трение на закрытии.",
      errorPattern: "избыточная квалификация",
      pipelineImpact: "Сделка сохранена, темп снижен",
    },
  },
];

export const casesByRound = (round: 1 | 2 | 3 | 4): GameCase[] =>
  cases.filter((c) => c.round === round);
