import { supabase } from '../lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Volunteer {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  gender: string | null;
  age_range: string | null;
  languages_spoken: string[] | null;
  preferred_contact: string;
  city: string;
  district: string | null;
  is_diaspora: boolean;
  country_of_residence: string;
  willing_to_travel_back: boolean | null;
  preferred_service_district: string | null;
  institution: string;
  qualification: string;
  qualification_level: string;
  graduation_year: number | null;
  government_funded: boolean;
  skill_category: string;
  skill_specialty: string;
  specific_services: string | null;
  years_of_experience: number;
  current_employer: string | null;
  professional_license: string | null;
  employer_support: string | null;
  availability_frequency: string;
  preferred_days: string[] | null;
  service_mode: string;
  available_for_virtual: boolean;
  start_availability: string;
  status: string;
  pledge_statement: string | null;
  preferred_language: string;
  referral_source: string | null;
  freeform_text: string | null;
  input_mode: string;
  created_at: string;
  updated_at: string;
}

export interface AdminStats {
  total: number;
  new_today: number;
  new_this_week: number;
  new_this_month: number;
  registered: number;
  active: number;
  verified: number;
  inactive: number;
  freeform_pending: number;
  structured: number;
  diaspora: number;
  local: number;
  govt_funded: number;
  ready_now: number;
  virtual_ready: number;
  by_category: Record<string, number>;
  by_district: Record<string, number>;
  by_gender: Record<string, number>;
  by_age_range: Record<string, number>;
  match_groups: number;
  groups_deployed: number;
  similarity_pairs: number;
}

export interface MatchGroup {
  id: string;
  name: string;
  description: string | null;
  skill_theme: string | null;
  member_ids: string[];
  match_score: number;
  match_method: string;
  deployment_recommendation: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface VolunteerFilters {
  search?: string;
  status?: string;
  skill_category?: string;
  is_diaspora?: boolean | null;
  input_mode?: string;
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('get_admin_stats');
  if (error) { console.error('getAdminStats:', error); return null; }
  return data as AdminStats;
}

// ─── Volunteers ───────────────────────────────────────────────────────────────

export async function getVolunteers(
  page = 0,
  pageSize = 50,
  filters: VolunteerFilters = {}
): Promise<{ data: Volunteer[]; count: number }> {
  if (!supabase) return { data: [], count: 0 };

  let query = supabase
    .from('bafitd_volunteers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);

  if (filters.status)         query = query.eq('status', filters.status);
  if (filters.skill_category) query = query.eq('skill_category', filters.skill_category);
  if (filters.input_mode)     query = query.eq('input_mode', filters.input_mode);
  if (filters.is_diaspora != null) query = query.eq('is_diaspora', filters.is_diaspora);

  if (filters.search) {
    const s = `%${filters.search}%`;
    query = query.or(`full_name.ilike.${s},email.ilike.${s},phone.ilike.${s},skill_specialty.ilike.${s}`);
  }

  const { data, error, count } = await query;
  if (error) { console.error('getVolunteers:', error); return { data: [], count: 0 }; }
  return { data: (data ?? []) as Volunteer[], count: count ?? 0 };
}

export async function updateVolunteerStatus(id: string, status: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('bafitd_volunteers')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) { console.error('updateVolunteerStatus:', error); return false; }
  return true;
}

// ─── Match Groups ─────────────────────────────────────────────────────────────

export async function getMatchGroups(): Promise<MatchGroup[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('volunteer_match_groups')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) { console.error('getMatchGroups:', error); return []; }
  return (data ?? []) as MatchGroup[];
}

export async function updateMatchGroupStatus(id: string, status: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('volunteer_match_groups')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) { console.error('updateMatchGroupStatus:', error); return false; }
  return true;
}

export async function createMatchGroup(data: Partial<MatchGroup>): Promise<MatchGroup | null> {
  if (!supabase) return null;
  const { data: row, error } = await supabase
    .from('volunteer_match_groups')
    .insert({ ...data, match_method: 'manual', status: 'draft' })
    .select()
    .single();
  if (error) { console.error('createMatchGroup:', error); return null; }
  return row as MatchGroup;
}

export async function computeSimilarities(): Promise<{ pairs_computed: number; groups_created: number } | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('compute_volunteer_similarities');
  if (error) { console.error('computeSimilarities:', error); return null; }
  return data;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getVolunteersByIds(ids: string[]): Promise<{ data: Volunteer[]; count: number }> {
  return getVolunteers(0, 500, {});  // caller filters by id client-side for simplicity
}
