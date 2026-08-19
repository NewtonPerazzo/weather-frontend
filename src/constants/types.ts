export interface CityHourAnalysisData {
  hour: string
  score: number
  reason: string[]
  info: CityHourAnalysisInfo
}

export interface CityHourAnalysisInfo {
  temperature: number
  rain_probability: number
  wind_speed: number
  humidity: number
  apparent_temperature: number
}