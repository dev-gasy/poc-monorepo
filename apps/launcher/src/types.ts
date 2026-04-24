export type IconName = 'check' | 'copy' | 'external' | 'play' | 'stop' | 'terminal' | 'trash' | 'x';
export type Scope = 'all' | 'apps' | 'tasks';
export type RunnerAvailability = 'checking' | 'ready' | 'unavailable';
export type CommandState = 'idle' | 'running' | 'completed' | 'failed' | 'stopped' | 'stopping';

export interface CommandStatus {
  id: string;
  state: CommandState;
  pid?: number;
  startedAt?: string;
  finishedAt?: string;
  exitCode?: number | null;
  logs: string[];
}

export interface RunnerStatusesResponse {
  statuses: CommandStatus[];
}

export interface RunnerActionResponse {
  error?: string;
  status?: CommandStatus;
}
