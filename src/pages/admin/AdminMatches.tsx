import { useEffect, useState } from 'react';
import {
  getMatchGroups, updateMatchGroupStatus, createMatchGroup, computeSimilarities,
  getVolunteers, MatchGroup, Volunteer
} from '../../services/adminService';

const STATUS_COLORS: Record<string, string> = {
  draft:    'bg-gray-500/15 text-gray-400 border-gray-500/30',
  reviewed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  deployed: 'bg-green-500/15 text-green-400 border-green-500/30',
};

const METHOD_BADGE: Record<string, string> = {
  code:   'bg-teal-500/10 text-teal-500',
  ai:     'bg-purple-500/10 text-purple-400',
  hybrid: 'bg-accent-orange/10 text-accent-orange',
  manual: 'bg-gray-500/10 text-gray-400',
};

export default function AdminMatches() {
  const [groups, setGroups]           = useState<MatchGroup[]>([]);
  const [loading, setLoading]         = useState(true);
  const [computing, setComputing]     = useState(false);
  const [computeResult, setComputeResult] = useState<{ pairs_computed: number; groups_created: number } | null>(null);
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [members, setMembers]         = useState<Record<string, Volunteer[]>>({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [filter, setFilter]           = useState<'all' | 'draft' | 'reviewed' | 'deployed'>('all');

  useEffect(() => {
    getMatchGroups().then(g => { setGroups(g); setLoading(false); });
  }, []);

  async function handleCompute() {
    setComputing(true);
    setComputeResult(null);
    const result = await computeSimilarities();
    if (result) {
      setComputeResult(result);
      const updated = await getMatchGroups();
      setGroups(updated);
    }
    setComputing(false);
  }

  async function handleStatusChange(id: string, status: string) {
    const ok = await updateMatchGroupStatus(id, status);
    if (ok) setGroups(prev => prev.map(g => g.id === id ? { ...g, status } : g));
  }

  async function handleExpand(group: MatchGroup) {
    if (expandedId === group.id) { setExpandedId(null); return; }
    setExpandedId(group.id);
    if (!members[group.id] && group.member_ids.length > 0) {
      const { data } = await getVolunteers(0, 500, {});
      const groupMembers = data.filter(v => group.member_ids.includes(v.id));
      setMembers(prev => ({ ...prev, [group.id]: groupMembers }));
    }
  }

  async function handleCreate() {
    if (!newGroupName.trim()) return;
    const g = await createMatchGroup({ name: newGroupName.trim(), member_ids: [] });
    if (g) { setGroups(prev => [g, ...prev]); setShowCreateForm(false); setNewGroupName(''); }
  }

  const filtered = filter === 'all' ? groups : groups.filter(g => g.status === filter);
  const counts = { all: groups.length, draft: 0, reviewed: 0, deployed: 0 };
  groups.forEach(g => { counts[g.status as keyof typeof counts] = (counts[g.status as keyof typeof counts] ?? 0) + 1; });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-white text-2xl font-semibold">Match Groups</h1>
          <p className="text-gray-400 text-sm mt-1">
            Volunteer skill clusters for coordinated deployment
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2.5 text-sm bg-[#0a1e2e] border border-[#1a3a52] rounded-lg
                       text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
          >
            + Create Group
          </button>
          <button
            onClick={handleCompute}
            disabled={computing}
            className="px-4 py-2.5 text-sm bg-teal-500 hover:bg-teal-400 disabled:opacity-50
                       text-white font-medium rounded-lg transition-colors"
          >
            {computing ? 'Computing…' : 'Run Matching Engine'}
          </button>
        </div>
      </div>

      {/* Compute result banner */}
      {computeResult && (
        <div className="mb-6 px-5 py-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm flex items-center gap-4">
          <span>Matching complete:</span>
          <span className="font-medium">{computeResult.pairs_computed} volunteer pairs scored</span>
          <span>·</span>
          <span className="font-medium">{computeResult.groups_created} new groups created</span>
          <button onClick={() => setComputeResult(null)} className="ml-auto text-teal-600 hover:text-teal-400">✕</button>
        </div>
      )}

      {/* Inline create form */}
      {showCreateForm && (
        <div className="mb-6 bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl p-5">
          <h3 className="text-white font-medium mb-4">New Match Group</h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              placeholder="Group name, e.g. Rural Health Team – Kweneng"
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              className="flex-1 bg-[#020c14] border border-[#1a3a52] rounded-lg px-4 py-2.5
                         text-white placeholder-gray-600 text-sm focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handleCreate}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2.5 text-gray-400 hover:text-white text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-[#0a1e2e] border border-[#1a3a52] rounded-xl p-1 w-fit">
        {(['all', 'draft', 'reviewed', 'deployed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-teal-500 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={`ml-2 text-xs ${filter === f ? 'text-teal-100' : 'text-gray-600'}`}>
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Groups list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onCompute={handleCompute} computing={computing} />
      ) : (
        <div className="space-y-3">
          {filtered.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              expanded={expandedId === group.id}
              members={members[group.id] ?? []}
              onToggle={() => handleExpand(group)}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Group Card ───────────────────────────────────────────────────────────────

function GroupCard({
  group, expanded, members, onToggle, onStatusChange
}: {
  group: MatchGroup;
  expanded: boolean;
  members: Volunteer[];
  onToggle: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const nextStatus: Record<string, string> = { draft: 'reviewed', reviewed: 'deployed' };
  const nextLabel: Record<string, string>  = { draft: 'Mark Reviewed', reviewed: 'Mark Deployed' };

  return (
    <div className="bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-4 px-6 py-4 cursor-pointer" onClick={onToggle}>
        {/* Score ring */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-teal-500/40 flex items-center justify-center bg-teal-500/10">
          <span className="text-teal-400 font-bold text-sm">
            {Math.round((group.match_score ?? 0) * 100)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-medium">{group.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_COLORS[group.status] ?? STATUS_COLORS.draft}`}>
              {group.status}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${METHOD_BADGE[group.match_method] ?? METHOD_BADGE.manual}`}>
              {group.match_method}
            </span>
          </div>
          {group.skill_theme && (
            <p className="text-gray-500 text-sm mt-0.5">{group.skill_theme}</p>
          )}
          <p className="text-gray-600 text-xs mt-1">
            {group.member_ids.length} member{group.member_ids.length !== 1 ? 's' : ''}
            {' · '}
            {new Date(group.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {nextStatus[group.status] && (
            <button
              onClick={e => { e.stopPropagation(); onStatusChange(group.id, nextStatus[group.status]); }}
              className="px-3 py-1.5 text-xs bg-[#1a3a52] hover:bg-teal-500/20 hover:text-teal-400
                         text-gray-300 rounded-lg transition-colors"
            >
              {nextLabel[group.status]}
            </button>
          )}
          <ChevronIcon className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Expanded: members + recommendation */}
      {expanded && (
        <div className="border-t border-[#1a3a52] px-6 py-5">
          {group.deployment_recommendation && (
            <div className="mb-4 p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <p className="text-purple-400 text-xs uppercase tracking-wider mb-2">AI Recommendation</p>
              <p className="text-gray-300 text-sm leading-relaxed">{group.deployment_recommendation}</p>
            </div>
          )}

          {members.length > 0 ? (
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Members</p>
              <div className="space-y-2">
                {members.map(v => (
                  <div key={v.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#020c14]">
                    <div className="w-7 h-7 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-teal-400 text-xs font-semibold">
                        {v.full_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{v.full_name}</p>
                      <p className="text-gray-500 text-xs">{v.skill_specialty} · {v.city}</p>
                    </div>
                    <span className="text-gray-600 text-xs capitalize">{v.service_mode}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : group.member_ids.length > 0 ? (
            <p className="text-gray-500 text-sm">Loading members…</p>
          ) : (
            <p className="text-gray-500 text-sm italic">No members assigned yet.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onCompute, computing }: { onCompute: () => void; computing: boolean }) {
  return (
    <div className="text-center py-20 bg-[#0a1e2e] border border-[#1a3a52] rounded-2xl">
      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-5">
        <NetworkIcon className="w-8 h-8 text-teal-500/60" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">No match groups yet</h3>
      <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
        Run the matching engine to automatically cluster volunteers by skills, location, and availability.
        AI-powered grouping will be added in the next phase.
      </p>
      <button
        onClick={onCompute}
        disabled={computing}
        className="px-6 py-3 bg-teal-500 hover:bg-teal-400 disabled:opacity-50
                   text-white font-medium rounded-xl transition-colors"
      >
        {computing ? 'Computing…' : 'Run Matching Engine'}
      </button>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function NetworkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path strokeLinecap="round" d="M12 7v4M12 11l-5.5 6M12 11l5.5 6" />
    </svg>
  );
}
