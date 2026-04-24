import { useCallback } from 'react';
import type { Dispatch } from 'react';

import { launcherApps } from '@/domain/launcherCatalog';
import type { RunnerCommandAction } from '@/domain/launcherTypes';
import { httpRunnerGateway } from '@/infra/httpRunnerGateway';
import type { RunnerAction } from '@/application/launcherState';

function logLauncherError(label: string, message: string) {
  if (import.meta.env.DEV) {
    console.error(`[Launcher] ${label}:`, message);
  }
}

export function useRunnerActions(dispatch: Dispatch<RunnerAction>) {
  const toggleRunner = useCallback(
    async (action: RunnerCommandAction, id: string) => {
      dispatch({ type: 'PENDING_START', id });

      const app = launcherApps.find((item) => item.id === id);
      const result =
        action === 'run' && app
          ? await httpRunnerGateway
              .executePortCleanup(app.id, app.port)
              .andThen(() => httpRunnerGateway.executeCommandAction(action, app.id))
          : await httpRunnerGateway.executeCommandAction(action, id);

      result.match(
        (status) => {
          dispatch({ type: 'STATUS_UPDATED', id, status });
        },
        (error) => {
          logLauncherError('Runner action failed', error.message);
          dispatch({ type: 'RUNNER_UNAVAILABLE' });
        },
      );

      dispatch({ type: 'PENDING_END', id });
    },
    [dispatch],
  );

  return { toggleRunner };
}
