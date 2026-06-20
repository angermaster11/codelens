export interface PlatformInput {
  leetcode?: string;
  codeforces?: string;
  codechef?: string;
  hackerrank?: string;
  atcoder?: string;
  spoj?: string;
  hackerearth?: string;
  github?: string;
}

export interface PlatformStats {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface PlatformResult {
  platform: string;
  username: string;
  status: 'success' | 'error' | 'not_provided';
  stats: PlatformStats;
  error?: string;
}

export interface AIAnalysis {
  overall_score: number;
  dsa_strength: string;
  competitive_programming_level: string;
  open_source_level: string;
  interview_readiness: string;
  faang_readiness: string;
  strengths: string[];
  weaknesses: string[];
  recommended_topics: string[];
  next_steps: string[];
  personalized_feedback: string;
}

export interface AnalyzeResponse {
  username: string;
  leetcode?: PlatformResult;
  codeforces?: PlatformResult;
  codechef?: PlatformResult;
  hackerrank?: PlatformResult;
  atcoder?: PlatformResult;
  spoj?: PlatformResult;
  hackerearth?: PlatformResult;
  github?: PlatformResult;
  ai_analysis: AIAnalysis;
}

export interface BulkResult {
  row: number;
  username: string;
  platforms: Record<string, PlatformResult>;
  ai_analysis: AIAnalysis | null;
  status: 'success' | 'error';
  error?: string;
}
