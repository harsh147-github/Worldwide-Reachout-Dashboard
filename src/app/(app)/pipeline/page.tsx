'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, User, Building2, ChevronRight } from 'lucide-react';
import { StatusBadge, PriorityBadge, RegionBadge } from '@/components/ui';
import type { Contact, ContactStatus } from '@/types';
import { OPPORTUNITY_LABELS } from '@/types';

const PIPELINE_STAGES: { status: ContactStatus; label: string; color: string }[] = [
  { status: 'identified', label: 'Identified', color: '#6B7280' },
  { status: 'researched', label: 'Researched', color: '#8B5CF6' },
  { status: 'drafted', label: 'Drafted', color: '#F59E0B' },
  { status: 'sent', label: 'Sent', color: '#3B82F6' },
  { status: 'followed_up', label: 'Followed Up', color: '#6366F1' },
  { status: 'replied', label: 'Replied', color: '#10B981' },
  { status: 'interview', label: 'Interview', color: '#06B6D4' },
  { status: 'offer', label: 'Offer!', color: '#22C55E' },
];

export default function PipelinePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contacts?limit=500')
      .then((r) => r.json())
      .then((d) => setContacts(d.contacts || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-fg-muted" />
      </div>
    );
  }

  const grouped = PIPELINE_STAGES.map((stage) => ({
    ...stage,
    contacts: contacts.filter((c) => c.status === stage.status),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Pipeline</h1>
        <p className="text-sm text-fg-muted">Track your outreach progress across stages</p>
      </div>

      {/* Horizontal scrollable pipeline */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {grouped.map((stage, si) => (
          <div key={stage.status} className="flex-shrink-0 w-[260px]">
            {/* Column header */}
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
              <span className="text-xs font-medium text-fg-secondary uppercase tracking-wider">{stage.label}</span>
              <span className="text-xs font-mono text-fg-muted ml-auto">{stage.contacts.length}</span>
            </div>

            {/* Cards */}
            <div className="space-y-2 min-h-[200px]">
              {stage.contacts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-white/[0.06] p-4 text-center text-xs text-fg-muted">
                  No contacts
                </div>
              ) : (
                stage.contacts.map((c, ci) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: si * 0.05 + ci * 0.02 }}
                    className="rounded-lg border border-white/[0.05] bg-bg-secondary p-3 hover:border-white/[0.1] transition-colors cursor-default group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-fg-primary leading-tight">{c.name}</p>
                      <PriorityBadge priority={c.priority} />
                    </div>
                    {c.organization_name && (
                      <div className="flex items-center gap-1 mb-2">
                        <Building2 className="w-3 h-3 text-fg-muted" />
                        <span className="text-[11px] text-fg-muted truncate">{c.organization_name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {c.region && <RegionBadge region={c.region} />}
                      <span className="text-[10px] text-fg-muted">
                        {OPPORTUNITY_LABELS[c.opportunity_type]?.split(' ')[0] || c.opportunity_type}
                      </span>
                    </div>
                    {c.relevance_reason && (
                      <p className="text-[11px] text-fg-muted mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.relevance_reason}
                      </p>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-1 py-2 text-xs text-fg-muted">
        {grouped.map((stage, i) => (
          <div key={stage.status} className="flex items-center gap-1">
            <span className="font-mono">{stage.contacts.length}</span>
            {i < grouped.length - 1 && <ChevronRight className="w-3 h-3" />}
          </div>
        ))}
        <span className="ml-2">
          → {grouped.filter((s) => ['replied', 'interview', 'offer'].includes(s.status)).reduce((sum, s) => sum + s.contacts.length, 0)} positive responses
        </span>
      </div>
    </div>
  );
}
