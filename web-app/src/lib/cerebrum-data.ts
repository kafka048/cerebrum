// Mock data shaped to match the expected backend contract for Cerebrum.
// The frontend never derives behavioral conclusions — it only renders these.

export type TaskStatus = "pending" | "completed" | "skipped" | "failed";

export type Task = {
  id: string;
  name: string;
  status: TaskStatus;
  reason?: string;
  lastLogged?: string;
  reliability?: number;
};

export type Goal = {
  id: string;
  name: string;
  purpose: string;
  tasks: Task[];
  rhythm: string;
};

export type Direction = "Building" | "Stable" | "Slowing" | "Recovering";

export type Classification =
  | "Sustainable Performer"
  | "Recovery Pattern"
  | "Burnout Risk"
  | "Declining"
  | "Chaotic Behavior"
  | "Weekend Warrior";

export const todaysFocus: Goal[] = [
  {
    id: "g-fitness",
    name: "Fitness",
    purpose: "Build durable physical capacity.",
    rhythm: "5 of 7 days",
    tasks: [
      { id: "t-run", name: "Run 5km", status: "pending", reliability: 0.82 },
      { id: "t-mobility", name: "Mobility — 15 min", status: "pending", reliability: 0.71 },
    ],
  },
  {
    id: "g-learning",
    name: "Learning",
    purpose: "Deepen engineering fluency.",
    rhythm: "4 of 7 days",
    tasks: [
      { id: "t-mongo", name: "MongoDB Aggregation", status: "pending", reliability: 0.68 },
      { id: "t-paper", name: "Read systems paper — 30 min", status: "pending", reliability: 0.59 },
    ],
  },
  {
    id: "g-career",
    name: "Career",
    purpose: "Stay sharp for the next move.",
    rhythm: "3 of 7 days",
    tasks: [
      { id: "t-dsa", name: "DSA Practice — 2 problems", status: "pending", reliability: 0.74 },
    ],
  },
];

export const reasonOptions = [
  "Tired",
  "Other Commitments",
  "Distracted",
  "Low Motivation",
  "Other",
] as const;

/* ----------------------------- Task intelligence ----------------------------- */

export type Profile = {
  name: Classification | string;
  confidence: number; // 0..100
  evidence: string[]; // raw strings, no generated text
};

export type TaskSnapshot = {
  reliability: number; // 0..1
  followThrough: number; // 0..1
  stability: number; // 0..1
  direction: Direction;
  currentStreak: number; // days
  strongestRun: number; // days
};

export type TaskIntelligence = {
  primary_profile: Profile;
  secondary_profiles: Profile[]; // already sorted desc by confidence
  snapshot: TaskSnapshot;
  technical: {
    rawClassification: string;
    confidence: number;
    metrics: Record<string, number>;
    signalBreakdown: Record<string, number>;
  };
};

// Single shared mock until backend supplies real per-task values.
export const sampleTaskIntelligence: TaskIntelligence = {
  primary_profile: {
    name: "Sustainable Performer",
    confidence: 80,
    evidence: [
      "Recent execution stronger than your historical baseline.",
      "Recovers within a day after a missed task.",
      "Current rhythm exceeds your typical rhythm by a meaningful margin.",
      "No volatility spikes detected in the last 21 days.",
      "Weekday execution converging with weekend execution.",
      "Maintains consistent completion across the last four weeks.",
    ],
  },
  secondary_profiles: [
    {
      name: "Recovery Pattern",
      confidence: 76,
      evidence: [
        "Bounce-back behavior follows minor disruptions within a single day.",
        "Recovery cycles tighten as adherence stabilizes.",
      ],
    },
    {
      name: "Chaotic Behavior",
      confidence: 72,
      evidence: [
        "Mid-week execution shows higher variance than the surrounding days.",
        "Skip clustering occasionally appears on heavy commitment days.",
      ],
    },
    {
      name: "Burnout Risk",
      confidence: 58,
      evidence: [
        "Sustained execution density approaching upper personal tolerance.",
        "Late-week energy reports trend downward when load increases.",
      ],
    },
  ],
  snapshot: {
    reliability: 0.86,
    followThrough: 0.91,
    stability: 0.83,
    direction: "Building",
    currentStreak: 12,
    strongestRun: 21,
  },
  technical: {
    rawClassification: "sustainable_performer",
    confidence: 0.8012,
    metrics: {
      overall_adherence: 0.842,
      recent_adherence: 0.913,
      momentum: 0.187,
      momentum_acceleration: 0.062,
      transition_rate: 0.041,
      weighted_score: 0.876,
    },
    signalBreakdown: {
      consistency_signal: 0.88,
      recovery_signal: 0.79,
      volatility_signal: 0.12,
      trend_signal: 0.21,
    },
  },
};
