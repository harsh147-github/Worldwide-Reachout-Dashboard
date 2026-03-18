'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, Check, X, Send, Mail, Eye, ChevronDown, RefreshCw,
  ArrowRight, CheckCircle2, SkipForward, Inbox,
} from 'lucide-react';
import { Button, StatusBadge, RegionBadge, EmptyState, Modal } from '@/components/ui';
import type { Message, MessageStatus } from '@/types';

const STATUS_TABS: { value: MessageStatus | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'draft', label: 'Drafts' },
  { value: 'approved', label: 'Approved' },
  { value: 'sent', label: 'Sent' },
  { value: 'skipped', label: 'Skipped' },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<MessageStatus | ''>('draft');
  const [preview, setPreview] = useState<Message | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [sendingAll, setSendingAll] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const params = tab ? `?status=${tab}` : '';
    const res = await fetch(`/api/messages${params}`);
    const data = await res.json();
    setMessages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, [tab]);

  const handleAction = async (id: string, action: 'approve' | 'skip' | 'send') => {
    setActionLoading(id);
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    setActionLoading(null);
    fetchMessages();
  };

  const handleSendAll = async () => {
    setSendingAll(true);
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 'batch', action: 'send_all_approved' }),
    });
    setSendingAll(false);
    fetchMessages();
  };

  const approvedCount = messages.filter((m) => m.message_status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl">Messages</h1>
          <p className="text-sm text-fg-muted">{messages.length} messages</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={fetchMessages}>
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          {tab === '' && approvedCount > 0 && (
            <Button size="sm" onClick={handleSendAll} loading={sendingAll}>
              <Send className="w-3.5 h-3.5" /> Send All Approved ({approvedCount})
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] w-fit">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === t.value
                ? 'bg-white/[0.08] text-fg-primary'
                : 'text-fg-muted hover:text-fg-secondary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-5 h-5 animate-spin text-fg-muted" />
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={<Inbox className="w-8 h-8" />}
          title="No messages"
          description={tab === 'draft' ? 'Run the AI Scout to generate email drafts.' : 'No messages in this category.'}
        />
      ) : (
        <div className="space-y-2">
          {messages.map((msg, i) => {
            const contact = (msg as any).contacts;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group rounded-xl border border-white/[0.04] bg-bg-secondary hover:border-white/[0.08] transition-colors"
              >
                <div className="flex items-start gap-4 p-4">
                  {/* Status indicator */}
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    msg.message_status === 'draft' ? 'bg-amber-400' :
                    msg.message_status === 'approved' ? 'bg-blue-400' :
                    msg.message_status === 'sent' ? 'bg-emerald-400' :
                    'bg-gray-400'
                  }`} />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-fg-primary">{msg.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-fg-muted">To: {contact?.name || 'Unknown'}</span>
                          {contact?.organization_name && (
                            <span className="text-xs text-fg-muted">• {contact.organization_name}</span>
                          )}
                          {contact?.region && <RegionBadge region={contact.region} />}
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                        msg.message_status === 'draft' ? 'bg-amber-500/20 text-amber-400' :
                        msg.message_status === 'approved' ? 'bg-blue-500/20 text-blue-400' :
                        msg.message_status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {msg.message_status}
                      </span>
                    </div>

                    {/* Preview body */}
                    <p className="text-xs text-fg-muted mt-2 line-clamp-2">{msg.body.replace(/\\n/g, ' ').slice(0, 200)}...</p>

                    {/* Timestamps */}
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-fg-muted">
                      <span>Created: {new Date(msg.created_at).toLocaleDateString()}</span>
                      {msg.sent_at && <span>Sent: {new Date(msg.sent_at).toLocaleDateString()}</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      onClick={() => setPreview(msg)}
                      className="p-2 rounded-lg hover:bg-white/[0.06] text-fg-muted hover:text-fg-secondary transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {msg.message_status === 'draft' && (
                      <>
                        <button
                          onClick={() => handleAction(msg.id, 'approve')}
                          disabled={actionLoading === msg.id}
                          className="p-2 rounded-lg hover:bg-emerald-500/10 text-fg-muted hover:text-emerald-400 transition-colors"
                          title="Approve"
                        >
                          {actionLoading === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleAction(msg.id, 'skip')}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-fg-muted hover:text-red-400 transition-colors"
                          title="Skip"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {msg.message_status === 'approved' && (
                      <button
                        onClick={() => handleAction(msg.id, 'send')}
                        disabled={actionLoading === msg.id}
                        className="p-2 rounded-lg hover:bg-accent/10 text-fg-muted hover:text-accent transition-colors"
                        title="Send"
                      >
                        {actionLoading === msg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      <Modal open={!!preview} onClose={() => setPreview(null)} title="Email Preview" maxWidth="max-w-2xl">
        {preview && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-fg-muted">
                <span className="font-medium text-fg-secondary">To:</span>
                {(preview as any).contacts?.name} ({(preview as any).contacts?.email || 'no email'})
              </div>
              <div className="flex items-center gap-2 text-xs text-fg-muted">
                <span className="font-medium text-fg-secondary">Subject:</span>
                {preview.subject}
              </div>
            </div>
            <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-4">
              <div className="text-sm text-fg-primary whitespace-pre-wrap leading-relaxed">
                {preview.body.replace(/\\n/g, '\n')}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              {preview.message_status === 'draft' && (
                <>
                  <Button variant="ghost" onClick={() => { handleAction(preview.id, 'skip'); setPreview(null); }}>Skip</Button>
                  <Button onClick={() => { handleAction(preview.id, 'approve'); setPreview(null); }}>Approve</Button>
                </>
              )}
              {preview.message_status === 'approved' && (
                <Button onClick={() => { handleAction(preview.id, 'send'); setPreview(null); }}>
                  <Send className="w-3.5 h-3.5" /> Send
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
