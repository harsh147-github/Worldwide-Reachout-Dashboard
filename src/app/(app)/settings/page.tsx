'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Mail, Shield, Globe2, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { REGION_LABELS, OPPORTUNITY_LABELS } from '@/types';
import type { Settings, Region, OpportunityType } from '@/types';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Settings are managed through env vars + DB for this app
    // For now show a config overview
    setLoading(false);
  }, []);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="font-display text-2xl flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-accent" /> Settings
        </h1>
        <p className="text-sm text-fg-muted">Configure your outreach dashboard</p>
      </div>

      {/* Email Profile */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-white/[0.04] bg-bg-secondary p-5 space-y-4">
        <h3 className="font-display text-base flex items-center gap-2">
          <Mail className="w-4 h-4 text-accent" /> Email Profile
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="Sender Name" defaultValue="Harsh Sonavane" readOnly />
          <Input label="Sender Email" defaultValue="sonawaneharsh147@gmail.com" readOnly />
        </div>
        <p className="text-xs text-fg-muted">
          Update these by modifying your .env file (SMTP_USER) and the settings table in Supabase.
        </p>
      </motion.div>

      {/* SMTP Status */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-xl border border-white/[0.04] bg-bg-secondary p-5 space-y-4">
        <h3 className="font-display text-base flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" /> SMTP Configuration
        </h3>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <div>
            <p className="text-sm text-fg-primary font-medium">Mock Mode Active</p>
            <p className="text-xs text-fg-muted">
              Set SMTP_PASS in your .env to enable real email sending. Use a Gmail App Password.
            </p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input label="SMTP Host" defaultValue="smtp.gmail.com" readOnly />
          <Input label="SMTP Port" defaultValue="587" readOnly />
        </div>
        <div className="rounded-lg bg-white/[0.02] p-3 border border-white/[0.04]">
          <p className="text-xs text-fg-muted">
            <strong className="text-fg-secondary">Setup guide:</strong> Google Account → Security → 2-Step Verification → App Passwords → Generate one for &ldquo;Mail&rdquo; → paste into SMTP_PASS
          </p>
        </div>
      </motion.div>

      {/* API Keys */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-xl border border-white/[0.04] bg-bg-secondary p-5 space-y-4">
        <h3 className="font-display text-base flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-accent" /> API Configuration
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <p className="text-sm text-fg-primary font-medium">Anthropic API</p>
              <p className="text-xs text-fg-muted">Set ANTHROPIC_API_KEY for AI scouting and email drafting</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <p className="text-sm text-fg-primary font-medium">Supabase</p>
              <p className="text-xs text-fg-muted">Set NEXT_PUBLIC_SUPABASE_URL and keys in .env</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Deployment Guide */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-xl border border-accent/10 bg-accent/[0.03] p-5 space-y-3">
        <h3 className="font-display text-base text-accent">Deployment Checklist</h3>
        <div className="space-y-2 text-sm text-fg-secondary">
          {[
            'Create Supabase project → run migration SQL',
            'Set env vars in Vercel (Supabase URL, keys, Anthropic key)',
            'Deploy to Vercel with `vercel --prod`',
            'Set SMTP_PASS for real email sending',
            'Run AI Scout from the Scout page',
            'Review drafts in Messages → Approve → Send',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs font-mono text-accent mt-0.5">{i + 1}.</span>
              <span className="text-xs">{step}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
