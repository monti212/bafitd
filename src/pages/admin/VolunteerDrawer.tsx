import { useState } from 'react';
import { Volunteer, updateVolunteerStatus } from '../../services/adminService';

const STATUS_FLOW = ['registered', 'active', 'verified', 'inactive'];
const STATUS_COLORS: Record<string, string> = {
  registered: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  active:     'bg-teal-500/15 text-teal-400 border-teal-500/30',
  verified:   'bg-green-500/15 text-green-400 border-green-500/30',
  inactive:   'bg-gray-500/15 text-gray-400 border-gray-500/30',
};

interface Props {
  volunteer: Volunteer;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: string) => void;
}

export default function VolunteerDrawer({ volunteer: v, onClose, onStatusChange }: Props) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function handleStatusChange(status: string) {
    setUpdatingStatus(true);
    const ok = await updateVolunteerStatus(v.id, status);
    if (ok) onStatusChange(v.id, status);
    setUpdatingStatus(false);
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0a1e2e] border-l border-[#1a3a52] z-50 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-[#1a3a52] flex-shrink-0">
          <div>
            <h2 className="text-white font-semibold text-lg">{v.full_name}</h2>
            <p className="text-gray-400 text-sm mt-0.5">{v.skill_specialty} · {v.skill_category}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded transition-colors ml-4">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar */}
        <div className="px-6 py-4 border-b border-[#1a3a52] flex-shrink-0">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Status</p>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FLOW.map(s => (
              <button
                key={s}
                disabled={updatingStatus}
                onClick={() => v.status !== s && handleStatusChange(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all
                  ${v.status === s
                    ? STATUS_COLORS[s]
                    : 'bg-transparent text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300'
                  } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Freeform submission */}
          {v.input_mode === 'freeform' && v.freeform_text && (
            <Section title="Freeform Submission" highlight>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{v.freeform_text}</p>
            </Section>
          )}

          {/* Contact */}
          <Section title="Contact">
            <Grid>
              <Field label="Phone"   value={v.phone} />
              <Field label="Email"   value={v.email} />
              <Field label="Contact" value={v.preferred_contact} />
              <Field label="Language" value={v.preferred_language === 'en' ? 'English' : 'Setswana'} />
            </Grid>
            {v.languages_spoken && v.languages_spoken.length > 0 && (
              <div className="mt-3">
                <p className="text-gray-500 text-xs mb-1.5">Languages Spoken</p>
                <div className="flex flex-wrap gap-1.5">
                  {v.languages_spoken.map(l => (
                    <span key={l} className="px-2 py-0.5 rounded-full bg-[#1a3a52] text-gray-300 text-xs capitalize">{l}</span>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Location */}
          <Section title="Location">
            <Grid>
              <Field label="City"    value={v.city} />
              <Field label="District" value={v.district} />
              <Field label="Country" value={v.country_of_residence} />
              <Field label="Diaspora" value={v.is_diaspora ? 'Yes' : 'No'} />
              {v.is_diaspora && <Field label="Will Travel Back" value={v.willing_to_travel_back ? 'Yes' : 'No'} />}
              <Field label="Service District" value={v.preferred_service_district} />
            </Grid>
          </Section>

          {/* Education */}
          <Section title="Education">
            <Grid>
              <Field label="Institution"  value={v.institution} />
              <Field label="Qualification" value={v.qualification} />
              <Field label="Level"        value={v.qualification_level} />
              <Field label="Year"         value={v.graduation_year?.toString()} />
              <Field label="Govt Funded"  value={v.government_funded ? 'Yes' : 'No'} />
            </Grid>
          </Section>

          {/* Skills */}
          <Section title="Skills & Experience">
            <Grid>
              <Field label="Category"   value={v.skill_category} />
              <Field label="Specialty"  value={v.skill_specialty} />
              <Field label="Experience" value={v.years_of_experience ? `${v.years_of_experience} yrs` : undefined} />
              <Field label="Employer"   value={v.current_employer} />
              <Field label="License"    value={v.professional_license} />
              <Field label="Employer Support" value={v.employer_support} />
            </Grid>
            {v.specific_services && (
              <div className="mt-3">
                <p className="text-gray-500 text-xs mb-1">Specific Services</p>
                <p className="text-gray-300 text-sm">{v.specific_services}</p>
              </div>
            )}
          </Section>

          {/* Availability */}
          <Section title="Availability">
            <Grid>
              <Field label="Frequency"    value={v.availability_frequency} />
              <Field label="Service Mode" value={v.service_mode} />
              <Field label="Start"        value={v.start_availability} />
              <Field label="Virtual"      value={v.available_for_virtual ? 'Yes' : 'No'} />
            </Grid>
            {v.preferred_days && v.preferred_days.length > 0 && (
              <div className="mt-3">
                <p className="text-gray-500 text-xs mb-1.5">Preferred Days</p>
                <div className="flex flex-wrap gap-1.5">
                  {v.preferred_days.map(d => (
                    <span key={d} className="px-2 py-0.5 rounded-full bg-[#1a3a52] text-gray-300 text-xs capitalize">{d}</span>
                  ))}
                </div>
              </div>
            )}
          </Section>

          {/* Pledge */}
          {v.pledge_statement && (
            <Section title="Pledge Statement">
              <p className="text-gray-300 text-sm leading-relaxed italic">"{v.pledge_statement}"</p>
            </Section>
          )}

          {/* Meta */}
          <Section title="Meta">
            <Grid>
              <Field label="Submitted"    value={new Date(v.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} />
              <Field label="Input Mode"   value={v.input_mode} />
              <Field label="Referral"     value={v.referral_source} />
              <Field label="Gender"       value={v.gender} />
              <Field label="Age Range"    value={v.age_range} />
              <Field label="Omang"        value={v.omang_number} />
            </Grid>
          </Section>
        </div>
      </div>
    </>
  );
}

function Section({ title, children, highlight }: { title: string; children: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ${highlight ? 'bg-accent-orange/5 border border-accent-orange/20' : 'bg-[#020c14]'}`}>
      <p className={`text-xs font-medium uppercase tracking-wider mb-3 ${highlight ? 'text-accent-orange' : 'text-gray-500'}`}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-gray-500 text-[10px] uppercase tracking-wider">{label}</p>
      <p className="text-gray-200 text-sm mt-0.5 capitalize">{value}</p>
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
