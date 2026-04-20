import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserProfile, UserProfileFormData } from '../types/userProfile';

function normalizeSkills(raw: string): string[] {
  return raw
    .split(',')
    .map(skill => skill.trim())
    .filter(Boolean);
}

function buildProfilePayload(formData: UserProfileFormData, user: User) {
  return {
    id: user.id,
    email: user.email ?? null,
    full_name: formData.full_name.trim() || user.user_metadata?.full_name || user.email || null,
    preferred_name: formData.preferred_name.trim() || null,
    phone: formData.phone.trim() || null,
    country: formData.country.trim() || null,
    city: formData.city.trim() || null,
    professional_title: formData.professional_title.trim() || null,
    organization: formData.organization.trim() || null,
    industry: formData.industry.trim() || null,
    years_of_experience: formData.years_of_experience.trim()
      ? Number.parseInt(formData.years_of_experience, 10) || 0
      : null,
    bio: formData.bio.trim() || null,
    areas_of_expertise: formData.areas_of_expertise.trim() || null,
    skills: normalizeSkills(formData.skills),
    linkedin_url: formData.linkedin_url.trim() || null,
    portfolio_url: formData.portfolio_url.trim() || null,
  };
}

export async function ensureUserProfile(user: User): Promise<UserProfile | null> {
  if (!supabase) return null;

  const { data: existing, error: existingError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existing) {
    return existing as UserProfile;
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert({
      id: user.id,
      email: user.email ?? null,
      full_name: user.user_metadata?.full_name || user.email || null,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
}

export async function getMyProfile(user: User): Promise<UserProfile | null> {
  return ensureUserProfile(user);
}

export async function saveMyProfile(user: User, formData: UserProfileFormData): Promise<UserProfile> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(buildProfilePayload(formData, user))
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
}
