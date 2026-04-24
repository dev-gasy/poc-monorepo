import { formatAppLocation, getStatusParts, isRunningState } from '@/application/launcherView';
import type { LauncherApp } from '@/domain/launcherCatalog';
import type { CommandStatus, RunnerCommandAction } from '@/domain/launcherTypes';
import { RunToggleButton } from './ActionButtons';
import { Icon } from './Icon';
import { LauncherListItem } from './LauncherListItem';

interface LauncherAppItemProps {
  app: LauncherApp;
  status: CommandStatus | undefined;
  isPending: boolean;
  isRunnerReady: boolean;
  onToggle: (action: RunnerCommandAction, app: LauncherApp) => void;
}

export function LauncherAppItem({
  app,
  status,
  isPending,
  isRunnerReady,
  onToggle,
}: LauncherAppItemProps) {
  const isRunning = isRunningState(status?.state);
  const isDisabled = !isRunnerReady || isPending;
  const canOpenApp = app.canRun ? status?.state === 'running' && !isPending : true;

  return (
    <LauncherListItem
      id={app.id}
      lane={app.lane}
      description={app.description}
      status={status}
      statusParts={getStatusParts(status)}
      title={
        canOpenApp ? (
          <a className="app-link" href={app.href} target="_blank" rel="noreferrer">
            {app.name}
          </a>
        ) : (
          <span className="app-link is-disabled">{app.name}</span>
        )
      }
      content={
        <p className="row-summary">
          <strong>{app.packageName}</strong>
          <span>{formatAppLocation(app.href)}</span>
        </p>
      }
      actions={
        <>
          {app.canRun && (
            <RunToggleButton
              noun="app"
              name={app.name}
              isRunning={isRunning}
              isPending={isPending}
              disabled={isDisabled}
              onClick={() => onToggle(isRunning ? 'stop' : 'run', app)}
            />
          )}

          {canOpenApp ? (
            <a
              className="row-action-button"
              href={app.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${app.name}`}
              title={`Open ${app.name}`}
            >
              <Icon name="external" />
              Open
            </a>
          ) : (
            <button
              type="button"
              className="row-action-button"
              disabled
              aria-label={`${app.name} is not running`}
              title="Start app before opening"
            >
              <Icon name="external" />
              Open
            </button>
          )}
        </>
      }
    />
  );
}
