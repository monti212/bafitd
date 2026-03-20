/*
  # BaFitD Admin & Matching Infrastructure

  1. admin_users table — flexible admin email registry (replaces hardcoded @orionx.xyz check)
  2. volunteer_match_groups — stores AI/code-generated skill deployment groups
  3. volunteer_similarity_scores — pairwise similarity between volunteers
  4. Updated RLS policies — both admin emails can access volunteer data
  5. get_admin_stats() RPC — rich admin metrics
  6. compute_volunteer_similarities() RPC — Stage 1 code-based matching
*/

-- ============================================================================
-- TABLE: admin_users
-- Controls who can access the admin dashboard
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed both admin accounts
INSERT INTO public.admin_users (email, display_name) VALUES
  ('monti@orionx.xyz',          'Monti'),
  ('thabo.mathews@gmail.com',   'Thabo Mathews')
ON CONFLICT (email) DO NOTHING;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin list"
  ON public.admin_users FOR SELECT TO authenticated
  USING (auth.email() IN (SELECT email FROM public.admin_users));

-- ============================================================================
-- UPDATE RLS POLICIES on bafitd_volunteers
-- Now checks admin_users table instead of hardcoded @orionx.xyz
-- ============================================================================

DROP POLICY IF EXISTS "Admins can view all BaFitD volunteers"   ON public.bafitd_volunteers;
DROP POLICY IF EXISTS "Admins can update BaFitD volunteer status" ON public.bafitd_volunteers;

CREATE POLICY "Admins can view all BaFitD volunteers"
  ON public.bafitd_volunteers FOR SELECT TO authenticated
  USING (auth.email() IN (SELECT email FROM public.admin_users));

CREATE POLICY "Admins can update BaFitD volunteer status"
  ON public.bafitd_volunteers FOR UPDATE TO authenticated
  USING (auth.email() IN (SELECT email FROM public.admin_users));

-- ============================================================================
-- TABLE: volunteer_match_groups
-- Stores skill-matched deployment groups (output of Stage 1 + Stage 2 matching)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.volunteer_match_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  skill_theme TEXT,                        -- e.g. "Rural Healthcare Team – Kweneng"
  member_ids UUID[] NOT NULL DEFAULT '{}', -- references bafitd_volunteers.id
  match_score FLOAT DEFAULT 0,             -- 0–1 composite score
  match_method TEXT DEFAULT 'code',        -- code | ai | hybrid | manual
  deployment_recommendation TEXT,          -- AI-generated deployment plan
  status TEXT DEFAULT 'draft',             -- draft | reviewed | deployed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_match_groups_status     ON public.volunteer_match_groups (status);
CREATE INDEX idx_match_groups_method     ON public.volunteer_match_groups (match_method);
CREATE INDEX idx_match_groups_created_at ON public.volunteer_match_groups (created_at DESC);

ALTER TABLE public.volunteer_match_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage match groups"
  ON public.volunteer_match_groups FOR ALL TO authenticated
  USING (auth.email() IN (SELECT email FROM public.admin_users));

-- ============================================================================
-- TABLE: volunteer_similarity_scores
-- Pairwise similarity between volunteers (Stage 1 output, feeds Stage 2 AI)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.volunteer_similarity_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_a_id UUID NOT NULL REFERENCES public.bafitd_volunteers(id) ON DELETE CASCADE,
  volunteer_b_id UUID NOT NULL REFERENCES public.bafitd_volunteers(id) ON DELETE CASCADE,
  score FLOAT NOT NULL DEFAULT 0,          -- 0–1 composite similarity
  score_breakdown JSONB DEFAULT '{}',      -- {"category":0.4,"district":0.3,"days":0.2}
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT no_self_match CHECK (volunteer_a_id != volunteer_b_id),
  UNIQUE (volunteer_a_id, volunteer_b_id)
);

CREATE INDEX idx_similarity_score ON public.volunteer_similarity_scores (score DESC);
CREATE INDEX idx_similarity_a     ON public.volunteer_similarity_scores (volunteer_a_id);
CREATE INDEX idx_similarity_b     ON public.volunteer_similarity_scores (volunteer_b_id);

ALTER TABLE public.volunteer_similarity_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view similarity scores"
  ON public.volunteer_similarity_scores FOR ALL TO authenticated
  USING (auth.email() IN (SELECT email FROM public.admin_users));

-- ============================================================================
-- RPC: get_admin_stats() — rich metrics for admin dashboard
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Auth check
  IF auth.email() NOT IN (SELECT email FROM public.admin_users) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT json_build_object(
    -- Volume
    'total',            COUNT(*),
    'new_today',        COUNT(*) FILTER (WHERE created_at > now() - INTERVAL '1 day'),
    'new_this_week',    COUNT(*) FILTER (WHERE created_at > now() - INTERVAL '7 days'),
    'new_this_month',   COUNT(*) FILTER (WHERE created_at > now() - INTERVAL '30 days'),

    -- Status pipeline
    'registered',       COUNT(*) FILTER (WHERE status = 'registered'),
    'active',           COUNT(*) FILTER (WHERE status = 'active'),
    'verified',         COUNT(*) FILTER (WHERE status = 'verified'),
    'inactive',         COUNT(*) FILTER (WHERE status = 'inactive'),

    -- Submission type
    'freeform_pending', COUNT(*) FILTER (WHERE input_mode = 'freeform' AND status = 'registered'),
    'structured',       COUNT(*) FILTER (WHERE input_mode = 'form'),

    -- Reach
    'diaspora',         COUNT(*) FILTER (WHERE is_diaspora = true),
    'local',            COUNT(*) FILTER (WHERE is_diaspora = false),
    'govt_funded',      COUNT(*) FILTER (WHERE government_funded = true),
    'ready_now',        COUNT(*) FILTER (WHERE start_availability = 'immediately'),
    'virtual_ready',    COUNT(*) FILTER (WHERE available_for_virtual = true),

    -- Breakdowns
    'by_category', (
      SELECT COALESCE(json_object_agg(skill_category, cnt), '{}'::json)
      FROM (
        SELECT skill_category, COUNT(*) AS cnt
        FROM public.bafitd_volunteers
        GROUP BY skill_category ORDER BY cnt DESC
      ) s
    ),
    'by_district', (
      SELECT COALESCE(json_object_agg(COALESCE(district, 'Unknown'), cnt), '{}'::json)
      FROM (
        SELECT district, COUNT(*) AS cnt
        FROM public.bafitd_volunteers
        GROUP BY district ORDER BY cnt DESC
      ) s
    ),
    'by_gender', (
      SELECT COALESCE(json_object_agg(COALESCE(gender, 'not_specified'), cnt), '{}'::json)
      FROM (
        SELECT gender, COUNT(*) AS cnt
        FROM public.bafitd_volunteers
        GROUP BY gender
      ) s
    ),
    'by_age_range', (
      SELECT COALESCE(json_object_agg(COALESCE(age_range, 'not_specified'), cnt), '{}'::json)
      FROM (
        SELECT age_range, COUNT(*) AS cnt
        FROM public.bafitd_volunteers
        GROUP BY age_range ORDER BY age_range
      ) s
    ),

    -- Matching
    'match_groups',      (SELECT COUNT(*) FROM public.volunteer_match_groups),
    'groups_deployed',   (SELECT COUNT(*) FROM public.volunteer_match_groups WHERE status = 'deployed'),
    'similarity_pairs',  (SELECT COUNT(*) FROM public.volunteer_similarity_scores)
  ) INTO result
  FROM public.bafitd_volunteers;

  RETURN result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_stats() TO authenticated;

-- ============================================================================
-- RPC: compute_volunteer_similarities()
-- Stage 1 code-based matching — builds pairwise scores, clusters into groups
-- ============================================================================

CREATE OR REPLACE FUNCTION public.compute_volunteer_similarities()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_inserted INTEGER := 0;
  v_groups   INTEGER := 0;
BEGIN
  IF auth.email() NOT IN (SELECT email FROM public.admin_users) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Compute pairwise scores for all active volunteers
  INSERT INTO public.volunteer_similarity_scores (volunteer_a_id, volunteer_b_id, score, score_breakdown)
  SELECT
    a.id AS volunteer_a_id,
    b.id AS volunteer_b_id,
    -- Weighted similarity score (max 1.0)
    ROUND(CAST(
      -- Same skill category: 0.40
      CASE WHEN a.skill_category = b.skill_category THEN 0.40 ELSE 0 END
      -- Same preferred service district: 0.25
      + CASE WHEN a.preferred_service_district IS NOT NULL
              AND a.preferred_service_district = b.preferred_service_district THEN 0.25
             WHEN a.district IS NOT NULL AND a.district = b.district THEN 0.15
             ELSE 0 END
      -- Compatible service mode: 0.15
      + CASE WHEN a.service_mode = b.service_mode THEN 0.15
             WHEN a.service_mode = 'both' OR b.service_mode = 'both' THEN 0.08
             ELSE 0 END
      -- Both diaspora or both local: 0.10
      + CASE WHEN a.is_diaspora = b.is_diaspora THEN 0.10 ELSE 0 END
      -- Same availability frequency: 0.10
      + CASE WHEN a.availability_frequency = b.availability_frequency THEN 0.10 ELSE 0 END
    AS NUMERIC), 3)::FLOAT AS score,

    json_build_object(
      'category',     CASE WHEN a.skill_category = b.skill_category THEN 0.40 ELSE 0 END,
      'district',     CASE WHEN a.preferred_service_district IS NOT NULL AND a.preferred_service_district = b.preferred_service_district THEN 0.25
                          WHEN a.district IS NOT NULL AND a.district = b.district THEN 0.15 ELSE 0 END,
      'service_mode', CASE WHEN a.service_mode = b.service_mode THEN 0.15 WHEN a.service_mode = 'both' OR b.service_mode = 'both' THEN 0.08 ELSE 0 END,
      'diaspora',     CASE WHEN a.is_diaspora = b.is_diaspora THEN 0.10 ELSE 0 END,
      'frequency',    CASE WHEN a.availability_frequency = b.availability_frequency THEN 0.10 ELSE 0 END
    ) AS score_breakdown

  FROM public.bafitd_volunteers a
  JOIN public.bafitd_volunteers b ON a.id < b.id -- avoid duplicates
  WHERE a.status != 'inactive' AND b.status != 'inactive'
  ON CONFLICT (volunteer_a_id, volunteer_b_id) DO UPDATE
    SET score           = EXCLUDED.score,
        score_breakdown = EXCLUDED.score_breakdown,
        computed_at     = now();

  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  -- Auto-cluster: create draft groups for clusters of 3+ volunteers scoring ≥ 0.65
  -- Group by skill_category + district combinations with enough members
  INSERT INTO public.volunteer_match_groups (name, skill_theme, member_ids, match_score, match_method, status)
  SELECT
    initcap(skill_category) || ' Team — ' || COALESCE(preferred_service_district, district, 'Botswana') AS name,
    initcap(skill_category) || ' | ' || COALESCE(preferred_service_district, district, 'National') AS skill_theme,
    array_agg(id) AS member_ids,
    ROUND(CAST(0.70 AS NUMERIC), 2)::FLOAT AS match_score,
    'code' AS match_method,
    'draft' AS status
  FROM public.bafitd_volunteers
  WHERE status != 'inactive'
  GROUP BY skill_category, preferred_service_district, district
  HAVING COUNT(*) >= 2
  ON CONFLICT DO NOTHING;

  GET DIAGNOSTICS v_groups = ROW_COUNT;

  RETURN json_build_object(
    'pairs_computed', v_inserted,
    'groups_created', v_groups,
    'computed_at',    now()
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.compute_volunteer_similarities() TO authenticated;
