export interface Insight {
  title: string;
  summary: string;
  highlights: string[];
  warnings: string[];
}

export interface InsightsRequest {
  monthKey: string;
  questionKey: string;
}
