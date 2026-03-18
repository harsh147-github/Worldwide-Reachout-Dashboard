import nodemailer from 'nodemailer';
import { createServerClient } from './supabase';

const IS_MOCK = !process.env.SMTP_PASS;

function getTransporter() {
  if (IS_MOCK) {
    console.log('📧 SMTP running in MOCK mode (no SMTP_PASS set)');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendEmail(messageId: string) {
  const supabase = createServerClient();

  const { data: message } = await supabase
    .from('messages')
    .select('*, contacts(name, email)')
    .eq('id', messageId)
    .single();

  if (!message) throw new Error(`Message not found: ${messageId}`);

  const contact = (message as any).contacts;
  if (!contact?.email) throw new Error(`No email for contact: ${contact?.name}`);

  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .limit(1)
    .single();

  if (IS_MOCK) {
    console.log(`📧 [MOCK] Would send to ${contact.email}: ${message.subject}`);
    await supabase
      .from('messages')
      .update({ message_status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', messageId);
    await supabase
      .from('contacts')
      .update({ status: 'sent', last_contacted_at: new Date().toISOString() })
      .eq('id', message.contact_id);
    return { mock: true, to: contact.email };
  }

  const transporter = getTransporter()!;
  await transporter.sendMail({
    from: `"${settings?.sender_name || 'Harsh Sonavane'}" <${settings?.sender_email || process.env.SMTP_USER}>`,
    to: contact.email,
    subject: message.subject,
    text: message.body,
    html: message.body.replace(/\n/g, '<br>'),
  });

  await supabase
    .from('messages')
    .update({ message_status: 'sent', sent_at: new Date().toISOString() })
    .eq('id', messageId);

  await supabase
    .from('contacts')
    .update({ status: 'sent', last_contacted_at: new Date().toISOString() })
    .eq('id', message.contact_id);

  return { sent: true, to: contact.email };
}

export async function sendAllApproved() {
  const supabase = createServerClient();

  const { data: messages } = await supabase
    .from('messages')
    .select('id')
    .eq('message_status', 'approved');

  if (!messages?.length) return { sent: 0 };

  const results = [];
  for (const msg of messages) {
    try {
      const result = await sendEmail(msg.id);
      results.push({ id: msg.id, ...result });
      await new Promise((r) => setTimeout(r, 2000)); // 2s between emails
    } catch (err) {
      results.push({ id: msg.id, error: String(err) });
    }
  }

  return { sent: results.filter((r) => !('error' in r)).length, results };
}

export function getSmtpStatus() {
  return {
    configured: !IS_MOCK,
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    user: process.env.SMTP_USER || 'not set',
  };
}
