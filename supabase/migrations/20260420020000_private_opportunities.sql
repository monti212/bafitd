/*
  # Private opportunities

  Privacy-first opportunity registration:
  1. Authenticated members can create an opportunity
  2. The app returns a one-time access code to share
  3. Anyone with the code can register for the opportunity
  4. No member, including the creator, can later browse records directly
*/

CREATE TABLE IF NOT EXISTS public.private_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  organization TEXT,
  summary TEXT NOT NULL,
  location TEXT,
  contact_email TEXT,
  access_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.private_opportunity_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.private_opportunities(id) ON DELETE CASCADE,
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  motivation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_private_opportunities_status ON public.private_opportunities (status);
CREATE INDEX IF NOT EXISTS idx_private_opportunities_created_at ON public.private_opportunities (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_private_registrations_opportunity_id ON public.private_opportunity_registrations (opportunity_id);
CREATE INDEX IF NOT EXISTS idx_private_registrations_created_at ON public.private_opportunity_registrations (created_at DESC);

ALTER TABLE public.private_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_opportunity_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view private opportunities" ON public.private_opportunities;
CREATE POLICY "Admins can view private opportunities"
  ON public.private_opportunities
  FOR SELECT
  TO authenticated
  USING (auth.email() IN (SELECT email FROM public.admin_users));

DROP POLICY IF EXISTS "Admins can view private registrations" ON public.private_opportunity_registrations;
CREATE POLICY "Admins can view private registrations"
  ON public.private_opportunity_registrations
  FOR SELECT
  TO authenticated
  USING (auth.email() IN (SELECT email FROM public.admin_users));

CREATE OR REPLACE FUNCTION public.generate_private_access_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  candidate TEXT;
BEGIN
  LOOP
    candidate := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
    EXIT WHEN NOT EXISTS (
      SELECT 1
      FROM public.private_opportunities
      WHERE access_code = candidate
    );
  END LOOP;

  RETURN candidate;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_private_opportunity(
  p_title TEXT,
  p_organization TEXT,
  p_summary TEXT,
  p_location TEXT,
  p_contact_email TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_row public.private_opportunities;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  INSERT INTO public.private_opportunities (
    created_by,
    title,
    organization,
    summary,
    location,
    contact_email,
    access_code
  )
  VALUES (
    auth.uid(),
    trim(p_title),
    NULLIF(trim(COALESCE(p_organization, '')), ''),
    trim(p_summary),
    NULLIF(trim(COALESCE(p_location, '')), ''),
    NULLIF(trim(COALESCE(p_contact_email, '')), ''),
    public.generate_private_access_code()
  )
  RETURNING * INTO new_row;

  RETURN json_build_object(
    'id', new_row.id,
    'access_code', new_row.access_code,
    'title', new_row.title,
    'created_at', new_row.created_at
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.preview_private_opportunity(
  p_access_code TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_row public.private_opportunities;
BEGIN
  SELECT *
  INTO matched_row
  FROM public.private_opportunities
  WHERE access_code = upper(trim(p_access_code))
    AND status = 'open'
  LIMIT 1;

  IF matched_row.id IS NULL THEN
    RAISE EXCEPTION 'Opportunity not found';
  END IF;

  RETURN json_build_object(
    'title', matched_row.title,
    'organization', matched_row.organization,
    'summary', matched_row.summary,
    'location', matched_row.location
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.register_for_private_opportunity(
  p_access_code TEXT,
  p_applicant_name TEXT,
  p_applicant_email TEXT,
  p_applicant_phone TEXT,
  p_motivation TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  matched_id UUID;
  new_registration public.private_opportunity_registrations;
BEGIN
  SELECT id
  INTO matched_id
  FROM public.private_opportunities
  WHERE access_code = upper(trim(p_access_code))
    AND status = 'open'
  LIMIT 1;

  IF matched_id IS NULL THEN
    RAISE EXCEPTION 'Opportunity not found';
  END IF;

  INSERT INTO public.private_opportunity_registrations (
    opportunity_id,
    applicant_name,
    applicant_email,
    applicant_phone,
    motivation
  )
  VALUES (
    matched_id,
    trim(p_applicant_name),
    lower(trim(p_applicant_email)),
    NULLIF(trim(COALESCE(p_applicant_phone, '')), ''),
    NULLIF(trim(COALESCE(p_motivation, '')), '')
  )
  RETURNING * INTO new_registration;

  RETURN json_build_object(
    'registration_id', new_registration.id,
    'created_at', new_registration.created_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_private_opportunity(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.preview_private_opportunity(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.preview_private_opportunity(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_for_private_opportunity(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.register_for_private_opportunity(TEXT, TEXT, TEXT, TEXT, TEXT) TO authenticated;

COMMENT ON TABLE public.private_opportunities IS
  'Private opportunities submitted by members. Records are intentionally not visible to normal users after creation.';

COMMENT ON TABLE public.private_opportunity_registrations IS
  'Private registrations for private opportunities. Records are not visible to normal users, including the opportunity creator.';
