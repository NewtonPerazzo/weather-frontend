import { useState } from "react";
import { useForm } from "react-hook-form";
import { CloudSun, Gauge, LogOut, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { api, ApiError } from "../api";
import { analysisPeriods } from "../constants/analysis";
import type { Forecast, HourlyAnalysis } from "../types";
import { Button } from "../components/atoms/Button";
import { FeedbackMessage } from "../components/atoms/FeedbackMessage";
import { CountrySelect } from "../components/molecules/CountrySelect";
import { LanguageSwitcher } from "../components/molecules/LanguageSwitcher";

type DashboardPageProps = { accessToken: string; onLogout: () => void };
type WeatherFormValues = { city: string; countryCode: string };
type AnalysisFormValues = {
  city: string;
  countryCode: string;
  day: string;
  period: string;
};

export function DashboardPage({ accessToken, onLogout }: DashboardPageProps) {
  const { t } = useTranslation();
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [analysis, setAnalysis] = useState<HourlyAnalysis | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"weather" | "analysis" | null>(null);
  const weatherForm = useForm<WeatherFormValues>({
    defaultValues: { city: "", countryCode: "BR" },
  });
  const analysisForm = useForm<AnalysisFormValues>({
    defaultValues: { city: "", countryCode: "BR", day: "", period: "" },
  });

  function handleError(caught: unknown) {
    if (caught instanceof ApiError && caught.status === 401) {
      onLogout();
      return;
    }
    setError(caught instanceof ApiError ? caught.message : t("requestError"));
  }
  const searchWeather = weatherForm.handleSubmit(async (data) => {
    setError("");
    setLoading("weather");
    try {
      setForecast(
        await api.forecast(accessToken, {
          name: data.city,
          country_code: data.countryCode,
        }),
      );
    } catch (caught) {
      handleError(caught);
    } finally {
      setLoading(null);
    }
  });
  const searchAnalysis = analysisForm.handleSubmit(async (data) => {
    setError("");
    setLoading("analysis");
    try {
      setAnalysis(
        await api.analysis(accessToken, {
          city: data.city,
          country_code: data.countryCode,
          ...(data.day ? { day: data.day } : {}),
          ...(data.period ? { filter: data.period } : {}),
        }),
      );
    } catch (caught) {
      handleError(caught);
    } finally {
      setLoading(null);
    }
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2 text-sky-700">
            <CloudSun size={28} />
            <span className="text-lg font-black">{t("app")}</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Button variant="secondary" onClick={onLogout}>
              <LogOut size={16} /> {t("logout")}
            </Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="mb-8">
          <p className="eyebrow">{t("app")}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
            {t("title")}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-700">{t("subtitle")}</p>
        </section>
        {error ? <FeedbackMessage type="error">{error}</FeedbackMessage> : null}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">01</p>
                <h2>{t("weather")}</h2>
                <p>{t("weatherHint")}</p>
              </div>
              <CloudSun className="text-sky-700" />
            </div>
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={searchWeather}
            >
              <label className="field-label">
                {t("city")}
                <input
                  className="input mt-1.5"
                  {...weatherForm.register("city", { required: true })}
                />
              </label>
              <CountrySelect
                value={weatherForm.watch("countryCode")}
                onChange={(value) => weatherForm.setValue("countryCode", value)}
              />
              <Button
                className="sm:col-span-2"
                disabled={loading !== null}
                type="submit"
              >
                <Search size={17} />
                {loading === "weather" ? t("loading") : t("searchWeather")}
              </Button>
            </form>
            {forecast ? (
              <pre className="result-card mt-6 overflow-auto text-xs">
                {JSON.stringify(forecast, null, 2)}
              </pre>
            ) : null}
          </section>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">02</p>
                <h2>{t("analysis")}</h2>
                <p>{t("analysisHint")}</p>
              </div>
              <Gauge className="text-indigo-700" />
            </div>
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={searchAnalysis}
            >
              <label className="field-label">
                {t("city")}
                <input
                  className="input mt-1.5"
                  {...analysisForm.register("city", { required: true })}
                />
              </label>
              <CountrySelect
                value={analysisForm.watch("countryCode")}
                onChange={(value) =>
                  analysisForm.setValue("countryCode", value)
                }
              />
              <label className="field-label">
                {t("date")}
                <input
                  className="input mt-1.5"
                  type="date"
                  {...analysisForm.register("day")}
                />
              </label>
              <label className="field-label">
                {t("period")}
                <select
                  className="input mt-1.5"
                  {...analysisForm.register("period")}
                >
                  <option value="">{t("allPeriods")}</option>
                  {analysisPeriods.map((period) => (
                    <option key={period} value={period}>
                      {t(period)}
                    </option>
                  ))}
                </select>
              </label>
              <Button
                className="sm:col-span-2"
                disabled={loading !== null}
                type="submit"
                variant="analysis"
              >
                <Search size={17} />
                {loading === "analysis" ? t("loading") : t("analyze")}
              </Button>
            </form>
            {analysis ? (
              <pre className="result-card mt-6 overflow-auto text-xs">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
