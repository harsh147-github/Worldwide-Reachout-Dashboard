import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { generateDraft } from '@/lib/lead-scout';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search');
  const region = searchParams.get('region');
  const status = searchParams.get('status');
  const opportunity = searchParams.get('opportunity');
  const priority = searchParams.get('priority');
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  let query = supabase
    .from('contacts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) query = query.or(`name.ilike.%${search}%,organization_name.ilike.%${search}%,email.ilike.%${search}%`);
  if (region) query = query.eq('region', region);
  if (status) query = query.eq('status', status);
  if (opportunity) query = query.eq('opportunity_type', opportunity);
  if (priority) query = query.eq('priority', priority);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ contacts: data, total: count, page, limit });
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();

  const { data: contact, error } = await supabase
    .from('contacts')
    .insert({
      name: body.name,
      email: body.email || null,
      title: body.title || null,
      role: body.role || null,
      organization_name: body.organization_name || null,
      organization_id: body.organization_id || null,
      country: body.country || null,
      region: body.region || null,
      opportunity_type: body.opportunity_type || 'research_internship',
      status: body.status || 'identified',
      priority: body.priority || 'medium',
      source: body.source || 'manual',
      website: body.website || null,
      linkedin: body.linkedin || null,
      tags: body.tags || [],
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-generate draft if email is provided
  if (body.auto_draft && contact?.email) {
    try {
      await generateDraft(contact.id);
    } catch (err) {
      console.error('Auto-draft failed:', err);
    }
  }

  return NextResponse.json(contact, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
