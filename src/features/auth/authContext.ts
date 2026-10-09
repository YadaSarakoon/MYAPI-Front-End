import { createContext } from 'react';
import type { User } from '@supabase/supabase-js';

export type AuthContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
