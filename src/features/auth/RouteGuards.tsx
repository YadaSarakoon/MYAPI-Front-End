import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

function AuthLoading() {
  return <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-sm text-slate-500">Loading account…</div>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, error } = useAuth();
  const location = useLocation();
  if (loading) return <AuthLoading />;
  if (error) return <div role="alert" className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6 text-center text-sm text-rose-700">{error}</div>;
  return user ? <>{children}</> : <Navigate to="/login" replace state={{ from: location }} />;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  return user ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}
