import { useCallback } from 'react';
import type { Dispatch } from 'react';

import type { LauncherApp } from '../data';
import {
  invokeRunnerAction as invokeRunnerCommand,
  killRunnerPort,
} from '../services/launcherRunner';
import type { RunnerAction } from '../state';

function logError(label: string, error: unknown) {
  if (import.meta.env.DEV) {
    console.error(`[Launcher] ${label}:`, error);
  }
}

export function useRunnerActions(dispatch: Dispatch<RunnerAction>) {
  const toggleRunner = useCallback(
    async (action: 'run' | 'stop', id: string) => {
      dispatch({ type: 'PENDING_START', id });

      try {
        const status = await invokeRunnerCommand(action, id);
        dispatch({ type: 'STATUS_UPDATED', id, status });
      } catch (error) {
        logError('Runner action failed', error);
        dispatch({ type: 'RUNNER_UNAVAILABLE' });
      } finally {
        dispatch({ type: 'PENDING_END', id });
      }
    },
    [dispatch],
  );

  const killPort = useCallback(
    async (app: LauncherApp) => {
      dispatch({ type: 'PENDING_START', id: app.id });

      try {
        const status = await killRunnerPort(app.id, app.port);
        dispatch({ type: 'STATUS_UPDATED', id: app.id, status });
      } catch (error) {
        logError('Kill port failed', error);
        dispatch({ type: 'RUNNER_UNAVAILABLE' });
      } finally {
        dispatch({ type: 'PENDING_END', id: app.id });
      }
    },
    [dispatch],
  );

  return { toggleRunner, killPort };
}
