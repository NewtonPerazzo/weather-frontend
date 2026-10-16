import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  function handleChange(language: string) {
    i18n.changeLanguage(language);
    localStorage.setItem("weather_language", language);
  }

  return (
    <label className="flex flex-col items-start gap-0.5 text-[10px] font-bold text-slate-700 min-[501px]:flex-row min-[501px]:items-center min-[501px]:gap-2 min-[501px]:text-sm">
      <span className="flex items-center gap-1">
        <Languages className="h-3 w-3 min-[501px]:h-4 min-[501px]:w-4" />
        {t("language")}
      </span>
      <select
        className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs text-slate-950 min-[501px]:text-sm"
        onChange={(event) => handleChange(event.target.value)}
        value={i18n.language}
      >
        <option value="en">English</option>
        <option value="pt">Português</option>
      </select>
    </label>
  );
}
