export interface PrivateOpportunityFormData {
  title: string;
  organization: string;
  summary: string;
  location: string;
  contact_email: string;
}

export interface PrivateOpportunityCreateResult {
  id: string;
  access_code: string;
  title: string;
  created_at: string;
}

export interface PrivateOpportunityPreview {
  title: string;
  organization: string | null;
  summary: string;
  location: string | null;
}

export interface PrivateOpportunityApplicationFormData {
  access_code: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  motivation: string;
}

export const EMPTY_PRIVATE_OPPORTUNITY_FORM: PrivateOpportunityFormData = {
  title: '',
  organization: '',
  summary: '',
  location: '',
  contact_email: '',
};

export const EMPTY_PRIVATE_OPPORTUNITY_APPLICATION_FORM: PrivateOpportunityApplicationFormData = {
  access_code: '',
  applicant_name: '',
  applicant_email: '',
  applicant_phone: '',
  motivation: '',
};
