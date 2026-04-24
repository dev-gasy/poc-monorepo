import { useEffect, useRef } from 'react';
import type { Dispatch } from 'react';

import { POLL_INTERVAL_MS } from '@/constants';
import { httpRunnerGateway, indexCommandStatusList } from '@/infra/httpRunnerGateway';
import type { RunnerAction } from '@/application/launcherState';

export function useRunnerPolling(dispatch: Dispatch<RunnerAction>): void {
  const ref = useRef(dispatch);
  ref.current = dispatch;

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const result = await httpRunnerGateway.fetchCommandStatusList();

      if (cancelled) {
        return;
      }

      result.match(
        (statuses) => {
          ref.current({ type: 'STATUSES_LOADED', payload: indexCommandStatusList(statuses) });
        },
        (error) => {
          if (import.meta.env.DEV) {
            console.error('[Launcher] Poll failed:', error.message);
          }

          ref.current({ type: 'RUNNER_UNAVAILABLE' });
        },
      );
    }

    void poll();
    const id = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);
}
