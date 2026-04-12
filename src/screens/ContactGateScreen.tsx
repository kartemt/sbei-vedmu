import { useState } from "react";
import { BackgroundScreen } from "../components/BackgroundScreen";
import { trackContact, trackCta } from "../utils/analytics";
import { sanitizeContact } from "../utils/sanitize";

type Props = {
  onContinue: () => void;
};

export function ContactGateScreen({ onContinue }: Props) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    const clean = sanitizeContact(value);
    if (clean) {
      trackContact(clean);
      trackCta();
    }
    setSubmitted(true);
    setTimeout(onContinue, 800);
  }

  function handleSkip() {
    onContinue();
  }

  return (
    <BackgroundScreen bgKey="roundIntro">
      <div className="contact-gate">
        <h2 className="contact-gate__title">Хочу продолжить охоту</h2>
        <p className="contact-gate__text">
          Оставьте email или @telegram — пришлём следующий раунд.
        </p>

        {!submitted ? (
          <>
            <input
              className="contact-gate__input"
              type="text"
              placeholder="email или @telegram"
              value={value}
              maxLength={120}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
            <button className="btn btn--primary btn--large" onClick={handleSubmit}>
              Продолжить
            </button>
            <button className="contact-gate__skip" onClick={handleSkip}>
              Пропустить
            </button>
          </>
        ) : (
          <div className="contact-gate__done">Записано. Загружаем Раунд 3…</div>
        )}
      </div>
    </BackgroundScreen>
  );
}
