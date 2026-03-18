'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radar, Globe2, Building2, ExternalLink, CheckCircle2, Circle,
  Loader2, Play, Zap, RefreshCw, ChevronDown,
} from 'lucide-react';
import { Button, RegionBadge, EmptyState, Select } from '@/components/ui';
import type { Organization, Region } from '@/types';
import { REGION_LABELS } from '@/types';

export default function ScoutPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [regionFilter, setRegionFilter] = useState('');
  const [scouting, setScouting] = useState<string | null>(null); // org id or region
  const [scoutLog, setScoutLog] = useState<string[]>([]);

  const fetchOrgs = async () => {
    setLoading(true);
    const params = regionFilter ? `?region=${regionFilter}` : '';
    const res = await fetch(`/api/scout${params}`);
    setOrgs(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchOrgs(); }, [regionFilter]);

  const scoutOrg = async (orgId: string, orgName: string) => {
    setScouting(orgId);
    setScoutLog((prev) => [...prev, `🔍 Scouting ${orgName}...`]);
    try {
      const res = await fetch('/api/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scout_org', org_id: orgId }),
      });
      const data = await res.json();
      setScoutLog((prev) => [...prev, `✅ Found ${data.contacts?.length || 0} contacts at ${orgName}`]);
      fetchOrgs();
    } catch (err) {
      setScoutLog((prev) => [...prev, `❌ Failed: ${err}`]);
    }
    setScouting(null);
  };

  const scoutRegion = async (region: string) => {
    setScouting(region);
    setScoutLog((prev) => [...prev, `🌍 Scouting region: ${REGION_LABELS[region as Region] || region}...`]);
    try {
      const res = await fetch('/api/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scout_region', region, limit: 5 }),
      });
      const data = await res.json();
      setScoutLog((prev) => [...prev, `✅ ${data.message}`]);
      fetchOrgs();
    } catch (err) {
      setScoutLog((prev) => [...prev, `❌ Failed: ${err}`]);
    }
    setScouting(null);
  };

  const scoutAll = async () => {
    setScouting('all');
    setScoutLog((prev) => [...prev, '🚀 Starting full worldwide scout...']);
    try {
      const res = await fetch('/api/scout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'scout_all', limit: 3 }),
      });
      const data = await res.json();
      setScoutLog((prev) => [...prev, `✅ Scouted ${data.regions_scouted} regions`]);
      fetchOrgs();
    } catch (err) {
      setScoutLog((prev) => [...prev, `❌ Failed: ${err}`]);
    }
    setScouting(null);
  };

  // Group orgs by region
  const grouped = orgs.reduce((acc, org) => {
    const key = org.region;
    if (!acc[key]) acc[key] = [];
    acc[key].push(org);
    return acc;
  }, {} as Record<string, Organization[]>);

  const totalOrgs = orgs.length;
  const scoutedOrgs = orgs.filter((o) => o.scouted_at).length;
  const unscoutedOrgs = totalOrgs - scoutedOrgs;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl flex items-center gap-2">
            <Radar className="w-6 h-6 text-accent" /> AI Scout
          </h1>
          <p className="text-sm text-fg-muted">
            {scoutedOrgs}/{totalOrgs} organizations scouted · {unscoutedOrgs} remaining
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchOrgs}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button size="sm" onClick={scoutAll} loading={scouting === 'all'} disabled={!!scouting}>
            <Zap className="w-3.5 h-3.5" /> Scout All Regions
          </Button>
        </div>
      </div>

      {/* Region filter + per-region scout buttons */}
      <div className="flex flex-wrap gap-2">
        <Select
          options={[{ value: '', label: 'All Regions' }, ...Object.entries(REGION_LABELS).map(([v, l]) => ({ value: v, label: l }))]}
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
        />
        {regionFilter && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => scoutRegion(regionFilter)}
            loading={scouting === regionFilter}
            disabled={!!scouting}
          >
            <Radar className="w-3.5 h-3.5" /> Scout {REGION_LABELS[regionFilter as Region]?.split(' ').slice(1).join(' ') || regionFilter}
          </Button>
        )}
      </div>

      {/* Scout log */}
      {scoutLog.length > 0 && (
        <div className="rounded-lg bg-bg-tertiary border border-white/[0.04] p-3 max-h-40 overflow-y-auto">
          <p className="text-xs font-medium text-fg-muted mb-2">Scout Log</p>
          {scoutLog.map((log, i) => (
            <p key={i} className="text-xs text-fg-secondary font-mono">{log}</p>
          ))}
          {scouting && (
            <div className="flex items-center gap-2 mt-1">
              <Loader2 className="w-3 h-3 animate-spin text-accent" />
              <span className="text-xs text-accent">Scouting in progress...</span>
            </div>
          )}
        </div>
      )}

      {/* Organizations grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-fg-muted" />
        </div>
      ) : (
        Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([region, regionOrgs]) => (
            <div key={region} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RegionBadge region={region} />
                  <span className="text-xs text-fg-muted font-mono">
                    {regionOrgs.filter((o) => o.scouted_at).length}/{regionOrgs.length}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => scoutRegion(region)}
                  disabled={!!scouting || regionOrgs.every((o) => o.scouted_at)}
                  loading={scouting === region}
                >
                  <Play className="w-3 h-3" /> Scout
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {regionOrgs.map((org, i) => (
                  <motion.div
                    key={org.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.04] bg-bg-secondary hover:border-white/[0.08] transition-colors group"
                  >
                    {org.scouted_at ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-fg-muted flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-fg-primary truncate">
                        {org.short_name || org.name}
                      </p>
                      <p className="text-[11px] text-fg-muted truncate">
                        {org.city}, {org.country} · {org.org_type}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {org.website && (
                        <a href={org.website} target="_blank" rel="noopener" className="p-1 rounded hover:bg-white/[0.06] text-fg-muted">
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {!org.scouted_at && (
                        <button
                          onClick={() => scoutOrg(org.id, org.short_name || org.name)}
                          disabled={!!scouting}
                          className="p-1 rounded hover:bg-accent/10 text-fg-muted hover:text-accent"
                        >
                          <Radar className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
}
