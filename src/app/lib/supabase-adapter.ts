// ============================================================
// OutDo — Supabase Data Adapter for CRM Leads
// Bridges Supabase (snake_case) → existing CRMLead format (camelCase)
// This lets us swap the data source without rewriting every page
// ============================================================

import { supabase } from './supabase';
import type { CRMLead, CRMDatabase, LeadQuality, SampleStatus } from '../data/crm';

// ---------- Fetch all leads (returns existing CRMLead format) ----------
export async function fetchAllLeadsLive(): Promise<CRMLead[]> {
  const { data, error } = await supabase
    .from('crm_leads')
    .select(`
      *,
      assigned_user:users!crm_leads_assigned_user_id_fkey(id, name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  // Fetch follow-ups for all leads
  const leadIds = data.map((l: any) => l.id);
  const { data: allFollowUps } = await supabase
    .from('lead_follow_ups')
    .select('*')
    .in('lead_id', leadIds)
    .order('date', { ascending: false });

  const followUpsByLead: Record<string, any[]> = {};
  (allFollowUps || []).forEach((fu: any) => {
    if (!followUpsByLead[fu.lead_id]) followUpsByLead[fu.lead_id] = [];
    followUpsByLead[fu.lead_id].push(fu);
  });

  return data.map((row: any) => mapToLegacyLead(row, followUpsByLead[row.id] || []));
}

// ---------- Fetch leads by database type ----------
export async function fetchLeadsByDatabaseLive(dbType: CRMDatabase): Promise<CRMLead[]> {
  const { data, error } = await supabase
    .from('crm_leads')
    .select(`
      *,
      assigned_user:users!crm_leads_assigned_user_id_fkey(id, name)
    `)
    .eq('database_type', dbType)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  const leadIds = data.map((l: any) => l.id);
  const { data: allFollowUps } = await supabase
    .from('lead_follow_ups')
    .select('*')
    .in('lead_id', leadIds)
    .order('date', { ascending: false });

  const followUpsByLead: Record<string, any[]> = {};
  (allFollowUps || []).forEach((fu: any) => {
    if (!followUpsByLead[fu.lead_id]) followUpsByLead[fu.lead_id] = [];
    followUpsByLead[fu.lead_id].push(fu);
  });

  return data.map((row: any) => mapToLegacyLead(row, followUpsByLead[row.id] || []));
}

// ---------- Fetch single lead by display_id ----------
export async function fetchLeadByIdLive(displayId: string): Promise<CRMLead | null> {
  const { data, error } = await supabase
    .from('crm_leads')
    .select(`
      *,
      assigned_user:users!crm_leads_assigned_user_id_fkey(id, name)
    `)
    .eq('display_id', displayId)
    .maybeSingle();

  if (error || !data) return null;

  const { data: followUps } = await supabase
    .from('lead_follow_ups')
    .select('*')
    .eq('lead_id', data.id)
    .order('date', { ascending: false });

  return mapToLegacyLead(data, followUps || []);
}

// ---------- Create a new lead ----------
export async function createLeadLive(lead: {
  database: CRMDatabase;
  businessName: string;
  contactPerson: string;
  mobile: string;
  email?: string;
  city?: string;
  state?: string;
  territory?: string;
  zone?: string;
  source?: string;
  quality?: string;
  assignedUserId?: string;
  notes?: string;
}): Promise<CRMLead | null> {
  // Generate next display ID
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
    .insert({
      display_id,
      database_type: lead.database,
      business_name: lead.businessName,
      contact_person: lead.contactPerson,
      mobile: lead.mobile,
      email: lead.email || null,
      city: lead.city || null,
      state: lead.state || null,
      territory: lead.territory || null,
      zone: lead.zone || null,
      source: lead.source || null,
      quality: lead.quality || 'cold',
      assigned_user_id: lead.assignedUserId || null,
      notes: lead.notes || null,
    })
    .select(`
      *,
      assigned_user:users!crm_leads_assigned_user_id_fkey(id, name)
    `)
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    return null;
  }

  return mapToLegacyLead(data, []);
}

// ---------- Update a lead ----------
export async function updateLeadLive(displayId: string, updates: Partial<{
  quality: string;
  sampleStatus: string;
  notes: string;
  lostReason: string;
  nextFollowUp: string;
}>): Promise<boolean> {
  const dbUpdates: Record<string, any> = {};
  if (updates.quality !== undefined) dbUpdates.quality = updates.quality;
  if (updates.sampleStatus !== undefined) dbUpdates.sample_status = updates.sampleStatus;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.lostReason !== undefined) {
    dbUpdates.lost_reason = updates.lostReason;
    dbUpdates.lost_date = new Date().toISOString().slice(0, 10);
  }
  if (updates.nextFollowUp !== undefined) dbUpdates.next_follow_up = updates.nextFollowUp;

  const { error } = await supabase
    .from('crm_leads')
    .update(dbUpdates)
    .eq('display_id', displayId);

  if (error) {
    console.error('Error updating lead:', error);
    return false;
  }
  return true;
}

// ---------- Add a follow-up ----------
export async function addFollowUpLive(displayId: string, followUp: {
  type: string;
  notes: string;
  outcome: string;
  nextAction: string;
  updatedBy: string;
  date: string;
}): Promise<boolean> {
  // Get the lead's UUID from display_id
  const { data: lead } = await supabase
    .from('crm_leads')
    .select('id')
    .eq('display_id', displayId)
    .maybeSingle();

  if (!lead) return false;

  const { error } = await supabase
    .from('lead_follow_ups')
    .insert({
      lead_id: lead.id,
      type: followUp.type,
      notes: followUp.notes,
      outcome: followUp.outcome,
      next_action: followUp.nextAction,
      updated_by: followUp.updatedBy,
      date: followUp.date,
    });

  if (error) {
    console.error('Error adding follow-up:', error);
    return false;
  }

  // Update lead's last follow-up date
  await supabase
    .from('crm_leads')
    .update({ last_follow_up: followUp.date })
    .eq('id', lead.id);

  return true;
}

// ---------- Fetch salespeople ----------
export async function fetchSalespeopleLive() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'salesperson')
    .eq('is_active', true)
    .order('name');

  if (error) return [];
  return data.map((u: any) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    city: u.city || '',
    territory: u.territory || '',
    zone: u.zone || '',
    leadsAssigned: 0,
    accountsConverted: 0,
  }));
}

// ======================== INTERNAL: Map Supabase row → CRMLead ========================

function mapToLegacyLead(row: any, followUps: any[]): CRMLead {
  return {
    id: row.display_id,
    database: row.database_type as CRMDatabase,
    businessName: row.business_name,
    contactPerson: row.contact_person,
    mobile: row.mobile,
    email: row.email || '',
    city: row.city || '',
    state: row.state || '',
    territory: row.territory || '',
    zone: row.zone || '',
    source: row.source || '',
    assignedUserId: row.assigned_user_id || '',
    assignedUserName: row.assigned_user?.name || '',
    quality: (row.quality || 'cold') as LeadQuality,
    sampleStatus: (row.sample_status || 'not_applicable') as SampleStatus,
    lastFollowUp: row.last_follow_up || '',
    nextFollowUp: row.next_follow_up || '',
    createdAt: row.created_at ? row.created_at.slice(0, 10) : '',
    conversionDate: row.conversion_date || null,
    convertedBy: row.converted_by || null,
    daysToConvert: row.days_to_convert || null,
    convertedAccountId: row.converted_account_id || null,
    lostReason: row.lost_reason || null,
    lostDate: row.lost_date || null,
    notes: row.notes || '',
    transferredToPartner: row.transferred_to_partner || null,
    followUpHistory: followUps.map((fu: any) => ({
      id: fu.id,
      date: fu.date,
      type: fu.type,
      notes: fu.notes || '',
      outcome: fu.outcome || '',
      nextAction: fu.next_action || '',
      updatedBy: fu.updated_by || '',
    })),
  };
}