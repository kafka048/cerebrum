export interface ProfileResult {
  profile: string;
  score: number;
  total: number;
  confidence: number;
  evidence: string[];
}

export interface InterpretationResult {
  primary_profile: ProfileResult;
  all_profiles: ProfileResult[];
}

export interface SnapshotResult {
  reliability: number;
  follow_through: number;
  stability: number;
  direction: number;
  current_streak: number;
  strongest_run: number;
}

export interface TechnicalResult {
  overall_adherence: number;
  recent_adherence: number;
  transition_rate: number;
  average_run: number;
  weighted_score: number;
  momentum_direction: number;
  momentum_acceleration: number;
  current_streak: number;
  longest_streak: number;
}

export interface InterpretationResponse {
  status: "learning" | "ready";
  logs_observed: number;
  minimum_logs_required: number;
  interpretation: InterpretationResult | null;
  snapshot: SnapshotResult | null;
  technical: TechnicalResult | null;
}
