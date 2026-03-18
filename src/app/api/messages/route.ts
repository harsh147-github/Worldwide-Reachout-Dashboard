import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { sendEmail, sendAllApproved } from '@/lib/smtp';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const contactId = searchParams.get('contact_id');

  let query = supabase
    .from('messages')
    .select('*, contacts(name, email, organization_name, country, region)')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('message_status', status);
  if (contactId) query = query.eq('contact_id', contactId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { id, action, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  // Handle special actions
  if (action === 'approve') {
    const { data, error } = await supabase
      .from('messages')
      .update({ message_status: 'approved' })
      .eq('id', id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (action === 'skip') {
    const { data, error } = await supabase
      .from('messages')
      .update({ message_status: 'skipped' })
      .eq('id', id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (action === 'send') {
    try {
      const result = await sendEmail(id);
      return NextResponse.json(result);
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  if (action === 'send_all_approved') {
    try {
      const result = await sendAllApproved();
      return NextResponse.json(result);
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  }

  // Regular update (edit subject/body)
  const { data, error } = await supabase
    .from('messages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
