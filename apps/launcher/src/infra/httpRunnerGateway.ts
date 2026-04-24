import { ResultAsync, errAsync, okAsync } from 'neverthrow';

import type {
  CommandStatus,
  LauncherError,
  RunnerActionResponse,
  RunnerCommandAction,
  RunnerStatusesResponse,
} from '@/domain/launcherTypes';
import type { LauncherRunnerGateway } from '@/ports/launcherRunnerGateway';

function error(message: string): LauncherError {
  return { message };
}

function getFetchError(reason: unknown): LauncherError {
  if (reason instanceof SyntaxError) {
    return error('Launcher response could not be parsed.');
  }

  return error('Launcher runner is unavailable.');
}

function fetchJson<TPayload>(input: RequestInfo | URL, init?: RequestInit) {
  return ResultAsync.fromPromise<
    { readonly payload: TPayload; readonly response: Response },
    LauncherError
  >(
    fetch(input, init).then(async (response) => ({
      payload: (await response.json()) as TPayload,
      response,
    })),
    getFetchError,
  );
}

function fetchCommandStatusList() {
  return fetchJson<RunnerStatusesResponse>('/__launcher/commands').andThen(
    ({ payload, response }) => {
      if (!response.ok) {
        return errAsync(error('Launcher runner is unavailable.'));
      }

      return okAsync(payload.statuses);
    },
  );
}

function executeCommandAction(action: RunnerCommandAction, id: string) {
  return fetchJson<RunnerActionResponse>(`/__launcher/commands/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  }).andThen(({ payload, response }) => {
    if (!response.ok || !payload.status) {
      return errAsync(error(payload.error ?? 'Launcher command execution failed.'));
    }

    return okAsync(payload.status);
  });
}

function executePortCleanup(id: string, port: number) {
  return fetchJson<RunnerActionResponse>('/__launcher/commands/kill-port', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, port }),
  }).andThen(({ payload, response }) => {
    if (!response.ok || !payload.status) {
      return errAsync(error(payload.error ?? 'Launcher port cleanup failed.'));
    }

    return okAsync(payload.status);
  });
}

export const httpRunnerGateway: LauncherRunnerGateway = {
  fetchCommandStatusList,
  executeCommandAction,
  executePortCleanup,
};

export function indexCommandStatusList(statuses: readonly CommandStatus[]) {
  return Object.fromEntries(statuses.map((status) => [status.id, status])) as Record<
    string,
    CommandStatus
  >;
}
