import { getSupabase } from '../../config/supabase';
export type LeadStatus = 'new' | 'contacted' | 'closed';
export type Lead = {
  id: string; fullName: string; company: string; phone: string; email: string; website: string; courier: string;
  status: LeadStatus; note: string; notificationStatus: 'pending' | 'sent' | 'failed';
  createdAt: string; updatedAt: string;
};
export type LeadPage = { leads: Lead[]; cursor: { createdAt: string; id: string } | undefined; hasMore: boolean };
export async function listLeads(cursor?: LeadPage['cursor']): Promise<LeadPage> {
  let query = getSupabase().from('myapi_contact_leads').select('id,fullName,company,phone,email,website,courier,status,note,notificationStatus,createdAt,updatedAt')
    .order('createdAt', { ascending: false }).order('id', { ascending: false }).limit(25);
  if (cursor) query = query.or(`createdAt.lt.${cursor.createdAt},and(createdAt.eq.${cursor.createdAt},id.lt.${cursor.id})`);
  const { data, error } = await query;
  if (error) throw error;
  const leads = data as Lead[];
  const last = leads.at(-1);
  return { leads, cursor: last ? { createdAt: last.createdAt, id: last.id } : undefined, hasMore: leads.length === 25 };
}
export async function updateLead(lead: Lead, status: LeadStatus, note: string) {
  const { data, error } = await getSupabase().from('myapi_contact_leads').update({ status, note })
    .eq('id', lead.id).eq('updatedAt', lead.updatedAt).select('id');
  if (error) throw error;
  if (data.length !== 1) throw new Error('ข้อมูลถูกแก้ไขโดยทีมแล้ว กรุณาโหลดใหม่ก่อนบันทึก');
}
export async function countNewLeads() {
  const { count, error } = await getSupabase().from('myapi_contact_leads').select('id', { count: 'exact', head: true }).eq('status', 'new');
  if (error) throw error;
  return count ?? 0;
}
