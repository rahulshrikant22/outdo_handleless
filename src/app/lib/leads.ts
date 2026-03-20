import { supabase } from './supabase';

export interface DbLead {
  id: string;
  display_id: string;
  database_type: 'dealer' | 'factory' | 'architect' | 'organic';
  business_name: string;
  contact_person: string;
  mobile: string;
  email: string | null;
  city: string | null;
  state: string | null;
  territory: string | null;
  zone: string | null;
  source: string | null;
  quality: 'cold' | 'warm' | 'hot' | 'bad' | 'account';
  sample_status: 'pending' | 'provided' | 'not_applicable';
  assigned_user_id: string | null;
  converted_account_id: string | null;
  lost_reason: string | null;
  notes: string | null;
  last_follow_up: string | null;
  next_follow_up: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbFollowUp {
  id: string;
  lead_id: string;
  type: 'call' | 'email' | 'meeting' | 'whatsapp' | 'visit';
  notes: string | null;
  outcome: string | null;
  next_action: string | null;
  updated_by: string | null;
  date: string;
}

export interface DbUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  city: string | null;
  territory: string | null;
  zone: string | null;
}

export async function fetchLeads(filters?: {
  database_type?: string;
  quality?: string;
  city?: string;
  search?: string;
}) {
  let query = supabase
    .from('crm_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.database_type) query = query.eq('database_type', filters.database_type);
  if (filters?.quality) query = query.eq('quality', filters.quality);
  if (filters?.city) query = query.eq('city', filters.city);
  if (filters?.search) {
    query = query.or(
      `business_name.ilike.%${filters.search}%,contact_person.ilike.%${filters.search}%,display_id.ilike.%${filters.search}%`
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as DbLead[];
}

export async function fetchLeadById(displayId: string) {
  const { data, error } = await supabase
    .from('crm_leads')
    .select('*')
    .eq('display_id', displayId)
    .maybeSingle();

  if (error) throw error;
  return data as DbLead | null;
}

export async function createLead(lead: {
  database_type: string;
  business_name: string;
  contact_person: string;
  mobile: string;
  email?: string;
  city?: string;
  state?: string;
  territory?: string;
  zone?: string;
  source?: string;
  quality?: string;
  assigned_user_id?: string;
  notes?: string;
}) {
  const { data: lastLead } = await supabase
    .from('crm_leads')
    .select('display_id')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const lastNum = lastLead ? parseInt(lastLead.display_id.replace('CL', '')) : 0;
  const display_id = `CL${String(lastNum + 1).padStart(3, '0')}`;

  const { data, error } = await supabase
    .from('crm_leads')
    .insert({ display_id, ...lead })
    .select()
    .single();

  if (error) throw error;
  return data as DbLead;
}

export async function updateLead(id: string, updates: Partial<DbLead>) {
  const { id: _id, display_id: _did, created_at: _ca, ...safeUpdates } = updates;
  const { data, error } = await supabase
    .from('crm_leads')
    .update(safeUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as DbLead;
}

export async function deleteLead(id: string) {
  const { error } = await supabase.from('crm_leads').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchFollowUps(leadId: string) {
  const { data, error } = await supabase
    .from('lead_follow_ups')
    .select('*')
    .eq('lead_id', leadId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as DbFollowUp[];
}

export async function createFollowUp(followUp: {
  lead_id: string;
  type: string;
  notes?: string;
  outcome?: string;
  next_action?: string;
  updated_by?: string;
  date: string;
}) {
  const { data, error } = await supabase
    .from('lead_follow_ups')
    .insert(followUp)
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from('crm_leads')
    .update({ last_follow_up: followUp.date })
    .eq('id', followUp.lead_id);

  return data as DbFollowUp;
}

export async function fetchSalespeople() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'salesperson')
    .eq('is_active', true)
    .order('name');

  if (error) throw error;
  return data as DbUser[];
}

export async function fetchLeadStats() {
  const { data: leads, error } = await supabase
    .from('crm_leads')
    .select('quality, database_type');

  if (error) throw error;

  const total = leads?.length || 0;
  const hot = leads?.filter(l => l.quality === 'hot').length || 0;
  const warm = leads?.filter(l => l.quality === 'warm').length || 0;
  const cold = leads?.filter(l => l.quality === 'cold').length || 0;
  const converted = leads?.filter(l => l.quality === 'account').length || 0;
  const bad = leads?.filter(l => l.quality === 'bad').length || 0;

  return { total, hot, warm, cold, converted, bad };
}
export async function testConnection() {
  const { data, error } = await supabase.from('crm_leads').select('display_id, business_name, quality').limit(5);
  console.log('Supabase test:', { data, error });
  return { data, error };
}