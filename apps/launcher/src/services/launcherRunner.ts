import type { CommandStatus, RunnerActionResponse, RunnerStatusesResponse } from '../types';

export async function fetchRunnerStatuses() {
  const response = await fetch('/__launcher/commands');

  if (!response.ok) {
    throw new Error('Launcher runner is unavailable.');
  }

  const payload = (await response.json()) as RunnerStatusesResponse;

  return payload.statuses;
}

export async function invokeRunnerAction(action: 'run' | 'stop', id: string) {
  const response = await fetch(`/__launcher/commands/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
  const payload = (await response.json()) as RunnerActionResponse;

  if (!response.ok || !payload.status) {
    throw new Error(payload.error ?? 'Launcher command execution failed.');
  }

  return payload.status;
}

export async function killRunnerPort(id: string, port: number) {
  const response = await fetch('/__launcher/commands/kill-port', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, port }),
  });
  const payload = (await response.json()) as RunnerActionResponse;

  if (!response.ok || !payload.status) {
    throw new Error(payload.error ?? 'Launcher port cleanup failed.');
  }

  return payload.status;
}

export function indexStatuses(statuses: CommandStatus[]) {
  return Object.fromEntries(statuses.map((status) => [status.id, status])) as Record<
    string,
    CommandStatus
  >;
}
