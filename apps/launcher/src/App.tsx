import { startTransition, useCallback, useDeferredValue, useMemo, useReducer } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';

import { getActiveBrandConfig, getBrandCssVariables } from '@dgig/monorepo-config';

import { SCOPE_OPTIONS } from './constants';
import { LaneHeader } from './components/LaneHeader';
import { LauncherAppItem } from './components/LauncherAppItem';
import { LauncherControls } from './components/LauncherControls';
import { LauncherHeader } from './components/LauncherHeader';
import { LauncherTaskItem } from './components/LauncherTaskItem';
import { launcherApps, launcherTasks } from './data';
import { useCopyFeedback } from './hooks/useCopyFeedback';
import { useRunnerActions } from './hooks/useRunnerActions';
import { useRunnerPolling } from './hooks/useRunnerPolling';
import { copyText } from './services/clipboard';
import { matchesQuery, normalizeValue } from './services/launcherView';
import { initialRunnerState, initialUiState, runnerReducer, uiReducer } from './state';
import type { Scope } from './types';

const activeConfig = getActiveBrandConfig(import.meta.env);
const themeStyle = getBrandCssVariables(activeConfig.brand) as CSSProperties;

export default function App() {
  const [runner, dispatchRunner] = useReducer(runnerReducer, initialRunnerState);
  const [ui, dispatchUi] = useReducer(uiReducer, initialUiState);

  useRunnerPolling(dispatchRunner);
  useCopyFeedback(ui.copiedId, dispatchUi);

  const { toggleRunner, killPort } = useRunnerActions(dispatchRunner);

  const copyCommand = useCallback(async (id: string, command: string) => {
    try {
      await copyText(command);
      dispatchUi({ type: 'COPIED', id });
    } catch {
      dispatchUi({ type: 'COPY_EXPIRED' });
    }
  }, []);

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
  const isRunnerReady = runner.availability === 'ready';

  return (
    <main className="launcher-shell" style={themeStyle}>
      <LauncherHeader availability={runner.availability} />

      <LauncherControls
        query={ui.query}
        scope={ui.scope}
        scopeCounts={scopeCounts}
        scopeOptions={SCOPE_OPTIONS}
        onQueryChange={handleQueryChange}
        onQueryClear={handleQueryClear}
        onScopeChange={handleScopeChange}
      />

      <section className="lane-stack">
        {visibleApps.length > 0 ? (
          <div className="lane-column">
            <LaneHeader
              title="Applications"
              subtitle="Stable launch ports"
              count={visibleApps.length}
            />
            <ul className="launch-list">
              {visibleApps.map((app) => (
                <LauncherAppItem
                  key={app.id}
                  app={app}
                  status={runner.statusById[app.id]}
                  isPending={runner.pendingIds.has(app.id)}
                  isCopied={ui.copiedId === app.id}
                  isRunnerReady={isRunnerReady}
                  onToggle={toggleRunner}
                  onCopy={copyCommand}
                  onKillPort={killPort}
                />
              ))}
            </ul>
          </div>
        ) : null}

        {visibleTasks.length > 0 ? (
          <div className="lane-column">
            <LaneHeader title="Tasks" subtitle="Root command rail" count={visibleTasks.length} />
            <ul className="launch-list">
              {visibleTasks.map((task) => (
                <LauncherTaskItem
                  key={task.id}
                  task={task}
                  status={runner.statusById[task.id]}
                  isPending={runner.pendingIds.has(task.id)}
                  isCopied={ui.copiedId === task.id}
                  isRunnerReady={isRunnerReady}
                  onToggle={toggleRunner}
                  onCopy={copyCommand}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </main>
  );
}
