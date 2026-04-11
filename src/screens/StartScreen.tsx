import { BackgroundScreen } from "../components/BackgroundScreen";

type Props = {
  onStart: () => void;
};

export function StartScreen({ onStart }: Props) {
  return (
    <BackgroundScreen bgKey="start">
      <div className="start-screen">
        <div className="start-screen__badge">Тренажёр квалификации B2B-сделок</div>
        <h1 className="start-screen__title">Сбей ведьму</h1>
        <p className="start-screen__tagline">
          По небу летят сделки.
          <br />
          Некоторые из них — ведьмы.
        </p>
        <div className="start-screen__description">
          <p>
            Вы будете видеть сигналы из реальных сделок и выбирать:
          </p>
          <ul className="start-screen__actions-list">
            <li>
              <strong>Сбить</strong> — если это ложная сделка
            </li>
            <li>
              <strong>Пропустить</strong> — если сделка живая
            </li>
            <li>
              <strong>Проверить вопросом</strong> — если нужна квалификация
            </li>
          </ul>
          <p className="start-screen__note">
            Тёплый контакт — не authority.
            <br />
            Пилот — не покупка.
            <br />
            Встречи — не прогресс.
          </p>
        </div>
        <button className="btn btn--primary btn--large" onClick={onStart}>
          Начать охоту
        </button>
        <p className="start-screen__meta">4 раунда · 19 кейсов · Финальная диагностика</p>
      </div>
    </BackgroundScreen>
  );
}
