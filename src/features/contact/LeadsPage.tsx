import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { RequireAuth } from '../auth/RouteGuards';
import { useAdminAccess } from './useAdminAccess';
import { listLeads, updateLead, type Lead, type LeadPage, type LeadStatus } from './leadClient';
import './leads.css';
import { LeadNotification } from './LeadNotification';

const statuses: Record<LeadStatus, string> = { new: 'ใหม่', contacted: 'ติดต่อแล้ว', closed: 'ปิดงาน' };
const notifications = { pending: 'รอแจ้งเตือน', sent: 'ส่งแจ้งเตือนแล้ว', failed: 'แจ้งเตือนไม่สำเร็จ' };
function displayDate(value: Lead['createdAt']) { return value ? new Date(value).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }) : '—'; }

function LeadEditor({ lead, onSaved, onDirtyChange }: { lead: Lead; onSaved: () => void; onDirtyChange: (dirty: boolean) => void }) {
  const [status, setStatus] = useState(lead.status);
  const [note, setNote] = useState(lead.note);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const lock = useRef(false);
  async function save(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    lock.current = true; setSaving(true); setError('');
    try { await updateLead(lead, status, note); onSaved(); }
    catch (failure) {
      setError(failure instanceof Error && failure.message.startsWith('ข้อมูลถูกแก้ไข') ? failure.message : 'บันทึกไม่สำเร็จ กรุณาลองใหม่หรือตรวจสอบสิทธิ์ของบัญชี');
    } finally { lock.current = false; setSaving(false); }
  }
  return <section className="leads-detail" aria-label="รายละเอียดคำขอ">
    <h2>{lead.fullName}</h2><p className="leads-muted">รับเมื่อ {displayDate(lead.createdAt)}</p>
    <dl>{[['บริษัท', lead.company], ['เบอร์โทร', lead.phone], ['อีเมล', lead.email], ['เว็บไซต์', lead.website], ['ขนส่งที่สนใจ', lead.courier], ['เลขคำขอ', lead.id]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || '—'}</dd></div>)}</dl>
    <p className={`leads-notification ${lead.notificationStatus === 'failed' ? 'is-failed' : ''}`}>{notifications[lead.notificationStatus] ?? 'ไม่ทราบสถานะแจ้งเตือน'}</p>
    <form onSubmit={event => void save(event)}>
      <label htmlFor="lead-status">สถานะ<select id="lead-status" value={status} disabled={saving} onChange={event => { setStatus(event.target.value as LeadStatus); onDirtyChange(event.target.value !== lead.status || note !== lead.note); }}>{Object.entries(statuses).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label htmlFor="lead-note">บันทึกของทีม<textarea id="lead-note" rows={5} maxLength={4000} value={note} disabled={saving} onChange={event => { setNote(event.target.value); onDirtyChange(event.target.value !== lead.note || status !== lead.status); }} /></label>
      {error && <p className="leads-error" role="alert">{error}</p>}
      <button className="leads-primary" type="submit" disabled={saving}>{saving ? 'กำลังบันทึก…' : 'บันทึกการติดตาม'}</button>
      {(status !== lead.status || note !== lead.note) && <button type="button" disabled={saving} onClick={() => { setStatus(lead.status); setNote(lead.note); setError(''); onDirtyChange(false); }}>ยกเลิกการแก้ไข</button>}
    </form>
  </section>;
}

function LeadsInbox() {
  const [page, setPage] = useState<LeadPage>({ leads: [], cursor: undefined, hasMore: false });
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [dirty, setDirty] = useState(false);
  const alive = useRef(true);
  const busy = useRef(false);
  const generation = useRef(0);

  async function load(more = false) {
    if (busy.current) return;
    busy.current = true; setLoading(true); setError('');
    if (!more) setSelected(null);
    const request = ++generation.current;
    try {
      const result = await listLeads(more ? page.cursor : undefined);
      if (!alive.current || request !== generation.current) return;
      setPage(previous => ({ ...result, leads: more ? [...previous.leads, ...result.leads] : result.leads }));
      if (!more) setSelected(null);
    } catch {
      if (alive.current) {
        setError('โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่ หรือตรวจสอบสิทธิ์และการเชื่อมต่อ');
        if (!more) { setPage({ leads: [], cursor: undefined, hasMore: false }); setSelected(null); }
      }
    } finally { busy.current = false; if (alive.current) setLoading(false); }
  }
  useEffect(() => {
    alive.current = true;
    void load();
    return () => { alive.current = false; };
    // Initial fetch only. Later fetches happen explicitly through buttons.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = page.leads.filter(lead => (filter === 'all' || lead.status === filter) && [lead.fullName, lead.company, lead.email, lead.phone, lead.id].join(' ').toLowerCase().includes(search.toLowerCase()));
  const selectedLead = page.leads.find(lead => lead.id === selected);
  return <>
    <div className="leads-toolbar">
      <label>ค้นหาในรายการที่โหลดแล้ว<input type="search" placeholder="ชื่อ บริษัท อีเมล หรือเบอร์โทร" value={search} onChange={event => setSearch(event.target.value)} /></label>
      <label>กรองสถานะ<select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">ทุกสถานะ</option>{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <button disabled={loading || dirty} onClick={() => { setNotice(''); void load(); }}>โหลดใหม่</button>
    </div>
    <p className="leads-muted">โหลดแล้ว {page.leads.length} รายการ · เรียงจากใหม่ไปเก่า · เวลาไทย</p>
    {dirty && <p role="status" className="leads-muted">มีข้อมูลที่ยังไม่บันทึก กรุณาบันทึกหรือยกเลิกการแก้ไขก่อนเปลี่ยนรายการหรือโหลดใหม่</p>}
    {notice && <p className="leads-success" role="status">{notice}</p>}
    {error && <p className="leads-error" role="alert">{error}</p>}
    <div className="leads-grid">
      <section className="leads-list" aria-label="รายการคำขอติดต่อ" aria-busy={loading}>
        {!loading && !error && visible.length === 0 && <p className="leads-empty">{page.leads.length ? 'ไม่พบรายการที่ตรงกับการค้นหา' : 'ยังไม่มีคำขอติดต่อ'}</p>}
        {visible.map(lead => <button key={lead.id} disabled={loading || (dirty && selected !== lead.id)} className={`leads-item ${selected === lead.id ? 'is-selected' : ''}`} aria-pressed={selected === lead.id} onClick={() => setSelected(lead.id)}><span className="leads-item-heading"><strong>{lead.fullName}</strong><span className={`leads-badge ${lead.status}`}>{statuses[lead.status]}</span></span><span>{lead.company || lead.email}</span><span className="leads-muted">{displayDate(lead.createdAt)}</span></button>)}
        {loading && <p role="status" className="leads-empty">กำลังโหลดข้อมูล…</p>}
        {page.hasMore && <button className="leads-load-more" disabled={loading || dirty} onClick={() => void load(true)}>โหลดเพิ่ม 25 รายการ</button>}
      </section>
      {selectedLead ? <LeadEditor key={selectedLead.id} lead={selectedLead} onDirtyChange={setDirty} onSaved={() => { setDirty(false); setNotice('บันทึกการติดตามแล้ว'); setSelected(null); void load(); }} /> : <div className="leads-detail leads-placeholder">เลือกรายการเพื่อดูรายละเอียดและติดตามลูกค้า</div>}
    </div>
  </>;
}

function AdminContent() {
  const { user, loading, allowed, error } = useAdminAccess();
  if (loading) return <p role="status">กำลังตรวจสอบสิทธิ์…</p>;
  if (!allowed) return <p role="alert">{error ? 'ตรวจสอบสิทธิ์ไม่สำเร็จ กรุณาโหลดหน้าใหม่' : 'บัญชีนี้ไม่มีสิทธิ์ดูข้อมูลลูกค้า ต้องใช้บัญชีทีมที่ยืนยันอีเมลและได้รับสิทธิ์ผู้ดูแลแล้ว'}</p>;
  return <div key={user!.id}><LeadNotification enabled /><LeadsInbox /></div>;
}

export function LeadsPage() {
  return <RequireAuth><main className="leads-page"><header className="leads-header"><div><Link to="/dashboard">← กลับหน้าหลัก</Link><h1>คำขอติดต่อจากลูกค้า</h1><p>ติดตามลูกค้าที่สนใจบริการ MyAPI</p></div></header><AdminContent /></main></RequireAuth>;
}
