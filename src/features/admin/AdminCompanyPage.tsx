import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import { Card } from '../../components/common/Card';
import { useLanguage } from '../../i18n/language';
import { useAuth } from '../auth/useAuth';
import { demoCompanies, downloadCompanyCsv } from './companyData';
import logo from '../../assets/logoDark.png';
import { LeadNotification } from '../contact/LeadNotification';

export function AdminCompanyPage({ page }: { page: 'dashboard' | 'billing' }) {
  const { language } = useLanguage();
  const th = language === 'th';
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const company = demoCompanies.find(item => item.id === params.get('company'));
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const results = demoCompanies.filter(item => item.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()));
  const title = page === 'dashboard' ? 'Dashboard' : 'Billing';
  const number = (value: number) => value.toLocaleString('en-US');
  const money = (value: number) => `฿${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const pending = company?.invoices.filter(row => row.status === 'pending').reduce((sum, row) => sum + row.amount, 0) ?? 0;
  const paid = company?.invoices.filter(row => row.status === 'paid').reduce((sum, row) => sum + row.amount, 0) ?? 0;
  const status = (value: string) => value === 'paid' ? (th ? 'ชำระแล้ว' : 'Paid') : (th ? 'รอชำระ' : 'Pending');
  const headers = page === 'dashboard'
    ? [th ? 'วันที่' : 'Date', 'Endpoint', 'HTTP status', th ? 'จำนวนคำขอ' : 'Requests']
    : [th ? 'เลขที่ใบแจ้งหนี้' : 'Invoice', th ? 'วันที่ออก' : 'Issued', th ? 'วันครบกำหนด' : 'Due', th ? 'จำนวนเงิน' : 'Amount', th ? 'สถานะ' : 'Status'];
  const rows = company ? (page === 'dashboard'
    ? company.activity.map(row => [row.date, row.endpoint, String(row.status), number(row.requests)])
    : company.invoices.map(row => [row.id, row.date, row.due, money(row.amount), status(row.status)])) : [];

  async function handleLogout() {
    setLoggingOut(true);
    setError('');
    try { await logout(); navigate('/login', { replace: true }); }
    catch { setError(th ? 'ออกจากระบบไม่สำเร็จ กรุณาลองอีกครั้ง' : 'Could not log out. Please retry.'); }
    finally { setLoggingOut(false); }
  }

  return <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">
    <aside className="flex shrink-0 flex-col border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-60 md:border-r">
      <div className="flex items-center gap-3 px-3 py-4"><img src={logo} alt="MyAPI" className="h-8 w-auto object-contain" /><span className="text-xs font-medium text-slate-500">Admin</span></div>
      <LeadNotification enabled />
      <nav aria-label={th ? 'เมนูแอดมิน' : 'Admin navigation'} className="flex flex-wrap gap-2 md:flex-col">
        {(['dashboard', 'billing'] as const).map(item => <Link key={item}
          to={`/${item}${company ? `?company=${encodeURIComponent(company.id)}` : ''}`}
          aria-current={page === item ? 'page' : undefined}
          className={`rounded-lg px-4 py-3 text-sm font-semibold ${page === item ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50'}`}
        >{item === 'dashboard' ? 'Dashboard' : 'Billing'}</Link>)}
      </nav>
      <button disabled={loggingOut} onClick={handleLogout} className="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-50 md:mt-auto">{th ? 'ออกจากระบบ' : 'Log out'}</button>
    </aside>
    <main className="min-w-0 flex-1">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-6 lg:px-10">
        <div><p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Admin console</p><h1 className="mt-2 text-2xl font-bold">{title}</h1><p className="mt-1 text-sm text-slate-500">{th ? 'ค้นหาและดูข้อมูลบริษัทลูกค้า' : 'Find and view customer company data'}</p></div>
        <LanguageSwitcher />
      </header>
      <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{th ? 'ข้อมูลตัวอย่างเท่านั้น — ยังไม่ได้เชื่อมต่อ API ข้อมูลบริษัทจริง ไฟล์ส่งออกเป็นข้อมูลตัวอย่างเช่นกัน' : 'Demo data only — a company data API is not connected. Exports also contain demo data.'}</p>
        {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1"><label htmlFor="company-search" className="mb-2 block text-sm font-semibold">{th ? 'ค้นหาชื่อบริษัท' : 'Search company name'}</label>
              <input id="company-search" type="search" value={search} placeholder={th ? 'พิมพ์ชื่อบริษัท เช่น สยาม' : 'Type a company name'}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                onChange={event => { setSearch(event.target.value); setParams({}, { replace: true }); setError(''); }} />
            </div>
            <button disabled={!company} className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() => { if (company) { try { downloadCompanyCsv(company, page); setError(''); } catch { setError(th ? 'ส่งออกไม่สำเร็จ กรุณาลองอีกครั้ง' : 'Export failed. Please retry.'); } } }}
            >{th ? 'ส่งออก CSV' : 'Export CSV'}</button>
          </div>
          <p className="mt-2 text-xs text-slate-500">{th ? 'เลือกบริษัทด้านล่าง แล้วส่งออกข้อมูลหน้านี้เพื่อเปิดใน Excel หรือ Google Sheets' : 'Select a company, then export this page for Excel or Google Sheets.'}</p>
          <div className="mt-4 flex flex-wrap gap-2" aria-label={th ? 'ผลการค้นหาบริษัท' : 'Company results'}>
            {results.map(item => <button key={item.id} aria-pressed={company?.id === item.id} onClick={() => { setParams({ company: item.id }, { replace: true }); setError(''); }}
              className={`rounded-lg border px-3 py-2 text-left text-sm ${company?.id === item.id ? 'border-indigo-500 bg-indigo-50 text-indigo-800' : 'border-slate-200 hover:bg-slate-50'}`}>{item.name}</button>)}
            {!results.length && <p role="status" className="text-sm text-slate-500">{th ? 'ไม่พบบริษัทที่ตรงกับการค้นหา' : 'No companies match your search.'}</p>}
          </div>
        </Card>
        {company ? <>
          <h2 className="text-lg font-bold">{company.name}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {(page === 'dashboard'
              ? [[th ? 'คำขอ API ทั้งหมด' : 'Total API requests', number(company.requests)], [th ? 'คำขอเดือนตุลาคม 2026' : 'Requests in October 2026', number(company.monthlyRequests)]]
              : [[th ? 'ยอดรอชำระ' : 'Outstanding amount', money(pending)], [th ? 'ยอดชำระแล้ว' : 'Paid amount', money(paid)]]
            ).map(([label, value]) => <Card key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold text-slate-950">{value}</p></Card>)}
          </div>
          <Card><h3 className="mb-4 font-semibold">{page === 'dashboard' ? (th ? 'สรุปการใช้งาน API' : 'API usage summary') : (th ? 'รายการใบแจ้งหนี้' : 'Invoices')}</h3>
            {rows.length ? <div className="overflow-x-auto"><table className="w-full whitespace-nowrap text-left text-sm">
              <thead><tr className="border-b border-slate-200 text-xs text-slate-500">{headers.map(header => <th key={header} scope="col" className="px-3 py-3">{header}</th>)}</tr></thead>
              <tbody>{rows.map((row, index) => <tr key={index} className="border-b border-slate-100 last:border-0">{row.map((cell, column) => <td key={column} className="px-3 py-4">{cell}</td>)}</tr>)}</tbody>
            </table></div> : <p role="status" className="py-6 text-sm text-slate-500">{th ? 'ยังไม่มีรายการสำหรับบริษัทนี้' : 'No records for this company yet.'}</p>}
          </Card>
        </> : <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">{th ? 'เลือกบริษัทเพื่อดูข้อมูล Dashboard หรือ Billing' : 'Select a company to view Dashboard or Billing data.'}</div>}
      </div>
    </main>
  </div>;
}
