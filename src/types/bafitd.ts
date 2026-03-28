// BaFitD — Batswana and Friends in the Diaspora Registry Types

export type Gender = 'male' | 'female' | 'prefer_not_to_say';
export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
export type QualificationLevel = 'certificate' | 'diploma' | 'degree' | 'masters' | 'doctorate' | 'other';
export type SkillCategory = 'healthcare' | 'engineering' | 'education' | 'legal' | 'agriculture' | 'IT' | 'finance' | 'trades' | 'social_work' | 'other';
export type AvailabilityFrequency = 'weekly' | 'biweekly' | 'monthly' | 'flexible';
export type ServiceMode = 'in_person' | 'virtual' | 'both';
export type PreferredContact = 'whatsapp' | 'sms' | 'phone_call' | 'email';
export type StartAvailability = 'immediately' | 'within_1_month' | 'within_3_months' | 'not_sure';
export type EmployerSupport = 'yes' | 'not_yet' | 'self_employed' | 'retired' | 'not_applicable' | 'not_asked';
export type VolunteerStatus = 'registered' | 'active' | 'verified' | 'inactive';
export type ReferralSource = 'social_media' | 'friend' | 'news' | 'employer' | 'other';
export type BotswanaLanguage = 'english' | 'setswana' | 'kalanga' | 'sekgalagadi' | 'herero' | 'sebirwa' | 'other';

export interface BaFitDVolunteer {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  gender: Gender | null;
  age_range: AgeRange | null;
  languages_spoken: BotswanaLanguage[];
  nationality: string | null;
  omang_number: string | null;
  passport_number: string | null;
  preferred_contact: PreferredContact;
  city: string;
  district: string | null;
  is_diaspora: boolean;
  country_of_residence: string;
  willing_to_travel_back: boolean | null;
  preferred_service_district: string | null;
  institution: string;
  qualification: string;
  qualification_level: QualificationLevel;
  graduation_year: number | null;
  government_funded: boolean;
  skill_category: SkillCategory;
  skill_specialty: string;
  specific_services: string | null;
  years_of_experience: number;
  current_employer: string | null;
  professional_license: string | null;
  employer_support: EmployerSupport;
  availability_frequency: AvailabilityFrequency;
  preferred_days: string[];
  service_mode: ServiceMode;
  available_for_virtual: boolean;
  start_availability: StartAvailability;
  status: VolunteerStatus;
  pledge_statement: string | null;
  preferred_language: 'en' | 'tn';
  referral_source: ReferralSource | null;
  freeform_text: string | null;
  input_mode: 'form' | 'freeform';
  created_at: string;
  updated_at: string;
}

export interface BaFitDFormData {
  // Step 1: About You
  full_name: string;
  phone: string;
  email: string;
  gender: Gender | '';
  age_range: AgeRange | '';
  // Step 2: Education
  qualification_level: QualificationLevel | '';
  qualification: string;
  institution: string;
  graduation_year: string;
  government_funded: boolean | null;
  nationality: string;
  relationship_to_botswana: string;
  relationship_to_botswana_other: string;
  omang_number: string;
  passport_number: string;
  // Step 3: Skills
  skill_category: SkillCategory | '';
  skill_category_other: string;
  skill_specialty: string;
  specific_services: string;
  years_of_experience: string;
  current_employer: string;
  professional_license: string;
  // Step 4: Where & When
  is_diaspora: boolean | null;
  city: string;
  district: string;
  country_of_residence: string;
  willing_to_travel_back: boolean;
  preferred_service_district: string;
  start_availability: StartAvailability | '';
  employer_support: EmployerSupport | '';
  // Step 5: Availability
  availability_frequency: AvailabilityFrequency | '';
  preferred_days: string[];
  service_mode: ServiceMode | '';
  preferred_contact: PreferredContact | '';
  languages_spoken: BotswanaLanguage[];
  // Step 6: Review & Pledge
  referral_source: ReferralSource | '';
  pledge_statement: string;
  preferred_language: 'en' | 'tn';
}

export interface BaFitDStats {
  total_volunteers: number;
  by_category: Record<string, number>;
  by_city: Record<string, number>;
  by_gender: Record<string, number>;
  by_age_range: Record<string, number>;
  diaspora_count: number;
  local_count: number;
  govt_funded_count: number;
  ready_now_count: number;
}

export const INITIAL_FORM_DATA: BaFitDFormData = {
  full_name: '',
  phone: '',
  email: '',
  gender: '',
  age_range: '',
  qualification_level: '',
  qualification: '',
  institution: '',
  graduation_year: '',
  government_funded: null,
  nationality: '',
  relationship_to_botswana: '',
  relationship_to_botswana_other: '',
  omang_number: '',
  passport_number: '',
  skill_category: '',
  skill_category_other: '',
  skill_specialty: '',
  specific_services: '',
  years_of_experience: '',
  current_employer: '',
  professional_license: '',
  is_diaspora: null,
  city: '',
  district: '',
  country_of_residence: 'Botswana',
  willing_to_travel_back: false,
  preferred_service_district: '',
  start_availability: '',
  employer_support: '',
  availability_frequency: '',
  preferred_days: [],
  service_mode: '',
  preferred_contact: '',
  languages_spoken: [],
  referral_source: '',
  pledge_statement: '',
  preferred_language: 'en',
};

export const BOTSWANA_DISTRICTS = [
  'Central',
  'Chobe',
  'Ghanzi',
  'Kgalagadi',
  'Kgatleng',
  'Kweneng',
  'North-East',
  'North-West',
  'South-East',
  'Southern',
] as const;

export const BOTSWANA_CITIES = [
  'Gaborone', 'Francistown', 'Maun', 'Kasane', 'Serowe', 'Palapye',
  'Molepolole', 'Kanye', 'Lobatse', 'Selebi-Phikwe', 'Jwaneng',
  'Orapa', 'Letlhakane', 'Mochudi', 'Ramotswa', 'Tlokweng',
  'Mogoditshane', 'Gabane', 'Mmopane', 'Mahalapye', 'Nata',
  'Tsabong', 'Ghanzi', 'Shakawe', 'Gumare',
] as const;

export const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
] as const;
