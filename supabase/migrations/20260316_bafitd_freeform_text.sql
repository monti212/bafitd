-- Add freeform_text column for essay-style registration submissions
ALTER TABLE public.bafitd_volunteers
  ADD COLUMN IF NOT EXISTS freeform_text TEXT,
  ADD COLUMN IF NOT EXISTS input_mode TEXT NOT NULL DEFAULT 'form';

COMMENT ON COLUMN public.bafitd_volunteers.freeform_text IS 'Free-form essay text submitted by volunteers who prefer to write about themselves rather than fill out the structured form. Admin team reviews and may extract structured data later.';
COMMENT ON COLUMN public.bafitd_volunteers.input_mode IS 'How the volunteer submitted: form (structured wizard) or freeform (essay text box)';
