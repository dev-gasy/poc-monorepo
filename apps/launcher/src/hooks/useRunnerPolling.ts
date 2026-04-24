import { useEffect, useRef } from 'react';
import type { Dispatch } from 'react';

import { POLL_INTERVAL_MS } from '../constants';
import { fetchRunnerStatuses, indexStatuses } from '../services/launcherRunner';
import type { RunnerAction } from '../state';

export function useRunnerPolling(dispatch: Dispatch<RunnerAction>): void {
  const ref = useRef(dispatch);
  ref.current = dispatch;

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const statuses = await fetchRunnerStatuses();

        if (cancelled) {
          return;
        }

        ref.current({ type: 'STATUSES_LOADED', payload: indexStatuses(statuses) });
      } catch (error) {
        if (cancelled) {
          return;
        }

        if (import.meta.env.DEV) {
          console.error('[Launcher] Poll failed:', error);
        }

        ref.current({ type: 'RUNNER_UNAVAILABLE' });
      }
    }

    void poll();
    const id = window.setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);
}
