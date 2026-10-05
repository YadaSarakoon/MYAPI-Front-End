import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { AuthContext } from './authContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => onAuthStateChanged(
    auth,
    (nextUser) => {
      setUser(nextUser);
      setError(null);
      setLoading(false);
    },
    () => {
      setUser(null);
      setError('Unable to verify your sign-in session. Reload and try again.');
      setLoading(false);
    },
  ), []);

  const value = useMemo(() => ({ user, loading, error, logout: () => signOut(auth) }), [user, loading, error]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
