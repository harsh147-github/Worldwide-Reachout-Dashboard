import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { scoutOrganization, scoutByRegion, generateDraft } from '@/lib/lead-scout';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { action, org_id, region, contact_id, limit } = body;

  try {
    if (action === 'scout_org' && org_id) {
      const result = await scoutOrganization(org_id);
      return NextResponse.json(result);
    }

    if (action === 'scout_region' && region) {
      const result = await scoutByRegion(region, limit || 5);
      return NextResponse.json(result);
    }

    if (action === 'generate_draft' && contact_id) {
      const result = await generateDraft(contact_id);
      return NextResponse.json(result);
    }

    if (action === 'scout_all') {
      // Scout all regions with unscouted orgs
      const supabase = createServerClient();
      const { data: regions } = await supabase
        .from('organizations')
        .select('region')
        .is('scouted_at', null);

      const uniqueRegions = [...new Set(regions?.map((r) => r.region) || [])];
      const results = [];

      for (const r of uniqueRegions) {
        const result = await scoutByRegion(r, limit || 3);
        results.push({ region: r, ...result });
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      return NextResponse.json({ regions_scouted: uniqueRegions.length, results });
    }

    return NextResponse.json({ error: 'Invalid action. Use: scout_org, scout_region, generate_draft, scout_all' }, { status: 400 });
  } catch (err) {
    console.error('Scout error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// GET: List organizations with scout status
export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);
  const region = searchParams.get('region');

  let query = supabase
    .from('organizations')
    .select('*')
    .order('region')
    .order('name');

  if (region) query = query.eq('region', region);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
