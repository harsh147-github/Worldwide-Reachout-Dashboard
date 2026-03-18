// ============================================================
// Database Types — mirrors Supabase schema
// ============================================================

export type OpportunityType =
  | 'research_internship'
  | 'visiting_researcher'
  | 'full_time'
  | 'masters_lab'
  | 'phd_position'
  | 'fellowship'
  | 'exchange_program'
  | 'lab_assistant'
  | 'industry_partner'
  | 'conference_contact'
  | 'accelerator'
  | 'government_program'
  | 'startup_role'
  | 'postdoc';

export type ContactStatus =
  | 'identified'
  | 'researched'
  | 'drafted'
  | 'sent'
  | 'followed_up'
  | 'replied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'not_interested'
  | 'archived';

export type MessageStatus = 'draft' | 'approved' | 'sent' | 'skipped' | 'bounced';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export type Region =
  | 'japan'
  | 'europe_west'
  | 'europe_north'
  | 'europe_central'
  | 'north_america'
  | 'uk'
  | 'australia_nz'
  | 'south_korea'
  | 'singapore'
  | 'middle_east'
  | 'south_america'
  | 'other';

// ============================================================
// Row types
// ============================================================

export interface Organization {
  id: string;
  name: string;
  short_name: string | null;
  country: string;
  region: Region;
  city: string | null;
  org_type: string;
  website: string | null;
  relevance_tags: string[];
  notes: string | null;
  scouted_at: string | null;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  title: string | null;
  role: string | null;
  organization_id: string | null;
  organization_name: string | null;
  country: string | null;
  region: Region | null;
  opportunity_type: OpportunityType;
  status: ContactStatus;
  priority: PriorityLevel;
  source: string | null;
  website: string | null;
  linkedin: string | null;
  google_scholar: string | null;
  relevance_score: number | null;
  relevance_reason: string | null;
  tags: string[];
  notes: string | null;
  next_action: string | null;
  next_action_date: string | null;
  last_contacted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  contact_id: string;
  subject: string;
  body: string;
  message_status: MessageStatus;
  message_type: string;
  version: number;
  ai_model: string | null;
  sent_at: string | null;
  opened_at: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  contact?: Contact;
}

export interface ScoutRun {
  id: string;
  region: Region | null;
  opportunity_types: OpportunityType[] | null;
  orgs_scouted: number;
  contacts_found: number;
  drafts_generated: number;
  model: string | null;
  notes: string | null;
  created_at: string;
}

export interface Settings {
  id: string;
  sender_name: string;
  sender_email: string;
  smtp_host: string;
  smtp_port: number;
  daily_send_limit: number;
  scout_schedule: string;
  active_regions: Region[];
  target_opportunity_types: OpportunityType[];
  created_at: string;
  updated_at: string;
}

// ============================================================
// Dashboard stats
// ============================================================

export interface DashboardStats {
  total_contacts: number;
  by_status: Record<ContactStatus, number>;
  by_region: Record<Region, number>;
  by_opportunity: Record<OpportunityType, number>;
  by_priority: Record<PriorityLevel, number>;
  messages_drafted: number;
  messages_sent: number;
  messages_replied: number;
  response_rate: number;
  orgs_total: number;
  orgs_scouted: number;
  recent_activity: {
    contacts_added_7d: number;
    messages_sent_7d: number;
    replies_7d: number;
  };
}

// ============================================================
// UI helpers
// ============================================================

export const REGION_LABELS: Record<Region, string> = {
  japan: '🇯🇵 Japan',
  europe_west: '🇪🇺 Western Europe',
  europe_north: '🇸🇪 Northern Europe',
  europe_central: '🇩🇪 Central Europe',
  north_america: '🇺🇸 North America',
  uk: '🇬🇧 United Kingdom',
  australia_nz: '🇦🇺 Australia & NZ',
  south_korea: '🇰🇷 South Korea',
  singapore: '🇸🇬 Singapore',
  middle_east: '🇦🇪 Middle East',
  south_america: '🇧🇷 South America',
  other: '🌍 Other',
};

export const STATUS_LABELS: Record<ContactStatus, string> = {
  identified: 'Identified',
  researched: 'Researched',
  drafted: 'Drafted',
  sent: 'Sent',
  followed_up: 'Followed Up',
  replied: 'Replied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  not_interested: 'Not Interested',
  archived: 'Archived',
};

export const OPPORTUNITY_LABELS: Record<OpportunityType, string> = {
  research_internship: 'Research Internship',
  visiting_researcher: 'Visiting Researcher',
  full_time: 'Full-Time Role',
  masters_lab: "Master's Lab Position",
  phd_position: 'PhD Position',
  fellowship: 'Fellowship',
  exchange_program: 'Exchange Program',
  lab_assistant: 'Lab Assistant',
  industry_partner: 'Industry Partner',
  conference_contact: 'Conference Contact',
  accelerator: 'Accelerator',
  government_program: 'Govt. Program',
  startup_role: 'Startup Role',
  postdoc: 'Postdoc',
};

export const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  critical: '🔴 Critical',
  high: '🟠 High',
  medium: '🔵 Medium',
  low: '⚪ Low',
};
