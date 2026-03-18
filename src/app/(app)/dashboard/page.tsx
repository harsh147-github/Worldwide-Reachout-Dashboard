'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Mail, Send, MessageCircle, Globe2, Building2, Radar,
  TrendingUp, ArrowUpRight, Calendar, Zap, Target,
} from 'lucide-react';
import { StatCard, RegionBar, StatusBadge, Button } from '@/components/ui';
import type { DashboardStats } from '@/types';
import { REGION_LABELS, STATUS_LABELS, OPPORTUNITY_LABELS } from '@/types';
import Link from 'next/link';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return 'Burning the midnight oil';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Late night grind';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-sm text-fg-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const s = stats || {
    total_contacts: 0, by_status: {}, by_region: {}, by_opportunity: {}, by_priority: {},
    messages_drafted: 0, messages_sent: 0, messages_replied: 0, response_rate: 0,
    orgs_total: 0, orgs_scouted: 0, recent_activity: { contacts_added_7d: 0, messages_sent_7d: 0, replies_7d: 0 },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <h1 className="font-display text-2xl md:text-3xl">
          {getGreeting()}, <span className="text-accent">Harsh</span>
        </h1>
        <p className="text-sm text-fg-muted">
          {s.total_contacts} contacts across {Object.keys(s.by_region).length} regions
          {s.orgs_total > 0 && ` · ${s.orgs_scouted}/${s.orgs_total} orgs scouted`}
        </p>
      </motion.div>

      {/* Primary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Contacts" value={s.total_contacts} icon={<Users className="w-4 h-4" />} accent delay={0} />
        <StatCard label="Emails Drafted" value={s.messages_drafted} icon={<Mail className="w-4 h-4" />} delay={80} />
        <StatCard label="Emails Sent" value={s.messages_sent} icon={<Send className="w-4 h-4" />} delay={160} />
        <StatCard label="Replies" value={s.messages_replied} icon={<MessageCircle className="w-4 h-4" />} delay={240}
          subtitle={s.messages_sent > 0 ? `${(s.response_rate * 100).toFixed(0)}% rate` : undefined} />
      </div>

      {/* Region distribution + Pipeline */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Region breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-white/[0.04] bg-bg-secondary p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-accent" /> Regions
            </h3>
            <Link href="/contacts" className="text-xs text-fg-muted hover:text-accent transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          {Object.keys(s.by_region).length > 0 ? (
            <RegionBar data={s.by_region} />
          ) : (
            <p className="text-sm text-fg-muted py-4 text-center">No contacts yet. Run the AI Scout to get started.</p>
          )}
        </motion.div>

        {/* Pipeline stages */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-xl border border-white/[0.04] bg-bg-secondary p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-accent" /> Pipeline
            </h3>
            <Link href="/pipeline" className="text-xs text-fg-muted hover:text-accent transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {['identified', 'researched', 'drafted', 'sent', 'followed_up', 'replied', 'interview', 'offer'].map((status) => {
              const count = (s.by_status as any)[status] || 0;
              const pct = s.total_contacts > 0 ? (count / s.total_contacts) * 100 : 0;
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-20 text-[11px] text-fg-muted capitalize">{status.replace(/_/g, ' ')}</div>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full status-bar-${status}`}
                      style={{
                        backgroundColor:
                          status === 'offer' ? '#22C55E' :
                          status === 'interview' ? '#06B6D4' :
                          status === 'replied' ? '#10B981' :
                          status === 'sent' ? '#3B82F6' :
                          status === 'drafted' ? '#F59E0B' :
                          status === 'researched' ? '#8B5CF6' :
                          '#6B7280'
                      }}
                    />
                  </div>
                  <div className="w-8 text-right text-xs font-mono text-fg-muted">{count}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Quick actions + Opportunity breakdown */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-white/[0.04] bg-bg-secondary p-5 space-y-3"
        >
          <h3 className="font-display text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" /> Quick Actions
          </h3>
          <div className="space-y-2">
            <Link href="/scout" className="flex items-center gap-3 p-3 rounded-lg bg-accent/[0.06] hover:bg-accent/[0.1] border border-accent/10 transition-colors group">
              <Radar className="w-4 h-4 text-accent" />
              <div>
                <p className="text-sm font-medium text-fg-primary">Run AI Scout</p>
                <p className="text-[11px] text-fg-muted">{s.orgs_total - s.orgs_scouted} orgs remaining</p>
              </div>
              <ArrowUpRight className="w-3 h-3 ml-auto text-fg-muted group-hover:text-accent transition-colors" />
            </Link>
            <Link href="/contacts" className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-colors group">
              <Users className="w-4 h-4 text-fg-muted" />
              <div>
                <p className="text-sm font-medium text-fg-primary">Add Contact</p>
                <p className="text-[11px] text-fg-muted">Manual entry</p>
              </div>
              <ArrowUpRight className="w-3 h-3 ml-auto text-fg-muted group-hover:text-fg-secondary transition-colors" />
            </Link>
            <Link href="/messages?status=draft" className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-colors group">
              <Mail className="w-4 h-4 text-fg-muted" />
              <div>
                <p className="text-sm font-medium text-fg-primary">Review Drafts</p>
                <p className="text-[11px] text-fg-muted">{s.messages_drafted} awaiting review</p>
              </div>
              <ArrowUpRight className="w-3 h-3 ml-auto text-fg-muted group-hover:text-fg-secondary transition-colors" />
            </Link>
          </div>
        </motion.div>

        {/* Opportunity breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="md:col-span-2 rounded-xl border border-white/[0.04] bg-bg-secondary p-5"
        >
          <h3 className="font-display text-base flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-accent" /> By Opportunity Type
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(s.by_opportunity)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([opp, count]) => (
                <div key={opp} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                  <span className="text-xs text-fg-secondary truncate">
                    {(OPPORTUNITY_LABELS as any)[opp] || opp.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-mono text-fg-muted ml-2">{count as number}</span>
                </div>
              ))}
          </div>
          {Object.keys(s.by_opportunity).length === 0 && (
            <p className="text-sm text-fg-muted py-4 text-center">Run the AI Scout to populate opportunities.</p>
          )}
        </motion.div>
      </div>

      {/* 7-day activity */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex items-center gap-6 px-5 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-fg-muted"
      >
        <Calendar className="w-4 h-4" />
        <span>Last 7 days:</span>
        <span><strong className="text-fg-secondary">{s.recent_activity.contacts_added_7d}</strong> contacts added</span>
        <span><strong className="text-fg-secondary">{s.recent_activity.messages_sent_7d}</strong> emails sent</span>
        <span><strong className="text-fg-secondary">{s.recent_activity.replies_7d}</strong> replies</span>
      </motion.div>
    </div>
  );
}
