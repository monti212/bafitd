import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, KeyRound, MapPin, Send, Shield, UserPlus } from 'lucide-react';
import {
  EMPTY_PRIVATE_OPPORTUNITY_APPLICATION_FORM,
  type PrivateOpportunityApplicationFormData,
  type PrivateOpportunityPreview,
} from '../types/privateOpportunity';
import {
  previewPrivateOpportunity,
  registerForPrivateOpportunity,
} from '../services/privateOpportunityService';

const fieldClass =
  'w-full min-h-[52px] rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-deep-navy outline-none transition focus:border-teal focus:ring-4 focus:ring-teal/10';

function InputField({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-deep-navy">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${fieldClass} min-h-[128px] resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          className={fieldClass}
        />
      )}
    </label>
  );
}

export default function PrivateOpportunityApplyPage() {
  const [searchParams] = useSearchParams();
  const [preview, setPreview] = useState<PrivateOpportunityPreview | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [formData, setFormData] = useState<PrivateOpportunityApplicationFormData>({
    ...EMPTY_PRIVATE_OPPORTUNITY_APPLICATION_FORM,
    access_code: searchParams.get('code')?.toUpperCase() ?? '',
  });

  function updateField<K extends keyof PrivateOpportunityApplicationFormData>(
    key: K,
    value: PrivateOpportunityApplicationFormData[K]
  ) {
    setFormData(current => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleLoadOpportunity() {
    setLoadingPreview(true);
    setError(null);
    setNotice(null);

    try {
      const nextPreview = await previewPrivateOpportunity(formData.access_code);
      setPreview(nextPreview);
    } catch (loadError) {
      setPreview(null);
      setError(loadError instanceof Error ? loadError.message : 'Unable to load this opportunity.');
    } finally {
      setLoadingPreview(false);
    }
  }

  async function handleApply() {
    setSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      await registerForPrivateOpportunity(formData);
      setNotice('Your registration was submitted privately.');
      setFormData(current => ({
        ...EMPTY_PRIVATE_OPPORTUNITY_APPLICATION_FORM,
        access_code: current.access_code,
      }));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to submit your registration.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dff7f3_0%,#f7f5f2_45%,#fff8ef_100%)] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-deep-navy/45">Private Registration</p>
            <h1 className="font-headline text-4xl font-bold text-deep-navy">Register for an opportunity</h1>
          </div>
          <Link
            to="/"
            className="rounded-xl border border-teal/15 bg-white px-4 py-2 text-sm font-semibold text-deep-navy transition hover:border-teal/35 hover:bg-sand-100"
          >
            Home
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <section className="rounded-[2rem] border border-teal/15 bg-[#05273a] p-6 text-white shadow-[0_24px_80px_rgba(0,47,75,0.16)] sm:p-8">
            <div className="flex items-center gap-2 text-sm font-semibold text-white/82">
              <Shield className="h-4 w-4 text-teal-300" />
              Private by design
            </div>
            <h2 className="mt-4 font-headline text-3xl font-bold">Use an access code to enter</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              This page does not expose a public directory of opportunities. You need a shared access code from the opportunity creator.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white">Access code</span>
                <div className="flex min-h-[52px] items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4">
                  <KeyRound className="h-4 w-4 text-teal-300" />
                  <input
                    type="text"
                    value={formData.access_code}
                    onChange={event => updateField('access_code', event.target.value.toUpperCase())}
                    placeholder="Paste the code you received"
                    className="w-full bg-transparent py-4 text-sm uppercase tracking-[0.2em] text-white outline-none placeholder:text-white/35"
                  />
                </div>
              </label>

              <button
                type="button"
                onClick={handleLoadOpportunity}
                disabled={loadingPreview || !formData.access_code.trim()}
                className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loadingPreview ? 'Loading...' : 'Load opportunity'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="rounded-[2rem] border border-teal/15 bg-white/88 p-6 shadow-[0_18px_60px_rgba(0,47,75,0.08)] backdrop-blur-xl sm:p-8">
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

            {preview ? (
              <>
                <div className="mb-6 rounded-[1.5rem] border border-teal/10 bg-sand-50 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-deep-navy/40">Opportunity</p>
                  <h2 className="mt-2 font-headline text-3xl font-bold text-deep-navy">{preview.title}</h2>
                  {preview.organization && (
                    <p className="mt-2 text-sm font-medium text-deep-navy/65">{preview.organization}</p>
                  )}
                  <p className="mt-4 text-sm leading-7 text-deep-navy/75">{preview.summary}</p>
                  {preview.location && (
                    <p className="mt-4 inline-flex items-center gap-2 text-sm text-deep-navy/60">
                      <MapPin className="h-4 w-4 text-teal" />
                      {preview.location}
                    </p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="mb-1">
                    <h3 className="text-lg font-semibold text-deep-navy">Your registration</h3>
                    <p className="text-sm text-deep-navy/55">This submission is private. It is not visible to the public or the opportunity creator.</p>
                  </div>

                  <InputField label="Your name" value={formData.applicant_name} onChange={value => updateField('applicant_name', value)} placeholder="Full name" />
                  <InputField label="Your email" value={formData.applicant_email} onChange={value => updateField('applicant_email', value)} placeholder="you@example.com" type="email" />
                  <InputField label="Phone number" value={formData.applicant_phone} onChange={value => updateField('applicant_phone', value)} placeholder="+267..." />
                  <InputField label="Why are you registering?" value={formData.motivation} onChange={value => updateField('motivation', value)} placeholder="A short introduction or note." textarea />

                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={submitting || !formData.applicant_name.trim() || !formData.applicant_email.trim()}
                    className="inline-flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl btn-gradient px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? 'Submitting...' : 'Submit private registration'}
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-teal/20 bg-sand-50 px-6 text-center">
                <UserPlus className="h-10 w-10 text-teal/70" />
                <h2 className="mt-4 font-headline text-3xl font-bold text-deep-navy">Start with a code</h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-deep-navy/60">
                  Once you load a valid access code, the opportunity details and private registration form will appear here.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
