import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getVolunteers, Volunteer, VolunteerFilters } from '../../services/adminService';
import VolunteerDrawer from './VolunteerDrawer';

const STATUS_OPTIONS   = ['', 'registered', 'active', 'verified', 'inactive'];
const CATEGORY_OPTIONS = ['', 'healthcare', 'engineering', 'education', 'legal', 'agriculture', 'IT', 'finance', 'trades', 'social_work', 'other'];
const MODE_OPTIONS     = ['', 'form', 'freeform'];

const STATUS_BADGE: Record<string, string> = {
  registered: 'bg-blue-500/15 text-blue-400',
  active:     'bg-teal-500/15 text-teal-400',
  verified:   'bg-green-500/15 text-green-400',
  inactive:   'bg-gray-500/15 text-gray-400',
};

const PAGE_SIZE = 50;

export default function AdminVolunteers() {
  const [searchParams] = useSearchParams();
  const [volunteers, setVolunteers]     = useState<Volunteer[]>([]);
  const [totalCount, setTotalCount]     = useState(0);
  const [page, setPage]                 = useState(0);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState<Volunteer | null>(null);

  // Filters
  const [search, setSearch]             = useState('');
  const [status, setStatus]             = useState('');
  const [category, setCategory]         = useState('');
  const [inputMode, setInputMode]       = useState(searchParams.get('mode') === 'freeform' ? 'freeform' : '');
  const [diaspora, setDiaspora]         = useState('');

  const fetchData = useCallback(async (p = 0) => {
    setLoading(true);
    const filters: VolunteerFilters = {
      search:         search || undefined,
      status:         status || undefined,
      skill_category: category || undefined,
      input_mode:     inputMode || undefined,
      is_diaspora:    diaspora === 'yes' ? true : diaspora === 'no' ? false : null,
    };
    const result = await getVolunteers(p, PAGE_SIZE, filters);
    setVolunteers(result.data);
    setTotalCount(result.count);
    setPage(p);
    setLoading(false);
  }, [search, status, category, inputMode, diaspora]);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(0), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchData, search]);

  function handleStatusChange(id: string, newStatus: string) {
    setVolunteers(prev => prev.map(v => v.id === id ? { ...v, status: newStatus } : v));
    if (selected?.id === id) setSelected(s => s ? { ...s, status: newStatus } : s);
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-semibold">Volunteers</h1>
          <p className="text-gray-400 text-sm mt-1">
            {totalCount.toLocaleString()} total registration{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search name, email, phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0a1e2e] border border-[#1a3a52] rounded-lg pl-9 pr-4 py-2.5
                       text-white placeholder-gray-600 text-sm focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>

        <Select value={status}    onChange={setStatus}    options={STATUS_OPTIONS}   placeholder="All Statuses" />
        <Select value={category}  onChange={setCategory}  options={CATEGORY_OPTIONS} placeholder="All Categories" />
        <Select value={inputMode} onChange={setInputMode} options={MODE_OPTIONS}     placeholder="All Modes" />
        <Select value={diaspora}  onChange={setDiaspora}
          options={['', 'yes', 'no']} placeholder="Local / Diaspora"
          labels={{ '': 'Local / Diaspora', yes: 'Diaspora', no: 'Local' }} />
      </div>

      {/* Table */}
      <div className="bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading…</div>
        ) : volunteers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No volunteers match your filters.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a3a52]">
                <Th>Name</Th>
                <Th>Category</Th>
                <Th>Location</Th>
                <Th>Mode</Th>
                <Th>Status</Th>
                <Th>Registered</Th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map(v => (
                <tr
                  key={v.id}
                  onClick={() => setSelected(v)}
                  className="border-b border-[#1a3a52]/50 hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="text-white font-medium">{v.full_name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{v.phone}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-gray-300 capitalize">{v.skill_category}</p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate max-w-32">{v.skill_specialty}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-gray-300">{v.city}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {v.is_diaspora ? `Diaspora · ${v.country_of_residence}` : v.district ?? 'Botswana'}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    {v.input_mode === 'freeform' ? (
                      <span className="px-2 py-0.5 rounded-full bg-accent-orange/15 text-accent-orange text-xs">Essay</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-[#1a3a52] text-gray-400 text-xs">Form</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[v.status] ?? 'bg-gray-500/15 text-gray-400'}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(v.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-500 text-sm">
            Page {page + 1} of {totalPages} · {totalCount.toLocaleString()} results
          </p>
          <div className="flex gap-2">
            <PagBtn onClick={() => fetchData(page - 1)} disabled={page === 0}>Previous</PagBtn>
            <PagBtn onClick={() => fetchData(page + 1)} disabled={page >= totalPages - 1}>Next</PagBtn>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {selected && (
        <VolunteerDrawer
          volunteer={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-left text-gray-500 text-xs uppercase tracking-wider font-medium">
      {children}
    </th>
  );
}

function Select({
  value, onChange, options, placeholder, labels
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  labels?: Record<string, string>;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="bg-[#0a1e2e] border border-[#1a3a52] rounded-lg px-3 py-2.5 text-sm
                 text-white focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
    >
      {options.map(o => (
        <option key={o} value={o}>
          {labels ? labels[o] ?? (o || placeholder) : (o || placeholder)}
        </option>
      ))}
    </select>
  );
}

function PagBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 text-sm bg-[#0a1e2e] border border-[#1a3a52] rounded-lg
                 text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-40
                 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
    </svg>
  );
}
