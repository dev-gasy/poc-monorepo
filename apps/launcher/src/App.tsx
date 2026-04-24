import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import type { CSSProperties, ChangeEvent } from 'react';

import { getActiveBrandConfig, getBrandCssVariables } from '@dgig/monorepo-config';

import { launcherApps, launcherTasks, type LauncherApp, type LauncherTask } from './data';

type Scope = 'all' | 'apps' | 'tasks';
type RunnerAvailability = 'checking' | 'ready' | 'unavailable';
type CommandState = 'idle' | 'running' | 'completed' | 'failed' | 'stopped' | 'stopping';

interface CommandStatus {
  id: string;
  state: CommandState;
  pid?: number;
  startedAt?: string;
  finishedAt?: string;
  exitCode?: number | null;
  logs: string[];
}

interface RunnerStatusesResponse {
  statuses: CommandStatus[];
}

interface RunnerActionResponse {
  error?: string;
  status?: CommandStatus;
}

const scopeOptions: Scope[] = ['all', 'apps', 'tasks'];
const commandStateLabels: Record<CommandState, string> = {
  idle: 'Idle',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  stopped: 'Stopped',
  stopping: 'Stopping',
};

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function matchesQuery(item: LauncherApp | LauncherTask, query: string) {
  if (!query) {
    return true;
  }

  return [item.name, item.description, item.command, item.lane, item.tags.join(' ')]
    .join(' ')
    .toLowerCase()
    .includes(query);
}

function indexStatuses(statuses: CommandStatus[]) {
  return Object.fromEntries(statuses.map((status) => [status.id, status])) as Record<
    string,
    CommandStatus
  >;
}

function isRunningState(state: CommandState | undefined) {
  return state === 'running' || state === 'stopping';
}

function formatStatusTimestamp(status: CommandStatus | undefined) {
  if (!status) {
    return null;
  }

  const value = status.finishedAt ?? status.startedAt;

  if (!value) {
    return null;
  }

  return new Date(value).toLocaleTimeString();
}

function getStatusParts(status: CommandStatus | undefined) {
  if (!status) {
    return ['Idle'];
  }

  return [
    commandStateLabels[status.state],
    status.pid ? `pid ${status.pid}` : null,
    status.exitCode != null ? `exit ${status.exitCode}` : null,
    formatStatusTimestamp(status),
  ].filter((value): value is string => Boolean(value));
}

function formatAppLocation(href: string) {
  try {
    return new URL(href).host;
  } catch {
    return href;
  }
}

const activeConfig = getActiveBrandConfig(import.meta.env);
const themeStyle = getBrandCssVariables(activeConfig.brand) as CSSProperties;

export default function App() {
  const [scope, setScope] = useState<Scope>('all');
  const [query, setQuery] = useState('');
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [runnerAvailability, setRunnerAvailability] = useState<RunnerAvailability>('checking');
  const [statusById, setStatusById] = useState<Record<string, CommandStatus>>({});
  const deferredQuery = useDeferredValue(normalizeValue(query));

  useEffect(() => {
    let isMounted = true;

    async function refreshStatuses() {
      try {
        const response = await fetch('/__launcher/commands');

        if (!response.ok) {
          throw new Error('Launcher runner is unavailable.');
        }

        const payload = (await response.json()) as RunnerStatusesResponse;

        if (!isMounted) {
          return;
        }

        setStatusById(indexStatuses(payload.statuses));
        setRunnerAvailability('ready');
      } catch {
        if (!isMounted) {
          return;
        }

        setRunnerAvailability('unavailable');
      }
    }

    void refreshStatuses();
    const intervalId = window.setInterval(() => {
      void refreshStatuses();
    }, 2500);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const visibleApps =
    scope === 'tasks' ? [] : launcherApps.filter((item) => matchesQuery(item, deferredQuery));
  const visibleTasks =
    scope === 'apps' ? [] : launcherTasks.filter((item) => matchesQuery(item, deferredQuery));

  async function invokeRunnerAction(action: 'run' | 'stop', id: string) {
    setPendingIds((currentValue) => [...currentValue, id]);

    try {
      const response = await fetch(`/__launcher/commands/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      const payload = (await response.json()) as RunnerActionResponse;

      if (!response.ok || !payload.status) {
        throw new Error(payload.error ?? 'Launcher command execution failed.');
      }

      setStatusById((currentValue) => ({
        ...currentValue,
        [id]: payload.status as CommandStatus,
      }));
      setRunnerAvailability('ready');
    } catch {
      setRunnerAvailability('unavailable');
    } finally {
      setPendingIds((currentValue) => currentValue.filter((entry) => entry !== id));
    }
  }

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    startTransition(() => {
      setQuery(nextValue);
    });
  }

  return (
    <main className="launcher-shell" style={themeStyle}>
      <header className="page-header">
        <div>
          <p className="page-breadcrumb">@dgig/frontend-workspace / launcher</p>
          <h1>Launcher</h1>
          <p className="page-copy">
            Run apps and workspace tasks from one operational list, with GitHub-style scanning and
            lightweight execution feedback.
          </p>
        </div>
        <div className="page-meta">
          <span className={['runner-pill', `is-${runnerAvailability}`].join(' ')}>
            {runnerAvailability === 'ready'
              ? 'Runner ready'
              : runnerAvailability === 'checking'
                ? 'Checking runner'
                : 'Runner unavailable'}
          </span>
          <code className="runner-command">pnpm dev:launcher</code>
        </div>
      </header>

      <section className="control-strip">
        <label className="search-field" htmlFor="launcher-search">
          <span>Filter</span>
          <input
            id="launcher-search"
            name="launcher-search"
            type="search"
            value={query}
            onChange={handleQueryChange}
            placeholder="Search by lane, command, or package"
          />
        </label>

        <div className="scope-switch" aria-label="Launcher scope">
          {scopeOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={['scope-pill', scope === option ? 'is-active' : ''].join(' ').trim()}
              aria-pressed={scope === option}
              onClick={() => setScope(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="lane-stack">
        <div className="lane-column">
          <div className="lane-header">
            <div>
              <p>Applications</p>
              <h2>Stable launch ports</h2>
            </div>
            <span className="count-pill">{visibleApps.length}</span>
          </div>

          <ul className="launch-list">
            {visibleApps.map((app) => {
              const status = statusById[app.id];
              const isPending = pendingIds.includes(app.id);
              const isRunning = isRunningState(status?.state);
              const statusParts = getStatusParts(status);

              return (
                <li key={app.id} className="launch-item">
                  <article className="launch-row">
                    <div className="row-main">
                      <div className="card-heading">
                        <p>{app.lane}</p>
                        <h3>
                          <a className="app-link" href={app.href} target="_blank" rel="noreferrer">
                            {app.name}
                          </a>
                        </h3>
                      </div>

                      <p className="card-copy">{app.description}</p>
                      <p className="row-summary">
                        <strong>{app.packageName}</strong>
                        <span>{formatAppLocation(app.href)}</span>
                        <a className="inline-link" href={app.href} target="_blank" rel="noreferrer">
                          {app.href}
                        </a>
                      </p>
                    </div>

                    <div className="row-side">
                      <div className="card-actions">
                        {app.canRun ? (
                          <button
                            type="button"
                            className={['row-action-button', isRunning ? 'is-danger' : 'is-success']
                              .join(' ')
                              .trim()}
                            onClick={() => invokeRunnerAction(isRunning ? 'stop' : 'run', app.id)}
                            disabled={runnerAvailability !== 'ready' || isPending}
                          >
                            {isPending
                              ? isRunning
                                ? 'Stopping app...'
                                : 'Starting app...'
                              : isRunning
                                ? 'Stop app'
                                : 'Start app'}
                          </button>
                        ) : (
                          <span className="current-session">Current session</span>
                        )}

                        <a
                          className="row-link-button"
                          href={app.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open
                        </a>
                      </div>
                    </div>

                    {status?.logs.length ? (
                      <pre className="command-log">{status.logs.join('\n')}</pre>
                    ) : null}

                    <p className="status-line">
                      {statusParts.map((part, index) => (
                        <span
                          key={`${app.id}-${part}`}
                          className={
                            index === 0 ? `status-text is-${status?.state ?? 'idle'}` : undefined
                          }
                        >
                          {index > 0 ? ' · ' : ''}
                          {part}
                        </span>
                      ))}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lane-column">
          <div className="lane-header">
            <div>
              <p>Tasks</p>
              <h2>Root command rail</h2>
            </div>
            <span className="count-pill">{visibleTasks.length}</span>
          </div>

          <ul className="launch-list">
            {visibleTasks.map((task) => {
              const status = statusById[task.id];
              const isPending = pendingIds.includes(task.id);
              const isRunning = isRunningState(status?.state);
              const statusParts = getStatusParts(status);

              return (
                <li key={task.id} className="launch-item">
                  <article className="launch-row task-row">
                    <div className="row-main">
                      <div className="card-heading">
                        <p>{task.lane}</p>
                        <h3>{task.name}</h3>
                      </div>

                      <p className="card-copy">{task.description}</p>
                      <p className="row-summary row-command">
                        <strong>Command</strong>
                        <code>{task.command}</code>
                      </p>
                    </div>

                    <div className="row-side">
                      <div className="card-actions">
                        <button
                          type="button"
                          className={['row-action-button', isRunning ? 'is-danger' : 'is-success']
                            .join(' ')
                            .trim()}
                          onClick={() => invokeRunnerAction(isRunning ? 'stop' : 'run', task.id)}
                          disabled={runnerAvailability !== 'ready' || isPending}
                        >
                          {isPending
                            ? isRunning
                              ? 'Stopping task...'
                              : 'Starting task...'
                            : isRunning
                              ? 'Stop task'
                              : 'Start task'}
                        </button>
                      </div>
                    </div>

                    {status?.logs.length ? (
                      <pre className="command-log">{status.logs.join('\n')}</pre>
                    ) : null}

                    <p className="status-line">
                      {statusParts.map((part, index) => (
                        <span
                          key={`${task.id}-${part}`}
                          className={
                            index === 0 ? `status-text is-${status?.state ?? 'idle'}` : undefined
                          }
                        >
                          {index > 0 ? ' · ' : ''}
                          {part}
                        </span>
                      ))}
                    </p>
                  </article>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
