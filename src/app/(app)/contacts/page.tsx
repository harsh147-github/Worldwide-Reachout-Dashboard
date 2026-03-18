'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Plus, Trash2, ExternalLink, Mail, Globe, Linkedin,
  ChevronDown, Filter, RefreshCw, Loader2,
} from 'lucide-react';
import {
  Button, StatusBadge, PriorityBadge, RegionBadge, Modal, Input, Select, EmptyState,
} from '@/components/ui';
import type { Contact, ContactStatus, Region, OpportunityType, PriorityLevel } from '@/types';
import { REGION_LABELS, STATUS_LABELS, OPPORTUNITY_LABELS, PRIORITY_LABELS } from '@/types';

const ALL_REGIONS: { value: string; label: string }[] = [
  { value: '', label: 'All Regions' },
  ...Object.entries(REGION_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const ALL_STATUSES: { value: string; label: string }[] = [
  { value: '', label: 'All Statuses' },
  ...Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const ALL_OPPORTUNITIES: { value: string; label: string }[] = [
  { value: '', label: 'All Types' },
  ...Object.entries(OPPORTUNITY_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

const ALL_PRIORITIES: { value: string; label: string }[] = [
  { value: '', label: 'All Priorities' },
  ...Object.entries(PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l })),
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');
  const [status, setStatus] = useState('');
  const [opportunity, setOpportunity] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (region) params.set('region', region);
    if (status) params.set('status', status);
    if (opportunity) params.set('opportunity', opportunity);
    params.set('limit', '100');

    const res = await fetch(`/api/contacts?${params}`);
    const data = await res.json();
    setContacts(data.contacts || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search, region, status, opportunity]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await fetch(`/api/contacts?id=${id}`, { method: 'DELETE' });
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setDeleting(null);
  };

  const handleDraft = async (id: string) => {
    await fetch('/api/scout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'generate_draft', contact_id: id }),
    });
    fetchContacts();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Contacts</h1>
          <p className="text-sm text-fg-muted">{total} contacts worldwide</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchContacts}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-3.5 h-3.5" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fg-muted" />
          <input
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-fg-primary placeholder:text-fg-muted/50 focus:outline-none focus:border-accent/40 transition-colors"
            placeholder="Search contacts, orgs, emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select options={ALL_REGIONS} value={region} onChange={(e) => setRegion(e.target.value)} />
        <Select options={ALL_STATUSES} value={status} onChange={(e) => setStatus(e.target.value)} />
        <Select options={ALL_OPPORTUNITIES} value={opportunity} onChange={(e) => setOpportunity(e.target.value)} />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.04] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04] bg-bg-secondary/50">
                <th className="text-left px-4 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider">Contact</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider">Organization</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider hidden md:table-cell">Region</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider hidden lg:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider hidden sm:table-cell">Priority</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-fg-muted uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-fg-muted" />
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-fg-muted">
                    No contacts found. Run the AI Scout or add contacts manually.
                  </td>
                </tr>
              ) : (
                contacts.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-fg-primary">{c.name}</p>
                        <p className="text-xs text-fg-muted">{c.email || c.role || '—'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-fg-secondary text-xs">{c.organization_name || '—'}</p>
                      <p className="text-[11px] text-fg-muted">{c.country}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {c.region && <RegionBadge region={c.region} />}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-fg-muted">
                        {OPPORTUNITY_LABELS[c.opportunity_type] || c.opportunity_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {c.email && c.status === 'identified' && (
                          <button onClick={() => handleDraft(c.id)} className="p-1.5 rounded hover:bg-accent/10 text-fg-muted hover:text-accent transition-colors" title="Generate draft">
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {c.website && (
                          <a href={c.website} target="_blank" rel="noopener" className="p-1.5 rounded hover:bg-white/[0.06] text-fg-muted hover:text-fg-secondary transition-colors">
                            <Globe className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {c.linkedin && (
                          <a href={c.linkedin} target="_blank" rel="noopener" className="p-1.5 rounded hover:bg-white/[0.06] text-fg-muted hover:text-fg-secondary transition-colors">
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(c.id)}
                          disabled={deleting === c.id}
                          className="p-1.5 rounded hover:bg-red-500/10 text-fg-muted hover:text-red-400 transition-colors"
                        >
                          {deleting === c.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
      <AddContactModal open={showAdd} onClose={() => setShowAdd(false)} onAdded={fetchContacts} />
    </div>
  );
}

// ============================================================
// ADD CONTACT MODAL
// ============================================================

function AddContactModal({ open, onClose, onAdded }: { open: boolean; onClose: () => void; onAdded: () => void }) {
  const [form, setForm] = useState({
    name: '', email: '', title: '', role: '', organization_name: '', country: '',
    region: 'europe_west' as Region, opportunity_type: 'research_internship' as OpportunityType,
    priority: 'medium' as PriorityLevel, source: 'manual', website: '', linkedin: '', notes: '',
    auto_draft: false,
  });
  const [saving, setSaving] = useState(false);

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.name) return;
    setSaving(true);
    await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    onClose();
    onAdded();
    setForm({ name: '', email: '', title: '', role: '', organization_name: '', country: '',
      region: 'europe_west', opportunity_type: 'research_internship', priority: 'medium',
      source: 'manual', website: '', linkedin: '', notes: '', auto_draft: false });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Contact" maxWidth="max-w-xl">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Full Name *" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Dr. Jane Smith" className="col-span-2" />
        <Input label="Email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="jane@university.edu" />
        <Input label="Title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Professor" />
        <Input label="Role" value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="PI - Composites Lab" className="col-span-2" />
        <Input label="Organization" value={form.organization_name} onChange={(e) => set('organization_name', e.target.value)} placeholder="TU Delft" />
        <Input label="Country" value={form.country} onChange={(e) => set('country', e.target.value)} placeholder="Netherlands" />
        <Select label="Region" options={Object.entries(REGION_LABELS).map(([v, l]) => ({ value: v, label: l }))} value={form.region} onChange={(e) => set('region', e.target.value)} />
        <Select label="Opportunity Type" options={Object.entries(OPPORTUNITY_LABELS).map(([v, l]) => ({ value: v, label: l }))} value={form.opportunity_type} onChange={(e) => set('opportunity_type', e.target.value)} />
        <Select label="Priority" options={Object.entries(PRIORITY_LABELS).map(([v, l]) => ({ value: v, label: l }))} value={form.priority} onChange={(e) => set('priority', e.target.value)} />
        <Input label="Source" value={form.source} onChange={(e) => set('source', e.target.value)} placeholder="Lab website, LinkedIn..." />
        <Input label="Website" value={form.website} onChange={(e) => set('website', e.target.value)} placeholder="https://..." />
        <Input label="LinkedIn" value={form.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
        <div className="col-span-2">
          <label className="block text-xs font-medium text-fg-muted mb-1.5">Notes</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-fg-primary placeholder:text-fg-muted/50 focus:outline-none focus:border-accent/40 transition-colors resize-none h-20"
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            placeholder="Any context..."
          />
        </div>
        <label className="col-span-2 flex items-center gap-2 text-sm text-fg-secondary cursor-pointer">
          <input type="checkbox" checked={form.auto_draft} onChange={(e) => set('auto_draft', e.target.checked)} className="accent-accent" />
          Auto-generate email draft with AI
        </label>
      </div>
      <div className="flex justify-end gap-2 mt-5 pt-4 border-t border-white/[0.04]">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} loading={saving} disabled={!form.name}>Save Contact</Button>
      </div>
    </Modal>
  );
}
