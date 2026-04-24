import type { ResultAsync } from 'neverthrow';

import type { CommandStatus, LauncherError, RunnerCommandAction } from '@/domain/launcherTypes';

export interface LauncherRunnerGateway {
  fetchCommandStatusList: () => ResultAsync<readonly CommandStatus[], LauncherError>;
  executeCommandAction: (
    action: RunnerCommandAction,
    id: string,
  ) => ResultAsync<CommandStatus, LauncherError>;
  executePortCleanup: (id: string, port: number) => ResultAsync<CommandStatus, LauncherError>;
}
