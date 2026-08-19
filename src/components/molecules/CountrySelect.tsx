import { useTranslation } from "react-i18next";

import { countries } from "../../constants/countries";

type CountrySelectProps = {
  onChange: (countryCode: string) => void;
  value: string;
};

export function CountrySelect({ onChange, value }: CountrySelectProps) {
  const { t } = useTranslation();

  return (
    <label className="field-label">
      {t("country")}
      <span className="relative mt-1.5 block">
        <select
          className="input appearance-none"
          onChange={(event) => onChange(event.target.value)}
          value={value}
        >
          <option value="">{t("countryPlaceholder")}</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
