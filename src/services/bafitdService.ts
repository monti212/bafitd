import { supabase } from '../lib/supabase';
import type { BaFitDFormData, BaFitDStats } from '../types/bafitd';

export const submitVolunteer = async (
  formData: BaFitDFormData
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Service unavailable. Please try again.' };
    }

    const payload = {
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      gender: formData.gender || null,
      age_range: formData.age_range || null,
      languages_spoken: formData.languages_spoken.length > 0 ? formData.languages_spoken : null,
      omang_number: formData.omang_number.trim() || null,
      passport_number: formData.passport_number.trim() || null,
      preferred_contact: formData.preferred_contact || 'whatsapp',
      city: formData.city.trim(),
      district: formData.district.trim() || null,
      is_diaspora: formData.is_diaspora ?? false,
      country_of_residence: formData.country_of_residence || 'Botswana',
      willing_to_travel_back: formData.is_diaspora ? formData.willing_to_travel_back : null,
      preferred_service_district: formData.preferred_service_district.trim() || null,
      institution: formData.institution.trim(),
      qualification: formData.qualification.trim(),
      qualification_level: formData.qualification_level,
      graduation_year: formData.graduation_year ? parseInt(formData.graduation_year, 10) : null,
      government_funded: formData.government_funded ?? false,
      skill_category: formData.skill_category,
      skill_specialty: formData.skill_specialty.trim(),
      specific_services: formData.specific_services.trim() || null,
      years_of_experience: parseInt(formData.years_of_experience, 10) || 0,
      current_employer: formData.current_employer.trim() || null,
      professional_license: formData.professional_license.trim() || null,
      employer_support: formData.employer_support || 'not_asked',
      availability_frequency: formData.availability_frequency || 'biweekly',
      preferred_days: formData.preferred_days.length > 0 ? formData.preferred_days : null,
      service_mode: formData.service_mode || 'both',
      available_for_virtual: formData.service_mode === 'virtual' || formData.service_mode === 'both',
      start_availability: formData.start_availability || 'immediately',
      status: 'registered',
      pledge_statement: formData.pledge_statement.trim() || null,
      preferred_language: formData.preferred_language,
      referral_source: formData.referral_source || null,
    };

    const { error } = await supabase
      .from('bafitd_volunteers')
      .insert(payload);

    if (error) {
      if (error.message?.includes('duplicate') || error.code === '23505') {
        return { success: false, error: 'duplicate' };
      }
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('[BaFitD] Volunteer registration error:', error);
    return { success: false, error: error.message || 'Registration failed. Please try again.' };
  }
};

export const submitFreeformVolunteer = async (
  data: { full_name: string; phone: string; email: string; freeform_text: string; preferred_language: 'en' | 'tn' }
): Promise<{ success: boolean; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Service unavailable. Please try again.' };
    }

    const payload = {
      full_name: data.full_name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim() || null,
      freeform_text: data.freeform_text.trim(),
      input_mode: 'freeform',
      preferred_language: data.preferred_language,
      city: 'Pending',
      institution: 'Pending',
      qualification: 'Pending',
      qualification_level: 'other',
      skill_category: 'other',
      skill_specialty: 'Pending',
      status: 'registered',
    };

    const { error } = await supabase
      .from('bafitd_volunteers')
      .insert(payload);

    if (error) {
      if (error.message?.includes('duplicate') || error.code === '23505') {
        return { success: false, error: 'duplicate' };
      }
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error: any) {
    console.error('[BaFitD] Freeform registration error:', error);
    return { success: false, error: error.message || 'Registration failed. Please try again.' };
  }
};

export const getBaFitDStats = async (): Promise<{ success: boolean; stats?: BaFitDStats; error?: string }> => {
  try {
    if (!supabase) {
      return { success: false, error: 'Service unavailable' };
    }

    const { data, error } = await supabase.rpc('get_bafitd_stats');

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, stats: data as BaFitDStats };
  } catch (error: any) {
    console.error('[BaFitD] Stats fetch error:', error);
    return { success: false, error: error.message };
  }
};
