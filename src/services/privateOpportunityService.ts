import { supabase } from '../lib/supabase';
import type {
  PrivateOpportunityApplicationFormData,
  PrivateOpportunityCreateResult,
  PrivateOpportunityFormData,
  PrivateOpportunityPreview,
} from '../types/privateOpportunity';

export async function createPrivateOpportunity(
  formData: PrivateOpportunityFormData
): Promise<PrivateOpportunityCreateResult> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.rpc('create_private_opportunity', {
    p_title: formData.title,
    p_organization: formData.organization,
    p_summary: formData.summary,
    p_location: formData.location,
    p_contact_email: formData.contact_email,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as PrivateOpportunityCreateResult;
}

export async function previewPrivateOpportunity(accessCode: string): Promise<PrivateOpportunityPreview> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase.rpc('preview_private_opportunity', {
    p_access_code: accessCode,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as PrivateOpportunityPreview;
}

export async function registerForPrivateOpportunity(
  formData: PrivateOpportunityApplicationFormData
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.rpc('register_for_private_opportunity', {
    p_access_code: formData.access_code,
    p_applicant_name: formData.applicant_name,
    p_applicant_email: formData.applicant_email,
    p_applicant_phone: formData.applicant_phone,
    p_motivation: formData.motivation,
  });

  if (error) {
    throw new Error(error.message);
  }
}
