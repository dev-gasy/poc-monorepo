import type { LauncherApp, LauncherTask } from '../data';
import type { CommandState, CommandStatus } from '../types';

export const commandStateLabels: Record<CommandState, string> = {
  idle: 'Idle',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  stopped: 'Stopped',
  stopping: 'Stopping',
};

export function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

export function matchesQuery(item: LauncherApp | LauncherTask, query: string) {
  if (!query) {
    return true;
  }

  return [item.name, item.description, item.command, item.lane, item.tags.join(' ')]
    .join(' ')
    .toLowerCase()
    .includes(query);
}

export function isRunningState(state: CommandState | undefined) {
  return state === 'running' || state === 'stopping';
}

export function formatStatusTimestamp(status: CommandStatus | undefined) {
  if (!status) {
    return null;
  }

  const value = status.finishedAt ?? status.startedAt;

  if (!value) {
    return null;
  }

  return new Date(value).toLocaleTimeString();
}

export function getStatusParts(status: CommandStatus | undefined) {
  if (!status) {
    return ['Idle'];
  }

  return [commandStateLabels[status.state], formatStatusTimestamp(status)].filter(
    (value): value is string => Boolean(value),
  );
}

export function formatAppLocation(href: string) {
  try {
    return new URL(href).host;
  } catch {
    return href;
  }
}
