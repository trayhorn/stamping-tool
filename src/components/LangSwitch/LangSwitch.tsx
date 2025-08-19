import "./LangSwitch.scss";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const supportedLanguages = {
  en: "English",
  ua: "Ukrainian"
};

export default function LangSwitch() {
  const { i18n } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
		<div className="langSwitch-container">
			<select
				className={`lang-switch is-hidden ${open ? "is-open" : ""}`}
				name="language"
				id="language"
				onChange={(e) => i18n.changeLanguage(e.target.value)}
        onClick={() => setOpen(!open)}
				onBlur={() => setOpen(false)}
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