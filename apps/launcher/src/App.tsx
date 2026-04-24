import type { CSSProperties } from 'react';

import { getActiveBrandConfig, getBrandCssVariables } from '@dgig/monorepo-config';

import { useLauncherController } from './application/hooks/useLauncherController';
import { SCOPE_OPTIONS } from './constants';
import { LaneHeader } from './presentation/components/LaneHeader';
import { LauncherAppItem } from './presentation/components/LauncherAppItem';
import { LauncherControls } from './presentation/components/LauncherControls';
import { LauncherHeader } from './presentation/components/LauncherHeader';
import { LauncherTaskItem } from './presentation/components/LauncherTaskItem';

const activeConfig = getActiveBrandConfig(import.meta.env);
const themeStyle = getBrandCssVariables(activeConfig.brand) as CSSProperties;

export default function App() {
  const {
    runner,
    ui,
    visibleApps,
    visibleTasks,
    scopeCounts,
    isRunnerReady,
    toggleRunner,
    handleQueryChange,
    handleQueryClear,
    handleScopeChange,
  } = useLauncherController();

  return (
    <main className="launcher-shell" style={themeStyle}>
      <LauncherHeader />

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
                  isRunnerReady={isRunnerReady}
                  onToggle={toggleRunner}
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
                  isRunnerReady={isRunnerReady}
                  onToggle={toggleRunner}
                />
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </main>
  );
}
