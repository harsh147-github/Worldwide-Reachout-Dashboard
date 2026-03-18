import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from './supabase';
import type { Region, OpportunityType, Contact } from '@/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ============================================================
// HARSH'S PROFILE (used in all AI prompts)
// ============================================================

const PROFILE = `
CANDIDATE: Harsh Sanjay Sonavane
ROLE: Aero-Structural Engineer at Paninian Aerospace India
EDUCATION: B.Tech Mechanical Engineering, VIT Pune (CGPA 8.85/10, Top 5%)

CORE EXPERTISE:
- Composite airframe design for high-speed UAVs/missiles (Mach 0.9, 7G envelopes)
- FEA/CAE: NASTRAN, FEMAP, Ansys (Mechanical, ACP, LS-DYNA, Explicit Dynamics), Abaqus
- 3D CAD: CATIA V5, SolidWorks, Siemens NX, Autodesk Fusion 360, OpenVSP
- CFD: Star-CCM+, Ansys Fluent, OpenFOAM
- Multidisciplinary Design Optimization (MDO): pyNastran, PyOptSparse, OpenFOAM coupling
- Physics-Informed ML for aerodynamic design (1000+ parametric CFD → 8hr design cycles)
- Composite manufacturing: CFRP/GFRP layup, vacuum bagging, RTM, autoclave
- Mechatronics: sensor DAQ, actuator control, VFD, embedded C/C++
- Python (scientific computing), MATLAB Simulink, Fortran

KEY ACHIEVEMENTS:
- Designed complete composite airframe + wing deployment mechanism for Mach 0.5 missile launch
- Topology-optimised blended wing body monocoque: -30% weight, +20% FoS
- Built in-house MDO workflow coupling parametric geometry, aero, structures
- FSAE: Led team to World Rank 2 (Combustion), AIR 1 x2, designed 400N CFRP aero package
- DRDO research: Nonlinear FEA of high-velocity impacts (250-500 m/s) on composite aircraft
- Springer 2024 publication, 2 patents (South African, Indian pending)
- Forbes Marshall Best Project Award (PINN-based aerodynamic optimisation)
- Open-source: Super-Aerostructural-Optimizer on GitHub

RESEARCH INTEREST:
- eVTOL for emergency medical services in infrastructure-challenged regions
- Morphing wing geometries in ducted rotors
- Reduced-order modelling (targeting Stanford, Prof. Charbel Farhat's PROMANN group)
- Making structural analysis faster and more accessible via ML surrogates

GOAL: International exposure before Master's applications (Fall 2026/2027). Open to research internships, visiting researcher positions, full-time roles, fellowships — anywhere outside India.
`;

// ============================================================
// SCOUT: Find contacts at an organization
// ============================================================

export async function scoutOrganization(orgId: string) {
  const supabase = createServerClient();

  const { data: org } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single();

  if (!org) throw new Error(`Organization not found: ${orgId}`);

  const prompt = `You are an expert research assistant helping an aerospace engineer find the right people to contact at ${org.name} (${org.short_name || ''}) in ${org.city}, ${org.country}.

${PROFILE}

ORGANIZATION CONTEXT:
- Name: ${org.name}
- Type: ${org.org_type}
- Country: ${org.country}
- Website: ${org.website || 'N/A'}
- Relevance tags: ${org.relevance_tags?.join(', ') || 'N/A'}

TASK: Identify 2-4 specific people at this organization that Harsh should reach out to. For each person, provide:
1. Full name
2. Their title/position
3. Their specific role (e.g., "PI - Composite Structures Lab", "Head of Aerostructures R&D")
4. Why they're relevant to Harsh's profile (1 sentence)
5. Suggested opportunity type (research_internship, visiting_researcher, full_time, masters_lab, phd_position, fellowship, startup_role, industry_partner)
6. Priority (critical, high, medium, low)
7. Suggested email subject line
8. Their likely email pattern if from a university (e.g., firstname.lastname@university.edu)

Focus on:
- For universities: Lab PIs working on composites, MDO, computational structures, eVTOL, UAV structures
- For companies: Engineering managers, R&D leads, CTO/VP Engineering, talent acquisition for specific aerostructures teams
- For national labs: Research group leads in relevant divisions
- For startups: CTOs, lead structural engineers, founders

Respond ONLY in valid JSON array format:
[
  {
    "name": "Full Name",
    "title": "Professor / Dr. / Mr./Ms.",
    "role": "PI - Composite Structures Group",
    "relevance_reason": "Why relevant to Harsh",
    "opportunity_type": "research_internship",
    "priority": "high",
    "suggested_subject": "Email subject line",
    "likely_email": "email@university.edu or null",
    "tags": ["composites", "mdo"]
  }
]`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let contacts: any[];
  try {
    contacts = JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    console.error('Failed to parse scout response:', text);
    return { contacts: [], raw: text };
  }

  // Insert contacts into DB
  const inserted: Contact[] = [];
  for (const c of contacts) {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        name: c.name,
        email: c.likely_email || null,
        title: c.title,
        role: c.role,
        organization_id: org.id,
        organization_name: org.name,
        country: org.country,
        region: org.region,
        opportunity_type: c.opportunity_type || 'research_internship',
        status: 'identified',
        priority: c.priority || 'medium',
        source: 'ai_scout',
        relevance_reason: c.relevance_reason,
        tags: c.tags || org.relevance_tags || [],
        notes: `Suggested subject: ${c.suggested_subject}`,
      })
      .select()
      .single();

    if (data) inserted.push(data as Contact);
    if (error) console.error('Insert error:', error);
  }

  // Mark org as scouted
  await supabase
    .from('organizations')
    .update({ scouted_at: new Date().toISOString() })
    .eq('id', org.id);

  return { contacts: inserted, raw: text };
}

// ============================================================
// BATCH SCOUT: Scout multiple orgs by region
// ============================================================

export async function scoutByRegion(region: Region, limit = 5) {
  const supabase = createServerClient();

  // Get unscouted orgs in this region
  const { data: orgs } = await supabase
    .from('organizations')
    .select('id, name')
    .eq('region', region)
    .is('scouted_at', null)
    .limit(limit);

  if (!orgs?.length) return { message: `No unscouted orgs in ${region}`, results: [] };

  const results = [];
  for (const org of orgs) {
    try {
      const result = await scoutOrganization(org.id);
      results.push({ org: org.name, ...result });
      // Rate limit: 1 second between calls
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`Scout failed for ${org.name}:`, err);
      results.push({ org: org.name, contacts: [], error: String(err) });
    }
  }

  // Log scout run
  const totalContacts = results.reduce((sum, r) => sum + r.contacts.length, 0);
  await supabase.from('scout_runs').insert({
    region,
    orgs_scouted: orgs.length,
    contacts_found: totalContacts,
    model: 'claude-sonnet-4-20250514',
    notes: `Scouted: ${orgs.map((o) => o.name).join(', ')}`,
  });

  return { message: `Scouted ${orgs.length} orgs, found ${totalContacts} contacts`, results };
}

// ============================================================
// DRAFT EMAIL: Generate personalized cold email
// ============================================================

export async function generateDraft(contactId: string) {
  const supabase = createServerClient();

  const { data: contact } = await supabase
    .from('contacts')
    .select('*, organizations!contacts_organization_id_fkey(name, org_type, website, relevance_tags)')
    .eq('id', contactId)
    .single();

  if (!contact) throw new Error(`Contact not found: ${contactId}`);

  const org = (contact as any).organizations;
  const isAcademic = ['university', 'research_lab', 'national_lab'].includes(org?.org_type || '');

  const prompt = `You are writing a cold outreach email for Harsh Sonavane to ${contact.name}.

${PROFILE}

RECIPIENT:
- Name: ${contact.name}
- Title: ${contact.title || 'N/A'}
- Role: ${contact.role || 'N/A'}
- Organization: ${contact.organization_name || 'N/A'} (${org?.org_type || 'N/A'})
- Country: ${contact.country || 'N/A'}
- Why relevant: ${contact.relevance_reason || 'N/A'}
- Opportunity type: ${contact.opportunity_type}
- Tags: ${contact.tags?.join(', ') || 'N/A'}

RULES:
${isAcademic ? `
- This is an ACADEMIC email to a professor/researcher
- Lead with Harsh's eVTOL-for-India research motivation — it's compelling and memorable
- Cite 1-2 specific papers or projects from the recipient's lab (infer from role/tags)
- Mention specific technical overlap (composites FEA, MDO pipelines, PIML)
- Keep it postdoc-casual, not stiff. Direct. No hedging. No "I hope this finds you well."
- Ask about visiting researcher / research internship / Master's opportunities
- 150-200 words max. Short paragraphs.
` : `
- This is a PROFESSIONAL email to an industry contact
- Lead with the most impressive credential: Mach 0.9 composite airframe design, FSAE World Rank 2
- Highlight hands-on manufacturing + computational skills (rare combo)
- Mention specific technical match to the company's work
- Be direct about what you're looking for: full-time role, internship, or collaboration
- 150-200 words max. Professional but not corporate-stiff.
`}
- Sign off as "Harsh Sonavane" with links to LinkedIn and GitHub
- Subject line should be specific and non-generic (not "Inquiry about opportunities")

Respond ONLY in JSON:
{
  "subject": "Email subject line",
  "body": "Full email body with line breaks as \\n"
}`;

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  let draft: { subject: string; body: string };
  try {
    draft = JSON.parse(text.replace(/```json|```/g, '').trim());
  } catch {
    console.error('Failed to parse draft:', text);
    throw new Error('Failed to generate email draft');
  }

  // Save to messages table
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      contact_id: contactId,
      subject: draft.subject,
      body: draft.body,
      message_status: 'draft',
      message_type: 'cold_email',
      ai_model: 'claude-sonnet-4-20250514',
    })
    .select()
    .single();

  // Update contact status
  await supabase
    .from('contacts')
    .update({ status: 'drafted' })
    .eq('id', contactId);

  if (error) throw error;
  return message;
}
