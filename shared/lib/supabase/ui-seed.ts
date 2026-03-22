import { getSupabaseServerClient } from './server';

interface SeedRow {
  payload: unknown;
}

type SeedPayload = unknown;

async function getSeed<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return fallback;
  }

  const { data, error } = await supabase
    .from('ui_seed_data')
    .select('payload')
    .eq('key', key)
    .single<SeedRow>();

  if (error || !data?.payload) {
    return fallback;
  }

  return data.payload as T;
}

export type { SeedPayload };

export interface LandingFeatureRecord {
  title: string;
  description: string;
}

export interface LandingStatRecord {
  value: string;
  label: string;
}

export interface LandingTeamRecord {
  name: string;
  role: string;
  description: string;
}

export interface LandingFaqRecord {
  question: string;
  answer: string;
}

export async function getLandingFeatures() {
  return getSeed<LandingFeatureRecord[]>('landing_features', []);
}

export async function getLandingStats() {
  return getSeed<LandingStatRecord[]>('landing_stats', []);
}

export async function getLandingTeam() {
  return getSeed<LandingTeamRecord[]>('landing_team', []);
}

export async function getLandingFaq() {
  return getSeed<LandingFaqRecord[]>('landing_faq', []);
}
