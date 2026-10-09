type RedirectState = { from?: string | { pathname?: string; search?: string; hash?: string } } | null | undefined;

export function getPostAuthDestination(state: unknown): string {
  const redirectState = state as RedirectState;
  const from = redirectState?.from;
  const path = typeof from === 'string' ? from : `${from?.pathname ?? ''}${from?.search ?? ''}${from?.hash ?? ''}`;
  if (!path.startsWith('/') || path.startsWith('//') || /\\|%5c|%2f/i.test(path) || [...path].some(char => char.charCodeAt(0) < 32)) return '/dashboard';
  try {
    const url = new URL(path, 'https://myapi.invalid');
    const allowed = new Set(['/dashboard', '/production', '/billing', '/settings', '/webhook', '/activity', '/admin/leads', '/docs', '/sandbox', '/']);
    if (url.origin !== 'https://myapi.invalid' || !allowed.has(url.pathname)) return '/dashboard';
    return `${url.pathname}${url.search}${url.hash}`;
  } catch { return '/dashboard'; }
}
