import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabase } from '../../config/supabase';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    let changed = false;
    let unsubscribe = () => {};
    try {
      const auth = getSupabase().auth;
      const { data } = auth.onAuthStateChange((_event, session) => {
        if (!active) return;
        changed = true;
        setUser(session?.user ?? null); setError(null); setLoading(false);
      });
      unsubscribe = () => data.subscription.unsubscribe();
      void auth.getSession().then(({ data, error }) => {
        if (!active || changed) return;
        if (error) throw error;
        setUser(data.session?.user ?? null); setLoading(false);
      }).catch(() => {
        if (active && !changed) { setError('Unable to verify your session. Reload and try again.'); setLoading(false); }
      });
    } catch {
      queueMicrotask(() => { if (active) { setError('ยังไม่ได้ตั้งค่าการเชื่อมต่อ Supabase'); setLoading(false); } });
    }
    return () => { active = false; unsubscribe(); };
  }, []);
  const value = useMemo(() => ({ user, loading, error, logout: async () => {
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
  } }), [user, loading, error]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
