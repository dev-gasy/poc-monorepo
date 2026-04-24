import { execFile, spawn, type ChildProcessByStdio } from 'node:child_process';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Readable } from 'node:stream';
import { fileURLToPath, URL } from 'node:url';
import { promisify } from 'node:util';

import type { Plugin } from 'vite';

import { launcherApps, launcherCommandEntries } from './src/data';

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

interface ManagedCommand {
  child?: ChildProcessByStdio<null, Readable, Readable>;
  status: CommandStatus;
}

interface CommandActionPayload {
  id?: string;
}

interface KillPortPayload {
  id?: string;
  port?: number;
}

const maxLogLines = 14;
const workspaceRoot = fileURLToPath(new URL('../../', import.meta.url));
const execFileAsync = promisify(execFile);
const runnableCommands = launcherCommandEntries.filter(
  (entry) => entry.kind === 'task' || launcherApps.some((app) => app.id === entry.id && app.canRun),
);

function createIdleStatus(id: string): CommandStatus {
  return {
    id,
    state: 'idle',
    logs: [],
  };
}

function createManagedCommands(): Map<string, ManagedCommand> {
  return new Map<string, ManagedCommand>(
    launcherCommandEntries.map((entry) => [
      entry.id,
      {
        status:
          entry.id === 'launcher'
            ? {
                id: entry.id,
                state: 'running' as const,
                pid: process.pid,
                startedAt: new Date().toISOString(),
                logs: ['Launcher is running in the current Vite dev session.'],
              }
            : createIdleStatus(entry.id),
      },
    ]),
  );
}

function isRunningState(state: CommandState) {
  return state === 'running' || state === 'stopping';
}

function appendLogs(status: CommandStatus, chunk: Buffer, prefix: 'stdout' | 'stderr') {
  const content = chunk.toString('utf8').split(/\r?\n/).filter(Boolean);

  if (content.length === 0) {
    return;
  }

  status.logs = [...status.logs, ...content.map((line) => `[${prefix}] ${line}`)].slice(
    -maxLogLines,
  );
}

function getSnapshot(status: CommandStatus): CommandStatus {
  return {
    ...status,
    logs: [...status.logs],
  };
}

function getStatusPayload(managedCommands: Map<string, ManagedCommand>) {
  return launcherCommandEntries.map((entry) => {
    const managedCommand = managedCommands.get(entry.id);

    return getSnapshot(managedCommand?.status ?? createIdleStatus(entry.id));
  });
}

function sendJson(response: ServerResponse, statusCode: number, payload: unknown) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.end(JSON.stringify(payload));
}

async function readRequestBody<TPayload extends object>(request: IncomingMessage) {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {} as TPayload;
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as TPayload;
}

function getAppByPortPayload(payload: KillPortPayload) {
  return launcherApps.find((app) => app.id === payload.id || app.port === payload.port);
}

async function getListeningPids(port: number) {
  try {
    const { stdout } = await execFileAsync('lsof', ['-nP', '-ti', `tcp:${port}`, '-sTCP:LISTEN']);

    return stdout
      .split(/\s+/)
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0);
  } catch {
    return [];
  }
}

async function killPort(port: number) {
  const pids = await getListeningPids(port);

  for (const pid of pids) {
    try {
      process.kill(pid, 'SIGTERM');
    } catch {
      // Ignore races where the process exits after lsof but before SIGTERM.
    }
  }

  return pids;
}

export function createLauncherCommandRunnerPlugin(): Plugin {
  const managedCommands = createManagedCommands();

  function getManagedCommand(id: string) {
    const commandEntry = runnableCommands.find((entry) => entry.id === id);

    if (!commandEntry) {
      return null;
    }

    const managedCommand = managedCommands.get(id);

    if (!managedCommand) {
      return null;
    }

    return { commandEntry, managedCommand };
  }

  function stopManagedCommand(id: string) {
    const lookup = getManagedCommand(id);

    if (!lookup) {
      return null;
    }

    const { managedCommand } = lookup;

    if (!managedCommand.child || !isRunningState(managedCommand.status.state)) {
      return getSnapshot(managedCommand.status);
    }

    managedCommand.status.state = 'stopping';
    managedCommand.child.kill('SIGTERM');

    return getSnapshot(managedCommand.status);
  }

  function runManagedCommand(id: string) {
    const lookup = getManagedCommand(id);

    if (!lookup) {
      return null;
    }

    const { commandEntry, managedCommand } = lookup;

    if (managedCommand.child && isRunningState(managedCommand.status.state)) {
      return getSnapshot(managedCommand.status);
    }

    const status: CommandStatus = {
      id,
      state: 'running',
      startedAt: new Date().toISOString(),
      finishedAt: undefined,
      exitCode: undefined,
      logs: [`$ ${commandEntry.command}`],
    };

    const child = spawn('pnpm', commandEntry.commandArgs, {
      cwd: workspaceRoot,
      env: {
        ...process.env,
        FORCE_COLOR: '0',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    managedCommand.child = child;
    managedCommand.status = status;
    managedCommand.status.pid = child.pid;

    child.stdout.on('data', (chunk) => {
      appendLogs(status, chunk, 'stdout');
    });

    child.stderr.on('data', (chunk) => {
      appendLogs(status, chunk, 'stderr');
    });

    child.on('error', (error) => {
      status.state = 'failed';
      status.finishedAt = new Date().toISOString();
      status.logs = [...status.logs, `[error] ${error.message}`].slice(-maxLogLines);
      managedCommand.child = undefined;
    });

    child.on('exit', (exitCode, signal) => {
      status.finishedAt = new Date().toISOString();
      status.exitCode = exitCode;
      status.state =
        signal === 'SIGTERM'
          ? 'stopped'
          : exitCode === 0
            ? commandEntry.commandMode === 'oneshot'
              ? 'completed'
              : 'stopped'
            : 'failed';
      status.logs = [
        ...status.logs,
        signal === 'SIGTERM'
          ? '[system] Process stopped.'
          : `[system] Process exited with code ${exitCode ?? 'unknown'}.`,
      ].slice(-maxLogLines);
      managedCommand.child = undefined;
    });

    return getSnapshot(status);
  }

  return {
    name: 'dgig-launcher-command-runner',
    configureServer(server) {
      const shutdown = () => {
        for (const entry of runnableCommands) {
          stopManagedCommand(entry.id);
        }
      };

      server.httpServer?.once('close', shutdown);

      server.middlewares.use('/__launcher/commands', async (request, response, next) => {
        try {
          if (request.method === 'GET' && request.url === '/') {
            sendJson(response, 200, { statuses: getStatusPayload(managedCommands) });
            return;
          }

          if (request.method === 'POST' && request.url === '/run') {
            const payload = await readRequestBody<CommandActionPayload>(request);

            if (!payload.id) {
              sendJson(response, 400, { error: 'Missing command id.' });
              return;
            }

            const status = runManagedCommand(payload.id);

            if (!status) {
              sendJson(response, 404, { error: `Unknown or unsupported command "${payload.id}".` });
              return;
            }

            sendJson(response, 200, { status });
            return;
          }

          if (request.method === 'POST' && request.url === '/stop') {
            const payload = await readRequestBody<CommandActionPayload>(request);

            if (!payload.id) {
              sendJson(response, 400, { error: 'Missing command id.' });
              return;
            }

            const status = stopManagedCommand(payload.id);

            if (!status) {
              sendJson(response, 404, { error: `Unknown or unsupported command "${payload.id}".` });
              return;
            }

            sendJson(response, 200, { status });
            return;
          }

          if (request.method === 'POST' && request.url === '/kill-port') {
            const payload = await readRequestBody<KillPortPayload>(request);
            const app = getAppByPortPayload(payload);

            if (!app) {
              sendJson(response, 404, { error: 'Unknown app port.' });
              return;
            }

            const pids = await killPort(app.port);
            const managedCommand = managedCommands.get(app.id);

            if (managedCommand) {
              managedCommand.child = undefined;
              managedCommand.status = {
                id: app.id,
                state: pids.length > 0 ? 'stopped' : 'idle',
                finishedAt: new Date().toISOString(),
                logs: [
                  pids.length > 0
                    ? `[system] Killed ${pids.length} process${pids.length === 1 ? '' : 'es'} on port ${app.port}: ${pids.join(', ')}.`
                    : `[system] No listener found on port ${app.port}.`,
                ],
              };
            }

            sendJson(response, 200, {
              killedPids: pids,
              status: getSnapshot(managedCommand?.status ?? createIdleStatus(app.id)),
            });
            return;
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown launcher server error.';
          sendJson(response, 500, { error: message });
          return;
        }

        next();
      });
    },
  };
}
