/*
  # BaFitD — Batswana and Friends in the Diaspora Registry

  A civic skills registry capturing skilled Batswana (especially those educated
  by the Botswana Government) who pledge pro bono services to their communities.

  1. New Table: bafitd_volunteers
  2. RLS Policies: anon INSERT (public form), admin SELECT/UPDATE
  3. RPC: get_bafitd_stats() for public aggregate counters
  4. AI Knowledge Base Ready: rich column comments for future Uhuru AI edge function
*/

-- ============================================================================
-- TABLE: bafitd_volunteers
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.bafitd_volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Personal Information
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  gender TEXT,
  age_range TEXT,
  languages_spoken TEXT[],
  omang_number TEXT,
  preferred_contact TEXT NOT NULL DEFAULT 'whatsapp',

  -- Location
  city TEXT NOT NULL,
  district TEXT,
  is_diaspora BOOLEAN NOT NULL DEFAULT false,
  country_of_residence TEXT NOT NULL DEFAULT 'Botswana',
  willing_to_travel_back BOOLEAN DEFAULT false,
  preferred_service_district TEXT,

  -- Education
  institution TEXT NOT NULL,
  qualification TEXT NOT NULL,
  qualification_level TEXT NOT NULL,
  graduation_year INTEGER,
  government_funded BOOLEAN NOT NULL DEFAULT false,

  -- Skills & Profession
  skill_category TEXT NOT NULL,
  skill_specialty TEXT NOT NULL,
  specific_services TEXT,
  years_of_experience INTEGER DEFAULT 0,
  current_employer TEXT,
  professional_license TEXT,
  employer_support TEXT DEFAULT 'not_asked',

  -- Pro Bono Availability
  availability_frequency TEXT NOT NULL DEFAULT 'biweekly',
  preferred_days TEXT[],
  service_mode TEXT NOT NULL DEFAULT 'both',
  available_for_virtual BOOLEAN DEFAULT true,
  start_availability TEXT DEFAULT 'immediately',

  -- Status & Meta
  status TEXT NOT NULL DEFAULT 'registered',
  pledge_statement TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  referral_source TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================================
-- INDEXES (optimized for admin queries + AI knowledge base aggregation)
-- ============================================================================

CREATE INDEX idx_bafitd_status ON public.bafitd_volunteers (status);
CREATE INDEX idx_bafitd_skill_category ON public.bafitd_volunteers (skill_category);
CREATE INDEX idx_bafitd_city ON public.bafitd_volunteers (city);
CREATE INDEX idx_bafitd_district ON public.bafitd_volunteers (district);
CREATE INDEX idx_bafitd_is_diaspora ON public.bafitd_volunteers (is_diaspora);
CREATE INDEX idx_bafitd_created_at ON public.bafitd_volunteers (created_at DESC);
CREATE INDEX idx_bafitd_govt_funded ON public.bafitd_volunteers (government_funded);
CREATE INDEX idx_bafitd_gender ON public.bafitd_volunteers (gender);
CREATE INDEX idx_bafitd_age_range ON public.bafitd_volunteers (age_range);
CREATE INDEX idx_bafitd_service_district ON public.bafitd_volunteers (preferred_service_district);
CREATE INDEX idx_bafitd_start ON public.bafitd_volunteers (start_availability);
CREATE INDEX idx_bafitd_phone ON public.bafitd_volunteers (phone);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.bafitd_volunteers ENABLE ROW LEVEL SECURITY;

-- PUBLIC: Anyone (anon) can submit the registration form
CREATE POLICY "Anyone can register as a BaFitD volunteer"
  ON public.bafitd_volunteers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ADMIN: OrionX team can view all volunteers
CREATE POLICY "Admins can view all BaFitD volunteers"
  ON public.bafitd_volunteers
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users au
      WHERE au.id = auth.uid()
      AND au.email LIKE '%@orionx.xyz'
    )
  );

-- ADMIN: OrionX team can update volunteer status
CREATE POLICY "Admins can update BaFitD volunteer status"
  ON public.bafitd_volunteers
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users au
      WHERE au.id = auth.uid()
      AND au.email LIKE '%@orionx.xyz'
    )
  );

-- ============================================================================
-- RPC: Public aggregate statistics (no personal data exposed)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_bafitd_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_volunteers', COUNT(*),
    'by_category', (
      SELECT COALESCE(json_object_agg(skill_category, cnt), '{}'::json)
      FROM (
        SELECT skill_category, COUNT(*) as cnt
        FROM public.bafitd_volunteers
        WHERE status != 'inactive'
        GROUP BY skill_category
        ORDER BY cnt DESC
      ) sub
    ),
    'by_city', (
      SELECT COALESCE(json_object_agg(city, cnt), '{}'::json)
      FROM (
        SELECT city, COUNT(*) as cnt
        FROM public.bafitd_volunteers
        WHERE status != 'inactive'
        GROUP BY city
        ORDER BY cnt DESC
        LIMIT 10
      ) sub
    ),
    'by_gender', (
      SELECT COALESCE(json_object_agg(COALESCE(gender, 'not_specified'), cnt), '{}'::json)
      FROM (
        SELECT gender, COUNT(*) as cnt
        FROM public.bafitd_volunteers
        WHERE status != 'inactive'
        GROUP BY gender
      ) sub
    ),
    'by_age_range', (
      SELECT COALESCE(json_object_agg(COALESCE(age_range, 'not_specified'), cnt), '{}'::json)
      FROM (
        SELECT age_range, COUNT(*) as cnt
        FROM public.bafitd_volunteers
        WHERE status != 'inactive'
        GROUP BY age_range
        ORDER BY age_range
      ) sub
    ),
    'diaspora_count', COUNT(*) FILTER (WHERE is_diaspora = true AND status != 'inactive'),
    'local_count', COUNT(*) FILTER (WHERE is_diaspora = false AND status != 'inactive'),
    'govt_funded_count', COUNT(*) FILTER (WHERE government_funded = true AND status != 'inactive'),
    'ready_now_count', COUNT(*) FILTER (WHERE start_availability = 'immediately' AND status != 'inactive')
  ) INTO result
  FROM public.bafitd_volunteers
  WHERE status != 'inactive';

  RETURN result;
END;
$$;

-- Allow anon and authenticated to call the stats RPC
GRANT EXECUTE ON FUNCTION public.get_bafitd_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.get_bafitd_stats() TO authenticated;

-- ============================================================================
-- TABLE & COLUMN COMMENTS (AI Knowledge Base Ready)
-- ============================================================================

COMMENT ON TABLE public.bafitd_volunteers IS
  'BaFitD (Batswana and Friends in the Diaspora) Registry — captures skilled Batswana who pledge pro bono services to their communities. Part of a civic initiative for those educated by the Botswana Government to give back.';

COMMENT ON COLUMN public.bafitd_volunteers.full_name IS 'Full legal name of the volunteer';
COMMENT ON COLUMN public.bafitd_volunteers.phone IS 'Primary phone number (Botswana +267 or international). Required as many elderly users do not have email.';
COMMENT ON COLUMN public.bafitd_volunteers.email IS 'Email address (optional — many elderly Batswana do not use email)';
COMMENT ON COLUMN public.bafitd_volunteers.gender IS 'Gender: male, female, or prefer_not_to_say';
COMMENT ON COLUMN public.bafitd_volunteers.age_range IS 'Age bracket: 18-24, 25-34, 35-44, 45-54, 55-64, or 65+';
COMMENT ON COLUMN public.bafitd_volunteers.languages_spoken IS 'Languages the volunteer speaks: english, setswana, kalanga, sekgalagadi, herero, sebirwa, other';
COMMENT ON COLUMN public.bafitd_volunteers.omang_number IS 'Botswana National ID (Omang) number. Optional, stored for future identity verification.';
COMMENT ON COLUMN public.bafitd_volunteers.preferred_contact IS 'How the volunteer prefers to be contacted: whatsapp, sms, phone_call, or email';

COMMENT ON COLUMN public.bafitd_volunteers.city IS 'City, town, or village where the volunteer resides';
COMMENT ON COLUMN public.bafitd_volunteers.district IS 'Botswana administrative district: Central, Chobe, Ghanzi, Kgalagadi, Kgatleng, Kweneng, North-East, North-West, South-East, or Southern';
COMMENT ON COLUMN public.bafitd_volunteers.is_diaspora IS 'Whether the volunteer lives outside Botswana (in the diaspora)';
COMMENT ON COLUMN public.bafitd_volunteers.country_of_residence IS 'Country where the volunteer currently lives. Defaults to Botswana.';
COMMENT ON COLUMN public.bafitd_volunteers.willing_to_travel_back IS 'For diaspora volunteers: whether they are willing to travel back to Botswana for in-person service';
COMMENT ON COLUMN public.bafitd_volunteers.preferred_service_district IS 'Which Botswana district the volunteer prefers to serve in (may differ from where they live)';

COMMENT ON COLUMN public.bafitd_volunteers.institution IS 'Educational institution attended (school, university, college)';
COMMENT ON COLUMN public.bafitd_volunteers.qualification IS 'Name of the qualification, e.g. Bachelor of Medicine, Diploma in IT';
COMMENT ON COLUMN public.bafitd_volunteers.qualification_level IS 'Level: certificate, diploma, degree, masters, doctorate, or other';
COMMENT ON COLUMN public.bafitd_volunteers.graduation_year IS 'Year of graduation (optional)';
COMMENT ON COLUMN public.bafitd_volunteers.government_funded IS 'Whether education was funded by the Botswana Government. Core to the BaFitD initiative.';

COMMENT ON COLUMN public.bafitd_volunteers.skill_category IS 'Primary skill area: healthcare, engineering, education, legal, agriculture, IT, finance, trades, social_work, or other';
COMMENT ON COLUMN public.bafitd_volunteers.skill_specialty IS 'Specific specialty within their category, e.g. Dentistry, Civil Engineering, Secondary Math Teacher';
COMMENT ON COLUMN public.bafitd_volunteers.specific_services IS 'Free-text description of specific services the volunteer can offer, e.g. "I can do dental checkups and extractions at my private clinic"';
COMMENT ON COLUMN public.bafitd_volunteers.years_of_experience IS 'Number of years of professional experience in their field';
COMMENT ON COLUMN public.bafitd_volunteers.current_employer IS 'Current employer name (optional)';
COMMENT ON COLUMN public.bafitd_volunteers.professional_license IS 'Professional license or registration number for regulated professions (doctors, lawyers, engineers)';
COMMENT ON COLUMN public.bafitd_volunteers.employer_support IS 'Whether employer supports the pro bono commitment: yes, not_yet, self_employed, retired, or not_asked';

COMMENT ON COLUMN public.bafitd_volunteers.availability_frequency IS 'How often the volunteer can provide pro bono service: weekly, biweekly, monthly, or flexible';
COMMENT ON COLUMN public.bafitd_volunteers.preferred_days IS 'Preferred days of the week for service: monday through sunday';
COMMENT ON COLUMN public.bafitd_volunteers.service_mode IS 'Service delivery mode: in_person, virtual, or both';
COMMENT ON COLUMN public.bafitd_volunteers.available_for_virtual IS 'Whether the volunteer can provide services virtually/remotely';
COMMENT ON COLUMN public.bafitd_volunteers.start_availability IS 'When the volunteer can start: immediately, within_1_month, within_3_months, or not_sure';

COMMENT ON COLUMN public.bafitd_volunteers.status IS 'Registration status: registered (new), active (confirmed), verified (identity checked), inactive (opted out)';
COMMENT ON COLUMN public.bafitd_volunteers.pledge_statement IS 'Optional personal pledge message from the volunteer about why they want to give back';
COMMENT ON COLUMN public.bafitd_volunteers.preferred_language IS 'Preferred language for communications: en (English) or tn (Setswana)';
COMMENT ON COLUMN public.bafitd_volunteers.referral_source IS 'How the volunteer heard about BaFitD: social_media, friend, news, employer, or other';
