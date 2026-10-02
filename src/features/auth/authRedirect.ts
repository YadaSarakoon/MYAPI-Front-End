type RedirectState = { from?: string | { pathname?: string } } | null | undefined;

export function getPostAuthDestination(state: unknown): string {
  const redirectState = state as RedirectState;
  const from = redirectState?.from;
  const pathname = typeof from === 'string' ? from : from?.pathname;

  if (!pathname || !pathname.startsWith('/') || pathname.startsWith('//')) {
    return '/dashboard';
  }

  if (pathname === '/login' || pathname === '/signup') {
    return '/dashboard';
  }

  return pathname;
}
