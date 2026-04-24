import type { LauncherApp } from '../data';
import { formatAppLocation, getStatusParts, isRunningState } from '../services/launcherView';
import type { CommandStatus } from '../types';
import { CopyCommandButton, KillPortButton, RunToggleButton } from './ActionButtons';
import { Icon } from './Icon';
import { LauncherListItem } from './LauncherListItem';

interface LauncherAppItemProps {
  app: LauncherApp;
  status: CommandStatus | undefined;
  isPending: boolean;
  isCopied: boolean;
  isRunnerReady: boolean;
  onToggle: (action: 'run' | 'stop', id: string) => void;
  onCopy: (id: string, command: string) => void;
  onKillPort: (app: LauncherApp) => void;
}

export function LauncherAppItem({
  app,
  status,
  isPending,
  isCopied,
  isRunnerReady,
  onToggle,
  onCopy,
  onKillPort,
}: LauncherAppItemProps) {
  const isRunning = isRunningState(status?.state);
  const isDisabled = !isRunnerReady || isPending;

  return (
    <LauncherListItem
      id={app.id}
      lane={app.lane}
      description={app.description}
      status={status}
      statusParts={getStatusParts(status)}
      title={
        <a className="app-link" href={app.href} target="_blank" rel="noreferrer">
          {app.name}
        </a>
      }
      content={
        <p className="row-summary">
          <strong>{app.packageName}</strong>
          <span>{formatAppLocation(app.href)}</span>
        </p>
      }
      actions={
        <>
          {app.canRun ? (
            <RunToggleButton
              noun="app"
              name={app.name}
              isRunning={isRunning}
              isPending={isPending}
              disabled={isDisabled}
              onClick={() => onToggle(isRunning ? 'stop' : 'run', app.id)}
            />
          ) : (
            <span className="current-session">Current session</span>
          )}

          <CopyCommandButton
            name={app.name}
            isCopied={isCopied}
            onClick={() => onCopy(app.id, app.command)}
          />

          {app.canRun && (
            <KillPortButton
              name={app.name}
              port={app.port}
              disabled={isDisabled}
              onClick={() => onKillPort(app)}
            />
          )}

          <a
            className="row-icon-button"
            href={app.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${app.name}`}
            title={`Open ${app.name}`}
          >
            <Icon name="external" />
          </a>
        </>
      }
    />
  );
}
