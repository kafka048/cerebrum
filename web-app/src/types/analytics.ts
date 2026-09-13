export interface StreakResult {
  current_streak: number;
  longest_streak: number;
  streak_breaks: string[];
  streak_distribution: {
    distribution: string;
    early_break_count?: number;
    middle_break_count?: number;
    recent_break_count?: number;
    [key: string]: unknown;
  };
}

export interface AdherenceResult {
  overall_adherence: number;
  recent_adherence: number;
  temporal_adherence_profile: {
    initial_adherence?: number;
    middle_adherence?: number;
    recent_adherence?: number;
    [key: string]: number | undefined;
  };
}

export interface MomentumResult {
  weighted_score: number;
  momentum_direction: number;
  momentum_acceleration: number;
}

export interface ConsistencyResult {
  transition_rate: number;
  average_run: number;
  average_positive_run: number;
  average_negative_run: number;
}

export interface SignalResult {
  streak: StreakResult;
  adherence: AdherenceResult;
  momentum: MomentumResult;
  consistency: ConsistencyResult;
  most_recent_date: string;
}

export interface SnapshotResult {
  reliability: number; // overall adherence rate (0.0 - 1.0)
  follow_through: number; // recent adherence rate (0.0 - 1.0)
  stability: number; // transition rate (0.0 - 1.0)
  direction: number; // momentum direction
  current_streak: number; // current consecutive completed run
  strongest_run: number; // longest historical completed run
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

export interface ProfileResult {
  profile: string; // e.g. "sustainable", "burnout", "chaotic", "declining", "recovery", "weekend_warrior"
  score: number;
  total: number;
  confidence: number; // float 0.0 to 1.0
  evidence: string[];
}

export interface InterpretationResult {
  primary_profile: ProfileResult;
  all_profiles: ProfileResult[];
}

export interface InterpretationResponse {
  status: "learning" | "ready";
  logs_observed: number;
  minimum_logs_required: number;
  interpretation: InterpretationResult | null;
  snapshot: SnapshotResult | null;
  technical: TechnicalResult | null;
}
