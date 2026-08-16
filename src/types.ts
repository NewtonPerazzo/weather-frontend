export type AuthTokens = { access_token: string; refresh_token: string; token_type: string; access_token_expires_in: number }

export type Forecast = {
  timezone: string
  current: { time: string; temperature_2m: number | null; apparent_temperature: number | null; relative_humidity_2m: number | null; precipitation: number | null; wind_speed_10m: number | null }
}

export type AnalysisHour = { hour: string; score: number; reason: string[]; info: { temperature: number; rain_probability: number; wind_speed: number; humidity: number; apparent_temperature: number } }
export type HourlyAnalysis = { current_hour: AnalysisHour | null; hours: AnalysisHour[] }
