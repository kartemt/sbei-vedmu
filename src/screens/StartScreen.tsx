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
        <div className="start-screen__rules">
          <div className="start-screen__rule">
            <strong>Сбить</strong> — если это ложная сделка
          </div>
          <div className="start-screen__rule">
            <strong>Пропустить</strong> — если сделка живая
          </div>
          <div className="start-screen__rule">
            <strong>Задать вопрос</strong> — если нужна квалификация
          </div>
        </div>
        <button className="btn btn--primary btn--large" onClick={onStart}>
          Начать охоту
        </button>
        <p className="start-screen__meta">3 раунда · 9 кейсов · Финальная диагностика</p>
      </div>
    </BackgroundScreen>
  );
}
