import type { TFunction } from "i18next";

import { ApiError } from "../api";


const errorTranslationKeys: Record<string, string> = {
  city_not_found: "errorCityNotFound",
  forecast_date_unavailable: "errorForecastDateUnavailable",
  weather_provider_unavailable: "errorWeatherUnavailable",
  report_generation_failed: "errorReportGenerationFailed",
  invalid_request: "errorInvalidRequest",
  invalid_credentials: "errorInvalidCredentials",
  unauthorized: "errorInvalidCredentials",
  resource_conflict: "errorAccountAlreadyExists",
  resource_not_found: "errorNotFound",
  service_busy: "errorServiceBusy",
  service_unavailable: "errorServiceUnavailable",
  internal_error: "errorUnexpected",
  request_failed: "errorUnexpected",
};


export function getUserFriendlyError(
  error: unknown,
  translate: TFunction,
): string {
  if (!(error instanceof ApiError)) {
    return translate("requestError");
  }

  if (error.status === 401) {
    return translate("errorSessionExpired");
  }

  return translate(errorTranslationKeys[error.code] ?? "requestError");
}
