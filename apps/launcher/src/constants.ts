import type { RunnerAvailability, Scope } from './types';

export const POLL_INTERVAL_MS = 2500;
export const COPY_FEEDBACK_MS = 1800;

export const SCOPE_OPTIONS: Array<{ label: string; value: Scope }> = [
  { label: 'All', value: 'all' },
  { label: 'Apps', value: 'apps' },
  { label: 'Tasks', value: 'tasks' },
];

export const RUNNER_PILL_LABELS: Record<RunnerAvailability, string> = {
  ready: 'Runner ready',
  checking: 'Checking runner',
  unavailable: 'Runner unavailable',
};
