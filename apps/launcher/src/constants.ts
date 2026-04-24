import type { Scope } from './domain/launcherTypes';

export const POLL_INTERVAL_MS = 2500;

export const SCOPE_OPTIONS: Array<{ label: string; value: Scope }> = [
  { label: 'All', value: 'all' },
  { label: 'Apps', value: 'apps' },
  { label: 'Tasks', value: 'tasks' },
];
