import ReactCountryFlag from "react-country-flag";
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
        {value ? (
          <ReactCountryFlag
            svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-5 -translate-y-1/2"
            countryCode={value}
          />
        ) : null}
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
