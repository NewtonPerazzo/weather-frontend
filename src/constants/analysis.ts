export const analysisPeriods = ["morning", "evening", "night", "dawn"] as const;

export type AnalysisPeriod = (typeof analysisPeriods)[number];
