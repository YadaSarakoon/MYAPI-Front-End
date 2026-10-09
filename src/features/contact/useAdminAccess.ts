import { useEffect, useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { getSupabase } from '../../config/supabase';

export function useAdminAccess() {
  const { user, loading: authLoading } = useAuth();
  const [result, setResult] = useState<{ user: typeof user; allowed: boolean; error: boolean } | null>(null);
  useEffect(() => {
    let active = true;
    if (user) {
      void (async () => {
        try {
          const { data, error } = await getSupabase().rpc('myapi_is_admin');
          if (error) throw error;
          if (active) setResult({ user, allowed: data === true, error: false });
        } catch { if (active) setResult({ user, allowed: false, error: true }); }
      })();
    }
    return () => { active = false; };
  }, [user]);
  // Token refreshes replace the user object; retain the editor for the same account
  // while revalidating. An account switch still clears access immediately.
  const current = user && result?.user?.id === user.id ? result : null;
  return { user, loading: authLoading || (!!user && !current), allowed: current?.allowed === true, error: current?.error === true };
}
