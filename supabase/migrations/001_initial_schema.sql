-- ============================================================
-- OUTREACH DASHBOARD — Worldwide Engineering Opportunities
-- Supabase Migration: Initial Schema
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE opportunity_type AS ENUM (
  'research_internship',
  'visiting_researcher',
  'full_time',
  'masters_lab',
  'phd_position',
  'fellowship',
  'exchange_program',
  'lab_assistant',
  'industry_partner',
  'conference_contact',
  'accelerator',
  'government_program',
  'startup_role',
  'postdoc'
);

CREATE TYPE contact_status AS ENUM (
  'identified',
  'researched',
  'drafted',
  'sent',
  'followed_up',
  'replied',
  'interview',
  'offer',
  'rejected',
  'not_interested',
  'archived'
);

CREATE TYPE message_status AS ENUM (
  'draft',
  'approved',
  'sent',
  'skipped',
  'bounced'
);

CREATE TYPE priority_level AS ENUM (
  'critical',   -- dream positions, deadline soon
  'high',       -- strong match, active openings
  'medium',     -- good fit, no urgency
  'low'         -- speculative / long-shot
);

CREATE TYPE region AS ENUM (
  'japan',
  'europe_west',
  'europe_north',
  'europe_central',
  'north_america',
  'uk',
  'australia_nz',
  'south_korea',
  'singapore',
  'middle_east',
  'south_america',
  'other'
);

-- ============================================================
-- ORGANIZATIONS (seed list of worldwide targets)
-- ============================================================

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT,                        -- e.g. "DLR", "ONERA"
  country TEXT NOT NULL,
  region region NOT NULL,
  city TEXT,
  org_type TEXT NOT NULL,                 -- 'university', 'research_lab', 'aerospace_company', 'defense', 'evtol_startup', 'national_lab', 'fellowship', 'accelerator'
  website TEXT,
  relevance_tags TEXT[] DEFAULT '{}',     -- e.g. {'composites', 'mdo', 'uav', 'evtol', 'cfd'}
  notes TEXT,
  scouted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACTS (people to reach out to)
-- ============================================================

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  title TEXT,                             -- "Professor", "HR Manager", "CTO"
  role TEXT,                              -- "PI - Composite Structures Lab"
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  organization_name TEXT,                 -- denormalized for quick display
  country TEXT,
  region region,
  opportunity_type opportunity_type NOT NULL DEFAULT 'research_internship',
  status contact_status NOT NULL DEFAULT 'identified',
  priority priority_level NOT NULL DEFAULT 'medium',
  source TEXT,                            -- where you found them: "lab website", "linkedin", "conference", "ai_scout"
  website TEXT,
  linkedin TEXT,
  google_scholar TEXT,
  relevance_score REAL,                   -- 0-1, computed by AI scout
  relevance_reason TEXT,                  -- why this person is relevant
  tags TEXT[] DEFAULT '{}',               -- e.g. {'composites', 'cfd', 'evtol'}
  notes TEXT,
  next_action TEXT,                       -- "send cold email", "follow up in 1 week"
  next_action_date DATE,
  last_contacted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MESSAGES (email drafts and sent messages)
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  message_status message_status NOT NULL DEFAULT 'draft',
  message_type TEXT DEFAULT 'cold_email', -- 'cold_email', 'follow_up', 'thank_you', 'application'
  version INT DEFAULT 1,                  -- track iterations
  ai_model TEXT,                          -- which model generated it
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,                  -- future: email tracking
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SCOUT RUNS (track AI scouting sessions)
-- ============================================================

CREATE TABLE scout_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region region,
  opportunity_types opportunity_type[],
  orgs_scouted INT DEFAULT 0,
  contacts_found INT DEFAULT 0,
  drafts_generated INT DEFAULT 0,
  model TEXT,
  prompt_tokens INT,
  completion_tokens INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SETTINGS
-- ============================================================

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_name TEXT DEFAULT 'Harsh Sonavane',
  sender_email TEXT DEFAULT 'sonawaneharsh147@gmail.com',
  smtp_host TEXT DEFAULT 'smtp.gmail.com',
  smtp_port INT DEFAULT 587,
  anthropic_api_key TEXT,                 -- encrypted in prod
  daily_send_limit INT DEFAULT 20,
  scout_schedule TEXT DEFAULT '0 6 * * *', -- cron expression
  active_regions region[] DEFAULT '{japan,europe_west,north_america}',
  target_opportunity_types opportunity_type[] DEFAULT '{research_internship,visiting_researcher,full_time,masters_lab}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_region ON contacts(region);
CREATE INDEX idx_contacts_opportunity ON contacts(opportunity_type);
CREATE INDEX idx_contacts_priority ON contacts(priority);
CREATE INDEX idx_contacts_org ON contacts(organization_id);
CREATE INDEX idx_contacts_next_action ON contacts(next_action_date) WHERE next_action_date IS NOT NULL;
CREATE INDEX idx_messages_status ON messages(message_status);
CREATE INDEX idx_messages_contact ON messages(contact_id);
CREATE INDEX idx_orgs_region ON organizations(region);
CREATE INDEX idx_orgs_country ON organizations(country);
CREATE INDEX idx_orgs_tags ON organizations USING GIN(relevance_tags);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contacts_modtime
  BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_messages_modtime
  BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_settings_modtime
  BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ============================================================
-- ROW LEVEL SECURITY (Supabase)
-- ============================================================

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (single-user app)
-- In prod, lock these down to authenticated user
CREATE POLICY "Allow all on organizations" ON organizations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on contacts" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on messages" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on scout_runs" ON scout_runs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on settings" ON settings FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- SEED: Default settings row
-- ============================================================

INSERT INTO settings (sender_name, sender_email) VALUES ('Harsh Sonavane', 'sonawaneharsh147@gmail.com');
