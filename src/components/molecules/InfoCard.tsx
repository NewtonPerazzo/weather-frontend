import {
  NotebookPen,
  Thermometer,
  SunMoon,
  Droplet,
  CloudRainWind,
  Wind,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import type { CityHourAnalysisData } from "../../constants/types"

interface InfoCardProps {
  hour: CityHourAnalysisData
  title?: string
}

const InfoCard = ({ hour, title }: InfoCardProps) => {
  const { t } = useTranslation()

  return (
    <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6">

      {title && (
        <p className="text-lg font-semibold mb-5">
          {title}
        </p>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <NotebookPen size={18} />

          <p className="text-lg font-semibold leading-tight sm:text-xl">
            {title ? hour.hour : t("dataForHour", { hour: hour.hour })}
          </p>
        </div>

        <div className="flex w-24 shrink-0 flex-col items-end text-right min-[501px]:w-32">
            <div className="flex w-full items-center justify-end gap-2">
                <span className="text-sm text-slate-600 sm:text-base">
                    Score
                </span>

                <span className="font-bold text-slate-700">
                    {hour.score}
                </span>
            </div>
            {hour.reason && <span className="mt-0.5 block w-full text-right text-[10px] font-semibold leading-tight text-slate-600 sm:text-xs">
                {hour.reason}
            </span>}
        </div>
      </div>

      {/* Weather information */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Thermometer size={18} />
            <p>Temperature</p>
          </div>

          <p className="text-slate-700">
            {hour.info.temperature}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <SunMoon size={18} />
            <p>Apparent temperature</p>
          </div>

          <p className="text-slate-700">
            {hour.info.apparent_temperature}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Droplet size={18} />
            <p>Humidity</p>
          </div>

          <p className="text-slate-700">
            {hour.info.humidity}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <CloudRainWind size={18} />
            <p>Rain</p>
          </div>

          <p className="text-slate-700">
            {hour.info.rain_probability}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Wind size={18} />
            <p>Wind</p>
          </div>

          <p className="text-slate-700">
            {hour.info.wind_speed}
          </p>
        </div>

      </div>
    </div>
  )
}

export default InfoCard
