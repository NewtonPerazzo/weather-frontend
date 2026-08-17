import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  function handleChange(language: string) {
    i18n.changeLanguage(language);
    localStorage.setItem("weather_language", language);
  }

  return (
    <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
      <Languages size={16} />
      {t("language")}
      <select
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-slate-950"
        onChange={(event) => handleChange(event.target.value)}
        value={i18n.language}
      >
        <option value="en">English</option>
        <option value="pt">Português</option>
      </select>
    </label>
  );
}
