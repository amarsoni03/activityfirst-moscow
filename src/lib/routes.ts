export type DashTab =
  | 'overview'
  | 'upcoming'
  | 'saved'
  | 'compare'
  | 'messages'
  | 'profile';

export type Route =
  | { view: 'explore' }
  | { view: 'activity'; id: string }
  | { view: 'my-week' }
  | { view: 'dashboard'; tab?: DashTab }
  | { view: 'provider' }
  | { view: 'post' };

const DASH: DashTab[] = [
  'overview',
  'upcoming',
  'saved',
  'compare',
  'messages',
  'profile',
];

export function parseHash(hash: string): Route {
  const path = hash.replace(/^#/, '') || 'explore';
  if (path === 'explore' || path === '') return { view: 'explore' };
  if (path.startsWith('activity/')) return { view: 'activity', id: path.slice(9) };
  if (path === 'free-time' || path === 'my-week') return { view: 'my-week' };
  if (path === 'dashboard' || path.startsWith('dashboard/')) {
    const tab = path.split('/')[1] as DashTab | undefined;
    return { view: 'dashboard', tab: tab && DASH.includes(tab) ? tab : 'overview' };
  }
  if (path === 'provider') return { view: 'provider' };
  if (path === 'post') return { view: 'post' };
  return { view: 'explore' };
}

export function parsePath(pathname: string, hash = ''): Route {
  const fromHash = hash.replace(/^#/, '');
  if (fromHash && (pathname === '/' || pathname === '')) {
    if (
      fromHash === 'explore' ||
      fromHash === 'my-week' ||
      fromHash === 'free-time' ||
      fromHash === 'dashboard' ||
      fromHash.startsWith('dashboard/') ||
      fromHash.startsWith('activity/') ||
      fromHash === 'provider' ||
      fromHash === 'post'
    ) {
      return parseHash('#' + fromHash);
    }
  }

  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/' || path === '/explore') return { view: 'explore' };
  if (path.startsWith('/activity/')) {
    return { view: 'activity', id: decodeURIComponent(path.slice('/activity/'.length)) };
  }
  if (path === '/my-week' || path === '/free-time') return { view: 'my-week' };
  if (path === '/dashboard' || path.startsWith('/dashboard/')) {
    const tab = path.split('/')[2] as DashTab | undefined;
    return { view: 'dashboard', tab: tab && DASH.includes(tab) ? tab : 'overview' };
  }
  if (path === '/provider') return { view: 'provider' };
  if (path === '/post') return { view: 'post' };
  return { view: 'explore' };
}

export function toPath(route: Route): string {
  switch (route.view) {
    case 'explore':
      return '/';
    case 'activity':
      return `/activity/${route.id}`;
    case 'my-week':
      return '/my-week';
    case 'dashboard':
      return route.tab && route.tab !== 'overview' ? `/dashboard/${route.tab}` : '/dashboard';
    case 'provider':
      return '/provider';
    case 'post':
      return '/post';
  }
}
