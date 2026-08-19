import {
  NotebookPen,
  Thermometer,
  SunMoon,
  Droplet,
  CloudRainWind,
  Wind,
} from "lucide-react"
import type { CityHourAnalysisData } from "../../constants/types"

interface InfoCardProps {
  hour: CityHourAnalysisData
  title?: string
}

const InfoCard = ({ hour, title }: InfoCardProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-[450px]">

      {title && (
        <p className="text-lg font-semibold mb-5">
          {title}
        </p>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <NotebookPen size={18} />

          <p className="text-xl font-semibold">
            {hour.hour}
          </p>
        </div>

        <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
                <span className="text-slate-600">
                    Score
                </span>

                <span className="font-bold text-slate-700">
                    {hour.score}
                </span>
            </div>
            {hour.reason && <span className="font-semibold text-xs text-slate-600">
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