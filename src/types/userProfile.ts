export interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  preferred_name: string | null;
  phone: string | null;
  country: string | null;
  city: string | null;
  professional_title: string | null;
  organization: string | null;
  industry: string | null;
  years_of_experience: number | null;
  bio: string | null;
  areas_of_expertise: string | null;
  skills: string[];
  linkedin_url: string | null;
  portfolio_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfileFormData {
  full_name: string;
  preferred_name: string;
  phone: string;
  country: string;
  city: string;
  professional_title: string;
  organization: string;
  industry: string;
  years_of_experience: string;
  bio: string;
  areas_of_expertise: string;
  skills: string;
  linkedin_url: string;
  portfolio_url: string;
}

export const EMPTY_USER_PROFILE_FORM: UserProfileFormData = {
  full_name: '',
  preferred_name: '',
  phone: '',
  country: '',
  city: '',
  professional_title: '',
  organization: '',
  industry: '',
  years_of_experience: '',
  bio: '',
  areas_of_expertise: '',
  skills: '',
  linkedin_url: '',
  portfolio_url: '',
};

export function profileToFormData(profile: UserProfile | null): UserProfileFormData {
  if (!profile) {
    return { ...EMPTY_USER_PROFILE_FORM };
  }

  return {
    full_name: profile.full_name ?? '',
    preferred_name: profile.preferred_name ?? '',
    phone: profile.phone ?? '',
    country: profile.country ?? '',
    city: profile.city ?? '',
    professional_title: profile.professional_title ?? '',
    organization: profile.organization ?? '',
    industry: profile.industry ?? '',
    years_of_experience: profile.years_of_experience?.toString() ?? '',
    bio: profile.bio ?? '',
    areas_of_expertise: profile.areas_of_expertise ?? '',
    skills: profile.skills.join(', '),
    linkedin_url: profile.linkedin_url ?? '',
    portfolio_url: profile.portfolio_url ?? '',
  };
}
