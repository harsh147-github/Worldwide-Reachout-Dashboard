import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();

  const [
    { count: totalContacts },
    { data: contacts },
    { data: messages },
    { count: orgsTotal },
    { count: orgsScouted },
  ] = await Promise.all([
    supabase.from('contacts').select('*', { count: 'exact', head: true }),
    supabase.from('contacts').select('status, region, opportunity_type, priority, created_at'),
    supabase.from('messages').select('message_status, sent_at, created_at'),
    supabase.from('organizations').select('*', { count: 'exact', head: true }),
    supabase.from('organizations').select('*', { count: 'exact', head: true }).not('scouted_at', 'is', null),
  ]);

  const byStatus: Record<string, number> = {};
  const byRegion: Record<string, number> = {};
  const byOpportunity: Record<string, number> = {};
  const byPriority: Record<string, number> = {};

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  let contactsAdded7d = 0;

  for (const c of contacts || []) {
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    if (c.region) byRegion[c.region] = (byRegion[c.region] || 0) + 1;
    byOpportunity[c.opportunity_type] = (byOpportunity[c.opportunity_type] || 0) + 1;
    byPriority[c.priority] = (byPriority[c.priority] || 0) + 1;
    if (c.created_at > sevenDaysAgo) contactsAdded7d++;
  }

  let messagesDrafted = 0, messagesSent = 0, messagesReplied = 0, messagesSent7d = 0;
  for (const m of messages || []) {
    if (m.message_status === 'draft') messagesDrafted++;
    if (m.message_status === 'sent') {
      messagesSent++;
      if (m.sent_at && m.sent_at > sevenDaysAgo) messagesSent7d++;
    }
  }

  const repliedContacts = (contacts || []).filter((c) => c.status === 'replied').length;
  const responseRate = messagesSent > 0 ? repliedContacts / messagesSent : 0;

  return NextResponse.json({
    total_contacts: totalContacts || 0,
    by_status: byStatus,
    by_region: byRegion,
    by_opportunity: byOpportunity,
    by_priority: byPriority,
    messages_drafted: messagesDrafted,
    messages_sent: messagesSent,
    messages_replied: repliedContacts,
    response_rate: responseRate,
    orgs_total: orgsTotal || 0,
    orgs_scouted: orgsScouted || 0,
    recent_activity: {
      contacts_added_7d: contactsAdded7d,
      messages_sent_7d: messagesSent7d,
      replies_7d: 0,
    },
  });
}
