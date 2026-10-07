import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { countNewLeads } from './leadClient';

export function LeadNotification({ enabled }: { enabled: boolean }) {
  const [count, setCount] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let busy = false;
    const refresh = async () => {
      if (busy) return;
      busy = true;
      try {
        const total = await countNewLeads();
        if (active) { setCount(total); setFailed(false); }
      } catch { if (active) setFailed(true); }
      finally { busy = false; }
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 30_000);
    return () => { active = false; clearInterval(timer); };
  }, [enabled]);
  if (!enabled) return null;
  return <Link to="/admin/leads" className="mb-3 block rounded-lg bg-blue-50 px-2 py-3 text-center text-xs font-semibold text-blue-700" title="คำขอติดต่อจากลูกค้า">
    <span>คำขอติดต่อ</span>
    <span role="status" aria-live="polite" className="block mt-1">{failed ? 'ตรวจแจ้งเตือนไม่สำเร็จ' : count === null ? 'กำลังตรวจ…' : `คำขอใหม่ ${count} รายการ`}</span>
  </Link>;
}
