# Outreach HQ — Worldwide Engineering Opportunity Dashboard

Personal outreach CRM for engineering opportunities worldwide. AI-powered contact discovery, personalized email drafting, and pipeline tracking across 80+ aerospace/composites/MDO organizations in 12 regions.

## Stack

- **Frontend:** Next.js 15 + React 19 + Tailwind CSS + Framer Motion
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL)
- **AI:** Anthropic Claude (lead scouting + email drafting)
- **Email:** Nodemailer (Gmail SMTP)
- **Deploy:** Vercel (free tier)

## Features

- **Dashboard** — Stats, region distribution, pipeline stages, quick actions
- **Contacts** — Full CRUD with search, filter by region/status/type/priority
- **Pipeline** — Kanban-style view: Identified → Researched → Drafted → Sent → Replied → Interview → Offer
- **Messages** — Email review queue, approve/skip/send, batch send, preview
- **AI Scout** — Claude-powered contact discovery at 80+ organizations worldwide
- **Settings** — SMTP config, API status, deployment checklist

## Seeded Organizations (80+)

| Region | Count | Examples |
|--------|-------|---------|
| Japan | 11 | JAXA, OIST, UTokyo, MHI, SkyDrive |
| Western Europe | 10 | Airbus, ONERA, TU Delft, EPFL, ETH |
| Central Europe | 12 | DLR, TUM, RWTH, Lilium, Volocopter, DAAD |
| Northern Europe | 6 | KTH, Saab, DTU, Aalto |
| UK | 9 | Bristol ACCIS, Imperial, Rolls-Royce, BAE |
| North America | 16 | Stanford, MIT, NASA, Joby, Boeing, Lockheed |
| Australia/NZ | 4 | USyd, RMIT, CSIRO, Boeing AU |
| South Korea | 3 | KAIST, KAI, KARI |
| Singapore | 3 | NUS, NTU, ST Engineering |
| Middle East | 3 | Khalifa, KAUST, Strata |
| Fellowships | 7 | JSPS, Fulbright, MSCA, DAAD, Mitacs, Commonwealth |

## Quick Start

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the two migration files:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_organizations.sql`
3. Copy your project URL and keys from Settings → API

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase dashboard
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase dashboard (keep secret)
- `ANTHROPIC_API_KEY` — from [console.anthropic.com](https://console.anthropic.com)
- `SMTP_PASS` — Gmail App Password (optional, mock mode without it)

### 3. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel (Free)

```bash
npm i -g vercel
vercel
```

Add all env vars in Vercel → Project → Settings → Environment Variables.

## Usage Workflow

1. **Scout** → Go to AI Scout, click "Scout All Regions" or scout individual orgs
2. **Review Contacts** → Check the Contacts page, verify AI-discovered contacts
3. **Generate Drafts** → Click the mail icon on a contact, or drafts auto-generate during scouting
4. **Review Emails** → Go to Messages → Drafts tab, read each email, approve or skip
5. **Send** → Send individually or batch-send all approved emails
6. **Track** → Monitor pipeline progress on the Pipeline page

## Cost

| Service | Cost |
|---------|------|
| Vercel (hosting) | Free |
| Supabase (database) | Free tier (500MB, 50K rows) |
| Anthropic API | ~$0.003/scout call, ~$0.002/draft |
| Gmail SMTP | Free (500 emails/day limit) |

**Total: ~$5-10 for scouting 80 orgs and drafting 200+ emails**

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Dashboard routes (with sidebar layout)
│   │   ├── dashboard/      # Main overview
│   │   ├── contacts/       # Contact management
│   │   ├── pipeline/       # Kanban pipeline view
│   │   ├── messages/       # Email review queue
│   │   ├── scout/          # AI lead scouting
│   │   └── settings/       # Configuration
│   ├── api/                # API routes
│   │   ├── contacts/       # CRUD + auto-draft
│   │   ├── messages/       # CRUD + approve/skip/send
│   │   ├── scout/          # AI scouting + draft generation
│   │   └── dashboard/      # Stats aggregation
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Design system
├── components/
│   ├── DashboardLayout.tsx # Sidebar + shell
│   └── ui.tsx              # Shared components
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── lead-scout.ts       # AI scout engine
│   └── smtp.ts             # Email service
├── types/
│   └── index.ts            # TypeScript types
└── supabase/
    └── migrations/         # SQL schema + seed data
```

## Adding Organizations

Add rows to the `organizations` table in Supabase, or add to the seed SQL file and re-run.

## License

Personal project — Harsh Sonavane
