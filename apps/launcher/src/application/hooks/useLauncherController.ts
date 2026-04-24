import { startTransition, useCallback, useDeferredValue, useMemo, useReducer } from 'react';
import type { ChangeEvent } from 'react';

import { launcherApps, launcherTasks } from '@/domain/launcherCatalog';
import type { Scope } from '@/domain/launcherTypes';
import {
  initialRunnerState,
  initialUiState,
  runnerReducer,
  uiReducer,
} from '@/application/launcherState';
import { matchesQuery, normalizeValue } from '@/application/launcherView';
import { useRunnerActions } from './useRunnerActions';
import { useRunnerPolling } from './useRunnerPolling';

export function useLauncherController() {
  const [runner, dispatchRunner] = useReducer(runnerReducer, initialRunnerState);
  const [ui, dispatchUi] = useReducer(uiReducer, initialUiState);

  useRunnerPolling(dispatchRunner);

  const { toggleRunner } = useRunnerActions(dispatchRunner);

  const handleQueryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      dispatchUi({ type: 'SET_QUERY', query: event.target.value });
    });
  }, []);

  const handleQueryClear = useCallback(() => {
    dispatchUi({ type: 'CLEAR_QUERY' });
  }, []);

  const handleScopeChange = useCallback((scope: Scope) => {
    dispatchUi({ type: 'SET_SCOPE', scope });
  }, []);

  const normalizedQuery = useMemo(() => normalizeValue(ui.query), [ui.query]);
  const deferredQuery = useDeferredValue(normalizedQuery);
  const filteredApps = useMemo(
    () => launcherApps.filter((app) => matchesQuery(app, deferredQuery)),
    [deferredQuery],
  );
  const filteredTasks = useMemo(
    () => launcherTasks.filter((task) => matchesQuery(task, deferredQuery)),
    [deferredQuery],
  );
  const visibleApps = ui.scope === 'tasks' ? [] : filteredApps;
  const visibleTasks = ui.scope === 'apps' ? [] : filteredTasks;
  const scopeCounts = useMemo(
    () => ({
      all: filteredApps.length + filteredTasks.length,
      apps: filteredApps.length,
      tasks: filteredTasks.length,
    }),
    [filteredApps.length, filteredTasks.length],
  );

  return {
    runner,
    ui,
    visibleApps,
    visibleTasks,
    scopeCounts,
    isRunnerReady: runner.availability === 'ready',
    toggleRunner,
    handleQueryChange,
    handleQueryClear,
    handleScopeChange,
  };
}
