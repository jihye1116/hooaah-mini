export interface PointDesc {
  title: string;
  description: string;
}

export interface EvaluationPoint {
  evaluation: string;
  point: string[];
  description: string;
}

export interface LineData {
  summary: string;
  primitive: {
    type: EvaluationPoint;
    visibility: EvaluationPoint & { score: number | string };
    cut: EvaluationPoint & { isCut: boolean };
    curve: EvaluationPoint;
    total: string;
  };
  personality: {
    type: string;
    score: number | string;
    description: string;
    point: PointDesc[];
    skill?: {
      level: string | number;
      description: string;
      preference: string;
      methods: string;
    };
    will?: {
      level: string | number;
      description: string;
      preference: string;
      methods: string;
    };
    sense?: { level: string | number; description: string };
    match?: { level: string[]; description: string[] };
    mismatch?: { level: string[]; description: string[] };
  };
  flow: {
    time: { age: string; description: string }[];
    prime: { age: string; title: string; description: string };
    total: string;
  };
  risk: {
    time: number[];
    type: { title: string; point1: string; point2: string }[];
    advice: { title: string; point1: string; point2: string }[];
  };
  chance: {
    years: { age: string; point: string[] }[];
    investment: {
      month1: number;
      month2: number;
      description: string;
      methods: { asset: string; description: string }[];
    };
  };
  present: {
    time: number[];
    flow: { title: string; point1: string; point2: string }[];
    fortune: {
      evaluation: string;
      point: string[];
      advice: { title: string; description: string };
    };
    risk: { title: string; point: string[] };
  };
  total: {
    core: string;
    point: PointDesc[];
  };
}

export interface BundleResult {
  hand: string;
  lines: Record<string, LineData>;
  age?: number;
  bundleAnalysis?: string;
  error: boolean;
  errorText: string;
}
