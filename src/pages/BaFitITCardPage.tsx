import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Globe2, KeyRound, LogOut, Mail, MapPin, PencilLine, Phone, Save, Send, Sparkles, UserRound } from 'lucide-react';
import { useUserAuth } from '../contexts/UserAuthContext';
import { getMyProfile, saveMyProfile } from '../services/userProfileService';
import { EMPTY_USER_PROFILE_FORM, profileToFormData, type UserProfile, type UserProfileFormData } from '../types/userProfile';
import { createPrivateOpportunity } from '../services/privateOpportunityService';
import {
  EMPTY_PRIVATE_OPPORTUNITY_FORM,
  type PrivateOpportunityCreateResult,
  type PrivateOpportunityFormData,
} from '../types/privateOpportunity';

const fieldClass =
  'w-full min-h-[52px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-deep-navy outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10';
const textAreaClass = `${fieldClass} min-h-[128px] resize-none`;

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#d7ece8] bg-white/85 px-4 py-4">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-deep-navy/45">
        <span className="text-teal">{icon}</span>
        {label}
      </div>
      <p className="text-sm leading-6 text-deep-navy/80">{value}</p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  type = 'text',
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-deep-navy">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${textAreaClass} ${disabled ? 'cursor-default bg-sand-50 text-deep-navy/70' : ''}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${fieldClass} ${disabled ? 'cursor-default bg-sand-50 text-deep-navy/70' : ''}`}
        />
      )}
    </label>
  );
}

export default function BaFitITCardPage() {
  const { user, signOut } = useUserAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfileFormData>(EMPTY_USER_PROFILE_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [opportunityForm, setOpportunityForm] = useState<PrivateOpportunityFormData>(EMPTY_PRIVATE_OPPORTUNITY_FORM);
  const [opportunitySubmitting, setOpportunitySubmitting] = useState(false);
  const [opportunityError, setOpportunityError] = useState<string | null>(null);
  const [createdOpportunity, setCreatedOpportunity] = useState<PrivateOpportunityCreateResult | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      if (!user) return;
      setLoading(true);
      setError(null);

      try {
        const nextProfile = await getMyProfile(user);
        if (!active) return;
        setProfile(nextProfile);
        setFormData(profileToFormData(nextProfile));
      } catch (nextError) {
        if (!active) return;
        setError(nextError instanceof Error ? nextError.message : 'Unable to load your profile.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [user]);

  const displayName = useMemo(() => {
    return profile?.preferred_name || profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Member';
  }, [profile, user]);

  const identitySummary = useMemo(() => {
    const values = [profile?.city, profile?.country].filter(Boolean);
    return values.length > 0 ? values.join(', ') : 'Add your location';
  }, [profile]);

  function updateField<K extends keyof UserProfileFormData>(key: K, value: UserProfileFormData[K]) {
    setFormData(current => ({
      ...current,
      [key]: value,
    }));
  }

  function updateOpportunityField<K extends keyof PrivateOpportunityFormData>(
    key: K,
    value: PrivateOpportunityFormData[K]
  ) {
    setOpportunityForm(current => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);
    setNotice(null);

    try {
      const savedProfile = await saveMyProfile(user, formData);
      setProfile(savedProfile);
      setFormData(profileToFormData(savedProfile));
      setIsEditing(false);
      setNotice('Your BaFitIT Card has been updated.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save your profile.');
    } finally {
      setSaving(false);
    }
  }

  async function handleOpportunitySubmit() {
    setOpportunitySubmitting(true);
    setOpportunityError(null);
    setCreatedOpportunity(null);

    try {
      const result = await createPrivateOpportunity(opportunityForm);
      setCreatedOpportunity(result);
      setOpportunityForm(EMPTY_PRIVATE_OPPORTUNITY_FORM);
    } catch (submitError) {
      setOpportunityError(submitError instanceof Error ? submitError.message : 'Unable to create the opportunity.');
    } finally {
      setOpportunitySubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eef9f6_0%,#f7f5f2_46%,#fffdf9_100%)]">
      <header className="sticky top-0 z-30 border-b border-teal/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-deep-navy/45">Member Profile</p>
            <h1 className="font-headline text-2xl font-bold text-deep-navy sm:text-3xl">BaFitIT Card</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-xl border border-teal/15 bg-white px-4 py-2 text-sm font-semibold text-deep-navy transition hover:border-teal/35 hover:bg-sand-100"
            >
              Home
            </Link>
            <button
              type="button"
              onClick={() => signOut()}
              className="inline-flex items-center gap-2 rounded-xl border border-teal/15 bg-white px-4 py-2 text-sm font-semibold text-deep-navy transition hover:border-teal/35 hover:bg-sand-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[2rem] border border-teal/15 bg-[#05273a] text-white shadow-[0_24px_80px_rgba(0,47,75,0.16)]">
            <div className="bg-[radial-gradient(circle_at_top_right,rgba(0,150,179,0.35),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,106,0,0.24),transparent_25%)] px-6 py-8 sm:px-8 sm:py-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/75">
                    <Sparkles className="h-3.5 w-3.5" />
                    Custom Profile
                  </p>
                  <h2 className="font-headline text-4xl font-bold leading-tight sm:text-5xl">
                    {displayName}
                  </h2>
                  <p className="mt-3 max-w-2xl text-lg text-white/75">
                    {profile?.professional_title || 'Add your professional title to introduce yourself clearly.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(current => !current);
                    setNotice(null);
                    setError(null);
                    if (isEditing) {
                      setFormData(profileToFormData(profile));
                    }
                  }}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  <PencilLine className="h-4 w-4" />
                  {isEditing ? 'Cancel editing' : 'Edit card'}
                </button>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <DetailItem icon={<Mail className="h-4 w-4" />} label="Email" value={profile?.email || user?.email || 'Add your email'} />
                <DetailItem icon={<MapPin className="h-4 w-4" />} label="Location" value={identitySummary} />
                <DetailItem icon={<Phone className="h-4 w-4" />} label="Phone" value={profile?.phone || 'Add your phone number'} />
                <DetailItem icon={<BriefcaseBusiness className="h-4 w-4" />} label="Organization" value={profile?.organization || 'Add your organization'} />
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-teal/15 bg-white/80 p-6 shadow-[0_18px_60px_rgba(0,47,75,0.08)] backdrop-blur-xl sm:p-8">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.24em] text-deep-navy/40">Snapshot</p>
              <h3 className="mt-2 font-headline text-3xl font-bold text-deep-navy">What this card holds</h3>
            </div>

            <div className="space-y-4">
              <DetailItem
                icon={<UserRound className="h-4 w-4" />}
                label="Personal"
                value={profile?.bio || 'Use this space for a short summary about who you are, what matters to you, and how people should understand your journey.'}
              />
              <DetailItem
                icon={<BriefcaseBusiness className="h-4 w-4" />}
                label="Professional"
                value={profile?.areas_of_expertise || 'Add your specialties, services, and the strongest parts of your professional background.'}
              />
              <DetailItem
                icon={<Globe2 className="h-4 w-4" />}
                label="Skills"
                value={profile?.skills.length ? profile.skills.join(', ') : 'Add your core skills as a comma-separated list.'}
              />
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-teal/15 bg-white/88 p-6 shadow-[0_18px_60px_rgba(0,47,75,0.08)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-deep-navy/40">Editable Fields</p>
              <h2 className="mt-2 font-headline text-3xl font-bold text-deep-navy">Personal and professional information</h2>
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex min-h-[52px] items-center gap-2 rounded-2xl btn-gradient px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save card'}
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {notice && (
            <div className="mb-4 rounded-2xl border border-teal/20 bg-teal/5 px-4 py-3 text-sm text-teal-900">
              {notice}
            </div>
          )}

          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal border-t-transparent" />
            </div>
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="mb-1">
                  <h3 className="text-lg font-semibold text-deep-navy">Personal</h3>
                  <p className="text-sm text-deep-navy/55">Identity, location, and contact details.</p>
                </div>

                <InputField label="Full name" value={formData.full_name} onChange={value => updateField('full_name', value)} placeholder="Your full name" disabled={!isEditing} />
                <InputField label="Preferred name" value={formData.preferred_name} onChange={value => updateField('preferred_name', value)} placeholder="What should we call you?" disabled={!isEditing} />
                <InputField label="Phone" value={formData.phone} onChange={value => updateField('phone', value)} placeholder="+267..." disabled={!isEditing} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Country" value={formData.country} onChange={value => updateField('country', value)} placeholder="Botswana" disabled={!isEditing} />
                  <InputField label="City" value={formData.city} onChange={value => updateField('city', value)} placeholder="Gaborone" disabled={!isEditing} />
                </div>
                <InputField
                  label="Short bio"
                  value={formData.bio}
                  onChange={value => updateField('bio', value)}
                  placeholder="A concise introduction to who you are."
                  textarea
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-4">
                <div className="mb-1">
                  <h3 className="text-lg font-semibold text-deep-navy">Professional</h3>
                  <p className="text-sm text-deep-navy/55">Work identity, expertise, and profile links.</p>
                </div>

                <InputField label="Professional title" value={formData.professional_title} onChange={value => updateField('professional_title', value)} placeholder="Product Designer, Accountant, Software Engineer" disabled={!isEditing} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="Organization" value={formData.organization} onChange={value => updateField('organization', value)} placeholder="Current company or practice" disabled={!isEditing} />
                  <InputField label="Industry" value={formData.industry} onChange={value => updateField('industry', value)} placeholder="Health, Technology, Finance..." disabled={!isEditing} />
                </div>
                <InputField label="Years of experience" value={formData.years_of_experience} onChange={value => updateField('years_of_experience', value)} placeholder="8" type="number" disabled={!isEditing} />
                <InputField
                  label="Areas of expertise"
                  value={formData.areas_of_expertise}
                  onChange={value => updateField('areas_of_expertise', value)}
                  placeholder="Clinical operations, data analysis, civil engineering..."
                  textarea
                  disabled={!isEditing}
                />
                <InputField label="Skills" value={formData.skills} onChange={value => updateField('skills', value)} placeholder="Leadership, React, Financial modelling" disabled={!isEditing} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField label="LinkedIn URL" value={formData.linkedin_url} onChange={value => updateField('linkedin_url', value)} placeholder="https://linkedin.com/in/..." type="url" disabled={!isEditing} />
                  <InputField label="Portfolio URL" value={formData.portfolio_url} onChange={value => updateField('portfolio_url', value)} placeholder="https://your-site.com" type="url" disabled={!isEditing} />
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[2rem] border border-teal/15 bg-white/88 p-6 shadow-[0_18px_60px_rgba(0,47,75,0.08)] backdrop-blur-xl sm:p-8">
          <div className="mb-6">
            <p className="text-xs uppercase tracking-[0.24em] text-deep-navy/40">Private Opportunity</p>
            <h2 className="mt-2 font-headline text-3xl font-bold text-deep-navy">Register an opportunity privately</h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-deep-navy/60">
              Submit an opportunity that other people can register for using a private access code. The opportunity and all registrations stay hidden from normal users, including the account that created it.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-4">
              {opportunityError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {opportunityError}
                </div>
              )}

              <InputField
                label="Opportunity title"
                value={opportunityForm.title}
                onChange={value => updateOpportunityField('title', value)}
                placeholder="Software internship, grant opportunity, mentorship cohort..."
              />
              <InputField
                label="Organization"
                value={opportunityForm.organization}
                onChange={value => updateOpportunityField('organization', value)}
                placeholder="Company, initiative, or institution"
              />
              <InputField
                label="Location"
                value={opportunityForm.location}
                onChange={value => updateOpportunityField('location', value)}
                placeholder="Gaborone, Remote, Johannesburg..."
              />
              <InputField
                label="Contact email"
                value={opportunityForm.contact_email}
                onChange={value => updateOpportunityField('contact_email', value)}
                placeholder="contact@example.com"
                type="email"
              />
              <InputField
                label="Summary"
                value={opportunityForm.summary}
                onChange={value => updateOpportunityField('summary', value)}
                placeholder="Describe the opportunity, who it is for, and anything a person should know before registering."
                textarea
              />

              <button
                type="button"
                onClick={handleOpportunitySubmit}
                disabled={opportunitySubmitting || !opportunityForm.title.trim() || !opportunityForm.summary.trim()}
                className="inline-flex min-h-[56px] items-center gap-2 rounded-2xl btn-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {opportunitySubmitting ? 'Registering...' : 'Register private opportunity'}
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-[1.75rem] border border-teal/10 bg-sand-50 p-5 sm:p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-deep-navy/40">How privacy works</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-deep-navy/65">
                <p>Only a one-time access code is returned after creation.</p>
                <p>The app does not provide a member-facing list of submitted opportunities.</p>
                <p>The creator cannot come back later and browse registrations from their account.</p>
                <p>People can register only if they already have the access code.</p>
              </div>

              {createdOpportunity ? (
                <div className="mt-6 rounded-[1.5rem] border border-teal/20 bg-white p-5 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.24em] text-deep-navy/40">One-time access code</p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-[#05273a] px-4 py-3 font-mono text-lg font-semibold tracking-[0.18em] text-white">
                    <KeyRound className="h-4 w-4 text-teal-300" />
                    {createdOpportunity.access_code}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-deep-navy/65">
                    Save or share this code now. The member area does not list private opportunities later, including for the account that created this one.
                  </p>
                  <Link
                    to={`/opportunities/apply?code=${createdOpportunity.access_code}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal transition hover:text-teal-700"
                  >
                    Open the registration page with this code
                  </Link>
                </div>
              ) : (
                <div className="mt-6 rounded-[1.5rem] border border-dashed border-teal/20 bg-white/80 p-5 text-sm leading-7 text-deep-navy/55">
                  After you submit, the one-time access code will appear here.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
