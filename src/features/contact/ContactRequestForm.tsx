import { useRef, useState, type FormEvent } from 'react';
import { submitContact, type ContactSubmission } from './contactClient';

const fields = [
  { name: 'company', label: 'ชื่อบริษัท (ไม่บังคับ)', placeholder: 'เช่น บริษัท ตัวอย่าง จำกัด', type: 'text', autoComplete: 'organization', required: false, maxLength: 200 },
  { name: 'fullName', label: 'ชื่อ - นามสกุล', placeholder: 'เช่น สมชาย ใจดี', type: 'text', autoComplete: 'name', required: true, maxLength: 120 },
  { name: 'phone', label: 'เบอร์โทรติดต่อ', placeholder: 'เช่น 081 234 5678', type: 'tel', autoComplete: 'tel', required: true, maxLength: 30 },
  { name: 'email', label: 'อีเมล', placeholder: 'เช่น name@company.com', type: 'email', autoComplete: 'email', required: true, maxLength: 254 },
  { name: 'website', label: 'เว็บไซต์ (ไม่บังคับ)', placeholder: 'เช่น https://www.example.com', type: 'url', autoComplete: 'url', required: false, maxLength: 500 },
  { name: 'courier', label: 'ขนส่งที่สนใจ', placeholder: 'ระบุขนส่งที่สนใจ', type: 'text', autoComplete: 'off', required: false, maxLength: 200 },
];

export function ContactRequestForm({ t, language }: { t: (text: string) => string; language: 'th' | 'en' }) {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorCode, setErrorCode] = useState('');
  const busy = useRef(false);
  const attempt = useRef({ body: '', id: '' });
  const text = (th: string, en: string) => language === 'en' ? en : th;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    busy.current = true;
    setState('sending');
    try {
      const data = new FormData(form);
      const values = Object.fromEntries([...fields.map(field => field.name), 'trap'].map(name => [name, String(data.get(name) ?? '').trim()]));
      const body = JSON.stringify(values);
      if (attempt.current.body !== body) attempt.current = { body, id: crypto.randomUUID() };
      const result = await submitContact({ ...values, submissionId: attempt.current.id } as ContactSubmission);
      if (result.accepted !== true) throw new Error('Not accepted');
      form.reset();
      attempt.current = { body: '', id: '' };
      setState('success');
    } catch (error) {
      setErrorCode(typeof error === 'object' && error !== null && 'code' in error ? String(error.code) : '');
      setState('error');
    } finally { busy.current = false; }
  }

  const errorMessage = errorCode === 'resource-exhausted'
    ? text('ส่งคำขอถี่เกินไป กรุณารอสักครู่แล้วลองใหม่ ข้อมูลที่กรอกยังอยู่ครบ', 'Too many requests. Please try again later. Your inputs are preserved.')
    : errorCode === 'invalid-argument'
      ? text('กรุณาตรวจสอบชื่อ เบอร์โทร อีเมล และเว็บไซต์ แล้วส่งอีกครั้ง', 'Please check your name, phone, email and website, then try again.')
      : text('ยังยืนยันการส่งไม่ได้ กรุณาลองอีกครั้ง ข้อมูลที่กรอกยังอยู่ครบ หรือติดต่อทีมทางอีเมลด้านล่าง', 'We could not confirm your request. Please retry, or contact our team below. Your inputs are preserved.');

  return <form onSubmit={event => void handleSubmit(event)} aria-busy={state === 'sending'}>
    <fieldset disabled={state === 'sending'} className="contact-fieldset">
      <div className="pastel-form-grid">{fields.map(({ name, label, ...props }) => <label key={name} htmlFor={`contact-${name}`}><span>{t(label)}</span><input id={`contact-${name}`} name={name} {...props} placeholder={t(props.placeholder)} /></label>)}</div>
      <div className="contact-trap" aria-hidden="true"><label>Leave empty<input name="trap" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="contact-data-note">{text('เราจะใช้ข้อมูลนี้เพื่อติดต่อกลับเกี่ยวกับบริการที่คุณสนใจ', 'We will use these details to contact you about the services you are interested in.')}</p>
      <button className="pastel-submit" disabled={state === 'sending'} type="submit">{state === 'sending' ? text('กำลังส่ง…', 'Sending…') : t('ให้ทีมงานติดต่อกลับ')}</button>
    </fieldset>
    {state === 'success' && <p className="pastel-form-notice contact-success" role="status">{text('ส่งข้อมูลเรียบร้อยแล้ว ทีมงานจะติดต่อกลับ ขอบคุณที่สนใจ MyAPI', 'Your request has been received. Our team will contact you. Thank you for choosing MyAPI.')}</p>}
    {state === 'error' && <div className="pastel-form-notice contact-error" role="alert"><p>{errorMessage}</p><a href="mailto:yada@myorder.ai,sukanya@myorder.ai">{text('ติดต่อทีมทางอีเมล', 'Contact the team by email')}</a></div>}
  </form>;
}
