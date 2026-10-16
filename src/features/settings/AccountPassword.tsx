import { useRef, useState, type FormEvent } from 'react';
import { Card } from '../../components/common/Card';
import { getSupabase } from '../../config/supabase';
import { useLanguage } from '../../i18n/language';
import { useAuth } from '../auth/useAuth';
import { emailAuthError } from '../auth/emailAuthMessages';

export function AccountPassword() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  if (!user?.email) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    setError(''); setSuccess(false);
    if (password.length < 8) { setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'); return; }
    if (password !== confirmation) { setError('รหัสผ่านทั้งสองช่องไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง'); return; }
    submitting.current = true; setBusy(true);
    try {
      const auth = getSupabase().auth;
      const current = await auth.getUser();
      if (current.error) throw current.error;
      if (!current.data.user || current.data.user.id !== user?.id) throw { code: 'session_expired' };
      const { error } = await auth.updateUser({ password });
      if (error) throw error;
      setPassword(''); setConfirmation(''); setSuccess(true);
    } catch (failure) {
      setError(emailAuthError(failure));
    } finally { submitting.current = false; setBusy(false); }
  }

  return <Card>
    <h2 className="text-sm font-bold text-slate-950">{t('ตั้งรหัสผ่าน')}</h2>
    <p className="mt-2 text-xs text-slate-500">{t('ตั้งรหัสผ่านสำหรับบัญชีนี้เพื่อเข้าสู่ระบบด้วยอีเมล โดยยังใช้ Google ได้ตามเดิม')}</p>
    <p className="mt-2 text-sm font-semibold break-all">{user.email}</p>
    <form onSubmit={submit} className="mt-4 space-y-4">
      <fieldset disabled={busy} className="space-y-4 disabled:opacity-60">
        <div><label htmlFor="account-password" className="block text-xs font-semibold">{t('รหัสผ่านใหม่')}</label>
          <input id="account-password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => { setPassword(e.target.value); setSuccess(false); }} className="mt-2 w-full rounded-xl border border-slate-200 p-3" /></div>
        <div><label htmlFor="account-password-confirm" className="block text-xs font-semibold">{t('ยืนยันรหัสผ่านใหม่')}</label>
          <input id="account-password-confirm" type="password" autoComplete="new-password" required value={confirmation} onChange={e => { setConfirmation(e.target.value); setSuccess(false); }} className="mt-2 w-full rounded-xl border border-slate-200 p-3" /></div>
        <button type="submit" className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">{t(busy ? 'กำลังบันทึก…' : 'บันทึกรหัสผ่าน')}</button>
      </fieldset>
      {error && <p role="alert" className="text-sm text-red-600">{t(error)}</p>}
      {success && <p role="status" className="text-sm text-green-700">{t('บันทึกรหัสผ่านแล้ว ครั้งต่อไปใช้อีเมลและรหัสผ่านนี้ หรือเข้าสู่ระบบด้วย Google ได้')}</p>}
    </form>
  </Card>;
}
