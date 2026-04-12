import { useState } from "react";
import { BackgroundScreen } from "../components/BackgroundScreen";
import { trackCta } from "../utils/analytics";
import { submitContact } from "../utils/contactSubmit";

type Props = {
  onContinue: () => void;
};

export function ContactGateScreen({ onContinue }: Props) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    const result = await submitContact(value);
    if (result === "ok") trackCta();
    setSubmitted(true);
    setTimeout(onContinue, 800);
  }

  return (
    <BackgroundScreen bgKey="roundIntro">
      <div className="contact-gate">
        <h2 className="contact-gate__title">Раунд 3 разблокирован</h2>
        <p className="contact-gate__text">
          Оставьте контакт — пришлём следующий материал по квалификации.
        </p>

        {!submitted ? (
          <>
            <input
              className="contact-gate__input"
              type="text"
              placeholder="E-mail или контакт в соцсетях"
              value={value}
              maxLength={120}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
            <button className="btn btn--primary btn--large" onClick={handleSubmit}>
              Продолжить
            </button>
            <button className="contact-gate__skip" onClick={onContinue}>
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
