export type IconName = 'check' | 'copy' | 'external' | 'play' | 'stop' | 'terminal' | 'trash' | 'x';
export type Scope = 'all' | 'apps' | 'tasks';
export type RunnerAvailability = 'checking' | 'ready' | 'unavailable';
export type CommandState = 'idle' | 'running' | 'completed' | 'failed' | 'stopped' | 'stopping';
export type RunnerCommandAction = 'run' | 'stop';

export interface LauncherError {
  readonly message: string;
}

export interface CommandStatus {
  readonly id: string;
  readonly state: CommandState;
  readonly pid?: number;
  readonly startedAt?: string;
  readonly finishedAt?: string;
  readonly exitCode?: number | null;
  readonly logs: readonly string[];
}

export interface RunnerStatusesResponse {
  readonly statuses: readonly CommandStatus[];
}

export interface RunnerActionResponse {
  readonly error?: string;
  readonly status?: CommandStatus;
}
