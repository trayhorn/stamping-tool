import "./LangSwitch.scss";
import { useTranslation } from "react-i18next";

const supportedLanguages = {
  en: "English",
  ua: "Ukrainian"
};

export default function LangSwitch() {
  const { i18n } = useTranslation();

  return (
    <div className="langSwitch-container">
      <select
        className="lang-switch is-hidden"
        name="language"
        id="language"
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        {Object.entries(supportedLanguages).map(([lang, label]) => (
          <option className="item" key={lang} value={lang}>
            {label}
          </option>
        ))}
      </select>
      <span className="custom-arrow is-hidden"></span>
    </div>
	);
}