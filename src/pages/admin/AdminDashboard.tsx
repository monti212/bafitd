import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats, AdminStats } from '../../services/adminService';

const CATEGORY_LABELS: Record<string, string> = {
  healthcare: 'Healthcare', engineering: 'Engineering', education: 'Education',
  legal: 'Legal', agriculture: 'Agriculture', IT: 'Information Technology',
  finance: 'Finance', trades: 'Trades', social_work: 'Social Work', other: 'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  healthcare: 'bg-rose-500', engineering: 'bg-blue-500', education: 'bg-amber-500',
  legal: 'bg-purple-500', agriculture: 'bg-green-500', IT: 'bg-teal-500',
  finance: 'bg-cyan-500', trades: 'bg-orange-500', social_work: 'bg-pink-500', other: 'bg-gray-500',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then(s => { setStats(s); setLoading(false); });
  }, []);

  if (loading) return <LoadingState />;
  if (!stats)  return <ErrorState />;

  const categoryEntries = Object.entries(stats.by_category)
    .sort((a, b) => b[1] - a[1]);
  const maxCat = categoryEntries[0]?.[1] ?? 1;

  const districtEntries = Object.entries(stats.by_district)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-white text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Registry overview and key metrics</p>
      </div>

      {/* Top metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Volunteers"  value={stats.total}          accent="teal" />
        <MetricCard label="New This Week"     value={stats.new_this_week}  accent="teal" sub={`${stats.new_today} today`} />
        <MetricCard label="New This Month"    value={stats.new_this_month} accent="teal" />
        <MetricCard label="Match Groups"      value={stats.match_groups}   accent="orange"
                    sub={`${stats.groups_deployed} deployed`} linkTo="/admin/matches" />
      </div>

      {/* Status pipeline */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatusCard label="Registered" value={stats.registered} color="text-blue-400"   dot="bg-blue-400" />
        <StatusCard label="Active"     value={stats.active}     color="text-teal-400"   dot="bg-teal-400" />
        <StatusCard label="Verified"   value={stats.verified}   color="text-green-400"  dot="bg-green-400" />
        <StatusCard label="Inactive"   value={stats.inactive}   color="text-gray-500"   dot="bg-gray-500" />
      </div>

      {/* Alerts row */}
      {stats.freeform_pending > 0 && (
        <Link to="/admin/volunteers?mode=freeform"
          className="flex items-center gap-3 mb-8 px-5 py-4 rounded-xl
                     bg-accent-orange/10 border border-accent-orange/30
                     text-accent-orange hover:bg-accent-orange/15 transition-colors">
          <span className="text-xl">!</span>
          <div>
            <p className="font-medium text-sm">
              {stats.freeform_pending} freeform submission{stats.freeform_pending !== 1 ? 's' : ''} pending review
            </p>
            <p className="text-xs opacity-70 mt-0.5">
              These were submitted as essays and need structured data extracted
            </p>
          </div>
          <span className="ml-auto text-sm opacity-70">View →</span>
        </Link>
      )}

      {/* Two column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Category breakdown */}
        <div className="bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">Skills Breakdown</h2>
          <div className="space-y-3">
            {categoryEntries.map(([cat, count]) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{CATEGORY_LABELS[cat] ?? cat}</span>
                  <span className="text-gray-400">{count}</span>
                </div>
                <div className="h-1.5 bg-[#1a3a52] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${CATEGORY_COLORS[cat] ?? 'bg-teal-500'}`}
                    style={{ width: `${(count / maxCat) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District breakdown */}
        <div className="bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">By District</h2>
          <div className="space-y-2.5">
            {districtEntries.map(([district, count]) => (
              <div key={district} className="flex items-center justify-between">
                <span className="text-gray-300 text-sm">{district}</span>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-[#1a3a52] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full"
                      style={{ width: `${(count / (districtEntries[0]?.[1] ?? 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Reach */}
        <div className="bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">Reach</h2>
          <div className="space-y-4">
            <ReachRow label="In Botswana"      value={stats.local}       total={stats.total} color="bg-teal-500" />
            <ReachRow label="Diaspora"         value={stats.diaspora}    total={stats.total} color="bg-accent-orange" />
            <ReachRow label="Govt Funded"      value={stats.govt_funded} total={stats.total} color="bg-purple-500" />
            <ReachRow label="Available Now"    value={stats.ready_now}   total={stats.total} color="bg-green-500" />
            <ReachRow label="Virtual Ready"    value={stats.virtual_ready} total={stats.total} color="bg-blue-500" />
          </div>
        </div>

        {/* Gender */}
        <div className="bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">Gender</h2>
          <div className="space-y-3">
            {Object.entries(stats.by_gender).sort((a,b)=>b[1]-a[1]).map(([g, c]) => (
              <div key={g} className="flex justify-between items-center">
                <span className="text-gray-300 text-sm capitalize">{g.replace('_', ' ')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{c}</span>
                  <span className="text-gray-600 text-xs">
                    ({stats.total > 0 ? Math.round((c / stats.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age */}
        <div className="bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-5">Age Range</h2>
          <div className="space-y-3">
            {Object.entries(stats.by_age_range).sort((a,b)=>a[0].localeCompare(b[0])).map(([age, c]) => (
              <div key={age} className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">{age}</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{c}</span>
                  <span className="text-gray-600 text-xs">
                    ({stats.total > 0 ? Math.round((c / stats.total) * 100) : 0}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({
  label, value, accent = 'teal', sub, linkTo
}: {
  label: string; value: number; accent?: 'teal' | 'orange'; sub?: string; linkTo?: string;
}) {
  const content = (
    <div className={`bg-[#0a1e2e] border rounded-2xl p-5 ${
      accent === 'orange' ? 'border-accent-orange/30' : 'border-[#1a3a52]'
    }`}>
      <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">{label}</p>
      <p className={`text-3xl font-bold ${accent === 'orange' ? 'text-accent-orange' : 'text-teal-400'}`}>
        {value.toLocaleString()}
      </p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  );
  return linkTo ? <Link to={linkTo}>{content}</Link> : content;
}

function StatusCard({ label, value, color, dot }: { label: string; value: number; color: string; dot: string }) {
  return (
    <div className="bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <p className="text-gray-400 text-xs uppercase tracking-wider">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
}

function ReachRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-gray-400">{value} <span className="text-gray-600">({pct}%)</span></span>
      </div>
      <div className="h-1.5 bg-[#1a3a52] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="h-7 w-40 bg-[#0a1e2e] rounded animate-pulse" />
        <div className="h-4 w-60 bg-[#0a1e2e] rounded animate-pulse mt-2" />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="p-8 text-center">
      <p className="text-gray-400">Could not load stats. Check your Supabase configuration.</p>
    </div>
  );
}
