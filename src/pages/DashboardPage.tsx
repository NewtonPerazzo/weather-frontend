import { useState } from "react";
import { useForm } from "react-hook-form";
import { CloudSun, Download, Gauge, LogOut, Search, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { api, ApiError } from "../api";
import { analysisPeriods } from "../constants/analysis";
import type { HourlyAnalysis } from "../types";
import { Button } from "../components/atoms/Button";
import { FeedbackMessage } from "../components/atoms/FeedbackMessage";
import { CountrySelect } from "../components/molecules/CountrySelect";
import { LanguageSwitcher } from "../components/molecules/LanguageSwitcher";
import InfoCard from "../components/molecules/InfoCard";
import { PaginatedCarousel } from "../components/molecules/PaginatedCarousel";
import { getUserFriendlyError } from "../utils/api-error";

type DashboardPageProps = { accessToken: string; onLogout: () => void };
type AnalysisFormValues = {
  city: string;
  countryCode: string;
  day: string;
  period: string;
};

type AnalysisRequest = {
  city: string;
  countryCode: string;
  day?: string;
  period?: string;
};

export function DashboardPage({ accessToken, onLogout }: DashboardPageProps) {
  const { t } = useTranslation();
  const [analysis, setAnalysis] = useState<HourlyAnalysis | null>(null);
  const [analysisRequest, setAnalysisRequest] = useState<AnalysisRequest | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"weather" | "analysis" | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  const analysisForm = useForm<AnalysisFormValues>({
    defaultValues: { city: "", countryCode: "BR", day: "", period: "" },
  });

  function handleError(caught: unknown) {
    if (caught instanceof ApiError && caught.status === 401) {
      onLogout();
      return;
    }
    setError(getUserFriendlyError(caught, t));
  }

  const searchAnalysis = analysisForm.handleSubmit(async (data) => {
    setError("");
    setLoading("analysis");
    try {
      const requestData = {
        city: data.city,
        countryCode: data.countryCode,
        ...(data.day ? { day: data.day } : {}),
        ...(data.period ? { period: data.period } : {}),
      };
      const response = await api.analysis(accessToken, {
        city: requestData.city,
        country_code: requestData.countryCode,
        ...(requestData.day ? { day: requestData.day } : {}),
        ...(requestData.period ? { filter: requestData.period } : {}),
      });
      setAnalysis(response);
      setAnalysisRequest(requestData);
    } catch (caught) {
      handleError(caught);
    } finally {
      setLoading(null);
    }
  });

  async function downloadReport() {
    if (!analysisRequest) return;

    const forecastDays = analysisRequest.day ? 16 : 1;
    const cityKey = `${analysisRequest.city.toLowerCase().trim().replaceAll(" ", "_")}_${analysisRequest.countryCode.toLowerCase()}_${forecastDays}1`;
    setError("");
    setReportLoading(true);
    try {
      const task = await api.createReport(
        accessToken,
        cityKey,
        analysisRequest.city,
        {
          ...(analysisRequest.day ? { day: analysisRequest.day } : {}),
          ...(analysisRequest.period ? { filter: analysisRequest.period } : {}),
        },
      );
      for (let attempt = 0; attempt < 20; attempt += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 1000));
        const result = await api.getReport(accessToken, task.task_id);
        if ("blob" in result && result.blob) {
          const url = URL.createObjectURL(result.blob);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.download = "weather-report.xlsx";
          anchor.click();
          URL.revokeObjectURL(url);
          return;
        }
        if (result.status === "failed") {
          throw new ApiError("report_generation_failed", 500);
        }
      }
      setError(t("reportStillGenerating"));
    } catch (caught) {
      handleError(caught);
    } finally {
      setReportLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-6">
          <div className="flex items-center gap-2 text-sky-700">
            <CloudSun size={28} />
            <span className="text-lg font-black">{t("app")}</span>
          </div>
          <div className="ml-auto flex items-end gap-2 sm:items-center sm:gap-4">
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
          <section className="panel self-start">
            <div className="panel-heading">
              <div>
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
              <div className="field-label">
                <label htmlFor="analysis-date">{t("date")}</label>
                <div className="relative mt-1.5">
                  <input
                    className="input"
                    id="analysis-date"
                    type="date"
                    {...analysisForm.register("day")}
                  />
                  {analysisForm.watch("day") ? (
                    <button
                      aria-label={t("clearDate")}
                      className="absolute right-9 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      onClick={() => analysisForm.setValue("day", "")}
                      title={t("clearDate")}
                      type="button"
                    >
                      <X size={16} />
                    </button>
                  ) : null}
                </div>
              </div>
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
          </section>
          <div>
            {analysis && (
              <section>
                  <div>
                    {analysis.current_hour && (
                      <InfoCard
                        hour={analysis.current_hour}
                        title={t("currentWeather")}
                      />
                    )}
                  </div>
              </section>
            )}
            {analysis && (
              <Button className="mt-4" disabled={reportLoading} onClick={downloadReport}>
                <Download size={17} />
                {reportLoading ? t("generatingReport") : t("downloadExcelReport")}
              </Button>
            )}
            {analysis && (
              <section>
                <PaginatedCarousel
                  ariaLabel={t("byHour")}
                  getItemKey={(hour) => hour.hour}
                  items={analysis.hours}
                  nextLabel={t("nextHour")}
                  previousLabel={t("previousHour")}
                  renderItem={(hour) => <InfoCard hour={hour} />}
                />
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
